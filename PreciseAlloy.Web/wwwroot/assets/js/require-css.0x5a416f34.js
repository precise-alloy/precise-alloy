import{a as n}from"./react-loader.0x3c2a71de.js";const c=(s,e)=>{var r,o;const t=[e];return(r=s.globalModifier)==null||r.forEach(i=>t.push(i)),(o=s.styleModifier)==null||o.forEach(i=>t.push(e+"--"+i)),s.theme&&t.push("theme-"+s.theme),t.join(" ")},h=(s,e=!1)=>{const t="/",r=(s!=null&&s.startsWith("/")?s:"/"+s)+(e&&!s.endsWith("/")?".html":"");if(!t.endsWith("/"))return t+r;const o=t.length;return t.substring(0,o-1)+r},u=({path:s,rel:e})=>{const t=/^https?:\/\//gi.test(s)?s:s.startsWith("vendors/")?"/assets/"+s+".css":"/assets/css/"+s+".css";return n("link",{rel:e??"stylesheet preload",href:t,"data-pl-require":!0,as:"style"})};export{u as R,c as g,h as v};
//# sourceMappingURL=require-css.0x5a416f34.js.map