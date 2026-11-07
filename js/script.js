document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link');
  const contentEl = document.getElementById('content');
  const intro = document.getElementById('intro');
  const startBtn = document.getElementById('startBtn');
  const skipIntro = document.getElementById('skipIntro');
  const typedEl = document.getElementById('intro-typed');
  const petalContainer = document.getElementById('petal-container');

  let activePage = 'intro';
  let petalInterval = null;
  let cameraStream = null;
  let photoboothAnimation = null;
  let photoboothRun = 0;

  async function loadPage(page) {
    try {
      const res = await fetch(`pages/${page}.html`);
      if (!res.ok) throw new Error('not found');
      const html = await res.text();
      contentEl.innerHTML = html;
      intro.style.display = 'none';
      activePage = page;
      links.forEach(l => l.classList.remove('bg-pink-200','text-pink-700'));
      const link = Array.from(links).find(a => a.dataset.page === page);
      if (link) link.classList.add('bg-pink-200','text-pink-700');

      contentEl.classList.add('animate-fadeIn');
      setTimeout(()=> contentEl.classList.remove('animate-fadeIn'), 700);

      handlePageInit(page);
    } catch (err) {
      stopPhotobooth();
      contentEl.innerHTML = `<p class="text-center text-red-500 mt-10">Halaman "${page}" tidak ditemukan.</p>`;
    }
  }

  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const page = a.dataset.page;

      if (page === 'intro') {
        stopPhotobooth();
        intro.style.display = '';
        contentEl.innerHTML = '';
        activePage = 'intro';
        links.forEach(l=>l.classList.remove('bg-pink-200','text-pink-700'));
        a.classList.add('bg-pink-200','text-pink-700');
        stopPetals();
      } else {
        loadPage(page);
      }
    });
  });

  startBtn.addEventListener('click', () => loadPage('home'));
  skipIntro.addEventListener('click', () => loadPage('home'));

  const introText = "I made something special for you, Lala. Click start and let's celebrate every memory together 🌷";
  let ti = 0;
  function typeIntro() {
    if (!typedEl) return;
    if (ti < introText.length) {
      typedEl.innerHTML += introText.charAt(ti);
      ti++;
      setTimeout(typeIntro, 28);
    } else {
      const cursor = document.createElement('span');
      cursor.className = 'typed-cursor';
      typedEl.appendChild(cursor);
    }
  }
  typeIntro();

  function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.backgroundImage = "url('assets/images/petal.png')";
    petal.style.left = Math.random() * innerWidth + 'px';
    petal.style.top = '-40px';
    const dur = 4000 + Math.random()*3500;
    const rot = Math.random()*360;
    petal.style.transform = `rotate(${rot}deg)`;
    petalContainer.appendChild(petal);

    const start = performance.now();
    function anim(now) {
      const t = (now - start) / dur;
      if (t >= 1) {
        petal.remove();
        return;
      }
      const x = parseFloat(petal.style.left);
      const sway = Math.sin(t * Math.PI * 2) * 60;
      petal.style.transform = `translate(${sway}px, ${t * (innerHeight + 100)}px) rotate(${rot + t*360}deg)`;
      requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }

  function startPetals() {
    if (petalInterval) return;
    petalInterval = setInterval(() => {
      createPetal();
    }, 450);
  }
  function stopPetals() {
    clearInterval(petalInterval);
    petalInterval = null;
    document.querySelectorAll('.petal').forEach(p => p.remove());
  }

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScroll < 200) return;
    lastScroll = now;
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.backgroundImage = "url('assets/images/heart.png')";
    const left = Math.random() * (window.innerWidth - 40);
    const top = window.scrollY + window.innerHeight * 0.8;
    heart.style.left = left + 'px';
    heart.style.top = top + 'px';
    document.body.appendChild(heart);

    heart.animate([
      { transform: 'translateY(0) scale(1)', opacity: 1 },
      { transform: 'translateY(-120px) scale(1.4)', opacity: 0 }
    ], { duration: 1400, easing: 'ease-out' });
    setTimeout(()=> heart.remove(), 1500);
  });

  function handlePageInit(page) {
    stopPetals();
    stopPhotobooth();

    if (page === 'home') {
      const title = document.querySelector('#content .home-title');
      if (title) title.classList.add('glow-text');

      startPetals();
    }

    if (page === 'memories') {
      document.querySelectorAll('.scrap-card').forEach((c, i) => {
        const r = (Math.random()*8 - 4).toFixed(2);
        c.style.transform = `rotate(${r}deg)`;
      });
    }

    if (page === 'cake') {
      const blowBtn = document.getElementById('blowBtn');
      const flame = document.getElementById('flame');
      const fire = document.getElementById('fireworks');
      const wishText = document.getElementById('wishText');

      if (blowBtn && flame) {
        let blown = false;
        blowBtn.addEventListener('click', () => {
          if (!blown) {
            flame.style.transition = 'opacity 450ms ease';
            flame.style.opacity = 0;
            blown = true;
            blowBtn.textContent = 'Reset';
            setTimeout(()=>{
              if (wishText) wishText.style.opacity = 1;
            }, 600);
          } else {
            flame.style.opacity = 1;
            blown = false;
            blowBtn.textContent = 'Blow the candle 💨';
            if (fire) fire.classList.remove('firework-show');
            if (wishText) wishText.style.opacity = 0;
          }
        }, { once: false });
      }
    }


    if (page === 'video') {
      const v = document.querySelector('#content video');
      v && v.pause();
    }

    if (page === 'note') {
      const noteEl = document.getElementById('noteText');
      if (noteEl && noteEl.innerText.trim() === '') {
        const text = "Thank you for being part of my life, Lala sayangggg. You make every day softer and every moment warmer. I love you more than I can say. Always.";
        let idx = 0;
        function type() {
          if (idx < text.length) {
            noteEl.innerText += text.charAt(idx);
            idx++;
            setTimeout(type, 28);
          }
        }
        type();
      }
    }

    if (page === 'photobooth') initPhotobooth();
  }

  function stopPhotobooth() {
    photoboothRun++;
    if (photoboothAnimation) cancelAnimationFrame(photoboothAnimation);
    photoboothAnimation = null;
    if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }

  function initPhotobooth() {
    const canvas = document.getElementById('photoboothCanvas');
    const frameSelect = document.getElementById('photoboothFrame');
    const startButton = document.getElementById('startCamera');
    const takeButton = document.getElementById('takePhotos');
    const downloadLink = document.getElementById('downloadPhoto');
    const status = document.getElementById('photoboothStatus');
    const countdown = document.getElementById('photoboothCountdown');
    if (!canvas || !frameSelect || !startButton || !takeButton || !downloadLink || !status || !countdown) return;

    const context = canvas.getContext('2d');
    const video = document.createElement('video');
    const frame = new Image();
    let shots = [];
    let busy = false;

    const frameSlots = {
      1: [
        { x: 40, y: 145, width: 627, height: 458 },
        { x: 40, y: 657, width: 627, height: 459 },
        { x: 40, y: 1169, width: 627, height: 458 }
      ],
      2: [
        { x: 104, y: 188, width: 396, height: 398 },
        { x: 104, y: 696, width: 396, height: 398 },
        { x: 104, y: 1222, width: 396, height: 398 }
      ]
    };

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    function drawCover(source, box, mirror = false) {
      const sourceWidth = source.videoWidth || source.width;
      const sourceHeight = source.videoHeight || source.height;
      if (!sourceWidth || !sourceHeight) return;
      const scale = Math.max(box.width / sourceWidth, box.height / sourceHeight);
      const width = sourceWidth * scale;
      const height = sourceHeight * scale;
      context.save();
      if (mirror) {
        context.translate(box.x + box.width, box.y);
        context.scale(-1, 1);
        context.drawImage(source, (box.width - width) / 2, (box.height - height) / 2, width, height);
      } else {
        context.drawImage(source, box.x + (box.width - width) / 2, box.y + (box.height - height) / 2, width, height);
      }
      context.restore();
    }

    function render() {
      photoboothAnimation = null;
      if (!frame.complete || !frame.naturalWidth) {
        photoboothAnimation = requestAnimationFrame(render);
        return;
      }
      if (canvas.width !== frame.naturalWidth || canvas.height !== frame.naturalHeight) {
        canvas.width = frame.naturalWidth;
        canvas.height = frame.naturalHeight;
      }
      context.clearRect(0, 0, canvas.width, canvas.height);
      const boxes = frameSlots[frameSelect.value];
      context.drawImage(frame, 0, 0, canvas.width, canvas.height);
      boxes.forEach((box, index) => {
        const inset = frameSelect.value === '2' ? 5 : 0;
        const photoBox = {
          x: box.x + inset,
          y: box.y + inset,
          width: box.width - inset * 2,
          height: box.height - inset * 2
        };
        context.save();
        context.beginPath();
        context.rect(photoBox.x, photoBox.y, photoBox.width, photoBox.height);
        context.clip();
        if (shots[index]) context.drawImage(shots[index], photoBox.x, photoBox.y, photoBox.width, photoBox.height);
        else if (video.readyState >= 2) drawCover(video, photoBox, true);
        context.restore();
      });
      photoboothAnimation = requestAnimationFrame(render);
    }

    function loadFrame() {
      frame.onload = () => {
        shots = [];
        downloadLink.hidden = true;
        downloadLink.removeAttribute('href');
        // status.textContent = 'Frame siap. Nyalakan kamera untuk mulai.';
        if (!photoboothAnimation) render();
      };
      frame.onerror = () => {
        status.textContent = 'Frame tidak bisa dimuat. Periksa file di folder frame-photo.';
      };
      frame.src = `frame-photo/${frameSelect.value}.png`;
    }

    frameSelect.addEventListener('change', loadFrame);
    loadFrame();

    startButton.addEventListener('click', async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = 'Browser ini tidak mendukung kamera. Coba buka lewat localhost atau HTTPS.';
        return;
      }
      startButton.disabled = true;
      status.textContent = 'Meminta izin kamera...';
      const requestRun = photoboothRun;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
        if (requestRun !== photoboothRun) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        cameraStream = stream;
        video.srcObject = cameraStream;
        await video.play();
        if (!video.videoWidth) {
          await new Promise(resolve => video.addEventListener('loadedmetadata', resolve, { once: true }));
        }
        takeButton.disabled = false;
        startButton.textContent = 'Kamera aktif ';
        status.textContent = 'Kamera ready';
      } catch (error) {
        if (requestRun !== photoboothRun) return;
        if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
        video.srcObject = null;
        startButton.disabled = false;
        status.textContent = error.name === 'NotAllowedError'
          ? 'Akses kamera ditolak. Izinkan kamera di pengaturan browser lalu coba lagi.'
          : 'Kamera tidak bisa dinyalakan. Pastikan kamera tersedia dan coba lagi.';
      }
    });

    takeButton.addEventListener('click', async () => {
      if (busy || !cameraStream) return;
      busy = true;
      takeButton.disabled = true;
      frameSelect.disabled = true;
      shots = [];
      downloadLink.hidden = true;
      const thisRun = ++photoboothRun;

      for (let index = 0; index < 3; index++) {
        for (let number = 3; number > 0; number--) {
          if (thisRun !== photoboothRun) return;
          countdown.textContent = number;
          status.textContent = `Foto ${index + 1} dari 3...`;
          await new Promise(resolve => setTimeout(resolve, 750));
        }
        if (thisRun !== photoboothRun) return;
        countdown.textContent = '📸';
        const shot = document.createElement('canvas');
        const box = frameSlots[frameSelect.value][index];
        const inset = frameSelect.value === '2' ? 5 : 0;
        shot.width = box.width - inset * 2;
        shot.height = box.height - inset * 2;
        const shotContext = shot.getContext('2d');
        const sourceWidth = video.videoWidth;
        const sourceHeight = video.videoHeight;
        const scale = Math.max(shot.width / sourceWidth, shot.height / sourceHeight);
        const width = sourceWidth * scale;
        const height = sourceHeight * scale;
        shotContext.translate(shot.width, 0);
        shotContext.scale(-1, 1);
        shotContext.drawImage(video, (shot.width - width) / 2, (shot.height - height) / 2, width, height);
        shots.push(shot);
        await new Promise(resolve => setTimeout(resolve, 250));
      }

      countdown.textContent = '';
      busy = false;
      takeButton.disabled = false;
      frameSelect.disabled = false;
      takeButton.textContent = 'Ulangi foto 🔄';
      status.textContent = 'Selesai! Unduh hasilnya atau ambil ulang.';
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.download = 'photobooth.png';
      downloadLink.hidden = false;
    });
  }

  const initial = location.hash ? location.hash.replace('#','') : null;
  if (initial && initial !== 'intro') {
    loadPage(initial);
  }

});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("navbarMenu");

menuToggle?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
