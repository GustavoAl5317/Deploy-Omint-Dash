// Função para buscar dados da API
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Função para converter segundos em formato de horas, minutos e segundos
function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}h ${minutes}min ${remainingSeconds}s`;
}

// Função para calcular as somas e criar o gráfico de pizza para os Cliente_nao_Identificado
async function createChart() {
    // URL para consulta
    const url = 'http://10.175.15.27:3000/query';

    // Função para atualizar os dados e o gráfico
    async function updateChart() {
        const data = await fetchData(url);
        const Cliente_nao_IdentificadoData = data.filter(obj => obj.csqname === 'Cliente_nao_Identificado');

        let totalConversa = 0;
        let totalRingando = 0;
        let totalEspera = 0;

        Cliente_nao_IdentificadoData.forEach(obj => {
            totalConversa += obj.talktime;
            totalRingando += obj.ringtime;
            totalEspera += obj.holdtime;
        });

        const ctx = document.getElementById('myChartMonth').getContext('2d');
        myChart.data.datasets[0].data = [totalConversa, totalRingando, totalEspera];
        myChart.update();
    }

    // Criando o gráfico inicial
    const data = await fetchData(url);
    const Cliente_nao_IdentificadoData = data.filter(obj => obj.csqname === 'Cliente_nao_Identificado');

    let totalConversa = 0;
    let totalRingando = 0;
    let totalEspera = 0;

    Cliente_nao_IdentificadoData.forEach(obj => {
        totalConversa += obj.talktime;
        totalRingando += obj.ringtime;
        totalEspera += obj.holdtime;
    });

    const ctx = document.getElementById('myChartMonth').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Talktime', 'Ringtime', 'Holdtime'],
            datasets: [{
                label: 'Total',
                data: [totalConversa, totalRingando, totalEspera],
                backgroundColor: ['rgba(255, 99, 132)', 'rgba(54, 162, 235)', 'rgba(255, 206, 86)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Comparação entre Talktime, Holdtime e Ringtime  - Cliente_nao_Identificado'
                }
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        return formatSeconds(value);
                    }
                }
            }
        }
    });

    // Iniciar o polling para atualização automática
    setInterval(updateChart, 2000); // Atualiza a cada 2 segundos
}

// Chamando a função para criar o gráfico
createChart();
