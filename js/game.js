document.addEventListener("DOMContentLoaded", function(){
  /********************************************************************
   * CREATION OF THE ARRAYS (and one Variable)
   */
  
  var suitArray = ["Hearts", "Diamond", "Club", "Spade"];
  var valueArray = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  var gameDealing = null; //Going to be used later for a setInterval, but I need it as a Global Var instead of Local...
  
  /********************************************************************
   * CREATION OF THE CARD CLASS
   */
  
  class Card {
    constructor(csuit, cvalue) {
      this.cardSuit = csuit;
      this.cardValue = cvalue;
    }
    get suitType() {
      return this.cardSuit;
    }
    get valueC() {
      return this.cardValue;
    }
  }
  
  /********************************************************************
   * CREATION OF THE DECK CLASS
   */
  
  class Deck {
    constructor(amo) {
      this.amount = amo;
      this.collection = []; //For storing the Deck
    }
    get getAmou() {
      return this.amount;
    }
    get getCollec() {
      return this.collection;
    }
    set setAmou(change) {
      this.amount = change;
    }
    set collecPush(newThing) {
      this.collection.push(newThing);
    }
    createDeck() { //>>>>>TO CREATE THE WHOLE DECK OF 52 CARDS!!!<<<<<
      //Loop to create the 52 Cards (not including Jokers)
      for(let y = 0; y < 4; y++) { //'y' is to identify the Card Suits
        for(let x = 0; x < 13; x++) { //'x' is to identify the Card Values
          let cardObj = new Card(suitArray[y], valueArray[x]);
          this.collection.push(cardObj);
        }
      }
    }
    shuffleDeck() { //>>>>>TO SHUFFLE THE CARDS IN THE DECK<<<<<
      this.collection.sort(function(a, b){return 0.5 - Math.random()});
    }
  }
  
  /*************CREATE THE DECK ITSELF, SO THAT IT CAN BE USED IN THE REST OF THE CODE*************/
  
  let mainDeck = new Deck(52); //Represents the entire Deck of 52 Cards
  mainDeck.createDeck();
  
  /********************************************************************
   * CREATION OF THE PLAYER DECK CLASS
   */
  
  class playerDeck {
    constructor(amou, nam) {
      this.size = amou;
      this.name = nam;
      this.hand = []; //For storing the Player's hand of cards
    }
    get getAmou() {
      return this.size;
    }
    get getName() {
      return this.name;
    }
    get getHand() {
      return this.hand;
    }
    set setAmou(change) {
      this.size = change;
    }
    set setName(change) {
      this.name = change;
    }
    set setHand(newCardObj) {
      this.hand.push(newCardObj);
    }
    createHand() { //To create the Player's Hand from the Shuffled Deck
      mainDeck.shuffleDeck(); //Shuffles the Deck
      for(let s = 0; s < 26; s++) { 
        this.hand.push(mainDeck.collection.pop()); //Transfers the 26 starting cards from the Shuffled Deck into the Player's Hand
      }
    }
    dealCard(playerName, objectName, snapName) { //To deal a card into the Snap Piles
      //PLAYERNAME is used for making sure the Object exists
      //OBJECTNAME is used for handling the Object itself
      //SNAPNAME is used for handling the SnapDeck Object
      
      if(playerName === this.name) { //To ensure the name is found
        snapName.pile.unshift(objectName.hand.shift()); //To transfer the top card of the Player's Hand into the pile
        
      } else {
        console.log("Error, Player Name is not found.")
      }
    }
  }
  
  /********************************************************************
   * CREATION OF THE SNAP DECK CLASS
   */
  
  class snapDeck {
    constructor(amoun) {
      this.size = amoun;
      this.pile = []; //To store the cards once deal from Player's Hand
    }
    get getSize() {
      return this.size;
    }
    get getPile() {
      return this.pile;
    }
    set setSize(change) {
      this.size = change;
    }
    set setPile(newCard) {
      this.pile.push(newCard);
    }
  }
  
  /********************************************************************
   * FUNCTIONAILTY OF THE GAME
   */
  
  //>>>>>>>>>>>>>>CREATION OF THE OBJECTS<<<<<<<<<<<<<<
  let playerOne = new playerDeck(26, "P1");
  let playerTwo = new playerDeck(26, "P2");
  let p1SnapPile = new snapDeck(0);
  let p2SnapPile = new snapDeck(0);
  
  //>>>>>>>>>>>>>>FUNCTION FOR WHEN start game BUTTON HAS BEEN PRESSED<<<<<<<<<<<<<<
  document.querySelector("#startGameButton").addEventListener("click", function() {
    mainDeck.shuffleDeck(); //To ensure the Deck is shuffled and randomised.
    playerOne.createHand();
    playerTwo.createHand();
    
    document.querySelector("#startGameButton").style.display = "none";
    document.querySelector("#resetGameButton").style.display = "initial";
    
    document.querySelector("#p1HandAmou").innerText = "You currently have "+playerOne.hand.length+" cards in your hand."
    document.querySelector("#p2HandAmou").innerText = "You currently have "+playerTwo.hand.length+" cards in your hand."
    
    gameDealing = setInterval(gameDealCards, 3000);
    
    //>>>>>>>>>>>>>>TO PAUSE WHEN CALL BUTTON IS PRESSED<<<<<<<<<<<<<<
    document.addEventListener("keydown", async function(event){
      var keyPressed = event.which; //Which key was pressed?
      var currentP1Card = p1SnapPile.pile[0]; //Currently played Player One card
      var currentP2Card = p2SnapPile.pile[0]; //Cuurently played Player Two card
      
      //FOR MAKING SURE THERE ARE CARDS TO CHECK IN MIDDLE PILES
      if(!currentP1Card || !currentP2Card) {
        return;
      } else if(keyPressed === 65) { //PLAYER ONE
        clearInterval(gameDealing); //STOP DEALING CARDS
        
        //CHECK IF CARDS MATCH VALUES
        if(currentP1Card.cardValue === currentP2Card.cardValue) {
          document.querySelector("#fieldCenterText").innerText = "Player One claimed Snap!";
          await p1SnapWasCalled();
          document.querySelector("#p1SnapCard").innerText = " ";
          document.querySelector("#p2SnapCard").innerText = " ";
          gameDealing = setInterval(gameDealCards, 3000);
        } else {
          //Player One gets all the dealt cards for being a failure! :P
          document.querySelector("#fieldCenterText").innerText = "Player One claimed Snap, but there's no match! Continuing game!"
          await p2SnapWasCalled();
          document.querySelector("#p1SnapCard").innerText = " ";
          document.querySelector("#p2SnapCard").innerText = " ";
          gameDealing = setInterval(gameDealCards, 3000);
        }
      } else if(keyPressed === 76) { //PLAYER TWO
        clearInterval(gameDealing); //STOP DEALING CARDS
        
        //CHECK IF CARDS MATCH VALUES
        if(currentP2Card.cardValue === currentP1Card.cardValue) {
          document.querySelector("#fieldCenterText").innerText = "Player Two claimed Snap!";
          await p2SnapWasCalled();
          document.querySelector("#p2SnapCard").innerText = " ";
          document.querySelector("#p1SnapCard").innerText = " ";
          gameDealing = setInterval(gameDealCards, 3000);
        } else {
          //Player Two gets all the dealt cards for failing at Snap! :P
          document.querySelector("#fieldCenterText").innerText = "Player Two claimed Snap, but there's no match! Continuing game!"
          await p1SnapWasCalled();
          document.querySelector("#p2SnapCard").innerText = " ";
          document.querySelector("#p1SnapCard").innerText = " ";
          gameDealing = setInterval(gameDealCards, 3000);
        }
      }
      
      //>>>>>>>>>>>>>>FUNCTIONS TO TRANSFER CARDS ONCE SNAP HAS BEEN CALLED<<<<<<<<<<<<<<
      function p1SnapWasCalled() {
        while(p1SnapPile.pile.length > 0) {
          playerOne.hand.push(p1SnapPile.pile.shift());
        }
        while(p2SnapPile.pile.length > 0) {
          playerOne.hand.push(p2SnapPile.pile.shift());
        }
      }
      
      function p2SnapWasCalled() {
        while(p2SnapPile.pile.length > 0) {
          playerTwo.hand.push(p2SnapPile.pile.shift());
        }
        while(p1SnapPile.pile.length > 0) {
          playerTwo.hand.push(p1SnapPile.pile.shift());
        }
      }
      
    })
    
  });
  
  //>>>>>>>>>>>>>>FUNCTION FOR DEALING CARDS INTO SNAP PILES<<<<<<<<<<<<<<
  //This is a timed Function, and will be called every 3 seconds.
  //It should have a pause/end, whenever one of the Players presses their Call Snap button (either A or L)
  var playerToDeal = 1; //To deal one card at a time instead of two.
  
  function gameDealCards() {
    if(playerToDeal === 1) {
      //IF there are cards in the hand
      if(playerOne.hand.length >= 1 && playerOne.hand.length <= 51) {
        document.querySelector("#p1SnapCard").innerText = playerOne.hand[0].cardValue+" of "+playerOne.hand[0].cardSuit;
        playerOne.dealCard("P1", playerOne, p1SnapPile);
        document.querySelector("#p1HandAmou").innerText = "You currently have "+playerOne.hand.length+" cards in your hand.";
        playerToDeal += 1; 
      } else if(playerOne.hand.length === 52) {
        //IF the Player has all 52 Cards in their Hand, THEY WIN THE GAME
        clearInterval(gameDealing);
        document.querySelector("#fieldCenterText").innerText = "Player One has all the cards, meaning Player One has Won!!!";
        document.querySelector("#p1HandAmou").innerText = "You currently have 52 cards in your hand!";
        alert("Player One wins!");
      } else if(playerOne.hand.length === 0) {
        //ELSE IF there are NO cards in the hand
        document.querySelector("#p1HandAmou").innerText = "You have no cards in your hand!";
        playerToDeal += 1;
      }
    } else if(playerToDeal === 2) {
      //IF there are cards in the hand
      if(playerTwo.hand.length >= 1 && playerTwo.hand.length <= 51) {
        document.querySelector("#p2SnapCard").innerText = playerTwo.hand[0].cardValue+" of "+playerTwo.hand[0].cardSuit;
        playerTwo.dealCard("P2", playerTwo, p2SnapPile);
        document.querySelector("#p2HandAmou").innerText = "You currently have "+playerTwo.hand.length+" cards in your hand.";
        playerToDeal -= 1;
      } else if(playerTwo.hand.length === 52) {
        //IF the Player has all 52 Cards in their hand, They WIN!
        clearInterval(gameDealing);
        document.querySelector("#fieldCenterText").innerText = "Player Two has all the cards, meaning Player Two has Won!!!";
        document.querySelector("#p2HandAmou").innerText = "You currently have 52 cards in your hand!";
        alert("Player Two wins!");
      } else if(playerTwo.hand.length === 0) {
        //ELSE IF there are NO cards in the hand
        document.querySelector("#p2HandAmou").innerText = "You have no cards in your hand!";
        playerToDeal -= 1;
      }
    }
  
  };
  
  //>>>>>>>>>>>>>>FUNCTION TO RELOAD THE GAME<<<<<<<<<<<<<<
  document.querySelector("#resetGameButton").addEventListener("click", function() {
    location.reload(true);
    
  });
  
});