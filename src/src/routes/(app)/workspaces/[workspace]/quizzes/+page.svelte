<script>
	import { Button, Card, Label, Range, Checkbox, Select, Radio, Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let pendulumLength = 1;
	let pendulumAngle = 0;
	let isAnimating = false;
	let period = 0;

	const gravity = 9.81;

	function calculatePeriod() {
		return 2 * Math.PI * Math.sqrt(pendulumLength / gravity);
	}

	function toggleAnimation() {
		isAnimating = !isAnimating;
		if (isAnimating) {
			animatePendulum();
		}
	}

	function animatePendulum() {
		if (!isAnimating) return;

		pendulumAngle = 30 * Math.sin((Date.now() / 1000) * Math.sqrt(gravity / pendulumLength));
		requestAnimationFrame(animatePendulum);
	}

	function handleLengthChange(event) {
		pendulumLength = parseFloat(event.target.value);
		period = calculatePeriod();
	}

	function checkAnswer() {
		if (selectedAnswer === 'longer') {
			feedback = 'Correct! As the pendulum length increases, the period increases.';
		} else {
			feedback = "Incorrect. Try observing the pendulum's motion at different lengths.";
		}
	}

	onMount(() => {
		period = calculatePeriod();
	});

	let phLevel = 7;

	function getColor(ph) {
		if (ph < 3) return 'rgb(255, 0, 0)';
		if (ph < 6) return 'rgb(255, 165, 0)';
		if (ph < 8) return 'rgb(255, 255, 0)';
		if (ph < 11) return 'rgb(0, 255, 0)';
		return 'rgb(0, 0, 255)';
	}

	function checkAnswerPH() {
		if (phLevel < 7 && selectedAnswer === 'acid') {
			feedback = 'Correct! A pH level below 7 indicates an acidic solution.';
		} else if (phLevel > 7 && selectedAnswer === 'base') {
			feedback = 'Correct! A pH level above 7 indicates a basic (alkaline) solution.';
		} else if (phLevel === 7 && selectedAnswer === 'neutral') {
			feedback = 'Correct! A pH level of exactly 7 indicates a neutral solution.';
		} else {
			feedback = 'Incorrect. Review the pH scale and try again.';
		}
	}

	let lightIntensity = 50;
	let co2Level = 50;
	let waterLevel = 50;
	let photosynthesisRate = 0;

	let selectedFactors = [];

	$: photosynthesisRate = calculatePhotosynthesisRate(lightIntensity, co2Level, waterLevel);

	function calculatePhotosynthesisRate(light, co2, water) {
		// Simplified model: rate is the minimum of the three factors
		return Math.min(light, co2, water);
	}

	function checkAnswerPhotosynthesis() {
		const correctFactors = new Set(['light', 'co2', 'water']);
		const selectedSet = new Set(selectedFactors);

		if (
			selectedSet.size === correctFactors.size &&
			[...selectedSet].every((factor) => correctFactors.has(factor))
		) {
			feedback = 'Correct! Light, CO2, and water are all essential for photosynthesis.';
		} else {
			feedback = 'Incorrect. Review the factors affecting photosynthesis and try again.';
		}
	}

	let voltage = 5;
	let resistance = 100;
	let current = 0;

	$: current = calculateCurrent(voltage, resistance);

	function calculateCurrent(v, r) {
		return v / r;
	}

	function checkAnswerCircuit() {
		if (selectedAnswer === 'inverse') {
			feedback = "Correct! Current is inversely proportional to resistance (Ohm's Law: I = V/R).";
		} else {
			feedback = "Incorrect. Review Ohm's Law and the relationship between current and resistance.";
		}
	}

	let a = 1,
		b = 0,
		c = 0;

	$: equation = `f(x) = ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`;

	onMount(() => {
		ctx = canvas.getContext('2d');
		drawGraph();
	});

	function drawGraph() {
		ctx.clearRect(0, 0, 300, 300);
		ctx.beginPath();
		ctx.moveTo(0, 150);
		ctx.lineTo(300, 150);
		ctx.moveTo(150, 0);
		ctx.lineTo(150, 300);
		ctx.strokeStyle = '#888';
		ctx.stroke();

		ctx.beginPath();
		for (let x = -10; x <= 10; x += 0.1) {
			let y = a * x * x + b * x + c;
			let canvasX = 150 + x * 15;
			let canvasY = 150 - y * 15;
			if (x === -10) ctx.moveTo(canvasX, canvasY);
			else ctx.lineTo(canvasX, canvasY);
		}
		ctx.strokeStyle = '#00F';
		ctx.stroke();
	}

	$: {
		if (ctx) drawGraph();
	}

	function checkAnswerMath() {
		const correctAnswer = a > 0 ? 'upward' : 'downward';
		if (selectedAnswer === correctAnswer) {
			feedback = `Correct! When a ${a > 0 ? '> 0' : '< 0'}, the parabola opens ${correctAnswer}.`;
		} else {
			feedback = `Incorrect. Look at how the value of 'a' affects the graph's shape.`;
		}
	}

	let arraySize = 10;
	let sortingAlgorithm = 'bubble';
	let array = [];
	let sortingSteps = [];
	let currentStep = 0;
	let isSorting = false;

	function generateArray() {
		array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100));
		sortingSteps = [array.slice()];
		currentStep = 0;
	}

	function bubbleSort(arr) {
		const steps = [arr.slice()];
		const n = arr.length;
		for (let i = 0; i < n - 1; i++) {
			for (let j = 0; j < n - i - 1; j++) {
				if (arr[j] > arr[j + 1]) {
					[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
					steps.push(arr.slice());
				}
			}
		}
		return steps;
	}

	function selectionSort(arr) {
		const steps = [arr.slice()];
		const n = arr.length;
		for (let i = 0; i < n - 1; i++) {
			let minIdx = i;
			for (let j = i + 1; j < n; j++) {
				if (arr[j] < arr[minIdx]) {
					minIdx = j;
				}
			}
			if (minIdx !== i) {
				[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
				steps.push(arr.slice());
			}
		}
		return steps;
	}

	async function startSorting() {
		isSorting = true;
		sortingSteps =
			sortingAlgorithm === 'bubble' ? bubbleSort(array.slice()) : selectionSort(array.slice());
		for (currentStep = 0; currentStep < sortingSteps.length; currentStep++) {
			await new Promise((resolve) => setTimeout(resolve, 500));
			if (!isSorting) break;
		}
		isSorting = false;
	}

	function stopSorting() {
		isSorting = false;
	}

	function checkAnswerCompSci() {
		const correctAnswer = sortingAlgorithm === 'bubble' ? 'quadratic' : 'quadratic';
		if (selectedAnswer === correctAnswer) {
			feedback = `Correct! The ${sortingAlgorithm === 'bubble' ? 'Bubble Sort' : 'Selection Sort'} algorithm has a time complexity of O(n²).`;
		} else {
			feedback = `Incorrect. Review the time complexity of the ${sortingAlgorithm === 'bubble' ? 'Bubble Sort' : 'Selection Sort'} algorithm.`;
		}
	}

	generateArray();

	let baseNote = 'C4';
	let interval = 'perfectFifth';

	const noteFrequencies = {
		C4: 261.63,
		'C#4': 277.18,
		D4: 293.66,
		'D#4': 311.13,
		E4: 329.63,
		F4: 349.23,
		'F#4': 369.99,
		G4: 392.0,
		'G#4': 415.3,
		A4: 440.0,
		'A#4': 466.16,
		B4: 493.88,
		C5: 523.25
	};

	const intervals = {
		minorSecond: 1,
		majorSecond: 2,
		minorThird: 3,
		majorThird: 4,
		perfectFourth: 5,
		perfectFifth: 7,
		minorSixth: 8,
		majorSixth: 9,
		minorSeventh: 10,
		majorSeventh: 11,
		octave: 12
	};

	onMount(() => {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
	});

	function playInterval() {
		const baseFreq = noteFrequencies[baseNote];
		const intervalSemitones = intervals[interval];
		const intervalFreq = baseFreq * Math.pow(2, intervalSemitones / 12);

		playNote(baseFreq, 0);
		playNote(intervalFreq, 0.5);
	}

	function playNote(frequency, startTime) {
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.type = 'sine';
		oscillator.frequency.value = frequency;

		gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
		gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + startTime + 0.01);
		gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + startTime + 0.5);

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.start(audioContext.currentTime + startTime);
		oscillator.stop(audioContext.currentTime + startTime + 0.5);
	}

	function checkAnswerMusic() {
		if (selectedAnswer === interval) {
			feedback = `Correct! The interval played was indeed a ${interval.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
		} else {
			feedback = `Incorrect. Listen carefully and try again. The interval played was a ${interval.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
		}
	}

	let numCoins = 1;
	let numFlips = 100;
	let results = [];
	let headsCount = 0;
	let tailsCount = 0;
	let canvas;
	let ctx;

	onMount(() => {
		ctx = canvas.getContext('2d');
		simulateFlips();
	});

	function simulateFlips() {
		results = [];
		headsCount = 0;
		tailsCount = 0;

		for (let i = 0; i < numFlips; i++) {
			let flips = [];
			for (let j = 0; j < numCoins; j++) {
				flips.push(Math.random() < 0.5 ? 'H' : 'T');
			}
			const allHeads = flips.every((flip) => flip === 'H');
			results.push(allHeads);
			if (allHeads) headsCount++;
			else tailsCount++;
		}

		drawGraph2();
	}

	function drawGraph2() {
		ctx.clearRect(0, 0, 300, 150);
		ctx.fillStyle = 'blue';
		ctx.fillRect(0, 0, 150, 150 - (headsCount / numFlips) * 150);
		ctx.fillStyle = 'red';
		ctx.fillRect(150, 0, 150, 150 - (tailsCount / numFlips) * 150);

		ctx.fillStyle = 'black';
		ctx.font = '12px Arial';
		ctx.fillText(`All Heads: ${((headsCount / numFlips) * 100).toFixed(2)}%`, 10, 140);
		ctx.fillText(`Not All Heads: ${((tailsCount / numFlips) * 100).toFixed(2)}%`, 160, 140);
	}

	function checkAnswerMath2() {
		const expectedProbability = Math.pow(0.5, numCoins);
		const actualProbability = headsCount / numFlips;
		const isClose = Math.abs(actualProbability - expectedProbability) < 0.1;

		if (selectedAnswer === 'yes' && isClose) {
			feedback = 'Correct! The simulated probability is close to the expected probability.';
		} else if (selectedAnswer === 'no' && !isClose) {
			feedback =
				'Correct! The simulated probability differs significantly from the expected probability. This can happen due to randomness, especially with a small number of flips.';
		} else {
			feedback = `Incorrect. The expected probability of all heads with ${numCoins} coin(s) is ${(expectedProbability * 100).toFixed(2)}%. The simulated probability is ${(actualProbability * 100).toFixed(2)}%.`;
		}
	}

	$: {
		if (ctx) simulateFlips();
	}

	let audioContext;
	let progression = ['C', 'Am', 'F', 'G'];
	let currentChord = 0;
	let isPlaying = false;
	let selectedAnswer = '';
	let feedback = '';

	const chords = {
		C: [261.63, 329.63, 392.0],
		Am: [220.0, 261.63, 329.63],
		F: [349.23, 440.0, 523.25],
		G: [392.0, 492.0, 587.33],
		Dm: [293.66, 349.23, 440.0],
		Em: [329.63, 392.0, 493.88]
	};

	onMount(() => {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
	});

	function playChord(chord, duration) {
		const now = audioContext.currentTime;
		chord.forEach((frequency) => {
			const oscillator = audioContext.createOscillator();
			const gainNode = audioContext.createGain();

			oscillator.type = 'sine';
			oscillator.frequency.value = frequency;

			gainNode.gain.setValueAtTime(0.3, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration - 0.1);

			oscillator.connect(gainNode);
			gainNode.connect(audioContext.destination);

			oscillator.start(now);
			oscillator.stop(now + duration);
		});
	}

	async function playProgression() {
		isPlaying = true;
		for (let i = 0; i < progression.length; i++) {
			currentChord = i;
			playChord(chords[progression[i]], 1);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			if (!isPlaying) break;
		}
		currentChord = 0;
		isPlaying = false;
	}

	function stopProgression() {
		isPlaying = false;
	}

	function checkAnswerMusic2() {
		if (selectedAnswer === progression[progression.length - 1]) {
			feedback = "Correct! You've identified the last chord in the progression.";
		} else {
			feedback = `Incorrect. The last chord in the progression is ${progression[progression.length - 1]}.`;
		}
	}

	function updateProgression(index, value) {
		progression[index] = value;
		progression = progression; // trigger reactivity
	}
</script>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Pendulum Period Test</h2>

	<div class="mb-4">
		<Label for="length-select" class="mb-2">Select Pendulum Length:</Label>
		<Select id="length-select" class="mt-2" on:change={handleLengthChange}>
			<option value="0.5">0.5 m</option>
			<option value="1" selected>1 m</option>
			<option value="1.5">1.5 m</option>
			<option value="2">2 m</option>
		</Select>
	</div>

	<div class="mb-4">
		<Button on:click={toggleAnimation}>{isAnimating ? 'Stop' : 'Start'} Animation</Button>
	</div>

	<div class="relative mb-4 h-64">
		<div class="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 transform bg-gray-300"></div>
		<div
			class="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 transform rounded-full bg-red-500"
			style="transform: rotate({pendulumAngle}deg) translateY({pendulumLength * 50}px);"
		></div>
	</div>

	<div class="mb-4">
		<p>Current period: {period.toFixed(2)} seconds</p>
	</div>

	<div class="mb-4">
		<p class="mb-2">How does increasing the pendulum length affect its period?</p>
		<Radio name="answer" value="shorter" bind:group={selectedAnswer}
			>The period becomes shorter</Radio
		>
		<Radio name="answer" value="longer" bind:group={selectedAnswer}>The period becomes longer</Radio
		>
		<Radio name="answer" value="same" bind:group={selectedAnswer}>The period remains the same</Radio
		>
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswer}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">pH Level Test</h2>

	<div class="mb-4">
		<Label for="ph-slider" class="mb-2">Adjust pH Level:</Label>
		<Range id="ph-slider" min="0" max="14" step="0.1" bind:value={phLevel} />
	</div>

	<div class="mb-4">
		<div class="h-20 w-full" style="background-color: {getColor(phLevel)};">
			<p class="pt-8 text-center font-bold">pH: {phLevel.toFixed(1)}</p>
		</div>
	</div>

	<div class="mb-4">
		<p class="mb-2">What type of solution does this pH level indicate?</p>
		<Radio name="answer" value="acid" bind:group={selectedAnswer}>Acidic</Radio>
		<Radio name="answer" value="neutral" bind:group={selectedAnswer}>Neutral</Radio>
		<Radio name="answer" value="base" bind:group={selectedAnswer}>Basic (Alkaline)</Radio>
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerPH}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Photosynthesis Simulator</h2>

	<div class="mb-4">
		<Label for="light-slider" class="mb-2">Light Intensity:</Label>
		<Range id="light-slider" min="0" max="100" bind:value={lightIntensity} />
	</div>

	<div class="mb-4">
		<Label for="co2-slider" class="mb-2">CO2 Level:</Label>
		<Range id="co2-slider" min="0" max="100" bind:value={co2Level} />
	</div>

	<div class="mb-4">
		<Label for="water-slider" class="mb-2">Water Availability:</Label>
		<Range id="water-slider" min="0" max="100" bind:value={waterLevel} />
	</div>

	<div class="mb-4">
		<p>Photosynthesis Rate: {photosynthesisRate}%</p>
		<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
			<div class="h-2.5 rounded-full bg-green-600" style="width: {photosynthesisRate}%"></div>
		</div>
	</div>

	<div class="mb-4">
		<p class="mb-2">Which factors are essential for photosynthesis? (Select all that apply)</p>
		<Checkbox value="light" bind:group={selectedFactors}>Light</Checkbox>
		<Checkbox value="co2" bind:group={selectedFactors}>Carbon Dioxide (CO2)</Checkbox>
		<Checkbox value="water" bind:group={selectedFactors}>Water</Checkbox>
		<Checkbox value="oxygen" bind:group={selectedFactors}>Oxygen</Checkbox>
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerPhotosynthesis}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Simple Circuit Simulator</h2>

	<div class="mb-4">
		<Label for="voltage-slider" class="mb-2">Voltage (V):</Label>
		<Range id="voltage-slider" min="1" max="12" bind:value={voltage} />
	</div>

	<div class="mb-4">
		<Label for="resistance-slider" class="mb-2">Resistance (Ω):</Label>
		<Range id="resistance-slider" min="10" max="1000" bind:value={resistance} />
	</div>

	<div class="mb-4">
		<p>Current: {current.toFixed(3)} A</p>
		<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
			<div class="h-2.5 rounded-full bg-blue-600" style="width: {(current / 0.1) * 100}%"></div>
		</div>
	</div>

	<div class="mb-4">
		<p class="mb-2">How does increasing the resistance affect the current?</p>
		<Radio name="answer" value="direct" bind:group={selectedAnswer}>Current increases</Radio>
		<Radio name="answer" value="inverse" bind:group={selectedAnswer}>Current decreases</Radio>
		<Radio name="answer" value="no-effect" bind:group={selectedAnswer}>No effect on current</Radio>
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerCircuit}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Quadratic Function Explorer</h2>

	<div class="mb-4">
		<Label for="a-slider" class="mb-2">a:</Label>
		<Range id="a-slider" min="-3" max="3" step="0.1" bind:value={a} />
	</div>

	<div class="mb-4">
		<Label for="b-slider" class="mb-2">b:</Label>
		<Range id="b-slider" min="-5" max="5" step="0.5" bind:value={b} />
	</div>

	<div class="mb-4">
		<Label for="c-slider" class="mb-2">c:</Label>
		<Range id="c-slider" min="-5" max="5" step="0.5" bind:value={c} />
	</div>

	<p class="mb-2">Equation: {equation}</p>

	<canvas bind:this={canvas} width="300" height="300" class="mb-4 border border-gray-300"></canvas>

	<div class="mb-4">
		<p class="mb-2">In which direction does the parabola open?</p>
		<Radio name="answer" value="upward" bind:group={selectedAnswer}>Upward</Radio>
		<Radio name="answer" value="downward" bind:group={selectedAnswer}>Downward</Radio>
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerMath}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Sorting Algorithm Visualizer</h2>

	<div class="mb-4">
		<Label for="size-select" class="mb-2">Array Size:</Label>
		<Select id="size-select" on:change={generateArray} bind:value={arraySize}>
			<option value="5">5</option>
			<option value="10">10</option>
			<option value="15">15</option>
		</Select>
	</div>

	<div class="mb-4">
		<Label for="algorithm-select" class="mb-2">Sorting Algorithm:</Label>
		<Select id="algorithm-select" bind:value={sortingAlgorithm}>
			<option value="bubble">Bubble Sort</option>
			<option value="selection">Selection Sort</option>
		</Select>
	</div>

	<div class="mb-4">
		<Button on:click={startSorting} disabled={isSorting}>Start Sorting</Button>
		<Button on:click={stopSorting} disabled={!isSorting}>Stop Sorting</Button>
		<Button on:click={generateArray} disabled={isSorting}>Generate New Array</Button>
	</div>

	<div class="mb-4 flex h-64 items-end">
		{#each sortingSteps[currentStep] || [] as number, i}
			<div class="w-8 bg-blue-500" style="height: {number}%;"></div>
		{/each}
	</div>

	<div class="mb-4">
		<p class="mb-2">What is the time complexity of this sorting algorithm?</p>
		<Radio name="answer" value="linear" bind:group={selectedAnswer}>O(n) - Linear</Radio>
		<Radio name="answer" value="logarithmic" bind:group={selectedAnswer}
			>O(log n) - Logarithmic</Radio
		>
		<Radio name="answer" value="quadratic" bind:group={selectedAnswer}>O(n²) - Quadratic</Radio>
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerCompSci}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Music Interval Trainer</h2>

	<div class="mb-4">
		<Label for="base-note-select" class="mb-2">Base Note:</Label>
		<Select id="base-note-select" bind:value={baseNote}>
			{#each Object.keys(noteFrequencies) as note}
				<option value={note}>{note}</option>
			{/each}
		</Select>
	</div>

	<div class="mb-4">
		<Label for="interval-select" class="mb-2">Interval:</Label>
		<Select id="interval-select" bind:value={interval}>
			{#each Object.keys(intervals) as int}
				<option value={int}>{int.replace(/([A-Z])/g, ' $1').toLowerCase()}</option>
			{/each}
		</Select>
	</div>

	<div class="mb-4">
		<Button on:click={playInterval}>Play Interval</Button>
	</div>

	<div class="mb-4">
		<p class="mb-2">What interval did you hear?</p>
		{#each Object.keys(intervals) as int}
			<Radio name="answer" value={int} bind:group={selectedAnswer}
				>{int.replace(/([A-Z])/g, ' $1').toLowerCase()}</Radio
			>
		{/each}
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerMusic}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Coin Flip Probability Simulator</h2>

	<div class="mb-4">
		<Label for="coins-slider" class="mb-2">Number of Coins:</Label>
		<Range id="coins-slider" min="1" max="5" bind:value={numCoins} />
	</div>

	<div class="mb-4">
		<Label for="flips-slider" class="mb-2">Number of Flips:</Label>
		<Range id="flips-slider" min="100" max="10000" step="100" bind:value={numFlips} />
	</div>

	<canvas bind:this={canvas} width="300" height="150" class="mb-4 border border-gray-300"></canvas>

	<p class="mb-2">Probability of all heads: {(Math.pow(0.5, numCoins) * 100).toFixed(2)}%</p>
	<p class="mb-2">Simulated probability: {((headsCount / numFlips) * 100).toFixed(2)}%</p>

	<div class="mb-4">
		<p class="mb-2">Does the simulated probability match the expected probability?</p>
		<Radio name="answer" value="yes" bind:group={selectedAnswer}>Yes, it's close</Radio>
		<Radio name="answer" value="no" bind:group={selectedAnswer}
			>No, it's significantly different</Radio
		>
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerMath2}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>

<Card>
	<h2 class="mb-4 text-2xl font-bold">Chord Progression Trainer</h2>

	{#each progression as chord, i}
		<div class="mb-4">
			<Label for="chord-select-{i}" class="mb-2">Chord {i + 1}:</Label>
			<Select
				id="chord-select-{i}"
				bind:value={chord}
				on:change={() => updateProgression(i, chord)}
			>
				{#each Object.keys(chords) as chordName}
					<option value={chordName}>{chordName}</option>
				{/each}
			</Select>
		</div>
	{/each}

	<div class="mb-4">
		<Button on:click={playProgression} disabled={isPlaying}>Play Progression</Button>
		<Button on:click={stopProgression} disabled={!isPlaying}>Stop</Button>
	</div>

	<div class="mb-4 flex justify-around">
		{#each progression as chord, i}
			<div class={`border p-2 ${currentChord === i ? 'bg-blue-200' : ''}`}>{chord}</div>
		{/each}
	</div>

	<div class="mb-4">
		<p class="mb-2">What is the last chord in the progression?</p>
		{#each Object.keys(chords) as chordName}
			<Radio name="answer" value={chordName} bind:group={selectedAnswer}>{chordName}</Radio>
		{/each}
	</div>

	<div class="mb-4">
		<Button on:click={checkAnswerMusic2}>Submit Answer</Button>
	</div>

	{#if feedback}
		<Alert color="blue">{feedback}</Alert>
	{/if}
</Card>
