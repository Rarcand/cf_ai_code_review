export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
          return new Response(null, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          });
        }

        // Handle the actual POST request
        if (request.method === 'POST') {
            try {
                const { code, language } = await request.json();

                if (!code || !language) {
                    throw new Error('Missing code or language in request body');
                }

                const aiResponse = await runAIAnalysis(env, code, language);

                ctx.waitUntil(saveToKV(env, { code, language, analysis: aiResponse.response }));

                // Return the SUCCESS response
                return new Response(JSON.stringify({ analysis: aiResponse.response }), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                });

            } catch (e) {
                // ============================================================
                // NEW: Log the actual error to the console
                // ============================================================
                console.error(e);

                // Return the ERROR response
                return new Response(`Error: ${e.message}`, {
                    status: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                });
            }
        }

        return new Response('Method not allowed', { status: 405 });
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
    const id = crypto.randomUUID();
    const key = `review:${new Date().toISOString()}:${id}`;

    await env.REVIEWS_KV.put(key, JSON.stringify(data));
}