// --- Simple confetti animation (no external libs) ---
window.launchConfetti = function launchConfetti(durationMs = 900) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.left = 0;
  canvas.style.top = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const colors = ['#FFD166','#06D6A0','#118AB2','#EF476F','#8338EC'];
  const parts = Array.from({length:130}).map(() => ({
    x: Math.random()*canvas.width,
    y: -20 - Math.random()*canvas.height*0.5,
    vx: (Math.random()-0.5)*6,
    vy: Math.random()*3 + 2,
    size: Math.random()*6 + 4,
    rot: Math.random()*Math.PI,
    vr: (Math.random()-0.5)*0.2,
    col: colors[(Math.random()*colors.length)|0],
  }));

  const start = performance.now();
  function frame(t){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    parts.forEach(p=>{
      p.vy += 0.06;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
      ctx.restore();
    });
    if(t-start<durationMs) requestAnimationFrame(frame);
    else document.body.removeChild(canvas);
  }
  requestAnimationFrame(frame);
};

// --- Tiny victory sound (no files; WebAudio beep-pop chord) ---
window.playConfettiSound = function playConfettiSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;
  [523.25,659.25,783.99].forEach((f,i)=>{
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, now+i*0.01);
    g.gain.exponentialRampToValueAtTime(0.2, now+0.05+i*0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now+0.25+i*0.01);
    o.connect(g).connect(ctx.destination);
    o.start(now+i*0.01);
    o.stop(now+0.3+i*0.01);
  });
};

// --- Read Aloud (Web Speech API) ---
window.speak = function speak(text){
  if(!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.0; u.pitch = 1.05; u.volume = 1.0;
  window.speechSynthesis.speak(u);
};
window.readBySelector = function readBySelector(sel){
  const el = document.querySelector(sel);
  if(!el) return;
  const text = el.textContent.replace(/\s+/g,' ').trim();
  window.speak(text);
};
