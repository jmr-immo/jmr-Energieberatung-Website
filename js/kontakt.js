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
