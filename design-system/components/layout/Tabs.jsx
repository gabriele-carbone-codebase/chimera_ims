import React from 'react';
export function Tabs({tabs=[],value,defaultValue,onChange,variant='underline',style}){
  const [v,setV]=React.useState(defaultValue??(tabs[0]&&(tabs[0].value??tabs[0])));const cur=value??v;
  const seg=variant==='segmented';
  return <div role="tablist" style={{display:'flex',gap:seg?2:20,...(seg?{padding:2,background:'var(--surface-sunken)',borderRadius:'var(--radius-md)',width:'fit-content'}:{borderBottom:'1px solid var(--border-subtle)'}),...style}}>{tabs.map(t=>{const val=t.value??t,lab=t.label??t,on=val===cur;
    return <button key={val} role="tab" aria-selected={on} onClick={()=>{setV(val);onChange&&onChange(val)}} style={seg?{height:28,padding:'0 12px',border:0,borderRadius:4,background:on?'var(--surface-card)':'transparent',boxShadow:on?'var(--shadow-1)':'none',color:on?'var(--text-primary)':'var(--text-tertiary)',font:'inherit',fontSize:'var(--fs-sm)',fontWeight:500,cursor:'pointer'}:{height:36,padding:0,border:0,borderBottom:'2px solid '+(on?'var(--accent)':'transparent'),marginBottom:-1,background:'transparent',color:on?'var(--text-primary)':'var(--text-tertiary)',font:'inherit',fontSize:'var(--fs-body)',fontWeight:500,cursor:'pointer',display:'inline-flex',alignItems:'center',gap:6}}>{lab}{t.count!=null&&<span style={{fontSize:11,color:'var(--text-tertiary)',fontFamily:'var(--font-mono)'}}>{t.count}</span>}</button>})}</div>;
}
