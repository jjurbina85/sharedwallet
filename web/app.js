// Wallet Preventa Honduras. Sitio estático sin dependencias (GitHub Pages).
const LS_DATA='wallet.data.v1', LS_STATE='wallet.state.v1', LS_BACKUPS='wallet.backups.v1', LS_WHO='wallet.who.v1';
const ETAPAS=['Prospección','Diagnóstico','Propuesta','Negociación','Ganada','Perdida'];
const MAX_BACKUPS=30;
const WEB_OPTS=[['','Sin registrar'],['ninguno','Sin sitio'],['info','Informativo'],['ventas','Con ventas en línea']];
const CORREO_OPTS=[['','Sin registrar'],['ninguno','Sin correo'],['gratis','Gratuito (Gmail/Hotmail…)'],['corp','Corporativo propio'],['m365','Microsoft 365'],['google','Google Workspace']];
const APP_OPTS=[['','Sin registrar'],['no','No'],['si','Sí']];
const KEYS=[
 {k:'Fortinet',re:/forti/i},{k:'Ciberseguridad gestionada',re:/scitum|\bsoc\b|mdr|edr|vulnerabilidad|ciberseguridad|sase|itdr/i},{k:'WiFi',re:/wi-?fi|meraki/i},{k:'IPTV',re:/iptv/i},
 {k:'PBX y telefonía IP',re:/pbx|telefon|webex|ucaas/i},{k:'WhatsApp Business',re:/whatsapp/i},
 {k:'Mensajería SMS y RCS',re:/\bsms\b|rcs|rbm|mensajer/i},{k:'Desarrollo de software',re:/desarrollo|software/i},
 {k:'Infraestructura y enlaces',re:/infraestructura|enlace|sd-?wan|conectividad|internet dedicado/i},
 {k:'Video analítica',re:/video/i},{k:'SAP',re:/\bsap\b/i},{k:'Salesforce',re:/salesforce/i},
 {k:'HCM y nómina',re:/n[oó]mina|hcm/i},{k:'SmartCultivo',re:/smartcultivo/i},
 {k:'Nube',re:/nube|cloud|aws|azure|microsoft 365|google workspace/i},{k:'Respaldo',re:/backup|respaldo/i},{k:'GPS y flota',re:/gps|flota|vehicular/i}];
const nf=new Intl.NumberFormat('es-HN',{maximumFractionDigits:0});
const df=new Intl.DateTimeFormat('es-HN',{weekday:'short',day:'2-digit',month:'short'});
const $=(s,r=document)=>r.querySelector(s);
function h(tag,attrs,...kids){const el=document.createElement(tag);
 for(const [k,v] of Object.entries(attrs||{})){if(v==null||v===false)continue;
  if(k==='class')el.className=v;else if(k.startsWith('on'))el.addEventListener(k.slice(2),v);else if(k==='value')el.value=v;else if(v===true)el.setAttribute(k,'');else el.setAttribute(k,v);}
 for(const c of kids.flat()){if(c==null||c===false)continue;el.append(c.nodeType?c:document.createTextNode(String(c)));}
 return el;}
const pd=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d);};
const fdate=s=>df.format(pd(s));
const uid=()=>Math.random().toString(36).slice(2,9);
const who=()=>{try{return localStorage.getItem(LS_WHO)||'';}catch{return'';}};
const stamp=()=>({by:who()||undefined,ts:new Date().toISOString()});
let D=null,S=null,DEMO=true;

function loadState(){try{return JSON.parse(localStorage.getItem(LS_STATE))||{};}catch{return{};}}
function loadBackups(){try{return JSON.parse(localStorage.getItem(LS_BACKUPS))||[];}catch{return[];}}
function pushBackup(){
 try{
  const list=loadBackups();
  list.unshift({at:new Date().toISOString(),by:who()||undefined,state:JSON.parse(JSON.stringify(S))});
  while(list.length>MAX_BACKUPS)list.pop();
  localStorage.setItem(LS_BACKUPS,JSON.stringify(list));
 }catch{/* cuota: se omite el respaldo automático */}}
function saveState({backup=true}={}){
 try{
  localStorage.setItem(LS_STATE,JSON.stringify(S));
  if(backup)pushBackup();
 }catch{toast('No se pudo guardar en este navegador');}}
function toast(t){let el=$('#toast');if(!el){el=h('div',{id:'toast',class:'toast',role:'status'});document.body.append(el);}
 el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2400);}
const st=(k)=>S[k]||(S[k]={});
const techs=id=>st('tech')[id]||[];const ofertas=id=>st('ofertas')[id]||[];const notas=id=>st('notas')[id]||[];
const reunionesProg=()=>S.reunionesProg||(S.reunionesProg=[]);
const presencia=id=>st('presencia')[id]||(st('presencia')[id]={web:'',oficinas:'',ubicacion:'',redes:'',correo:'',app:''});
const estado=c=>(st('estados')[c.id])||c.estado;
const clienteById=id=>D.clientes.find(c=>c.id===id);
const tiene=(c,re)=>techs(c.id).some(t=>re.test(`${t.tema} ${t.proveedor||''}`));
const conOferta=(c,re)=>ofertas(c.id).some(o=>re.test(o.solucion));
function ultimaActividad(c){const ds=[...notas(c.id).map(n=>n.ts),...ofertas(c.id).map(o=>o.ts),...techs(c.id).map(t=>t.ts)].filter(Boolean).sort();return ds.length?new Date(ds[ds.length-1]):null;}
const abiertas=()=>D.clientes.flatMap(c=>ofertas(c.id).filter(o=>!['Ganada','Perdida'].includes(o.etapa)).map(o=>({...o,cid:c.id})));
const sum=(a,f)=>a.reduce((s,x)=>s+(Number(f(x))||0),0);
const chipTier=t=>({A:'ok',B:'',C:'',Validar:'warn',Pausa:'bad'}[t]??'');
const chipClase=c=>c==='Catálogo Claro'?'ok':c==='Partner'?'warn':c==='A la medida'?'info':'bad';
const chipMad=m=>({Alta:'ok',Media:'info',Básica:'warn','Sin presencia':'bad','Sin registrar':'muted'}[m]||'muted');
const chipPot=p=>({Alto:'ok',Medio:'warn',Bajo:'bad','Sin registrar':'muted'}[p]||'muted');
const chipEst=e=>{
 if(['Ganada'].includes(e))return 'ok';
 if(['Negociación','Propuesta','Diagnóstico','Contactado','En pipeline (Jorge)'].includes(e))return 'info';
 if(['Por contactar','Por validar'].includes(e))return 'warn';
 if(['Perdida','En pausa'].includes(e))return 'bad';
 return 'muted';
};
const byline=x=>x&& (x.by||x.ts)?` · ${[x.by,x.ts&&fdate(x.ts.slice(0,10))].filter(Boolean).join(' · ')}`:'';
function applyCartera(j){
 if(!Array.isArray(j.clientes)||!Array.isArray(j.agenda)||!Array.isArray(j.catalogo)){toast('Faltan clientes, catálogo o agenda');return false;}
 try{localStorage.setItem(LS_DATA,JSON.stringify(j));}catch{toast('El archivo es muy grande para este navegador');return false;}
 toast(`Datos cargados · ${j.clientes.length} cuentas`);
 setTimeout(()=>location.reload(),500);
 return true;
}

