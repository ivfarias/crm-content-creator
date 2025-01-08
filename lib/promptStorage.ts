import fs from 'fs/promises';
import path from 'path';

const promptFilePath = path.join(process.cwd(), 'ai-prompt.txt');

export async function getStoredPrompt(): Promise<string> {
    try {
        const prompt = await fs.readFile(promptFilePath, 'utf-8');
        return prompt.trim();
    } catch (error) {
        console.error('Error reading AI prompt:', error);
        return 'Please provide a detailed summary of the following article:';
    }
}

export async function setStoredPrompt(prompt: string): Promise<void> {
    try {
        await fs.writeFile(promptFilePath, prompt);
    } catch (error) {
        console.error('Error saving AI prompt:', error);
        throw error;
    }
}

