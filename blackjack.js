import {Deck, Card} from "./deck.js"

var bet=5;
var chips=295;

var playerScore = 0;
var dealerScore = 0;

var splitHand1;
var splitHand2;

const player = document.getElementById('player');
const dealer = document.getElementById('dealer');

var isSplit=false;
var isSplitEnd=false;
var doubleFlag=false;

const deck = new Deck(); //5 decks
var hiddenCard;

window.onload=()=>{
    deck.shuffle();
    initGame(); 
}
function initGame(){
    //add page data
    document.getElementById('bet').innerText=bet;
    document.getElementById('chips').innerText=chips;
    //add event listeners
    document.getElementById('deal').addEventListener('click', deal);
    
    document.getElementById('bet').addEventListener('click', incrementBet);
    document.getElementById('chips').addEventListener('click', decrementBet);
}
function checkScore(thePlayer){
    console.log('check score')
    // var playerContainer;
    // if(isDealer) playerContainer = document.getElementById('dealer');
    // else playerContainer = document.getElementById('player');
    var score=0; var aceCount=0;
    console.log(thePlayer.children)

    for(let card of thePlayer.children){
        console.log(card.value)
        // console.log(card)
        // console.log('loop',card.value)
        // console.log(card.value.strength)
        score+=Number(card.value.strength);
        console.log(score)
        if(card.value.strength===11) {
            if(score>21) {
                card.value.strength = 1;
                score-=10;
            }else aceCount+=1;
        }
    }
    // console.log('b', score)
    if(score>21 && aceCount){
        console.log('>21, aceCount')
        const ace = Array.from(thePlayer.children).find(card=>card.value.strength===11);
        score-=10;
        aceCount-=1;
        ace.value.strength=1;
    }
    console.log(score)
    return score;
}

