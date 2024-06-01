<script lang="ts">
	import { cn } from '$lib/components/utils/cn';

	export let className = '';
	export let showRadialGradient = true;
	let children;
</script>

<main>
	<div class={cn('transition-bg  bg-zinc-50 text-slate-950 dark:bg-zinc-900', className)}>
		<div class="absolute inset-0 overflow-hidden">
			<div
				class={cn(
					`
					pointer-events-none
					absolute
					-inset-[10px]
					opacity-50
					blur-[10px]
					invert
					filter
					will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--green-500)_10%,var(--green-300)_15%,var(--green-300)_20%,var(--green-200)_25%,var(--green-400)_30%)] [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)] [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
					[background-image:var(--white-gradient),var(--aurora)] [background-position:50%_50%,50%_50%] [background-size:300%,_200%] after:absolute 
					after:inset-0
					after:animate-aurora 
					after:mix-blend-difference after:content-[""] after:[background-attachment:fixed]
					after:[background-image:var(--white-gradient),var(--aurora)]
					after:[background-size:200%,_100%] dark:invert-0 dark:[background-image:var(--dark-gradient),var(--aurora)] after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

					showRadialGradient &&
						`[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
				)}
			></div>
		</div>
		<slot></slot>
	</div>
</main>
