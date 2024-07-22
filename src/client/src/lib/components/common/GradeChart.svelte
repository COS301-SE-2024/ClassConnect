<script lang="ts">
  import { Input, InputAddon, ButtonGroup, Chart, Card, A, Button, Dropdown, DropdownItem, Popover, Modal, Label, Checkbox } from 'flowbite-svelte';
  import { InfoCircleSolid, ChevronRightOutline, ChevronDownOutline, FileLinesSolid, SearchOutline } from 'flowbite-svelte-icons';

  let formModal = false;
  export let series: Array<{name: string, data: number[], color: string}>;
  export let categories: string[];

  let options = {
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
    series: series,
    legend: {
      show: true
    },
    xaxis: {
      categories: categories,
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
        <p class="text-gray-900 dark:text-white text-2xl leading-none font-bold">Tutorial Test Graph</p>
    </div>
    <div>
      <Button color="light" class="px-3 py-2">Last week<ChevronDownOutline class="w-2.5 h-2.5 ms-1.5" /></Button>
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
      <Button href="/" class="px-4 py-2.5 text-sm font-medium text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <FileLinesSolid class="w-3.5 h-3.5 text-white me-2" />
        Edit existing report
      </Button>
      <Button on:click={() => (formModal = true)} class="px-4 py-2.5 text-sm font-medium text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
        <FileLinesSolid class="w-3.5 h-3.5 text-white me-2" />
        Add new data
      </Button>
      <Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
        <form class="flex flex-col space-y-6" action="#">
          <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Tutorial Test Data</h3>
          {#each series as serie}
            <Label class="space-y-2">
              <span>{serie.name}</span>
              <Input type="number" name={serie.name.toLowerCase().replace(/\s+/g, '')} required />
            </Label>
          {/each}
          <Button type="submit" class="w-full1">Submit</Button>
        </form>
      </Modal>
    </div>
  </div>
</Card>