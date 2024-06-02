<script lang="ts">
	import SideBar from "$lib/components/utils/+SideBar.svelte"
	import { Navbar, Input } from 'flowbite-svelte';
	import { SearchOutline, BellOutline, EnvelopeOutline, UserCircleOutline } from "flowbite-svelte-icons";
	import  {degrees}  from "./degrees";
	import Degrees from "$lib/components/admin/+Degrees.svelte";
  </script>


  <main class="flex h-screen">
	  <!-- The div below contains the sidebar -->
	<div class="w-64">
	  <SideBar/>
	</div>

	<!-- The div below contains all the information to the right of the sidebar such as the workspaces and navbar -->
	<div class="flex-1 p-4 dark:bg-gray-700">
	  <Navbar let:NavContainer color="light"> 
		<NavContainer class="border px-5 py-2 rounded-lg bg-white dark:bg-gray-600">
		<div class="flex flex-1 justify-center">
		  <div class="hidden relative md:block w-full max-w-md">
			<div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
			  <SearchOutline class="w-4 h-4" />
			</div>
	
			<Input id="search-navbar" class="ps-10" placeholder="Search..." />
		  </div>
		</div>
		<div class="flex space-x-4">
			<BellOutline class="w-6 h-6" />
			<EnvelopeOutline class="w-6 h-6" />
			<UserCircleOutline class="w-6 h-6" />
		  </div>
		  </NavContainer>
	  </Navbar>

	  <!-- The div below contains all the information that is below the navbar -->
	  <div class="mt-4">
		<div class="flex justify-center">
			<h1 class="text-3xl font-bold mb-2 dark:text-gray-300">Degree Dashboard</h1>
		</div>
		<Degrees {degrees} />
	  </div>
	</div>
  </main>
  