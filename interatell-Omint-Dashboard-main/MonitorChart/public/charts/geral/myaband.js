const ctxAbandoned = document.getElementById('abandonedChart').getContext('2d');

const myAbandonedChart = new Chart(ctxAbandoned, {
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

const updateAbandonedChart = (data) => {
  // Limpar dados antigos
  myAbandonedChart.data.labels = [];
  myAbandonedChart.data.datasets[0].data = [];
  myAbandonedChart.data.datasets[0].backgroundColor = [];

  // Adicionar dados de todas as empresas
  data.forEach((entry, index) => {
    myAbandonedChart.data.labels.push(entry.csqname);
    myAbandonedChart.data.datasets[0].data.push(entry.total_aband);
    myAbandonedChart.data.datasets[0].backgroundColor.push(colors[index % colors.length]);
  });

  myAbandonedChart.update();
};
