// Wallet Preventa Honduras. Sitio estático sin dependencias.
const LS_DATA='wallet.data.v1', LS_STATE='wallet.state.v1';
const ETAPAS=['Prospección','Diagnóstico','Propuesta','Negociación','Ganada','Perdida'];
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
let D=null,S=null,DEMO=true;
function loadState(){try{return JSON.parse(localStorage.getItem(LS_STATE))||{};}catch{return{};}}
function saveState(){try{localStorage.setItem(LS_STATE,JSON.stringify(S));}catch{toast('No se pudo guardar en este navegador');}}
function toast(t){let el=$('#toast');if(!el){el=h('div',{id:'toast',class:'toast',role:'status'});document.body.append(el);}
 el.textContent=t;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),2400);}
const st=(k)=>S[k]||(S[k]={});
const techs=id=>st('tech')[id]||[];const ofertas=id=>st('ofertas')[id]||[];const notas=id=>st('notas')[id]||[];
const estado=c=>(st('estados')[c.id])||c.estado;
const clienteById=id=>D.clientes.find(c=>c.id===id);
function textoCliente(c){return [...techs(c.id).map(t=>`${t.tema} ${t.proveedor||''}`),...ofertas(c.id).map(o=>o.solucion)].join(' | ');}
const tiene=(c,re)=>techs(c.id).some(t=>re.test(`${t.tema} ${t.proveedor||''}`));
const conOferta=(c,re)=>ofertas(c.id).some(o=>re.test(o.solucion));
function ultimaActividad(c){const ds=[...notas(c.id).map(n=>n.ts),...ofertas(c.id).map(o=>o.ts),...techs(c.id).map(t=>t.ts)].filter(Boolean).sort();return ds.length?new Date(ds[ds.length-1]):null;}
const abiertas=()=>D.clientes.flatMap(c=>ofertas(c.id).filter(o=>!['Ganada','Perdida'].includes(o.etapa)).map(o=>({...o,cid:c.id})));
const sum=(a,f)=>a.reduce((s,x)=>s+(Number(f(x))||0),0);
const chipTier=t=>({A:'ok',B:'',C:'',Validar:'warn',Pausa:'bad'}[t]??'');
const chipClase=c=>c==='Catálogo Claro'?'ok':c==='Partner'?'warn':c==='A la medida'?'info':'bad';

// ---------- componentes ----------
function bars(items,{href,color}={}){ // items: [{label,n,href?}]
 const mx=Math.max(1,...items.map(i=>i.n));
 if(!items.length)return h('p',{class:'empty'},'Sin datos todavía.');
 return h('div',{},items.map(i=>{const a=h(i.href?'a':'div',{class:'bar',href:i.href},h('span',{},i.label),h('div',{class:'t'},h('i',{style:`width:${100*i.n/mx}%;--bc:${i.color||color||'var(--muted)'}`})),h('span',{class:'n'},i.text??nf.format(i.n)));return a;}));}
const kpi=(v,l)=>h('div',{class:'card kpi'},h('b',{},v),h('span',{},l));
function sel(opts,val,onchange,{label,id,any}={}){const s=h('select',{id,'aria-label':label||''},any!=null?h('option',{value:''},any):null,opts.map(o=>{const [v,t]=Array.isArray(o)?o:[o,o];return h('option',{value:v,selected:String(v)===String(val)},t);}));s.value=val??'';if(onchange)s.addEventListener('change',()=>onchange(s.value));return s;}
const field=(label,ctrl)=>h('label',{class:'f'},label,ctrl);
const dlIcon=()=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 16 16');s.setAttribute('class','i');s.setAttribute('aria-hidden','true');s.innerHTML='<path d="M8 2v8m0 0L5 7m3 3 3-3M3 13h10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';return s;};

