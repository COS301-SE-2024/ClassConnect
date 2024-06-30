<script lang="ts">
	import { page } from '$app/stores';

	const errorMessages: { [key: number]: string } = {
		400: 'Bad Request',
		401: 'Unauthorized',
		403: 'Forbidden',
		404: 'Page Not Found',
		500: 'Internal Server Error',
		502: 'Bad Gateway',
		503: 'Service Unavailable',
		504: 'Gateway Timeout'
	};

	$: statusCode = $page.status;
	$: errorMessage = errorMessages[statusCode] || 'An error occurred';
	$: colorScheme = statusCode >= 500 ? 'red' : statusCode >= 400 ? 'yellow' : 'blue';
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
	<div class="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-xl">
		<div
			class={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-${colorScheme}-100 mb-6`}
		>
			<svg
				class={`h-8 w-8 text-${colorScheme}-600`}
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
				></path>
			</svg>
		</div>

		<h1 class={`text-4xl font-bold text-${colorScheme}-600 mb-4`}>{statusCode}</h1>

		<h2 class="mb-4 text-2xl font-semibold text-gray-800">{errorMessage}</h2>

		<p class="mb-8 text-gray-600">
			{$page.error?.message || "We're sorry, but something went wrong."}
		</p>

		<a
			href="/"
			class={`inline-block bg-${colorScheme}-500 hover:bg-${colorScheme}-600 rounded px-4 py-2 font-bold text-white transition duration-300`}
		>
			Go to Homepage
		</a>
	</div>

	<p class="mt-8 text-sm text-gray-500">
		Error Code: {statusCode} | {$page.error?.message || errorMessage}
	</p>
</div>
