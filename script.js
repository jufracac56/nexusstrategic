document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');

  const toggleNav = () => {
    if (!nav) return;
    if (window.scrollY > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  toggleNav();
  window.addEventListener('scroll', toggleNav, { passive: true });

  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  const particleCount = 100;
  const particles = [];
  const linkDistance = 170;
  const linkColor = '14, 165, 233';
  const particleColor = '14, 165, 233';

  const resize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  };

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  const initParticles = () => {
    particles.length = 0;
    for (let i = 0; i < particleCount; i += 1) {
      particles.push({
        x: randomBetween(0, width),
        y: randomBetween(0, height),
        radius: randomBetween(1.5, 3.2),
        speedX: randomBetween(-0.6, 0.6),
        speedY: randomBetween(-0.6, 0.6),
        alpha: randomBetween(0.15, 0.5),
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < linkDistance) {
          const alpha = (1 - dist / linkDistance) * 0.35;
          ctx.strokeStyle = `rgba(${linkColor}, ${alpha})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${particleColor})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  };

  resize();
  initParticles();
  draw();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
});
