import React from 'react';
import { Icon } from './Icon.jsx';
export function Tag({children,color,selected,onRemove,onClick,style}){
  return <span onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,height:24,padding:onRemove?'0 4px 0 9px':'0 9px',borderRadius:'var(--radius-pill)',border:'1px solid '+(selected?'var(--accent-soft-border)':'var(--border-default)'),background:selected?'var(--accent-soft)':'var(--surface-card)',color:selected?'var(--text-accent)':'var(--text-secondary)',fontSize:'var(--fs-xs)',fontWeight:'var(--fw-medium)',cursor:onClick?'pointer':'default',whiteSpace:'nowrap',...style}}>{color&&<span style={{width:7,height:7,borderRadius:2,background:color}}/>}{children}{onRemove&&<span role="button" aria-label="Rimuovi" onClick={e=>{e.stopPropagation();onRemove()}} style={{display:'inline-flex',padding:2,borderRadius:99,cursor:'pointer'}}><Icon name="x" size={12}/></span>}</span>;
}
