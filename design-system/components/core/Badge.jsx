import React from 'react';
const T={neutral:['var(--surface-sunken)','var(--text-secondary)'],accent:['var(--accent-soft)','var(--text-accent)'],success:['var(--success-soft)','var(--success)'],warning:['var(--warning-soft)','var(--warning)'],danger:['var(--danger-soft)','var(--danger)'],info:['var(--info-soft)','var(--info)']};
export function Badge({tone='neutral',dot,children,style}){
  const [bg,fg]=T[tone];
  return <span style={{display:'inline-flex',alignItems:'center',gap:5,height:20,padding:'0 7px',borderRadius:'var(--radius-sm)',background:bg,color:fg,fontFamily:'var(--font-ui)',fontSize:'var(--fs-xs)',fontWeight:'var(--fw-medium)',lineHeight:1,whiteSpace:'nowrap',...style}}>{dot&&<span style={{width:6,height:6,borderRadius:3,background:fg}}/>}{children}</span>;
}
