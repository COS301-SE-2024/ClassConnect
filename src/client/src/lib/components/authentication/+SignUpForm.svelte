<script>
	import { Heading, Span } from 'flowbite-svelte';
	import Apple from '$lib/images/apple.svg';
	import Google from '$lib/images/google.svg';
	import { Input, Label, Radio, Button, Checkbox, A } from 'flowbite-svelte';
	import '@fontsource/roboto';

	import { Dropzone } from 'flowbite-svelte';

	let value = [];
	const dropHandle = (event) => {
	value = [];
	event.preventDefault();
	if (event.dataTransfer.items) {
		[...event.dataTransfer.items].forEach((item, i) => {
		if (item.kind === 'file') {
			const file = item.getAsFile();
			value.push(file.name);
			value = value;
		}
		});
	} else {
		[...event.dataTransfer.files].forEach((file, i) => {
		value = file.name;
		});
	}
	};

	const handleChange = (event) => {
	const files = event.target.files;
	if (files.length > 0) {
		value.push(files[0].name);
		value = value;
	}
	};

	const showFiles = (files) => {
	if (files.length === 1) return files[0];
	let concat = '';
	files.map((file) => {
		concat += file;
		concat += ',';
		concat += ' ';
	});

	if (concat.length > 40) concat = concat.slice(0, 40);
	concat += '...';
	return concat;
	};

	import { Select } from 'flowbite-svelte';
	let selected;

	let organisations = [
		{ value: 'up', name: 'University Of Pretoria' },
		{ value: 'wits', name: 'University of the Witwatersrand' },
		{ value: 'uct', name: 'University of Cape Town' }
	];

	let orgType = '';

</script>

<div class="m2 flex h-screen justify-center">
	<div class="rounded-xl bg-white bg-opacity-80 p-2">
		<h1 class="roboto text-center text-3xl font-bold">Get Started Now</h1>

		<form method="POST" action="/signup">
			<Label for="name" class="mb-2 mt-2">Name</Label>
			<Input type="text" id="name" name="name" placeholder="John" size="md" required />
		
			<Label for="email" class="mb-2 mt-2">Email</Label>
			<Input type="email" id="email" name="email" placeholder="john.doe@company.com" required />
		
			<Label for="password" class="mb-2 mt-2">Password</Label>
			<Input type="password" id="password" name="password" placeholder="•••••••••" required />
		
			<Label for="confirm_password" class="mb-2 mt-2">Confirm password</Label>
			<Input type="password" id="confirm_password" name="confirm_password" placeholder="•••••••••" required />
			
			<Label for="organisation_type" class="mb-2 mt-2">Organisation Type:</Label>
			<div class="grid grid-cols-2 gap-6 mb-2 mt-2">
				<div class="rounded border border-gray-200 dark:border-gray-700">
					<Radio id="existing_org" name="organisation_type" class="w-full p-4" bind:group={orgType} value="existing">Existing Organisation</Radio>
				</div>
				<div class="rounded border border-gray-200 dark:border-gray-700">
					<Radio id="new_org" name="organisation_type" class="w-full p-4" bind:group={orgType} value="new">New Organisation</Radio>
				</div>
			</div>
			
			{#if orgType === 'existing'}
				<Label for="selected_org">
					Select an Organisation
					<Select id="selected_org" class="mt-2" items={organisations} bind:value={selected} />
				</Label>
			{:else if orgType === 'new'}
				<Label for="org_name" class="mb-2 mt-2">Organisation Name</Label>
				<Input type="text" id="org_name" name="org_name" placeholder="John" size="md" required />
			
				<Label for="upload_image" class="mb-2 mt-2">Upload image:</Label>
				<Dropzone
					id="upload_image"
					on:drop={dropHandle}
					on:dragover={(event) => {
						event.preventDefault();
					}}
					class="w-[100%] h-[15%]"
					on:change={handleChange}>
					<svg aria-hidden="true" class="mb-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
					{#if value.length === 0}
						<p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
						<p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800px400px)</p>
					{:else}
						<p>{showFiles(value)}</p>
					{/if}
				</Dropzone>
			{/if}
		
			<Checkbox class="p-2" id="terms" name="terms" required>
				I agree to the &nbsp;<A href="#" class="text-blue-600">terms and conditions</A>
			</Checkbox>
		
			<Button
				type="submit"
				class="w-full"
			>
				Sign Up
			</Button>
		</form>

		<div class="p-2">
			<div class="flex items-center">
				<div class="flex-1 border-t border-black"></div>
				<span class="px-2 text-black">Or</span>
				<div class="flex-1 border-t border-black"></div>
			</div>

			<div class="flex items-center">
				<Button class="m-2 border-[1px] border-gray-700 bg-white text-black hover:bg-gray-100">
					<img alt="Apple Logo" class="me-2 h-5 w-5" src={Apple} />
					Sign Up with Apple
				</Button>
				<Button class="m-2 border-[1px] border-gray-700 bg-white text-black hover:bg-gray-100">
					<img alt="Google Logo" class="me-2 h-5 w-5" src={Google} />
					Sign Up with Google
				</Button>
			</div>

			<div class="text-center">
				<p>
					Already have an account?{' '}
					<A href="/signin" class="text-blue-600">
						Sign In
					</A>
				</p>
			</div>
		</div>
	</div>
</div>