// ---------- ICS ----------
const icsEsc=s=>String(s).replace(/\\/g,'\\\\').replace(/;/g,'\;').replace(/,/g,'\\,').replace(/\r?\n/g,'\\n');
function icsFor(e,slot,status){
 const [f,t]=slot.split(' ');const [y,m,d]=f.split('-');const [H,M]=t.split(':').map(Number);
 const st=`${y}${m}${d}T${String(H).padStart(2,'0')}${String(M).padStart(2,'0')}00`,en=`${y}${m}${d}T${String(H+1).padStart(2,'0')}${String(M).padStart(2,'0')}00`;
 const bl=status==='Bloqueo';
 const desc=`Participan: ${e.participantes}\n${e.objetivo}`+(e.temas?`\nTemas: ${e.temas}`:'')+(e.nota?`\nNota: ${e.nota}`:'')+(bl?'\nBloqueo propuesto: confirmar con el cliente.':'');
 return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Wallet Preventa//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VTIMEZONE','TZID:America/Tegucigalpa','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:-0600','TZOFFSETTO:-0600','TZNAME:CST','END:STANDARD','END:VTIMEZONE',
 'BEGIN:VEVENT',`UID:${e.id}-${f}-${t.replace(':','')}@wallet-preventa`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').slice(0,15)}Z`,`DTSTART;TZID=America/Tegucigalpa:${st}`,`DTEND;TZID=America/Tegucigalpa:${en}`,
 'SUMMARY:'+icsEsc((bl?'[Bloqueo] ':'')+e.titulo),'DESCRIPTION:'+icsEsc(desc),'STATUS:'+(bl?'TENTATIVE':'CONFIRMED'),'TRANSP:OPAQUE','X-MICROSOFT-CDO-BUSYSTATUS:'+(bl?'TENTATIVE':'BUSY'),'END:VEVENT','END:VCALENDAR'].join('\r\n')+'\r\n';}
function download(name,text,type='text/calendar'){const b=new Blob([text],{type:type+';charset=utf-8'});const u=URL.createObjectURL(b);const a=h('a',{href:u,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2000);}
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]+/g,'_').replace(/^_|_$/g,'').slice(0,40);

// ---------- vistas ----------
const Q={q:'',prop:'',rubro:'',ola:'',tier:'',vent:'',estado:''};
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
 const prox=D.agenda.filter(e=>e.tipo==='Cuenta').map(e=>({e,slot:(st('agenda')[e.id]||{}).slot||`${e.fecha} ${e.hora}`})).sort((a,b)=>a.slot.localeCompare(b.slot));
 const hoy=now.toISOString().slice(0,10);let nx=prox.filter(x=>x.slot>=hoy).slice(0,6);const futuro=nx.length>0;if(!nx.length)nx=prox.slice(0,6);
 return h('div',{},h('h1',{},'Resumen'),h('p',{class:'sub'},`${C.length} cuentas. Corte de datos: ${D.meta.corte}. Fuente: ${D.meta.fuente}.`),
 h('div',{class:'grid kpis'},kpi(nf.format(C.length),'Cuentas'),kpi(nf.format(sum(C,c=>c.fact)),'Facturación (L)'),kpi(nf.format(sum(ab,o=>o.monto)),'Pipeline abierto'),kpi(nf.format(sum(ab,o=>o.monto*o.prob/100)),'Pipeline ponderado'),kpi(`${contact}/${C.length}`,'Cuentas contactadas'),kpi(`${hechas}/${ag.length}`,'Reuniones realizadas'),kpi(nf.format(venc),'Vencido o vence en 3 meses'),kpi(nf.format(sinAct),'Sin actividad en 30 días'),kpi(nf.format(fuera),'Ofertas fuera de catálogo')),
 h('div',{class:'grid cols'},h('div',{class:'card'},h('h2',{},'Por ola de ataque'),bars(olas)),h('div',{class:'card'},h('h2',{},'Por rubro'),bars(rub)),h('div',{class:'card'},h('h2',{},'Pipeline por etapa (monto)'),bars(etapas,{color:'var(--accent)'})),h('div',{class:'card'},h('h2',{},'Cuentas con oferta por ola (%)'),bars(conv,{color:'var(--ok)'}))),
 h('div',{class:'card'},h('h2',{},futuro?'Próximas reuniones con cuentas':'Primeras reuniones de la agenda'),
  h('ul',{class:'list'},nx.map(x=>h('li',{},h('span',{},x.e.cuenta_id?h('a',{class:'cell',href:'#/cliente/'+x.e.cuenta_id},x.e.titulo):x.e.titulo),h('span',{class:'muted'},fdate(x.slot.split(' ')[0])+' · '+x.slot.split(' ')[1]))))));
}

