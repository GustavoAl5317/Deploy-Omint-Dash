const colors = ['rgb(136, 230, 17)', 'rgb(242, 8, 8)', 'rgb(54, 162, 235)', 'rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(153, 102, 255)', 'rgb(255, 205, 86)', 'rgb(201, 203, 207)']; // Array de cores pré-definidas

const ctx = document.getElementById('abandonedChart').getContext('2d');

const abandonedChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: [],
    datasets: [{
      label: 'Abandoned',
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
    }
  }
});

const updateChart = (data) => {
  // Limpar dados antigos
  abandonedChart.data.labels = [];
  abandonedChart.data.datasets[0].data = [];
  abandonedChart.data.datasets[0].backgroundColor = [];

  // Adicionar dados de todas as empresas
  data.forEach((entry, index) => {
    abandonedChart.data.labels.push(entry.csqname);
    abandonedChart.data.datasets[0].data.push(entry.total_aband);
    abandonedChart.data.datasets[0].backgroundColor.push(colors[index % colors.length]);
  });

  abandonedChart.update();
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
