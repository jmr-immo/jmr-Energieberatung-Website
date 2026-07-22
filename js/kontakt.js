/* Leistungsseiten: Nav-Scroll-Zustand, Fade-Reveal (wie Startseite) und Kontaktformular. */
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
