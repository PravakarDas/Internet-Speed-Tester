let intervalId = null;

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
    intervalId = setInterval(fetchStatus, 1000);
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
        }
    });
}

function stopTest() {
    fetch("/stop_test").then(() => clearInterval(intervalId));
}

function downloadResults() {
    window.location.href = "/download";
}

function resetChart() {
    combinedChart.data.labels = [];
    combinedChart.data.datasets.forEach(dataset => dataset.data = []);
}