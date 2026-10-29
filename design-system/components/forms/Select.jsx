import React from 'react';
import { Icon } from '../core/Icon.jsx';
const lbl={display:'block',fontSize:'var(--fs-sm)',fontWeight:'var(--fw-medium)',color:'var(--text-primary)',marginBottom:6};
const hintS=(e)=>({fontSize:'var(--fs-xs)',color:e?'var(--danger)':'var(--text-tertiary)',marginTop:5});
const box=(f,e,d)=>({display:'flex',alignItems:'center',gap:8,height:'var(--control-h-md)',padding:'0 10px',background:d?'var(--surface-sunken)':'var(--surface-card)',border:'1px solid '+(e?'var(--danger)':f?'var(--border-focus)':'var(--border-default)'),borderRadius:'var(--radius-md)',boxShadow:f?'var(--ring-focus)':'none',color:'var(--text-tertiary)',transition:'border-color var(--dur-fast),box-shadow var(--dur-fast)'});
const inp={flex:1,minWidth:0,border:0,outline:0,background:'transparent',font:'inherit',fontSize:'var(--fs-body)',color:'var(--text-primary)',height:'100%'};
export function Select({label,hint,error,options=[],value,defaultValue,onChange,disabled,style}){
  const [f,setF]=React.useState(false);
  return <label style={{display:'block',...style}}>{label&&<span style={lbl}>{label}</span>}
    <span style={{...box(f,error,disabled),position:'relative',padding:0}}>
    <select value={value} defaultValue={defaultValue} onChange={onChange} disabled={disabled} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...inp,appearance:'none',WebkitAppearance:'none',padding:'0 30px 0 10px',cursor:'pointer'}}>{options.map(o=>typeof o==='string'?<option key={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}</select>
    <Icon name="chevron-down" size={14} style={{position:'absolute',right:10,pointerEvents:'none'}}/></span>
    {(error||hint)&&<span style={hintS(error)}>{error||hint}</span>}</label>;
}
