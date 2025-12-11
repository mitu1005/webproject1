// Levels words
const levels = [
  ["Cat","Cat","Dog","Dog","Sun","Sun"],
  ["Apple","Apple","Ball","Ball","Car","Car","Dog","Dog"],
  ["Tree","Tree","Moon","Moon","Star","Star","Bird","Bird","Fish","Fish"]
];

let lvl = 0, score = 0, wrong = 10, time = 60;
let first = null, second = null, lock = false, timer;

// DOM
const game=document.getElementById("game"),
      scoreEl=document.getElementById("score"),
      wrongEl=document.getElementById("wrong"),
      timeEl=document.getElementById("time"),
      levelEl=document.getElementById("level"),
      overlay=document.getElementById("endOverlay"),
      endTitle=document.getElementById("endTitle"),
      finalScore=document.getElementById("finalScore");

// Start level
function startLevel(){
  const words = levels[lvl].slice().sort(()=>0.5-Math.random());
  first=null; second=null; lock=false; time=60; timeEl.innerText=time;
  game.innerHTML="";
  words.forEach(w=>{
    const card=document.createElement("div");
    card.className="card"; card.innerText=w;
    card.onclick=()=>flip(card);
    game.appendChild(card);
  });
  clearInterval(timer);
  timer=setInterval(()=>{
    time--; timeEl.innerText=time;
    if(time<=0){ clearInterval(timer); endGame("Time's up!"); }
  },1000);
}

// Flip card
function flip(card){
  if(lock || card.classList.contains("show") || card.classList.contains("matched")) return;
  card.classList.add("show");
  if(!first){ first=card; } else{ second=card; lock=true; check(); }
}

// Check match
function check(){
  if(first.innerText===second.innerText){
    first.classList.add("matched"); second.classList.add("matched");
    score+=10; scoreEl.innerText=score; resetPick();
    if(document.querySelectorAll(".matched").length===levels[lvl].length)
      clearInterval(timer), lvl<levels.length-1 ? endGame("Level Complete!",true) : endGame("🎉 You Win!");
  } else {
    wrong--; wrongEl.innerText=wrong;
    setTimeout(()=>{
      first.classList.remove("show"); second.classList.remove("show"); resetPick();
      if(wrong<=0) clearInterval(timer), endGame("You Lose!");
    },1000);
  }
}

function resetPick(){ first=null; second=null; lock=false; }

// Show end overlay
function endGame(msg,next=false){
  endTitle.innerText=msg; finalScore.innerText=score;
  overlay.classList.add("show"); overlay.dataset.next = next?"true":"false";
}

// Restart / Next Level
function restartGame(){
  overlay.classList.remove("show");
  if(overlay.dataset.next==="true"){ lvl++; } else{ lvl=0; score=0; wrong=10;}
  scoreEl.innerText=score; wrongEl.innerText=wrong; levelEl.innerText=lvl+1;
  startLevel();
}

// Init
levelEl.innerText=lvl+1; scoreEl.innerText=score; wrongEl.innerText=wrong;
startLevel();