// ---------- presencia digital ----------
function madurezDe(p){
 if(!p||(!p.web&&!p.oficinas&&!p.redes&&!p.correo&&!p.app))return 'Sin registrar';
 let score=0;
 if(p.web==='info')score+=1;if(p.web==='ventas')score+=2;
 if(Number(p.oficinas)>=1)score+=1;if(Number(p.oficinas)>=3)score+=1;
 if(p.redes&&p.redes.trim())score+=1;
 if(p.correo==='corp'||p.correo==='m365'||p.correo==='google')score+=1;
 if(p.correo==='gratis')score+=0.5;
 if(p.app==='si')score+=1;
 if(p.web==='ninguno'&&!p.redes&&p.app!=='si')return 'Sin presencia';
 if(score<2)return 'Básica';
 if(score<4)return 'Media';
 return 'Alta';
}
function potencialDe(p){
 if(!p||madurezDe(p)==='Sin registrar')return 'Sin registrar';
 const of=Number(p.oficinas)||0;
 let score=0;
 if(of>=3)score+=2;else if(of>=1)score+=1;
 if(p.web==='ventas')score+=2;else if(p.web==='info')score+=1;
 if(p.correo==='gratis'||p.correo==='ninguno')score+=1;
 if(p.app!=='si'&&(p.web==='ventas'||of>=2))score+=1;
 if(p.redes&&p.redes.trim()&&p.web==='ninguno')score+=1;
 if(score>=4)return 'Alto';
 if(score>=2)return 'Medio';
 return 'Bajo';
}
function sugerenciasDe(p){
 const out=[];
 if(!p)return out;
 const of=Number(p.oficinas)||0;
 if(of>=3){out.push('SD-WAN con Fortinet');out.push('Seguridad gestionada Scitum (SOC/MDR)');}
 else if(of>=2)out.push('Conectividad entre sedes / SD-WAN');
 if(p.correo==='gratis'||p.correo==='ninguno')out.push('Microsoft 365');
 if(p.web==='ventas'&&p.app!=='si')out.push('App o canal digital asistido');
 if(p.web==='ninguno')out.push('Presencia web informativa + WhatsApp Business');
 if(p.web==='info'&&!p.redes)out.push('Redes sociales y captación');
 if(p.app==='si'&&p.correo!=='m365')out.push('Identidad y correo corporativo (M365)');
 return [...new Set(out)];
}
const labelWeb=v=>(WEB_OPTS.find(x=>x[0]===v)||[])[1]||'—';
const labelCorreo=v=>(CORREO_OPTS.find(x=>x[0]===v)||[])[1]||'—';

// ---------- componentes ----------
function bars(items,{href,color}={}){
 const mx=Math.max(1,...items.map(i=>i.n));
 if(!items.length)return h('p',{class:'empty'},'Sin datos todavía.');
 return h('div',{},items.map(i=>{const a=h(i.href?'a':'div',{class:'bar',href:i.href},h('span',{},i.label),h('div',{class:'t'},h('i',{style:`width:${100*i.n/mx}%;--bc:${i.color||color||'var(--muted)'}`})),h('span',{class:'n'},i.text??nf.format(i.n)));return a;}));}
const kpi=(v,l,cls='')=>h('div',{class:`card kpi glass ${cls}`.trim()},h('b',{},v),h('span',{},l));
function sel(opts,val,onchange,{label,id,any}={}){const s=h('select',{id,'aria-label':label||''},any!=null?h('option',{value:''},any):null,opts.map(o=>{const [v,t]=Array.isArray(o)?o:[o,o];return h('option',{value:v,selected:String(v)===String(val)},t);}));s.value=val??'';if(onchange)s.addEventListener('change',()=>onchange(s.value));return s;}
const field=(label,ctrl)=>h('label',{class:'f'},label,ctrl);
function dropzone(onFile){
 const input=h('input',{type:'file',accept:'application/json,.json','aria-label':'Archivo JSON de cartera'});
 const zone=h('div',{class:'dropzone',role:'button',tabindex:'0',onclick:()=>input.click(),onkeydown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}}},
  h('strong',{},'Suelta aquí datos-wallet-claro.json'),
  h('span',{},'o haz clic para elegir el archivo · solo en este navegador'),
  input);
 input.addEventListener('change',()=>{const f=input.files?.[0];if(f)onFile(f);});
 ;['dragenter','dragover'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add('drag');}));
 ;['dragleave','drop'].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove('drag');}));
 zone.addEventListener('drop',e=>{const f=e.dataTransfer?.files?.[0];if(f)onFile(f);});
 return zone;
}
const readJsonFile=(file,cb)=>{const r=new FileReader();r.onload=()=>{try{cb(JSON.parse(r.result));}catch{toast('El archivo no es un JSON válido');}};r.readAsText(file);};
const dlIcon=()=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 16 16');s.setAttribute('class','i');s.setAttribute('aria-hidden','true');s.innerHTML='<path d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';return s;};

