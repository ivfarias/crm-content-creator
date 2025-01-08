import { sql } from '@vercel/postgres';

export async function getStoredPrompt(): Promise<string> {
    try {
        const { rows } = await sql`SELECT prompt FROM ai_prompt ORDER BY id DESC LIMIT 1`;
        return rows[0]?.prompt || 'Please provide a detailed summary of the following article:';
    } catch (error) {
        console.error('Error reading AI prompt:', error);
        return 'Please provide a detailed summary of the following article:';
    }
}

export async function setStoredPrompt(prompt: string): Promise<void> {
    try {
        await sql`
      INSERT INTO ai_prompt (prompt)
      VALUES (${prompt})
      ON CONFLICT (id) DO UPDATE
      SET prompt = EXCLUDED.prompt
      WHERE ai_prompt.id = (SELECT id FROM ai_prompt ORDER BY id DESC LIMIT 1)
    `;
    } catch (error) {
        console.error('Error saving AI prompt:', error);
        throw error;
    }
}

