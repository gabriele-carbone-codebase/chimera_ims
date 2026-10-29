import React from 'react';
export function Radio({options=[],value,defaultValue,onChange,name,direction='column',style}){
  const [v,setV]=React.useState(defaultValue);const cur=value??v;
  return <div role="radiogroup" style={{display:'flex',flexDirection:direction,gap:direction==='row'?16:8,...style}}>{options.map(o=>{const val=typeof o==='string'?o:o.value,lab=typeof o==='string'?o:o.label,on=cur===val;
    return <label key={val} style={{display:'inline-flex',alignItems:'center',gap:8,cursor:'pointer',fontSize:'var(--fs-body)',color:'var(--text-primary)'}}><input type="radio" name={name} checked={on} onChange={()=>{setV(val);onChange&&onChange(val)}} style={{position:'absolute',opacity:0,width:0,height:0}}/>
    <span style={{width:16,height:16,borderRadius:'50%',border:'1px solid '+(on?'var(--accent)':'var(--border-strong)'),background:'var(--surface-card)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>{on&&<span style={{width:8,height:8,borderRadius:'50%',background:'var(--accent)'}}/>}</span>{lab}</label>})}</div>;
}
