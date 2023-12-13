document.addEventListener('DOMContentLoaded', () => {
  const bird = document.getElementById('bird');
  let birdBottom = 50; // Starting position from the bottom in viewport height
  let isGameOver = false;
  let gameTimerId;

  function startGame() {
    birdBottom -= 0.5; // Gravity effect
    if (birdBottom < 0) birdBottom = 0; // Prevent bird from falling below the game container
    bird.style.bottom = birdBottom + 'vh';
  }

  function control(e) {
    if (e.keyCode === 32) {
      jump(); // Spacebar key to jump
    }
  }

  function jump() {
    if (birdBottom < 80) birdBottom += 10; // Bird jump height
    bird.style.bottom = birdBottom + 'vh';
  }

  function generatePipe() {
    let pipeLeft = 100; // Start pipes off-screen to the right
    let pipeGapHeight = 15; // Vertical gap between top and bottom pipes in viewport height percentage
    let pipeBottom = Math.random() * (60 - pipeGapHeight) + 15; // Random bottom pipe position

    // Create the bottom pipe with a height that reaches the bottom of the game container
    const bottomPipe = createPipeElement('bottom', pipeLeft, 0);
    bottomPipe.style.height = `${pipeBottom}vh`;

    // Create the top pipe with a height that reaches the top of the game container
    const topPipe = createPipeElement('top', pipeLeft, 100 - pipeGapHeight);
    topPipe.style.height = `${100 - pipeBottom - pipeGapHeight}vh`;

    function movePipe() {
      pipeLeft -= 0.5; // Slower pipe movement
      bottomPipe.style.left = topPipe.style.left = pipeLeft + 'vw';

      if (pipeLeft <= -6) { // When pipes go off-screen to the left
        clearInterval(bottomPipe.timerId);
        topPipe.remove();
        bottomPipe.remove();
      }
    }

    bottomPipe.timerId = topPipe.timerId = setInterval(movePipe, 20);
    if (!isGameOver) setTimeout(generatePipe, 1500); // More frequent pipe generation
  }

  function createPipeElement(className, left, bottom) {
    const pipe = document.createElement('div');
    pipe.classList.add('pipe', className);
    pipe.style.left = left + 'vw';
    pipe.style.bottom = bottom + 'vh';
    gameContainer.appendChild(pipe);
    return pipe;
  }



  function gameOver() {
    clearInterval(gameTimerId);
    isGameOver = true;
    document.removeEventListener('keyup', control);
    document.querySelectorAll('.pipe').forEach(pipe => {
      clearInterval(pipe.timerId);
    });
  }

  document.addEventListener('keyup', control);
  gameTimerId = setInterval(startGame, 20);
  generatePipe();
});
