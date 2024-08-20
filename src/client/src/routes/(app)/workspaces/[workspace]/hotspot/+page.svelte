<script>
    let imageUrl = '/images/depositphotos_5016489-stock-photo-rubiks-cube.jpg';
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
      const correctArea = { x1: 100, y1: 100, x2: 200, y2: 200 };
  
      if (pinPosition.x >= correctArea.x1 && pinPosition.x <= correctArea.x2 &&
          pinPosition.y >= correctArea.y1 && pinPosition.y <= correctArea.y2) {
        alert('Correct!');
      } else {
        alert('Incorrect. Try again.');
      }
    }
  </script>
  
  <button class="image-container" on:click={handleImageClick} on:keydown={handleImageClick}>
    <img src="/images/depositphotos_5016489-stock-photo-rubiks-cube.jpg" alt="Rubik's cube" />
    {#if isPinPlaced}
      <div class="pin" style="left: {pinPosition.x}px; top: {pinPosition.y}px;"></div>
    {/if}
  </button>
  
  <button on:click={checkAnswer}>Check Answer</button>
  
  
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
  