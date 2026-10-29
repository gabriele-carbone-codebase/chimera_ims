(()=>{
const {Icon,IconButton,Button,Input,Avatar,Switch}=window.DS;
function Sidebar({route,go,t,lang,setLang}){
  const items=[['portfolio','layout-dashboard'],['pipeline','kanban'],['projects','folder-kanban'],['scouting','radar'],['funding','landmark'],['reports','chart-line']];
  const Item=({id,ic})=>{const on=route===id||(id==='projects'&&route==='project');const [h,setH]=React.useState(false);
    return <button onClick={()=>go(id)} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:'flex',alignItems:'center',gap:10,width:'100%',height:34,padding:'0 10px',border:0,borderRadius:6,background:on?'var(--surface-card)':h?'var(--surface-hover)':'transparent',boxShadow:on?'var(--shadow-1)':'none',color:on?'var(--text-primary)':'var(--text-secondary)',font:'inherit',fontSize:14,fontWeight:on?600:500,cursor:'pointer',textAlign:'left'}}><Icon name={ic} size={18} color={on?'var(--accent)':'currentColor'}/>{t[id]}</button>};
  return <aside style={{width:'var(--sidebar-w)',flex:'none',background:'var(--surface-sunken)',borderRight:'1px solid var(--border-subtle)',display:'flex',flexDirection:'column',padding:'16px 12px'}}>
    <div style={{display:'flex',alignItems:'baseline',gap:8,padding:'4px 10px 20px'}}><span style={{fontFamily:'var(--font-serif)',fontSize:24,fontWeight:500,letterSpacing:'-.02em',color:'var(--accent)'}}>IMIS</span><span style={{fontFamily:'var(--font-mono)',fontSize:10,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-tertiary)'}}>{t.workspace}</span></div>
    <nav style={{display:'flex',flexDirection:'column',gap:2}}>{items.map(([id,ic])=><Item key={id} id={id} ic={ic}/>)}</nav>
    <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:12}}>
      <div style={{display:'flex',gap:2,padding:2,background:'var(--surface-page)',borderRadius:6,border:'1px solid var(--border-subtle)'}}>{['it','en'].map(l=><button key={l} onClick={()=>setLang(l)} style={{flex:1,height:24,border:0,borderRadius:4,background:lang===l?'var(--surface-card)':'transparent',boxShadow:lang===l?'var(--shadow-1)':'none',fontFamily:'var(--font-mono)',fontSize:11,textTransform:'uppercase',color:lang===l?'var(--text-primary)':'var(--text-tertiary)',cursor:'pointer'}}>{l}</button>)}</div>
      <Item id="settings" ic="settings"/>
      <div style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderTop:'1px solid var(--border-subtle)'}}><Avatar name="Giulia Ferri" size={28}/><div style={{lineHeight:1.2}}><div style={{fontSize:13,fontWeight:600}}>Giulia Ferri</div><div style={{fontSize:12,color:'var(--text-tertiary)'}}>Innovation manager</div></div></div>
    </div></aside>;
}
function TopBar({title,crumb,t,ai,setAi,dark,setDark,onNew}){
  return <header style={{height:'var(--topbar-h)',flex:'none',display:'flex',alignItems:'center',gap:16,padding:'0 24px',borderBottom:'1px solid var(--border-subtle)',background:'var(--surface-page)'}}>
    <div style={{fontSize:13,color:'var(--text-tertiary)',display:'flex',alignItems:'center',gap:6,minWidth:0}}>{crumb&&<><span>{crumb}</span><Icon name="chevron-right" size={14}/></>}<span style={{color:'var(--text-primary)',fontWeight:500,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{title}</span></div>
    <div style={{flex:1}}/>
    <Input icon="search" placeholder={t.search} style={{width:280}}/>
    <IconButton icon={dark?'sun':'moon'} label="Tema" onClick={()=>setDark(!dark)}/>
    <IconButton icon="bell" label="Notifiche"/>
    <IconButton icon="sparkles" label={t.assistant} active={ai} onClick={()=>setAi(!ai)}/>
    <Button icon="plus" onClick={onNew}>{t.newIdea}</Button></header>;
}
function PageHead({eyebrow,title,sub,right}){
  return <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:24,marginBottom:24}}><div>{eyebrow&&<div style={{fontFamily:'var(--font-mono)',fontSize:11,letterSpacing:'.08em',textTransform:'uppercase',color:'var(--text-tertiary)',marginBottom:6}}>{eyebrow}</div>}<h1 style={{fontSize:'var(--fs-h1)',lineHeight:'var(--lh-h1)'}}>{title}</h1>{sub&&<p style={{margin:'6px 0 0',color:'var(--text-secondary)',maxWidth:620}}>{sub}</p>}</div>{right&&<div style={{display:'flex',gap:8,flex:'none'}}>{right}</div>}</div>;
}
Object.assign(window,{Sidebar,TopBar,PageHead});
})();