// ---------- ICS ----------
const icsEsc=s=>String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
function pad2(n){return String(n).padStart(2,'0');}
function endSlot(fecha,hora,durMin){
 const [y,m,d]=fecha.split('-').map(Number);const [H,M]=hora.split(':').map(Number);
 const start=new Date(y,m-1,d,H,M,0);const end=new Date(start.getTime()+durMin*60000);
 return{start,end,st:`${y}${pad2(m)}${pad2(d)}T${pad2(H)}${pad2(M)}00`,en:`${end.getFullYear()}${pad2(end.getMonth()+1)}${pad2(end.getDate())}T${pad2(end.getHours())}${pad2(end.getMinutes())}00`};
}
function icsEvent({uid:u,titulo,desc,fecha,hora,durMin=60,status='Confirmado'}){
 const {st:stt,en}=endSlot(fecha,hora,durMin);const bl=status==='Bloqueo';
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wallet Preventa//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VTIMEZONE','TZID:America/Tegucigalpa','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:-0600','TZOFFSETTO:-0600','TZNAME:CST','END:STANDARD','END:VTIMEZONE',
 'BEGIN:VEVENT',`UID:${u}@wallet-preventa`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z`,`DTSTART;TZID=America/Tegucigalpa:${stt}`,`DTEND;TZID=America/Tegucigalpa:${en}`,
 'SUMMARY:'+icsEsc((bl?'[Bloqueo] ':'')+titulo),'DESCRIPTION:'+icsEsc(desc||''),'STATUS:'+(bl?'TENTATIVE':'CONFIRMED'),'TRANSP:OPAQUE','X-MICROSOFT-CDO-BUSYSTATUS:'+(bl?'TENTATIVE':'BUSY'),'END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n';}
function icsFor(e,slot,status){
 const [f,t]=slot.split(' ');
 const desc=`Participan: ${e.participantes}\n${e.objetivo}`+(e.temas?`\nTemas: ${e.temas}`:'')+(e.nota?`\nNota: ${e.nota}`:'')+(status==='Bloqueo'?'\nBloqueo propuesto: confirmar con el cliente.':'');
 return icsEvent({uid:`${e.id}-${f}-${t.replace(':','')}`,titulo:e.titulo,desc,fecha:f,hora:t,durMin:60,status});
}
function download(name,text,type='text/calendar'){const b=new Blob([text],{type:type+';charset=utf-8'});const u=URL.createObjectURL(b);const a=h('a',{href:u,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);}
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,40);

function rangesOverlap(a0,a1,b0,b1){return a0<b1&&b0<a1;}
function meetingRange(fecha,hora,durMin){
 const [y,m,d]=fecha.split('-').map(Number);const [H,M]=hora.split(':').map(Number);
 const start=new Date(y,m-1,d,H,M,0).getTime();return [start,start+durMin*60000];
}
function clashMessages(fecha,hora,durMin,exceptId){
 const msgs=[];const [a0,a1]=meetingRange(fecha,hora,durMin);
 for(const e of D.agenda){
  const a=st('agenda')[e.id]||{};const slot=a.slot||`${e.fecha} ${e.hora}`;
  const [f,t]=slot.split(' ');if(!f||!t)continue;
  const [b0,b1]=meetingRange(f,t,60);
  if(rangesOverlap(a0,a1,b0,b1))msgs.push(`Choca con agenda: ${e.titulo} (${f} ${t})`);
 }
 for(const r of reunionesProg()){
  if(exceptId&&r.id===exceptId)continue;
  const [b0,b1]=meetingRange(r.fecha,r.hora,r.durMin||60);
  if(rangesOverlap(a0,a1,b0,b1)){
   const c=clienteById(r.cuenta_id);msgs.push(`Choca con programada: ${c?c.empresa:r.titulo} (${r.fecha} ${r.hora})`);
  }
 }
 return msgs;
}

// ---------- vistas ----------
const Q={q:'',prop:'',rubro:'',ola:'',tier:'',vent:'',estado:'',pres:'',ofic:'',pot:''};
function vResumen(){
 const C=D.clientes,ab=abiertas(),now=new Date();
 const contact=C.filter(c=>!['Por contactar','Por validar','En pausa'].includes(estado(c))).length;
 const ag=D.agenda.filter(e=>e.tipo==='Cuenta'),hechas=ag.filter(e=>(st('agenda')[e.id]||{}).hecha).length;
 const venc=C.filter(c=>['Vencido','Este mes','1-3 meses'].includes(c.ventana)).length;
 const sinAct=C.filter(c=>{const u=ultimaActividad(c);return !u||(now-u)/864e5>30;}).length;
 const fuera=D.clientes.flatMap(c=>ofertas(c.id)).filter(o=>o.clase==='Fuera de catálogo').length;
 const por=(k)=>[...new Map(C.map(c=>[c[k]||'Sin dato',0])).keys()].map(v=>({label:v,n:C.filter(c=>(c[k]||'Sin dato')===v).length}));
 const olas=['Ola 1','Ola 2','Ola 3','En pipeline','Validar','Pausa'].map(o=>({label:o,n:C.filter(c=>c.ola===o).length,href:'#/cuentas?ola='+encodeURIComponent(o),color:o==='Ola 1'?'var(--ok)':o==='Validar'?'var(--warn)':o==='Pausa'?'var(--bad)':undefined})).filter(x=>x.n);
 const rub=por('rubro').sort((a,b)=>b.n-a.n).map(x=>({...x,href:'#/rubro/'+encodeURIComponent(x.label)}));
 const etapas=ETAPAS.filter(e=>!['Perdida'].includes(e)).map(e=>{const os=D.clientes.flatMap(c=>ofertas(c.id)).filter(o=>o.etapa===e);return {label:e,n:sum(os,o=>o.monto),text:nf.format(os.length)+' · '+nf.format(sum(os,o=>o.monto))};});
 const conv=olas.map(o=>{const cs=C.filter(c=>c.ola===o.label);const n=cs.filter(c=>ofertas(c.id).length).length;return {label:o.label,n:cs.length?100*n/cs.length:0,text:`${n}/${cs.length}`};});
 const madOrden=['Sin registrar','Sin presencia','Básica','Media','Alta'];
 const potOrden=['Sin registrar','Bajo','Medio','Alto'];
 const madBars=madOrden.map(l=>({label:l,n:C.filter(c=>madurezDe(presencia(c.id))===l).length,href:'#/cuentas?pres='+encodeURIComponent(l)})).filter(x=>x.n);
 const potBars=potOrden.map(l=>({label:l,n:C.filter(c=>potencialDe(presencia(c.id))===l).length,href:'#/cuentas?pot='+encodeURIComponent(l),color:l==='Alto'?'var(--ok)':l==='Bajo'?'var(--bad)':undefined})).filter(x=>x.n);
 const proxAgenda=D.agenda.filter(e=>e.tipo==='Cuenta').map(e=>({titulo:e.titulo,cuenta_id:e.cuenta_id,slot:(st('agenda')[e.id]||{}).slot||`${e.fecha} ${e.hora}`}));
 const proxProg=reunionesProg().map(r=>({titulo:clienteById(r.cuenta_id)?.empresa||r.titulo,cuenta_id:r.cuenta_id,slot:`${r.fecha} ${r.hora}`}));
 const prox=[...proxAgenda,...proxProg].sort((a,b)=>a.slot.localeCompare(b.slot));
 const hoy=now.toISOString().slice(0,10);let nx=prox.filter(x=>x.slot>=hoy).slice(0,6);const futuro=nx.length>0;if(!nx.length)nx=prox.slice(0,6);
 return h('div',{class:'view'},
  h('header',{class:'page-head'},
   h('div',{class:'eyebrow'},h('span',{class:'live-pill'+(DEMO?'':' ok')},DEMO?'Demo':'Cartera real')),
   h('h1',{},'Resumen'),
   h('p',{class:'sub'},`${C.length} cuentas · Corte ${D.meta.corte} · ${D.meta.fuente}`)),
  h('div',{class:'grid kpis-hero'},
   kpi(nf.format(C.length),'Cuentas','hero-kpi'),
   kpi(nf.format(sum(C,c=>c.fact)),'Facturación (L)','hero-kpi'),
   kpi(nf.format(sum(ab,o=>o.monto)),'Pipeline abierto','hero-kpi')),
  h('div',{class:'grid kpis'},
   kpi(nf.format(sum(ab,o=>o.monto*o.prob/100)),'Pipeline ponderado','kpi-sec'),
   kpi(`${contact}/${C.length}`,'Contactadas','kpi-sec'),
   kpi(`${hechas}/${ag.length}`,'Reuniones hechas','kpi-sec'),
   kpi(nf.format(venc),'Vence ≤ 3 meses','kpi-sec'),
   kpi(nf.format(sinAct),'Sin actividad 30d','kpi-sec'),
   kpi(nf.format(fuera),'Fuera de catálogo','kpi-sec')),
  h('div',{class:'grid cols'},
   h('div',{class:'card glass'},h('h2',{},'Por ola de ataque'),bars(olas)),
   h('div',{class:'card glass'},h('h2',{},'Por rubro'),bars(rub)),
   h('div',{class:'card glass'},h('h2',{},'Pipeline por etapa'),bars(etapas,{color:'var(--brand)'})),
   h('div',{class:'card glass'},h('h2',{},'Cuentas con oferta por ola'),bars(conv,{color:'var(--ok)'})),
   h('div',{class:'card glass'},h('h2',{},'Presencia digital'),bars(madBars,{color:'var(--info)'})),
   h('div',{class:'card glass'},h('h2',{},'Potencial de compra'),bars(potBars))),
  h('div',{class:'card glass'},h('h2',{},futuro?'Próximas reuniones':'Primeras reuniones'),
   h('ul',{class:'list'},nx.map(x=>h('li',{},h('span',{},x.cuenta_id?h('a',{class:'cell',href:'#/cliente/'+x.cuenta_id},x.titulo):x.titulo),h('span',{class:'muted'},fdate(x.slot.split(' ')[0])+' · '+x.slot.split(' ')[1]))))));
}

function filtroCuentas(){
 return D.clientes.filter(c=>{
  const p=presencia(c.id);const of=Number(p.oficinas)||0;
  const oficOk=!Q.ofic||(Q.ofic==='0'?of===0:Q.ofic==='1-2'?of>=1&&of<=2:Q.ofic==='3+'?of>=3:true);
  return (!Q.q||c.empresa.toLowerCase().includes(Q.q.toLowerCase()))&&(!Q.prop||c.propone===Q.prop)&&(!Q.rubro||c.rubro===Q.rubro)&&(!Q.ola||c.ola===Q.ola)&&(!Q.tier||c.tier===Q.tier)&&(!Q.vent||c.ventana===Q.vent)&&(!Q.estado||estado(c)===Q.estado)
   &&(!Q.pres||madurezDe(p)===Q.pres)&&oficOk&&(!Q.pot||potencialDe(p)===Q.pot);
 });
}
function vCuentas(){
 const u=(k)=>[...new Set(D.clientes.map(c=>c[k]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
 const out=h('div',{class:'wrap glass'});const cnt=h('p',{class:'sub'});
 const draw=()=>{const r=filtroCuentas().sort((a,b)=>(b.score??-1)-(a.score??-1));cnt.textContent=`${r.length} de ${D.clientes.length} cuentas · toca una fila para abrir la ficha`;
  out.replaceChildren(h('table',{},h('thead',{},h('tr',{},['Ola','Empresa','Tier','Score','Presencia','Potencial','Facturación','Estado','Ofertas'].map((t,i)=>h('th',{class:[3,6,8].includes(i)?'num':''},t)))),
  h('tbody',{},r.map(c=>{const p=presencia(c.id);const mad=madurezDe(p);const pot=potencialDe(p);const est=estado(c);
   return h('tr',{class:'link',onclick:()=>{location.hash='#/cliente/'+c.id;}},
    h('td',{},h('span',{class:'chip'},c.ola)),
    h('td',{},h('div',{class:'empresa-cell'},h('a',{class:'cell',href:'#/cliente/'+c.id,onclick:e=>e.stopPropagation()},c.empresa),h('span',{class:'meta'},c.rubro+(c.ventana?` · ${c.ventana}`:'')))),
    h('td',{},h('span',{class:'chip '+chipTier(c.tier)},c.tier)),
    h('td',{class:'num'},c.score??'n/d'),
    h('td',{},h('span',{class:'chip '+chipMad(mad)},mad)),
    h('td',{},h('span',{class:'chip '+chipPot(pot)},pot)),
    h('td',{class:'num'},c.fact==null?'—':nf.format(c.fact)),
    h('td',{},h('span',{class:'chip '+chipEst(est)},est)),
    h('td',{class:'num'},ofertas(c.id).length||'—'));}))));};
 const set=(k)=>(v)=>{Q[k]=v;draw();};
 const activeFilters=[Q.prop,Q.rubro,Q.ola,Q.tier,Q.vent,Q.estado,Q.pres,Q.ofic,Q.pot].filter(Boolean).length;
 const fl=h('details',{class:'filters-panel',open:!!(Q.q||activeFilters)},
  h('summary',{},h('span',{},'Filtros'),h('span',{class:'hint'},activeFilters?`${activeFilters} activos`:'Buscar y acotar la lista')),
  h('div',{class:'filters-top',style:'margin-top:14px'},
   field('Buscar',h('input',{type:'search',placeholder:'Nombre de la empresa',value:Q.q,oninput:e=>{Q.q=e.target.value;draw();}})),
   field('Ola',sel(['Ola 1','Ola 2','Ola 3','En pipeline','Validar','Pausa'],Q.ola,set('ola'),{any:'Todas'})),
   field('Ejecutivo',sel(u('propone'),Q.prop,set('prop'),{any:'Todos'})),
   field('Potencial',sel(['Sin registrar','Bajo','Medio','Alto'],Q.pot,set('pot'),{any:'Todos'}))),
  h('div',{class:'filters'},
   field('Rubro',sel(u('rubro'),Q.rubro,set('rubro'),{any:'Todos'})),
   field('Tier',sel(['A','B','C','Validar','Pausa'],Q.tier,set('tier'),{any:'Todos'})),
   field('Vencimiento',sel(['Vencido','Este mes','1-3 meses','4-6 meses','7-12 meses','Más de 12 meses','Sin dato'],Q.vent,set('vent'),{any:'Todos'})),
   field('Estado',sel(['Por validar','Por contactar','En pipeline (Jorge)','Contactado','Diagnóstico','Propuesta','Negociación','Ganada','Perdida','En pausa'],Q.estado,set('estado'),{any:'Todos'})),
   field('Presencia',sel(['Sin registrar','Sin presencia','Básica','Media','Alta'],Q.pres,set('pres'),{any:'Todas'})),
   field('Oficinas',sel([['0','Ninguna'],['1-2','1 o 2'],['3+','3 o más']],Q.ofic,set('ofic'),{any:'Todas'})),
   h('div',{style:'display:flex;align-items:end'},h('button',{onclick:()=>{Object.keys(Q).forEach(k=>Q[k]='');route();}},'Limpiar'))));
 draw();return h('div',{class:'view'},
  h('header',{class:'page-head'},h('div',{class:'eyebrow'},h('span',{class:'live-pill'+(DEMO?'':' ok')},DEMO?'Demo':'Cartera real')),h('h1',{},'Cuentas'),cnt),
  fl,out);}

function vCliente(id){
 const c=clienteById(id);if(!c)return h('p',{class:'empty'},'No se encontró la cuenta.');
 const back=h('a',{class:'back',href:'#/cuentas'},'← Cuentas');
 const rerender=()=>route();
 const add=(coll,item)=>{(st(coll)[id]=st(coll)[id]||[]).unshift({...item,id:uid(),...stamp()});saveState();rerender();};
 const del=(coll,iid)=>{st(coll)[id]=(st(coll)[id]||[]).filter(x=>x.id!==iid);saveState();rerender();};
 const catNames=D.catalogo.map(x=>[x.solucion,`${x.solucion} (${x.clase})`]);
 const p=presencia(id);
 const tf={tema:'',prov:'',vence:''};
 const techForm=h('div',{class:'form'},field('Tecnología',sel(catNames.concat([['Otra','Otra (escribir en proveedor)']]),'',v=>tf.tema=v,{any:'Elegir',label:'Tecnología'})),field('Proveedor o detalle',h('input',{oninput:e=>tf.prov=e.target.value})),field('Renovación',h('input',{type:'date',oninput:e=>tf.vence=e.target.value})),h('button',{class:'primary',onclick:()=>{if(!tf.tema)return toast('Elige una tecnología');add('tech',{tema:tf.tema,proveedor:tf.prov,vence:tf.vence});}},'Agregar'));
 const techList=techs(id).length?h('ul',{class:'list'},techs(id).map(t=>h('li',{},h('span',{},h('b',{},t.tema),t.proveedor?` · ${t.proveedor}`:'',t.vence?h('span',{class:'muted'},` · renueva ${fdate(t.vence)}`):'',h('span',{class:'muted'},byline(t))),h('button',{class:'sm danger',onclick:()=>del('tech',t.id),'aria-label':'Quitar tecnología'},'Quitar')))):h('p',{class:'empty'},'Aún no registras tecnologías de este cliente.');
 const temas=(c.temas||'').split('; ').filter(Boolean);
 const brechas=h('ul',{class:'list'},temas.map(t=>{const key=KEYS.find(k=>k.re.test(t));const tag=(t.match(/\[(.+?)\]/)||[])[1]||'';const ya=key&&(tiene(c,key.re));const of=key&&conOferta(c,key.re);
  return h('li',{},h('span',{},t.replace(/\s*\[.+?\]/g,'')),h('span',{class:'row'},tag?h('span',{class:'chip'},tag):null,h('span',{class:'chip '+(ya?'ok':of?'warn':'bad')},ya?'Ya lo tiene':of?'Con oferta':'Brecha')));}));
 const of={sol:'',monto:'',prob:'25',etapa:'Prospección',cierre:'',nota:''};
 const ofForm=h('div',{class:'form'},field('Solución',sel(catNames,'',v=>of.sol=v,{any:'Elegir',label:'Solución'})),field('Monto (L)',h('input',{type:'number',min:'0',inputmode:'numeric',oninput:e=>of.monto=e.target.value})),field('Probabilidad',sel([['10','10%'],['25','25%'],['50','50%'],['75','75%'],['90','90%']],'25',v=>of.prob=v)),field('Etapa',sel(ETAPAS,'Prospección',v=>of.etapa=v)),field('Cierre',h('input',{type:'date',oninput:e=>of.cierre=e.target.value})),field('Nota',h('input',{oninput:e=>of.nota=e.target.value})),
  h('button',{class:'primary',onclick:()=>{if(!of.sol)return toast('Elige una solución');const cl=D.catalogo.find(x=>x.solucion===of.sol);add('ofertas',{solucion:of.sol,clase:cl?cl.clase:'',monto:Number(of.monto)||0,prob:Number(of.prob),etapa:of.etapa,cierre:of.cierre,nota:of.nota});}},'Agregar oferta'));
 const ofList=ofertas(id).length?h('div',{class:'wrap'},h('table',{},h('thead',{},h('tr',{},['Solución','Clasificación','Monto (L)','Prob.','Etapa','Cierre',''].map((t,i)=>h('th',{class:[2,3].includes(i)?'num':''},t)))),h('tbody',{},ofertas(id).map(o=>h('tr',{},h('td',{},o.solucion,o.nota?h('div',{class:'muted'},o.nota):null,h('div',{class:'muted'},byline(o).replace(/^ · /,''))),h('td',{},h('span',{class:'chip '+chipClase(o.clase)},o.clase||'—')),h('td',{class:'num'},nf.format(o.monto)),h('td',{class:'num'},o.prob+'%'),h('td',{},sel(ETAPAS,o.etapa,v=>{o.etapa=v;Object.assign(o,stamp());saveState();rerender();},{label:'Etapa'})),h('td',{},o.cierre?fdate(o.cierre):'—'),h('td',{},h('button',{class:'sm danger',onclick:()=>del('ofertas',o.id)},'Quitar'))))))):h('p',{class:'empty'},'Sin ofertas registradas.');
 let nt='';
 const notaForm=h('div',{class:'form'},h('textarea',{'aria-label':'Nota',placeholder:'Qué se habló, qué sigue',oninput:e=>nt=e.target.value}),h('button',{class:'primary',onclick:()=>{if(!nt.trim())return toast('Escribe la nota');add('notas',{texto:nt.trim(),fecha:new Date().toISOString().slice(0,10)});}},'Guardar nota'));
 const notaList=notas(id).length?h('ul',{class:'list'},notas(id).map(n=>h('li',{},h('span',{},n.texto,h('span',{class:'muted'},byline(n))),h('span',{class:'row'},h('span',{class:'muted'},fdate(n.fecha)),h('button',{class:'sm danger',onclick:()=>del('notas',n.id)},'Quitar'))))):h('p',{class:'empty'},'Sin notas todavía.');
 const evs=D.agenda.filter(e=>e.cuenta_id===id);
 const m={fecha:'',hora:'09:00',dur:'60',status:'Bloqueo'};
 const progMine=reunionesProg().filter(r=>r.cuenta_id===id);
 const progForm=h('div',{class:'form'},
  field('Día',h('input',{type:'date',oninput:e=>m.fecha=e.target.value})),
  field('Hora inicio',h('input',{type:'time',value:'09:00',oninput:e=>m.hora=e.target.value})),
  field('Duración',sel([['30','30 min'],['60','1 hora'],['90','1 h 30'],['120','2 horas']],'60',v=>m.dur=v)),
  field('Estado',sel(['Bloqueo','Confirmado'],'Bloqueo',v=>m.status=v)),
  h('button',{class:'primary',onclick:()=>{
   if(!m.fecha||!m.hora)return toast('Elige día y hora');
   const durMin=Number(m.dur)||60;
   const clashes=clashMessages(m.fecha,m.hora,durMin);
   if(clashes.length){toast(clashes[0]);if(!confirm(clashes.join('\n')+'\n\n¿Programar de todos modos?'))return;}
   const item={id:uid(),cuenta_id:id,titulo:c.empresa,fecha:m.fecha,hora:m.hora,durMin,status:m.status,...stamp()};
   reunionesProg().unshift(item);saveState();
   download(`Reunion_${slug(c.empresa)}_${m.fecha}_${m.hora.replace(':','')}.ics`,icsEvent({uid:item.id,titulo:c.empresa,desc:`Reunión programada desde Wallet Preventa.${item.by?`\nPor: ${item.by}`:''}`,fecha:m.fecha,hora:m.hora,durMin,status:m.status}));
   toast('Reunión programada y .ics descargado');rerender();
  }},'Programar y descargar .ics'));
 const progList=progMine.length?h('ul',{class:'list'},progMine.map(r=>h('li',{},h('span',{},`${fdate(r.fecha)} · ${r.hora} · ${r.durMin||60} min`,h('span',{class:'chip'},r.status),h('span',{class:'muted'},byline(r))),
  h('span',{class:'row'},h('button',{class:'sm',onclick:()=>download(`Reunion_${slug(c.empresa)}_${r.fecha}_${r.hora.replace(':','')}.ics`,icsEvent({uid:r.id,titulo:c.empresa,desc:'',fecha:r.fecha,hora:r.hora,durMin:r.durMin||60,status:r.status}))},'ICS',dlIcon()),
   h('button',{class:'sm danger',onclick:()=>{S.reunionesProg=reunionesProg().filter(x=>x.id!==r.id);saveState();rerender();}},'Quitar'))))):h('p',{class:'empty'},'Sin reuniones programadas desde la ficha.');

 const sug=sugerenciasDe(p);
 const presForm=h('div',{class:'form'},
  field('Sitio web',sel(WEB_OPTS,p.web,v=>{p.web=v;Object.assign(p,stamp());saveState();rerender();})),
  field('Oficinas / sucursales',h('input',{type:'number',min:'0',value:p.oficinas,oninput:e=>{p.oficinas=e.target.value;}})),
  field('Dónde están',h('input',{value:p.ubicacion||'',placeholder:'Ciudad / zona',oninput:e=>{p.ubicacion=e.target.value;}})),
  field('Redes sociales',h('input',{value:p.redes||'',placeholder:'IG, FB, LinkedIn…',oninput:e=>{p.redes=e.target.value;}})),
  field('Correo',sel(CORREO_OPTS,p.correo,v=>{p.correo=v;Object.assign(p,stamp());saveState();rerender();})),
  field('App propia',sel(APP_OPTS,p.app,v=>{p.app=v;Object.assign(p,stamp());saveState();rerender();})),
  h('button',{class:'primary',onclick:()=>{Object.assign(p,stamp());saveState();toast('Presencia guardada');rerender();}},'Guardar presencia'));

 return h('div',{class:'view'},back,h('header',{class:'page-head'},h('h1',{},c.empresa),h('p',{class:'sub'},`${c.rubro} · ${c.ola} · Tier ${c.tier} · Score ${c.score??'n/d'}`)),
  h('div',{class:'grid cols'},
   h('div',{class:'card glass'},h('h2',{},'Ficha'),h('div',{class:'dl'},
     h('p',{},h('span',{class:'muted'},'Ejecutivo que la propone'),h('br'),c.propone),h('p',{},h('span',{class:'muted'},'Dueño en Claro'),h('br'),c.dueno||'Sin dato',c.edueno?` (${c.edueno})`:''),
     h('p',{},h('span',{class:'muted'},'Segmento'),h('br'),c.segmento||'—'),h('p',{},h('span',{class:'muted'},'Facturación (L)'),h('br'),c.fact==null?'—':nf.format(c.fact)),
     h('p',{},h('span',{class:'muted'},'Líneas'),h('br'),c.lineas??'—'),h('p',{},h('span',{class:'muted'},'Vencimiento móvil'),h('br'),c.ventana),
     h('p',{},h('span',{class:'muted'},'En Salesforce'),h('br'),c.sf||'—'),h('p',{},h('span',{class:'muted'},'Califica proyecto grande'),h('br'),c.grande||'—')),
     c.alerta?h('p',{},h('span',{class:'chip bad'},c.alerta)):null,
     h('div',{class:'form'},field('Estado de gestión',sel(['Por validar','Por contactar','En pipeline (Jorge)','Contactado','Diagnóstico','Propuesta','Negociación','Ganada','Perdida','En pausa'],estado(c),v=>{st('estados')[id]=v;saveState();toast('Estado guardado');})))),
   h('div',{class:'card glass'},h('h2',{},'Cómo atacarla'),h('div',{class:'dl'},
     h('p',{},h('h3',{},'Ángulo'),c.angulo),h('p',{},h('h3',{},'Solución ancla'),c.ancla),h('p',{},h('h3',{},'Disparador'),c.disparador),h('p',{},h('h3',{},'Apertura'),c.apertura),
     h('p',{},h('h3',{},'Preguntas de descubrimiento'),c.discovery),h('p',{},h('h3',{},'Objeción probable'),c.objecion),h('p',{},h('h3',{},'Primer paso'),c.prueba),h('p',{},h('h3',{},'Siguiente paso'),c.siguiente)))),
  h('div',{class:'grid cols'},
   h('div',{class:'card glass'},h('h2',{},'Presencia digital y potencial'),
    h('div',{class:'row',style:'margin-bottom:10px'},h('span',{class:'chip'},'Madurez: '+madurezDe(p)),h('span',{class:'chip '+(potencialDe(p)==='Alto'?'ok':potencialDe(p)==='Bajo'?'bad':'')},'Potencial: '+potencialDe(p))),
    h('p',{class:'muted'},`${labelWeb(p.web)} · Oficinas: ${p.oficinas||'—'} ${p.ubicacion?`(${p.ubicacion})`:''} · Correo: ${labelCorreo(p.correo)} · App: ${p.app==='si'?'Sí':p.app==='no'?'No':'—'}`),
    sug.length?h('ul',{class:'list'},sug.map(s=>h('li',{},h('span',{},'Sugerencia: '+s)))):h('p',{class:'empty'},'Completa el perfil para ver sugerencias.'),
    presForm),
   h('div',{class:'card glass'},h('h2',{},'Programar reunión'),progList,progForm)),
  h('div',{class:'grid cols'},
   h('div',{class:'card glass'},h('h2',{},'Tecnologías que tiene el cliente'),techList,techForm),
   h('div',{class:'card glass'},h('h2',{},'Temas a evaluar frente al catálogo'),brechas)),
  h('div',{class:'card glass',style:'margin-bottom:16px'},h('h2',{},'Ofertas'),ofList,ofForm),
  h('div',{class:'grid cols'},h('div',{class:'card glass'},h('h2',{},'Historial y notas'),notaList,notaForm),
   h('div',{class:'card glass'},h('h2',{},'Reuniones en la agenda base'),evs.length?h('ul',{class:'list'},evs.map(e=>{const a=st('agenda')[e.id]||{};return h('li',{},h('span',{},fdate((a.slot||`${e.fecha} ${e.hora}`).split(' ')[0])+' · '+(a.slot||`${e.fecha} ${e.hora}`).split(' ')[1]),h('span',{class:'chip'},a.status||'Sin elegir'));})):h('p',{class:'empty'},'Esta cuenta no tiene reunión en la agenda base.'),h('p',{},h('a',{class:'cell',href:'#/agenda'},'Ir a la agenda')))));
}

function vRubros(){
 const rs=[...new Set(D.clientes.map(c=>c.rubro))];
 const items=rs.map(r=>{const cs=D.clientes.filter(c=>c.rubro===r);return {label:r,n:cs.length,href:'#/rubro/'+encodeURIComponent(r),text:`${cs.length} · L ${nf.format(sum(cs,c=>c.fact))}`};}).sort((a,b)=>b.n-a.n);
 return h('div',{class:'view'},h('header',{class:'page-head'},h('h1',{},'Rubros'),h('p',{class:'sub'},'Cuentas y facturación por rubro.')),h('div',{class:'card glass'},bars(items,{color:'var(--accent)'})));}
function vRubro(name){
 const cs=D.clientes.filter(c=>c.rubro===name);if(!cs.length)return h('p',{class:'empty'},'Rubro sin cuentas.');
 const pb=D.playbook.find(p=>p.perfil===name)||D.playbook.find(p=>cs.some(c=>c.perfil===p.perfil));
 const ab=cs.flatMap(c=>ofertas(c.id).filter(o=>!['Ganada','Perdida'].includes(o.etapa)));
 const pen=KEYS.map(k=>{const t=cs.filter(c=>tiene(c,k.re)).length,o=cs.filter(c=>!tiene(c,k.re)&&conOferta(c,k.re)).length;return {k:k.k,t,o,libre:cs.length-t-o};}).filter(x=>x.t||x.o);
 const rec=KEYS.map(k=>({k:k.k,n:cs.filter(c=>(c.temas||'').split('; ').some(t=>k.re.test(t))).length})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
 const table=h('div',{class:'wrap glass'},h('table',{},
  h('thead',{},h('tr',{},['Empresa','Ola','Tier','Facturación (L)','Ofertas'].map((t,i)=>h('th',{class:i>2?'num':''},t)))),
  h('tbody',{},cs.sort((a,b)=>(b.score??-1)-(a.score??-1)).map(c=>h('tr',{class:'link',onclick:()=>{location.hash='#/cliente/'+c.id;}},
   h('td',{},h('a',{class:'cell',href:'#/cliente/'+c.id},c.empresa)),h('td',{},c.ola),h('td',{},c.tier),
   h('td',{class:'num'},c.fact==null?'—':nf.format(c.fact)),h('td',{class:'num'},ofertas(c.id).length||'—'))))));
 return h('div',{class:'view'},
  h('a',{class:'back',href:'#/rubros'},'← Rubros'),
  h('header',{class:'page-head'},h('h1',{},name),h('p',{class:'sub'},`${cs.length} cuentas · Facturación L ${nf.format(sum(cs,c=>c.fact))} · Pipeline abierto L ${nf.format(sum(ab,o=>o.monto))}`)),
  h('div',{class:'grid cols'},
   h('div',{class:'card glass'},h('h2',{},'Soluciones sugeridas para este rubro'),bars(rec.map(x=>({label:x.k,n:x.n})),{color:'var(--accent)'})),
   h('div',{class:'card glass'},h('h2',{},'Penetración registrada'),pen.length?h('ul',{class:'list'},pen.map(p=>h('li',{},h('span',{},p.k),h('span',{class:'muted'},`${p.t} la tienen · ${p.o} con oferta · ${p.libre} libres`)))):h('p',{class:'empty'},'Aún no hay tecnologías ni ofertas en este rubro.'))),
  pb?h('div',{class:'card glass',style:'margin-bottom:16px'},h('h2',{},'Playbook'),h('div',{class:'dl'},h('p',{},h('h3',{},'Ángulo'),pb.angulo),h('p',{},h('h3',{},'Descubrimiento'),pb.discovery),h('p',{},h('h3',{},'Objeción'),pb.objecion),h('p',{},h('h3',{},'Primer paso'),pb.prueba))):null,
  table);
}

const AQ={tipo:'',prop:'',mes:''};
function vAgenda(){
 const A=st('agenda');const cur=e=>A[e.id]||{};const slotOf=e=>cur(e).slot||`${e.fecha} ${e.hora}`;
 const wrap=h('div',{class:'wrap glass'}),stat=h('p',{class:'sub'});
 const progWrap=h('div',{class:'card glass',style:'margin-bottom:16px'});
 const drawProg=()=>{
  const rows=reunionesProg().slice().sort((a,b)=>`${a.fecha} ${a.hora}`.localeCompare(`${b.fecha} ${b.hora}`));
  const list=rows.length?h('ul',{class:'list'},rows.map(r=>{
    const cl=clienteById(r.cuenta_id);const clashes=clashMessages(r.fecha,r.hora,r.durMin||60,r.id);
    return h('li',{},
     h('span',{},cl?h('a',{class:'cell',href:'#/cliente/'+r.cuenta_id},cl.empresa):r.titulo,h('span',{class:'muted'},` · ${fdate(r.fecha)} ${r.hora} · ${r.durMin||60} min`),h('span',{class:'chip'},r.status),clashes.length?h('span',{class:'chip bad'},'Choque'):null),
     h('span',{class:'row'},
      h('button',{class:'sm',onclick:()=>download(`Reunion_${slug(cl?.empresa||r.titulo)}_${r.fecha}_${r.hora.replace(':','')}.ics`,icsEvent({uid:r.id,titulo:cl?.empresa||r.titulo,desc:'',fecha:r.fecha,hora:r.hora,durMin:r.durMin||60,status:r.status}))},'ICS',dlIcon()),
      h('button',{class:'sm danger',onclick:()=>{S.reunionesProg=reunionesProg().filter(x=>x.id!==r.id);saveState();drawProg();draw();}},'Quitar')));
  })):h('p',{class:'empty'},'Todavía no hay reuniones programadas desde las fichas.');
  progWrap.replaceChildren(h('h2',{},'Reuniones programadas desde fichas'),list);
 };
 const draw=()=>{
  const rows=D.agenda.filter(e=>(!AQ.tipo||e.tipo===AQ.tipo)&&(!AQ.prop||e.participantes.includes(AQ.prop))&&(!AQ.mes||e.fecha.slice(0,7)===AQ.mes)).sort((a,b)=>slotOf(a).localeCompare(slotOf(b)));
  const marc={};D.agenda.forEach(e=>{if(cur(e).slot||cur(e).status){const k=slotOf(e);marc[k]=(marc[k]||0)+1;}});
  reunionesProg().forEach(r=>{const k=`${r.fecha} ${r.hora}`;marc[k]=(marc[k]||0)+1;});
  const hechas=D.agenda.filter(e=>cur(e).hecha).length;
  stat.textContent=`${rows.length} en agenda base · ${reunionesProg().length} programadas · ${hechas} realizadas.`;
  wrap.replaceChildren(h('table',{},h('thead',{},h('tr',{},['Día','Reunión','Participan','Temas','Estado','Horario (descarga)','Realizada','Aviso'].map(t=>h('th',{},t)))),
  h('tbody',{},rows.map(e=>{const a=cur(e);const status=a.status||'Bloqueo';const ops=e.opciones.split('|');const chosen=a.slot;
   const clash=chosen&&marc[chosen]>1?'Choque con otra reunión en ese horario':(e.nota||'');
   const btns=h('div',{class:'opt',role:'group','aria-label':'Opciones de horario'},ops.map((o,i)=>h('button',{class:chosen===o?'on':'','aria-label':`Descargar ${fdate(o.split(' ')[0])} ${o.split(' ')[1]} como ${status}`,onclick:()=>{const s=st('agenda');s[e.id]={...(s[e.id]||{}),slot:o,status};saveState();download(`Reunion_${slug(e.titulo)}_${o.replace(' ','_').replace(':','')}.ics`,icsFor(e,o,status));toast(`Archivo descargado`);draw();}},ops.length>1?`Opción ${i+1} · ${o.split(' ')[1]}`:o.split(' ')[1],dlIcon())));
   return h('tr',{},h('td',{},fdate(e.fecha)),h('td',{},e.cuenta_id?h('a',{class:'cell',href:'#/cliente/'+e.cuenta_id},e.titulo):h('b',{},e.titulo),h('div',{class:'muted'},e.tipo)),h('td',{},e.participantes),h('td',{class:'temas'},e.temas||'—'),
    h('td',{},sel(['Bloqueo','Confirmado'],status,v=>{const s=st('agenda');s[e.id]={...(s[e.id]||{}),status:v};saveState();draw();},{label:'Estado'})),h('td',{},btns),
    h('td',{},h('input',{type:'checkbox','aria-label':'Realizada',checked:!!a.hecha,style:'width:auto;min-height:0',onchange:ev=>{const s=st('agenda');s[e.id]={...(s[e.id]||{}),hecha:ev.target.checked};saveState();draw();}})),h('td',{class:clash?'':'muted'},clash||'—'));}))));};
 const ps=[...new Set(D.agenda.flatMap(e=>e.participantes.split(' + ').flatMap(p=>p.split(', '))))].filter(x=>x&&x!=='Jorge Urbina').sort();
 const meses=[...new Set(D.agenda.map(e=>e.fecha.slice(0,7)))].sort();
 const set=k=>v=>{AQ[k]=v;draw();};
 drawProg();draw();
 return h('div',{class:'view'},h('header',{class:'page-head'},h('h1',{},'Agenda'),stat),progWrap,h('div',{class:'filters'},field('Tipo',sel(['Cuenta','Tecnología','Presupuesto'],AQ.tipo,set('tipo'),{any:'Todos'})),field('Participante',sel(ps,AQ.prop,set('prop'),{any:'Todos'})),field('Mes',sel(meses,AQ.mes,set('mes'),{any:'Todos'}))),wrap);}

function vCatalogo(){
 const Qc={clase:'',fam:'',tipo:'',q:''};
 const wrap=h('div',{class:'wrap glass'}),count=h('p',{class:'muted',role:'status'});
 const draw=()=>{
  const q=Qc.q.trim().toLowerCase();
  const rows=D.catalogo.filter(x=>(!Qc.clase||x.clase===Qc.clase)&&(!Qc.fam||x.familia===Qc.fam)&&(!Qc.tipo||x.tipo===Qc.tipo)&&(!q||[x.area,x.solucion,x.producto,x.nota,x.familia].join(' ').toLowerCase().includes(q)));
  count.textContent=`${rows.length} de ${D.catalogo.length} soluciones`;
  wrap.replaceChildren(rows.length?h('table',{},h('thead',{},h('tr',{},['Área','Solución','Clasificación','Producto o partner','Fuente','Cuándo ofrecerlo'].map(t=>h('th',{},t)))),
   h('tbody',{},rows.map(x=>h('tr',{},h('td',{},x.familia?h('div',{},h('b',{},x.familia),h('div',{class:'muted'},x.area)):x.area),h('td',{},h('b',{},x.solucion),x.tipo?h('div',{class:'muted'},x.tipo):null),h('td',{},h('span',{class:'chip '+chipClase(x.clase)},x.clase)),h('td',{},x.producto),h('td',{class:'muted'},x.fuente),h('td',{class:'muted'},x.nota||'—'))))):h('p',{class:'empty'},'Ninguna solución coincide con los filtros.'));};
 const set=k=>v=>{Qc[k]=v;draw();};
 const med=D.catalogo.filter(x=>x.clase==='A la medida');
 const fams=[...new Set(med.map(x=>x.familia))],tipos=[...new Set(med.map(x=>x.tipo))];
 draw();
 return h('div',{class:'view'},h('header',{class:'page-head'},h('h1',{},'Catálogo'),h('p',{class:'sub'},'Homologado Claro, partners, a la medida (Fortinet, HITSS, Scitum) y fuera de catálogo.')),
  h('div',{class:'filters'},field('Clasificación',sel(['Catálogo Claro','Partner','A la medida','Fuera de catálogo'],'',set('clase'),{any:'Todas'})),
   fams.length?field('Familia a la medida',sel(fams,'',set('fam'),{any:'Todas'})):null,
   tipos.length?field('Tipo',sel(tipos,'',set('tipo'),{any:'Todos'})):null,
   field('Buscar',h('input',{type:'search',placeholder:'Ej. FortiGate, SOC, licencia',oninput:e=>{Qc.q=e.target.value;draw();}}))),
  count,wrap);}

function vAjustes(){
 const backups=loadBackups();
 let nombre=who();
 const carteraCard=h('div',{class:'card glass'},
  h('h2',{},'Cartera activa'),
  h('div',{class:'status-card'},
   h('div',{class:'status-row'},h('span',{},'Modo'),h('span',{class:'live-pill'+(DEMO?'':' ok')},DEMO?'Demostración':'Datos reales')),
   h('div',{class:'status-row'},h('span',{},'Cuentas'),h('strong',{},nf.format(D.clientes.length))),
   h('div',{class:'status-row'},h('span',{},'Fuente'),h('span',{class:'muted'},D.meta?.fuente||'—')),
   h('div',{class:'status-row'},h('span',{},'Corte'),h('span',{class:'muted'},D.meta?.corte||'—'))),
  DEMO?h('p',{class:'muted',style:'margin:12px 0 0'},'Para ver facturación real de Claro, carga el JSON abajo. No se sube a GitHub.')
   :h('p',{class:'muted',style:'margin:12px 0 0'},'Esta cartera vive solo en tu navegador.'));
 return h('div',{class:'view'},
  h('header',{class:'page-head'},h('h1',{},'Ajustes'),h('p',{class:'sub'},'GitHub Pages no guarda datos en servidor. Todo queda en este navegador.')),
  h('div',{class:'grid cols'},
   carteraCard,
   h('div',{class:'card glass'},h('h2',{},'Tu nombre en este equipo'),h('p',{class:'muted'},'Se etiqueta en notas, ofertas, presencia y reuniones.'),
    field('Nombre',h('input',{value:nombre,placeholder:'Ej. Linda Guerra',oninput:e=>nombre=e.target.value})),
    h('button',{class:'primary',onclick:()=>{try{localStorage.setItem(LS_WHO,nombre.trim());toast('Nombre guardado');}catch{toast('No se pudo guardar');}}},'Guardar nombre')),
   h('div',{class:'card glass'},h('h2',{},'Cargar datos de cuentas'),h('p',{class:'muted'},'Archivo local con clientes, catálogo, playbook y agenda. Nunca al repositorio.'),
    dropzone(f=>readJsonFile(f,applyCartera)),
    h('p',{class:'row',style:'margin-top:12px'},h('button',{onclick:()=>{localStorage.removeItem(LS_DATA);location.reload();}},'Volver a demostración'))),
   h('div',{class:'card glass'},h('h2',{},'Respaldo de tu seguimiento'),h('p',{class:'muted'},'Tecnologías, ofertas, notas, estados, agenda, presencia y reuniones.'),
    h('p',{class:'row'},h('button',{class:'primary',onclick:()=>download('seguimiento-wallet.json',JSON.stringify(S,null,1),'application/json')},'Descargar respaldo'),
     h('label',{class:'btn'},'Importar respaldo',h('input',{type:'file',accept:'application/json,.json',hidden:true,onchange:e=>{const f=e.target.files[0];if(f)readJsonFile(f,j=>{S=j;saveState({backup:false});toast('Respaldo importado');route();});}}))),
    h('p',{},h('button',{class:'danger',onclick:()=>{if(!S._conf){S._conf=1;toast('Toca otra vez para borrar todo el seguimiento');setTimeout(()=>delete S._conf,3000);return;}S={};saveState({backup:false});toast('Seguimiento borrado');route();}},'Borrar seguimiento'))),
   h('div',{class:'card glass'},h('h2',{},`Versiones locales (máx. ${MAX_BACKUPS})`),h('p',{class:'muted'},'Cada guardado deja una copia en este navegador.'),
    backups.length?h('ul',{class:'list'},backups.map(b=>h('li',{},h('span',{},`${fdate(b.at.slice(0,10))} ${b.at.slice(11,16)}`,b.by?` · ${b.by}`:''),
     h('button',{class:'sm',onclick:()=>{S=b.state;saveState({backup:false});toast('Versión restaurada');route();}},'Restaurar')))):h('p',{class:'empty'},'Aún no hay versiones guardadas.'))));}

const routes={resumen:vResumen,cuentas:vCuentas,rubros:vRubros,agenda:vAgenda,catalogo:vCatalogo,ajustes:vAjustes};
function route(){
 const [path,qs]=location.hash.replace(/^#\/?/,'').split('?');const [r,arg]=path.split('/');
 if(qs){const p=new URLSearchParams(qs);for(const [k,v] of p)if(k in Q)Q[k]=v;history.replaceState(null,'','#/'+path);}
 let view,key=r||'resumen';
 if(r==='cliente'){view=vCliente(decodeURIComponent(arg));key='cuentas';}
 else if(r==='rubro'){view=vRubro(decodeURIComponent(arg));key='rubros';}
 else view=(routes[key]||vResumen)();
 const m=$('#main');m.replaceChildren(view);
 document.querySelectorAll('#nav a').forEach(a=>{if(a.dataset.r===key)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 document.title=(r==='cliente'&&arg?'Cuenta · ':'')+'Wallet Preventa Honduras';
}
async function init(){
 S=loadState();
 try{const raw=localStorage.getItem(LS_DATA);if(raw){D=JSON.parse(raw);DEMO=false;}}catch{}
 if(!D){try{D=await (await fetch('data/demo.json')).json();}catch{$('#main').textContent='No se pudo cargar los datos de demostración.';return;}}
 try{const med=await (await fetch('data/medida.json')).json();D.catalogo=D.catalogo.filter(x=>x.clase!=='A la medida').concat(med);}catch{}
 DEMO=!!(D.meta&&D.meta.demo);
 const b=$('#banner');
 if(DEMO){
  b.hidden=false;b.replaceChildren(
   h('span',{class:'banner-msg'},'Estás en datos de demostración (cuentas ficticias).'),
   h('a',{class:'btn brand',href:'#/ajustes'},'Cargar JSON real'));
 }else{b.hidden=true;b.replaceChildren();}
 window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);});route();
}
init();
