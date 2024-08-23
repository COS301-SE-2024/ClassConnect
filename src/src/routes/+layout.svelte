<script lang="ts">
	import '../app.css';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { inject } from '@vercel/analytics'
	
	inject();
	injectSpeedInsights();
</script>

<div class="app bg-lightBgColor dark:bg-gray-700">
	<main>
		<slot />
	</main>
</div>
