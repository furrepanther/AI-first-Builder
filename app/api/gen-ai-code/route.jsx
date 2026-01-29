import openai, { codeGenConfig, codeGenSystemMessage } from '@/configs/AiModel';
import Prompt from '@/data/Prompt';

export async function POST(req) {
    const {prompt} = await req.json();
    try {
        const stream = await openai.chat.completions.create({
            ...codeGenConfig,
            messages: [
                { role: "system", content: Prompt.CODE_GEN_PROMPT },
                { role: "user", content: prompt }
            ],
            stream: true,
        });

        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    let fullText = '';
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            fullText += content;
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({chunk: content})}\n\n`));
                        }
                    }
                    // Send final complete response
                    try {
                        const parsedData = JSON.parse(fullText);
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({final: parsedData, done: true})}\n\n`));
                    } catch (e) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({error: 'Invalid JSON response', done: true})}\n\n`));
                    }
                    controller.close();
                } catch (e) {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({error: e.message || 'Code generation failed'})}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch(e) {
        return new Response(JSON.stringify({error: e.message || 'Code generation failed'}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
