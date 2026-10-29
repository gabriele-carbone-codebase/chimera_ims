import React from 'react';
import { Icon } from '../core/Icon.jsx';
const I={neutral:['info','var(--text-secondary)'],success:['check-circle-2','var(--success)'],warning:['alert-triangle','var(--warning)'],danger:['alert-octagon','var(--danger)'],ai:['sparkles','var(--text-accent)']};
export function Toast({tone='neutral',title,message,action,onClose,style}){
  const [ic,c]=I[tone];
  return <div role="status" style={{display:'flex',gap:10,alignItems:'flex-start',width:360,maxWidth:'100%',padding:'12px 12px 12px 14px',background:'var(--surface-raised)',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-3)',...style}}>
    <Icon name={ic} size={16} color={c} style={{marginTop:2}}/>
    <div style={{flex:1,minWidth:0}}><div style={{fontSize:'var(--fs-body)',fontWeight:600,color:'var(--text-primary)'}}>{title}</div>{message&&<div style={{fontSize:'var(--fs-sm)',color:'var(--text-secondary)',marginTop:2}}>{message}</div>}{action&&<div style={{marginTop:8}}>{action}</div>}</div>
    {onClose&&<button aria-label="Chiudi" onClick={onClose} style={{border:0,background:'transparent',color:'var(--text-tertiary)',cursor:'pointer',padding:2}}><Icon name="x" size={14}/></button>}</div>;
}
