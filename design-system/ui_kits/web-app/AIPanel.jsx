(()=>{
const {Icon,IconButton,Button,Tag}=window.DS;
function AIPanel({onClose,context}){
  const [msgs,setMsgs]=React.useState([{r:'ai',x:'Buongiorno Giulia. Ho trovato 2 bandi compatibili con il portfolio e un progetto in ritardo (P-041). Da dove vuoi iniziare?'}]);
  const [v,setV]=React.useState('');
  const send=(q)=>{const x=(q||v).trim();if(!x)return;setV('');setMsgs(m=>[...m,{r:'me',x}]);setTimeout(()=>setMsgs(m=>[...m,{r:'ai',x:'Ecco una sintesi: il progetto P-041 ha consumato il 52% del budget con il 47% di avanzamento. Suggerisco di anticipare la revisione di fase al 12 novembre e verificare l’ammissibilità al Voucher Transizione Digitale (scade tra 10 giorni).',src:['P-041','Voucher CCIAA']}]),700)};
  return <aside style={{width:'var(--ai-panel-w)',flex:'none',borderLeft:'1px solid var(--border-subtle)',background:'var(--surface-card)',display:'flex',flexDirection:'column'}}>
    <header style={{height:'var(--topbar-h)',display:'flex',alignItems:'center',gap:8,padding:'0 12px 0 16px',borderBottom:'1px solid var(--border-subtle)'}}><Icon name="sparkles" size={16} color="var(--accent)"/><span style={{fontFamily:'var(--font-serif)',fontSize:18}}>Assistente</span><span style={{flex:1}}/><IconButton icon="history" label="Cronologia" size="sm"/><IconButton icon="x" label="Chiudi" size="sm" onClick={onClose}/></header>
    <div style={{padding:'10px 16px',borderBottom:'1px solid var(--border-subtle)',fontSize:12,color:'var(--text-tertiary)',display:'flex',alignItems:'center',gap:6}}><Icon name="at-sign" size={12}/>Contesto: <span style={{color:'var(--text-secondary)',fontWeight:500}}>{context}</span></div>
    <div style={{flex:1,overflow:'auto',padding:16,display:'flex',flexDirection:'column',gap:14}}>{msgs.map((m,i)=>m.r==='me'?<div key={i} style={{alignSelf:'flex-end',maxWidth:'85%',background:'var(--surface-sunken)',padding:'8px 12px',borderRadius:'10px 10px 2px 10px',fontSize:14}}>{m.x}</div>:<div key={i} style={{fontSize:14,lineHeight:'21px',color:'var(--text-primary)'}}>{m.x}{m.src&&<div style={{display:'flex',gap:6,marginTop:8}}>{m.src.map(s=><Tag key={s}>{s}</Tag>)}</div>}</div>)}</div>
    <div style={{padding:12,borderTop:'1px solid var(--border-subtle)'}}>
      <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:10}}>{['Riassumi il portfolio','Bandi in scadenza','Rischi della settimana'].map(s=><Tag key={s} onClick={()=>send(s)}>{s}</Tag>)}</div>
      <div style={{display:'flex',alignItems:'flex-end',gap:6,border:'1px solid var(--border-default)',borderRadius:6,padding:6,background:'var(--surface-page)'}}><textarea value={v} onChange={e=>setV(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} rows={2} placeholder="Chiedi all’assistente…" style={{flex:1,border:0,outline:0,resize:'none',background:'transparent',font:'inherit',fontSize:14,color:'var(--text-primary)',padding:4}}/><IconButton icon="arrow-up" label="Invia" variant="secondary" onClick={()=>send()}/></div>
      <div style={{fontSize:11,color:'var(--text-tertiary)',marginTop:8}}>Le risposte dell’IA possono contenere errori. Verifica sempre le fonti.</div></div></aside>;
}
window.AIPanel=AIPanel;
})();
