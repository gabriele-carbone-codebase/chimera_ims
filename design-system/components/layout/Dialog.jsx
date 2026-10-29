import React from 'react';
import { IconButton } from '../core/IconButton.jsx';
export function Dialog({open,title,description,children,footer,onClose,width=480}){
  if(!open) return null;
  return <div onClick={onClose} style={{position:'fixed',inset:0,background:'var(--overlay-scrim)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100,padding:24}}>
    <div role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()} style={{width:'100%',maxWidth:width,background:'var(--surface-raised)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-3)',border:'1px solid var(--border-subtle)'}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12,padding:'20px 20px 0'}}><div><h2 style={{fontFamily:'var(--font-heading)',fontSize:'var(--fs-h2)',lineHeight:'var(--lh-h2)',fontWeight:500,margin:0,color:'var(--text-primary)'}}>{title}</h2>{description&&<p style={{margin:'6px 0 0',color:'var(--text-secondary)',fontSize:'var(--fs-body)'}}>{description}</p>}</div>{onClose&&<IconButton icon="x" label="Chiudi" onClick={onClose}/>}</header>
      <div style={{padding:20}}>{children}</div>
      {footer&&<footer style={{display:'flex',justifyContent:'flex-end',gap:8,padding:'12px 20px',borderTop:'1px solid var(--border-subtle)'}}>{footer}</footer>}</div></div>;
}
