/* Gemeinsame Navigations-Logik (Startseite, FAQ, rechtliche Seiten).
   Entspricht der Nav-Logik der Leistungsseiten (in kontakt.js). */
(function(){
  var nav=document.querySelector('.nav');
  // Nav mit data-nav-solid bleibt immer "scrolled" (Seiten ohne Hero)
  if(nav && !nav.hasAttribute('data-nav-solid')){
    var sc=function(){ nav.classList.toggle('scrolled', window.scrollY>20); };
    window.addEventListener('scroll',sc,{passive:true}); sc();
  }
  var body=document.body;
  var burger=document.querySelector('.nav-burger');
  var mnav=document.getElementById('mobileMenu');
  function closeMobile(){
    if(!body.classList.contains('nav-open'))return;
    body.classList.remove('nav-open'); body.style.overflow='';
    if(burger)burger.setAttribute('aria-expanded','false');
  }
  function openMobile(){
    body.classList.add('nav-open'); body.style.overflow='hidden';
    if(burger)burger.setAttribute('aria-expanded','true');
  }
  if(burger){
    burger.addEventListener('click',function(){
      if(body.classList.contains('nav-open'))closeMobile();else openMobile();
    });
  }
  var mToggle=document.querySelector('.mnav-toggle');
  if(mToggle){
    mToggle.addEventListener('click',function(){
      var sec=mToggle.closest('.mnav-sec');if(!sec)return;
      var open=sec.classList.toggle('open');
      mToggle.setAttribute('aria-expanded',open?'true':'false');
    });
  }
  if(mnav){
    mnav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',closeMobile); });
  }
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
        drop.classList.remove('open'); trig.setAttribute('aria-expanded','false');
      }
    });
  }
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){
      closeMobile();
      if(drop&&drop.classList.contains('open')){
        drop.classList.remove('open'); if(trig)trig.setAttribute('aria-expanded','false');
      }
    }
  });
})();
