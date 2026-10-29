import React from 'react';
import { Icon } from '../core/Icon.jsx';
export function Checkbox({label,checked,defaultChecked,onChange,disabled,style}){
  const [c,setC]=React.useState(!!defaultChecked);const on=checked??c;
  return <label style={{display:'inline-flex',alignItems:'center',gap:8,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,fontSize:'var(--fs-body)',color:'var(--text-primary)',...style}}>
    <input type="checkbox" checked={on} disabled={disabled} onChange={e=>{setC(e.target.checked);onChange&&onChange(e.target.checked)}} style={{position:'absolute',opacity:0,width:0,height:0}}/>
    <span style={{width:16,height:16,borderRadius:'var(--radius-sm)',border:'1px solid '+(on?'var(--accent)':'var(--border-strong)'),background:on?'var(--accent)':'var(--surface-card)',color:'var(--on-accent)',display:'inline-flex',alignItems:'center',justifyContent:'center',transition:'background var(--dur-fast)'}}>{on&&<Icon name="check" size={12}/>}</span>{label}</label>;
}
