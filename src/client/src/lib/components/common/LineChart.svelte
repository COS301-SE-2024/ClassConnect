<script>
  import { onMount } from 'svelte';
  import Chart from 'chart.js/auto';

  export let data = [];

  let canvas;
  let chart;

  $: if (chart && data) {
    updateChart();
  }

  onMount(() => {
    chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Submitted (%)',
            data: [],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Average (%)',
            data: [],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          },
          {
            label: 'Pass Rate (%)',
            data: [],
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });

    return () => {
      chart.destroy();
    };
  });

  function updateChart() {
    chart.data.labels = data.map(item => item.name);
    chart.data.datasets[0].data = data.map(item => item.submitted);
    chart.data.datasets[1].data = data.map(item => item.average);
    chart.data.datasets[2].data = data.map(item => item.passRate);
    chart.update();
  }
</script>

<canvas bind:this={canvas}></canvas>