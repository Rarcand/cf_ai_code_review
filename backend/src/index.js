export default {
    async fetch(request, env, ctx) {
        // Only allow POST requests for the API endpoint
        if (request.method !== 'POST') {
            return new Response('Expected POST request', { status: 405 });
        }

        try {
            const { code, language } = await request.json();

            if (!code || !language) {
                return new Response('Missing code or language in request body', { status: 400 });
            }
            
            // Call the AI model for analysis
            const aiResponse = await runAIAnalysis(env, code, language);
            
            // Save the result to KV without making the user wait
            ctx.waitUntil(saveToKV(env, { code, language, analysis: aiResponse.response }));

            // Return the AI's analysis to the frontend
            return new Response(JSON.stringify({ analysis: aiResponse.response }), {
                headers: { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*' // Allows your frontend to call this worker
                },
            });

        } catch (e) {
            return new Response(`Error processing request: ${e.message}`, { status: 500 });
        }
    },
};

async function runAIAnalysis(env, code, language) {
    const messages = [
        { 
            role: 'system', 
            content: `You are an expert code reviewer. Your task is to analyze the user's code for bugs, style issues, and performance improvements. Provide a concise, helpful review formatted in plain text or Markdown.`
        },
        {
            role: 'user',
            content: `Please review the following ${language} code:\n\n\`\`\`\n${code}\n\`\`\``
        }
    ];

    const response = await env.AI.run(
        '@cf/meta/llama-3-8b-instruct', 
        { messages }
    );

    return response;
}

async function saveToKV(env, data) {
    // Generate a unique key using a timestamp and a random ID
    const id = crypto.randomUUID();
    const key = `review:${new Date().toISOString()}:${id}`;
    
    // Save the data to the KV namespace
    await env.REVIEWS_KV.put(key, JSON.stringify(data));
}