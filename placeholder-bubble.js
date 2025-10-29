(function(){
  var canvas = document.getElementById('bubbleCanvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = Math.max(1, window.devicePixelRatio || 1);
  var W = 0, H = 0;

  function fitCanvas(){
    dpr = Math.max(1, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', fitCanvas);
  fitCanvas();

  var BUBBLE_COUNT = 40;
  var bubbles = [];
  function rand(min, max){ return Math.random() * (max - min) + min; }

  function initBubbles(){
    bubbles.length = 0;
    for(var i=0;i<BUBBLE_COUNT;i++){
      bubbles.push({
        x: rand(0, W),
        y: rand(0, H),
        r: rand(8, 46),
        speed: rand(12, 90),
        alpha: rand(0.06, 0.28),
        drift: rand(-20, 20)
      });
    }
  }

  initBubbles();

  var last = performance.now();
  function frame(now){
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    ctx.clearRect(0,0,W,H);

    for(var i=0;i<bubbles.length;i++){
      var b = bubbles[i];
      b.y -= b.speed * dt;
      b.x += Math.sin(now * 0.001 + b.x) * 0.3 * dt * (b.drift > 0 ? 1 : -1);

      if(b.y + b.r < -60){
        b.y = H + rand(0, 200);
        b.x = rand(0, W);
        b.r = rand(8, 46);
        b.speed = rand(12, 90);
        b.alpha = rand(0.06, 0.28);
        b.drift = rand(-20, 20);
      }

      ctx.beginPath();
      ctx.fillStyle = 'rgba(0,0,0,' + b.alpha + ')';
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);

  var resizeTimer;
  window.addEventListener('resize', function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){ fitCanvas(); initBubbles(); }, 120);
  });
})();
