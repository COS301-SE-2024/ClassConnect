<script lang="ts">
	export let date;
	export let title;
	export let description;
	let DATE = new Date(date);
	import { Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import { DotsVerticalOutline } from 'flowbite-svelte-icons';
	console.log('Card', { date, title, description });
</script>

<div class=" dark:text-gray-800">
	<div class="container max-w-4xl rounded-lg bg-white px-2 py-6 shadow-sm">
		<div class="flex items-center justify-between">
			<span class="text-sm dark:text-gray-600">{DATE.toDateString()}</span>
			<DotsVerticalOutline id="dot-menu" size="xl" />
			<Dropdown placement="bottom" triggeredBy="#dot-menu">
				<DropdownItem href="/profile">Edit</DropdownItem>
				<DropdownDivider />
				<DropdownItem href="/signout">Delete</DropdownItem>
			</Dropdown>
		</div>
		<div class="mt-3">
			<h1 class="text-2xl font-bold">{title}</h1>
			<p class="mt-2">{description}</p>
		</div>
		<div class="mt-4 flex items-center justify-between">
			<div>
				<span class=" dark:text-gray-600">Leroy Jenkins</span>
			</div>
		</div>
	</div>
</div>
<!-- <div class="task m-2">
	<div class="tags">
		<span class="tag">{title}</span>
		<button class="options">
			<svg
				xml:space="preserve"
				viewBox="0 0 41.915 41.916"
				xmlns:xlink="http://www.w3.org/1999/xlink"
				xmlns="http://www.w3.org/2000/svg"
				id="Capa_1"
				version="1.1"
				fill="#000000"
				><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g
					stroke-linejoin="round"
					stroke-linecap="round"
					id="SVGRepo_tracerCarrier"
				></g><g id="SVGRepo_iconCarrier">
					<g>
						<g>
							<path
								d="M11.214,20.956c0,3.091-2.509,5.589-5.607,5.589C2.51,26.544,0,24.046,0,20.956c0-3.082,2.511-5.585,5.607-5.585 C8.705,15.371,11.214,17.874,11.214,20.956z"
							></path>
							<path
								d="M26.564,20.956c0,3.091-2.509,5.589-5.606,5.589c-3.097,0-5.607-2.498-5.607-5.589c0-3.082,2.511-5.585,5.607-5.585 C24.056,15.371,26.564,17.874,26.564,20.956z"
							></path>
							<path
								d="M41.915,20.956c0,3.091-2.509,5.589-5.607,5.589c-3.097,0-5.606-2.498-5.606-5.589c0-3.082,2.511-5.585,5.606-5.585 C39.406,15.371,41.915,17.874,41.915,20.956z"
							></path>
						</g>
					</g>
				</g></svg
			>
		</button>
	</div>
	<p>{description}</p>
	<div class="stats">
		<div>
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
					><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g
						stroke-linejoin="round"
						stroke-linecap="round"
						id="SVGRepo_tracerCarrier"
					></g><g id="SVGRepo_iconCarrier">
						<path stroke-linecap="round" stroke-width="2" d="M12 8V12L15 15"></path>
						<circle stroke-width="2" r="9" cy="12" cx="12"></circle>
					</g></svg
				>{date}
			</div>
		</div>
	</div>
</div> -->
