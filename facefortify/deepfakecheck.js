// Import node-fetch dynamically
(async () => {
    const { default: fetch } = await import('node-fetch');

    const apiKey = '421b3bbc-2dd2-46b3-8469-50a65441715f'; // Replace with your actual API key
    const baseUrl = 'https://api.deepware.ai/api/v1'; // Base URL for the Deepware API

    // Function to start a scan process
    async function startScan(videoUrl) {
        try {
            const response = await fetch(`${baseUrl}/url/scan?video-url=${encodeURIComponent(videoUrl)}`, {
                method: 'GET', // Ensure the method is GET
                headers: {
                    'X-Deepware-Authentication': apiKey,
                    'Accept': 'application/json' // Ensure the Accept header is set
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Scan started. Report ID:', data['report-id']);
            return data['report-id'];
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // Function to check the status of the scan
    async function checkStatus(reportId) {
        try {
            const response = await fetch(`${baseUrl}/report/${reportId}`, {
                method: 'GET', // Ensure the method is GET
                headers: {
                    'X-Deepware-Authentication': apiKey
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            if (data.complete) {
                console.log('Scan complete. Results:', data.results);
            } else {
                console.log('Scan not complete yet. Please check again later.');
            }
            return data;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    // Example usage
    const videoUrl = 'https://www.youtube.com/watch?v=XuKUkyPegBE'; // Replace with the actual video URL
    const reportId = await startScan(videoUrl);

    if (reportId) {
        // Wait for some time before checking the status (e.g., 30 seconds)
        setTimeout(async () => {
            await checkStatus(reportId);
        }, 30000); // 30 seconds
    }
})();
