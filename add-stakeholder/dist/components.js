var B = Object.defineProperty;
var M = (e, t, n) => t in e ? B(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var l = (e, t, n) => (M(e, typeof t != "symbol" ? t + "" : t, n), n);
function x() {
}
function N(e) {
  return e();
}
function S() {
  return /* @__PURE__ */ Object.create(null);
}
function w(e) {
  e.forEach(N);
}
function P(e) {
  return typeof e == "function";
}
function H(e, t) {
  return e != e ? t == t : e !== t || e && typeof e == "object" || typeof e == "function";
}
function I(e) {
  return Object.keys(e).length === 0;
}
function J(e, t, n) {
  e.insertBefore(t, n || null);
}
function U(e) {
  e.parentNode && e.parentNode.removeChild(e);
}
function R(e) {
  return document.createElement(e);
}
function T(e, t, n) {
  n == null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function V(e) {
  return Array.from(e.childNodes);
}
function q(e) {
  const t = {};
  return e.childNodes.forEach(
    /** @param {Element} node */
    (n) => {
      t[n.slot || "default"] = !0;
    }
  ), t;
}
let y;
function m(e) {
  y = e;
}
function z() {
  if (!y)
    throw new Error("Function called outside component initialization");
  return y;
}
function F(e) {
  z().$$.on_mount.push(e);
}
const b = [], C = [];
let g = [];
const L = [], D = /* @__PURE__ */ Promise.resolve();
let j = !1;
function G() {
  j || (j = !0, D.then(a));
}
function E(e) {
  g.push(e);
}
const k = /* @__PURE__ */ new Set();
let _ = 0;
function a() {
  if (_ !== 0)
    return;
  const e = y;
  do {
    try {
      for (; _ < b.length; ) {
        const t = b[_];
        _++, m(t), Q(t.$$);
      }
    } catch (t) {
      throw b.length = 0, _ = 0, t;
    }
    for (m(null), b.length = 0, _ = 0; C.length; )
      C.pop()();
    for (let t = 0; t < g.length; t += 1) {
      const n = g[t];
      k.has(n) || (k.add(n), n());
    }
    g.length = 0;
  } while (b.length);
  for (; L.length; )
    L.pop()();
  j = !1, k.clear(), m(e);
}
function Q(e) {
  if (e.fragment !== null) {
    e.update(), w(e.before_update);
    const t = e.dirty;
    e.dirty = [-1], e.fragment && e.fragment.p(e.ctx, t), e.after_update.forEach(E);
  }
}
function W(e) {
  const t = [], n = [];
  g.forEach((i) => e.indexOf(i) === -1 ? t.push(i) : n.push(i)), n.forEach((i) => i()), g = t;
}
const X = /* @__PURE__ */ new Set();
function Y(e, t) {
  e && e.i && (X.delete(e), e.i(t));
}
function Z(e, t, n) {
  const { fragment: i, after_update: r } = e.$$;
  i && i.m(t, n), E(() => {
    const s = e.$$.on_mount.map(N).filter(P);
    e.$$.on_destroy ? e.$$.on_destroy.push(...s) : w(s), e.$$.on_mount = [];
  }), r.forEach(E);
}
function v(e, t) {
  const n = e.$$;
  n.fragment !== null && (W(n.after_update), w(n.on_destroy), n.fragment && n.fragment.d(t), n.on_destroy = n.fragment = null, n.ctx = []);
}
function tt(e, t) {
  e.$$.dirty[0] === -1 && (b.push(e), G(), e.$$.dirty.fill(0)), e.$$.dirty[t / 31 | 0] |= 1 << t % 31;
}
function et(e, t, n, i, r, s, o = null, u = [-1]) {
  const $ = y;
  m(e);
  const c = e.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: s,
    update: x,
    not_equal: r,
    bound: S(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(t.context || ($ ? $.$$.context : [])),
    // everything else
    callbacks: S(),
    dirty: u,
    skip_bound: !1,
    root: t.target || $.$$.root
  };
  o && o(c.root);
  let h = !1;
  if (c.ctx = n ? n(e, t.props || {}, (f, d, ...O) => {
    const A = O.length ? O[0] : d;
    return c.ctx && r(c.ctx[f], c.ctx[f] = A) && (!c.skip_bound && c.bound[f] && c.bound[f](A), h && tt(e, f)), d;
  }) : [], c.update(), h = !0, w(c.before_update), c.fragment = i ? i(c.ctx) : !1, t.target) {
    if (t.hydrate) {
      const f = V(t.target);
      c.fragment && c.fragment.l(f), f.forEach(U);
    } else
      c.fragment && c.fragment.c();
    t.intro && Y(e.$$.fragment), Z(e, t.target, t.anchor), a();
  }
  m($);
}
let K;
typeof HTMLElement == "function" && (K = class extends HTMLElement {
  constructor(t, n, i) {
    super();
    /** The Svelte component constructor */
    l(this, "$$ctor");
    /** Slots */
    l(this, "$$s");
    /** The Svelte component instance */
    l(this, "$$c");
    /** Whether or not the custom element is connected */
    l(this, "$$cn", !1);
    /** Component props data */
    l(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    l(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    l(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    l(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    l(this, "$$l_u", /* @__PURE__ */ new Map());
    this.$$ctor = t, this.$$s = n, i && this.attachShadow({ mode: "open" });
  }
  addEventListener(t, n, i) {
    if (this.$$l[t] = this.$$l[t] || [], this.$$l[t].push(n), this.$$c) {
      const r = this.$$c.$on(t, n);
      this.$$l_u.set(n, r);
    }
    super.addEventListener(t, n, i);
  }
  removeEventListener(t, n, i) {
    if (super.removeEventListener(t, n, i), this.$$c) {
      const r = this.$$l_u.get(n);
      r && (r(), this.$$l_u.delete(n));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let t = function(s) {
        return () => {
          let o;
          return {
            c: function() {
              o = R("slot"), s !== "default" && T(o, "name", s);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(c, h) {
              J(c, o, h);
            },
            d: function(c) {
              c && U(o);
            }
          };
        };
      };
      if (await Promise.resolve(), !this.$$cn)
        return;
      const n = {}, i = q(this);
      for (const s of this.$$s)
        s in i && (n[s] = [t(s)]);
      for (const s of this.attributes) {
        const o = this.$$g_p(s.name);
        o in this.$$d || (this.$$d[o] = p(o, s.value, this.$$p_d, "toProp"));
      }
      this.$$c = new this.$$ctor({
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$scope: {
            ctx: []
          }
        }
      });
      const r = () => {
        this.$$r = !0;
        for (const s in this.$$p_d)
          if (this.$$d[s] = this.$$c.$$.ctx[this.$$c.$$.props[s]], this.$$p_d[s].reflect) {
            const o = p(
              s,
              this.$$d[s],
              this.$$p_d,
              "toAttribute"
            );
            o == null ? this.removeAttribute(this.$$p_d[s].attribute || s) : this.setAttribute(this.$$p_d[s].attribute || s, o);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(r), r();
      for (const s in this.$$l)
        for (const o of this.$$l[s]) {
          const u = this.$$c.$on(s, o);
          this.$$l_u.set(o, u);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(t, n, i) {
    var r;
    this.$$r || (t = this.$$g_p(t), this.$$d[t] = p(t, i, this.$$p_d, "toProp"), (r = this.$$c) == null || r.$set({ [t]: this.$$d[t] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      this.$$cn || (this.$$c.$destroy(), this.$$c = void 0);
    });
  }
  $$g_p(t) {
    return Object.keys(this.$$p_d).find(
      (n) => this.$$p_d[n].attribute === t || !this.$$p_d[n].attribute && n.toLowerCase() === t
    ) || t;
  }
});
function p(e, t, n, i) {
  var s;
  const r = (s = n[e]) == null ? void 0 : s.type;
  if (t = r === "Boolean" && typeof t != "boolean" ? t != null : t, !i || !n[e])
    return t;
  if (i === "toAttribute")
    switch (r) {
      case "Object":
      case "Array":
        return t == null ? null : JSON.stringify(t);
      case "Boolean":
        return t ? "" : null;
      case "Number":
        return t ?? null;
      default:
        return t;
    }
  else
    switch (r) {
      case "Object":
      case "Array":
        return t && JSON.parse(t);
      case "Boolean":
        return t;
      case "Number":
        return t != null ? +t : t;
      default:
        return t;
    }
}
function nt(e, t, n, i, r, s) {
  let o = class extends K {
    constructor() {
      super(e, n, r), this.$$p_d = t;
    }
    static get observedAttributes() {
      return Object.keys(t).map(
        (u) => (t[u].attribute || u).toLowerCase()
      );
    }
  };
  return Object.keys(t).forEach((u) => {
    Object.defineProperty(o.prototype, u, {
      get() {
        return this.$$c && u in this.$$c ? this.$$c[u] : this.$$d[u];
      },
      set($) {
        var c;
        $ = p(u, $, t), this.$$d[u] = $, (c = this.$$c) == null || c.$set({ [u]: $ });
      }
    });
  }), i.forEach((u) => {
    Object.defineProperty(o.prototype, u, {
      get() {
        var $;
        return ($ = this.$$c) == null ? void 0 : $[u];
      }
    });
  }), s && (o = s(o)), e.element = /** @type {any} */
  o, o;
}
class st {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    l(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    l(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    v(this, 1), this.$destroy = x;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(t, n) {
    if (!P(n))
      return x;
    const i = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return i.push(n), () => {
      const r = i.indexOf(n);
      r !== -1 && i.splice(r, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(t) {
    this.$$set && !I(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
}
const it = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(it);
function rt(e, t, n) {
  let { builderKey: i = "", webhookUrl: r = "", width: s = 530, height: o = 760, left: u = 100, top: $ = 100 } = t;
  function c() {
    let h = [
      "http://app.request.finance/add-stakeholder",
      [`stakeholder-public-key=${i}`, `webhook-url=${r}`].join("&")
    ].join("?"), f = ["popup", { width: s }, { height: o }, { left: u }, { top: $ }].map((d) => typeof d == "object" ? [Object.keys(d)[0], d[Object.keys(d)[0]]].join("=") : d).join(",");
    window.open(h, "", f);
  }
  return F(() => {
    console.log("hi"), c();
  }), e.$$set = (h) => {
    "builderKey" in h && n(0, i = h.builderKey), "webhookUrl" in h && n(1, r = h.webhookUrl), "width" in h && n(2, s = h.width), "height" in h && n(3, o = h.height), "left" in h && n(4, u = h.left), "top" in h && n(5, $ = h.top);
  }, [i, r, s, o, u, $];
}
class ot extends st {
  constructor(t) {
    super(), et(this, t, rt, null, H, {
      builderKey: 0,
      webhookUrl: 1,
      width: 2,
      height: 3,
      left: 4,
      top: 5
    });
  }
  get builderKey() {
    return this.$$.ctx[0];
  }
  set builderKey(t) {
    this.$$set({ builderKey: t }), a();
  }
  get webhookUrl() {
    return this.$$.ctx[1];
  }
  set webhookUrl(t) {
    this.$$set({ webhookUrl: t }), a();
  }
  get width() {
    return this.$$.ctx[2];
  }
  set width(t) {
    this.$$set({ width: t }), a();
  }
  get height() {
    return this.$$.ctx[3];
  }
  set height(t) {
    this.$$set({ height: t }), a();
  }
  get left() {
    return this.$$.ctx[4];
  }
  set left(t) {
    this.$$set({ left: t }), a();
  }
  get top() {
    return this.$$.ctx[5];
  }
  set top(t) {
    this.$$set({ top: t }), a();
  }
}
customElements.define("add-stakeholder", nt(ot, { builderKey: {}, webhookUrl: {}, width: {}, height: {}, left: {}, top: {} }, [], [], !0));
export {
  ot as AddStakeholder
};
//# sourceMappingURL=components.js.map
