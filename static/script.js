let intervalId = null;
let testRunning = false;

const startStopBtn = document.getElementById("startStopBtn");
const downloadCsvBtn = document.getElementById("downloadCsvBtn");
const generatePdfBtn = document.getElementById("generatePdfBtn");
const resetBtn = document.getElementById("resetBtn");

const combinedChart = new Chart(document.getElementById('combinedChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Download (Mbps)',
                data: [],
                borderColor: 'green',
                fill: false,
                tension: 0.3
            },
            {
                label: 'Upload (Mbps)',
                data: [],
                borderColor: 'blue',
                fill: false,
                tension: 0.3
            },
            {
                label: 'Ping (ms)',
                data: [],
                borderColor: 'red',
                fill: false,
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Timestamp'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Value'
                }
            }
        }
    }
});

function toggleTest() {
    if (!testRunning) {
        startTest();
    } else {
        stopTest();
    }
}

function startTest() {
    const duration = document.getElementById("duration").value;
    const frequency = document.getElementById("frequency").value;

    fetch("/start_test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duration: duration, frequency: frequency })
    }).then(() => {
        clearInterval(intervalId);
        document.getElementById("progress").innerText = "0%";
        document.getElementById("elapsed").innerText = "0s";
        document.getElementById("resultTable").innerHTML = "";
        resetChart();

        testRunning = true;
        startStopBtn.innerText = "🛑 Stop Test";
        intervalId = setInterval(fetchStatus, 1000);

        // Hide export buttons while test is running
        downloadCsvBtn.style.display = "none";
        generatePdfBtn.style.display = "none";
    });
}

function stopTest() {
    fetch("/stop_test").then(() => {
        clearInterval(intervalId);
        testRunning = false;
        startStopBtn.innerText = "🚀 Start Test";
    });
}

function fetchStatus() {
    fetch("/get_status")
        .then(response => response.json())
        .then(data => {
            document.getElementById("progress").innerText = data.progress + "%";
            document.getElementById("elapsed").innerText = data.elapsed_time + "s";

            const table = document.getElementById("resultTable");
            table.innerHTML = "";
            resetChart();

            data.data.forEach(entry => {
                const row = `<tr>
                                <td>${entry.timestamp}</td>
                                <td>${entry.download}</td>
                                <td>${entry.upload}</td>
                                <td>${entry.ping}</td>
                                <td>${entry.ip}</td>
                            </tr>`;
                table.innerHTML += row;

                if (entry.download !== "Error") {
                    combinedChart.data.labels.push(entry.timestamp);
                    combinedChart.data.datasets[0].data.push(entry.download);
                    combinedChart.data.datasets[1].data.push(entry.upload);
                    combinedChart.data.datasets[2].data.push(entry.ping);
                }
            });

            combinedChart.update();

            if (data.status === "completed") {
                clearInterval(intervalId);
                startStopBtn.innerText = "▶️ Start Test";
                isTestRunning = false;
                document.getElementById("resultButtons").style.display = "block"; // <== Buttons appear here
              }
              
        });
}

function resetChart() {
    combinedChart.data.labels = [];
    combinedChart.data.datasets.forEach(dataset => dataset.data = []);
}

function downloadResults() {
    window.location.href = "/download";
}

function generatePDF() {
    window.location.href = "/generate_pdf";
}

function resetPage() {
    location.reload();
}

// Event listener bindings
startStopBtn.addEventListener("click", toggleTest);
resetBtn.addEventListener("click", resetPage);
downloadCsvBtn.addEventListener("click", downloadResults);
generatePdfBtn.addEventListener("click", generatePDF);

// Initially hide export buttons
window.onload = () => {
    downloadCsvBtn.style.display = "none";
    generatePdfBtn.style.display = "none";
};
