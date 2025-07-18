const fileInput = document.getElementById('fileInput');
const label = document.querySelector('.custom-file-label');

fileInput.addEventListener('change', function () {
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Choose File';
    label.textContent = fileName;
});

function scanVideo() {
    const videoUrl = document.getElementById('videoUrlInput').value;
    const file = fileInput.files[0];

    if (videoUrl) {

        scanByUrl(videoUrl);
    } else if (file) {
   
        scanByFile(file);
    } else {
        console.error("Please enter a video URL or upload a file.");
    }
}

function scanByUrl(videoUrl) {
    fetch(`http://localhost:8080/deepfake-check?videoUrl=${encodeURIComponent(videoUrl)}`)
        .then(response => response.json())
        .then(data => {
            console.log("Scan Response:", data);
            const reportId = data["report-id"];
            if (!reportId) {
                console.error("Could not get the report ID from the scan response");
                return;
            }
            return fetch(`http://localhost:8080/deepfake-report?reportId=${encodeURIComponent(reportId)}`);
        })
        .then(response => response.json())
        .then(reportData => {
            console.log("Report Response:", reportData);
            displayReport(reportData);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function scanByFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8080/deepfake-upload', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.text().then(text => {
                    throw new Error(`Unexpected response: ${text}`);
                });
            }
        })
        .then(data => {
            console.log("Scan Response:", data);
            const reportId = data["report-id"];
            if (!reportId) {
                console.error("Could not get the report ID from the scan response");
                return;
            }
           
            return fetch(`http://localhost:8080/deepfake-report?reportId=${encodeURIComponent(reportId)}`);
        })
        .then(response => response.json())
        .then(reportData => {
            console.log("Report Response:", reportData);
            displayReportFile(reportData);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function displayReport(reportData) {
    const analystScore = reportData.results.analyst.score;

    document.getElementById('analyst-score').innerText = analystScore;

    if (analystScore > 50) {
        document.getElementById('detection-status').innerText = "DEEPFAKE DETECTED";
    } else {
        document.getElementById('detection-status').innerText = "NO DEEPFAKE DETECTED";
    }

    document.getElementById('video-name').innerText = reportData.names[0] || "Unknown";
    document.getElementById('video-type').innerText = reportData.type || "Unknown";
    document.getElementById('video-size').innerText = (reportData.size / (1024 * 1024)).toFixed(2) + " MB"; 
    document.getElementById('video-id').innerText = reportData["video-id"] || "Unknown";
    document.getElementById('report-id').innerText = reportData["report-id"] || "Unknown";

    document.getElementById('scan-mid').style.display = 'none';
    document.getElementById('result-container').style.display = 'flex';
}

function displayReportFile(reportData) {
    const results = reportData.results;
    const scoreSum = Object.values(results).reduce((sum, result) => sum + result.score, 0);
    const avgScore = (scoreSum / Object.keys(results).length).toFixed(2);

    document.getElementById('analyst-score').innerText = avgScore;

    if (avgScore > 50) { 
        document.getElementById('detection-status').innerText = "NO DEEPFAKE DETECTED";
    } else {
        document.getElementById('detection-status').innerText = "DEEPFAKE DETECTED";
    }

    document.getElementById('video-name').innerText = reportData.names[0] || "Unknown";
    document.getElementById('video-type').innerText = reportData.type || "Unknown";
    document.getElementById('video-size').innerText = (reportData.size / (1024 * 1024)).toFixed(2) + " MB";
    document.getElementById('video-id').innerText = reportData["video-id"] || "Unknown";
    document.getElementById('report-id').innerText = reportData["report-id"] || "Unknown";

    document.getElementById('scan-mid').style.display = 'none';
    document.getElementById('result-container').style.display = 'flex';
}
