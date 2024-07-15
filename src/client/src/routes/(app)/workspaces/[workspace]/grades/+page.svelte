<script>
  import { Input, InputAddon, ButtonGroup, Chart, Card, A, Button, Dropdown, DropdownItem, Popover, Modal, Label, Checkbox } from 'flowbite-svelte';
  import { InfoCircleSolid, ChevronRightOutline, ChevronDownOutline, FileLinesSolid, SearchOutline } from 'flowbite-svelte-icons';
	let formModal = false;
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
    series: [
      {
        name: 'Class Submitted (%)',
        data: [92, 85, 78, 94, 88, 81, 75, 89, 93, 86, 80],
        color: '#E74C3C'
      },
			{
        name: 'Trend line of Class Submitted (%)',
        data: [91, 90, 89, 88, 87, 86, 85, 84, 83, 82, 81],
        color: '#3498DB'
      },
      {
        name: 'Class Average (%)',
        data: [84, 78, 91, 74, 88, 82, 76, 89, 83, 77, 90],
        color: '#1ABC9C'
      },
			{
        name: 'Trend Line for Class Average (%)',
        data: [85, 84, 83, 82, 81, 80, 79, 78, 77, 76, 75],
        color: '#9B59B6'
      },
			{
        name: 'Pass Rate (%)',
        data: [95, 89, 83, 97, 91, 86, 80, 92, 94, 88, 85],
        color: '#F1C40F'
      },
			{
        name: 'Trend Line for Pass Rate (%)',
        data: [98, 96, 94, 92, 90, 88, 86, 84, 82, 80, 78],
        color: '#2ECC71'
      },
    ],
    legend: {
      show: true
    },
    xaxis: {
      categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11'],
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

<ButtonGroup class="w-full">
  <Button color="none" class="flex-shrink-0 text-gray-900 bg-gray-100 border border-gray-300 dark:border-gray-700 dark:text-white hover:bg-gray-200 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
    All Assessments<ChevronDownOutline class="w-6 h-6 ms-2" />
  </Button>
  <Dropdown>
    <DropdownItem>Tutorials</DropdownItem>
    <DropdownItem>Practicals</DropdownItem>
    <DropdownItem>Semester Tests</DropdownItem>
  </Dropdown>
  <Input placeholder="Search" />
  <Button color="primary" class="!p-2.5" type="submit">
    <SearchOutline class="w-5 h-5" />
  </Button>
</ButtonGroup>

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
					<Label class="space-y-2">
						<span>Class Submitted (%)</span>
						<Input type="number" name="classSubmitted" required />
					</Label>
					<Label class="space-y-2">
						<span>Class Average (%)</span>
						<Input type="number" name="classAverage" required />
					</Label>
					<Label class="space-y-2">
						<span>Pass Rate (%)</span>
						<Input type="number" name="passRate" required />
					</Label>
					<Button type="submit" class="w-full1">Submit</Button>
				</form>
			</Modal>
    </div>
  </div>
</Card>
