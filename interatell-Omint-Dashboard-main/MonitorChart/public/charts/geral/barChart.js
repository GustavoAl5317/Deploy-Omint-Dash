async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Função para calcular as somas e criar o gráfico
async function createChart() {
    // URL para consulta
    const url = 'http://10.175.15.27:3000/query';
    
    // Buscando os dados
    const data = await fetchData(url);
    
    // Variáveis para armazenar as somas
    let totalTalktime = 0;
    let totalHoldtime = 0;
    let totalRingtime = 0;
  
    // Iterando sobre os dados para calcular as somas
    data.forEach(obj => {
      totalTalktime += obj.talktime;
      totalHoldtime += obj.holdtime;
      totalRingtime += obj.ringtime;
    });
  
    // Criando o gráfico de pizza
    const ctx = document.getElementById('myChartMonth');
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Talktime', 'Ringtime', 'Holdtime'],
        datasets: [
          {
            label: 'Tempo Total',
            data: [totalTalktime, totalHoldtime, totalRingtime],
            backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1
          }
        ]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Comparação entre Talktime, Holdtime e Ringtime (Totais)'
          }
        }
      }
    });
  }
  
  // Chamando a função para criar o gráfico
  createChart();
