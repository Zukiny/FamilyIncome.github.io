let incomeData = {};
let barChart, pieChart;

function processCSV() {
    const fileInput = document.getElementById("csvFileInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a CSV file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const lines = event.target.result.split("\n").map(line => line.trim());
        const header = lines[0].split(",");

        const incomeIndex = header.indexOf("Family_Income_Level");
        if (incomeIndex === -1) {
            alert("Family_Income_Level column not found.");
            return;
        }

        incomeData = {};
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",");
            if (values.length > incomeIndex) {
                const incomeLevel = values[incomeIndex].trim();
                if (incomeLevel) {
                    incomeData[incomeLevel] = (incomeData[incomeLevel] || 0) + 1;
                }
            }
        }
        generateCharts();
    };
    reader.readAsText(file);
}

function generateCharts() {
    const labels = Object.keys(incomeData);
    const data = Object.values(incomeData);

    if (barChart) barChart.destroy();
    if (pieChart) pieChart.destroy();

    // Bar Chart (Larger)
    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Number of Students",
                data: data,
                backgroundColor: "blue"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Pie Chart (Smaller)
    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ["red", "blue", "green", "yellow", "purple"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function exportData() {
    const choice = prompt("Choose an option:\n1 - Download Bar Chart (PNG)\n2 - Download Pie Chart (PNG)\n3 - Download CSV File");

    switch (choice) {
        case "1":
            downloadChart(barChart, "Bar_Chart.png");
            break;
        case "2":
            downloadChart(pieChart, "Pie_Chart.png");
            break;
        case "3":
            exportCSV();
            break;
        default:
            alert("Invalid choice. Please enter 1, 2, or 3.");
    }
}

function downloadChart(chart, filename) {
    const link = document.createElement("a");
    link.href = chart.toBase64Image();
    link.download = filename;
    link.click();
}

function exportCSV() {
    let csvContent = "Family_Income_Level,Count\n";
    for (const [key, value] of Object.entries(incomeData)) {
        csvContent += `${key},${value}\n`;
    }

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Processed_Family_Income_Data.csv";
    link.click();
}
