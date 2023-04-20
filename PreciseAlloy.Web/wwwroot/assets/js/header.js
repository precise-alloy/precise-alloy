const c=()=>{const s=document.querySelector(".zzz-o-header");if(!s)return;const e=s.querySelector(".zzz-o-header__nav-toggle"),t=s.querySelector(".zzz-o-header__nav-list");!e||!t||(e.addEventListener("click",o=>{e.classList.toggle("active"),t.classList.toggle("active")}),t.onOutsideClick(()=>{e.classList.remove("active"),t.classList.remove("active")},[e]))};c();
//# sourceMappingURL=header.js.map
