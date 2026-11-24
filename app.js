(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var R = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var S = { th: null, photos: [], vals: {}, auto: {}, html: "" }, tone = "h";
  var gsEl = document.getElementById("gsapSrc"), GS = gsEl ? gsEl.textContent : "";
  function getGS() { return GS ? Promise.resolve(GS) : fetch("js/gsap.min.js").then(function (r) { return r.text(); }).then(function (t) { return (GS = t); }); }
  if (!GS) getGS().catch(function () {});
  var VK = { "Ulang tahun": "ultah", "Selamat": "selamat", "Terima kasih": "terima", "Apresiasi": "apresiasi" };
  function tplKey() { return S.th === "appreciation" ? VK[S.vals.jenis || "Ulang tahun"] : S.th; }
  var enc = new TextEncoder();
  function tpl(k) { return TPL[k].replace(/<\\\/script/g, "</script"); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* [kunci, label, tipe (t/a/s), wajib, placeholder] */
  var N = ["nama", "Nama penerima", "t", 1, "Nama orang yang kamu tuju"];
  var F = {
    love: { h: "Tulis suratmu", f: [N,
      ["panggil", "Panggilan", "t", 0, "Mis. Sayang"],
      ["pembuka", "Pembuka", "a", 0, "Aku sebenarnya sudah lama ingin mengatakan ini..."],
      ["isi", "Isi utama", "a", 1, "Ada banyak hal kecil tentangmu yang membuat hariku lebih berarti."],
      ["kenangan", "Kenangan", "a", 0, "Aku masih ingat saat pertama kali kita..."],
      ["penutup", "Penutup", "a", 0, "Terima kasih sudah menjadi bagian dari ceritaku."],
      ["pengirim", "Tanda tangan", "t", 0, "Dari seseorang yang menyayangimu"]] },
    friendship: { h: "Tulis untuk sahabatmu", photo: 1, f: [N,
      ["sapaan", "Sapaan", "t", 0, "Hai, sahabatku..."],
      ["kenangan", "Kenangan bersama", "a", 1, "Kenangan kita semasa sekolah..."],
      ["terima", "Ucapan terima kasih", "a", 0, "Terima kasih sudah selalu ada."],
      ["harapan", "Harapan", "a", 0, "Semoga kita tetap saling menemani."],
      ["pengirim", "Tanda tangan", "t", 0, "Dari temanmu"]] },
    appreciation: { h: "Tulis ucapanmu", f: [
      ["jenis", "Jenis ucapan", "s", 1, "Ulang tahun|Selamat|Terima kasih|Apresiasi"], N,
      ["judul", "Judul", "t", 0, "Selamat ulang tahun!"],
      ["pesan", "Pesan utama", "a", 1, "Semoga hari ini dan hari-hari berikutnya menyenangkan."],
      ["doa", "Doa atau harapan", "a", 0, "Semoga semua yang kamu cita-citakan tercapai."],
      ["pengirim", "Tanda tangan", "t", 0, "Dari temanmu"]] }
  };

  function go(k) {
    $$(".scr").forEach(function (e) { e.hidden = e.id !== "s-" + k; });
    if (k !== "out") $("#pv").srcdoc = "";
    $("#wmapp").hidden = k === "out";
    if (k === "ref" || k === "open" || k === "how") { delete document.body.dataset.th; delete document.body.dataset.acc; } else theme();
    var e = $("#s-" + k), bar = $("#bar");
    window.scrollTo(0, 0);
    bar.style.display = k === "ref" ? "" : "none";
    if (window.gsap && !R) gsap.fromTo(e, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform,opacity" });
  }


  /* ---------- Asisten Tulis: algoritma sederhana, bukan AI sungguhan, tanpa biaya ---------- */
  var B = {
    greet: { h: ["Hai{n}, aku sebenarnya sudah lama ingin mengatakan ini.", "Halo{n}, ada sesuatu yang ingin kusampaikan dari hati."], s: ["Hai{n}, jadi gini, ada yang pengin aku bilang dari dulu.", "Halo{n}, jangan kaget ya, aku lagi pengin nulis buat kamu."], p: ["Untuk{n}, kata-kata ini lama menunggu di ujung hatiku.", "Hai{n}, izinkan aku menitipkan sedikit rasa lewat tulisan ini."] },
    bodyL: { h: ["Ada banyak hal kecil tentangmu yang membuat hariku lebih berarti.", "Kehadiranmu membuat hari-hari biasa terasa istimewa.", "Aku bersyukur bisa mengenalmu dan berjalan bersamamu."], s: ["Jujur, hari-hariku jauh lebih seru sejak ada kamu.", "Hal-hal kecil dari kamu tuh bikin aku senyum sendiri.", "Aku seneng banget kamu ada di hidupku."], p: ["Kehadiranmu seperti cahaya senja yang membuat segalanya terasa hangat.", "Di antara riuhnya hari, namamu selalu jadi tempat paling tenang.", "Setiap hal kecil darimu adalah puisi yang tak pernah selesai kubaca."] },
    bodyA: { h: ["Terima kasih sudah menjadi pribadi yang begitu berarti bagi orang-orang di sekitarmu.", "Apa yang kamu lakukan selama ini tidak pernah luput dari perhatian.", "Kamu pantas mendapatkan semua hal baik hari ini."], s: ["Pokoknya kamu keren, dan hari ini aku pengin bilang itu langsung.", "Makasih ya, kamu tuh bener-bener bikin suasana jadi lebih baik.", "Kamu layak dapet perayaan kecil hari ini."], p: ["Ada orang yang diam-diam membuat dunia lebih terang, dan kamu salah satunya.", "Langkah-langkah kecilmu meninggalkan jejak indah bagi banyak orang.", "Hari ini, biarlah semesta ikut merayakanmu."] },
    mem: { h: ["Aku masih ingat saat kita tertawa tanpa alasan, dan itu salah satu kenangan yang paling kusayang.", "Setiap kenangan bersamamu selalu membuatku tersenyum saat teringat."], s: ["Inget nggak waktu kita ketawa sampai capek? Itu momen favoritku.", "Kenangan kita tuh nggak ada duanya, deh."], p: ["Kenangan kita seperti foto lama: pudar di tepinya, tapi hangat di tengahnya.", "Ada tawa kita dulu yang masih tinggal di sudut hatiku."] },
    thanks: { h: ["Terima kasih sudah menjadi bagian dari ceritaku.", "Terima kasih untuk semua waktu dan perhatian yang kamu berikan."], s: ["Makasih ya, udah selalu ada.", "Makasih banyak buat semuanya, beneran."], p: ["Terima kasih telah menjadi halaman terindah dalam ceritaku.", "Terima kasih, kamu bagian yang tak ingin kulewatkan."] },
    wish: { h: ["Semoga kita selalu sehat, bahagia, dan saling menguatkan.", "Semoga hari-harimu dipenuhi hal baik dan orang-orang yang menyayangimu."], s: ["Semoga kita bisa bareng-bareng terus, ya.", "Semoga hidupmu lancar dan selalu banyak alasan buat ketawa."], p: ["Semoga langkahmu selalu ditemani cahaya dan kabar baik.", "Semoga setiap harimu mekar seindah yang kamu pantas dapatkan."] }
  };
  var KW = { h: "Kamu {k}, dan itu membuat hari-hariku lebih berarti.", s: "Jujur, kamu tuh {k} banget.", p: "Kamu {k}, seperti cahaya kecil yang tak pernah minta dilihat." };
  var JUDUL = { "Ulang tahun": "Selamat ulang tahun{n}!", "Selamat": "Selamat{n}!", "Terima kasih": "Terima kasih{n}!", "Apresiasi": "Kamu luar biasa!" };
  var MAP = { love: { pembuka: ["greet", 1], isi: ["bodyL", 2], kenangan: ["mem", 2], penutup: ["thanks", 1] }, friendship: { sapaan: ["greet", 1], kenangan: ["mem", 2], terima: ["thanks", 1], harapan: ["wish", 1] }, appreciation: { pesan: ["bodyA", 2], doa: ["wish", 1] } };
  var ASST = '<div class="asst"><b>Asisten Tulis</b><p>Bingung mulai dari mana? Pilih nada, lalu Dearly menyusun draf. Ini algoritma sederhana di perangkatmu, bukan AI sungguhan, dan gratis. Hanya kolom yang masih kosong yang diisi, dan semuanya bisa kamu ubah.</p><div class="tones" role="group" aria-label="Nada tulisan"><button type="button" class="on" data-tn="h">Hangat</button><button type="button" data-tn="s">Santai</button><button type="button" data-tn="p">Puitis</button></div><input type="text" id="kw" placeholder="Sifat dia, mis. baik, lucu, setia (opsional)"><button type="button" class="pick" id="dr">Buatkan draf</button></div>';
  function pick(a, n) { var c = a.slice(), o = []; while (o.length < n && c.length) o.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return o; }
  function draft() {
    var m = MAP[S.th], n = S.vals.panggil || S.vals.nama, nn = n ? " " + n : "";
    var kws = ($("#kw").value || "").split(",").map(function (x) { return x.trim(); }).filter(Boolean).slice(0, 4);
    var k = kws.length > 1 ? kws.slice(0, -1).join(", ") + " dan " + kws[kws.length - 1] : (kws[0] || "");
    Object.keys(m).concat(S.th === "appreciation" ? ["judul"] : []).forEach(function (key) {
      if (S.vals[key] && S.vals[key] !== S.auto[key]) return;
      var t;
      if (key === "judul") t = JUDUL[S.vals.jenis || "Ulang tahun"];
      else { var r = m[key]; t = pick(B[r[0]][tone], r[1]).join(" "); if (k && (key === "isi" || key === "pesan")) t += " " + KW[tone].replace("{k}", k); }
      t = t.replace(/\{n\}/g, nn); S.vals[key] = S.auto[key] = t; $("#f_" + key).value = t;
    });
    $("#dr").textContent = "Acak lagi";
  }

  /* ---------- formulir sesuai tema ---------- */
  function build() {
    var c = F[S.th], h = "<h2>" + c.h + '</h2><p class="sub">Kolom wajib harus diisi, sisanya boleh dikosongkan. Semua tulisan bisa kamu ubah.</p>' + ASST;
    c.f.forEach(function (x) {
      var id = "f_" + x[0], v = S.vals[x[0]] || "";
      h += '<div class="fld"><label for="' + id + '">' + x[1] + " <em>" + (x[3] ? "wajib" : "opsional") + "</em></label>";
      if (x[2] === "s") {
        h += '<div class="opts" id="' + id + '" data-s="' + x[0] + '" role="radiogroup">' + x[4].split("|").map(function (o) { return '<button type="button" role="radio" data-v="' + o + '"' + ((v || x[4].split("|")[0]) === o ? ' class="on"' : "") + ">" + o + "</button>"; }).join("") + "</div>";
      } else if (x[2] === "a") {
        h += '<textarea id="' + id + '" data-k="' + x[0] + '" rows="4" placeholder="' + esc(x[4]) + '">' + esc(v) + "</textarea>";
      } else {
        h += '<input id="' + id + '" data-k="' + x[0] + '" type="text" placeholder="' + esc(x[4]) + '" value="' + esc(v) + '">';
      }
      h += '<p class="err" hidden>Isi bagian ini dulu.</p></div>';
    });
    if (c.photo) h += '<div class="fld"><label>Foto polaroid <em>opsional, maks 8</em></label><button type="button" class="ghost" id="addPh">Tambah foto</button><input type="file" id="fi" accept="image/*" multiple hidden><div class="thumbs" id="thumbs"></div></div>';
    h += '<button type="submit" class="pick" id="mk">Buat website</button><button type="button" class="ghost" id="bk">Ganti tema</button>';
    var f = $("#form"); f.innerHTML = h;
    $("#s-write").setAttribute("data-th", S.th);
    $$("[data-k]", f).forEach(function (el) {
      if (el.tagName === "SELECT" && !S.vals[el.dataset.k]) S.vals[el.dataset.k] = el.value;
      el.addEventListener("input", function () { S.vals[el.dataset.k] = el.value; el.classList.remove("bad"); });
    });
    $$("[data-s]", f).forEach(function (d) {
      var k = d.dataset.s; if (!S.vals[k]) S.vals[k] = $("button", d).dataset.v;
      $$("button", d).forEach(function (b) { b.onclick = function () { S.vals[k] = b.dataset.v; $$("button", d).forEach(function (z) { z.classList.toggle("on", z === b); }); }; });
    });
    theme();
    tone = "h";
    $$(".tones button").forEach(function (b) { b.onclick = function () { tone = b.dataset.tn; $$(".tones button").forEach(function (x) { x.classList.toggle("on", x === b); }); }; });
    $("#dr").onclick = draft;
    $("#bk").onclick = function () { go("ref"); };
    if (c.photo) {
      $("#addPh").onclick = function () { $("#fi").click(); };
      $("#fi").onchange = function () { addFiles(this.files); this.value = ""; };
      thumbs();
    }
  }

  function addFiles(fl) {
    Array.prototype.slice.call(fl).slice(0, 8 - S.photos.length).forEach(function (f) {
      var u = URL.createObjectURL(f), im = new Image();
      im.onload = function () {
        var k = Math.min(1, 900 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        S.photos.push(c.toDataURL("image/jpeg", 0.8)); URL.revokeObjectURL(u); thumbs();
      };
      im.src = u;
    });
  }
  function thumbs() {
    var t = $("#thumbs"); if (!t) return;
    t.innerHTML = S.photos.map(function (p, i) { return '<span><img src="' + p + '" alt="Foto ' + (i + 1) + '"><button type="button" data-i="' + i + '" aria-label="Hapus foto ' + (i + 1) + '">&times;</button></span>'; }).join("");
    $$("button", t).forEach(function (b) { b.onclick = function () { S.photos.splice(+b.dataset.i, 1); thumbs(); }; });
    $("#addPh").hidden = S.photos.length >= 8;
  }

  /* ---------- generator berbasis template ---------- */
  function fill(t, v) {
    t = t.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, function (_, k, b) { return v[k] ? b : ""; });
    return t.replace(/\{\{(\w+)\}\}/g, function (_, k) { var x = v[k] || ""; return /^(photos|acc|acc2|soft|snd)$/.test(k) ? x : esc(x).replace(/\n/g, "<br>"); });
  }
  function gen(e) {
    e.preventDefault();
    var v = {}, bad = null;
    F[S.th].f.forEach(function (x) {
      v[x[0]] = (S.vals[x[0]] || "").trim();
      var el = $("#f_" + x[0]), er = el.parentNode.querySelector(".err");
      var no = x[3] && !v[x[0]]; el.classList.toggle("bad", no); er.hidden = !no;
      if (no && !bad) bad = el;
    });
    if (bad) { bad.focus(); return; }
    v.sapa = v.panggil || v.nama;
    v.acc = $('.card[data-theme="appreciation"]').dataset.acc === "pink" ? "#d9648a" : "#3f74b8";
    var pk = $('.card[data-theme="appreciation"]').dataset.acc === "pink";
    v.acc2 = pk ? "#8a2a4f" : "#1d3a6b"; v.soft = pk ? "#fbdde7" : "#dbe8f8";
    v.harap2 = v.harapan || "Semoga kita tetap saling menemani."; v.snd = tpl("snd");
    v.photos = S.photos.map(function (_, i) { return '<figure class="pol"><img src="foto/foto' + (i + 1) + '.jpg" alt="Foto kenangan ' + (i + 1) + '"></figure>'; }).join("");
    S.slug = "dearly-" + (v.nama.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "pesan");
    S.html = fill(tpl(tplKey()), v);
    var b = $("#mk"); b.textContent = "Merangkai dunia kecilmu…"; b.disabled = true;
    setTimeout(function () { b.disabled = false; b.textContent = "Buat website"; $("#code").value = S.html; tab("pv"); go("out"); saveRec(KH); }, R ? 0 : 900);
  }

  function full(html) {
    S.photos.forEach(function (p, i) { html = html.split("foto/foto" + (i + 1) + ".jpg").join(p); });
    return html.replace('<script src="gsap.min.js"><\/script>', function () { return GS ? "<script>" + GS + "<\/script>" : '<script src="' + new URL("js/gsap.min.js", location.href).href + '"><\/script>'; });
  }
  function preview() { $("#pv").srcdoc = full(S.html); }
  function tab(t) {
    $$(".tabs button").forEach(function (b) { b.classList.toggle("on", b.dataset.t === t); });
    if (t === "pv") preview(); else $("#pv").srcdoc = "";
    ["pv", "kd", "dl"].forEach(function (k) { $("#t-" + k).hidden = k !== t; });
  }

  /* ---------- unduh ---------- */
  function save(blob, name) {
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); }, 800);
  }
  function crc(b) {
    var t = crc.t || (crc.t = (function () { var a = [], c, n, k; for (n = 0; n < 256; n++) { c = n; for (k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; a[n] = c >>> 0; } return a; })()), r = -1;
    for (var i = 0; i < b.length; i++) r = t[(r ^ b[i]) & 255] ^ (r >>> 8);
    return (r ^ -1) >>> 0;
  }
  function zip(files) {
    var parts = [], cd = [], off = 0;
    files.forEach(function (f) {
      var n = enc.encode(f.n), c = crc(f.d), h = new DataView(new ArrayBuffer(30)), e = new DataView(new ArrayBuffer(46));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(12, 0x21, true);
      h.setUint32(14, c, true); h.setUint32(18, f.d.length, true); h.setUint32(22, f.d.length, true); h.setUint16(26, n.length, true);
      parts.push(new Uint8Array(h.buffer), n, f.d);
      e.setUint32(0, 0x02014b50, true); e.setUint16(4, 20, true); e.setUint16(6, 20, true); e.setUint16(8, 0x0800, true); e.setUint16(14, 0x21, true);
      e.setUint32(16, c, true); e.setUint32(20, f.d.length, true); e.setUint32(24, f.d.length, true); e.setUint16(28, n.length, true); e.setUint32(42, off, true);
      cd.push(new Uint8Array(e.buffer), n); off += 30 + n.length + f.d.length;
    });
    var cs = cd.reduce(function (s, x) { return s + x.length; }, 0), z = new DataView(new ArrayBuffer(22));
    z.setUint32(0, 0x06054b50, true); z.setUint16(8, files.length, true); z.setUint16(10, files.length, true); z.setUint32(12, cs, true); z.setUint32(16, off, true);
    return new Blob(parts.concat(cd, [new Uint8Array(z.buffer)]), { type: "application/zip" });
  }
  function split(html) {
    var css = "", lib = "", page = "", n = 0;
    html = html.replace(/<style>([\s\S]*?)<\/style>/, function (_, c) { css = c.trim(); return '<link rel="stylesheet" href="style.css">'; });
    html = html.replace(/<script>([\s\S]*?)<\/script>/g, function (_, c) { n++; if (n === 1) { lib = c.trim(); return '<script src="motion.js"><\/script>'; } page = c.trim(); return '<script src="script.js"><\/script>'; });
    return { html: html, css: css, lib: lib, page: page };
  }
  function bytes(p) { var s = atob(p.split(",")[1]), a = new Uint8Array(s.length); for (var i = 0; i < s.length; i++) a[i] = s.charCodeAt(i); return a; }

  function theme() {
    document.body.dataset.th = S.th || "";
    var c = $('.card[data-theme="appreciation"]'); if (S.th === "appreciation" && c) document.body.dataset.acc = c.dataset.acc || "blue"; else delete document.body.dataset.acc;
  }

  /* ---------- Riwayat & Library (localStorage) ---------- */
  var KH = "dearly.riwayat", KL = "dearly.library", TN = { love: "Love", friendship: "Friendship", appreciation: "Appreciation" };
  function ld(k) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } }
  function sv(k, a) { try { localStorage.setItem(k, JSON.stringify(a)); return true; } catch (e) { return false; } }
  function saveRec(k) {
    if (!S.rid) S.rid = String(Date.now());
    var r = { id: S.rid, th: S.th, acc: $('.card[data-theme="appreciation"]').dataset.acc, vals: S.vals, photos: S.photos, ts: Date.now() };
    var a = ld(k).filter(function (x) { return x.id !== r.id; }); a.unshift(r); a = a.slice(0, k === KH ? 30 : 60);
    while (!sv(k, a) && a.length > 1) a.pop();
    if (!sv(k, a)) { r.photos = []; a[0] = r; if (!sv(k, a)) S.noStore = true; }
  }
  function renderH(t) {
    var a = ld(t === "lib" ? KL : KH), box = $("#hList"), h = "";
    if (S.noStore) h += '<p class="note">Penyimpanan browser tidak tersedia di tampilan ini. Di GitHub Pages atau browser biasa, riwayat akan tersimpan.</p>';
    if (!a.length) h += '<p class="note">' + (t === "lib" ? "Library masih kosong. Simpan website dari layar Hasil." : "Belum ada riwayat. Website yang kamu buat akan muncul di sini.") + "</p>";
    a.forEach(function (r, i) {
      h += '<div class="hi"><div><b>' + esc(r.vals.judul || r.vals.nama || "Tanpa judul") + "</b><small>" + TN[r.th] + (r.th === "appreciation" ? " · " + esc(r.vals.jenis || "") : "") + " · " + new Date(r.ts).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + '</small></div><span><button data-a="open" data-i="' + i + '">Buka</button>' + (t === "lib" ? "" : '<button data-a="lib" data-i="' + i + '">Simpan</button>') + '<button data-a="del" data-i="' + i + '">Hapus</button></span></div>';
    });
    box.innerHTML = h;
    $$("button", box).forEach(function (b) {
      b.onclick = function () {
        var k = t === "lib" ? KL : KH, a2 = ld(k), r = a2[+b.dataset.i]; if (!r) return;
        if (b.dataset.a === "del") { a2.splice(+b.dataset.i, 1); sv(k, a2); renderH(t); }
        else if (b.dataset.a === "lib") { var l = ld(KL).filter(function (x) { return x.id !== r.id; }); l.unshift(r); if (!sv(KL, l)) S.noStore = true; b.textContent = "Tersimpan"; }
        else openRec(r);
      };
    });
  }
  function openRec(r) {
    S.th = r.th; S.vals = r.vals || {}; S.photos = r.photos || []; S.auto = {}; S.rid = r.id;
    $('.card[data-theme="appreciation"]').dataset.acc = r.acc || "blue";
    $("#hist").classList.remove("open"); build(); go("write");
    $("#form").dispatchEvent(new Event("submit", { cancelable: true }));
  }

  function init() {
    function hTab(t) { $$(".htabs button").forEach(function (x) { x.classList.toggle("on", x.dataset.t === t); }); renderH(t === "lib" ? "lib" : "h"); }
    $("#hBtn").onclick = function () { $("#hist").classList.add("open"); hTab("h"); };
    $$(".htabs button").forEach(function (b) { b.onclick = function () { hTab(b.dataset.t); }; });
    $("#hClose").onclick = $("#hBg").onclick = function () { $("#hist").classList.remove("open"); };
    $("#toLib").onclick = function () { saveRec(KL); var b = $("#toLib"); b.textContent = S.noStore ? "Tidak bisa menyimpan di sini" : "Tersimpan di Library"; setTimeout(function () { b.textContent = "Simpan ke Library"; }, 2200); };
    window.dearlyGo = function (k) {
      if (k === "write") { S.th = window.dearlyTheme; if (!S.th) return; S.vals = {}; S.auto = {}; S.rid = null; build(); }
      go(k);
    };
    $("#yes").onclick = function () { go("how"); };
    $("#later").onclick = function () { $("#laterMsg").hidden = false; };
    $("#start").onclick = function () { go("ref"); };
    $("#form").addEventListener("submit", gen);
    $$(".tabs button").forEach(function (b) { b.onclick = function () { tab(b.dataset.t); }; });
    $("#upd").onclick = function () { S.html = $("#code").value; tab("pv"); };
    $("#edit").onclick = function () { go("write"); };
    $("#dlHtml").onclick = function () { save(new Blob([full(S.html)], { type: "text/html" }), S.slug + ".html"); $("#dlNote").hidden = false; };
    $("#dlZip").onclick = function () {
      getGS().then(function (gs) {
        var sp = split(S.html), d = S.slug + "/";
        var fl = [{ n: d + "index.html", d: enc.encode(sp.html) }, { n: d + "style.css", d: enc.encode(sp.css) }, { n: d + "motion.js", d: enc.encode(sp.lib) }, { n: d + "script.js", d: enc.encode(sp.page) }, { n: d + "gsap.min.js", d: enc.encode(gs) }];
        S.photos.forEach(function (p, i) { fl.push({ n: d + "foto/foto" + (i + 1) + ".jpg", d: bytes(p) }); });
        save(zip(fl), S.slug + ".zip"); $("#dlNote").hidden = false;
      });
    };
    function copyText(t, id) {
      var m = $("#" + id), ok = function (s) { m.textContent = s; m.hidden = false; setTimeout(function () { m.hidden = true; }, 3500); };
      function fb() {
        var ta = document.createElement("textarea"); ta.value = t; ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
        document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, t.length);
        var y = false; try { y = document.execCommand("copy"); } catch (e) {} ta.remove();
        ok(y ? "Kode tersalin." : "Gagal menyalin. Buka tab Kode, pilih semua, lalu salin manual.");
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(function () { ok("Kode tersalin."); }, fb); else fb();
    }
    $("#cp").onclick = function () { copyText(S.html, "cpMsg"); };
    $("#cpFull").onclick = function () { copyText(full(S.html), "cpMsg2"); };
    $("#again").onclick = function () { S.photos = []; S.vals = {}; S.rid = null; go("ref"); };
    go("open");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
