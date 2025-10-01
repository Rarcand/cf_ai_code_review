const analyzeBtn = document.getElementById('analyze-btn');
const codeInput = document.getElementById('code-input');
const languageSelect = document.getElementById('language-select');
const reviewOutput = document.getElementById('review-output');

// IMPORTANT: Replace this with your actual Cloudflare Worker URL after you deploy it
const WORKER_URL = 'https://your-worker-name.your-subdomain.workers.dev';

analyzeBtn.addEventListener('click', async () => {
    const code = codeInput.value;
    const language = languageSelect.value;

    if (!code) {
        alert('Please enter some code to analyze.');
        return;
    }

    reviewOutput.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;

    try {
        const response = await fetch(WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });

        if (!response.ok) {
            throw new Error(`Worker responded with status: ${response.status}`);
        }

        const result = await response.json();
        // The AI response is expected to be in Markdown format for nice formatting
        reviewOutput.textContent = result.analysis;

    } catch (error) {
        reviewOutput.textContent = `Error: ${error.message}`;
    } finally {
        analyzeBtn.disabled = false;
    }
});