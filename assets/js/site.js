(function(){
  const data = window.REFORMATION || {};
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if(menuButton && nav){
    const close = ()=>{nav.classList.remove('open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open menu');menuButton.textContent='☰';document.body.classList.remove('menu-open')};
    menuButton.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(isOpen));menuButton.setAttribute('aria-label',isOpen?'Close menu':'Open menu');menuButton.textContent=isOpen?'×':'☰';document.body.classList.toggle('menu-open',isOpen)});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  }
  document.querySelectorAll('[data-social]').forEach(el=>{
    const name=el.getAttribute('data-social');const href=data.social && data.social[name];
    if(href){el.setAttribute('href',href);el.setAttribute('target','_blank');el.setAttribute('rel','noopener noreferrer')}
    else{el.hidden=true}
  });
  document.querySelectorAll('[data-giving]').forEach(el=>{
    const href=data.giving && data.giving.paypal;
    if(href){el.href=href;el.target='_blank';el.rel='noopener noreferrer';el.classList.remove('disabled');el.removeAttribute('aria-disabled');el.textContent='Give securely with PayPal ↗'}
  });
  const hero=document.getElementById('hero-carousel');
  if(!hero || !data.carousel || !data.carousel.length)return;
  const slideWrap=hero.querySelector('.hero-slides'), dotsWrap=hero.querySelector('.slide-dots');
  const slides=data.carousel;
  slides.forEach((s,i)=>{
    const slide=document.createElement('section');slide.className='hero-slide'+(i===0?' active':'');slide.setAttribute('aria-label',`Slide ${i+1} of ${slides.length}`);slide.setAttribute('aria-hidden',i===0?'false':'true');
    slide.innerHTML=`<div class="hero-content"><span class="eyebrow">${s.eyebrow}</span><h1 class="hero-title">${s.title}</h1><p class="hero-desc">${s.description}</p><div class="hero-actions"><a class="btn primary" href="${s.primaryHref}">${s.primaryText} <span class="btn-arrow" aria-hidden="true">↗</span></a><a class="btn secondary" href="${s.secondaryHref}">${s.secondaryText} <span class="btn-arrow" aria-hidden="true">↗</span></a></div></div><div class="hero-image ${s.imageClass}"><img src="${s.image}" alt="${s.imageAlt}" ${i===0?'fetchpriority="high"':'loading="lazy"'}></div>`;
    slideWrap.appendChild(slide);
    const dot=document.createElement('button');dot.type='button';dot.className='slide-dot';dot.setAttribute('aria-label',`Show slide ${i+1}`);dot.setAttribute('aria-current',String(i===0));dot.addEventListener('click',()=>show(i));dotsWrap.appendChild(dot);
  });
  const panels=[...slideWrap.children], dots=[...dotsWrap.children];let active=0,timer;
  const count=hero.querySelector('.slide-counter');
  function show(next){active=(next+slides.length)%slides.length;panels.forEach((s,i)=>{const shown=i===active;s.classList.toggle('active',shown);s.setAttribute('aria-hidden',String(!shown));s.querySelectorAll('a').forEach(a=>a.tabIndex=shown?0:-1)});dots.forEach((d,i)=>d.setAttribute('aria-current',String(i===active)));count.innerHTML=`<span>0${active+1}</span> / 0${slides.length}`;reset()}
  function reset(){clearInterval(timer);if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(()=>show(active+1),6500)}
  hero.querySelector('.prev-slide').addEventListener('click',()=>show(active-1));hero.querySelector('.next-slide').addEventListener('click',()=>show(active+1));
  hero.addEventListener('mouseenter',()=>clearInterval(timer));hero.addEventListener('mouseleave',reset);hero.addEventListener('focusin',()=>clearInterval(timer));hero.addEventListener('focusout',e=>{if(!hero.contains(e.relatedTarget))reset()});
  let touchStart=0;hero.addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].screenX},{passive:true});hero.addEventListener('touchend',e=>{const dx=e.changedTouches[0].screenX-touchStart;if(Math.abs(dx)>60)show(active+(dx<0?1:-1))},{passive:true});
  show(0);
})();
