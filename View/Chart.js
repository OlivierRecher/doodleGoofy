function drawChart() {
    let chartElement = document.getElementById('chart')

    if(chartElement){ 
        google.charts.load("current", { "packages": ["corechart"], "language": "fr" })
        google.charts.setOnLoadCallback(function() {
            if(!element || result.length === 0) return null

            let columns = ["Count", "Average"]

            let dataArray = [[...columns]]
            for (let i = 0; i < result.length; i++) {
                dataArray.push([i+1, result[i]])
            }

            var data = google.visualization.arrayToDataTable(dataArray);

            var options = {
                title: "Doodle performances",
                curveType: 'function',
                legend: { position: 'bottom' },
                tooltip: {
                    textStyle: {
                    color: '#333', // Couleur du texte
                    fontSize: 14,  // Taille de la police
                    },
                    isHtml: true, // Active les tooltips personnalisés en HTML
                },
            };

            let columnchart = new google.visualization.LineChart(element)
            columnchart.draw(data, options)
        })
    }
}

export {drawChart}