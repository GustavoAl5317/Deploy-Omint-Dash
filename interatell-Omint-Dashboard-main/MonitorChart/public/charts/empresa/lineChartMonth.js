document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('lineChart-month').getContext('2d');
    const myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateDayLabels(),
            datasets: []
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Dia do Mês'
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

    function generateDayLabels() {
        const labels = [];
        const currentDate = new Date();
        const currentDay = currentDate.getDate();

        for (let i = 1; i <= currentDay; i++) {
            labels.push(`${i}`);
        }

        return labels;
    }

    function generateInitialData() {
        const data = [];
        const currentMonthDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(); // número de dias no mês atual

        for (let i = 0; i < currentMonthDays; i++) {
            data.push(0); // Inicializa todos os valores como 0
        }
        return data;
    }

    function fetchDataFromRoute() {
        fetch('http://10.175.15.27:3000/querymonth')
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

    async function updateChartWithData(jsonData) {
        const currentDay = new Date().getDate();
        const datasets = {};
        const csqnameToDisplay = "Empresa"; // Defina o csqname que você deseja exibir
    
        // Filtra os dados apenas para o csqname desejado
        const filteredData = jsonData.filter(entry => entry.csqname === csqnameToDisplay);
    
        filteredData.forEach(entry => {
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
            const day = parseInt(entry.day);
            if (day <= currentDay) {
                datasets[csqname].data[day - 1] += entry.offered; // Ajusta o índice para corresponder ao índice do array (que começa em 0)
            }
        });
    
        myLineChart.data.datasets = Object.values(datasets);
        myLineChart.update();
    }
    

    fetchDataFromRoute(); // Chamada inicial

    setInterval(fetchDataFromRoute, 20000); // Atualiza a cada 60 segundos
});
