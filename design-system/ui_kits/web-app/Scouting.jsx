(()=>{
const {Card,Tag,Badge,Button,IconButton,Progress}=window.DS;
function Scouting({lang}){const D=window.IMIS_DATA;const cats=['Tutti',...new Set(D.trends.map(t=>t.cat))];const [c,setC]=React.useState('Tutti');const [saved,setSaved]=React.useState({});
  const list=D.trends.filter(t=>c==='Tutti'||t.cat===c);const mt={Emergente:'accent','In crescita':'info',Maturo:'neutral'};
  return <div><PageHead eyebrow="Radar tecnologico" title={lang==='en'?'Trend scouting':'Scouting trend'} sub="Segnali raccolti da brevetti, pubblicazioni e notizie, ordinati per rilevanza rispetto al tuo portfolio." right={<Button variant="secondary" icon="sliders-horizontal">Fonti</Button>}/>
  <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>{cats.map(x=><Tag key={x} selected={x===c} onClick={()=>setC(x)}>{x}</Tag>)}</div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:16}}>{list.map(t=><Card key={t.t} interactive padding={18}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><span style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-tertiary)'}}>{t.cat}</span><Badge tone={mt[t.m]}>{t.m}</Badge></div>
    <h3 style={{fontSize:19,lineHeight:'26px'}}>{t.t}</h3><p style={{margin:'6px 0 16px',color:'var(--text-secondary)',fontSize:13,lineHeight:'19px'}}>{t.d}</p>
    <div style={{display:'flex',alignItems:'center',gap:12}}><Progress value={t.s} size="sm" style={{flex:1}}/><span style={{fontFamily:'var(--font-mono)',fontSize:12}}>{t.s}</span><IconButton icon={saved[t.t]?'bookmark-check':'bookmark'} label="Salva" active={saved[t.t]} size="sm" onClick={()=>setSaved(s=>({...s,[t.t]:!s[t.t]}))}/></div></Card>)}</div></div>;
}
window.Scouting=Scouting;
})();
