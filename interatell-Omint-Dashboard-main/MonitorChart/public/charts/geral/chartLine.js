document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('lineChart').getContext('2d');
    const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateHourLabels(),
            datasets: []
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

    const colors = {
        "Empresa": 'rgb(242, 8, 8)',
        "Emergencia": 'rgb(136, 230, 17)',
        "VIP": 'rgb(54, 162, 235)',
        "Rechamada": 'rgb(255, 159, 64)',
        "Cliente_nao_Identificado": 'rgb(75, 192, 192)',
        "Associados": 'rgb(153, 102, 255)',
        "Vendas": 'rgb(255, 205, 86)',
        "Prestador": 'rgb(201, 203, 207)'
    };

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
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        const datasets = {};

        jsonData.forEach(entry => {
            const csqname = entry.csqname;
            if (!datasets[csqname]) {
                datasets[csqname] = {
                    label: csqname,
                    data: generateInitialData(),
                    borderColor: colors[csqname] || 'rgb(201, 203, 207)', // Use a cor padrão se não estiver definida
                    borderWidth: 2,
                    fill: false
                };
            }
            const hour = parseInt(entry.intervalo.split(':')[0]);
            if (hour <= currentHour) {
                datasets[csqname].data[hour] = entry.offered;
            }
        });

        myLineChart.data.datasets = Object.values(datasets);
        myLineChart.update();
    }

    fetchDataFromRoute(); // Chamada inicial

    setInterval(fetchDataFromRoute, 60000); // Atualiza a cada 60 segundos
});
