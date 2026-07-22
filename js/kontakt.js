/* Leistungsseiten: Nav-Scroll, Fade-Reveal, Vorhaben-Dropdown und Kontaktformular (wie Startseite). */
var GOAL_DETAILS={
  'Bestand sanieren':['Dach / oberste Geschossdecke','Fassade','Fenster & Türen','Keller / Kellerdecke','Heizung','Komplettsanierung'],
  'Kaufen & investieren':['Gewerbe zu Wohnen','Jung kauft Alt','Kaufen & sanieren'],
  'Neu bauen':['Einfamilienhaus','Mehrfamilienhaus','Bauträger / Projekt']
};
function populateDetail(disp){
  var det=document.getElementById('vorhaben-detail');if(!det)return;
  if(disp==='Noch unklar'){det.innerHTML='<option selected>Noch unklar</option>';det.disabled=true;return;}
  var opts=GOAL_DETAILS[disp];
  if(!opts){det.innerHTML='<option value="" disabled selected>Bitte auswählen …</option>';det.disabled=true;return;}
  det.disabled=false;
  det.innerHTML='<option value="" disabled selected>Bitte auswählen …</option>'+opts.map(function(o){return '<option value="'+o+'">'+o+'</option>';}).join('');
}

(function(){
  var nav=document.querySelector('.nav');
  function sc(){ if(nav) nav.classList.toggle('scrolled', window.scrollY>20); }
  window.addEventListener('scroll',sc,{passive:true}); sc();
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis');});},{threshold:.12});
  document.querySelectorAll('.fade').forEach(function(el){io.observe(el);});
})();

(function(){
  var form=document.getElementById('kontaktForm');
  if(!form)return;
  var status=document.getElementById('kfStatus'),btn=document.getElementById('kfSubmit');
  form.addEventListener('submit',async function(e){
    e.preventDefault();
    btn.disabled=true;btn.style.opacity='.6';
    try{
      var res=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
      if(res.ok){
        if(window.jmrTrackConversion){window.jmrTrackConversion();}
        if(window.jmrTrackEvent){window.jmrTrackEvent('generate_lead',{stelle:'leistungsseite'});}
        form.reset();
        status.hidden=false;status.className='kf-status ok';
        status.textContent='Vielen Dank! Ihre Anfrage ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden.';
        form.querySelectorAll('.fld-row,.fld,button').forEach(function(el){el.style.display='none';});
      }else{
        status.hidden=false;status.className='kf-status err';
        status.textContent='Das hat leider nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@jmr-energieberatung.de.';
      }
    }catch(err){
      status.hidden=false;status.className='kf-status err';
      status.textContent='Keine Verbindung. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt an info@jmr-energieberatung.de.';
    }
    btn.disabled=false;btn.style.opacity='';
  });
})();

/* Stolperstein-Karten: Spotlight folgt der Maus */
(function(){
  document.querySelectorAll('.prob').forEach(function(c){
    c.addEventListener('mousemove',function(e){
      var r=c.getBoundingClientRect();
      c.style.setProperty('--mx',(e.clientX-r.left)+'px');
      c.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });
})();

/* Ablauf: Etappe in Bildschirmmitte fokussieren, Zeitleiste mitlaufen lassen */
(function(){
  var fl=document.getElementById('flow');if(!fl)return;
  var steps=[].slice.call(fl.querySelectorAll('.fstep'));
  var rail=fl.querySelector('.flow-rail');
  if(!steps.length)return;
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(RM){steps.forEach(function(s){s.classList.add('active');});if(rail)rail.style.setProperty('--fp','100%');return;}
  var active=-1,raf=0;
  function upd(){
    raf=0;var mid=innerHeight*0.5,best=0,bd=1e9;
    steps.forEach(function(s,i){var r=s.getBoundingClientRect();var c=r.top+r.height/2;var d=Math.abs(c-mid);if(d<bd){bd=d;best=i;}});
    if(best!==active){active=best;steps.forEach(function(s,i){s.classList.toggle('active',i===active);});}
    if(rail){
      var first=steps[0].getBoundingClientRect();var lastr=steps[steps.length-1].getBoundingClientRect();
      var cFirst=first.top+first.height/2,cLast=lastr.top+lastr.height/2;
      var pct=cLast>cFirst?((mid-cFirst)/(cLast-cFirst))*100:100;
      pct=Math.max(0,Math.min(100,pct));
      rail.style.setProperty('--fp',pct+'%');
    }
  }
  addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(upd);},{passive:true});
  addEventListener('resize',function(){if(!raf)raf=requestAnimationFrame(upd);},{passive:true});
  upd();
})();

