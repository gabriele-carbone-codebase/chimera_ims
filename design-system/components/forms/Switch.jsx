import React from 'react';
export function Switch({label,checked,defaultChecked,onChange,disabled,style}){
  const [c,setC]=React.useState(!!defaultChecked);const on=checked??c;
  return <label style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,fontSize:'var(--fs-body)',color:'var(--text-primary)',...style}}>
    <button type="button" role="switch" aria-checked={on} disabled={disabled} onClick={()=>{setC(!on);onChange&&onChange(!on)}} style={{position:'relative',width:30,height:18,borderRadius:9,border:0,padding:0,background:on?'var(--accent)':'var(--border-strong)',cursor:'inherit',transition:'background var(--dur-base) var(--ease-standard)'}}><span style={{position:'absolute',top:2,left:on?14:2,width:14,height:14,borderRadius:7,background:'#FFFFFF',boxShadow:'var(--shadow-1)',transition:'left var(--dur-base) var(--ease-standard)'}}/></button>{label}</label>;
}
