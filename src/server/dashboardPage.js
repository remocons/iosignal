// The dashboard web page, kept as a string so it ships inside the package (no CDN, works offline).
// No backticks or template placeholders inside: the page is plain HTML, CSS and ES5-ish JavaScript.
const PAGE = String.raw`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>IOSignal Dashboard</title>
<style>
:root {
  --bg: #f3f5fa; --panel: #ffffff; --ink: #172036; --muted: #5f6a85; --line: #dde3ef; --grid: #e9edf5;
  --a: #0ea5a0; --b: #4f6bed; --c: #f59e0b; --d: #e5484d; --e: #8b5cf6; --ok: #22b573;
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --sans: system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root { --bg: #0d1220; --panel: #151c30; --ink: #e6ebf7; --muted: #8e99b8; --line: #263050; --grid: #1d2640;
    --a: #2dd4bf; --b: #7c93ff; --c: #fbbf24; --d: #ff6b6b; --e: #a78bfa; --ok: #34d399; color-scheme: dark; }
}
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 14px/1.5 var(--sans); }
header { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: 10px 16px; align-items: center;
  padding: 10px max(16px, env(safe-area-inset-left)); background: color-mix(in srgb, var(--bg) 88%, transparent);
  backdrop-filter: blur(8px); border-bottom: 1px solid var(--line); }
h1 { font-size: 16px; margin: 0; letter-spacing: .01em; }
h1 b { color: var(--a); }
.pill { font: 600 12px var(--mono); padding: 3px 10px; border-radius: 99px; background: var(--grid); color: var(--muted); }
.pill.live { background: color-mix(in srgb, var(--ok) 18%, transparent); color: var(--ok); }
.pill.live::before { content: ""; display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--ok); margin-right: 6px; animation: blink 1.2s infinite; }
.pill.bad { background: color-mix(in srgb, var(--d) 18%, transparent); color: var(--d); }
@keyframes blink { 50% { opacity: .25; } }
.meta { font: 12px var(--mono); color: var(--muted); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-left: auto; }
.chip { font: 600 12px var(--sans); border: 1px solid var(--line); background: var(--panel); color: var(--muted); border-radius: 99px; padding: 4px 11px; cursor: pointer; }
.chip[aria-pressed="true"] { background: var(--ink); color: var(--panel); border-color: var(--ink); }
.chip:focus-visible, button:focus-visible, input:focus-visible { outline: 2px solid var(--a); outline-offset: 2px; }
main { padding: 16px max(16px, env(safe-area-inset-left)) 40px; display: grid; gap: 14px; grid-template-columns: repeat(12, minmax(0, 1fr)); }
section.panel { background: var(--panel); border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; min-width: 0; display: grid; gap: 10px; align-content: start; }
section.panel h2 { font-size: 13px; margin: 0; color: var(--muted); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; display: flex; gap: 8px; align-items: baseline; }
section.panel h2 small { text-transform: none; letter-spacing: 0; font-weight: 500; font-family: var(--mono); }
.w12 { grid-column: span 12; } .w8 { grid-column: span 8; } .w6 { grid-column: span 6; } .w4 { grid-column: span 4; }
@media (max-width: 1100px) { .w8, .w4 { grid-column: span 12; } .w6 { grid-column: span 12; } }
.gauges { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
@media (max-width: 640px) { .gauges { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.gauge { display: grid; justify-items: center; gap: 2px; }
.gauge canvas { width: 100%; max-width: 150px; aspect-ratio: 1.45; }
.gauge span { font-size: 12px; color: var(--muted); }
canvas.chart { width: 100%; height: 150px; display: block; }
canvas.chart.tall { height: 190px; }
.legend { display: flex; flex-wrap: wrap; gap: 12px; font: 12px var(--mono); color: var(--muted); }
.legend i { display: inline-block; width: 10px; height: 3px; border-radius: 2px; margin-right: 5px; vertical-align: middle; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 8px; }
.stat { border: 1px solid var(--line); border-radius: 10px; padding: 8px 10px; display: grid; gap: 2px; }
.stat b { font: 700 20px var(--mono); font-variant-numeric: tabular-nums; }
.stat span { font-size: 12px; color: var(--muted); }
.stat.flash { animation: flash .8s ease-out; }
@keyframes flash { from { background: color-mix(in srgb, var(--d) 30%, transparent); } }
.hosts { display: grid; grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); gap: 12px; }
.host { border: 1px solid var(--line); border-radius: 12px; padding: 12px; display: grid; gap: 8px; position: relative; overflow: hidden; }
.host header { all: unset; display: flex; align-items: center; gap: 8px; }
.host h3 { margin: 0; font: 700 15px var(--mono); }
.pulse { width: 12px; height: 12px; border-radius: 50%; background: var(--a); box-shadow: 0 0 0 0 color-mix(in srgb, var(--a) 60%, transparent); }
.host .big { font: 800 30px var(--mono); line-height: 1; font-variant-numeric: tabular-nums; }
.host .row { display: flex; flex-wrap: wrap; gap: 4px 14px; font: 12px var(--mono); color: var(--muted); }
.host .row b { color: var(--ink); font-weight: 600; }
.host canvas { width: 100%; height: 56px; display: block; }
.shield { position: absolute; right: 10px; top: 10px; font: 700 11px var(--mono); color: var(--d); opacity: 0; transition: opacity .3s; }
.shield.on { opacity: 1; }
.loop { display: grid; gap: 6px; }
.bar { height: 10px; border-radius: 6px; background: var(--grid); position: relative; overflow: hidden; }
.bar > i { position: absolute; inset: 0 auto 0 0; border-radius: 6px; background: var(--a); transition: width .4s; }
.bar > em { position: absolute; top: -2px; bottom: -2px; width: 2px; background: var(--ink); opacity: .6; }
.kv { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 6px; }
.kv div { background: var(--grid); border-radius: 8px; padding: 6px 9px; display: grid; }
.kv span { font-size: 11px; color: var(--muted); } .kv b { font: 700 16px var(--mono); overflow-wrap: anywhere; }
.table { overflow-x: auto; }
table { border-collapse: collapse; width: 100%; font: 12.5px var(--mono); }
th, td { padding: 6px 8px; border-bottom: 1px solid var(--line); text-align: left; white-space: nowrap; }
th { color: var(--muted); font-weight: 600; font-family: var(--sans); }
.act { display: inline-block; height: 8px; border-radius: 4px; background: var(--b); vertical-align: middle; min-width: 2px; }
.badge { font-size: 11px; padding: 1px 6px; border-radius: 6px; background: var(--grid); color: var(--muted); }
.badge.auth { background: color-mix(in srgb, var(--ok) 20%, transparent); color: var(--ok); }
.events { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; max-height: 340px; overflow: auto; font: 12.5px var(--mono); }
.events li { display: flex; gap: 8px; align-items: baseline; padding: 4px 6px; border-radius: 6px; animation: slide .5s ease-out; }
@keyframes slide { from { background: color-mix(in srgb, var(--a) 22%, transparent); transform: translateX(-6px); } }
.events time { color: var(--muted); }
.k { font: 700 11px var(--sans); padding: 1px 7px; border-radius: 6px; }
.k.join { background: color-mix(in srgb, var(--ok) 22%, transparent); color: var(--ok); }
.k.leave { background: var(--grid); color: var(--muted); }
.k.denied { background: color-mix(in srgb, var(--d) 22%, transparent); color: var(--d); }
.k.error { background: color-mix(in srgb, var(--c) 25%, transparent); color: var(--c); }
.empty { color: var(--muted); font-size: 13px; padding: 6px 0; }
.overlay { position: fixed; inset: 0; z-index: 10; display: grid; place-items: center; background: color-mix(in srgb, var(--bg) 80%, transparent); backdrop-filter: blur(6px); padding: 16px; }
.overlay form { background: var(--panel); border: 1px solid var(--line); border-radius: 16px; padding: 20px; width: min(360px, 100%); display: grid; gap: 10px; box-shadow: 0 20px 50px rgba(0,0,0,.2); }
.overlay h2 { margin: 0; font-size: 18px; }
.overlay input { padding: 9px 11px; border-radius: 9px; border: 1px solid var(--line); background: var(--bg); color: var(--ink); font: 14px var(--mono); }
.overlay button { padding: 10px; border: 0; border-radius: 10px; background: var(--a); color: #fff; font-weight: 700; cursor: pointer; }
.overlay p { margin: 0; color: var(--muted); font-size: 13px; }
.overlay .err { color: var(--d); }
[hidden] { display: none !important; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
</style>
</head>
<body>
<header>
  <h1><b>IOSignal</b> Dashboard</h1>
  <span id="status" class="pill">연결 중</span>
  <span id="meta" class="meta"></span>
  <nav class="chips" id="chips" aria-label="패널"></nav>
</header>
<main id="main">
  <section class="panel w12" data-panel="server">
    <h2>서버 <small id="uptime"></small></h2>
    <div class="gauges">
      <div class="gauge"><canvas id="gCpu"></canvas><span>CPU</span></div>
      <div class="gauge"><canvas id="gEld"></canvas><span>이벤트 루프 지연 p99</span></div>
      <div class="gauge"><canvas id="gElu"></canvas><span>이벤트 루프 사용률</span></div>
      <div class="gauge"><canvas id="gMem"></canvas><span>메모리 (RSS)</span></div>
    </div>
    <canvas class="chart" id="cLoad"></canvas>
    <div class="legend"><span><i style="background:var(--a)"></i>CPU %</span><span><i style="background:var(--c)"></i>지연 p99 ms</span><span><i style="background:var(--e)"></i>연결 수</span></div>
    <div class="stats" id="sConn"></div>
  </section>
  <section class="panel w8" data-panel="traffic">
    <h2>트래픽 <small>초당</small></h2>
    <canvas class="chart tall" id="cMsg"></canvas>
    <div class="legend"><span><i style="background:var(--b)"></i>받은 메시지</span><span><i style="background:var(--a)"></i>보낸 메시지</span><span><i style="background:var(--d)"></i>버린 메시지(쿼터)</span></div>
    <canvas class="chart" id="cBytes"></canvas>
    <div class="legend"><span><i style="background:var(--b)"></i>받은 바이트</span><span><i style="background:var(--a)"></i>보낸 바이트</span></div>
  </section>
  <section class="panel w4" data-panel="traffic">
    <h2>전송 상태</h2>
    <div class="stats" id="sTraffic"></div>
  </section>
  <section class="panel w12" data-panel="hosts">
    <h2>호스트 <small id="hostCount"></small></h2>
    <div class="hosts" id="hosts"></div>
  </section>
  <section class="panel w6" data-panel="game">
    <h2>게임 루프</h2>
    <div id="game" class="loop"></div>
  </section>
  <section class="panel w6" data-panel="events">
    <h2>이벤트 <small>입장 · 퇴장 · 위조 차단 · 오류</small></h2>
    <ul class="events" id="events"></ul>
  </section>
  <section class="panel w12" data-panel="participants">
    <h2>참가자</h2>
    <div class="table" id="players"></div>
  </section>
</main>

<div class="overlay" id="gate" hidden>
  <form id="gateForm">
    <h2 id="gateTitle">대시보드 로그인</h2>
    <p id="gateHelp"></p>
    <input id="gateId" placeholder="ID" autocomplete="username">
    <input id="gateKey" type="password" placeholder="키" autocomplete="current-password">
    <p id="gateErr" class="err" hidden></p>
    <button type="submit">보기</button>
  </form>
</div>

<script>var CONFIG = __CONFIG__;</script>
<script src="__IO__"></script>
<script>
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var css = function (name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); };
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var fmtB = function (n) { n = n || 0; return n >= 1048576 ? (n / 1048576).toFixed(1) + " MB" : n >= 1024 ? (n / 1024).toFixed(1) + " KB" : Math.round(n) + " B"; };
  var fmtN = function (n) { n = n || 0; return n >= 10000 ? (n / 1000).toFixed(1) + "k" : n >= 100 ? Math.round(n) + "" : (Math.round(n * 10) / 10) + ""; };
  var fmtT = function (ms) { var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + "시간 " : "") + m + "분 " + (s % 60) + "초"; };

  // ------------------------------------------------ panels the viewer turns on and off
  var NAMES = { server: "서버", traffic: "트래픽", hosts: "호스트", game: "게임 루프", participants: "참가자", events: "이벤트" };
  var saved = store.get("iosignal.dashboard.panels");
  var shown = saved ? saved.split(",") : CONFIG.panels.slice();
  function applyPanels() {
    var nodes = document.querySelectorAll("[data-panel]");
    for (var i = 0; i < nodes.length; i++) nodes[i].hidden = shown.indexOf(nodes[i].getAttribute("data-panel")) < 0;
    var chips = $("chips").children;
    for (var j = 0; j < chips.length; j++) chips[j].setAttribute("aria-pressed", String(shown.indexOf(chips[j].getAttribute("data-p")) >= 0));
    store.set("iosignal.dashboard.panels", shown.join(","));
    draw();
  }
  Object.keys(NAMES).forEach(function (p) {
    var b = document.createElement("button");
    b.className = "chip"; b.type = "button"; b.textContent = NAMES[p]; b.setAttribute("data-p", p);
    b.onclick = function () { var i = shown.indexOf(p); if (i >= 0) shown.splice(i, 1); else shown.push(p); applyPanels(); };
    $("chips").appendChild(b);
  });

  // ------------------------------------------------ state
  var series = [], latest = null, hosts = [], events = [], info = null, startedAt = 0, hostHist = {};
  var pulses = {};

  // ------------------------------------------------ canvas helpers
  function fit(cv) {
    var r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1);
    var w = Math.max(10, Math.round(r.width * d)), h = Math.max(10, Math.round(r.height * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    var c = cv.getContext("2d"); c.setTransform(d, 0, 0, d, 0, 0);
    return { c: c, w: r.width, h: r.height };
  }
  // Lines over time with a soft area under the first one. lines: [{ values, color, scale? }]
  function chart(cv, lines, opts) {
    if (!cv.offsetParent) return;
    var f = fit(cv), c = f.c, w = f.w, h = f.h, pad = { l: 58, r: 12, t: 8, b: 18 };
    c.clearRect(0, 0, w, h);
    var max = (opts && opts.max) || 1;
    lines.forEach(function (l) { if (!l.own) l.values.forEach(function (v) { if (v > max) max = v; }); });
    max = niceMax(max);
    var n = Math.max(2, CONFIG.history), x0 = pad.l, x1 = w - pad.r, y0 = h - pad.b, y1 = pad.t;
    c.strokeStyle = css("--grid"); c.lineWidth = 1; c.fillStyle = css("--muted"); c.font = "11px " + css("--mono"); c.textAlign = "right";
    for (var g = 0; g <= 3; g++) {
      var y = y0 - (y0 - y1) * g / 3;
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      c.fillText((opts && opts.fmt ? opts.fmt(max * g / 3) : fmtN(max * g / 3)), x0 - 6, y + 4);
    }
    c.textAlign = "left"; c.fillText("-" + Math.round(n / 60) + "분", x0, h - 3); c.textAlign = "right"; c.fillText("지금", x1, h - 3);
    lines.forEach(function (l, li) {
      var v = l.values, m = l.own ? niceMax(Math.max.apply(null, v.concat([1]))) : max;
      if (!v.length) return;
      var X = function (i) { return x1 - (v.length - 1 - i) * (x1 - x0) / (n - 1); };
      var Y = function (val) { return y0 - (y0 - y1) * Math.min(1, (val || 0) / m); };
      c.beginPath();
      for (var i = 0; i < v.length; i++) { var px = X(i), py = Y(v[i]); if (i) c.lineTo(px, py); else c.moveTo(px, py); }
      c.strokeStyle = css(l.color); c.lineWidth = 2; c.lineJoin = "round"; c.stroke();
      if (li === 0) {
        c.lineTo(X(v.length - 1), y0); c.lineTo(X(0), y0); c.closePath();
        var grad = c.createLinearGradient(0, y1, 0, y0);
        grad.addColorStop(0, hexA(css(l.color), 0.28)); grad.addColorStop(1, hexA(css(l.color), 0));
        c.fillStyle = grad; c.fill();
      }
      var lx = X(v.length - 1), ly = Y(v[v.length - 1]);
      c.fillStyle = css(l.color); c.beginPath(); c.arc(lx, ly, 3.5, 0, 6.3); c.fill();
    });
  }
  function niceMax(v) { var p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1e-9)))); var m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }
  function hexA(col, a) {
    if (col.charAt(0) === "#") { var n = parseInt(col.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
    return col;
  }
  // Half-ring gauge with an animated needle value.
  var gaugeNow = {};
  function gauge(id, value, max, label, color) {
    var cv = $(id); if (!cv.offsetParent) return;
    var cur = gaugeNow[id] == null ? value : gaugeNow[id] + (value - gaugeNow[id]) * 0.18;
    gaugeNow[id] = cur;
    var f = fit(cv), c = f.c, w = f.w, h = f.h, r = Math.min(w / 2, h) * 0.86, cx = w / 2, cy = h * 0.9;
    c.clearRect(0, 0, w, h);
    c.lineCap = "round"; c.lineWidth = r * 0.17;
    c.strokeStyle = css("--grid"); c.beginPath(); c.arc(cx, cy, r, Math.PI, 2 * Math.PI); c.stroke();
    var frac = Math.max(0, Math.min(1, cur / max));
    var col = frac > 0.85 ? css("--d") : frac > 0.6 ? css("--c") : css(color);
    c.strokeStyle = col; c.beginPath(); c.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * Math.max(0.01, frac)); c.stroke();
    c.fillStyle = css("--ink"); c.textAlign = "center"; c.font = "700 " + Math.round(r * 0.36) + "px " + css("--mono");
    c.fillText(label(cur), cx, cy - r * 0.2);
  }
  function spark(cv, values, color) {
    if (!cv.offsetParent) return;
    var f = fit(cv), c = f.c, w = f.w, h = f.h; c.clearRect(0, 0, w, h);
    if (!values.length) return;
    var m = niceMax(Math.max.apply(null, values.concat([1]))), n = 60;
    c.beginPath();
    for (var i = 0; i < values.length; i++) {
      var x = w - (values.length - 1 - i) * w / (n - 1), y = h - 3 - (h - 6) * values[i] / m;
      if (i) c.lineTo(x, y); else c.moveTo(x, y);
    }
    c.strokeStyle = css(color); c.lineWidth = 1.8; c.stroke();
    c.lineTo(w, h); c.lineTo(w - (values.length - 1) * w / (n - 1), h); c.closePath();
    c.fillStyle = hexA(css(color), 0.18); c.fill();
  }

  // ------------------------------------------------ render
  function stat(label, value, flash) { return '<div class="stat' + (flash ? " flash" : "") + '"><b>' + value + "</b><span>" + label + "</span></div>"; }
  var prevDropped = 0, prevDenied = {};
  function render() {
    if (!latest) return;
    var p = latest.point, s = latest.server;
    $("uptime").textContent = "가동 " + fmtT(s.uptime);
    $("meta").textContent = "시청 " + s.own.viewers + "명" + (info ? " · Node " + info.node : "");
    $("sConn").innerHTML = stat("연결", p.conns) + stat("WebSocket", p.ws) + stat("TCP (보드)", p.tcp) + stat("로그인", p.auth) + stat("채널", s.channels);
    var dropped = s.counters.rateLimited + s.counters.oversizeRejected;
    $("sTraffic").innerHTML = stat("버린 메시지 (누적)", fmtN(dropped), dropped > prevDropped) +
      stat("느린 연결", s.txBlockedConnections) + stat("밀린 송신", fmtB(s.queuedBytes)) +
      stat("가장 많이 밀린 연결", fmtB(s.maxQueuedBytes)) + stat("수신 버퍼 초과로 안 보냄", fmtN(s.counters.peerRxLimitSkipped));
    prevDropped = dropped;
    renderHosts();
    renderGame();
    renderPlayers();
  }
  function renderHosts() {
    $("hostCount").textContent = hosts.length ? hosts.length + "개" : "";
    if (!hosts.length) { $("hosts").innerHTML = '<p class="empty">등록된 호스트가 없습니다. server.host()로 게임을 올리면 여기에 나옵니다.</p>'; return; }
    var box = $("hosts");
    hosts.forEach(function (h) {
      var el = box.querySelector('[data-host="' + CSS.escape(h.name) + '"]');
      if (!el) {
        el = document.createElement("div"); el.className = "host"; el.setAttribute("data-host", h.name);
        el.innerHTML = '<header><span class="pulse"></span><h3></h3></header><span class="shield">위조 차단!</span>' +
          '<div><span class="big"></span> <span class="meta">참가자</span></div><canvas></canvas><div class="row"></div>';
        el.querySelector("h3").textContent = h.name;
        box.appendChild(el);
      }
      el.querySelector(".big").textContent = h.participants;
      var r = h.rates;
      el.querySelector(".row").innerHTML = "<span>입력 <b>" + fmtN(r.inbound) + "/s</b></span><span>방송 <b>" + fmtN(r.published) + "/s</b></span>" +
        "<span>1:1 <b>" + fmtN(r.sent) + "/s</b></span><span>처리 <b>" + h.handlerAvgMs.toFixed(2) + "ms</b> (최대 " + h.handlerMaxMs.toFixed(1) + ")</span>" +
        "<span>차단 <b>" + h.totals.denied + "</b></span><span>오류 <b>" + h.totals.errors + "</b></span>";
      var shield = el.querySelector(".shield");
      if ((prevDenied[h.name] || 0) < h.totals.denied) { shield.classList.add("on"); setTimeout(function () { shield.classList.remove("on"); }, 1500); }
      prevDenied[h.name] = h.totals.denied;
      pulses[h.name] = r.inbound;
      spark(el.querySelector("canvas"), (hostHist[h.name] || []).map(function (x) { return x.in || 0; }), "--a");
    });
    Array.prototype.slice.call(box.children).forEach(function (el) {
      if (!hosts.some(function (h) { return h.name === el.getAttribute("data-host"); })) el.remove();
    });
  }
  function renderGame() {
    if (!hosts.length) { $("game").innerHTML = '<p class="empty">호스트가 없습니다.</p>'; return; }
    var html = "";
    hosts.forEach(function (h) {
      html += '<div><b style="font-family:var(--mono)">' + esc(h.name) + "</b></div>";
      if (!h.loops.length) html += '<p class="empty">host.loop(ms, fn)를 쓰면 틱 간격과 처리 시간이 여기에 나옵니다.</p>';
      h.loops.forEach(function (l) {
        var scale = l.intervalMs * 2, gap = Math.min(1, l.gapP99 / scale), target = l.intervalMs / scale;
        html += '<div class="row" style="display:flex;gap:12px;font:12px var(--mono);color:var(--muted)"><span>목표 <b style="color:var(--ink)">' + l.intervalMs + 'ms</b></span><span>틱 간격 p50 <b style="color:var(--ink)">' + l.gapP50.toFixed(1) + '</b> · p99 <b style="color:var(--ink)">' + l.gapP99.toFixed(1) + '</b></span><span>처리 평균 <b style="color:var(--ink)">' + l.stepAvg.toFixed(2) + 'ms</b> · 최대 ' + l.stepMax.toFixed(1) + '</span><span>' + l.ticks + '틱</span></div>' +
          '<div class="bar" title="틱 간격 p99 (선: 목표)"><i style="width:' + (gap * 100).toFixed(1) + '%;background:' + (l.gapP99 > l.intervalMs * 1.5 ? "var(--d)" : l.gapP99 > l.intervalMs * 1.15 ? "var(--c)" : "var(--a)") + '"></i><em style="left:' + (target * 100).toFixed(1) + '%"></em></div>' +
          '<div class="bar" title="처리 시간 / 목표"><i style="width:' + Math.min(100, l.stepAvg / l.intervalMs * 100).toFixed(1) + '%;background:var(--b)"></i></div>';
      });
      var keys = Object.keys(h.report || {});
      if (keys.length) {
        html += '<div class="kv">' + keys.map(function (k) { return "<div><span>" + esc(k) + "</span><b>" + esc(h.report[k]) + "</b></div>"; }).join("") + "</div>";
      } else html += '<p class="empty">host.report({ ... })로 보낸 값이 여기에 나옵니다.</p>';
    });
    $("game").innerHTML = html;
  }
  function renderPlayers() {
    var rows = [];
    hosts.forEach(function (h) { (h.players || []).forEach(function (p) { rows.push([h.name, p]); }); });
    if (!rows.length) { $("players").innerHTML = '<p class="empty">아직 입력을 보낸 참가자가 없습니다.</p>'; return; }
    var max = Math.max.apply(null, rows.map(function (r) { return r[1].inputs; }).concat([1]));
    $("players").innerHTML = "<table><thead><tr><th>호스트</th><th>CID</th><th>이름</th><th>로그인</th><th>입력</th><th>참가</th><th>마지막 입력</th></tr></thead><tbody>" +
      rows.map(function (r) {
        var p = r[1];
        return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(p.cid) + "</td><td>" + esc(p.nick || "-") + "</td><td>" +
          (p.authorized ? '<span class="badge auth">로그인</span>' : '<span class="badge">익명</span>') + '</td><td><span class="act" style="width:' + Math.round(80 * p.inputs / max) + 'px"></span> ' + p.inputs +
          "</td><td>" + fmtT(p.since) + "</td><td>" + (p.idle < 1000 ? "방금" : Math.round(p.idle / 1000) + "초 전") + "</td></tr>";
      }).join("") + "</tbody></table>";
  }
  var KIND = { join: "입장", leave: "퇴장", denied: "위조 차단", error: "오류" };
  function addEvents(list, initial) {
    if (!list || !list.length) return;
    var ul = $("events");
    list.forEach(function (e) {
      events.push(e);
      var li = document.createElement("li");
      var t = new Date(e.at);
      var detail = e.kind === "denied" ? (e.cid || "") + " → " + (e.tag || "") : e.kind === "error" ? (e.message || "") : (e.cid || "") + (e.reason ? " (" + e.reason + ")" : "");
      li.innerHTML = "<time>" + t.toLocaleTimeString() + '</time><span class="k ' + e.kind + '">' + (KIND[e.kind] || e.kind) + "</span><span>" + esc(e.host) + "</span><span>" + esc(detail) + "</span>";
      if (initial) li.style.animation = "none";
      ul.insertBefore(li, ul.firstChild);
    });
    while (ul.children.length > 120) ul.removeChild(ul.lastChild);
    if (!ul.children.length) ul.innerHTML = '<li class="empty">아직 이벤트가 없습니다.</li>';
  }

  function draw() {
    var pick = function (k) { return series.map(function (p) { return p[k] || 0; }); };
    chart($("cLoad"), [{ values: pick("cpu"), color: "--a" }, { values: pick("eld"), color: "--c" }, { values: pick("conns"), color: "--e", own: true }], { max: 10 });
    chart($("cMsg"), [{ values: pick("rxMsg"), color: "--b" }, { values: pick("txMsg"), color: "--a" }, { values: pick("dropped"), color: "--d" }], { max: 10 });
    chart($("cBytes"), [{ values: pick("rxB"), color: "--b" }, { values: pick("txB"), color: "--a" }], { max: 1024, fmt: fmtB });
  }
  // Gauges and host pulses move every frame; charts redraw on each sample.
  function frame(t) {
    if (latest) {
      var p = latest.point, total = latest.server.hostTotalBytes || 1;
      gauge("gCpu", p.cpu, 100, function (v) { return Math.round(v) + "%"; }, "--a");
      gauge("gEld", p.eld, 100, function (v) { return v.toFixed(1) + "ms"; }, "--c");
      gauge("gElu", p.elu * 100, 100, function (v) { return Math.round(v) + "%"; }, "--b");
      gauge("gMem", p.rss / 1048576, Math.max(256, Math.min(total / 1048576, 2048)), function (v) { return Math.round(v) + "MB"; }, "--e");
    }
    var dots = document.querySelectorAll(".host");
    for (var i = 0; i < dots.length; i++) {
      var rate = pulses[dots[i].getAttribute("data-host")] || 0;
      var speed = Math.min(8, 0.6 + rate / 8);
      var k = (Math.sin(t / 1000 * speed * Math.PI) + 1) / 2;
      var dot = dots[i].querySelector(".pulse");
      dot.style.boxShadow = rate > 0 ? "0 0 0 " + (k * 7).toFixed(1) + "px " + hexA(css("--a"), 0.35 * (1 - k)) : "none";
      dot.style.background = rate > 0 ? css("--a") : css("--muted");
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  addEventListener("resize", draw);

  // ------------------------------------------------ IOSignal connection
  var io = null, helloTimer = 0, cred = {};
  function status(text, cls) { var el = $("status"); el.textContent = text; el.className = "pill" + (cls ? " " + cls : ""); }
  function connect() {
    if (io) { try { io.destroy(); } catch (e) {} }
    io = new IO();
    if (CONFIG.access === "login" && cred.id) io.auth(cred.id, cred.key);
    io.on("change", function () {
      if (io.stateName !== "ready") status(io.stateName === "closed" ? "연결 끊김" : "연결 중", io.stateName === "closed" ? "bad" : "");
    });
    io.on("ready", function () { hello(); });
    io.on(CONFIG.topic, function (tag, msg) { onMessage(msg); });
    io.open((location.protocol === "https:" ? "wss://" : "ws://") + location.host + CONFIG.ws);
    clearInterval(helloTimer);
    helloTimer = setInterval(hello, 5000);
  }
  function hello() { if (io && io.stateName === "ready") io.signal(CONFIG.tag, { op: "hello", token: cred.token }); }
  function onMessage(m) {
    if (!m || !m.type) return;
    if (m.type === "denied") { status("권한 없음", "bad"); askAccess(true); return; }
    if (m.type === "full") { status("시청자가 가득 찼습니다", "bad"); return; }
    if (m.type === "init") {
      $("gate").hidden = true;
      status("실시간", "live");
      info = m.server; startedAt = m.startedAt; series = m.series.slice();
      hostHist = {};
      series.forEach(function (p) { Object.keys(p.hosts || {}).forEach(function (n) { (hostHist[n] = hostHist[n] || []).push(p.hosts[n]); }); });
      $("events").innerHTML = "";
      addEvents(m.events, true);
      if (!saved) { shown = m.panels.slice(); applyPanels(); }
      return;
    }
    if (m.type === "tick") {
      latest = m; hosts = m.hosts;
      series.push(m.point); if (series.length > CONFIG.history) series.shift();
      Object.keys(m.point.hosts || {}).forEach(function (n) { var a = (hostHist[n] = hostHist[n] || []); a.push(m.point.hosts[n]); if (a.length > 60) a.shift(); });
      addEvents(m.events, false);
      render(); draw();
    }
  }
  function askAccess(failed) {
    var gate = $("gate");
    $("gateErr").hidden = !failed; $("gateErr").textContent = failed ? "확인하지 못했습니다. 다시 입력해 주세요." : "";
    if (CONFIG.access === "token") {
      $("gateTitle").textContent = "대시보드 토큰"; $("gateHelp").textContent = "서버 설정의 dashboard.access.token 값을 입력하세요.";
      $("gateId").hidden = true; $("gateKey").placeholder = "토큰";
    } else {
      $("gateTitle").textContent = "대시보드 로그인"; $("gateHelp").textContent = "이 서버에 로그인할 수 있는 ID와 키를 입력하세요(허용된 역할 또는 CID).";
    }
    gate.hidden = false;
    (CONFIG.access === "token" ? $("gateKey") : $("gateId")).focus();
  }
  $("gateForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (CONFIG.access === "token") { cred = { token: $("gateKey").value }; store.sset("iosignal.dashboard.token", cred.token); hello(); }
    else { cred = { id: $("gateId").value.trim(), key: $("gateKey").value }; connect(); }
  });
  addEventListener("pagehide", function () { if (io && io.stateName === "ready") io.signal(CONFIG.tag, { op: "bye" }); });

  applyPanels();
  addEvents([], true);
  if (CONFIG.access === "token") { var t = store.sget("iosignal.dashboard.token") || new URLSearchParams(location.search).get("key"); if (t) cred = { token: t }; }
  connect();
  if (CONFIG.access === "login" || (CONFIG.access === "token" && !cred.token)) askAccess(false);
})();
</script>
</body>
</html>`

/** The page with its settings: { io, ws, access, panels, history, tag, topic }. */
export function dashboardPage(config) {
  const json = JSON.stringify(config).replace(/</g, '\\u003c')
  return PAGE.replace('__CONFIG__', json).replace('__IO__', config.io.replace(/"/g, ''))
}
