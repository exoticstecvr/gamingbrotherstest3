(function(){
  // fnaf-1.js — inject the Ultimate Game Stash embed UI and load its scripts
  const baseHref = 'https://cdn.jsdelivr.net/gh/genizy/fnaf@latest/1/';

  // ensure a <base> tag exists so relative loads resolve to the CDN
  if(!document.querySelector('base')){
    const b = document.createElement('base');
    b.href = baseHref;
    document.head.appendChild(b);
  }

  // Avoid injecting twice
  if(document.getElementById('MMFCanvas')){
    console.log('FNAF embed already injected');
    return;
  }

  // Target insertion point: prefer #viewWrap (player container), fallback to body
  const target = document.getElementById('viewWrap') || document.body;

  // Container for the embed, sized to fill parent
  const embedWrap = document.createElement('div');
  embedWrap.style.display = 'block';
  embedWrap.style.width = '100%';
  embedWrap.style.height = '100%';
  embedWrap.style.position = 'relative';
  embedWrap.style.userSelect = 'none';
  embedWrap.id = 'fnaf-embed-wrap';

  // Canvas
  const canvasWrap = document.createElement('div');
  canvasWrap.style.display = 'inline-block';
  canvasWrap.style.textAlign = 'left';
  canvasWrap.style.width = '100%';
  canvasWrap.style.height = '100%';
  const canvas = document.createElement('canvas');
  canvas.id = 'MMFCanvas';
  canvas.width = 1280;
  canvas.height = 720;
  canvas.innerText = 'Your browser does not support Canvas, Please try again.';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvasWrap.appendChild(canvas);
  embedWrap.appendChild(canvasWrap);

  // Progress container (positioned absolute so it sits over the canvas)
  const progress = document.createElement('div');
  progress.id = 'progress-container';
  progress.style.position = 'absolute';
  progress.style.left = '8px';
  progress.style.right = '8px';
  progress.style.bottom = '12px';
  progress.style.zIndex = '10';
  progress.style.color = '#fff';

  progress.innerHTML = `
    <div style="margin-bottom:6px;color:#fff;">Downloading... <span id="download-text">0%</span></div>
    <div style="width:100%; background:#444; border-radius:6px; overflow:hidden;">
      <div id="download-bar" style="height:10px; background:#3b82f6; width:0%; transition:width 0.2s;"></div>
    </div>
    <div style="margin:12px 0 6px;color:#fff;">Extracting... <span id="extract-text">0%</span></div>
    <div style="width:100%; background:#444; border-radius:6px; overflow:hidden;">
      <div id="extract-bar" style="height:10px; background:#10b981; width:0%; transition:width 0.2s;"></div>
    </div>
  `;

  embedWrap.appendChild(progress);

  // Append into the page
  target.appendChild(embedWrap);

  // Load external scripts: jszip then main.js (relative main.js resolves via <base>)
  function loadScript(src, onload, onerror){
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = () => onload && onload();
    s.onerror = (e) => onerror && onerror(e);
    document.body.appendChild(s);
    return s;
  }

  // Load JSZip from CDN first
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js', ()=>{
    console.log('JSZip loaded');
    // then load main.js from the base href (the base tag ensures this resolves to the CDN)
    loadScript('main.js', ()=>{
      console.log('FNAF main.js loaded');
    }, (err)=>{console.warn('Failed to load main.js', err);});
  }, (err)=>{console.warn('Failed to load JSZip', err);});

})();
