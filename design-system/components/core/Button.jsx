import React from 'react';
import { Icon } from './Icon.jsx';
const H={sm:'var(--control-h-sm)',md:'var(--control-h-md)',lg:'var(--control-h-lg)'};
const PX={sm:'10px',md:'14px',lg:'18px'};
const V={
  primary:{background:'var(--accent)',color:'var(--on-accent)',border:'1px solid var(--accent)'},
  secondary:{background:'var(--surface-card)',color:'var(--text-primary)',border:'1px solid var(--border-default)',boxShadow:'var(--shadow-1)'},
  ghost:{background:'transparent',color:'var(--text-secondary)',border:'1px solid transparent'},
  danger:{background:'var(--surface-card)',color:'var(--danger)',border:'1px solid var(--border-default)'},
};
const HOV={primary:{background:'var(--accent-hover)',borderColor:'var(--accent-hover)'},secondary:{background:'var(--surface-hover)'},ghost:{background:'var(--surface-hover)',color:'var(--text-primary)'},danger:{background:'var(--danger-soft)'}};
export function Button({variant='primary',size='md',icon,iconRight,disabled,fullWidth,children,style,onClick,type='button',...rest}){
  const [h,setH]=React.useState(false);const [p,setP]=React.useState(false);
  const s={display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,height:H[size],padding:'0 '+PX[size],borderRadius:'var(--radius-md)',fontFamily:'var(--font-ui)',fontSize:size==='sm'?'var(--fs-sm)':'var(--fs-body)',fontWeight:'var(--fw-medium)',whiteSpace:'nowrap',cursor:disabled?'not-allowed':'pointer',opacity:disabled?.45:1,transition:'background var(--dur-fast) var(--ease-standard),transform var(--dur-fast)',transform:p&&!disabled?'translateY(1px)':'none',width:fullWidth?'100%':undefined,...V[variant],...(h&&!disabled?HOV[variant]:{}),...style};
  const is=size==='lg'?18:size==='sm'?14:16;
  return <button type={type} disabled={disabled} onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setP(false)}} onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} style={s} {...rest}>{icon&&<Icon name={icon} size={is}/>}{children}{iconRight&&<Icon name={iconRight} size={is}/>}</button>;
}