function deal(){ //deal cards and store hidden dealer card;
    //remove bet and deal
    document.getElementById('text').innerText="";
    document.getElementById('hand-text-1')?.remove();
    document.getElementById('hand-text-2')?.remove();
 if(chips+bet > 0){
    document.getElementById('bet').removeEventListener('click', incrementBet);
    document.getElementById('chips').removeEventListener('click', decrementBet);
    document.getElementById('deal').removeEventListener('click', deal);
    //add hit stay double split
    document.getElementById('hit').addEventListener('click', hitWrapper);
    document.getElementById('stay').addEventListener('click', stay);
    document.getElementById('double').addEventListener('click', double);
    document.getElementById('split').addEventListener('click', split);
    while(player.firstChild || dealer.firstChild){
        player.firstChild ? player.removeChild(player.firstChild) : null;
        dealer.firstChild ? dealer.removeChild(dealer.firstChild) : null;
    }
    player.appendChild(deck.dealCard().getHTML());
    const {cardDiv, dealerCard} =  deck.dealCard().getDealerCard();
    dealer.appendChild(cardDiv); //facedown
    player.appendChild(deck.dealCard().getHTML());
    dealer.appendChild(deck.dealCard().getHTML());
    
    hiddenCard = new Card(dealerCard.suit,dealerCard.value );
    
    playerScore=checkScore(player);
    if(playerScore===21){
        chips+=1.5*bet;
        document.getElementById('chips').innerText=chips;
        showDealerCard();
        endHand();
    }else{ 
        if( (dealer.children[1].value.strength===10 && hiddenCard.value==='A') ||
            (dealer.children[1].value.value==='A' && hiddenCard.strength===10)){  
                showDealerCard();
                endHand();
                dealerScore=checkScore(dealer);
            }else document.getElementById('text').innerText="Nobody's home.";            
        }
        document.getElementById('text').innerText+="\nYou have "+playerScore;      
    }
}
function winLoseDraw(playerScore, dealerScore, num){
    let handText=document.getElementById('hand-text-'+num).innerText;
    if(dealerScore <=21){
        if(playerScore > dealerScore){//hand wins
            chips+=bet;
            handText='Hand '+num+' score:'+playerScore+'. Winner!'
        }else if(playerScore < dealerScore){//hand loses
            handText='Hand '+num+' score:'+playerScore+'. You Lost.'
        }else{//push
            handText='Hand '+num+' score:'+playerScore+'. Push'
        } 
    }else{ //dealer busts
        chips+=bet;
        handText='Hand '+num+' score:'+playerScore+'. Winner.'
        document.getElementById('text').innerText+="\nDealer Busts "+dealerScore;
    }
    
}
function endHand(){
    document.getElementById('double').removeEventListener('click', double);
    document.getElementById('split').removeEventListener('click', split);
    document.getElementById('stay').removeEventListener('click', stay);
    let handText1=document.getElementById('hand-text-1');
    let handText2=document.getElementById('hand-text-2');
    let centerText=document.getElementById('text');
    dealerScore=checkScore(dealer);
    if(isSplitEnd){
        isSplitEnd=false;
        document.getElementById('hit').removeEventListener('click', hitSplit2);
        let handScore1=checkScore(splitHand1);
        let handScore2=checkScore(splitHand2);
        if(handScore1 > 21 && handScore2 > 21){ //both bust
            centerText.innerText="Both Hands Bust";
        }else if(handScore1 > 21 || handScore2 > 21){ //one busts
            if(handScore1 > 21) winLoseDraw(handScore2, dealerScore, 2); //hand 1 busts
            else winLoseDraw(handScore1, dealerScore, 1);
        }else{ //neither busts
            if(dealerScore > 21){  //dealer busts
                console.log('dealer busts');
                chips+=bet*2;
                handText1.innerText+=" wins"
                handText2.innerText+=" wins"; 
                centerText.innerText+="Dealer Busts!";
            }else if(dealerScore > handScore1 && dealerScore > handScore2){ // you lose both
                chips-=bet;
                document.getElementById('split-chips').remove();
                centerText.innerText+="\n Dealer wins both";

            }else if(dealerScore > handScore1 || dealerScore > handScore2){ // you lose one
                centerText.innerText="dealer score "+dealerScore;
                if(dealerScore>handScore1){ //hand 1 lose
                    handText1.innerText+=". lose";
                    if(dealerScore<handScore2) handText2.innerText+=". Win";
                    else handText2.innerText+=". Push";
                }else{ // hand 2 lose
                    handText2.innerText="hand2 score "+handScore2+". Lose";
                    if(dealerScore<handScore1) handText1.innerText="hand1 score "+handScore1+". Win";
                    else handText1.innerText="hand1 score "+handScore1+". Win";
                }
            }else if(dealerScore < handScore1 && dealerScore < handScore2) { // you win both
                chips+=bet*2;
                centerText.innerText="dealer score "+dealerScore;
                handText1.innerText="hand1 score "+handScore1+". win";
                handText2.innerText="hand2 score "+handScore2+". Win";
            }
        }
        //update chips DOM
        document.getElementById('split-bet')?.remove();
    }else{ //no split
        document.getElementById('hit').removeEventListener('click', hitWrapper);
        playerScore=checkScore(player);
        if(playerScore > 21){ // player busts
            chips-=bet;
            centerText.innerText="You have "+playerScore+"! Bust!";
            centerText.innerText+="\nDealer Wins."
        }
        else if(dealerScore > 21){  //dealer busts
            chips+=bet;
            centerText.innerText="You have "+ playerScore+". Dealer has "+dealerScore+".";
            centerText.innerText+="\nDealer Busts! You Win!"; 
        }
        else if(playerScore > dealerScore){ //player wins
            chips+=bet;
            centerText.innerText="You have "+playerScore+". Dealer has "+dealerScore+"."
            centerText.innerText+="\nYou Win!"
        }
        else if(dealerScore > playerScore){ //dealer wins
            chips-=bet;
            if(dealerScore === 21 && dealer.children.length==2){
                centerText.innerText="Dealer has BlackJack. You Lose ";
            }else{
                centerText.innerText="You have "+playerScore+"!";
                centerText.innerText+="\nDealer has "+dealerScore+". You Lose.";
            }
        }
        else{ //push
            centerText.innerText+="\n Push";
        }
        if(doubleFlag){ 
            centerText.innerText+="\nCheck your bet! it is doubled!";
            doubleFlag=false;
        }
        
    }
    document.getElementById('chips').innerText=chips;
    
    document.getElementById('deal').addEventListener('click', deal);
    document.getElementById('bet').addEventListener('click', incrementBet);
    document.getElementById('chips').addEventListener('click', decrementBet);
}
function dealerPlay(){
    showDealerCard();
    dealerScore = checkScore(dealer);
    while(dealerScore<=17){ //if dealer has 17 or below
        if(dealerScore===17){ //check for ace
            const hasAce = Array.from(dealer.children).some(card=>card.value.strength===11);
            if(hasAce) dealer.appendChild(deck.dealCard().getHTML());
            else break;
            dealerScore=checkScore(dealer); //update score
        }else{
            dealer.appendChild(deck.dealCard().getHTML()); //hit
            dealerScore=checkScore(dealer); //update score
        }        
    }
    if(dealerScore > 21) document.getElementById('text').innerText=" Dealer Busts "+dealerScore;
    else document.getElementById('text').innerText=" Dealer has "+dealerScore;
    endHand();
}
function hitWrapper(){hit(player)}
function hitSplit1(){hit(splitHand1)}
function hitSplit2(){hit(splitHand2)}
function hit(thePlayer){
    // console.log('hit',playerScore)
    document.getElementById('double').removeEventListener('click', double);
    document.getElementById('split').removeEventListener('click', split);
    //deal the card
    thePlayer.appendChild(deck.dealCard().getHTML());
    // console.log(thePlayer)
    playerScore=checkScore(thePlayer);
    if(playerScore>21) { //bust
        if(isSplit){ //hand 1 bust
            isSplit=false;
            document.getElementById('split-chips')?.remove();
            document.getElementById('hit').removeEventListener('click', hitSplit1);
            let handScore2=checkScore(splitHand2);
            if(handScore2===21){
                showDealerCard();
                endHand(); 
            }  
            else document.getElementById('hit').addEventListener('click', hitSplit2);           
            document.getElementById('hand-text-1').innerText="Hand 1 has "+playerScore+" Bust!";
            document.getElementById('text').innerText="Play Hand 2";
            // document.getElementById('split-bet').remove();
        }
        else if(isSplitEnd){ // hand 2 bust
            let handScore1=checkScore(splitHand1);
            chips-=bet;
            //hand1 has BJ or bust
            if( handScore1>21 || (handScore1===21 && splitHand1.children.length===2 )){
                document.getElementById('hit').removeEventListener('click', hitSplit2);
                document.getElementById('hand-text-2').innerText="Hand 2 has "+playerScore+" Bust!";
                showDealerCard();
                endHand();
            }else dealerPlay(); //hand1 stands so call dealer
            
        }
        else{ //no split bust
            chips-=bet;
            showDealerCard();
            endHand();
        }
        document.getElementById('chips').innerText=chips; 
    }
    else{//no bust
        //hand 1
        if(isSplit && isSplitEnd) document.getElementById('hand-text-1').innerText="Hand 1 has "+playerScore;
        //hand2
        else if(isSplitEnd) document.getElementById('hand-text-2').innerText="Hand 2 has "+playerScore;
        //no split
        else document.getElementById('text').innerText="You have "+playerScore+".";
    }
    
}
function split(){
    if(player.children.length===2 && player.children[0].value.value===player.children[1].value.value){
        console.log('split')
        // console.log(player)
        isSplit=true;
        isSplitEnd=true;

        document.getElementById('hit').removeEventListener('click', hitWrapper);
        document.getElementById('double').removeEventListener('click', double);
        document.getElementById('split').removeEventListener('click', split);

        //create split hands
        splitHand1=document.createElement('div');
        splitHand2=document.createElement('div');
        splitHand1.classList.add('player', 'split');
        splitHand2.classList.add('player','split');
        const card1 = player.children[0];
        var card2 = player.children[1];
        if(card2.value.strength===1){ //for splitting aces
            console.log(1)
            card2.value.strength=11;
        }
        console.log(card2.value.stength)
        player.appendChild(splitHand1);
        player.appendChild(splitHand2);
        splitHand1.appendChild(card1);
        splitHand2.appendChild(card2);
        splitHand1.appendChild(deck.dealCard().getHTML());
        splitHand2.appendChild(deck.dealCard().getHTML());
        let handScore1=checkScore(splitHand1);
        let handScore2=checkScore(splitHand2);
        //create hand text
        var gametext=document.getElementById('info'); //container
        var handText1=document.createElement('span');
        var handText2=document.createElement('span');
        handText1.id='hand-text-1'
        handText2.id='hand-text-2'
        handText1.classList.add('split-text-1');
        handText2.classList.add('split-text-2');
        handText1.innerHTML="Hand 1 has "+handScore1;
        handText2.innerText="Hand 2 has "+handScore2;
        gametext.appendChild(handText1);      
        gametext.appendChild(handText2);
        //create split bet
        var actions=document.getElementById('actions');
        var bet2=document.createElement('button');
        bet2.id='split-bet'
        bet2.classList.add('bet');
        bet2.innerText=bet;
        chips-=bet;//bet becomes 10 but shows as two 5s
        document.getElementById('chips').innerText=chips;
        actions.insertBefore(bet2, actions.firstChild);    
        //handle blackjack
        
        if(handScore1===21 && handScore2 === 21){
            isSplit=false;
            chips+=bet*3;
            document.getElementById('text').innerText='Double Black Jack! nice!';
            document.getElementById('stay').removeEventListener('click', stay);
            document.getElementById('deal').addEventListener('click', deal);
            endHand();
        }
        else if(handScore1===21){ //blackjack
            isSplit=false;
            chips+=bet*1.5;
            document.getElementById('text').innerText="play hand 2 only";
            document.getElementById('hit').addEventListener('click', hitSplit2);
            document.getElementById('hand-text-1').innerText="Hand 1 has "+handScore1+"! BlackJack";
        }
        else if(handScore2===21){ //blackjack
            chips+=bet*1.5;
            console.log('hand2 bj')
            document.getElementById('text').innerText="play hand 1 first";
            // console.log(handText2)
            document.getElementById('hand-text-2').innerText="Hand 2 has "+handScore2+"! BlackJack";
            document.getElementById('hit').addEventListener('click', hitSplit1);
        }
        else{//no blackjack
            document.getElementById('hit').addEventListener('click', hitSplit1);
            document.getElementById('text').innerText="play hand 1 first";
        } 
        document.getElementById('chips').innerText=chips;
    }
}
function double(){
    doubleFlag=true;
    document.getElementById('stay').removeEventListener('click', stay);
    chips-=bet; bet*=2;
    document.getElementById('bet').innerText=bet;
    document.getElementById('chips').innerText=chips;
    hit(player);
    stay();
}
function stay(){
    console.log('stay')
    document.getElementById('hit').removeEventListener('click', hit);
    document.getElementById('double').removeEventListener('click', double);
    document.getElementById('split').removeEventListener('click', split);
    if(!isSplit){
        dealerPlay();
        document.getElementById('stay').removeEventListener('click', stay);
    }  
    else{
        isSplit=false;
        document.getElementById('hit').removeEventListener('click', hitSplit1);
        let handScore2 = checkScore(splitHand2);
        if(handScore2===21) dealerPlay();
        else{
            document.getElementById('text').innerText='play hand 2'
            document.getElementById('hit').addEventListener('click', hitSplit2);}
    }
}
function incrementBet(){
    if(chips>=5){
        bet+=5;
        chips-=5;
        document.getElementById('bet').innerText=bet;
        document.getElementById('chips').innerText=chips;
    }
}
function decrementBet(){
    if(bet>=10){
        bet-=5;
        chips+=5;
        document.getElementById('bet').innerText=bet;
        document.getElementById('chips').innerText=chips;
    }
}
function showDealerCard(){
    const cardDiv=document.createElement('div');
    cardDiv.innerText=hiddenCard.suit;
    cardDiv.classList.add('card', hiddenCard.color);
    cardDiv.value={value: hiddenCard.value, strength: hiddenCard.strength };
    cardDiv.dataset.value=`${hiddenCard.value} ${hiddenCard.suit}`;
    dealer.replaceChild(cardDiv,dealer.firstChild);
}