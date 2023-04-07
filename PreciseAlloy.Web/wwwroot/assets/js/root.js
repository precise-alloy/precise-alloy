let s, a;
const r = document.getElementById("root-iframe-wrapper"), n = document.getElementById("root-iframe"), l = document.getElementById("root-iframe-resizer");
document.getElementById(".xpack-t-root");
const c = (e) => {
  e ? r.style.maxWidth = `min(100%, ${e}px)` : r.style.removeProperty("max-width");
}, i = (e) => {
  e.stopPropagation(), e.preventDefault(), e.cancelBubble = !0;
  const t = (e.x - a) * 2, o = Math.max(350, s + t);
  return c(o), !1;
}, d = () => {
  r.style.removeProperty("transition"), n.style.removeProperty("pointer-events"), document.removeEventListener("mousemove", i, !1);
}, m = (e) => {
  e.offsetX >= 20 || (r.style.transition = "none", n.style.pointerEvents = "none", a = e.x, s = parseInt(getComputedStyle(r, "").width), document.addEventListener("mousemove", i, !1), document.addEventListener("mouseup", d, !1));
}, p = () => {
  const e = localStorage.getItem("MSG_IS_TOP_PANEL") === "true";
  let t = document.querySelector(".xpack-t-root");
  t && e && t.classList.add("top-panel");
}, u = (e) => {
  switch (e.key) {
    case "MSG_IS_TOP_PANEL":
      const t = e.newValue === "true";
      let o = document.querySelector(".xpack-t-root");
      if (!o)
        return;
      t ? o.classList.add("top-panel") : o.classList.remove("top-panel");
      break;
  }
}, E = () => {
  window.addEventListener("storage", u);
}, f = () => {
  l.onmousedown = m;
  const e = () => {
    const t = document.getElementById("root-actual-iframe-width");
    t && (t.textContent = Math.ceil(parseInt(getComputedStyle(n).width)) + "px");
  };
  n.onload = e, "ResizeObserver" in window && new ResizeObserver(e).observe(n), p(), E();
};
f();
//# sourceMappingURL=root.js.map
