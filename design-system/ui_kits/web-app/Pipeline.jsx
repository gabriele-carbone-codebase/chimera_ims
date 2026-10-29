(()=>{
const {Card,Button,Tabs,Avatar,IconButton,Icon,Badge}=window.DS;
function IdeaCard({i,stage,onMove}){const [h,setH]=React.useState(false);
  return <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{background:'var(--surface-card)',border:'1px solid var(--border-subtle)',borderRadius:6,padding:12,boxShadow:h?'var(--shadow-2)':'var(--shadow-1)',transition:'box-shadow var(--dur-base)'}}>
  <div style={{fontWeight:500,fontSize:14,lineHeight:'19px'}}>{i.t}</div>
  <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12}}><Avatar name={i.a} size={20}/><span style={{fontSize:12,color:'var(--text-tertiary)',flex:1}}>{i.a.split(' ')[0]}</span><span style={{display:'inline-flex',alignItems:'center',gap:3,fontSize:12,color:'var(--text-secondary)',fontFamily:'var(--font-mono)'}}><Icon name="thumbs-up" size={12}/>{i.v}</span>{stage!=='scale'&&h&&<IconButton icon="arrow-right" label="Avanza fase" size="sm" onClick={onMove}/>}</div></div>}
function Pipeline({lang}){const D=window.IMIS_DATA;const [ideas,setIdeas]=React.useState(D.ideas);
  const move=(sid,idx)=>{const order=D.stages.map(s=>s.id);const nx=order[order.indexOf(sid)+1];setIdeas(o=>{const n={...o};const it=n[sid][idx];n[sid]=n[sid].filter((_,k)=>k!==idx);n[nx]=[it,...n[nx]];return n})};
  return <div><PageHead eyebrow="Funnel di innovazione" title={lang==='en'?'Idea pipeline':'Pipeline delle idee'} sub="Ogni idea passa da cinque fasi con criteri di uscita espliciti. Passa il cursore su una scheda per farla avanzare." right={<Tabs variant="segmented" tabs={['Kanban','Tabella']}/>}/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(5,minmax(200px,1fr))',gap:12,alignItems:'start'}}>{D.stages.map(s=><section key={s.id} style={{background:'var(--surface-sunken)',borderRadius:6,padding:10,minHeight:420}}>
    <header style={{display:'flex',alignItems:'center',gap:8,padding:'2px 4px 10px'}}><span style={{width:8,height:8,borderRadius:2,background:s.c}}/><span style={{fontWeight:600,fontSize:13}}>{s[lang]}</span><span style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-tertiary)'}}>{ideas[s.id].length}</span><span style={{flex:1}}/><IconButton icon="plus" label="Aggiungi" size="sm"/></header>
    <div style={{display:'flex',flexDirection:'column',gap:8}}>{ideas[s.id].map((i,k)=><IdeaCard key={i.t} i={i} stage={s.id} onMove={()=>move(s.id,k)}/>)}</div></section>)}</div></div>;
}
window.Pipeline=Pipeline;
})();
