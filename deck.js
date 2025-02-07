const SUITS = ['♣','♦','♥','♠'];
const VALUES = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export class Deck {
    constructor(){
        this.cards = freshDeck(5);
    }
    shuffle(){
        for(let i = this.cards.length-1; i>0; i--){
            const newIndex = Math.floor(Math.random()*(i+1));
            [this.cards[i], this.cards[newIndex]]=[this.cards[newIndex],this.cards[i]];
        }
    }
    dealCard(){
        if(this.cards.length < 20) this.cards=freshDeck(3);
        return this.cards.pop();
        // return deck.pop();
    }
}
export class Card {
    constructor(suit, value){
        this.suit = suit;
        this.value = value;
        this.strength = getStrength(this.value);
    }
    get color(){
        return this.suit==='♣' || this.suit==='♠' ? 'black' : 'red'
    }
    getHTML(){
        const cardDiv=document.createElement('div');
        cardDiv.innerText=this.suit;
        cardDiv.classList.add('card', this.color);
        cardDiv.value={value: this.value, strength: getStrength(this.value)};
        cardDiv.dataset.value=`${this.value} ${this.suit}`;
        return cardDiv;
    }
    getDealerCard(){
        const cardDiv=document.createElement('div');
        cardDiv.classList.add('card','dealer-card');
        const dealerCard = new Card(this.suit, this.value);
        return {cardDiv, dealerCard};
    }
}
function freshDeck(num){
    let decks=new Array();
    let deck=new Array();
    for(let i=0; i<num;i++){
        deck =SUITS.flatMap( suit => {
            return VALUES.map(value=> {
                return new Card(suit, value);
            });
        });
        decks = decks.concat(deck);
    }
    // console.log(decks.length)
    return decks;
}
function getStrength(value){
    let strength;
    // console.log(value)
    if(value==='J'||value==='Q'||value==='K') strength=10;
    else if(value==='A') strength=11;
    else strength=value;
    
    strength=Number(strength);
    // console.log(strength)
    // console.log(typeof strength)
    return strength;
}
// //split
//  var deck =[
//     new Card('♥', 'J'),new Card('♥', '9'),new Card('♥', '8'),
//     new Card('♥', 'J'),new Card('♥', '9'),new Card('♥', '8'),
//     new Card('♥', 'Q'),new Card('♥', 'A'),new Card('♥', '5'),
//     new Card('♥', 'J'),new Card('♥', '9'),new Card('♥', '8'),
//     new Card('♥', '6'),new Card('♥', '7'),new Card('♥', '5'),new Card('♥', '8'),
//     new Card('♥', 'K'),new Card('♥', '2'),new Card('♥', '2'),new Card('♥', '2'),
//  ]
//  split black jack 2
//  var deck =[
//     new Card('♥', 'Q'),new Card('♥', 'A'),new Card('♥', '5'),
//     new Card('♥', 'J'),new Card('♥', '9'),new Card('♥', '8'),
//     new Card('♥', 'K'),new Card('♥', '7'),new Card('♥', 'K'),new Card('♥', '2'),
//     new Card('♥', 'K'),new Card('♥', 'A'),new Card('♥', '2'),new Card('♥', 'A'),
//  ]
//  //split blackjack 1
//  var deck =[
//     new Card('♥', 'Q'),new Card('♥', 'A'),new Card('♥', '5'),
//     new Card('♥', 'J'),new Card('♥', '9'),new Card('♥', '8'),
//     new Card('♥', 'J'),new Card('♥', '7'),new Card('♥', '2'),new Card('♥', 'K'),
//     new Card('♥', 'Q'),new Card('♥', 'A'),new Card('♥', '2'),new Card('♥', 'A'),
//  ]
 //split blackjack both
//  var deck =[
//     new Card('♥', 'Q'),new Card('♥', 'A'),new Card('♥', '5'),
//     new Card('♥', 'J'),new Card('♥', '9'),new Card('♥', '8'),
//     new Card('♥', 'K'),new Card('♥', '7'),new Card('♥', 'K'),new Card('♥', 'K'),
//     new Card('♥', 'K'),new Card('♥', 'A'),new Card('♥', '2'),new Card('♥', 'A'),
//  ]