(()=>{
const {Card,Button,Tabs,Badge,Progress,AvatarGroup,Avatar,Checkbox,Icon,Tag,Tooltip}=window.DS;
function ProjectDetail({p}){const D=window.IMIS_DATA;const [tab,setTab]=React.useState('ov');const [tone,lab]=HEALTH[p.health];const order=D.stages.map(s=>s.id);const cur=order.indexOf(p.stage);
  return <div><PageHead eyebrow={p.id+' · '+p.area} title={p.title} sub={p.desc} right={<><Button variant="secondary" icon="share-2">Condividi</Button><Button icon="flag">Richiedi revisione</Button></>}/>
  <div style={{display:'flex',gap:0,marginBottom:20}}>{D.stages.map((s,i)=><div key={s.id} style={{flex:1,display:'flex',flexDirection:'column',gap:6}}><div style={{height:4,background:i<=cur?s.c:'var(--border-subtle)',marginRight:2,borderRadius:2}}/><span style={{fontSize:12,color:i===cur?'var(--text-primary)':'var(--text-tertiary)',fontWeight:i===cur?600:400}}>{s.it}</span></div>)}</div>
  <Tabs value={tab} onChange={setTab} tabs={[{value:'ov',label:'Panoramica'},{value:'tk',label:'Attività',count:8},{value:'dc',label:'Documenti',count:4},{value:'fn',label:'Finanziamenti'}]} style={{marginBottom:20}}/>
  <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)',gap:16}}>
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <Card title="Criteri di uscita — Pilota" eyebrow="Gate review"><div style={{display:'flex',flexDirection:'column',gap:10}}>{[['KPI tecnico validato su 3 mesi di dati',true],['Business case approvato dal CFO',true],['Piano di scala con fornitore selezionato',false],['Valutazione rischi GDPR',false]].map(([t,c])=><Checkbox key={t} label={t} defaultChecked={c}/>)}</div></Card>
      <Card title="Attività recenti" padding={20}><div style={{display:'flex',flexDirection:'column',gap:14}}>{[['Marco Rossi','ha caricato','Report test sensori — settembre.pdf','2 gg fa'],['Assistente IA','ha suggerito','bando PR FESR Liguria (82%)','3 gg fa'],['Ada Bianchi','ha completato','Business case v2','1 sett fa']].map(([a,v,o,d])=><div key={o} style={{display:'flex',gap:10,alignItems:'flex-start',fontSize:13}}>{a==='Assistente IA'?<span style={{width:24,height:24,borderRadius:12,background:'var(--accent-soft)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}><Icon name="sparkles" size={13} color="var(--accent)"/></span>:<Avatar name={a} size={24}/>}<div style={{flex:1}}><b style={{fontWeight:600}}>{a}</b> <span style={{color:'var(--text-secondary)'}}>{v}</span> {o}</div><span style={{color:'var(--text-tertiary)',fontSize:12}}>{d}</span></div>)}</div></Card></div>
    <div style={{display:'flex',flexDirection:'column',gap:16}}>
      <Card padding={20}><dl style={{margin:0,display:'grid',gridTemplateColumns:'auto 1fr',rowGap:12,columnGap:16,fontSize:13}}>
        <dt style={dt}>Stato</dt><dd style={dd}><Badge tone={tone} dot>{lab}</Badge></dd>
        <dt style={dt}>Owner</dt><dd style={dd}><span style={{display:'inline-flex',gap:6,alignItems:'center'}}><Avatar name={p.owner} size={20}/>{p.owner}</span></dd>
        <dt style={dt}>Team</dt><dd style={dd}><AvatarGroup names={p.team} size={22}/></dd>
        <dt style={dt}>Maturità</dt><dd style={dd}><Tooltip content="Technology Readiness Level"><Badge tone="info">TRL {p.trl}</Badge></Tooltip></dd>
        <dt style={dt}>Area</dt><dd style={dd}><Tag>{p.area}</Tag></dd></dl></Card>
      <Card eyebrow="Budget" title={fmtE(p.spent)+' / '+fmtE(p.budget)}><Progress value={p.spent} max={p.budget} showValue label="Speso"/><div style={{height:14}}/><Progress value={p.progress} showValue label="Avanzamento" tone="success"/></Card></div></div></div>;
}
const dt={color:'var(--text-tertiary)'},dd={margin:0};
window.ProjectDetail=ProjectDetail;
})();
