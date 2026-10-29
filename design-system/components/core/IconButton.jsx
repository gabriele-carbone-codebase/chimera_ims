import React from 'react';
import { Icon } from './Icon.jsx';
export function IconButton({icon,label,size='md',variant='ghost',active,onClick,style,...rest}){
  const [h,setH]=React.useState(false);
  const d=size==='sm'?28:size==='lg'?40:34;
  const base=variant==='secondary'?{background:'var(--surface-card)',border:'1px solid var(--border-default)'}:{background:'transparent',border:'1px solid transparent'};
  return <button type="button" aria-label={label} title={label} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:d,height:d,borderRadius:'var(--radius-md)',cursor:'pointer',color:active?'var(--text-accent)':h?'var(--text-primary)':'var(--text-secondary)',transition:'background var(--dur-fast)',...base,...(active?{background:'var(--accent-soft)'}:h?{background:'var(--surface-hover)'}:{}),...style}} {...rest}><Icon name={icon} size={size==='lg'?20:16}/></button>;
}
