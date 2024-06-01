<script lang="ts">
	import SideBar from "$lib/components/utils/+SideBar.svelte"
	import Workspaces from "$lib/components/admin/+Workspaces.svelte";
	import { Navbar, Button, Input } from 'flowbite-svelte';
	import { SearchOutline, BellOutline, EnvelopeOutline, UserCircleOutline } from "flowbite-svelte-icons";
	import  {workspaces}  from "./workspaces";
  </script>


  <main class="flex h-screen">
	  <!-- The div below contains the sidebar -->
	<div class="w-64">
	  <SideBar/>
	</div>

	<!-- The div below contains all the information to the right of the sidebar such as the workspaces and navbar -->
	<div class="flex-1 p-4">
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
		<h1 class="text-3xl font-bold mb-2">University of Pretoria</h1>
		<h2 class="text-xl font-semibold mb-4">Computer Science</h2>
		<div class="flex justify-end mt-6">
		  <Button color="green">Add Workspace</Button>
		</div>
		<Workspaces {workspaces} />
	  </div>
	</div>
  </main>
  