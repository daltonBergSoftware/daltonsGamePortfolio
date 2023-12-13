document.addEventListener('DOMContentLoaded', () => {
  let playerHand = [];
  let dealerHand = [];
  let deck = [];

  const startGameBtn = document.getElementById('start-game');
  const hitBtn = document.getElementById('hit');
  const standBtn = document.getElementById('stand');
  const playerHandDiv = document.getElementById('player-hand');
  const dealerHandDiv = document.getElementById('dealer-hand');
  const resultDiv = document.getElementById('game-result');

  startGameBtn.addEventListener('click', startGame);
  hitBtn.addEventListener('click', playerHit);
  standBtn.addEventListener('click', dealerPlay);

  function createDeck() {
    let suits = ['clubs', 'diamonds', 'hearts', 'spades'];
    let values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
    deck = [];
    for (let suit of suits) {
      for (let value of values) {
        deck.push(`${value}_of_${suit}`);
      }
    }
    shuffleDeck(deck);
  }

  function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }

  function startGame() {
      playerHand = [];
      dealerHand = [];
      createDeck();
      playerHand.push(deck.pop(), deck.pop());
      dealerHand.push(deck.pop(), deck.pop());

      // Store the dealer's second card and replace it with the back of a card
      dealerSecondCard = dealerHand[1];
      dealerHand[1] = 'backOfCard';

      updateDisplay();

      document.getElementById('dealer-label').classList.remove('hidden');
      document.getElementById('player-label').classList.remove('hidden');
      document.getElementById('start-game').style.display = 'none';
    document.getElementById('bet-amount').disabled = true;
  }

  function playerHit() {
    playerHand.push(deck.pop());
    updateDisplay();
  }

  function dealerPlay() {
      // Replace the back of the card with the actual card
      dealerHand[1] = dealerSecondCard;

      while (getHandValue(dealerHand) < 17) {
          dealerHand.push(deck.pop());
      }
      updateDisplay();

      // Determine the outcome of the game
      determineOutcome();
  }

 /*
  function revealDealerSecondCard() {
    if (dealerHand.length > 1) {
      dealerHand[1] = dealerHand[1].replace("backOfCard", dealerHand[1]); // Replace with the actual second card
    }
  }
  */

  function updateDisplay() {
      renderHand(playerHand, playerHandDiv, false);
      renderHand(dealerHand, dealerHandDiv, false); // No longer hiding the second card
  }

  function renderHand(hand, handDiv, hideSecondCard) {
      handDiv.innerHTML = '';
      hand.forEach((card, index) => {
          let cardImg = document.createElement('img');
          cardImg.src = card === 'backOfCard' ? 'backOfCard.png' : `pokerCards/${card}.png`;
          cardImg.classList.add('card');
          handDiv.appendChild(cardImg);
      });
  }

  function getCardNumericValue(card) {
    switch(card.split('_')[0]) {
      case 'ace':
        return 11; // Aces can be 1 or 11, will handle this later
      case '2': return 2;
      case '3': return 3;
      case '4': return 4;
      case '5': return 5;
      case '6': return 6;
      case '7': return 7;
      case '8': return 8;
      case '9': return 9;
      case '10': 
      case 'jack': 
      case 'queen': 
      case 'king':
        return 10;
      default:
        throw new Error('Unknown card value: ' + card);
    }
  }

  function getHandValue(hand) {
    let value = 0;
    let aces = 0;

    for (let card of hand) {
      let cardValue = getCardNumericValue(card);
      if (cardValue === 11) {
        aces += 1;
      }
      value += cardValue;
    }

    while (value > 21 && aces > 0) {
      value -= 10; // Reduce the ace from 11 to 1
      aces -= 1;
    }

    return value;
  }

  function determineOutcome() {
    const playerScore = getHandValue(playerHand);
    const dealerScore = getHandValue(dealerHand);
    let result = '';

    if (playerScore > 21) {
        result = 'You busted';
    } else if (playerScore === 21 && playerHand.length === 2) {
        result = 'You got Blackjack!';
    } else if (playerScore === dealerScore) {
        result = 'Push';
    } else if (playerScore > dealerScore || dealerScore > 21) {
        result = 'You won';
    } else {
        result = 'You Lose';
    }

    document.getElementById('game-result').textContent = result;
    addNextRoundButton();

    if (document.getElementById('bet-amount').style.backgroundColor === 'green') {
      if (result === 'You got Blackjack!') {
          totalMoney += currentBet * 1.5;
      } else if (result === 'You won') {
          totalMoney += currentBet;
      } else if (result === 'You Lose' || result === 'You busted') {
          totalMoney -= currentBet;
      } 
    }
    document.getElementById('total-money').textContent = `Total Money: $${totalMoney}`;
    addRestartGameButton();
    document.getElementById('bet-amount').disabled = false;
    document.getElementById('bet-amount').style.backgroundColor = ''; // Reset bet input color
    document.getElementById('bet-amount').value = '';
  }

  function addNextRoundButton() {
      const nextRoundBtn = document.createElement('button');
      nextRoundBtn.id = 'next-round';
      nextRoundBtn.textContent = 'Next Round';
      nextRoundBtn.addEventListener('click', startNextRound);
      document.querySelector('.buttons').appendChild(nextRoundBtn);
  }
  
  function startNextRound() {
      playerHand = [];
      dealerHand = [];
      document.getElementById('game-result').textContent = '';
      document.getElementById('dealer-hand').innerHTML = '';  // Clear dealer's cards
      document.getElementById('player-hand').innerHTML = '';  // Clear player's cards
      document.getElementById('bet-amount').disabled = true; // Enable bet input
      

      // Remove the 'Next Round' and 'Restart Game' buttons if they exist
      document.querySelector('#next-round')?.remove();
      document.querySelector('#restart-game')?.remove();

      // Add code to deal new cards and update the display
      createDeck();  // Reinitialize the deck for the next round
      playerHand.push(deck.pop(), deck.pop());
      dealerHand.push(deck.pop(), deck.pop());
      dealerSecondCard = dealerHand[1]; // Store dealer's second card
      dealerHand[1] = 'backOfCard'; // Hide dealer's second card
      updateDisplay();
  }


  function addRestartGameButton() {
      const restartGameBtn = document.createElement('button');
      restartGameBtn.id = 'restart-game';
      restartGameBtn.textContent = 'Restart Game';
      restartGameBtn.addEventListener('click', restartGame);
      document.querySelector('.buttons').appendChild(restartGameBtn);
  }

  function restartGame() {
    // Reset the game to its initial state
    playerHand = [];
    dealerHand = [];
    totalMoney = 100;  // Reset total money to $100
    document.getElementById('total-money').textContent = `Total Money: $${totalMoney}`;
    document.getElementById('game-result').textContent = '';
    document.getElementById('dealer-label').classList.add('hidden');
    document.getElementById('player-label').classList.add('hidden');
    document.getElementById('start-game').style.display = 'inline';
    document.getElementById('bet-amount').value = '';  // Clear the bet amount
    document.getElementById('bet-amount').style.backgroundColor = '';  // Reset bet input color
    document.querySelector('#next-round')?.remove();  // Remove the 'Next Round' button if it exists
    document.querySelector('#restart-game')?.remove();  // Remove the 'Restart Game' button
    dealerHandDiv.innerHTML = '';
    playerHandDiv.innerHTML = '';
  }



  let totalMoney = 100;
  let currentBet = 0;
  document.getElementById('place-bet').addEventListener('click', placeBet);
  document.getElementById('bet-amount').addEventListener('input', handleBetInput);
  function placeBet() {
      let betInput = document.getElementById('bet-amount');
      currentBet = Math.round(parseFloat(betInput.value));
      if (currentBet <= totalMoney && currentBet > 0) {
          betInput.style.backgroundColor = 'green';
      } else {
          betInput.style.backgroundColor = 'red';
          currentBet = 0;
      }
  }

  function handleBetInput() {
      this.value = Math.round(this.value);
  }



});
