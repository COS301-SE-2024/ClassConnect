<script>
	export let data;
	let { role: userRole } = data;

	console.log(userRole);

	let pinPosition = { x: 0, y: 0 };
	let isPinPlaced = false;
	let circle = { x: 150, y: 150, radius: 50 };
	let isDraggingCircle = false;

	function handleImageClick(event) {
		if (userRole === 'student') {
			const rect = event.target.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			pinPosition = { x, y };
			isPinPlaced = true;
		}
	}

	function handleCircleMouseDown(event) {
		if (userRole === 'lecturer') {
			isDraggingCircle = true;
		}
	}

	function handleRadiusChange(event) {
		if (userRole === 'lecturer') {
			circle.radius = parseInt(event.target.value, 10);
		}
	}

	function handleMouseMove(event) {
		if (isDraggingCircle && userRole === 'lecturer') {
			const rect = event.target.getBoundingClientRect();
			circle.x = event.clientX - rect.left;
			circle.y = event.clientY - rect.top;
		}
	}

	function handleMouseUp() {
		if (userRole === 'lecturer') {
			isDraggingCircle = false;
		}
	}

	$: {
		// Reactive statements to handle updates
		console.log('Current role:', userRole);
	}
</script>

<button
	class="image-container"
	on:click={handleImageClick}
	on:keydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') handleImageClick(e);
	}}
>
	<img src="/images/class-connect-logo.png" alt="Hotspot Image" />

	{#if isPinPlaced && userRole === 'student'}
		<div class="pin" style="left: {pinPosition.x}px; top: {pinPosition.y}px;"></div>
	{/if}

	{#if userRole === 'lecturer'}
		<div
			class="circle"
			role="button"
			tabindex="0"
			on:mousedown={handleCircleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
			on:keydown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') handleCircleMouseDown();
			}}
			style="left: {circle.x}px; top: {circle.y}px; width: {circle.radius *
				2}px; height: {circle.radius * 2}px;"
		></div>

		<input type="range" min="10" max="200" value={circle.radius} on:input={handleRadiusChange} />
	{/if}
</button>

<style>
	.image-container {
		position: relative;
		display: inline-block;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.pin {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: red;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.circle {
		position: absolute;
		border: 2px solid blue;
		border-radius: 50%;
		cursor: grab;
	}
</style>
