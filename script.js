// --- Boot sequence ---
let bootMsgs = ["Starting up...","Loading drivers...","Checking system...","Initializing UI...","Ready"];
let bootIndex = 0;
let bootInterval = setInterval(()=>{
  document.getElementById('boot-msg').textContent = bootMsgs[bootIndex];
  bootIndex++;
  if(bootIndex >= bootMsgs.length){
    clearInterval(bootInterval);
    setTimeout(()=>{
      document.getElementById('boot').classList.add('hidden');
      document.getElementById('login').classList.remove('hidden');
    },1000);
  }
},1000);

// --- Login ---
function login(){
  let user = document.getElementById('username').value || "USER";
  document.getElementById('login').classList.add('hidden');
  document.getElementById('desktop').classList.remove('hidden');
  document.getElementById('clock').textContent = new Date().toLocaleTimeString();
  animateIcons();
}

// Clock update
setInterval(()=>{
  if(document.getElementById('clock')) document.getElementById('clock').textContent = new Date().toLocaleTimeString();
},1000);

// --- Start menu toggle ---
function toggleStartMenu(){
  let menu = document.getElementById('start-menu');
  if(menu.style.display==='flex') menu.style.display='none';
  else menu.style.display='flex';
}

// --- Icon flicker animation ---
function animateIcons(){
  const icons = document.querySelectorAll('.icon');
  setInterval(()=>{
    icons.forEach(icon=>{
      if(Math.random()<0.02) icon.style.color = 'red';
      else icon.style.color = 'lime';
    });
  },100);
}

// --- Picto Chat Trigger ---
function startPictoChat(){
  document.getElementById('desktop').classList.add('hidden');
  document.getElementById('chat').classList.remove('hidden');
}

// --- Chat to Download ---
function startDownload() {
  document.getElementById('chat').classList.add('hidden');
  document.getElementById('download').classList.remove('hidden');
  let progress = 0;
  let status = document.getElementById('status');
  let interval = setInterval(() => {
    progress += Math.floor(Math.random()*5)+1;
    if(progress>100) progress=100;
    document.getElementById('progress').style.width = progress + '%';
    const msgs = ["Verifying files...","Scanning system...","Warning: Unrecognized content detected...","Decrypting assets...","Initializing AI routines..."];
    if(progress % 20 ===0) status.textContent = msgs[Math.floor(Math.random()*msgs.length)];
    if(progress>=100){
      clearInterval(interval);
      setTimeout(startGame,1000);
    }
  },300);
}

// --- 2D Superhot-style Game ---
function startGame(){
  document.getElementById('download').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const width = canvas.width, height = canvas.height;

  let player = {x:width/2,y:height/2,size:20,speed:2};
  let bullets = [], enemies=[], keys={}, timeMoving=false;

  function spawnEnemy(){ enemies.push({x:Math.random()*width,y:Math.random()*height,size:20}); }
  for(let i=0;i<5;i++) spawnEnemy();

  document.addEventListener('keydown', e=>keys[e.key]=true);
  document.addEventListener('keyup', e=>keys[e.key]=false);
  document.addEventListener('click', e=>{ bullets.push({x:player.x, y:player.y, dx:(e.clientX-width/2)/50, dy:(e.clientY-height/2)/50}); });

  function update(){
    timeMoving=false;
    if(keys['ArrowUp']||keys['w']) {player.y-=player.speed; timeMoving=true;}
    if(keys['ArrowDown']||keys['s']) {player.y+=player.speed; timeMoving=true;}
    if(keys['ArrowLeft']||keys['a']) {player.x-=player.speed; timeMoving=true;}
    if(keys['ArrowRight']||keys['d']) {player.x+=player.speed; timeMoving=true;}

    bullets.forEach((b,i)=>{ b.x+=b.dx; b.y+=b.dy; if(b.x<0||b.x>width||b.y<0||b.y>height) bullets.splice(i,1); });

    if(timeMoving){
      enemies.forEach(e=>{
        let dx = player.x - e.x, dy = player.y - e.y, dist=Math.sqrt(dx*dx+dy*dy);
        e.x += (dx/dist)*0.5; e.y += (dy/dist)*0.5;
      });
    }

    enemies.forEach((e,i)=>{
      bullets.forEach((b,j)=>{
        let dx=e.x-b.x, dy=e.y-b.y;
        if(Math.sqrt(dx*dx+dy*dy)<e.size/2){ enemies.splice(i,1); bullets.splice(j,1); spawnEnemy(); }
      });
    });
  }

  function draw(){
    ctx.fillStyle='#111'; ctx.fillRect(0,0,width,height);
    ctx.fillStyle='lime'; ctx.fillRect(player.x-player.size/2,player.y-player.size/2,player.size,player.size);
    ctx.fillStyle='yellow'; bullets.forEach(b=>ctx.fillRect(b.x-2,b.y-2,4,4));
    ctx.fillStyle='red'; enemies.forEach(e=>ctx.fillRect(e.x-e.size/2,e.y-e.size/2,e.size,e.size));
    if(Math.random()<0.005){ document.getElementById('hint').textContent="Something is watching..."; setTimeout(()=>{document.getElementById('hint').textContent='';},1000); }
  }

  function loop(){ update(); draw(); requestAnimationFrame(loop); }
  loop();
}
