// PROPUESTA 01 — Una sola fuente de datos para Exhibición y cartelera.
// Años y formatos PROVISIONALES de ejemplo: reemplázalos por los datos reales antes de publicar.
const films = [
  {title:'Laberinto',year:'2024',type:'Documental',image:'img/laberinto.png'},
  {title:'Animalia',year:'2023',type:'Cortometraje',image:'img/animalia.jpg'},
  {title:'Mui',year:'2022',type:'Documental',image:'img/mui.jpg'},
  {title:'Nido Sol',year:'2024',type:'Experimental',image:'img/nidosol.png'},
  {title:'Nacimiento',year:'2025',type:'Cortometraje',image:'img/nacimiento.JPG'},
  {title:'O Peixe',year:'2023',type:'Ficción',image:'img/opeixe.png'},
  {title:'Paloquemao',year:'2024',type:'Documental',image:'img/paloquemao.png'},
  {title:'Neumática',year:'2025',type:'Experimental',image:'img/neumatica.jpg'}
];

const track=document.querySelector('#cartelera-track');
const viewport=document.querySelector('#cartelera-viewport');
const toggle=document.querySelector('#toggle-carousel');
const hero=document.querySelector('#index');
const exhibitionGrid=document.querySelector('#exhibition-grid');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const mobile=()=>window.matchMedia('(max-width: 640px)').matches;

function filmCard(film,duplicate=false){
  const a=document.createElement('a');
  a.className='film-card';a.href='#exhibicion';
  const img=document.createElement('img');img.src=film.image;img.alt=`Cartel o fotograma de ${film.title}`;img.loading='lazy';
  const title=document.createElement('h3');title.textContent=film.title;
  const meta=document.createElement('p');meta.textContent=[film.year,film.type].filter(Boolean).join(' · ').toUpperCase()+' ↗';
  a.append(img,title,meta);
  if(duplicate){a.setAttribute('aria-hidden','true');a.tabIndex=-1;}
  return a;
}
function exhibitTile(film,index){
  const a=document.createElement('a');a.className=`exhibit-tile tile-${index+1}`;
  a.href='#produccion';a.setAttribute('aria-label',`Ver más sobre ${film.title}`);
  const img=document.createElement('img');img.src=film.image;img.alt=`Fotograma o cartel de ${film.title}`;img.loading='lazy';
  const label=document.createElement('span');label.textContent=film.title.toUpperCase()+' ↗';
  a.append(img,label);return a;
}
films.forEach((film,i)=>{track?.append(filmCard(film));exhibitionGrid?.append(exhibitTile(film,i));});
films.forEach(film=>track?.append(filmCard(film,true)));
const counter=document.querySelector('#film-count');
if(counter)counter.textContent=`(${String(films.length).padStart(2,'0')})`;

let offset=0,paused=false,visible=true,lastTime=0,frame;
const firstSetSize=()=>{
  const clone=track?.children[films.length];
  return clone?(mobile()?clone.offsetLeft:clone.offsetTop):0;
};
function animate(t){
  const dt=Math.min(t-lastTime||16,40);lastTime=t;
  if(track&&!paused&&visible&&!reducedMotion.matches){
    const distance=firstSetSize();
    if(distance>0){offset=(offset+(mobile()?.022:.015)*dt)%distance;
      track.style.transform=mobile()?`translate3d(${-offset}px,0,0)`:`translate3d(0,${-offset}px,0)`;
    }
  }
  frame=requestAnimationFrame(animate);
}
if(track){frame=requestAnimationFrame(animate);}
function setPause(value){paused=value;if(toggle){toggle.textContent=paused?'▶ REANUDAR':'Ⅱ PAUSAR';toggle.setAttribute('aria-pressed',String(paused));}}
toggle?.addEventListener('click',()=>setPause(!paused));
viewport?.addEventListener('mouseenter',()=>{visible=false;});
viewport?.addEventListener('mouseleave',()=>{visible=hero?.getBoundingClientRect().bottom>0;});
viewport?.addEventListener('focusin',()=>{visible=false;});
viewport?.addEventListener('focusout',()=>{visible=hero?.getBoundingClientRect().bottom>0;});
if(hero&&'IntersectionObserver' in window){new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{threshold:.01}).observe(hero);}
window.addEventListener('resize',()=>{offset=0;if(track)track.style.transform='translate3d(0,0,0)';});

// Biografías: nombre, cargo y texto se leen del HTML (data-name, data-role, data-bio).
const dialog=document.querySelector('#bio-dialog');
const closeButton=document.querySelector('.dialog-close');
document.querySelectorAll('.person').forEach(button=>button.addEventListener('click',()=>{
  document.querySelector('#bio-name').textContent=button.dataset.name||'';
  document.querySelector('#bio-role').textContent=button.dataset.role||'';
  document.querySelector('#bio-text').textContent=button.dataset.bio||'';
  if(dialog&&!dialog.open)dialog.showModal();
}));
closeButton?.addEventListener('click',()=>dialog?.close());
dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
