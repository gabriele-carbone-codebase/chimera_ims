import React from 'react';
const P=['#C9A86A','#6E8470','#4F6E80','#9C8B6E','#A0705A'];
export function Avatar({name='',src,size=28,style}){
  const ini=name.split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const c=P[[...name].reduce((a,ch)=>a+ch.charCodeAt(0),0)%P.length];
  return <span title={name} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',width:size,height:size,borderRadius:'50%',background:src?'var(--surface-sunken)':c,color:'#FFFFFF',fontSize:Math.round(size*.38),fontWeight:600,fontFamily:'var(--font-ui)',overflow:'hidden',flex:'none',boxShadow:'0 0 0 2px var(--surface-card)',...style}}>{src?<img src={src} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:ini}</span>;
}
export function AvatarGroup({names=[],max=3,size=24}){
  return <span style={{display:'inline-flex'}}>{names.slice(0,max).map((n,i)=><Avatar key={n} name={n} size={size} style={{marginLeft:i?-6:0}}/>)}{names.length>max&&<span style={{marginLeft:-6,width:size,height:size,borderRadius:'50%',background:'var(--surface-sunken)',color:'var(--text-secondary)',fontSize:11,fontWeight:600,display:'inline-flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 0 2px var(--surface-card)'}}>+{names.length-max}</span>}</span>;
}
