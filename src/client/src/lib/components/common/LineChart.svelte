<script lang="ts">
  import { Chart, Card, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
  import { ChevronDownOutline, FileLinesSolid } from 'flowbite-svelte-icons';

  export let data: {
    name: string;
    submitted: number;
    average: number;
    passRate: number;
  }[] = [];

  $: options = {
    chart: {
      height: '400px',
      maxWidth: '100%',
      type: 'line',
      fontFamily: 'Inter, sans-serif',
      dropShadow: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    tooltip: {
      enabled: true,
      x: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 6,
      curve: 'straight'
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -26
      }
    },
    series: [
      {
        name: 'Class Submitted (%)',
        data: data.map(item => item.submitted),
        color: '#E74C3C'
      },
      {
        name: 'Class Average (%)',
        data: data.map(item => item.average),
        color: '#1ABC9C'
      },
      {
        name: 'Pass Rate (%)',
        data: data.map(item => item.passRate),
        color: '#F1C40F'
      }
    ],
    legend: {
      show: true
    },
    xaxis: {
      categories: data.map(item => item.name),
      labels: {
        show: true,
        style: {
          fontFamily: 'Inter, sans-serif',
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: true
    }
  };
</script>

<Card size="lg">
  <div class="flex justify-between mb-5">
    <div class="grid gap-4 grid-cols-2">
      <p class="text-gray-900 dark:text-white text-2xl leading-none font-bold">Assessment Graph</p>
    </div>
    <div>
      <Button color="light" class="px-3 py-2">
        Last week<ChevronDownOutline class="w-2.5 h-2.5 ms-1.5" />
      </Button>
      <Dropdown class="w-40">
        <DropdownItem>Yesterday</DropdownItem>
        <DropdownItem>Today</DropdownItem>
        <DropdownItem>Last 7 days</DropdownItem>
        <DropdownItem>Last 30 days</DropdownItem>
        <DropdownItem>Last 90 days</DropdownItem>
      </Dropdown>
    </div>
  </div>
  <Chart {options} />
  <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between mt-2.5">
    <div class="pt-5">
      <Button href="/" class="px-4 py-2.5 text-sm font-medium text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <FileLinesSolid class="w-3.5 h-3.5 text-white me-2" />
        View full report
      </Button>
    </div>
  </div>
</Card>