(() => {
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ---------- theme switcher (light / dark / glow) ---------- */
  const themeBtns = $$("[data-set-theme]");
  function setTheme(t, save = true) {
    root.setAttribute("data-theme", t);
    themeBtns.forEach((b) => {
      const on = b.dataset.setTheme === t;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
    if (save) { try { localStorage.setItem("theme", t); } catch (e) {} }
  }
  setTheme(root.getAttribute("data-theme") || "light", false);
  themeBtns.forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.setTheme)));

  /* ---------- mobile menu ---------- */
  const nav = $(".nav");
  const burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  $$(".links a").forEach((a) => a.addEventListener("click", () => {
    nav.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }));

  /* ---------- bouncy headline letters ---------- */
  $$("[data-letters]").forEach((el) => {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    el.textContent = "";
    const words = text.split(" ");
    words.forEach((word, wi) => {
      const w = document.createElement("span");
      w.className = "w";
      w.setAttribute("aria-hidden", "true");
      [...word].forEach((ch) => {
        const s = document.createElement("span");
        s.textContent = ch;
        w.appendChild(s);
      });
      el.appendChild(w);
      if (wi < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- typing line ---------- */
  const typed = $("#typed");
  if (typed && !reduce) {
    const words = ["Python developer", "web builder", "digital product maker", "creator at heart"];
    let w = 0, c = 0, del = false;
    const tick = () => {
      const word = words[w];
      typed.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1500); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 40 : 80);
    };
    tick();
  }

  /* ---------- twinkling stars (visible in dark and glow) ---------- */
  const stars = $("#stars");
  for (let i = 0; i < 46; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--d", (Math.random() * 4).toFixed(2) + "s");
    s.style.setProperty("--s", (4 + Math.random() * 8).toFixed(1) + "px");
    stars.appendChild(s);
  }

  /* ---------- pointer position (shared) ---------- */
  let mx = innerWidth / 2, my = innerHeight / 2;
  if (hover) addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; });

  /* ---------- sparkle trail ---------- */
  if (hover && !reduce) {
    const colors = ["#ff8fb8", "#b79cff", "#8fe3cf", "#ffe29a"];
    let last = 0;
    addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - last < 70) return;
      last = now;
      const t = document.createElement("span");
      t.className = "trail";
      t.textContent = "✦";
      t.style.left = e.clientX + "px";
      t.style.top = e.clientY + "px";
      t.style.color = pick(colors);
      document.body.appendChild(t);
      t.addEventListener("animationend", () => t.remove());
    });
  }

  /* ---------- click burst of hearts and stars ---------- */
  addEventListener("click", (e) => {
    if (reduce || e.target.closest("input, textarea, select")) return;
    for (let i = 0; i < 7; i++) {
      const p = document.createElement("span");
      p.className = "pop";
      p.textContent = pick(["💖", "✨", "🌸", "💫", "⭐", "🎀"]);
      const a = Math.random() * Math.PI * 2;
      const d = 40 + Math.random() * 60;
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
      p.style.setProperty("--dx", Math.cos(a) * d + "px");
      p.style.setProperty("--dy", Math.sin(a) * d - 30 + "px");
      document.body.appendChild(p);
      p.addEventListener("animationend", () => p.remove());
    }
  });

  /* ---------- Mochi the cat: follows the cursor, eyes look at you ---------- */
  const mascot = $("#mascot");
  const bubble = $("#bubble");
  const pupils = $$(".pupil");
  const lines = ["hi! 💕", "you found me!", "nice to meet you ✿", "check out the projects!", "keep going, future dev!", "boop!"];
  let tx = innerWidth - 110, ty = innerHeight - 130;
  let px = tx, py = ty;
  const park = () => { tx = innerWidth - 110; ty = innerHeight - 130; };
  const follow = hover && !reduce;

  function say(text, ms = 1900) {
    bubble.textContent = text;
    bubble.classList.add("show");
    clearTimeout(say.t);
    say.t = setTimeout(() => bubble.classList.remove("show"), ms);
  }
  mascot.addEventListener("click", (e) => { e.stopPropagation(); say(pick(lines)); });
  setTimeout(() => say("hi! 💕", 2600), 1200);

  if (follow) {
    addEventListener("pointermove", (e) => {
      tx = Math.min(innerWidth - 96, e.clientX + 34);
      ty = Math.min(innerHeight - 90, e.clientY + 34);
    });
    document.documentElement.addEventListener("mouseleave", park);
    (function frame() {
      px += (tx - px) * 0.08;
      py += (ty - py) * 0.08;
      mascot.style.transform = `translate(${px}px, ${py}px)`;
      const r = mascot.getBoundingClientRect();
      const dx = mx - (r.left + r.width / 2);
      const dy = my - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy) || 1;
      const k = Math.min(3.5, dist / 40);
      pupils.forEach((p) => { p.style.transform = `translate(${(dx / dist) * k}px, ${(dy / dist) * k}px)`; });
      requestAnimationFrame(frame);
    })();
  } else {
    const place = () => { park(); mascot.style.transform = `translate(${tx}px, ${ty}px)`; };
    place();
    addEventListener("resize", place);
  }

  /* ---------- 3D book follows the pointer (spins gently on touch) ---------- */
  const book = $("#book");
  if (book) {
    if (hover && !reduce) {
      let ry = -28, rx = 8, tRy = -28, tRx = 8;
      addEventListener("pointermove", (e) => {
        tRy = -28 + (e.clientX / innerWidth - 0.5) * 70;
        tRx = 8 - (e.clientY / innerHeight - 0.5) * 40;
      });
      (function loop() {
        ry += (tRy - ry) * 0.08;
        rx += (tRx - rx) * 0.08;
        book.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        requestAnimationFrame(loop);
      })();
    } else if (!reduce) {
      book.classList.add("auto");
    }
  }

  /* ---------- draggable stickers ---------- */
  $$("[data-drag]").forEach((el) => {
    let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
    el.addEventListener("pointerdown", (e) => {
      dragging = true;
      el.setPointerCapture(e.pointerId);
      sx = e.clientX - ox;
      sy = e.clientY - oy;
      el.classList.add("drag");
    });
    el.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      ox = e.clientX - sx;
      oy = e.clientY - sy;
      el.style.setProperty("--x", ox + "px");
      el.style.setProperty("--y", oy + "px");
    });
    const end = () => { dragging = false; el.classList.remove("drag"); };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  });

  /* ---------- 3D tilt on glass cards ---------- */
  if (hover && !reduce) {
    $$(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        const ry = (x / r.width - 0.5) * 16;
        const rx = (y / r.height - 0.5) * -16;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
        card.style.setProperty("--mx", x + "px");
        card.style.setProperty("--my", y + "px");
      });
      card.addEventListener("pointerleave", () => { card.style.transform = ""; });
    });
  }
})();
