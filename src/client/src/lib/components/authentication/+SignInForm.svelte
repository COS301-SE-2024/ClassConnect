<script>
	import { Heading, Span } from 'flowbite-svelte';
	import Apple from '$lib/images/apple.svg';
	import Google from '$lib/images/google.svg';
	import { Input, Label, ButtonGroup, Button, Checkbox, A } from 'flowbite-svelte';
	import '@fontsource/roboto';
</script>

<div class="m2 flex h-screen items-center justify-center">
	<div class="rounded-xl bg-white bg-opacity-80 p-2">
        <div class="text-center p-2">
            <h1 class="roboto text-center text-3xl font-bold">
                Welcome Back 👋
            </h1>
            <p class="">
                Today is a new day. It's your day. You shape it. 
            </p>
        </div>

		<form>
			<Label for="email" class="mb-2 mt-2">Email</Label>
			<Input type="email" id="email" class="mb-2 mt-2" placeholder="john.doe@company.com" required />

			<Label for="password" class="mb-2 mt-2">Password</Label>
			<Input type="password" id="password" class="mb-2 mt-2" placeholder="•••••••••" required />

			<Button
				type="submit"
				class="w-full"
			>
				Sign In
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
					Sign In with Apple
				</Button>
				<Button class="m-2 border-[1px] border-gray-700 bg-white text-black hover:bg-gray-100">
					<img alt="Google Logo" class="me-2 h-5 w-5" src={Google} />
					Sign In with Google
				</Button>
			</div>

			<div class="text-center">
				<p>
					Already have an account?{' '}
					<A href="/signup" class="text-blue-600">
						Sign Up
					</A>
				</p>
			</div>
		</div>
	</div>
</div>

<style>
	.roboto {
		font-family: 'Roboto', sans-serif;
	}
</style>