var AC=null,MUTE=false;
function ctx(){if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(C)AC=new C()}if(AC&&AC.state==='suspended')AC.resume();return AC}
function note(f,t,d,ty,v){if(MUTE)return;var a=ctx();if(!a)return;var o=a.createOscillator(),g=a.createGain(),s=a.currentTime+(t||0);d=d||.4;o.type=ty||'sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,s);g.gain.exponentialRampToValueAtTime(v||.12,s+.02);g.gain.exponentialRampToValueAtTime(.0001,s+d);o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+d+.05)}
function seq(a,gap,ty,d,v){a.forEach(function(f,i){note(f,i*gap,d,ty,v)})}
var PENT=[523.25,587.33,659.25,783.99,880,1046.5];
function confetti(c,n){var g=window.gsap;for(var i=0;i<n;i++){var p=document.createElement('i');p.style.cssText='position:fixed;top:-20px;left:'+Math.random()*100+'vw;width:8px;height:12px;background:'+c[i%c.length]+';pointer-events:none;z-index:90';document.body.appendChild(p);g.to(p,{y:innerHeight+60,x:Math.random()*80-40,rotation:'random(-540,540)',duration:'random(2,3.8)',delay:Math.random()*.8,ease:'power1.in',onComplete:function(){this.targets()[0].remove()}})}}
['pointerdown','touchstart','keydown','click'].forEach(function(e){addEventListener(e,function(){ctx()},{passive:true})});

/* ===== motion.js: pustaka efek & suara (otomatis, dibuat langsung oleh browser) ===== */
function music(n,ms,ty,v){var i=0;return setInterval(function(){if(!MUTE&&AC&&!document.hidden)note(n[i%n.length],0,ms/700,ty||'sine',v||.04);i++},ms)}
function trail(ch,col){var last=0;addEventListener('pointermove',function(e){var t=Date.now();if(t-last<80)return;last=t;var s=document.createElement('i');s.textContent=ch;s.style.cssText='position:fixed;left:'+e.clientX+'px;top:'+e.clientY+'px;color:'+col+';font-style:normal;font-size:'+(10+Math.random()*12)+'px;pointer-events:none;z-index:80';document.body.appendChild(s);window.gsap.to(s,{y:-30,opacity:0,duration:.9,onComplete:function(){s.remove()}})})}
function stars(col,n){var c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none';document.body.prepend(c);var x=c.getContext('2d'),W,H,P=[];function rs(){W=c.width=innerWidth;H=c.height=innerHeight}rs();addEventListener('resize',rs);
for(var i=0;i<n;i++)P.push({x:Math.random(),y:Math.random(),r:Math.random()*1.8+.5,s:Math.random()*.0006+.0002,p:Math.random()*6});
(function f(t){x.clearRect(0,0,W,H);P.forEach(function(p){p.y-=p.s;if(p.y<0)p.y=1;x.globalAlpha=.35+.4*Math.sin(t/700+p.p);x.fillStyle=col;x.beginPath();x.arc(p.x*W,p.y*H,p.r,0,6.3);x.fill()});requestAnimationFrame(f)})(0)}
function type(el,sp,cb){el.style.whiteSpace='pre-line';var t=el.innerText||el.textContent,i=0;el.textContent='';el.style.opacity=1;(function s(){el.textContent=t.slice(0,++i);if(i%3===0)note(1200+Math.random()*400,0,.04,'triangle',.02);if(i<t.length)setTimeout(s,sp);else if(cb)cb()})()}
function spring(from,to,k,c,cb){var g=window.gsap,x=from,v=0;function st(){var dt=Math.min(g.ticker.deltaRatio()/60,.033);v+=(-k*(x-to)-c*v)*dt;x+=v*dt;if(Math.abs(x-to)<.002&&Math.abs(v)<.01){cb(to);g.ticker.remove(st)}else cb(x)}g.ticker.add(st)}
function melody(a,b){var t=0;a.forEach(function(p){note(p[0],t*b,p[1]*b*.9,'triangle',.07);t+=p[1]})}
