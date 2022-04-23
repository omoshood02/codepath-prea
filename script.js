// global constants
var clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence


//Global Variables
// test pattern 1, 2, 3, 4, 5, 6, 7, 8
var pattern = [5, 3, 2, 4, 6, 1];
var mistakes = 0;
//var rpattern = []
//console.log(rpattern)
var progress = 0;
var gamePlaying = false;
var tonePlaying = false;
var volume = 0.5;
var guessCounter = 0;

//function randpattern(min, max) {
//  for(let i = 0; i <= progress; i++){
//    min = Math.ceil(1);
//    max = Math.floor(6);
//    var n = Math.round(Math.random() * (max - min) + min);
//    rpattern.push(n);
    //console.log(rpattern)
//  }
//  return rpattern;
//}

function lightButton(btn){
  document.getElementById("button" + btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button" + btn).classList.remove("lit")
}


function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}


function playClueSequence(){
  guessCounter = 0;
  context.resume()
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i = 0; i <= progress; i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    clueHoldTime -= 40; 
    delay += clueHoldTime; 
    delay += cluePauseTime;
  }
}


function startGame() {
  //initialize game variables
  //randpattern();
  progress = 0;
  gamePlaying = true;
  document.getElementById("start").classList.add("hidden");
  document.getElementById("stop").classList.remove("hidden");
  playClueSequence();
  
}

function stopGame() {
  //initialize game variables
  //progress = 0;
  gamePlaying = false;
  document.getElementById("start").classList.remove("hidden");
  document.getElementById("stop").classList.add("hidden");
  clueHoldTime = 1000;
  mistakes = 0;
}


function winGame(){
  stopGame();
  alert("Amazing! You Won!");
  clueHoldTime = 1000;
  
}

function loseGame(){
  stopGame();
  alert("3 Misses. Game Over. You lost.");
  clueHoldTime = 1000;
}


function guess(btn){
  console.log("user guessed: " + btn);
  
  if(!gamePlaying){
    return;
  }
  
  if(pattern[guessCounter] == btn){
    //Guess was correct!
    if (guessCounter == progress){
      if (progress == pattern.length - 1){
        //GAME OVER: WIN!
        winGame();
      }else{
        //Pattern correct. Add next segment
        progress++;
        playClueSequence();
      }
      
    }else{
      //so far so good... check the next guess
      guessCounter++;
      //playClueSequence();
    }
  }else{
    //Guess was incorrect
    //GAME OVER: LOSE!
    mistakes++;
    playClueSequence();
    
  }
  if (mistakes == 3){
    loseGame();
  }
}       



// Sound Synthesis Functions
const freqMap = {
  1: 261.6,
  2: 329.6,
  3: 392,
  4: 466.2,
  5: 500.1,
  6: 530.3,
  7: 589.1,
  8: 612.2
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    context.resume();
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    context.resume();
    tonePlaying = true;
  }
}
function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);