function filtroCuentas(){return D.clientes.filter(c=>(!Q.q||c.empresa.toLowerCase().includes(Q.q.toLowerCase()))&&(!Q.prop||c.propone===Q.prop)&&(!Q.rubro||c.rubro===Q.rubro)&&(!Q.ola||c.ola===Q.ola)&&(!Q.tier||c.tier===Q.tier)&&(!Q.vent||c.ventana===Q.vent)&&(!Q.estado||estado(c)===Q.estado));}
function vCuentas(){
 const u=(k)=>[...new Set(D.clientes.map(c=>c[k]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
 const out=h('div',{class:'wrap'});const cnt=h('p',{class:'sub'});
 const draw=()=>{const r=filtroCuentas().sort((a,b)=>(b.score??-1)-(a.score??-1));cnt.textContent=`${r.length} de ${D.clientes.length} cuentas. Toca una fila para abrir la ficha.`;
  out.replaceChildren(h('table',{},h('thead',{},h('tr',{},['Ola','Empresa','Rubro','Tier','Score','Vencimiento','Facturación (L)','Ejecutivo','Estado','Ofertas'].map((t,i)=>h('th',{class:[4,6,9].includes(i)?'num':''},t)))),
  h('tbody',{},r.map(c=>h('tr',{class:'link',onclick:()=>{location.hash='#/cliente/'+c.id;}},h('td',{},c.ola),h('td',{},h('a',{class:'cell',href:'#/cliente/'+c.id,onclick:e=>e.stopPropagation()},c.empresa)),h('td',{},c.rubro),h('td',{},h('span',{class:'chip '+chipTier(c.tier)},c.tier)),h('td',{class:'num'},c.score??'n/d'),h('td',{},c.ventana),h('td',{class:'num'},c.fact==null?'—':nf.format(c.fact)),h('td',{},c.propone),h('td',{},estado(c)),h('td',{class:'num'},ofertas(c.id).length||'—'))))));};
 const set=(k)=>(v)=>{Q[k]=v;draw();};
 const fl=h('div',{class:'filters'},
  field('Buscar',h('input',{type:'search',placeholder:'Nombre de la empresa',value:Q.q,oninput:e=>{Q.q=e.target.value;draw();}})),
  field('Ejecutivo',sel(u('propone'),Q.prop,set('prop'),{any:'Todos'})),field('Rubro',sel(u('rubro'),Q.rubro,set('rubro'),{any:'Todos'})),
  field('Ola',sel(['Ola 1','Ola 2','Ola 3','En pipeline','Validar','Pausa'],Q.ola,set('ola'),{any:'Todas'})),field('Tier',sel(['A','B','C','Validar','Pausa'],Q.tier,set('tier'),{any:'Todos'})),
  field('Vencimiento',sel(['Vencido','Este mes','1-3 meses','4-6 meses','7-12 meses','Más de 12 meses','Sin dato'],Q.vent,set('vent'),{any:'Todos'})),
  field('Estado',sel(['Por validar','Por contactar','En pipeline (Jorge)','Contactado','Diagnóstico','Propuesta','Negociación','Ganada','Perdida','En pausa'],Q.estado,set('estado'),{any:'Todos'})),
  h('div',{},h('button',{onclick:()=>{Object.keys(Q).forEach(k=>Q[k]='');route();}},'Limpiar filtros')));
 draw();return h('div',{},h('h1',{},'Cuentas'),cnt,fl,out);}

function vCliente(id){
 const c=clienteById(id);if(!c)return h('p',{class:'empty'},'No se encontró la cuenta.');
 const back=h('a',{class:'back',href:'#/cuentas'},'← Cuentas');
 const rerender=()=>route();
 const add=(coll,item)=>{(st(coll)[id]=st(coll)[id]||[]).unshift({...item,id:uid(),ts:new Date().toISOString()});saveState();rerender();};
 const del=(coll,iid)=>{st(coll)[id]=(st(coll)[id]||[]).filter(x=>x.id!==iid);saveState();rerender();};
 const catNames=D.catalogo.map(x=>[x.solucion,`${x.solucion} (${x.clase})`]);
 // tecnologías
 const tf={tema:'',prov:'',vence:''};
 const techForm=h('div',{class:'form'},field('Tecnología',sel(catNames.concat([['Otra','Otra (escribir en proveedor)']]),'',v=>tf.tema=v,{any:'Elegir',label:'Tecnología'})),field('Proveedor o detalle',h('input',{oninput:e=>tf.prov=e.target.value})),field('Renovación',h('input',{type:'date',oninput:e=>tf.vence=e.target.value})),h('button',{class:'primary',onclick:()=>{if(!tf.tema)return toast('Elige una tecnología');add('tech',{tema:tf.tema,proveedor:tf.prov,vence:tf.vence});}},'Agregar'));
 const techList=techs(id).length?h('ul',{class:'list'},techs(id).map(t=>h('li',{},h('span',{},h('b',{},t.tema),t.proveedor?` · ${t.proveedor}`:'',t.vence?h('span',{class:'muted'},` · renueva ${fdate(t.vence)}`):''),h('button',{class:'sm danger',onclick:()=>del('tech',t.id),'aria-label':'Quitar tecnología'},'Quitar')))):h('p',{class:'empty'},'Aún no registras tecnologías de este cliente.');
 // brechas
 const temas=(c.temas||'').split('; ').filter(Boolean);
 const brechas=h('ul',{class:'list'},temas.map(t=>{const key=KEYS.find(k=>k.re.test(t));const tag=(t.match(/\[(.+?)\]/)||[])[1]||'';const ya=key&&(tiene(c,key.re));const of=key&&conOferta(c,key.re);
  return h('li',{},h('span',{},t.replace(/\s*\[.+?\]/g,'')),h('span',{class:'row'},tag?h('span',{class:'chip'},tag):null,h('span',{class:'chip '+(ya?'ok':of?'warn':'bad')},ya?'Ya lo tiene':of?'Con oferta':'Brecha')));}));
 // ofertas
 const of={sol:'',monto:'',prob:'25',etapa:'Prospección',cierre:'',nota:''};
 const ofForm=h('div',{class:'form'},field('Solución',sel(catNames,'',v=>of.sol=v,{any:'Elegir',label:'Solución'})),field('Monto (L)',h('input',{type:'number',min:'0',inputmode:'numeric',oninput:e=>of.monto=e.target.value})),field('Probabilidad',sel([['10','10%'],['25','25%'],['50','50%'],['75','75%'],['90','90%']],'25',v=>of.prob=v)),field('Etapa',sel(ETAPAS,'Prospección',v=>of.etapa=v)),field('Cierre',h('input',{type:'date',oninput:e=>of.cierre=e.target.value})),field('Nota',h('input',{oninput:e=>of.nota=e.target.value})),
  h('button',{class:'primary',onclick:()=>{if(!of.sol)return toast('Elige una solución');const cl=D.catalogo.find(x=>x.solucion===of.sol);add('ofertas',{solucion:of.sol,clase:cl?cl.clase:'',monto:Number(of.monto)||0,prob:Number(of.prob),etapa:of.etapa,cierre:of.cierre,nota:of.nota});}},'Agregar oferta'));
 const ofList=ofertas(id).length?h('div',{class:'wrap'},h('table',{},h('thead',{},h('tr',{},['Solución','Clasificación','Monto (L)','Prob.','Etapa','Cierre',''].map((t,i)=>h('th',{class:[2,3].includes(i)?'num':''},t)))),h('tbody',{},ofertas(id).map(o=>h('tr',{},h('td',{},o.solucion,o.nota?h('div',{class:'muted'},o.nota):null),h('td',{},h('span',{class:'chip '+chipClase(o.clase)},o.clase||'—')),h('td',{class:'num'},nf.format(o.monto)),h('td',{class:'num'},o.prob+'%'),h('td',{},sel(ETAPAS,o.etapa,v=>{o.etapa=v;o.ts=new Date().toISOString();saveState();rerender();},{label:'Etapa'})),h('td',{},o.cierre?fdate(o.cierre):'—'),h('td',{},h('button',{class:'sm danger',onclick:()=>del('ofertas',o.id)},'Quitar'))))))):h('p',{class:'empty'},'Sin ofertas registradas.');
 // notas
 let nt='';
 const notaForm=h('div',{class:'form'},h('textarea',{'aria-label':'Nota',placeholder:'Qué se habló, qué sigue',oninput:e=>nt=e.target.value}),h('button',{class:'primary',onclick:()=>{if(!nt.trim())return toast('Escribe la nota');add('notas',{texto:nt.trim(),fecha:new Date().toISOString().slice(0,10)});}},'Guardar nota'));
 const notaList=notas(id).length?h('ul',{class:'list'},notas(id).map(n=>h('li',{},h('span',{},n.texto),h('span',{class:'row'},h('span',{class:'muted'},fdate(n.fecha)),h('button',{class:'sm danger',onclick:()=>del('notas',n.id)},'Quitar'))))):h('p',{class:'empty'},'Sin notas todavía.');
 const evs=D.agenda.filter(e=>e.cuenta_id===id);
 return h('div',{},back,h('h1',{},c.empresa),h('p',{class:'sub'},`${c.rubro} · ${c.ola} · Tier ${c.tier} · Score ${c.score??'n/d'}`),
  h('div',{class:'grid cols'},
   h('div',{class:'card'},h('h2',{},'Ficha'),h('div',{class:'dl'},
     h('p',{},h('span',{class:'muted'},'Ejecutivo que la propone'),h('br'),c.propone),h('p',{},h('span',{class:'muted'},'Dueño en Claro'),h('br'),c.dueno||'Sin dato',c.edueno?` (${c.edueno})`:''),
     h('p',{},h('span',{class:'muted'},'Segmento'),h('br'),c.segmento||'—'),h('p',{},h('span',{class:'muted'},'Facturación (L)'),h('br'),c.fact==null?'—':nf.format(c.fact)),
     h('p',{},h('span',{class:'muted'},'Líneas'),h('br'),c.lineas??'—'),h('p',{},h('span',{class:'muted'},'Vencimiento móvil'),h('br'),c.ventana),
     h('p',{},h('span',{class:'muted'},'En Salesforce'),h('br'),c.sf||'—'),h('p',{},h('span',{class:'muted'},'Califica proyecto grande'),h('br'),c.grande||'—')),
     c.alerta?h('p',{},h('span',{class:'chip bad'},c.alerta)):null,
     h('div',{class:'form'},field('Estado de gestión',sel(['Por validar','Por contactar','En pipeline (Jorge)','Contactado','Diagnóstico','Propuesta','Negociación','Ganada','Perdida','En pausa'],estado(c),v=>{st('estados')[id]=v;saveState();toast('Estado guardado');})))),
   h('div',{class:'card'},h('h2',{},'Cómo atacarla'),h('div',{class:'dl'},
     h('p',{},h('h3',{},'Ángulo'),c.angulo),h('p',{},h('h3',{},'Solución ancla'),c.ancla),h('p',{},h('h3',{},'Disparador'),c.disparador),h('p',{},h('h3',{},'Apertura'),c.apertura),
     h('p',{},h('h3',{},'Preguntas de descubrimiento'),c.discovery),h('p',{},h('h3',{},'Objeción probable'),c.objecion),h('p',{},h('h3',{},'Primer paso'),c.prueba),h('p',{},h('h3',{},'Siguiente paso'),c.siguiente)))),
  h('div',{class:'grid cols'},
   h('div',{class:'card'},h('h2',{},'Tecnologías que tiene el cliente'),techList,techForm),
   h('div',{class:'card'},h('h2',{},'Temas a evaluar frente al catálogo'),brechas)),
  h('div',{class:'card',style:'margin-bottom:16px'},h('h2',{},'Ofertas'),ofList,ofForm),
  h('div',{class:'grid cols'},h('div',{class:'card'},h('h2',{},'Historial y notas'),notaList,notaForm),
   h('div',{class:'card'},h('h2',{},'Reuniones en la agenda'),evs.length?h('ul',{class:'list'},evs.map(e=>{const a=st('agenda')[e.id]||{};return h('li',{},h('span',{},fdate((a.slot||`${e.fecha} ${e.hora}`).split(' ')[0])+' · '+(a.slot||`${e.fecha} ${e.hora}`).split(' ')[1]),h('span',{class:'chip'},a.status||'Sin elegir'));})):h('p',{class:'empty'},'Esta cuenta no tiene reunión en la agenda.'),h('p',{},h('a',{class:'cell',href:'#/agenda'},'Ir a la agenda')))));
}

function vRubros(){
 const rs=[...new Set(D.clientes.map(c=>c.rubro))];
 const items=rs.map(r=>{const cs=D.clientes.filter(c=>c.rubro===r);return {label:r,n:cs.length,href:'#/rubro/'+encodeURIComponent(r),text:`${cs.length} · L ${nf.format(sum(cs,c=>c.fact))}`};}).sort((a,b)=>b.n-a.n);
 return h('div',{},h('h1',{},'Rubros'),h('p',{class:'sub'},'Cuentas y facturación por rubro. Abre uno para ver penetración por solución y espacio libre.'),h('div',{class:'card'},bars(items,{color:'var(--accent)'})));}
function vRubro(name){
 const cs=D.clientes.filter(c=>c.rubro===name);if(!cs.length)return h('p',{class:'empty'},'Rubro sin cuentas.');
 const pb=D.playbook.find(p=>p.perfil===name)||D.playbook.find(p=>cs.some(c=>c.perfil===p.perfil));
 const ab=cs.flatMap(c=>ofertas(c.id).filter(o=>!['Ganada','Perdida'].includes(o.etapa)));
 const pen=KEYS.map(k=>{const t=cs.filter(c=>tiene(c,k.re)).length,o=cs.filter(c=>!tiene(c,k.re)&&conOferta(c,k.re)).length;return {k:k.k,t,o,libre:cs.length-t-o};}).filter(x=>x.t||x.o);
 const rec=KEYS.map(k=>({k:k.k,n:cs.filter(c=>(c.temas||'').split('; ').some(t=>k.re.test(t))).length})).filter(x=>x.n).sort((a,b)=>b.n-a.n);
 return h('div',{},h('a',{class:'back',href:'#/rubros'},'← Rubros'),h('h1',{},name),h('p',{class:'sub'},`${cs.length} cuentas · Facturación L ${nf.format(sum(cs,c=>c.fact))} · Pipeline abierto L ${nf.format(sum(ab,o=>o.monto))}`),
 h('div',{class:'grid cols'},
  h('div',{class:'card'},h('h2',{},'Soluciones sugeridas para este rubro (cuentas con el tema)'),bars(rec.map(x=>({label:x.k,n:x.n})),{color:'var(--accent)'})),
  h('div',{class:'card'},h('h2',{},'Penetración registrada'),pen.length?h('ul',{class:'list'},pen.map(p=>h('li',{},h('span',{},p.k),h('span',{class:'muted'},`${p.t} la tienen · ${p.o} con oferta · ${p.libre} libres`)))):h('p',{class:'empty'},'Aún no hay tecnologías ni ofertas registradas en este rubro. Se llenan en la ficha de cada cuenta.'))),
 pb?h('div',{class:'card',style:'margin-bottom:16px'},h('h2',{},'Playbook'),h('div',{class:'dl'},h('p',{},h('h3',{},'Ángulo'),pb.angulo),h('p',{},h('h3',{},'Descubrimiento'),pb.discovery),h('p',{},h('h3',{},'Objeción'),pb.objecion),h('p',{},h('h3',{},'Primer paso'),pb.prueba))):null,
 h('div',{class:'wrap'},h('table',{},h('thead',{},h('tr',{},['Empresa','Ola','Tier','Facturación (L)','Ofertas'].map((t,i)=>h('th',{class:i>2?'num':''},t)))),h('tbody',{},cs.sort((a,b)=>(b.score??-1)-(a.score??-1)).map(c=>h('tr',{class:'link',onclick:()=>{location.hash='#/cliente/'+c.id;}},h('td',{},h('a',{class:'cell',href:'#/cliente/'+c.id},c.empresa)),h('td',{},c.ola),h('td',{},c.tier),h('td',{class:'num'},c.fact==null?'—':nf.format(c.fact)),h('td',{class:'num'},ofertas(c.id).length||'—')))))));
}

const AQ={tipo:'',prop:'',mes:''};
function vAgenda(){
 const A=st('agenda');const cur=e=>A[e.id]||{};const slotOf=e=>cur(e).slot||`${e.fecha} ${e.hora}`;
 const wrap=h('div',{class:'wrap'}),stat=h('p',{class:'sub'});
 const draw=()=>{
  const rows=D.agenda.filter(e=>(!AQ.tipo||e.tipo===AQ.tipo)&&(!AQ.prop||e.participantes.includes(AQ.prop))&&(!AQ.mes||e.fecha.slice(0,7)===AQ.mes)).sort((a,b)=>slotOf(a).localeCompare(slotOf(b)));
  const marc={};D.agenda.forEach(e=>{if(cur(e).slot||cur(e).status){const k=slotOf(e);marc[k]=(marc[k]||0)+1;}});
  const hechas=D.agenda.filter(e=>cur(e).hecha).length;
  stat.textContent=`${rows.length} reuniones visibles · ${D.agenda.filter(e=>cur(e).slot).length} con horario elegido · ${hechas} realizadas. Cada botón de hora descarga el archivo de calendario (.ics) con el estado que tengas elegido.`;
  wrap.replaceChildren(h('table',{},h('thead',{},h('tr',{},['Día','Reunión','Participan','Temas','Estado','Horario (descarga)','Realizada','Aviso'].map(t=>h('th',{},t)))),
  h('tbody',{},rows.map(e=>{const a=cur(e);const status=a.status||'Bloqueo';const ops=e.opciones.split('|');const chosen=a.slot;
   const clash=chosen&&marc[chosen]>1?'Choque con otra reunión elegida en ese horario':(e.nota||'');
   const btns=h('div',{class:'opt',role:'group','aria-label':'Opciones de horario'},ops.map((o,i)=>h('button',{class:chosen===o?'on':'','aria-label':`Descargar ${fdate(o.split(' ')[0])} ${o.split(' ')[1]} como ${status}`,onclick:()=>{const s=st('agenda');s[e.id]={...(s[e.id]||{}),slot:o,status};saveState();download(`Reunion_${slug(e.titulo)}_${o.replace(' ','_').replace(':','')}.ics`,icsFor(e,o,status));toast(`Archivo ${status==='Bloqueo'?'de bloqueo':'confirmado'} descargado: ${fdate(o.split(' ')[0])} ${o.split(' ')[1]}`);draw();}},ops.length>1?`Opción ${i+1} · ${o.split(' ')[1]}`:o.split(' ')[1],dlIcon())));
   return h('tr',{},h('td',{},fdate(e.fecha)),h('td',{},e.cuenta_id?h('a',{class:'cell',href:'#/cliente/'+e.cuenta_id},e.titulo):h('b',{},e.titulo),h('div',{class:'muted'},e.tipo)),h('td',{},e.participantes),h('td',{class:'temas'},e.temas||'—'),
    h('td',{},sel(['Bloqueo','Confirmado'],status,v=>{const s=st('agenda');s[e.id]={...(s[e.id]||{}),status:v};saveState();draw();},{label:'Estado'})),h('td',{},btns),
    h('td',{},h('input',{type:'checkbox','aria-label':'Realizada',checked:!!a.hecha,style:'width:auto;min-height:0',onchange:ev=>{const s=st('agenda');s[e.id]={...(s[e.id]||{}),hecha:ev.target.checked};saveState();draw();}})),h('td',{class:clash?'':'muted'},clash||'—'));}))));};
 const ps=[...new Set(D.agenda.flatMap(e=>e.participantes.split(' + ').flatMap(p=>p.split(', '))))].filter(x=>x&&x!=='Jorge Urbina').sort();
 const meses=[...new Set(D.agenda.map(e=>e.fecha.slice(0,7)))].sort();
 const set=k=>v=>{AQ[k]=v;draw();};
 draw();
 return h('div',{},h('h1',{},'Agenda'),stat,h('div',{class:'filters'},field('Tipo',sel(['Cuenta','Tecnología','Presupuesto'],AQ.tipo,set('tipo'),{any:'Todos'})),field('Participante',sel(ps,AQ.prop,set('prop'),{any:'Todos'})),field('Mes',sel(meses,AQ.mes,set('mes'),{any:'Todos'}))),wrap);}

function vCatalogo(){
 const Qc={clase:'',fam:'',tipo:'',q:''};
 const wrap=h('div',{class:'wrap'}),count=h('p',{class:'muted',role:'status'});
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
 return h('div',{},h('h1',{},'Catálogo'),h('p',{class:'sub'},'Qué es homologado por Claro, qué viene de partners, qué es a la medida (Fortinet, HITSS y Scitum) y qué queda fuera de catálogo.'),
  h('div',{class:'filters'},field('Clasificación',sel(['Catálogo Claro','Partner','A la medida','Fuera de catálogo'],'',set('clase'),{any:'Todas'})),
   fams.length?field('Familia a la medida',sel(fams,'',set('fam'),{any:'Todas'})):null,
   tipos.length?field('Tipo',sel(tipos,'',set('tipo'),{any:'Todos'})):null,
   field('Buscar',h('input',{type:'search',placeholder:'Ej. FortiGate, SOC, licencia',oninput:e=>{Qc.q=e.target.value;draw();}}))),
  count,wrap);}

function vAjustes(){
 const readFile=(file,cb)=>{const r=new FileReader();r.onload=()=>{try{cb(JSON.parse(r.result));}catch{toast('El archivo no es un JSON válido');}};r.readAsText(file);};
 return h('div',{},h('h1',{},'Ajustes'),h('p',{class:'sub'},'Los datos y tus cambios se guardan solo en este navegador. Nada se envía a ningún servidor.'),
 h('div',{class:'grid cols'},
  h('div',{class:'card'},h('h2',{},'Cargar datos de cuentas'),h('p',{class:'muted'},'Archivo JSON con clientes, catálogo, playbook y agenda. No lo subas al repositorio: contiene facturación de Claro.'),
   h('input',{type:'file',accept:'application/json,.json','aria-label':'Archivo de datos',onchange:e=>{const f=e.target.files[0];if(f)readFile(f,j=>{if(!Array.isArray(j.clientes)||!Array.isArray(j.agenda)||!Array.isArray(j.catalogo))return toast('Faltan clientes, catálogo o agenda');try{localStorage.setItem(LS_DATA,JSON.stringify(j));}catch{return toast('El archivo es muy grande para este navegador');}toast('Datos cargados');setTimeout(()=>location.reload(),600);});}}),
   h('p',{},h('button',{onclick:()=>{localStorage.removeItem(LS_DATA);location.reload();}},'Volver a los datos de demostración'))),
  h('div',{class:'card'},h('h2',{},'Respaldo de tu seguimiento'),h('p',{class:'muted'},'Tecnologías, ofertas, notas, estados y agenda. Descárgalo para pasarlo a otra persona o a otro equipo.'),
   h('p',{class:'row'},h('button',{class:'primary',onclick:()=>download('seguimiento-wallet.json',JSON.stringify(S,null,1),'application/json')},'Descargar respaldo'),
    h('label',{class:'btn'},'Importar respaldo',h('input',{type:'file',accept:'application/json,.json',hidden:true,onchange:e=>{const f=e.target.files[0];if(f)readFile(f,j=>{S=j;saveState();toast('Respaldo importado');route();});}}))),
   h('p',{},h('button',{class:'danger',onclick:()=>{if(!S._conf){S._conf=1;toast('Toca otra vez para borrar todo el seguimiento');setTimeout(()=>delete S._conf,3000);return;}S={};saveState();toast('Seguimiento borrado');route();}},'Borrar seguimiento')))));}

// ---------- router ----------
const routes={resumen:vResumen,cuentas:vCuentas,rubros:vRubros,agenda:vAgenda,catalogo:vCatalogo,ajustes:vAjustes};
function route(){
 const [path,qs]=location.hash.replace(/^#\/?/,'').split('?');const [r,arg]=path.split('/');
 if(qs){const p=new URLSearchParams(qs);for(const [k,v] of p)if(k in Q)Q[k]=v;history.replaceState(null,'','#/'+path);}
 let view,key=r||'resumen';
 if(r==='cliente'){view=vCliente(decodeURIComponent(arg));key='cuentas';}
 else if(r==='rubro'){view=vRubro(decodeURIComponent(arg));key='rubros';}
 else view=(routes[key]||vResumen)();
 const m=$('#main');m.replaceChildren(view);
 document.querySelectorAll('#nav a').forEach(a=>a.toggleAttribute('aria-current',a.dataset.r===key)||a.removeAttribute('aria-current'));
 document.querySelectorAll('#nav a').forEach(a=>{if(a.dataset.r===key)a.setAttribute('aria-current','page');});
 document.title=(r==='cliente'&&arg?'Cuenta · ':'')+'Wallet Preventa Honduras';
}
async function init(){
 S=loadState();
 try{const raw=localStorage.getItem(LS_DATA);if(raw){D=JSON.parse(raw);DEMO=false;}}catch{}
 if(!D){try{D=await (await fetch('data/demo.json')).json();}catch{$('#main').textContent='No se pudo cargar los datos de demostración.';return;}}
 try{const med=await (await fetch('data/medida.json')).json();D.catalogo=D.catalogo.filter(x=>x.clase!=='A la medida').concat(med);}catch{}
 DEMO=!!(D.meta&&D.meta.demo);
 const b=$('#banner');if(DEMO){b.hidden=false;b.textContent='Estás viendo datos de demostración con cuentas ficticias. Carga tus datos en Ajustes.';}
 window.addEventListener('hashchange',()=>{route();window.scrollTo(0,0);});route();
}
init();
