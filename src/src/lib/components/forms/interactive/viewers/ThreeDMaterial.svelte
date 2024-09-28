<script lang="ts">
	import type { LessonThreeDMaterial } from '$src/types';
	export let material: LessonThreeDMaterial;
</script>

<main class="container mx-auto p-4">
	<div class="p-2 md:px-5 md:py-2">
		<div class="grid grid-cols-12 justify-center gap-6 text-center">
			<div class="col-span-10">
				<div class="mb-6">
					<h2 class="mb-2 text-2xl">
						{material.title}
					</h2>
				</div>
				<div>
					<div class="flex justify-center p-3">
						<section
							class="flex h-[100%] w-[100%] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
						>
							<div class="flex-1">
								<!-- Use it like any other HTML element -->
								<model-viewer
									class="h-[100vh] w-full flex-grow"
									alt={material.description}
									src={material.link}
									ar
									environment-image="/moon_1k.hdr"
									poster="/poster.svg"
									shadow-intensity="1"
									camera-controls
									touch-action="pan-y"
								>
								</model-viewer>
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	</div>
</main>
