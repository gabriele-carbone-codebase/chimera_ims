import React from 'react';
import { Icon } from '../core/Icon.jsx';
const lbl={display:'block',fontSize:'var(--fs-sm)',fontWeight:'var(--fw-medium)',color:'var(--text-primary)',marginBottom:6};
const hintS=(e)=>({fontSize:'var(--fs-xs)',color:e?'var(--danger)':'var(--text-tertiary)',marginTop:5});
const box=(f,e,d)=>({display:'flex',alignItems:'center',gap:8,height:'var(--control-h-md)',padding:'0 10px',background:d?'var(--surface-sunken)':'var(--surface-card)',border:'1px solid '+(e?'var(--danger)':f?'var(--border-focus)':'var(--border-default)'),borderRadius:'var(--radius-md)',boxShadow:f?'var(--ring-focus)':'none',color:'var(--text-tertiary)',transition:'border-color var(--dur-fast),box-shadow var(--dur-fast)'});
const inp={flex:1,minWidth:0,border:0,outline:0,background:'transparent',font:'inherit',fontSize:'var(--fs-body)',color:'var(--text-primary)',height:'100%'};
export function Input({label,hint,error,icon,disabled,multiline,rows=3,style,...rest}){
  const [f,setF]=React.useState(false);
  const b=box(f,error,disabled);
  return <label style={{display:'block',...style}}>{label&&<span style={lbl}>{label}</span>}
    <span style={multiline?{...b,height:'auto',alignItems:'flex-start',padding:'8px 10px'}:b}>{icon&&<Icon name={icon} size={16}/>}
    {multiline?<textarea rows={rows} disabled={disabled} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={{...inp,resize:'vertical',lineHeight:'var(--lh-body)'}} {...rest}/>:<input disabled={disabled} onFocus={()=>setF(true)} onBlur={()=>setF(false)} style={inp} {...rest}/>}</span>
    {(error||hint)&&<span style={hintS(error)}>{error||hint}</span>}</label>;
}
