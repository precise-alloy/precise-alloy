(()=>{const e=new URLSearchParams(window.location.search).get("theme");if(e==="dark"||e=="light"){document.documentElement.setAttribute("data-theme",e);return}(localStorage.getItem("theme")==="dark"||!localStorage.getItem("theme")&&window.matchMedia("(prefers-color-scheme: dark)").matches)&&document.documentElement.setAttribute("data-theme","dark")})();
//# sourceMappingURL=theme-critical.js.map
