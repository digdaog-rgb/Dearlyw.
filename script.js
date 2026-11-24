(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var hasGsap = typeof gsap !== "undefined";
  var anims = {}; // animasi per tema
  var hearts = null;

  /* ---------- LOVE: amplop terbuka, surat naik, hati melayang ---------- */
  function buildLove() {
    var q = gsap.utils.selector($("#art-love"));
    var tl = gsap.timeline({ paused: true });
    tl.set(q(".flapF"), { scaleY: 1, svgOrigin: "150 170" })
      .set(q(".flapB"), { scaleY: 0, svgOrigin: "150 170" })
      .set(q(".letter"), { y: 0 })
      .to(q(".flapF"), { scaleY: 0, duration: 0.35, ease: "power2.in" }, 0.5)
      .to(q(".flapB"), { scaleY: 1, duration: 0.35, ease: "power2.out" }, 0.85)
      .to(q(".letter"), { y: -66, duration: 1, ease: "power3.out" }, 1.15);
    hearts = gsap.to(q(".h"), {
      keyframes: { y: [0, -210], opacity: [0, 0.9, 0], scale: [0.6, 1.1, 1], easeEach: "sine.inOut" },
      duration: 3.2, repeat: -1, stagger: 0.55, paused: true
    });
    gsap.set(q(".h"), { opacity: 0 });
    anims.love = tl;
  }

  /* ---------- FRIENDSHIP: polaroid jatuh dan memantul ---------- */
  function buildFriend() {
    var q = gsap.utils.selector($("#art-friend"));
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(q(".pol"),
      { y: -440, rotation: -22, opacity: 0 },
      { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: "bounce.out", stagger: 0.38 });
    anims.friendship = tl;
  }

  /* ---------- APPRECIATION: kartu terbuka + confetti sekali ---------- */
  function buildAppr() {
    var svg = $("#art-appr"), q = gsap.utils.selector(svg), conf = $(".conf", svg);
    var colors = ["#3f74b8", "#d9648a", "#f2c46d", "#8fc1a9", "#ffffff"];
    var ns = "http://www.w3.org/2000/svg";
    for (var i = 0; i < 26; i++) {
      var g = document.createElementNS(ns, "g");
      g.setAttribute("transform", "translate(" + (12 + Math.random() * 276).toFixed(0) + " 0)");
      var r = document.createElementNS(ns, i % 3 ? "rect" : "circle");
      if (r.tagName === "rect") { r.setAttribute("width", 7); r.setAttribute("height", 11); }
      else { r.setAttribute("r", 4); }
      r.setAttribute("fill", colors[i % colors.length]);
      r.setAttribute("class", "cf");
      g.appendChild(r); conf.appendChild(g);
    }
    var tl = gsap.timeline({ paused: true });
    tl.set(q(".cover"), { scaleX: 1, svgOrigin: "50 193" })
      .set(q(".inner"), { opacity: 0, y: 10 })
      .set(q(".cf"), { y: -30, opacity: 0 })
      .to(q(".cover"), { scaleX: 0, duration: 0.9, ease: "power2.inOut" }, 0.5)
      .to(q(".inner"), { opacity: 1, y: 0, duration: 0.6, stagger: 0.18, ease: "power2.out" }, 1.2)
      .to(q(".cf"), {
        y: 430, opacity: 1, rotation: "random(-420,420)", duration: "random(1.8,2.8)",
        ease: "power1.in", stagger: { each: 0.03, from: "random" }
      }, 1.3);
    anims.appreciation = tl;
  }

  function play(theme) {
    var tl = anims[theme];
    if (!tl) return;
    if (reduce) { tl.progress(1); return; }
    tl.restart();
    if (theme === "love" && hearts) hearts.play();
  }

  function init() {
    var cards = $$(".card");
    if (hasGsap) { buildLove(); buildFriend(); buildAppr(); }
    if (hasGsap && reduce) {
      Object.keys(anims).forEach(function (k) { anims[k].progress(1); });
      gsap.set(".cf", { opacity: 0 });
      gsap.set(".h", { opacity: 0.6 });
    }

    // animasi diputar saat kartu terlihat; hati berhenti saat tidak terlihat
    if (hasGsap && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var t = e.target.closest(".card").getAttribute("data-theme");
          if (e.isIntersecting) { play(t); }
          else if (t === "love" && hearts) { hearts.pause(); }
        });
      }, { threshold: 0.25 });
      cards.forEach(function (c) { io.observe($(".art", c)); });
    } else if (hasGsap) {
      cards.forEach(function (c) { play(c.getAttribute("data-theme")); });
    }

    // ketuk gambar atau arahkan kursor untuk memutar ulang
    cards.forEach(function (c) {
      var t = c.getAttribute("data-theme");
      $(".art", c).addEventListener("click", function () { if (hasGsap) play(t); });
    });

    // warna aksen Appreciation
    $$(".dot").forEach(function (d) {
      d.addEventListener("click", function () {
        var card = d.closest(".card");
        card.setAttribute("data-acc", d.getAttribute("data-acc"));
        $$(".dot", card).forEach(function (x) { x.classList.toggle("is-on", x === d); });
      });
    });

    // pilih tema
    var bar = $("#bar"), barText = $("#barText"), toast = $("#toast");
    var names = { love: "Love", friendship: "Friendship", appreciation: "Appreciation" };
    $$(".card .pick").forEach(function (b) {
      b.addEventListener("click", function () {
        var card = b.closest(".card"), t = card.getAttribute("data-theme");
        window.dearlyTheme = t;
        cards.forEach(function (c) {
          var on = c === card;
          c.classList.toggle("sel", on);
          $(".pick", c).textContent = on ? "Tema dipilih" : "Pilih tema ini";
        });
        barText.textContent = "Tema: " + names[t];
        bar.classList.add("show");
        if (hasGsap && !reduce) gsap.fromTo(bar, { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" });
        else { bar.style.transform = "none"; bar.style.opacity = 1; }
      });
    });

    $("#next").addEventListener("click", function () { if (window.dearlyGo) window.dearlyGo("write"); });

    // indikator titik di HP
    var track = $("#track"), dots = $$("#dots span");
    track.addEventListener("scroll", function () {
      var w = cards[0].offsetWidth + 16;
      var i = Math.max(0, Math.min(2, Math.round(track.scrollLeft / w)));
      dots.forEach(function (d, n) { d.classList.toggle("on", n === i); });
    }, { passive: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* jam analog (waktu perangkat) + buku panduan */
(function () {
  "use strict";
  function start() {
    var hH = document.getElementById("hH"), hM = document.getElementById("hM"), hS = document.getElementById("hS"), clock = document.getElementById("clock");
    function tick() {
      var d = new Date(), s = d.getSeconds(), m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
      hH.setAttribute("transform", "rotate(" + h * 30 + " 22 22)");
      hM.setAttribute("transform", "rotate(" + m * 6 + " 22 22)");
      hS.setAttribute("transform", "rotate(" + s * 6 + " 22 22)");
      clock.setAttribute("aria-label", "Jam " + String(d.getHours()).padStart(2, "0") + "." + String(d.getMinutes()).padStart(2, "0"));
    }
    tick(); setInterval(tick, 1000);

    var g = document.getElementById("guide"), card = document.getElementById("guideCard"), btn = document.getElementById("guideBtn"), x = document.getElementById("guideClose");
    var anim = typeof gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function open() {
      g.classList.add("open");
      if (anim) gsap.fromTo(card, { opacity: 0, y: -12, scale: 0.96, transformOrigin: "0% 0%" }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.5)" });
      x.focus();
    }
    function close() { g.classList.remove("open"); btn.focus(); }
    btn.addEventListener("click", open);
    x.addEventListener("click", close);
    document.getElementById("guideBg").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && g.classList.contains("open")) close(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
