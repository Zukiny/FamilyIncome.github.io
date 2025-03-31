let incomeData = {};

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

    // Bar Chart
    new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{ label: "Students", data: data, backgroundColor: "blue" }]
        },
        options: { responsive: true }
    });

    // Pie Chart
    new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{ data: data, backgroundColor: ["red", "blue", "green", "yellow", "purple"] }]
        },
        options: { responsive: true }
    });
}

function exportProcessedCSV() {
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
