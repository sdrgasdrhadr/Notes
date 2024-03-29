function t(e) {
  return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `;
}
var C = (typeof Symbol == "function" && Symbol.observable) || "@@observable",
  A = C;
var M = () => Math.random().toString(36).substring(7).split("").join("."),
  I = {
    INIT: `@@redux/INIT${M()}`,
    REPLACE: `@@redux/REPLACE${M()}`,
    PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${M()}`,
  },
  y = I;
function x(e) {
  if (typeof e != "object" || e === null) return !1;
  let r = e;
  for (; Object.getPrototypeOf(r) !== null; ) r = Object.getPrototypeOf(r);
  return Object.getPrototypeOf(e) === r || Object.getPrototypeOf(e) === null;
}
function O(e, r, o) {
  if (typeof e != "function") throw new Error(t(2));
  if (
    (typeof r == "function" && typeof o == "function") ||
    (typeof o == "function" && typeof arguments[3] == "function")
  )
    throw new Error(t(0));
  if (
    (typeof r == "function" && typeof o > "u" && ((o = r), (r = void 0)),
    typeof o < "u")
  ) {
    if (typeof o != "function") throw new Error(t(1));
    return o(O)(e, r);
  }
  let i = e,
    c = r,
    d = new Map(),
    a = d,
    u = 0,
    s = !1;
  function f() {
    a === d &&
      ((a = new Map()),
      d.forEach((n, p) => {
        a.set(p, n);
      }));
  }
  function h() {
    if (s) throw new Error(t(3));
    return c;
  }
  function l(n) {
    if (typeof n != "function") throw new Error(t(4));
    if (s) throw new Error(t(5));
    let p = !0;
    f();
    let E = u++;
    return (
      a.set(E, n),
      function () {
        if (p) {
          if (s) throw new Error(t(6));
          (p = !1), f(), a.delete(E), (d = null);
        }
      }
    );
  }
  function m(n) {
    if (!x(n)) throw new Error(t(7));
    if (typeof n.type > "u") throw new Error(t(8));
    if (typeof n.type != "string") throw new Error(t(17));
    if (s) throw new Error(t(9));
    try {
      (s = !0), (c = i(c, n));
    } finally {
      s = !1;
    }
    return (
      (d = a).forEach((E) => {
        E();
      }),
      n
    );
  }
  function g(n) {
    if (typeof n != "function") throw new Error(t(10));
    (i = n), m({ type: y.REPLACE });
  }
  function S() {
    let n = l;
    return {
      subscribe(p) {
        if (typeof p != "object" || p === null) throw new Error(t(11));
        function E() {
          let P = p;
          P.next && P.next(h());
        }
        return E(), { unsubscribe: n(E) };
      },
      [A]() {
        return this;
      },
    };
  }
  return (
    m({ type: y.INIT }),
    { dispatch: m, subscribe: l, getState: h, replaceReducer: g, [A]: S }
  );
}
function T(e, r, o) {
  return O(e, r, o);
}
function D(e) {
  Object.keys(e).forEach((r) => {
    let o = e[r];
    if (typeof o(void 0, { type: y.INIT }) > "u") throw new Error(t(12));
    if (typeof o(void 0, { type: y.PROBE_UNKNOWN_ACTION() }) > "u")
      throw new Error(t(13));
  });
}
function N(e) {
  let r = Object.keys(e),
    o = {};
  for (let a = 0; a < r.length; a++) {
    let u = r[a];
    typeof e[u] == "function" && (o[u] = e[u]);
  }
  let i = Object.keys(o),
    d;
  try {
    D(o);
  } catch (a) {
    d = a;
  }
  return function (u = {}, s) {
    if (d) throw d;
    let f = !1,
      h = {};
    for (let l = 0; l < i.length; l++) {
      let m = i[l],
        g = o[m],
        S = u[m],
        w = g(S, s);
      if (typeof w > "u") {
        throw new Error(t(14));
      }
      (h[m] = w), (f = f || w !== S);
    }
    return (f = f || i.length !== Object.keys(u).length), f ? h : u;
  };
}
function R(e, r) {
  return function (...o) {
    return r(e.apply(this, o));
  };
}
function k(e, r) {
  if (typeof e == "function") return R(e, r);
  if (typeof e != "object" || e === null) throw new Error(t(16));
  let o = {};
  for (let i in e) {
    let c = e[i];
    typeof c == "function" && (o[i] = R(c, r));
  }
  return o;
}
function b(...e) {
  return e.length === 0
    ? (r) => r
    : e.length === 1
    ? e[0]
    : e.reduce(
        (r, o) =>
          (...i) =>
            r(o(...i))
      );
}
function v(...e) {
  return (r) => (o, i) => {
    let c = r(o, i),
      d = () => {
        throw new Error(t(15));
      },
      a = { getState: c.getState, dispatch: (s, ...f) => d(s, ...f) },
      u = e.map((s) => s(a));
    return (d = b(...u)(c.dispatch)), { ...c, dispatch: d };
  };
}
function _(e) {
  return x(e) && "type" in e && typeof e.type == "string";
}
export {
  y as __DO_NOT_USE__ActionTypes,
  v as applyMiddleware,
  k as bindActionCreators,
  N as combineReducers,
  b as compose,
  O as createStore,
  _ as isAction,
  x as isPlainObject,
  T as legacy_createStore,
};
//# sourceMappingURL=redux.browser.mjs.map
