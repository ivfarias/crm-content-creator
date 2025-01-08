import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import OpenAI from 'openai'
import { getRSSFeeds, addSummary } from '../../../lib/db'
import { getStoredPrompt } from '../../../lib/promptStorage'
import axios from 'axios'
import * as cheerio from 'cheerio'

const parser = new Parser({
  customFields: {
    item: ['title', 'description', 'link', 'pubDate']
  }
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const MAX_TOKENS = 500
const MAX_RETRIES = 5
const RETRY_DELAY = 5000 // 5 seconds
const FETCH_TIMEOUT = 60000 // 60 seconds

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: FETCH_TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if ((error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') && retries > 0) {
        console.log(`Network error fetching ${url}. Retrying... (${retries} attempts left)`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
        return fetchWithRetry(url, retries - 1)
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error(`HTTP error ${error.response.status} for ${url}: ${error.response.statusText}`)
      } else if (error.request) {
        // The request was made but no response was received
        console.error(`No response received for ${url}: ${error.message}`)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error(`Error setting up request for ${url}: ${error.message}`)
      }
    }
    throw error
  }
}

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const html = await fetchWithRetry(url)
    const $ = cheerio.load(html)

    $('script, style, comment').remove()
    const content = $('body').text()
    return content.replace(/\s+/g, ' ').trim()
  } catch (error) {
    console.error(`Error fetching article content from ${url}:`, error)
    return ''
  }
}

async function getAIPrompt(): Promise<string> {
  try {
    const prompt = await getStoredPrompt();
    console.log('Fetched AI prompt:', prompt);
    return prompt;
  } catch (error) {
    console.error('Error fetching AI prompt:', error);
    return 'Please provide a detailed summary of the following article:';
  }
}

function cleanHtmlContent(content: string): string {
  const $ = cheerio.load(content)
  return $.text().trim()
}

async function processFeed(feed: { url: string }, aiPrompt: string, maxArticles: number): Promise<Array<{ title: string; link: string; summary: string }>> {
  console.log(`Processing feed: ${feed.url}`)
  try {
    const feedContent = await fetchWithRetry(feed.url)
    const parsedFeed = await parser.parseString(feedContent)

    const newSummaries = []
    let processedArticles = 0

    for (const item of parsedFeed.items) {
      if (processedArticles >= maxArticles) {
        console.log(`Reached max articles (${maxArticles}) for feed: ${feed.url}`)
        break
      }

      console.log('Processing item:', item.title)

      if (!item.link) {
        console.log('Skipping item without link:', item.title)
        continue
      }

      const articleContent = await fetchArticleContent(item.link)

      if (!articleContent) {
        console.log('Skipping item with no content:', item.title)
        continue
      }

      const cleanTitle = cleanHtmlContent(item.title || '')
      const cleanContent = cleanHtmlContent(articleContent)

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant that summarizes articles." },
          {
            role: "user", content: `${aiPrompt}

Title: ${cleanTitle}
Content: ${cleanContent}`
          }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
      })

      const summary = response.choices[0].message.content?.trim()

      if (summary) {
        await addSummary(cleanTitle || 'Untitled', item.link, summary)
        newSummaries.push({
          title: cleanTitle,
          link: item.link,
          summary,
        })
        console.log('Summary added for:', cleanTitle)
        processedArticles++
      }
    }

    return newSummaries
  } catch (error) {
    console.error(`Error processing feed ${feed.url}:`, error)
    return []
  }
}

export async function POST(request: Request) {
  try {
    const { maxArticles } = await request.json()
    const feeds = await getRSSFeeds()
    const aiPrompt = await getAIPrompt()
    console.log('Using AI Prompt in feed processing:', aiPrompt)

    const newSummaries = []

    for (const feed of feeds) {
      const feedSummaries = await processFeed(feed, aiPrompt, maxArticles)
      newSummaries.push(...feedSummaries)
    }

    return NextResponse.json({ message: 'RSS feeds processed successfully', newSummaries })
  } catch (error) {
    console.error('Error processing RSS feeds:', error)
    return NextResponse.json({ error: 'Failed to process RSS feeds' }, { status: 500 })
  }
}

