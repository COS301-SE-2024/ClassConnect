<script lang="ts">
	import { Vector3 } from 'three';
	import { onDestroy } from 'svelte';
	import { spring } from 'svelte/motion';
	import { useTask } from '@threlte/core';
	import { GLTF } from '@threlte/extras';
	import { pointerControls, Controller, Hand } from '@threlte/xr';

	export let currentModel: string;

	const scale = spring(1);

	let ref: any;
	let point = new Vector3();
	let lookAt = new Vector3();

	const handleEvent =
		(type: string) =>
		(event: any): any => {
			switch (type) {
				case 'click': {
					scale.set(1.5);
					return;
				}
				case 'pointermove': {
					point.copy(event.point);
					return;
				}
				case 'pointerenter': {
					scale.set(1.1);
					return;
				}
				case 'pointerleave': {
					scale.set(1);
					return;
				}
				case 'pointermissed': {
					scale.set(0.5);
					return;
				}
			}
		};

	const lookForCursor = () => {
		point.set(Math.random() - 0.5, 1.5 + Math.random() - 0.5, 1);
	};

	useTask(() => {
		lookAt.lerp(point, 0.1);
		if (ref) ref.lookAt(lookAt.x, lookAt.y, 1);
	});

	pointerControls('left');
	pointerControls('right');

	$: lookIntervalId = window.setInterval(lookForCursor, 1000);

	onDestroy(() => {
		clearInterval(lookIntervalId);
	});
</script>

<Controller left />
<Controller right />

<Hand left />
<Hand right />

<GLTF
	bind:ref
	scale={$scale}
	url={currentModel}
	on:click={handleEvent('click')}
	on:pointerdown={handleEvent('pointerdown')}
	on:pointerup={handleEvent('pointerup')}
	on:pointerover={handleEvent('pointerover')}
	on:pointerout={handleEvent('pointerout')}
	on:pointerenter={handleEvent('pointerenter')}
	on:pointerleave={handleEvent('pointerleave')}
	on:pointermove={handleEvent('pointermove')}
	on:pointermissed={handleEvent('pointermissed')}
/>
