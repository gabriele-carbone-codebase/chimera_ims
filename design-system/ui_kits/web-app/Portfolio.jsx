(()=>{
const {Card,StatCard,Badge,Progress,AvatarGroup,IconButton,Button,Tabs}=window.DS;
const HEALTH={ok:['success','In linea'],risk:['warning','A rischio'],late:['danger','In ritardo']};
const fmtE=n=>'€ '+n.toLocaleString('it-IT');
function StageBar(){const D=window.IMIS_DATA;const counts=D.stages.map(s=>D.ideas[s.id].length+(s.id==='idea'?36:s.id==='screening'?14:s.id==='validation'?6:s.id==='pilot'?2:1));const tot=counts.reduce((a,b)=>a+b,0);
  return <div><div style={{display:'flex',height:10,borderRadius:99,overflow:'hidden',gap:2}}>{D.stages.map((s,i)=><div key={s.id} style={{flex:counts[i],background:s.c}}/>)}</div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',marginTop:14}}>{D.stages.map((s,i)=><div key={s.id}><div style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-tertiary)'}}><span style={{width:8,height:8,borderRadius:2,background:s.c}}/>{s.it}</div><div style={{fontSize:22,fontWeight:500,marginTop:4,fontVariantNumeric:'tabular-nums'}}>{counts[i]}</div></div>)}</div></div>}
function ProjectRow({p,open}){const [h,setH]=React.useState(false);const st=window.IMIS_DATA.stages.find(s=>s.id===p.stage);const [tone,lab]=HEALTH[p.health];
  return <tr onClick={()=>open(p)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{cursor:'pointer',background:h?'var(--surface-hover)':'transparent'}}>
  <td style={td}><div style={{fontWeight:500}}>{p.title}</div><div style={{fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-tertiary)',marginTop:2}}>{p.id} · {p.area}</div></td>
  <td style={td}><span style={{display:'inline-flex',alignItems:'center',gap:6,fontSize:13}}><span style={{width:8,height:8,borderRadius:2,background:st.c}}/>{st.it}</span></td>
  <td style={{...td,width:160}}><Progress value={p.progress} size="sm"/><div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:4,fontFamily:'var(--font-mono)'}}>{p.progress}%</div></td>
  <td style={{...td,fontVariantNumeric:'tabular-nums',fontSize:13}}>{fmtE(p.budget)}</td>
  <td style={td}><Badge tone={tone} dot>{lab}</Badge></td><td style={td}><AvatarGroup names={p.team} size={22}/></td></tr>}
const td={padding:'12px 16px',borderTop:'1px solid var(--border-subtle)',verticalAlign:'middle'};
const th={padding:'10px 16px',textAlign:'left',fontFamily:'var(--font-mono)',fontSize:11,fontWeight:400,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-tertiary)'};
function Portfolio({open,go}){const D=window.IMIS_DATA;
  return <div><PageHead eyebrow="Ottobre 2026 · T4" title="Buongiorno, Giulia" sub="5 progetti attivi, 2 bandi compatibili in scadenza e una revisione di fase questa settimana." right={<><Button variant="secondary" icon="download">Esporta</Button></>}/>
  <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:16,marginBottom:16}}><StatCard label="Idee attive" value="59" delta="+14" trend="up" caption="vs T3" icon="lightbulb"/><StatCard label="Progetti in corso" value="5" delta="+1" trend="up" caption="vs T3" icon="folder-kanban"/><StatCard label="Budget allocato" value="€ 330" unit="k" delta="59% speso" caption="" icon="wallet"/><StatCard label="Time-to-pilot" value="74" unit="gg" delta="−9 gg" trend="up" caption="mediana" icon="timer"/></div>
  <div style={{display:'grid',gridTemplateColumns:'minmax(0,2fr) minmax(0,1fr)',gap:16,marginBottom:16}}>
    <Card eyebrow="Funnel" title="Distribuzione per fase" actions={<Button variant="ghost" size="sm" iconRight="arrow-right" onClick={()=>go('pipeline')}>Pipeline</Button>}><StageBar/></Card>
    <Card eyebrow="Prossime scadenze" title="Questa settimana" padding={20}><div style={{display:'flex',flexDirection:'column',gap:12}}>{[['flag','Revisione di fase P-041','12 nov','danger'],['landmark','Voucher Transizione Digitale','8 nov','warning'],['users','Comitato innovazione','14 nov','neutral']].map(([ic,t,d,tone])=><div key={t} style={{display:'flex',alignItems:'center',gap:10,fontSize:13}}><window.DS.Icon name={ic} size={16} color="var(--text-tertiary)"/><span style={{flex:1}}>{t}</span><Badge tone={tone}>{d}</Badge></div>)}</div></Card></div>
  <Card title="Progetti attivi" eyebrow="Portfolio" padding={0} actions={<div style={{padding:'0 0 0 0'}}><Tabs variant="segmented" tabs={['Tutti','A rischio','Miei']}/></div>} style={{overflow:'hidden'}}>
    <div style={{height:16}}/><table style={{width:'100%',borderCollapse:'collapse',fontSize:14}}><thead><tr><th style={th}>Progetto</th><th style={th}>Fase</th><th style={th}>Avanzamento</th><th style={th}>Budget</th><th style={th}>Stato</th><th style={th}>Team</th></tr></thead><tbody>{D.projects.map(p=><ProjectRow key={p.id} p={p} open={open}/>)}</tbody></table></Card></div>;
}
Object.assign(window,{Portfolio,HEALTH,fmtE});
})();
