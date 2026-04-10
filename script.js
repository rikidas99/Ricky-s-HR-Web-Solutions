/* ============================================
   HR Web Solutions — script.js
   Chatbot, Slider, Form, Animations
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     1. AOS INIT
  ========================================== */
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
  });

  /* ==========================================
     2. NAVBAR SCROLL EFFECT
  ========================================== */
  const navbar = document.getElementById("navbar");
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });

  /* ==========================================
     3. MOBILE MENU
  ========================================== */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open")
      ? "hidden"
      : "";
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ==========================================
     4. COUNTER ANIMATION
  ========================================== */
  const counters = document.querySelectorAll(".counter");
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
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
          el.textContent = Math.floor(current) + (el.dataset.suffix || "");
        }, 16);
        countObserver.unobserve(el);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => countObserver.observe(c));

  /* ==========================================
     5. INFINITE SERVICES SLIDER
  ========================================== */
  const services = [
    { icon: "🖥️", label: "Website Design" },
    { icon: "📱", label: "Social Media Marketing" },
    { icon: "🔍", label: "SEO Services" },
    { icon: "🎨", label: "Graphic Design" },
    { icon: "✍️", label: "Article Writing" },
    { icon: "🎬", label: "Video Editing" },
    { icon: "📝", label: "Content Creation" },
  ];

  function buildSlider(trackId, items) {
    const track = document.getElementById(trackId);
    if (!track) return;

    // Duplicate for seamless loop
    const allItems = [...items, ...items, ...items];
    track.innerHTML = allItems
      .map(
        (s) => `
      <div class="service-card">
        <span class="icon">${s.icon}</span>
        <span class="label">${s.label}</span>
      </div>
    `,
      )
      .join("");
  }

  // Row 1: standard services
  buildSlider("slider-track-1", services);

  // Row 2: reversed / extended services
  const servicesReversed = [...services].reverse();
  buildSlider("slider-track-2", servicesReversed);

  /* ==========================================
     6. TESTIMONIAL SLIDER
  ========================================== */
  const slider = document.getElementById("testimonial-slider");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let testimonialTimer;

  function goToSlide(index) {
    currentSlide = index;
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  function nextSlide() {
    const next = (currentSlide + 1) % dots.length;
    goToSlide(next);
  }

  function startAutoSlide() {
    testimonialTimer = setInterval(nextSlide, 4500);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      clearInterval(testimonialTimer);
      goToSlide(+dot.dataset.index);
      startAutoSlide();
    });
  });

  // Touch/swipe support
  let touchStartX = 0;
  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true },
  );
  slider.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      clearInterval(testimonialTimer);
      goToSlide(
        diff > 0
          ? (currentSlide + 1) % dots.length
          : (currentSlide - 1 + dots.length) % dots.length,
      );
      startAutoSlide();
    }
  });

  startAutoSlide();

  /* ==========================================
     7. STRATEGY CALL FORM VALIDATION
  ========================================== */
  const form = document.getElementById("strategy-form");
  const submitBtn = document.getElementById("form-submit-btn");
  const successMsg = document.getElementById("form-success");

  function setError(inputId, errId, message) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (message) {
      input.classList.add("error-field");
      err.textContent = message;
      return false;
    } else {
      input.classList.remove("error-field");
      err.textContent = "";
      return true;
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateForm() {
    const name = document.getElementById("f-name").value.trim();
    const email = document.getElementById("f-email").value.trim();
    const biz = document.getElementById("f-biz").value.trim();
    const service = document.getElementById("f-service").value;

    let valid = true;

    valid =
      setError(
        "f-name",
        "err-name",
        name.length < 2 ? "Please enter your full name." : "",
      ) && valid;
    valid =
      setError(
        "f-email",
        "err-email",
        !validateEmail(email) ? "Please enter a valid email address." : "",
      ) && valid;
    valid =
      setError(
        "f-biz",
        "err-biz",
        biz.length < 2 ? "Please enter your business name." : "",
      ) && valid;
    valid =
      setError(
        "f-service",
        "err-service",
        !service ? "Please select a service." : "",
      ) && valid;

    return valid;
  }

  // Live validation on blur
  ["f-name", "f-email", "f-biz", "f-service"].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("blur", validateForm);
    el.addEventListener("input", () => {
      el.classList.remove("error-field");
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Update button state
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-70");

    // Collect form data
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: json,
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        form.style.display = "none";
        successMsg.classList.remove("hidden");
      } else {
        // Show error on button
        submitBtn.textContent = "Something went wrong. Try again.";
        submitBtn.disabled = false;
        submitBtn.classList.remove("opacity-70");
        submitBtn.classList.add("bg-red-500");
      }
    } catch (error) {
      submitBtn.textContent = "Network error. Try again.";
      submitBtn.disabled = false;
      submitBtn.classList.remove("opacity-70");
    }
  });

  /* ==========================================
     8. FLOATING CHATBOT
  ========================================== */
  const chatToggle = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const chatClose = document.getElementById("chat-close");
  const chatInput = document.getElementById("chat-input");
  const chatSend = document.getElementById("chat-send");
  const chatMessages = document.getElementById("chat-messages");
  const chatNotif = document.getElementById("chat-notif");
  const chatIconOpen = document.getElementById("chat-icon-open");
  const chatIconClose = document.getElementById("chat-icon-close");
  const quickReplies = document.getElementById("quick-replies");
  let chatOpen = false;




  // Bot responses map
  // ── Contact details ──────────────────────────────
  const PHONE_NUMBER = "+1234567890"; // ← your real number, digits only
  const WHATSAPP_NUMBER = "1234567890"; // ← WhatsApp number, no + or spaces
  const WHATSAPP_MSG = encodeURIComponent(
    "Hi HR Web Solutions! I found you on your website and would love to discuss a project.",
  );

  const CALL_BTN = `<a href="tel:${9362061617}" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:8px 16px;background:#00f5ff;color:#0a0f2c;border-radius:8px;font-weight:700;font-size:0.82rem;text-decoration:none;">📞 Call Us Now</a>`;
  const WA_BTN = `<a href="https://wa.me/${9362061617}?text=${WHATSAPP_MSG}" target="_blank" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:8px 16px;background:#25D366;color:#fff;border-radius:8px;font-weight:700;font-size:0.82rem;text-decoration:none;">💬 WhatsApp Us</a>`;
  const BOTH_BTNS = `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">${CALL_BTN}${WA_BTN}</div>`;

  const botResponses = {
    "i want to talk to someone now": `We'd love to connect! Reach us instantly right now:<br>${BOTH_BTNS}`,

    call: `Sure! Tap below to call us directly — we're available Mon–Sat, 9am to 7pm.<br>${BOTH_BTNS}`,

    whatsapp: `Absolutely! Drop us a WhatsApp message and we'll reply within minutes. 🚀<br>${WA_BTN}`,

    "what services do you offer?": `We offer: 🖥 Website Design, 🔍 SEO, 📱 Social Media Marketing, 🎨 Graphic Design, ✍️ Article Writing, 🎬 Video Editing, and 📝 Content Creation.<br><br>Want to discuss which suits you best?<br>${BOTH_BTNS}`,

    "what are your pricing options?": `Our pricing is project-based and very competitive 💰. The best way to get an accurate quote is to speak with us directly — no obligation!<br>${BOTH_BTNS}`,

    pricing: `Every project is custom-quoted based on your needs and goals. Let's have a quick chat!<br>${BOTH_BTNS}`,

    website: `We build high-converting, stunning websites! 🖥 Let's talk about your project:<br>${BOTH_BTNS}`,

    seo: `We've ranked clients on page 1 of Google in under 6 weeks! 🔍 Let's discuss your SEO goals:<br>${BOTH_BTNS}`,

    "social media": `From content to ads, we handle it all 📱. Ready to grow your audience?<br>${BOTH_BTNS}`,

    video: `We produce scroll-stopping video content 🎬. Let's talk about your vision:<br>${BOTH_BTNS}`,

    graphic: `From logos to full brand identities 🎨 — we've got you covered. Chat with us:<br>${BOTH_BTNS}`,

    content: `We craft content that ranks AND converts ✍️. Let's build your content strategy:<br>${BOTH_BTNS}`,

    hello: `Hey there! 👋 How can HR Web Solutions help you today? Feel free to ask anything or reach us directly:<br>${BOTH_BTNS}`,

    hi: `Hi! 👋 Great to have you here. What can we help you with today?<br>${BOTH_BTNS}`,

    default: `Great question! The fastest way to get a clear answer is to speak with our team directly:<br>${BOTH_BTNS}`,
  };





  function openChat() {
    chatOpen = true;
    chatWindow.classList.remove("hidden");
    chatNotif.style.display = "none";
    chatIconOpen.classList.add("hidden");
    chatIconClose.classList.remove("hidden");
    chatInput.focus();
  }

  function closeChat() {
    chatOpen = false;
    chatWindow.classList.add("hidden");
    chatIconOpen.classList.remove("hidden");
    chatIconClose.classList.add("hidden");
  }

  chatToggle.addEventListener("click", () =>
    chatOpen ? closeChat() : openChat(),
  );
  chatClose.addEventListener("click", closeChat);

  function addMessage(text, type, isHTML = false) {
    const bubble = document.createElement("div");
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
    quickReplies.style.display = "none";
    chatInput.value = "";

    // User bubble
    addMessage(text, "user");

    // Typing indicator
    const typing = addMessage("● ● ●", "typing");

    setTimeout(
      () => {
        typing.remove();
        const reply = getBotReply(text);
        addMessage(reply, "bot", true);
      },
      900 + Math.random() * 600,
    );
  }

  chatSend.addEventListener("click", () => sendMessage(chatInput.value));
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage(chatInput.value);
  });

  // Quick reply buttons
  document.querySelectorAll(".qr-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      sendMessage(btn.dataset.reply);
    });
  });

  // Auto-open notification after 4s
  setTimeout(() => {
    if (!chatOpen) {
      chatNotif.style.display = "flex";
    }
  }, 4000);

  /* ==========================================
     9. SMOOTH ANCHOR SCROLLING
  ========================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}); // end DOMContentLoaded
