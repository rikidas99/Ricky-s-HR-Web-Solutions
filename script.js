/* ============================================
   HR Web Solutions — script.js
   Chatbot, Slider, Form, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. AOS INIT
  ========================================== */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });


  /* ==========================================
     2. NAVBAR SCROLL EFFECT
  ========================================== */
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ==========================================
     3. MOBILE MENU
  ========================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });


  /* ==========================================
     4. COUNTER ANIMATION
  ========================================== */
  const counters = document.querySelectorAll('.counter');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current) + (el.dataset.suffix || '');
      }, 16);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => countObserver.observe(c));


  /* ==========================================
     5. INFINITE SERVICES SLIDER
  ========================================== */
  const services = [
    { icon: '🖥️', label: 'Website Design' },
    { icon: '📱', label: 'Social Media Marketing' },
    { icon: '🔍', label: 'SEO Services' },
    { icon: '🎨', label: 'Graphic Design' },
    { icon: '✍️', label: 'Article Writing' },
    { icon: '🎬', label: 'Video Editing' },
    { icon: '📝', label: 'Content Creation' },
  ];

  function buildSlider(trackId, items) {
    const track = document.getElementById(trackId);
    if (!track) return;

    // Duplicate for seamless loop
    const allItems = [...items, ...items, ...items];
    track.innerHTML = allItems.map(s => `
      <div class="service-card">
        <span class="icon">${s.icon}</span>
        <span class="label">${s.label}</span>
      </div>
    `).join('');
  }

  // Row 1: standard services
  buildSlider('slider-track-1', services);

  // Row 2: reversed / extended services
  const servicesReversed = [...services].reverse();
  buildSlider('slider-track-2', servicesReversed);


  /* ==========================================
     6. TESTIMONIAL SLIDER
  ========================================== */
  const slider = document.getElementById('testimonial-slider');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let testimonialTimer;

  function goToSlide(index) {
    currentSlide = index;
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    const next = (currentSlide + 1) % dots.length;
    goToSlide(next);
  }

  function startAutoSlide() {
    testimonialTimer = setInterval(nextSlide, 4500);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(testimonialTimer);
      goToSlide(+dot.dataset.index);
      startAutoSlide();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      clearInterval(testimonialTimer);
      goToSlide(diff > 0
        ? (currentSlide + 1) % dots.length
        : (currentSlide - 1 + dots.length) % dots.length
      );
      startAutoSlide();
    }
  });

  startAutoSlide();


  /* ==========================================
     7. STRATEGY CALL FORM VALIDATION
  ========================================== */
  const form = document.getElementById('strategy-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successMsg = document.getElementById('form-success');

  function setError(inputId, errId, message) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (message) {
      input.classList.add('error-field');
      err.textContent = message;
      return false;
    } else {
      input.classList.remove('error-field');
      err.textContent = '';
      return true;
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    const name = document.getElementById('f-name').value.trim();
    const email = document.getElementById('f-email').value.trim();
    const biz = document.getElementById('f-biz').value.trim();
    const service = document.getElementById('f-service').value;

    let valid = true;

    valid = setError('f-name', 'err-name', name.length < 2 ? 'Please enter your full name.' : '') && valid;
    valid = setError('f-email', 'err-email', !validateEmail(email) ? 'Please enter a valid email address.' : '') && valid;
    valid = setError('f-biz', 'err-biz', biz.length < 2 ? 'Please enter your business name.' : '') && valid;
    valid = setError('f-service', 'err-service', !service ? 'Please select a service.' : '') && valid;

    return valid;
  }

  // Live validation on blur
  ['f-name', 'f-email', 'f-biz', 'f-service'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('blur', validateForm);
    el.addEventListener('input', () => {
      el.classList.remove('error-field');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate submission
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-70');

    setTimeout(() => {
      form.style.display = 'none';
      successMsg.classList.remove('hidden');
    }, 1400);
  });


  /* ==========================================
     8. FLOATING CHATBOT
  ========================================== */
  const chatToggle = document.getElementById('chat-toggle');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');
  const chatMessages = document.getElementById('chat-messages');
  const chatNotif = document.getElementById('chat-notif');
  const chatIconOpen = document.getElementById('chat-icon-open');
  const chatIconClose = document.getElementById('chat-icon-close');
  const quickReplies = document.getElementById('quick-replies');
  let chatOpen = false;

  // Bot responses map
  const botResponses = {
    'book a free strategy call': "Great choice! 🎯 Please scroll up to our strategy call form, or just drop your email here and we'll reach out within 24 hours.",
    "i'd like to book a free strategy call": "Awesome! 📅 Head to our <a href='#strategy-call' style='color:var(--cyan)'>Strategy Call form</a> above — it only takes 60 seconds to fill in!",
    'what services do you offer?': "We offer: 🖥 Website Design, 🔍 SEO, 📱 Social Media Marketing, 🎨 Graphic Design, ✍️ Article Writing, 🎬 Video Editing, and 📝 Content Creation. Which interests you most?",
    'what are your pricing options?': "Our pricing is project-based and highly competitive 💰. Book a free strategy call and we'll give you a custom quote tailored to your goals — no obligation!",
    default: "Thanks for reaching out! 😊 For a quick answer, book a <a href='#strategy-call' style='color:var(--cyan)'>free strategy call</a> with our team. We'd love to help you grow!"
  };

  function openChat() {
    chatOpen = true;
    chatWindow.classList.remove('hidden');
    chatNotif.style.display = 'none';
    chatIconOpen.classList.add('hidden');
    chatIconClose.classList.remove('hidden');
    chatInput.focus();
  }

  function closeChat() {
    chatOpen = false;
    chatWindow.classList.add('hidden');
    chatIconOpen.classList.remove('hidden');
    chatIconClose.classList.add('hidden');
  }

  chatToggle.addEventListener('click', () => chatOpen ? closeChat() : openChat());
  chatClose.addEventListener('click', closeChat);

  function addMessage(text, type, isHTML = false) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${type}`;
    if (isHTML) {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return bubble;
  }

  function getBotReply(msg) {
    const key = msg.toLowerCase().trim();
    for (const [pattern, reply] of Object.entries(botResponses)) {
      if (key.includes(pattern)) return reply;
    }
    return botResponses.default;
  }

  function sendMessage(text) {
    if (!text.trim()) return;

    // Hide quick replies after first message
    quickReplies.style.display = 'none';
    chatInput.value = '';

    // User bubble
    addMessage(text, 'user');

    // Typing indicator
    const typing = addMessage('● ● ●', 'typing');

    setTimeout(() => {
      typing.remove();
      const reply = getBotReply(text);
      addMessage(reply, 'bot', true);
    }, 900 + Math.random() * 600);
  }

  chatSend.addEventListener('click', () => sendMessage(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage(chatInput.value);
  });

  // Quick reply buttons
  document.querySelectorAll('.qr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.dataset.reply);
    });
  });

  // Auto-open notification after 4s
  setTimeout(() => {
    if (!chatOpen) {
      chatNotif.style.display = 'flex';
    }
  }, 4000);


  /* ==========================================
     9. SMOOTH ANCHOR SCROLLING
  ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

}); // end DOMContentLoaded
