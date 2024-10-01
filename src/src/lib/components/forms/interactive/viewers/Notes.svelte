<script lang="ts">
	import { onMount } from 'svelte';
	export let note: any;

	let isPDF = note.content.endsWith('.pdf');
	let pdfUrl = note.content;
	let fallbackSource = `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
	let isMobile = false;

	function checkIfMobile() {
		isMobile = window.innerWidth <= 768;
		console.log('Mobile:', isMobile);
	}

	onMount(() => {
		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);
		return () => {
			window.removeEventListener('resize', checkIfMobile);
		};
	});

	$: note = note;
</script>

<main class="container mx-auto px-2 py-4 sm:px-4 md:px-6 lg:px-8">
	<div class="mx-auto w-full max-w-4xl">
		<div class="flex flex-col items-center">
			<!-- Title Section -->
			<div class="mb-4 w-full">
				<h2 class="text-center text-xl font-semibold sm:text-2xl md:text-3xl">
					{note.title}
				</h2>
			</div>
			<!-- Content Section -->
			<div class="w-full">
				<div class="p-2 sm:p-3">
					<section
						class="flex flex-col space-y-2 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
					>
						<div class="w-full flex-1">
							{#if isPDF}
								{#if !isMobile}
									<!-- Try to render PDF using the native PDF viewer -->
									<object
										id="pdf-file"
										class="h-[50vh] w-full sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
										data={pdfUrl}
										type="application/pdf"
										title="Study Material"
									>
										<p>
											Your browser doesn't support PDF viewing. Switching to Google PDF Viewer...
										</p>
									</object>
								{:else}
									<!-- Fallback to Google PDF viewer -->
									<iframe
										id="google-pdf-viewer"
										class="h-[50vh] w-full sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
										src={fallbackSource}
										frameborder="0"
										title="Study Material"
									></iframe>
								{/if}
							{:else}
								<!-- Image viewer for non-PDF content -->
								<img
									src={note.content}
									alt={note.title}
									class="h-auto max-h-[50vh] w-full object-contain sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh]"
								/>
							{/if}
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
</main>
