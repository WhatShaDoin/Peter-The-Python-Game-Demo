// --- Simple confetti pop (no external libraries) ---
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
  const N = 130;
  const parts = [];
  for (let i = 0; i < N; i++) {
    parts.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 6 + 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      col: colors[(Math.random() * colors.length) | 0],
    });
  }

  const start = performance.now();
  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    parts.forEach(p => {
      p.vy += 0.06;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
      ctx.restore();
    });
    if (t - start < durationMs) requestAnimationFrame(frame);
    else document.body.removeChild(canvas);
  }
  requestAnimationFrame(frame);
};
