import React from 'react';
export function Tooltip({content,children,placement='top'}){
  const [o,setO]=React.useState(false);
  const pos=placement==='bottom'?{top:'calc(100% + 6px)'}:{bottom:'calc(100% + 6px)'};
  return <span onMouseEnter={()=>setO(true)} onMouseLeave={()=>setO(false)} onFocus={()=>setO(true)} onBlur={()=>setO(false)} style={{position:'relative',display:'inline-flex'}}>{children}
    {o&&<span role="tooltip" style={{position:'absolute',left:'50%',transform:'translateX(-50%)',...pos,background:'var(--surface-inverse)',color:'var(--text-inverse)',fontSize:'var(--fs-xs)',lineHeight:'var(--lh-xs)',padding:'5px 8px',borderRadius:'var(--radius-sm)',whiteSpace:'nowrap',pointerEvents:'none',zIndex:50,boxShadow:'var(--shadow-2)'}}>{content}</span>}</span>;
}
