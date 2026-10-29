import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function StatCard({label,value,unit,delta,trend,caption,icon,style}){
  const up=trend==='up',down=trend==='down';
  const dc=up?'var(--success)':down?'var(--danger)':'var(--text-tertiary)';
  return <div style={{background:'var(--surface-card)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-1)',padding:'16px 18px',minWidth:0,...style}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,color:'var(--text-tertiary)'}}><span style={{fontFamily:'var(--font-mono)',fontSize:'var(--fs-overline)',letterSpacing:'var(--tracking-overline)',textTransform:'uppercase'}}>{label}</span>{icon&&<Icon name={icon} size={16}/>}</div>
    <div style={{display:'flex',alignItems:'baseline',gap:4,marginTop:10}}><span style={{fontFamily:'var(--font-sans)',fontSize:'var(--fs-kpi)',lineHeight:'var(--lh-kpi)',fontWeight:500,letterSpacing:'-0.02em',color:'var(--text-primary)',fontVariantNumeric:'tabular-nums'}}>{value}</span>{unit&&<span style={{fontSize:'var(--fs-body)',color:'var(--text-secondary)'}}>{unit}</span>}</div>
    {(delta||caption)&&<div style={{display:'flex',alignItems:'center',gap:6,marginTop:6,fontSize:'var(--fs-xs)'}}>{delta&&<span style={{display:'inline-flex',alignItems:'center',gap:2,color:dc,fontWeight:600}}>{(up||down)&&<Icon name={up?'arrow-up-right':'arrow-down-right'} size={12}/>}{delta}</span>}{caption&&<span style={{color:'var(--text-tertiary)'}}>{caption}</span>}</div>}</div>;
}
