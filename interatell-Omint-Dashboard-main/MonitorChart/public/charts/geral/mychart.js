const colors = ['rgb(136, 230, 17)', 'rgb(242, 8, 8)', 'rgb(54, 162, 235)', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 205, 86)', 'rgb(201, 203, 207)']; // Array de cores pré-definidas

const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Handled',
      backgroundColor: [],
      data: [],
    }]
  },
  options: {
    responsive: true,
    plugins: {
      labels: {
        render: 'value',
        fontColor: '#000',
        precision: 0
      }
    },
    title: { // Adiciona o título ao gráfico
      display: true, // Exibe o título
      text: 'Chamadas Atendidas', // Texto do título
      fontColor: '#8142ff', // Cor do texto do título
      fontSize: 18, // Tamanho da fonte do título
      fontStyle: 'bold' // Estilo da fonte do título
    }
  }
});

const updateChart = (data) => {
  // Limpar dados antigos
  myChart.data.labels = [];
  myChart.data.datasets[0].data = [];
  myChart.data.datasets[0].backgroundColor = [];

  // Adicionar dados de todas as empresas
  data.forEach((entry, index) => {
    myChart.data.labels.push(entry.csqname);
    myChart.data.datasets[0].data.push(entry.handled);
    // Usar uma cor diferente para cada empresa com base na posição no array de cores
    myChart.data.datasets[0].backgroundColor.push(colors[index % colors.length]);
  });

  myChart.update();
};

const fetchData = () => {
  const endpoint = "http://10.175.15.27:3000/query";
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      updateChart(data);
    })
    .catch(error => {
      console.error("Erro:", error);
    });
};

fetchData();

setInterval(fetchData, 3000);
