import{j as e}from"./react-loader.0xOcW6bypF.js";import{v as l,g as c}from"./functions.0xed5XM7m0.js";import{R as x}from"./require-css.0x5h3lZVSa.js";const z=({path:s,async:r,defer:i,inplace:t,type:a})=>{const o=/^https?:\/\//gi.test(s)?s:s.startsWith("vendors/")?l("/assets/")+s+".js":l("/assets/js/"+s+".js");return e.jsx("script",{type:a??"module",async:r,defer:i,src:o,"data-pl-require":!0,"data-pl-inplace":t})},n=s=>{const{height:r,iconPath:i,viewBoxHeight:t,viewBoxWidth:a,width:o}=s,h=c(s,"zzz-a-icon"),d=i.startsWith("#")?"/assets/images/icons.svg?v=3awVkj4kBV"+i:i;return e.jsx("svg",{className:h,"aria-hidden":"true",viewBox:`0 0 ${a} ${t}`,width:o||a,height:r||t,children:e.jsx("use",{xlinkHref:d})})},v=s=>{const r=c(s,"zzz-o-header"),{title:i,navlinks:t,logo:a}=s,o="/assets/images/logo.svg?v=dl44ntMrb1";return e.jsxs("header",{className:r,children:[e.jsx("div",{className:"zzz-container",children:e.jsxs("div",{className:"zzz-o-header__header-container",children:[e.jsx("a",{href:"#",children:e.jsx("img",{className:"zzz-o-header__logo",width:70,height:50,alt:"Precise Alloy's logo",src:(a==null?void 0:a.src)??o})}),e.jsx("span",{className:"zzz-o-header__title",children:i}),(t==null?void 0:t.links)&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"zzz-o-header__nav-mobile",children:e.jsxs("div",{className:"zzz-o-header__nav-toggle",children:[e.jsx("span",{}),e.jsx("span",{}),e.jsx("span",{})]})}),e.jsxs("ul",{className:"zzz-o-header__nav-list",children:[t.links.map(h=>e.jsx("li",{className:"zzz-o-header__nav-list__item",children:e.jsx("a",{href:h.url,children:h.text})},h.text)),e.jsx("li",{className:"theme-toggle",children:e.jsxs("a",{"aria-label":"Toggle Theme",children:[e.jsx(n,{iconPath:"#zzz-theme-light",viewBoxWidth:19,viewBoxHeight:19}),e.jsx(n,{iconPath:"#zzz-theme-moon",viewBoxWidth:19,viewBoxHeight:19})]})})]})]})]})}),e.jsx(z,{path:"header",defer:!0}),e.jsx(x,{path:"b-header"})]})};export{v as default};
//# sourceMappingURL=header.0xtA-hM5cw.js.map
