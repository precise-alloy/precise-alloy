(() => {
  let E = 1e5;
  const g = [
    {
      value: "theme-blue-p",
      name: "Blue"
    },
    {
      value: "theme-white-p",
      name: "White"
    },
    {
      value: "theme-sand-s",
      name: "Sand"
    },
    {
      value: "theme-flow-25",
      name: "Flow 25"
    },
    {
      value: "theme-wave-ac",
      name: "Wave"
    },
    {
      value: "theme-wave-50",
      name: "Wave 50"
    },
    {
      value: "theme-pearl-s",
      name: "Pearl"
    },
    {
      value: "theme-pebble-s",
      name: "Pebble"
    }
  ], _ = () => "pl-state-id-" + E++, S = (n, c) => {
    var m;
    if (!n.options)
      return "";
    const o = n.options, r = _(), e = n.multiple ? "Select many..." : ((m = o.find((t) => c.contains(t.value))) == null ? void 0 : m.name) ?? "---", i = n.multiple ? "checkbox" : "radio";
    let u = "";
    return o.forEach((t) => {
      const l = c.contains(t.value) ? "checked" : "", s = _();
      u += `<input name="${r}" class="pl-state-bar__input" type="${i}" id="${s}" data-name="${t.name}" value="${t.value}" ${l}/><label class="pl-state-bar__label" for="${s}"><span>${t.name}</span></label>`;
    }), `<div class="pl-state-bar__group"><div>${n.name}:</div><div class="pl-state-bar__group-header">${e}</div><div class="pl-state-bar__checkbox-group">${u}</div></div>`;
  }, y = () => {
    var n = [...document.querySelectorAll(".pl-state__button")];
    n.forEach((c) => c.classList.remove("active"));
  }, b = (n) => {
    n.classList.remove("expand"), document.body.classList.remove("pl-state-expand"), y(), window.dispatchEvent(new Event("resize"));
  }, w = (n, c, o) => {
    y();
    const r = document.querySelector(".pl-state-bar");
    if (!r)
      return;
    if (c.classList.contains("active")) {
      b(r);
      return;
    }
    const e = r.querySelector(".pl-state-bar__content");
    if (e) {
      let i = "", u = 0;
      o.states.forEach((t) => {
        const l = t.name === "Theme" && !t.options ? { ...t, options: g } : t;
        i += S(l, n.classList), u++, u == 1 && (i += L());
      }), e.innerHTML = i;
      const p = e.querySelector(".pl-state-bar__close-button");
      p && p.addEventListener("click", () => b(r)), [...e.querySelectorAll(".pl-state-bar__group")].forEach((t) => {
        const l = t.querySelector(".pl-state-bar__group-header"), s = t.querySelector(".pl-state-bar__checkbox-group");
        if (!l || !s)
          return;
        l && (l.addEventListener("click", () => {
          s.classList.toggle("expand");
        }), document.addEventListener("click", (a) => {
          if (!a.target)
            return;
          const d = a.target;
          !s.contains(d) && !l.contains(d) && s.classList.remove("expand");
        }));
        const h = t.querySelectorAll("input[type='checkbox']");
        [].forEach.call(h, (a) => {
          a.addEventListener("change", () => {
            a.value && (a.checked ? n.classList.add(a.value) : n.classList.remove(a.value), window.dispatchEvent(new Event("resize")));
          });
        });
        const v = t.querySelectorAll("input[type='radio']");
        [].forEach.call(v, (a) => {
          a.addEventListener("change", () => {
            [].forEach.call(v, (d) => {
              d.value && n.classList.remove(d.value);
            }), a.value && n.classList.add(a.value), l.textContent = a.getAttribute("data-name"), s.classList.remove("expand");
          });
        }), [...t.querySelectorAll("input[type='radio'] + label")].forEach((a) => {
          a.addEventListener("click", () => {
            s.classList.remove("expand");
          });
        });
      }), r.classList.add("expand"), c.classList.add("active"), document.body.classList.add("pl-state-expand"), window.dispatchEvent(new Event("resize"));
    }
  }, L = () => '<div class="pl-state-bar__buttons"><a class="pl-state-bar__close-button"></a></div>', x = (n) => {
    const c = `<div class="pl-state-bar"><div class="pl-state-bar__content"></div>${L()}</div>`;
    document.body.insertAdjacentHTML("beforeend", c);
    const o = document.querySelector(".pl-state-bar");
    if (!o)
      return;
    const r = o.querySelector(".pl-state-bar__close-button");
    r && r.addEventListener("click", () => b(o)), [].forEach.call(n, (e) => {
      var t, l;
      if (!e || !e.selector)
        return;
      const i = ((t = e.button) == null ? void 0 : t.styleModifier) ?? "", u = e.name ? `title="Show state modifier for: ${e.name}"` : "", p = (l = e.button) != null && l.zIndex ? `style="z-index: ${e.button.zIndex};"` : "", m = document.querySelectorAll(e.selector);
      [].forEach.call(m, (s) => {
        var d;
        let h = `<div class="pl-state ${i}" ${p}><div class="pl-state__controls"><button class="pl-state__button" ${u}><img src="/pl-states.svg" loading="async"></button></div></div>`;
        const v = (d = e.button) != null && d.parentSelector ? s.querySelector(e.button.parentSelector) : s;
        if (!v)
          return;
        v.insertAdjacentHTML("beforeend", h);
        const f = v.querySelector(":scope > .pl-state");
        if (!f)
          return;
        const a = f.querySelector(".pl-state__button");
        a && a.addEventListener("click", () => {
          w(s, a, e);
        });
      });
    }), addEventListener("resize", function() {
      const e = document.querySelector(".pl-state-bar");
      if (!e)
        return;
      const i = e.getBoundingClientRect();
      document.documentElement.style.setProperty("--pl-state-bar-height", Math.ceil(i.height) + "px");
    });
  };
  (() => {
    const n = "pl-show-state-selector";
    localStorage.getItem(n) && fetch("/pl-states.json").then((o) => o.json()).then((o) => x(o));
  })();
})();
//# sourceMappingURL=pl-states.js.map
