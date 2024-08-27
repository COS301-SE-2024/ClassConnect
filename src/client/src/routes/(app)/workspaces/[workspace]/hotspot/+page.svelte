<!-- <script>
    import { Button } from 'flowbite-svelte';
    let pinPosition = { x: 0, y: 0 };
    let isPinPlaced = false;
  
    function handleImageClick(event) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      pinPosition = { x, y };
      isPinPlaced = true;
    }
  
    function checkAnswer() {
      const correctArea = { x1: 200, y1: 200, x2: 350, y2: 300 };
  
      if (pinPosition.x >= correctArea.x1 && pinPosition.x <= correctArea.x2 &&
          pinPosition.y >= correctArea.y1 && pinPosition.y <= correctArea.y2) {
        alert('Correct!');
      } else {
        console.log('x:' ,pinPosition.x);
        console.log('y:' ,pinPosition.y);
        alert('Incorrect. Try again.');
      }
    }
  </script>
  
  <h1>Where is nose?</h1>
  <button class="image-container" on:click={handleImageClick} on:keydown={handleImageClick}>
    <img src="/images/class-connect-logo.png" alt="Rubik's cube" />
    {#if isPinPlaced}
      <div class="pin" style="left: {pinPosition.x}px; top: {pinPosition.y}px;"></div>
    {/if}
  </button>
  
  <Button on:click={checkAnswer}>Check Answer</Button>
  
  
  <style>
    .image-container {
      position: relative;
      display: inline-block;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
    }
  
    .image-container:focus {
      outline: 2px solid blue; 
    }
  
    .pin {
      position: absolute;
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
  </style>
   -->

   <script>
    import { Button } from 'flowbite-svelte';

    export let data;
	let {role: userRole}=data;
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

    function handleCircleMouseDown() {
        if (userRole === 'lecturer') {
            isDraggingCircle = true;
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
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
        isDraggingCircle = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp)
    }

    function handleRadiusChange(event) {
        if (userRole === 'lecturer') {
            circle.radius = parseInt(event.target.value);
        }
    }

    function checkAnswer() {
        if (userRole === 'student') {
            const dx = pinPosition.x - circle.x;
            const dy = pinPosition.y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= circle.radius) {
                alert('Correct!');
            } else {
                console.log('x:', pinPosition.x);
                console.log('y:', pinPosition.y);
                alert('Incorrect. Try again.');
            }
        }
    }
</script>

<h1>Where is the correct area?</h1>
<button class="image-container" on:click={handleImageClick} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleImageClick(e); }}
    aria-label="Interactive image for setting pins or ranges"
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
            on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCircleMouseDown(); }}
            style="left: {circle.x}px; top: {circle.y}px; width: {circle.radius * 2}px; height: {circle.radius * 2}px;"
        ></div>

        <input type="range" min="10" max="200" value={circle.radius} on:input={handleRadiusChange} />
    {/if}
</button>

{#if userRole === 'student'}
    <Button on:click={checkAnswer}>Check Answer</Button>
{/if}

<style>
    .image-container {
        position: relative;
        display: inline-block;
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
    }

    .image-container:focus {
        outline: 2px solid blue; 
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
        transform: translate(-50%, -50%);
        cursor: move;
    }
</style>
