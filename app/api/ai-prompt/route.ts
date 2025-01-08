import { NextResponse } from 'next/server';
import { getStoredPrompt, setStoredPrompt } from '../../../lib/promptStorage';

export async function GET() {
    const prompt = await getStoredPrompt();
    return NextResponse.json({ prompt });
}

export async function POST(request: Request) {
    const { prompt } = await request.json();
    if (typeof prompt === 'string' && prompt.trim()) {
        await setStoredPrompt(prompt.trim());
        console.log('AI prompt updated:', prompt.trim());
        return NextResponse.json({ success: true, prompt: prompt.trim() });
    }
    return NextResponse.json({ success: false, error: 'Invalid prompt' }, { status: 400 });
}

