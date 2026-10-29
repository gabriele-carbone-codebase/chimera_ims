(()=>{
const {Card,Badge,Button,Select,Input,Progress,Icon,Checkbox}=window.DS;
function Funding({lang,toast}){const D=window.IMIS_DATA;const [sel,setSel]=React.useState(0);const c=D.calls[sel];
  return <div><PageHead eyebrow="Opportunità" title={lang==='en'?'Funding & grants':'Bandi e finanziamenti'} sub="Bandi aperti filtrati per regione, dimensione d’impresa e affinità con i progetti in corso."/>
  <div style={{display:'grid',gridTemplateColumns:'minmax(0,1.3fr) minmax(0,1fr)',gap:16,alignItems:'start'}}>
    <div style={{display:'flex',flexDirection:'column',gap:10}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:6}}><Select options={['Tutte le regioni','Liguria','Nazionale','UE']}/><Select options={['PMI','Grande impresa']}/><Select options={['Ordina per affinità','Ordina per scadenza']}/></div>
    {D.calls.map((x,i)=><Card key={x.t} interactive selected={i===sel} padding={16} onClick={()=>setSel(i)}><div style={{display:'flex',gap:14,alignItems:'center'}}>
      <div style={{flex:1,minWidth:0}}><div style={{fontWeight:600,fontSize:14}}>{x.t}</div><div style={{fontSize:12,color:'var(--text-tertiary)',marginTop:2}}>{x.e} · {x.amt}</div></div>
      <Badge tone={x.days<=14?'warning':'neutral'}>{x.st==='rolling'?'A sportello':x.days+' gg'}</Badge>
      <div style={{textAlign:'right',width:52}}><div style={{fontSize:20,fontWeight:500,fontVariantNumeric:'tabular-nums',color:x.m>=80?'var(--success)':'var(--text-primary)'}}>{x.m}%</div><div style={{fontSize:10,fontFamily:'var(--font-mono)',color:'var(--text-tertiary)',textTransform:'uppercase'}}>affinità</div></div></div></Card>)}</div>
    <Card eyebrow={c.e} title={c.t} footer={<div style={{display:'flex',gap:8,justifyContent:'flex-end'}}><Button variant="secondary" icon="file-text">Testo del bando</Button><Button icon="sparkles" onClick={()=>toast('Bozza di candidatura generata','L’assistente ha compilato 6 sezioni su 9.')}>Prepara candidatura</Button></div>}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:18}}>{[['Contributo',c.amt],['Intensità',c.pct],['Scadenza',c.dl]].map(([k,v])=><div key={k}><div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-tertiary)'}}>{k}</div><div style={{fontSize:14,fontWeight:500,marginTop:4}}>{v}</div></div>)}</div>
      <Progress label="Affinità con il portfolio" value={c.m} showValue tone={c.m>=80?'success':'accent'}/>
      <div style={{fontWeight:600,fontSize:13,margin:'18px 0 10px'}}>Requisiti di ammissibilità</div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>{[['Sede operativa in Liguria',true],['PMI secondo definizione UE',true],['Progetto con TRL ≥ 5',true],['Cofinanziamento del 50% disponibile',false]].map(([t,k])=><Checkbox key={t} label={t} defaultChecked={k}/>)}</div>
      <div style={{display:'flex',gap:8,alignItems:'center',marginTop:16,fontSize:12,color:'var(--text-tertiary)'}}><Icon name="link" size={13}/>Progetti collegati: <b style={{color:'var(--text-secondary)',fontWeight:500}}>P-024, P-041</b></div></Card></div></div>;
}
window.Funding=Funding;
})();
