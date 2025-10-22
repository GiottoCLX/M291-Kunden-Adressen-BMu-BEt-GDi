export const $ = s => document.querySelector(s);
export const $$ = s => [...document.querySelectorAll(s)];
export const el = (t,props={},...kids)=>{const n=document.createElement(t);Object.assign(n,props);kids.flat().forEach(k=>n.append(k));return n};

export function nav(active){ $$('.nav a').forEach(a=>a.classList.toggle('active', a.dataset.active===active)); }
export const debounce = (fn,ms=250)=>{ let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; };

export function csvDownload(filename, rows, headers){
  const lines = [headers.join(',')].concat(rows.map(r=>headers.map(h=>String(r[h] ?? '')).map(v=>/[,"]/.test(v)?`"${v.replace(/"/g,'""')}"`:v).join(',')));
  const blob = new Blob([lines.join('\n')],{type:'text/csv;charset=utf-8;'}); const url = URL.createObjectURL(blob);
  const a = el('a',{href:url,download:filename}); document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

export const storage = { get(k,def){ try{ return JSON.parse(localStorage.getItem(k)) ?? def; }catch{ return def; } }, set(k,v){ localStorage.setItem(k, JSON.stringify(v)); } };
export function getParam(name){ return new URL(location.href).searchParams.get(name); }
export function flagOf(iso){ if(!iso||iso.length<2) return ''; const cc=iso.slice(0,2).toUpperCase(); return [...cc].map(c=>String.fromCodePoint(127397+c.charCodeAt())).join(''); }
export function highlight(text,q){ if(!q) return String(text||''); const s=q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); return String(text??'').replace(new RegExp(s,'ig'), m=>`<mark>${m}</mark>`); }

/* Skeleton Loader */
export function skeletonRows(n, cols){
  const frag = document.createDocumentFragment();
  for(let i=0;i<n;i++){
    const tr = el('tr',{className:'skeleton'});
    for(let c=0;c<cols;c++) tr.append(el('td',{}, el('div',{className:'skel'})));
    frag.append(tr);
  }
  return frag;
}

/* Toasts */
let toastBox;
export function toast(msg, kind='info'){
  if(!toastBox){toastBox=el('div',{className:'toast-box'});document.body.append(toastBox);}
  const t=el('div',{className:`toast ${kind}`}, msg);
  toastBox.append(t);
  setTimeout(()=>t.classList.add('show'));
  setTimeout(()=>{t.classList.remove('show'); setTimeout(()=>t.remove(),180);}, 3400);
}

/* Modal Confirm */
export function confirmDialog({title='Bestätigen', body='Sicher?', ok='Ja', cancel='Abbrechen'}){
  return new Promise(res=>{
    const overlay=el('div',{className:'modal-overlay'});
    const box=el('div',{className:'modal'},
      el('div',{className:'modal-head'}, title),
      el('div',{className:'modal-body'}, body),
      el('div',{className:'modal-actions'},
        el('button',{className:'btn ghost',onclick:()=>done(false)}, cancel),
        el('button',{className:'btn danger',onclick:()=>done(true)}, ok),
      ));
    function done(v){ overlay.classList.remove('show'); setTimeout(()=>overlay.remove(),160); res(v); }
    overlay.append(box); document.body.append(overlay);
    setTimeout(()=>overlay.classList.add('show'));
    overlay.addEventListener('click',e=>{if(e.target===overlay)done(false);});
  });
}

/* Robust ID-Extractor */
export function extractId(obj){
  if(!obj) return null;
  const c = (obj.resources && obj.resources[0]) ? obj.resources[0] : (obj.resource ?? obj);
  return (c && (c.ID ?? c.id ?? c.Id ?? c.CustomerID ?? c.AddressID)) ?? null;
}

/* Density toggle (optional) */
export function applyUserPrefs(){
  const density = storage.get('density','compact');
  document.body.classList.toggle('density-comfort', density==='comfort');
}
export function toggleDensity(){
  const next = document.body.classList.contains('density-comfort') ? 'compact' : 'comfort';
  storage.set('density', next); applyUserPrefs();
}
document.addEventListener('DOMContentLoaded', applyUserPrefs);