/* NAV: Mega-Dropdown (Desktop, primär per CSS-Hover) + Burger/Overlay (Mobil) */
(function(){
  var body=document.body;
  var burger=document.querySelector('.nav-burger');
  var mnav=document.getElementById('mobileMenu');
  function closeMobile(){
    if(!body.classList.contains('nav-open'))return;
    body.classList.remove('nav-open');
    body.style.overflow='';
    if(burger)burger.setAttribute('aria-expanded','false');
  }
  function openMobile(){
    body.classList.add('nav-open');
    body.style.overflow='hidden';
    if(burger)burger.setAttribute('aria-expanded','true');
  }
  if(burger){
    burger.addEventListener('click',function(){
      if(body.classList.contains('nav-open'))closeMobile();else openMobile();
    });
  }
  /* Mobil: Leistungen-Abschnitt auf-/zuklappen */
  var mToggle=document.querySelector('.mnav-toggle');
  if(mToggle){
    mToggle.addEventListener('click',function(){
      var sec=mToggle.closest('.mnav-sec');if(!sec)return;
      var open=sec.classList.toggle('open');
      mToggle.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  /* Schließen bei Klick auf einen Menü-Link */
  if(mnav){
    mnav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',closeMobile);
    });
  }
  /* Desktop-Dropdown: Klick/Fokus-Support ergänzend zum CSS-Hover */
  var drop=document.querySelector('.nav-drop');
  var trig=drop?drop.querySelector('.nav-drop-trig'):null;
  if(drop&&trig){
    trig.addEventListener('click',function(e){
      e.stopPropagation();
      var open=drop.classList.toggle('open');
      trig.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('click',function(e){
      if(drop.classList.contains('open')&&!drop.contains(e.target)){
        drop.classList.remove('open');
        trig.setAttribute('aria-expanded','false');
      }
    });
  }
  /* Escape schließt Overlay und Dropdown */
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      closeMobile();
      if(drop&&drop.classList.contains('open')){
        drop.classList.remove('open');
        if(trig)trig.setAttribute('aria-expanded','false');
      }
    }
  });
})();

/* Zusatzbausteine: Zahlen, Balken, Ringe beim Sichtbarwerden animieren */
(function(){
  var blocks=[].slice.call(document.querySelectorAll('[data-anim]'));
  if(!blocks.length)return;
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function countUp(el,dur){
    var target=+el.dataset.count, suf=el.dataset.suffix||'', t0=null;
    if(RM){el.innerHTML=target.toLocaleString('de-DE')+suf;return;}
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var e=1-Math.pow(1-p,3);
      el.innerHTML=Math.round(target*e).toLocaleString('de-DE')+suf;if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  function ringUp(el,dur){
    var pt=+el.dataset.p||0,t0=null;
    if(RM){el.style.setProperty('--pcur',pt);return;}
    function step(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/dur,1);var e=1-Math.pow(1-p,3);
      el.style.setProperty('--pcur',(pt*e).toFixed(1));if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting){var b=e.target;b.classList.add('run');
      b.querySelectorAll('[data-count]').forEach(function(el){countUp(el,1300);});
      b.querySelectorAll('[data-p]').forEach(function(el){ringUp(el,1400);});
      io.unobserve(b);
    }});},{threshold:.28});
  blocks.forEach(function(b){io.observe(b);});
})();
