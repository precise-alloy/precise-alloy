import{a as e,j as t,F as n}from"./react-loader.0x0e9dc0af.js";import{v as c,g as h,R as z}from"./require-css.0x6e5ca354.js";import"./vendor.0x2c817467.js";const m=({path:s,async:i,defer:l,inplace:a,type:r})=>{const d=/^https?:\/\//gi.test(s)?s:s.startsWith("vendors/")?c("/assets/")+s+".js":c("/assets/js/"+s+".js");return e("script",{type:r??"module",async:i,defer:l,src:d,"data-pl-require":!0,"data-pl-inplace":a})},u=s=>{const i=h(s,"zzz-o-header"),{title:l,navlinks:a,logo:r}=s,d="/assets/images/logo.svg";return t("header",{className:i,children:[e("div",{className:"zzz-container",children:t("div",{className:"zzz-o-header__header-container",children:[e("a",{href:"#",children:e("img",{className:"zzz-o-header__logo",width:70,height:50,alt:"Precise Alloy's logo",src:(r==null?void 0:r.src)??d})}),e("span",{className:"zzz-o-header__title",children:l}),(a==null?void 0:a.links)&&t(n,{children:[e("div",{className:"zzz-o-header__nav-mobile",children:t("div",{className:"zzz-o-header__nav-toggle",children:[e("span",{}),e("span",{}),e("span",{})]})}),e("ul",{className:"zzz-o-header__nav-list",children:a.links.map(o=>e("li",{className:"zzz-o-header__nav-list__item",children:e("a",{href:o.url,children:o.text})},o.text))})]})]})}),e(m,{path:"header",defer:!0}),e(z,{path:"b-header"})]})};export{u as default};
//# sourceMappingURL=header.0x0565cc77.js.map
