import React from 'react';
const CDN='https://unpkg.com/lucide-static@0.454.0/icons/';
const cache={};
function load(name){
  if(!cache[name]) cache[name]=fetch(CDN+name+'.svg').then(r=>r.ok?r.text():'').then(t=>t.replace(/<!--[\s\S]*?-->/g,'').replace(/width="24"/,'width="100%"').replace(/height="24"/,'height="100%"')).catch(()=>'');
  return cache[name];
}
export function Icon({name='circle',size=16,color='currentColor',style,...rest}){
  const [svg,setSvg]=React.useState('');
  React.useEffect(()=>{let on=true;load(name).then(s=>{if(on)setSvg(s)});return()=>{on=false}},[name]);
  return <span aria-hidden="true" {...rest} style={{display:'inline-flex',flex:'none',width:size,height:size,color,lineHeight:0,...style}} dangerouslySetInnerHTML={{__html:svg}}/>;
}
