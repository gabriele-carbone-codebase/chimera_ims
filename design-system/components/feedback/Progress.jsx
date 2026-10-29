import React from 'react';
export function Progress({value=0,max=100,tone='accent',label,showValue,size='md',style}){
  const pct=Math.max(0,Math.min(100,value/max*100));
  const c={accent:'var(--accent)',success:'var(--success)',warning:'var(--warning)',danger:'var(--danger)'}[tone];
  return <div style={style}>{(label||showValue)&&<div style={{display:'flex',justifyContent:'space-between',fontSize:'var(--fs-xs)',color:'var(--text-secondary)',marginBottom:6}}><span>{label}</span>{showValue&&<span style={{fontFamily:'var(--font-mono)',color:'var(--text-primary)'}}>{Math.round(pct)}%</span>}</div>}
    <div style={{height:size==='sm'?4:6,background:'var(--surface-sunken)',borderRadius:99,overflow:'hidden'}}><div style={{width:pct+'%',height:'100%',background:c,borderRadius:99,transition:'width var(--dur-slow) var(--ease-standard)'}}/></div></div>;
}
