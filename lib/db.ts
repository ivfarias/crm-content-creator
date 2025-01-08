import { sql } from '@vercel/postgres';

export interface RSSFeed {
  id: number;
  url: string;
}

export interface Summary {
  id: number;
  title: string;
  link: string;
  summary: string;
}

export async function initDB() {
  try {
    // Create rss_feeds table
    await sql`
      CREATE TABLE IF NOT EXISTS rss_feeds (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL UNIQUE
      )
    `;

    // Create summaries table
    await sql`
      CREATE TABLE IF NOT EXISTS summaries (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        link TEXT NOT NULL UNIQUE,
        summary TEXT NOT NULL
      )
    `;

    // Create ai_prompt table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_prompt (
        id SERIAL PRIMARY KEY,
        prompt TEXT NOT NULL
      )
    `;

    // Check if ai_prompt table is empty
    const { rowCount } = await sql`SELECT * FROM ai_prompt LIMIT 1`;
    if (rowCount === 0) {
      // Insert the default prompt only if the table is empty
      await sql`INSERT INTO ai_prompt (prompt) VALUES (${'Please provide a detailed summary of the following article:'})`;
      console.log('Default AI prompt inserted.');
    } else {
      console.log('AI prompt table already contains entries.');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getRSSFeeds(): Promise<RSSFeed[]> {
  const { rows } = await sql<RSSFeed>`SELECT * FROM rss_feeds`;
  return rows;
}

export async function addRSSFeed(url: string) {
  await sql`INSERT INTO rss_feeds (url) VALUES (${url}) ON CONFLICT (url) DO NOTHING`;
}

export async function deleteRSSFeed(id: number) {
  await sql`DELETE FROM rss_feeds WHERE id = ${id}`;
}

export async function setAIPrompt(prompt: string): Promise<void> {
  try {
    // Update the most recent prompt or insert a new one if none exists
    await sql`
      INSERT INTO ai_prompt (prompt)
      VALUES (${prompt})
      ON CONFLICT (id) DO UPDATE
      SET prompt = EXCLUDED.prompt
      WHERE ai_prompt.id = (SELECT id FROM ai_prompt ORDER BY id DESC LIMIT 1)
    `;
    console.log('AI prompt updated successfully');
  } catch (error) {
    console.error('Error saving AI prompt:', error);
    throw error;
  }
}

export async function getAIPrompt(): Promise<string> {
  try {
    const { rows } = await sql`SELECT prompt FROM ai_prompt ORDER BY id DESC LIMIT 1`;
    const prompt = rows[0]?.prompt || 'Please provide a detailed summary of the following article:';
    console.log('Retrieved AI prompt:', prompt);
    return prompt;
  } catch (error) {
    console.error('Error reading AI prompt:', error);
    return 'Please provide a detailed summary of the following article:';
  }
}

export async function getSummaries(): Promise<Summary[]> {
  const { rows } = await sql<Summary>`SELECT * FROM summaries ORDER BY id DESC`;
  return rows;
}

export async function addSummary(title: string, link: string, summary: string) {
  await sql`INSERT INTO summaries (title, link, summary) VALUES (${title}, ${link}, ${summary}) ON CONFLICT (link) DO NOTHING`;
}

export async function deleteSummary(id: number) {
  await sql`DELETE FROM summaries WHERE id = ${id}`;
}

