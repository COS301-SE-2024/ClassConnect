<script lang="ts">
	import { Button } from 'flowbite-svelte';
	export let user: any;
</script>

<div
	class="ease-soft-in-out xl:ml-68.5 relative h-full max-h-screen bg-gray-50 transition-all duration-200"
>
	<section class="w-full overflow-hidden dark:bg-gray-900">
		<div class="mx-auto w-full">
			<!-- User Cover IMAGE -->
			<img
				src="/images/ryunosuke-kikuno-RKwivgSTXVI-unsplash.jpg"
				alt="User Cover"
				class="xs:h-[9.5rem] w-full rounded-md object-cover sm:h-[13rem] md:h-[16rem] lg:h-[22rem] xl:h-[20rem]"
			/>
			<!-- User Profile Image -->
			<div class="mx-auto flex w-full justify-center">
				<img
					src={user.image}
					alt="User Profile"
					class="xs:w-[8rem] xs:h-[8rem] xs:bottom-[4.3rem] relative rounded-full object-cover shadow-xl outline outline-2 outline-offset-2 outline-green-500 sm:bottom-[5rem] sm:h-[10rem] sm:w-[10rem] md:bottom-[6rem] md:h-[12rem] md:w-[12rem] lg:bottom-[8rem] lg:h-[16rem] lg:w-[16rem] xl:bottom-[7rem] xl:h-[16rem] xl:w-[16rem]"
				/>
			</div>

			<div
				class="xs:w-[92%] xs:-top-[2.2rem] relative mx-auto flex flex-col items-center justify-center gap-4 sm:-top-[3rem] sm:w-[96%] md:-top-[4rem] md:w-[94%] lg:-top-[6rem] lg:w-[90%] xl:-top-[6rem] xl:w-[80%]"
			>
				<!-- FullName -->
				<h1 class="text-center font-serif text-4xl text-gray-800 dark:text-white">
					{user.name + ' ' + user.surname}
				</h1>
				<!-- About -->
				<div class="overflow-hidden rounded-lg border bg-white shadow">
					<div class="px-4 py-5 sm:px-6">
						<h3 class="text-lg font-medium leading-6 text-gray-900">Profile information</h3>
					</div>
					<div class="border-t border-gray-200 px-4 py-5 sm:p-0">
						<dl class="sm:divide-y sm:divide-gray-200">
							<div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
								<dt class="text-sm font-medium text-gray-500">Full name</dt>
								<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
									{user.name + ' ' + user.surname}
								</dd>
							</div>
							<div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
								<dt class="text-sm font-medium text-gray-500">Email address</dt>
								<dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
									{user.email}
								</dd>
							</div>
						</dl>
					</div>
				</div>
				<!-- Update Link -->
				<div class="flex rounded-sm px-2">
					<Button href="/settings">Update Details</Button>
				</div>
			</div>
		</div>
	</section>
</div>
