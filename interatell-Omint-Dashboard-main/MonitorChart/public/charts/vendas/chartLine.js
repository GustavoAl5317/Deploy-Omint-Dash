document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateHourLabels(),
            datasets: [{
                label: 'Vendas',
                data: generateInitialData(),
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Período do Dia'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Número de Ligações'
                    }
                }
            }
        }
    });

    function generateHourLabels() {
        const labels = [];
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        for (let i = 0; i <= currentHour; i++) {
            labels.push(`${i < 10 ? '0' + i : i}:00`);
        }

        return labels;
    }

    function generateInitialData() {
        const data = [];
        for (let i = 0; i < 24; i++) {
            data.push(0); // Inicializa todos os valores como 0
        }
        return data;
    }

    function fetchDataFromRoute() {
        fetch('http://10.175.15.27:3000/querytime')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados da rota');
                }
                return response.json();
            })
            .then(data => {
                updateChartWithData(data);
            })
            .catch(error => {
                console.error('Erro ao buscar dados da rota:', error);
            });
    }

    function updateChartWithData(jsonData) {
        const dataMap = generateInitialData(); // Inicialmente, todos os valores são 0
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        jsonData.forEach(entry => {
            if (entry.csqname === 'Vendas') {
                const hour = parseInt(entry.intervalo.split(':')[0]);
                if (hour <= currentHour) {
                    dataMap[hour] = entry.offered;
                }
            }
        });

        myLineChart.data.datasets[0].data = dataMap;
        myLineChart.update();
    }

    fetchDataFromRoute(); // Chamada inicial

    setInterval(fetchDataFromRoute, 5000); // Atualiza a cada 5 segundos
});
