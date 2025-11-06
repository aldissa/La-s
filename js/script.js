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
      contentEl.innerHTML = `<p class="text-center text-red-500 mt-10">Halaman "${page}" tidak ditemukan.</p>`;
    }
  }

  links.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const page = a.dataset.page;

      if (page === 'intro') {
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
  }

  const initial = location.hash ? location.hash.replace('#','') : null;
  if (initial && initial !== 'intro') {
    loadPage(initial);
  }

});

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

menuToggle?.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
