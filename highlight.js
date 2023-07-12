/*!
  Highlight.js v11.7.0 (git: 82688fad18)
  (c) 2006-2022 undefined and other contributors
  License: BSD-3-Clause
 */
var hljs = function () {
        "use strict";
        var e = {exports: {}};

        function t(e) {
            return e instanceof Map ? e.clear = e.delete = e.set = () => {
                throw Error("map is read-only")
            } : e instanceof Set && (e.add = e.clear = e.delete = () => {
                throw Error("set is read-only")
            }), Object.freeze(e), Object.getOwnPropertyNames(e).forEach((n => {
                var i = e[n]
                ;"object" != typeof i || Object.isFrozen(i) || t(i)
            })), e
        }

        e.exports = t, e.exports.default = t;

        class n {
            constructor(e) {
                void 0 === e.data && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1
            }

            ignoreMatch() {
                this.isMatchIgnored = !0
            }
        }

        function i(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;")
        }

        function r(e, ...t) {
            const n = Object.create(null);
            for (const t in e) n[t] = e[t]
            ;
            return t.forEach((e => {
                for (const t in e) n[t] = e[t]
            })), n
        }

        const s = e => !!e.scope || e.sublanguage && e.language;

        class o {
            constructor(e, t) {
                this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this)
            }

            addText(e) {
                this.buffer += i(e)
            }

            openNode(e) {
                if (!s(e)) return;
                let t = ""
                ;t = e.sublanguage ? "language-" + e.language : ((e, {prefix: t}) => {
                    if (e.includes(".")) {
                        const n = e.split(".")
                        ;
                        return [`${t}${n.shift()}`, ...n.map(((e, t) => `${e}${"_".repeat(t + 1)}`))].join(" ")
                    }
                    return `${t}${e}`
                })(e.scope, {prefix: this.classPrefix}), this.span(t)
            }

            closeNode(e) {
                s(e) && (this.buffer += "</span>")
            }

            value() {
                return this.buffer
            }

            span(e) {
                this.buffer += `<span class="${e}">`
            }
        }

        const a = (e = {}) => {
            const t = {children: []}
            ;
            return Object.assign(t, e), t
        };

        class c {
            constructor() {
                this.rootNode = a(), this.stack = [this.rootNode]
            }

            get top() {
                return this.stack[this.stack.length - 1]
            }

            get root() {
                return this.rootNode
            }

            add(e) {
                this.top.children.push(e)
            }

            openNode(e) {
                const t = a({scope: e})
                ;this.add(t), this.stack.push(t)
            }

            closeNode() {
                if (this.stack.length > 1) return this.stack.pop()
            }

            closeAllNodes() {
                for (; this.closeNode();) ;
            }

            toJSON() {
                return JSON.stringify(this.rootNode, null, 4)
            }

            walk(e) {
                return this.constructor._walk(e, this.rootNode)
            }

            static _walk(e, t) {
                return "string" == typeof t ? e.addText(t) : t.children && (e.openNode(t),
                    t.children.forEach((t => this._walk(e, t))), e.closeNode(t)), e
            }

            static _collapse(e) {
                "string" != typeof e && e.children && (e.children.every((e => "string" == typeof e)) ? e.children = [e.children.join("")] : e.children.forEach((e => {
                    c._collapse(e)
                })))
            }
        }

        class l extends c {
            constructor(e) {
                super(), this.options = e
            }

            addKeyword(e, t) {
                "" !== e && (this.openNode(t), this.addText(e), this.closeNode())
            }

            addText(e) {
                "" !== e && this.add(e)
            }

            addSublanguage(e, t) {
                const n = e.root
                ;n.sublanguage = !0, n.language = t, this.add(n)
            }

            toHTML() {
                return new o(this, this.options).value()
            }

            finalize() {
                return !0
            }
        }

        function g(e) {
            return e ? "string" == typeof e ? e : e.source : null
        }

        function d(e) {
            return p("(?=", e, ")")
        }

        function u(e) {
            return p("(?:", e, ")*")
        }

        function h(e) {
            return p("(?:", e, ")?")
        }

        function p(...e) {
            return e.map((e => g(e))).join("")
        }

        function f(...e) {
            const t = (e => {
                const t = e[e.length - 1]
                ;
                return "object" == typeof t && t.constructor === Object ? (e.splice(e.length - 1, 1), t) : {}
            })(e);
            return "(" + (t.capture ? "" : "?:") + e.map((e => g(e))).join("|") + ")"
        }

        function b(e) {
            return RegExp(e.toString() + "|").exec("").length - 1
        }

        const m = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./
        ;

        function E(e, {joinWith: t}) {
            let n = 0;
            return e.map((e => {
                n += 1;
                const t = n
                ;let i = g(e), r = "";
                for (; i.length > 0;) {
                    const e = m.exec(i);
                    if (!e) {
                        r += i;
                        break
                    }
                    r += i.substring(0, e.index),
                        i = i.substring(e.index + e[0].length), "\\" === e[0][0] && e[1] ? r += "\\" + (Number(e[1]) + t) : (r += e[0],
                    "(" === e[0] && n++)
                }
                return r
            })).map((e => `(${e})`)).join(t)
        }

        const x = "[a-zA-Z]\\w*", w = "[a-zA-Z_]\\w*", y = "\\b\\d+(\\.\\d+)?",
            _ = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", O = "\\b(0b[01]+)", v = {
                begin: "\\\\[\\s\\S]", relevance: 0
            }, N = {
                scope: "string", begin: "'", end: "'",
                illegal: "\\n", contains: [v]
            }, k = {
                scope: "string", begin: '"', end: '"', illegal: "\\n",
                contains: [v]
            }, M = (e, t, n = {}) => {
                const i = r({
                    scope: "comment", begin: e, end: t,
                    contains: []
                }, n);
                i.contains.push({
                    scope: "doctag",
                    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
                    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/, excludeBegin: !0, relevance: 0
                })
                ;const s = f("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/)
                ;
                return i.contains.push({begin: p(/[ ]+/, "(", s, /[.]?[:]?([.][ ]|[ ])/, "){3}")}), i
            }, S = M("//", "$"), R = M("/\\*", "\\*/"), j = M("#", "$");
        var A = Object.freeze({
            __proto__: null, MATCH_NOTHING_RE: /\b\B/, IDENT_RE: x, UNDERSCORE_IDENT_RE: w,
            NUMBER_RE: y, C_NUMBER_RE: _, BINARY_NUMBER_RE: O,
            RE_STARTERS_RE: "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
            SHEBANG: (e = {}) => {
                const t = /^#![ ]*\//
                ;
                return e.binary && (e.begin = p(t, /.*\b/, e.binary, /\b.*/)), r({
                    scope: "meta", begin: t,
                    end: /$/, relevance: 0, "on:begin": (e, t) => {
                        0 !== e.index && t.ignoreMatch()
                    }
                }, e)
            },
            BACKSLASH_ESCAPE: v, APOS_STRING_MODE: N, QUOTE_STRING_MODE: k, PHRASAL_WORDS_MODE: {
                begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
            }, COMMENT: M, C_LINE_COMMENT_MODE: S, C_BLOCK_COMMENT_MODE: R, HASH_COMMENT_MODE: j,
            NUMBER_MODE: {scope: "number", begin: y, relevance: 0}, C_NUMBER_MODE: {
                scope: "number",
                begin: _, relevance: 0
            }, BINARY_NUMBER_MODE: {scope: "number", begin: O, relevance: 0},
            REGEXP_MODE: {
                begin: /(?=\/[^/\n]*\/)/, contains: [{
                    scope: "regexp", begin: /\//,
                    end: /\/[gimuy]*/, illegal: /\n/, contains: [v, {
                        begin: /\[/, end: /\]/, relevance: 0,
                        contains: [v]
                    }]
                }]
            }, TITLE_MODE: {scope: "title", begin: x, relevance: 0},
            UNDERSCORE_TITLE_MODE: {scope: "title", begin: w, relevance: 0}, METHOD_GUARD: {
                begin: "\\.\\s*[a-zA-Z_]\\w*", relevance: 0
            }, END_SAME_AS_BEGIN: e => Object.assign(e, {
                "on:begin": (e, t) => {
                    t.data._beginMatch = e[1]
                }, "on:end": (e, t) => {
                    t.data._beginMatch !== e[1] && t.ignoreMatch()
                }
            })
        });

        function I(e, t) {
            "." === e.input[e.index - 1] && t.ignoreMatch()
        }

        function T(e, t) {
            void 0 !== e.className && (e.scope = e.className, delete e.className)
        }

        function L(e, t) {
            t && e.beginKeywords && (e.begin = "\\b(" + e.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)",
                e.__beforeBegin = I, e.keywords = e.keywords || e.beginKeywords, delete e.beginKeywords,
            void 0 === e.relevance && (e.relevance = 0))
        }

        function B(e, t) {
            Array.isArray(e.illegal) && (e.illegal = f(...e.illegal))
        }

        function D(e, t) {
            if (e.match) {
                if (e.begin || e.end) throw Error("begin & end are not supported with match")
                    ;
                e.begin = e.match, delete e.match
            }
        }

        function H(e, t) {
            void 0 === e.relevance && (e.relevance = 1)
        }

        const P = (e, t) => {
                if (!e.beforeMatch) return
                    ;
                if (e.starts) throw Error("beforeMatch cannot be used with starts")
                    ;
                const n = Object.assign({}, e);
                Object.keys(e).forEach((t => {
                    delete e[t]
                })), e.keywords = n.keywords, e.begin = p(n.beforeMatch, d(n.begin)), e.starts = {
                    relevance: 0, contains: [Object.assign(n, {endsParent: !0})]
                }, e.relevance = 0, delete n.beforeMatch
            }, C = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"]
        ;

        function $(e, t, n = "keyword") {
            const i = Object.create(null)
            ;
            return "string" == typeof e ? r(n, e.split(" ")) : Array.isArray(e) ? r(n, e) : Object.keys(e).forEach((n => {
                Object.assign(i, $(e[n], t, n))
            })), i;

            function r(e, n) {
                t && (n = n.map((e => e.toLowerCase()))), n.forEach((t => {
                    const n = t.split("|")
                    ;i[n[0]] = [e, U(n[0], n[1])]
                }))
            }
        }

        function U(e, t) {
            return t ? Number(t) : (e => C.includes(e.toLowerCase()))(e) ? 0 : 1
        }

        const z = {}, K = e => {
            console.error(e)
        }, W = (e, ...t) => {
            console.log("WARN: " + e, ...t)
        }, X = (e, t) => {
            z[`${e}/${t}`] || (console.log(`Deprecated as of ${e}. ${t}`), z[`${e}/${t}`] = !0)
        }, G = Error();

        function Z(e, t, {key: n}) {
            let i = 0;
            const r = e[n], s = {}, o = {}
            ;
            for (let e = 1; e <= t.length; e++) o[e + i] = r[e], s[e + i] = !0, i += b(t[e - 1])
            ;
            e[n] = o, e[n]._emit = s, e[n]._multi = !0
        }

        function F(e) {
            (e => {
                e.scope && "object" == typeof e.scope && null !== e.scope && (e.beginScope = e.scope,
                    delete e.scope)
            })(e), "string" == typeof e.beginScope && (e.beginScope = {
                _wrap: e.beginScope
            }), "string" == typeof e.endScope && (e.endScope = {
                _wrap: e.endScope
            }), (e => {
                if (Array.isArray(e.begin)) {
                    if (e.skip || e.excludeBegin || e.returnBegin) throw K("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),
                        G
                        ;
                    if ("object" != typeof e.beginScope || null === e.beginScope) throw K("beginScope must be object"),
                        G;
                    Z(e, e.begin, {key: "beginScope"}), e.begin = E(e.begin, {joinWith: ""})
                }
            })(e), (e => {
                if (Array.isArray(e.end)) {
                    if (e.skip || e.excludeEnd || e.returnEnd) throw K("skip, excludeEnd, returnEnd not compatible with endScope: {}"),
                        G
                        ;
                    if ("object" != typeof e.endScope || null === e.endScope) throw K("endScope must be object"),
                        G;
                    Z(e, e.end, {key: "endScope"}), e.end = E(e.end, {joinWith: ""})
                }
            })(e)
        }

        function V(e) {
            function t(t, n) {
                return RegExp(g(t), "m" + (e.case_insensitive ? "i" : "") + (e.unicodeRegex ? "u" : "") + (n ? "g" : ""))
            }

            class n {
                constructor() {
                    this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0
                }

                addRule(e, t) {
                    t.position = this.position++, this.matchIndexes[this.matchAt] = t, this.regexes.push([t, e]),
                        this.matchAt += b(e) + 1
                }

                compile() {
                    0 === this.regexes.length && (this.exec = () => null)
                    ;const e = this.regexes.map((e => e[1]));
                    this.matcherRe = t(E(e, {
                        joinWith: "|"
                    }), !0), this.lastIndex = 0
                }

                exec(e) {
                    this.matcherRe.lastIndex = this.lastIndex
                    ;const t = this.matcherRe.exec(e);
                    if (!t) return null
                        ;
                    const n = t.findIndex(((e, t) => t > 0 && void 0 !== e)), i = this.matchIndexes[n]
                    ;
                    return t.splice(0, n), Object.assign(t, i)
                }
            }

            class i {
                constructor() {
                    this.rules = [], this.multiRegexes = [],
                        this.count = 0, this.lastIndex = 0, this.regexIndex = 0
                }

                getMatcher(e) {
                    if (this.multiRegexes[e]) return this.multiRegexes[e];
                    const t = new n
                    ;
                    return this.rules.slice(e).forEach((([e, n]) => t.addRule(e, n))),
                        t.compile(), this.multiRegexes[e] = t, t
                }

                resumingScanAtSamePosition() {
                    return 0 !== this.regexIndex
                }

                considerAll() {
                    this.regexIndex = 0
                }

                addRule(e, t) {
                    this.rules.push([e, t]), "begin" === t.type && this.count++
                }

                exec(e) {
                    const t = this.getMatcher(this.regexIndex);
                    t.lastIndex = this.lastIndex
                    ;let n = t.exec(e)
                    ;
                    if (this.resumingScanAtSamePosition()) if (n && n.index === this.lastIndex) ; else {
                        const t = this.getMatcher(0);
                        t.lastIndex = this.lastIndex + 1, n = t.exec(e)
                    }
                    return n && (this.regexIndex += n.position + 1,
                    this.regexIndex === this.count && this.considerAll()), n
                }
            }

            if (e.compilerExtensions || (e.compilerExtensions = []),
            e.contains && e.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
                ;
            return e.classNameAliases = r(e.classNameAliases || {}), function n(s, o) {
                const a = s
                ;
                if (s.isCompiled) return a
                    ;
                [T, D, F, P].forEach((e => e(s, o))), e.compilerExtensions.forEach((e => e(s, o))),
                    s.__beforeBegin = null, [L, B, H].forEach((e => e(s, o))), s.isCompiled = !0;
                let c = null
                ;
                return "object" == typeof s.keywords && s.keywords.$pattern && (s.keywords = Object.assign({}, s.keywords),
                    c = s.keywords.$pattern,
                    delete s.keywords.$pattern), c = c || /\w+/, s.keywords && (s.keywords = $(s.keywords, e.case_insensitive)),
                    a.keywordPatternRe = t(c, !0),
                o && (s.begin || (s.begin = /\B|\b/), a.beginRe = t(a.begin), s.end || s.endsWithParent || (s.end = /\B|\b/),
                s.end && (a.endRe = t(a.end)),
                    a.terminatorEnd = g(a.end) || "", s.endsWithParent && o.terminatorEnd && (a.terminatorEnd += (s.end ? "|" : "") + o.terminatorEnd)),
                s.illegal && (a.illegalRe = t(s.illegal)),
                s.contains || (s.contains = []), s.contains = [].concat(...s.contains.map((e => (e => (e.variants && !e.cachedVariants && (e.cachedVariants = e.variants.map((t => r(e, {
                    variants: null
                }, t)))), e.cachedVariants ? e.cachedVariants : q(e) ? r(e, {
                    starts: e.starts ? r(e.starts) : null
                }) : Object.isFrozen(e) ? r(e) : e))("self" === e ? s : e)))), s.contains.forEach((e => {
                    n(e, a)
                })), s.starts && n(s.starts, o), a.matcher = (e => {
                    const t = new i
                    ;
                    return e.contains.forEach((e => t.addRule(e.begin, {
                        rule: e, type: "begin"
                    }))), e.terminatorEnd && t.addRule(e.terminatorEnd, {
                        type: "end"
                    }), e.illegal && t.addRule(e.illegal, {type: "illegal"}), t
                })(a), a
            }(e)
        }

        function q(e) {
            return !!e && (e.endsWithParent || q(e.starts))
        }

        class J extends Error {
            constructor(e, t) {
                super(e), this.name = "HTMLInjectionError", this.html = t
            }
        }

        const Y = i, Q = r, ee = Symbol("nomatch");
        var te = (t => {
            const i = Object.create(null), r = Object.create(null), s = [];
            let o = !0
            ;const a = "Could not find the language '{}', did you forget to load/include a language module?", c = {
                disableAutodetect: !0, name: "Plain text", contains: []
            };
            let g = {
                ignoreUnescapedHTML: !1, throwUnescapedHTML: !1, noHighlightRe: /^(no-?highlight)$/i,
                languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i, classPrefix: "hljs-",
                cssSelector: "pre code", languages: null, __emitter: l
            };

            function b(e) {
                return g.noHighlightRe.test(e)
            }

            function m(e, t, n) {
                let i = "", r = ""
                ;"object" == typeof t ? (i = e,
                    n = t.ignoreIllegals, r = t.language) : (X("10.7.0", "highlight(lang, code, ...args) has been deprecated."),
                    X("10.7.0", "Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),
                    r = e, i = t), void 0 === n && (n = !0);
                const s = {code: i, language: r};
                k("before:highlight", s)
                ;const o = s.result ? s.result : E(s.language, s.code, n)
                ;
                return o.code = s.code, k("after:highlight", o), o
            }

            function E(e, t, r, s) {
                const c = Object.create(null);

                function l() {
                    if (!N.keywords) return void M.addText(S)
                        ;
                    let e = 0;
                    N.keywordPatternRe.lastIndex = 0;
                    let t = N.keywordPatternRe.exec(S), n = ""
                    ;
                    for (; t;) {
                        n += S.substring(e, t.index)
                        ;const r = y.case_insensitive ? t[0].toLowerCase() : t[0], s = (i = r, N.keywords[i]);
                        if (s) {
                            const [e, i] = s
                            ;
                            if (M.addText(n), n = "", c[r] = (c[r] || 0) + 1, c[r] <= 7 && (R += i), e.startsWith("_")) n += t[0]; else {
                                const n = y.classNameAliases[e] || e;
                                M.addKeyword(t[0], n)
                            }
                        } else n += t[0]
                        ;
                        e = N.keywordPatternRe.lastIndex, t = N.keywordPatternRe.exec(S)
                    }
                    var i
                    ;n += S.substring(e), M.addText(n)
                }

                function d() {
                    null != N.subLanguage ? (() => {
                        if ("" === S) return;
                        let e = null;
                        if ("string" == typeof N.subLanguage) {
                            if (!i[N.subLanguage]) return void M.addText(S)
                                ;
                            e = E(N.subLanguage, S, !0, k[N.subLanguage]), k[N.subLanguage] = e._top
                        } else e = x(S, N.subLanguage.length ? N.subLanguage : null)
                        ;
                        N.relevance > 0 && (R += e.relevance), M.addSublanguage(e._emitter, e.language)
                    })() : l(), S = ""
                }

                function u(e, t) {
                    let n = 1;
                    const i = t.length - 1;
                    for (; n <= i;) {
                        if (!e._emit[n]) {
                            n++;
                            continue
                        }
                        const i = y.classNameAliases[e[n]] || e[n], r = t[n]
                        ;i ? M.addKeyword(r, i) : (S = r, l(), S = ""), n++
                    }
                }

                function h(e, t) {
                    return e.scope && "string" == typeof e.scope && M.openNode(y.classNameAliases[e.scope] || e.scope),
                    e.beginScope && (e.beginScope._wrap ? (M.addKeyword(S, y.classNameAliases[e.beginScope._wrap] || e.beginScope._wrap),
                        S = "") : e.beginScope._multi && (u(e.beginScope, t), S = "")), N = Object.create(e, {
                        parent: {
                            value: N
                        }
                    }), N
                }

                function p(e, t, i) {
                    let r = ((e, t) => {
                        const n = e && e.exec(t)
                        ;
                        return n && 0 === n.index
                    })(e.endRe, i);
                    if (r) {
                        if (e["on:end"]) {
                            const i = new n(e)
                            ;e["on:end"](t, i), i.isMatchIgnored && (r = !1)
                        }
                        if (r) {
                            for (; e.endsParent && e.parent;) e = e.parent;
                            return e
                        }
                    }
                    if (e.endsWithParent) return p(e.parent, t, i)
                }

                function f(e) {
                    return 0 === N.matcher.regexIndex ? (S += e[0], 1) : (I = !0, 0)
                }

                function b(e) {
                    const n = e[0], i = t.substring(e.index), r = p(N, e, i);
                    if (!r) return ee;
                    const s = N
                    ;N.endScope && N.endScope._wrap ? (d(),
                        M.addKeyword(n, N.endScope._wrap)) : N.endScope && N.endScope._multi ? (d(),
                        u(N.endScope, e)) : s.skip ? S += n : (s.returnEnd || s.excludeEnd || (S += n),
                        d(), s.excludeEnd && (S = n));
                    do {
                        N.scope && M.closeNode(), N.skip || N.subLanguage || (R += N.relevance), N = N.parent
                    } while (N !== r.parent);
                    return r.starts && h(r.starts, e), s.returnEnd ? 0 : n.length
                }

                let m = {};

                function w(i, s) {
                    const a = s && s[0];
                    if (S += i, null == a) return d(), 0
                        ;
                    if ("begin" === m.type && "end" === s.type && m.index === s.index && "" === a) {
                        if (S += t.slice(s.index, s.index + 1), !o) {
                            const t = Error(`0 width match regex (${e})`)
                            ;
                            throw t.languageName = e, t.badRule = m.rule, t
                        }
                        return 1
                    }
                    if (m = s, "begin" === s.type) return (e => {
                        const t = e[0], i = e.rule, r = new n(i), s = [i.__beforeBegin, i["on:begin"]]
                        ;
                        for (const n of s) if (n && (n(e, r), r.isMatchIgnored)) return f(t)
                            ;
                        return i.skip ? S += t : (i.excludeBegin && (S += t),
                            d(), i.returnBegin || i.excludeBegin || (S = t)), h(i, e), i.returnBegin ? 0 : t.length
                    })(s)
                        ;
                    if ("illegal" === s.type && !r) {
                        const e = Error('Illegal lexeme "' + a + '" for mode "' + (N.scope || "<unnamed>") + '"')
                        ;
                        throw e.mode = N, e
                    }
                    if ("end" === s.type) {
                        const e = b(s);
                        if (e !== ee) return e
                    }
                    if ("illegal" === s.type && "" === a) return 1
                        ;
                    if (A > 1e5 && A > 3 * s.index) throw Error("potential infinite loop, way more iterations than matches")
                        ;
                    return S += a, a.length
                }

                const y = O(e)
                ;
                if (!y) throw K(a.replace("{}", e)), Error('Unknown language: "' + e + '"')
                    ;
                const _ = V(y);
                let v = "", N = s || _;
                const k = {}, M = new g.__emitter(g);
                (() => {
                    const e = []
                    ;
                    for (let t = N; t !== y; t = t.parent) t.scope && e.unshift(t.scope)
                    ;
                    e.forEach((e => M.openNode(e)))
                })();
                let S = "", R = 0, j = 0, A = 0, I = !1;
                try {
                    for (N.matcher.considerAll(); ;) {
                        A++, I ? I = !1 : N.matcher.considerAll(), N.matcher.lastIndex = j
                        ;const e = N.matcher.exec(t);
                        if (!e) break;
                        const n = w(t.substring(j, e.index), e)
                        ;j = e.index + n
                    }
                    return w(t.substring(j)), M.closeAllNodes(), M.finalize(), v = M.toHTML(), {
                        language: e, value: v, relevance: R, illegal: !1, _emitter: M, _top: N
                    }
                } catch (n) {
                    if (n.message && n.message.includes("Illegal")) return {
                        language: e, value: Y(t),
                        illegal: !0, relevance: 0, _illegalBy: {
                            message: n.message, index: j,
                            context: t.slice(j - 100, j + 100), mode: n.mode, resultSoFar: v
                        }, _emitter: M
                    };
                    if (o) return {
                        language: e, value: Y(t), illegal: !1, relevance: 0, errorRaised: n, _emitter: M, _top: N
                    }
                        ;
                    throw n
                }
            }

            function x(e, t) {
                t = t || g.languages || Object.keys(i);
                const n = (e => {
                        const t = {value: Y(e), illegal: !1, relevance: 0, _top: c, _emitter: new g.__emitter(g)}
                        ;
                        return t._emitter.addText(e), t
                    })(e), r = t.filter(O).filter(N).map((t => E(t, e, !1)))
                ;r.unshift(n);
                const s = r.sort(((e, t) => {
                        if (e.relevance !== t.relevance) return t.relevance - e.relevance
                            ;
                        if (e.language && t.language) {
                            if (O(e.language).supersetOf === t.language) return 1
                                ;
                            if (O(t.language).supersetOf === e.language) return -1
                        }
                        return 0
                    })), [o, a] = s, l = o
                ;
                return l.secondBest = a, l
            }

            function w(e) {
                let t = null;
                const n = (e => {
                    let t = e.className + " ";
                    t += e.parentNode ? e.parentNode.className : ""
                    ;const n = g.languageDetectRe.exec(t);
                    if (n) {
                        const t = O(n[1])
                        ;
                        return t || (W(a.replace("{}", n[1])),
                            W("Falling back to no-highlight mode for this block.", e)), t ? n[1] : "no-highlight"
                    }
                    return t.split(/\s+/).find((e => b(e) || O(e)))
                })(e);
                if (b(n)) return
                    ;
                if (k("before:highlightElement", {
                    el: e, language: n
                }), e.children.length > 0 && (g.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),
                    console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),
                    console.warn("The element with unescaped HTML:"),
                    console.warn(e)), g.throwUnescapedHTML)) throw new J("One of your code blocks includes unescaped HTML.", e.innerHTML)
                    ;
                t = e;
                const i = t.textContent, s = n ? m(i, {language: n, ignoreIllegals: !0}) : x(i)
                ;e.innerHTML = s.value, ((e, t, n) => {
                    const i = t && r[t] || n
                    ;e.classList.add("hljs"), e.classList.add("language-" + i)
                })(e, n, s.language), e.result = {
                    language: s.language, re: s.relevance,
                    relevance: s.relevance
                }, s.secondBest && (e.secondBest = {
                    language: s.secondBest.language, relevance: s.secondBest.relevance
                }), k("after:highlightElement", {el: e, result: s, text: i})
            }

            let y = !1;

            function _() {
                "loading" !== document.readyState ? document.querySelectorAll(g.cssSelector).forEach(w) : y = !0
            }

            function O(e) {
                return e = (e || "").toLowerCase(), i[e] || i[r[e]]
            }

            function v(e, {languageName: t}) {
                "string" == typeof e && (e = [e]), e.forEach((e => {
                    r[e.toLowerCase()] = t
                }))
            }

            function N(e) {
                const t = O(e)
                ;
                return t && !t.disableAutodetect
            }

            function k(e, t) {
                const n = e;
                s.forEach((e => {
                    e[n] && e[n](t)
                }))
            }

            "undefined" != typeof window && window.addEventListener && window.addEventListener("DOMContentLoaded", (() => {
                y && _()
            }), !1), Object.assign(t, {
                highlight: m, highlightAuto: x, highlightAll: _,
                highlightElement: w,
                highlightBlock: e => (X("10.7.0", "highlightBlock will be removed entirely in v12.0"),
                    X("10.7.0", "Please use highlightElement now."), w(e)), configure: e => {
                    g = Q(g, e)
                },
                initHighlighting: () => {
                    _(), X("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.")
                },
                initHighlightingOnLoad: () => {
                    _(), X("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.")
                }, registerLanguage: (e, n) => {
                    let r = null;
                    try {
                        r = n(t)
                    } catch (t) {
                        if (K("Language definition for '{}' could not be registered.".replace("{}", e)),
                            !o) throw t;
                        K(t), r = c
                    }
                    r.name || (r.name = e), i[e] = r, r.rawDefinition = n.bind(null, t), r.aliases && v(r.aliases, {
                        languageName: e
                    })
                }, unregisterLanguage: e => {
                    delete i[e]
                    ;
                    for (const t of Object.keys(r)) r[t] === e && delete r[t]
                },
                listLanguages: () => Object.keys(i), getLanguage: O, registerAliases: v,
                autoDetection: N, inherit: Q, addPlugin: e => {
                    (e => {
                        e["before:highlightBlock"] && !e["before:highlightElement"] && (e["before:highlightElement"] = t => {
                            e["before:highlightBlock"](Object.assign({block: t.el}, t))
                        }), e["after:highlightBlock"] && !e["after:highlightElement"] && (e["after:highlightElement"] = t => {
                            e["after:highlightBlock"](Object.assign({block: t.el}, t))
                        })
                    })(e), s.push(e)
                }
            }), t.debugMode = () => {
                o = !1
            }, t.safeMode = () => {
                o = !0
            }, t.versionString = "11.7.0", t.regex = {
                concat: p, lookahead: d, either: f, optional: h,
                anyNumberOfTimes: u
            };
            for (const t in A) "object" == typeof A[t] && e.exports(A[t])
            ;
            return Object.assign(t, A), t
        })({});
        return te
    }()
;"object" == typeof exports && "undefined" != typeof module && (module.exports = hljs);/*! `javascript` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict"
            ;const e = "[A-Za-z$_][0-9A-Za-z$_]*",
                n = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"],
                a = ["true", "false", "null", "undefined", "NaN", "Infinity"],
                t = ["Object", "Function", "Boolean", "Symbol", "Math", "Date", "Number", "BigInt", "String", "RegExp", "Array", "Float32Array", "Float64Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Int32Array", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array", "Set", "Map", "WeakSet", "WeakMap", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Generator", "GeneratorFunction", "AsyncFunction", "Reflect", "Proxy", "Intl", "WebAssembly"],
                s = ["Error", "EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"],
                r = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"],
                c = ["arguments", "this", "super", "console", "window", "document", "localStorage", "module", "global"],
                i = [].concat(r, t, s)
            ;
            return o => {
                const l = o.regex, b = e, d = {
                        begin: /<[A-Za-z0-9\\._:-]+/,
                        end: /\/[A-Za-z0-9\\._:-]+>|\/>/, isTrulyOpeningTag: (e, n) => {
                            const a = e[0].length + e.index, t = e.input[a]
                            ;
                            if ("<" === t || "," === t) return void n.ignoreMatch();
                            let s
                            ;">" === t && (((e, {after: n}) => {
                                const a = "</" + e[0].slice(1)
                                ;
                                return -1 !== e.input.indexOf(a, n)
                            })(e, {after: a}) || n.ignoreMatch())
                            ;const r = e.input.substring(a)
                            ;((s = r.match(/^\s*=/)) || (s = r.match(/^\s+extends\s+/)) && 0 === s.index) && n.ignoreMatch()
                        }
                    }, g = {
                        $pattern: e, keyword: n, literal: a, built_in: i, "variable.language": c
                    }, u = "\\.([0-9](_?[0-9])*)", m = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", E = {
                        className: "number", variants: [{
                            begin: `(\\b(${m})((${u})|\\.)?|(${u}))[eE][+-]?([0-9](_?[0-9])*)\\b`
                        }, {
                            begin: `\\b(${m})\\b((${u})\\b|\\.)?|(${u})\\b`
                        }, {
                            begin: "\\b(0|[1-9](_?[0-9])*)n\\b"
                        }, {
                            begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"
                        }, {
                            begin: "\\b0[bB][0-1](_?[0-1])*n?\\b"
                        }, {begin: "\\b0[oO][0-7](_?[0-7])*n?\\b"}, {
                            begin: "\\b0[0-7]+n?\\b"
                        }], relevance: 0
                    }, A = {
                        className: "subst", begin: "\\$\\{",
                        end: "\\}", keywords: g, contains: []
                    }, y = {
                        begin: "html`", end: "", starts: {
                            end: "`",
                            returnEnd: !1, contains: [o.BACKSLASH_ESCAPE, A], subLanguage: "xml"
                        }
                    }, N = {
                        begin: "css`", end: "", starts: {
                            end: "`", returnEnd: !1,
                            contains: [o.BACKSLASH_ESCAPE, A], subLanguage: "css"
                        }
                    }, _ = {
                        className: "string",
                        begin: "`", end: "`", contains: [o.BACKSLASH_ESCAPE, A]
                    }, h = {
                        className: "comment",
                        variants: [o.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
                            relevance: 0, contains: [{
                                begin: "(?=@[A-Za-z]+)", relevance: 0, contains: [{
                                    className: "doctag",
                                    begin: "@[A-Za-z]+"
                                }, {
                                    className: "type", begin: "\\{", end: "\\}", excludeEnd: !0,
                                    excludeBegin: !0, relevance: 0
                                }, {
                                    className: "variable", begin: b + "(?=\\s*(-)|$)",
                                    endsParent: !0, relevance: 0
                                }, {begin: /(?=[^\n])\s/, relevance: 0}]
                            }]
                        }), o.C_BLOCK_COMMENT_MODE, o.C_LINE_COMMENT_MODE]
                    }, f = [o.APOS_STRING_MODE, o.QUOTE_STRING_MODE, y, N, _, {match: /\$\d+/}, E]
                ;A.contains = f.concat({
                    begin: /\{/, end: /\}/, keywords: g, contains: ["self"].concat(f)
                });
                const v = [].concat(h, A.contains), p = v.concat([{
                    begin: /\(/, end: /\)/, keywords: g,
                    contains: ["self"].concat(v)
                }]), S = {
                    className: "params", begin: /\(/, end: /\)/,
                    excludeBegin: !0, excludeEnd: !0, keywords: g, contains: p
                }, w = {
                    variants: [{
                        match: [/class/, /\s+/, b, /\s+/, /extends/, /\s+/, l.concat(b, "(", l.concat(/\./, b), ")*")],
                        scope: {1: "keyword", 3: "title.class", 5: "keyword", 7: "title.class.inherited"}
                    }, {
                        match: [/class/, /\s+/, b], scope: {1: "keyword", 3: "title.class"}
                    }]
                }, R = {
                    relevance: 0,
                    match: l.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
                    className: "title.class", keywords: {_: [...t, ...s]}
                }, O = {
                    variants: [{
                        match: [/function/, /\s+/, b, /(?=\s*\()/]
                    }, {match: [/function/, /\s*(?=\()/]}],
                    className: {1: "keyword", 3: "title.function"}, label: "func.def", contains: [S],
                    illegal: /%/
                }, k = {
                    match: l.concat(/\b/, (I = [...r, "super", "import"], l.concat("(?!", I.join("|"), ")")), b, l.lookahead(/\(/)),
                    className: "title.function", relevance: 0
                };
                var I;
                const x = {
                        begin: l.concat(/\./, l.lookahead(l.concat(b, /(?![0-9A-Za-z$_(])/))), end: b,
                        excludeBegin: !0, keywords: "prototype", className: "property", relevance: 0
                    }, T = {
                        match: [/get|set/, /\s+/, b, /(?=\()/], className: {1: "keyword", 3: "title.function"},
                        contains: [{begin: /\(\)/}, S]
                    }, C = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + o.UNDERSCORE_IDENT_RE + ")\\s*=>", M = {
                        match: [/const|var|let/, /\s+/, b, /\s*/, /=\s*/, /(async\s*)?/, l.lookahead(C)],
                        keywords: "async", className: {1: "keyword", 3: "title.function"}, contains: [S]
                    }
                ;
                return {
                    name: "Javascript", aliases: ["js", "jsx", "mjs", "cjs"], keywords: g, exports: {
                        PARAMS_CONTAINS: p, CLASS_REFERENCE: R
                    }, illegal: /#(?![$_A-z])/,
                    contains: [o.SHEBANG({label: "shebang", binary: "node", relevance: 5}), {
                        label: "use_strict", className: "meta", relevance: 10,
                        begin: /^\s*['"]use (strict|asm)['"]/
                    }, o.APOS_STRING_MODE, o.QUOTE_STRING_MODE, y, N, _, h, {match: /\$\d+/}, E, R, {
                        className: "attr", begin: b + l.lookahead(":"), relevance: 0
                    }, M, {
                        begin: "(" + o.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
                        keywords: "return throw case", relevance: 0, contains: [h, o.REGEXP_MODE, {
                            className: "function", begin: C, returnBegin: !0, end: "\\s*=>", contains: [{
                                className: "params", variants: [{begin: o.UNDERSCORE_IDENT_RE, relevance: 0}, {
                                    className: null, begin: /\(\s*\)/, skip: !0
                                }, {
                                    begin: /\(/, end: /\)/, excludeBegin: !0,
                                    excludeEnd: !0, keywords: g, contains: p
                                }]
                            }]
                        }, {begin: /,/, relevance: 0}, {
                            match: /\s+/,
                            relevance: 0
                        }, {
                            variants: [{begin: "<>", end: "</>"}, {
                                match: /<[A-Za-z0-9\\._:-]+\s*\/>/
                            }, {
                                begin: d.begin,
                                "on:begin": d.isTrulyOpeningTag, end: d.end
                            }], subLanguage: "xml", contains: [{
                                begin: d.begin, end: d.end, skip: !0, contains: ["self"]
                            }]
                        }]
                    }, O, {
                        beginKeywords: "while if switch catch for"
                    }, {
                        begin: "\\b(?!function)" + o.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
                        returnBegin: !0, label: "func.def", contains: [S, o.inherit(o.TITLE_MODE, {
                            begin: b,
                            className: "title.function"
                        })]
                    }, {match: /\.\.\./, relevance: 0}, x, {
                        match: "\\$" + b,
                        relevance: 0
                    }, {
                        match: [/\bconstructor(?=\s*\()/], className: {1: "title.function"},
                        contains: [S]
                    }, k, {
                        relevance: 0, match: /\b[A-Z][A-Z_0-9]+\b/,
                        className: "variable.constant"
                    }, w, T, {match: /\$[(.]/}]
                }
            }
        })()
    ;hljs.registerLanguage("javascript", e)
})();/*! `makefile` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict";
            return e => {
                const i = {
                    className: "variable",
                    variants: [{
                        begin: "\\$\\(" + e.UNDERSCORE_IDENT_RE + "\\)",
                        contains: [e.BACKSLASH_ESCAPE]
                    }, {begin: /\$[@%<?\^\+\*]/}]
                }, a = {
                    className: "string",
                    begin: /"/, end: /"/, contains: [e.BACKSLASH_ESCAPE, i]
                }, n = {
                    className: "variable",
                    begin: /\$\([\w-]+\s/, end: /\)/, keywords: {
                        built_in: "subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
                    }, contains: [i]
                }, s = {begin: "^" + e.UNDERSCORE_IDENT_RE + "\\s*(?=[:+?]?=)"}, r = {
                    className: "section", begin: /^[^\s]+:/, end: /$/, contains: [i]
                };
                return {
                    name: "Makefile", aliases: ["mk", "mak", "make"], keywords: {
                        $pattern: /[\w-]+/,
                        keyword: "define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
                    }, contains: [e.HASH_COMMENT_MODE, i, a, n, s, {
                        className: "meta", begin: /^\.PHONY:/,
                        end: /$/, keywords: {$pattern: /[\.\w]+/, keyword: ".PHONY"}
                    }, r]
                }
            }
        })()
    ;hljs.registerLanguage("makefile", e)
})();/*! `rust` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict";
            return e => {
                const t = e.regex, a = {
                        className: "title.function.invoke", relevance: 0,
                        begin: t.concat(/\b/, /(?!let\b)/, e.IDENT_RE, t.lookahead(/\s*\(/))
                    }, n = "([ui](8|16|32|64|128|size)|f(32|64))?",
                    s = ["drop ", "Copy", "Send", "Sized", "Sync", "Drop", "Fn", "FnMut", "FnOnce", "ToOwned", "Clone", "Debug", "PartialEq", "PartialOrd", "Eq", "Ord", "AsRef", "AsMut", "Into", "From", "Default", "Iterator", "Extend", "IntoIterator", "DoubleEndedIterator", "ExactSizeIterator", "SliceConcatExt", "ToString", "assert!", "assert_eq!", "bitflags!", "bytes!", "cfg!", "col!", "concat!", "concat_idents!", "debug_assert!", "debug_assert_eq!", "env!", "panic!", "file!", "format!", "format_args!", "include_bytes!", "include_str!", "line!", "local_data_key!", "module_path!", "option_env!", "print!", "println!", "select!", "stringify!", "try!", "unimplemented!", "unreachable!", "vec!", "write!", "writeln!", "macro_rules!", "assert_ne!", "debug_assert_ne!"],
                    r = ["i8", "i16", "i32", "i64", "i128", "isize", "u8", "u16", "u32", "u64", "u128", "usize", "f32", "f64", "str", "char", "bool", "Box", "Option", "Result", "String", "Vec"]
                ;
                return {
                    name: "Rust", aliases: ["rs"], keywords: {
                        $pattern: e.IDENT_RE + "!?", type: r,
                        keyword: ["abstract", "as", "async", "await", "become", "box", "break", "const", "continue", "crate", "do", "dyn", "else", "enum", "extern", "false", "final", "fn", "for", "if", "impl", "in", "let", "loop", "macro", "match", "mod", "move", "mut", "override", "priv", "pub", "ref", "return", "self", "Self", "static", "struct", "super", "trait", "true", "try", "type", "typeof", "unsafe", "unsized", "use", "virtual", "where", "while", "yield"],
                        literal: ["true", "false", "Some", "None", "Ok", "Err"], built_in: s
                    }, illegal: "</",
                    contains: [e.C_LINE_COMMENT_MODE, e.COMMENT("/\\*", "\\*/", {
                        contains: ["self"]
                    }), e.inherit(e.QUOTE_STRING_MODE, {begin: /b?"/, illegal: null}), {
                        className: "string", variants: [{begin: /b?r(#*)"(.|\n)*?"\1(?!#)/}, {
                            begin: /b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/
                        }]
                    }, {
                        className: "symbol",
                        begin: /'[a-zA-Z_][a-zA-Z0-9_]*/
                    }, {
                        className: "number", variants: [{
                            begin: "\\b0b([01_]+)" + n
                        }, {begin: "\\b0o([0-7_]+)" + n}, {
                            begin: "\\b0x([A-Fa-f0-9_]+)" + n
                        }, {
                            begin: "\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)" + n
                        }], relevance: 0
                    }, {
                        begin: [/fn/, /\s+/, e.UNDERSCORE_IDENT_RE], className: {
                            1: "keyword",
                            3: "title.function"
                        }
                    }, {
                        className: "meta", begin: "#!?\\[", end: "\\]", contains: [{
                            className: "string", begin: /"/, end: /"/
                        }]
                    }, {
                        begin: [/let/, /\s+/, /(?:mut\s+)?/, e.UNDERSCORE_IDENT_RE], className: {
                            1: "keyword",
                            3: "keyword", 4: "variable"
                        }
                    }, {
                        begin: [/for/, /\s+/, e.UNDERSCORE_IDENT_RE, /\s+/, /in/], className: {
                            1: "keyword",
                            3: "variable", 5: "keyword"
                        }
                    }, {
                        begin: [/type/, /\s+/, e.UNDERSCORE_IDENT_RE],
                        className: {1: "keyword", 3: "title.class"}
                    }, {
                        begin: [/(?:trait|enum|struct|union|impl|for)/, /\s+/, e.UNDERSCORE_IDENT_RE],
                        className: {1: "keyword", 3: "title.class"}
                    }, {
                        begin: e.IDENT_RE + "::", keywords: {
                            keyword: "Self", built_in: s, type: r
                        }
                    }, {className: "punctuation", begin: "->"}, a]
                }
            }
        })()
    ;hljs.registerLanguage("rust", e)
})();/*! `ini` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict";
            return e => {
                const n = e.regex, a = {
                    className: "number",
                    relevance: 0, variants: [{begin: /([+-]+)?[\d]+_[\d_]+/}, {begin: e.NUMBER_RE}]
                }, s = e.COMMENT();
                s.variants = [{begin: /;/, end: /$/}, {begin: /#/, end: /$/}];
                const i = {
                    className: "variable", variants: [{begin: /\$[\w\d"][\w\d_]*/}, {
                        begin: /\$\{(.*?)\}/
                    }]
                }, t = {className: "literal", begin: /\bon|off|true|false|yes|no\b/}, r = {
                    className: "string", contains: [e.BACKSLASH_ESCAPE], variants: [{
                        begin: "'''",
                        end: "'''", relevance: 10
                    }, {begin: '"""', end: '"""', relevance: 10}, {
                        begin: '"', end: '"'
                    }, {begin: "'", end: "'"}]
                }, l = {
                    begin: /\[/, end: /\]/, contains: [s, t, i, r, a, "self"],
                    relevance: 0
                }, c = n.either(/[A-Za-z0-9_-]+/, /"(\\"|[^"])*"/, /'[^']*'/);
                return {
                    name: "TOML, also INI", aliases: ["toml"], case_insensitive: !0, illegal: /\S/,
                    contains: [s, {className: "section", begin: /\[+/, end: /\]+/}, {
                        begin: n.concat(c, "(\\s*\\.\\s*", c, ")*", n.lookahead(/\s*=\s*[^#\s]/)),
                        className: "attr", starts: {end: /$/, contains: [s, l, t, i, r, a]}
                    }]
                }
            }
        })()
    ;hljs.registerLanguage("ini", e)
})();/*! `go` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict";
            return e => {
                const n = {
                    keyword: ["break", "case", "chan", "const", "continue", "default", "defer", "else", "fallthrough", "for", "func", "go", "goto", "if", "import", "interface", "map", "package", "range", "return", "select", "struct", "switch", "type", "var"],
                    type: ["bool", "byte", "complex64", "complex128", "error", "float32", "float64", "int8", "int16", "int32", "int64", "string", "uint8", "uint16", "uint32", "uint64", "int", "uint", "uintptr", "rune"],
                    literal: ["true", "false", "iota", "nil"],
                    built_in: ["append", "cap", "close", "complex", "copy", "imag", "len", "make", "new", "panic", "print", "println", "real", "recover", "delete"]
                };
                return {
                    name: "Go", aliases: ["golang"], keywords: n, illegal: "</",
                    contains: [e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                        className: "string",
                        variants: [e.QUOTE_STRING_MODE, e.APOS_STRING_MODE, {begin: "`", end: "`"}]
                    }, {
                        className: "number", variants: [{
                            begin: e.C_NUMBER_RE + "[i]", relevance: 1
                        }, e.C_NUMBER_MODE]
                    }, {begin: /:=/}, {
                        className: "function", beginKeywords: "func",
                        end: "\\s*(\\{|$)", excludeEnd: !0, contains: [e.TITLE_MODE, {
                            className: "params",
                            begin: /\(/, end: /\)/, endsParent: !0, keywords: n, illegal: /["']/
                        }]
                    }]
                }
            }
        })()
    ;hljs.registerLanguage("go", e)
})();/*! `java` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict"
            ;var e = "\\.([0-9](_*[0-9])*)", a = "[0-9a-fA-F](_*[0-9a-fA-F])*", n = {
                className: "number", variants: [{
                    begin: `(\\b([0-9](_*[0-9])*)((${e})|\\.)?|(${e}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
                }, {begin: `\\b([0-9](_*[0-9])*)((${e})[fFdD]?\\b|\\.([fFdD]\\b)?)`}, {
                    begin: `(${e})[fFdD]?\\b`
                }, {begin: "\\b([0-9](_*[0-9])*)[fFdD]\\b"}, {
                    begin: `\\b0[xX]((${a})\\.?|(${a})?\\.(${a}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
                }, {begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b"}, {begin: `\\b0[xX](${a})[lL]?\\b`}, {
                    begin: "\\b0(_*[0-7])*[lL]?\\b"
                }, {begin: "\\b0[bB][01](_*[01])*[lL]?\\b"}],
                relevance: 0
            };

            function s(e, a, n) {
                return -1 === n ? "" : e.replace(a, (t => s(e, a, n - 1)))
            }

            return e => {
                const a = e.regex, t = "[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*",
                    i = t + s("(?:<" + t + "~~~(?:\\s*,\\s*" + t + "~~~)*>)?", /~~~/g, 2), r = {
                        keyword: ["synchronized", "abstract", "private", "var", "static", "if", "const ", "for", "while", "strictfp", "finally", "protected", "import", "native", "final", "void", "enum", "else", "break", "transient", "catch", "instanceof", "volatile", "case", "assert", "package", "default", "public", "try", "switch", "continue", "throws", "protected", "public", "private", "module", "requires", "exports", "do", "sealed", "yield", "permits"],
                        literal: ["false", "true", "null"],
                        type: ["char", "boolean", "long", "float", "int", "byte", "short", "double"],
                        built_in: ["super", "this"]
                    }, l = {
                        className: "meta", begin: "@" + t, contains: [{
                            begin: /\(/, end: /\)/, contains: ["self"]
                        }]
                    }, c = {
                        className: "params", begin: /\(/,
                        end: /\)/, keywords: r, relevance: 0, contains: [e.C_BLOCK_COMMENT_MODE], endsParent: !0
                    }
                ;
                return {
                    name: "Java", aliases: ["jsp"], keywords: r, illegal: /<\/|#/,
                    contains: [e.COMMENT("/\\*\\*", "\\*/", {
                        relevance: 0, contains: [{
                            begin: /\w+@/,
                            relevance: 0
                        }, {className: "doctag", begin: "@[A-Za-z]+"}]
                    }), {
                        begin: /import java\.[a-z]+\./, keywords: "import", relevance: 2
                    }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE, {
                        begin: /"""/, end: /"""/,
                        className: "string", contains: [e.BACKSLASH_ESCAPE]
                    }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
                        match: [/\b(?:class|interface|enum|extends|implements|new)/, /\s+/, t], className: {
                            1: "keyword", 3: "title.class"
                        }
                    }, {match: /non-sealed/, scope: "keyword"}, {
                        begin: [a.concat(/(?!else)/, t), /\s+/, t, /\s+/, /=(?!=)/], className: {
                            1: "type",
                            3: "variable", 5: "operator"
                        }
                    }, {
                        begin: [/record/, /\s+/, t], className: {
                            1: "keyword",
                            3: "title.class"
                        }, contains: [c, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, {
                        beginKeywords: "new throw return else", relevance: 0
                    }, {
                        begin: ["(?:" + i + "\\s+)", e.UNDERSCORE_IDENT_RE, /\s*(?=\()/], className: {
                            2: "title.function"
                        }, keywords: r, contains: [{
                            className: "params", begin: /\(/,
                            end: /\)/, keywords: r, relevance: 0,
                            contains: [l, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, n, e.C_BLOCK_COMMENT_MODE]
                        }, e.C_LINE_COMMENT_MODE, e.C_BLOCK_COMMENT_MODE]
                    }, n, l]
                }
            }
        })()
    ;hljs.registerLanguage("java", e)
})();/*! `cpp` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
        "use strict";
        return e => {
            const t = e.regex, a = e.COMMENT("//", "$", {
                    contains: [{begin: /\\\n/}]
                }), n = "[a-zA-Z_]\\w*::",
                r = "(?!struct)(decltype\\(auto\\)|" + t.optional(n) + "[a-zA-Z_]\\w*" + t.optional("<[^<>]+>") + ")",
                i = {
                    className: "type", begin: "\\b[a-z\\d_]*_t\\b"
                }, s = {
                    className: "string", variants: [{
                        begin: '(u8?|U|L)?"', end: '"', illegal: "\\n", contains: [e.BACKSLASH_ESCAPE]
                    }, {
                        begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                        end: "'", illegal: "."
                    }, e.END_SAME_AS_BEGIN({
                        begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/, end: /\)([^()\\ ]{0,16})"/
                    })]
                }, c = {
                    className: "number", variants: [{begin: "\\b(0b[01']+)"}, {
                        begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
                    }, {
                        begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                    }], relevance: 0
                }, o = {
                    className: "meta", begin: /#\s*[a-z]+\b/, end: /$/, keywords: {
                        keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                    }, contains: [{begin: /\\\n/, relevance: 0}, e.inherit(s, {className: "string"}), {
                        className: "string", begin: /<.*?>/
                    }, a, e.C_BLOCK_COMMENT_MODE]
                }, l = {
                    className: "title", begin: t.optional(n) + e.IDENT_RE, relevance: 0
                }, d = t.optional(n) + e.IDENT_RE + "\\s*\\(", u = {
                    type: ["bool", "char", "char16_t", "char32_t", "char8_t", "double", "float", "int", "long", "short", "void", "wchar_t", "unsigned", "signed", "const", "static"],
                    keyword: ["alignas", "alignof", "and", "and_eq", "asm", "atomic_cancel", "atomic_commit", "atomic_noexcept", "auto", "bitand", "bitor", "break", "case", "catch", "class", "co_await", "co_return", "co_yield", "compl", "concept", "const_cast|10", "consteval", "constexpr", "constinit", "continue", "decltype", "default", "delete", "do", "dynamic_cast|10", "else", "enum", "explicit", "export", "extern", "false", "final", "for", "friend", "goto", "if", "import", "inline", "module", "mutable", "namespace", "new", "noexcept", "not", "not_eq", "nullptr", "operator", "or", "or_eq", "override", "private", "protected", "public", "reflexpr", "register", "reinterpret_cast|10", "requires", "return", "sizeof", "static_assert", "static_cast|10", "struct", "switch", "synchronized", "template", "this", "thread_local", "throw", "transaction_safe", "transaction_safe_dynamic", "true", "try", "typedef", "typeid", "typename", "union", "using", "virtual", "volatile", "while", "xor", "xor_eq"],
                    literal: ["NULL", "false", "nullopt", "nullptr", "true"], built_in: ["_Pragma"],
                    _type_hints: ["any", "auto_ptr", "barrier", "binary_semaphore", "bitset", "complex", "condition_variable", "condition_variable_any", "counting_semaphore", "deque", "false_type", "future", "imaginary", "initializer_list", "istringstream", "jthread", "latch", "lock_guard", "multimap", "multiset", "mutex", "optional", "ostringstream", "packaged_task", "pair", "promise", "priority_queue", "queue", "recursive_mutex", "recursive_timed_mutex", "scoped_lock", "set", "shared_future", "shared_lock", "shared_mutex", "shared_timed_mutex", "shared_ptr", "stack", "string_view", "stringstream", "timed_mutex", "thread", "true_type", "tuple", "unique_lock", "unique_ptr", "unordered_map", "unordered_multimap", "unordered_multiset", "unordered_set", "variant", "vector", "weak_ptr", "wstring", "wstring_view"]
                }, p = {
                    className: "function.dispatch", relevance: 0, keywords: {
                        _hint: ["abort", "abs", "acos", "apply", "as_const", "asin", "atan", "atan2", "calloc", "ceil", "cerr", "cin", "clog", "cos", "cosh", "cout", "declval", "endl", "exchange", "exit", "exp", "fabs", "floor", "fmod", "forward", "fprintf", "fputs", "free", "frexp", "fscanf", "future", "invoke", "isalnum", "isalpha", "iscntrl", "isdigit", "isgraph", "islower", "isprint", "ispunct", "isspace", "isupper", "isxdigit", "labs", "launder", "ldexp", "log", "log10", "make_pair", "make_shared", "make_shared_for_overwrite", "make_tuple", "make_unique", "malloc", "memchr", "memcmp", "memcpy", "memset", "modf", "move", "pow", "printf", "putchar", "puts", "realloc", "scanf", "sin", "sinh", "snprintf", "sprintf", "sqrt", "sscanf", "std", "stderr", "stdin", "stdout", "strcat", "strchr", "strcmp", "strcpy", "strcspn", "strlen", "strncat", "strncmp", "strncpy", "strpbrk", "strrchr", "strspn", "strstr", "swap", "tan", "tanh", "terminate", "to_underlying", "tolower", "toupper", "vfprintf", "visit", "vprintf", "vsprintf"]
                    },
                    begin: t.concat(/\b/, /(?!decltype)/, /(?!if)/, /(?!for)/, /(?!switch)/, /(?!while)/, e.IDENT_RE, t.lookahead(/(<[^<>]+>|)\s*\(/))
                }, _ = [p, o, i, a, e.C_BLOCK_COMMENT_MODE, c, s], m = {
                    variants: [{begin: /=/, end: /;/}, {
                        begin: /\(/, end: /\)/
                    }, {beginKeywords: "new throw return else", end: /;/}],
                    keywords: u, contains: _.concat([{
                        begin: /\(/, end: /\)/, keywords: u,
                        contains: _.concat(["self"]), relevance: 0
                    }]), relevance: 0
                }, g = {
                    className: "function",
                    begin: "(" + r + "[\\*&\\s]+)+" + d, returnBegin: !0, end: /[{;=]/, excludeEnd: !0,
                    keywords: u, illegal: /[^\w\s\*&:<>.]/, contains: [{
                        begin: "decltype\\(auto\\)",
                        keywords: u, relevance: 0
                    }, {begin: d, returnBegin: !0, contains: [l], relevance: 0}, {
                        begin: /::/, relevance: 0
                    }, {begin: /:/, endsWithParent: !0, contains: [s, c]}, {
                        relevance: 0, match: /,/
                    }, {
                        className: "params", begin: /\(/, end: /\)/, keywords: u,
                        relevance: 0, contains: [a, e.C_BLOCK_COMMENT_MODE, s, c, i, {
                            begin: /\(/, end: /\)/,
                            keywords: u, relevance: 0, contains: ["self", a, e.C_BLOCK_COMMENT_MODE, s, c, i]
                        }]
                    }, i, a, e.C_BLOCK_COMMENT_MODE, o]
                };
            return {
                name: "C++",
                aliases: ["cc", "c++", "h++", "hpp", "hh", "hxx", "cxx"], keywords: u, illegal: "</",
                classNameAliases: {"function.dispatch": "built_in"},
                contains: [].concat(m, g, p, _, [o, {
                    begin: "\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function)\\s*<(?!<)",
                    end: ">", keywords: u, contains: ["self", i]
                }, {begin: e.IDENT_RE + "::", keywords: u}, {
                    match: [/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/, /\s+/, /\w+/],
                    className: {1: "keyword", 3: "title.class"}
                }])
            }
        }
    })();
    hljs.registerLanguage("cpp", e)
})();/*! `lua` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
        "use strict";
        return e => {
            const t = "\\[=*\\[", a = "\\]=*\\]", n = {
                begin: t, end: a, contains: ["self"]
            }, o = [e.COMMENT("--(?!\\[=*\\[)", "$"), e.COMMENT("--\\[=*\\[", a, {
                contains: [n],
                relevance: 10
            })];
            return {
                name: "Lua", keywords: {
                    $pattern: e.UNDERSCORE_IDENT_RE,
                    literal: "true false nil",
                    keyword: "and break do else elseif end for goto if in local not or repeat return then until while",
                    built_in: "_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
                }, contains: o.concat([{
                    className: "function", beginKeywords: "function", end: "\\)",
                    contains: [e.inherit(e.TITLE_MODE, {
                        begin: "([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"
                    }), {
                        className: "params",
                        begin: "\\(", endsWithParent: !0, contains: o
                    }].concat(o)
                }, e.C_NUMBER_MODE, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE, {
                    className: "string",
                    begin: t, end: a, contains: [n], relevance: 5
                }])
            }
        }
    })();
    hljs.registerLanguage("lua", e)
})();/*! `r` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
        "use strict";
        return e => {
            const a = e.regex, n = /(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/,
                i = a.either(/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/, /0[xX][0-9a-fA-F]+(?:[pP][+-]?\d+)?[Li]?/, /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?[Li]?/),
                s = /[=!<>:]=|\|\||&&|:::?|<-|<<-|->>|->|\|>|[-+*\/?!$&|:<=>@^~]|\*\*/,
                t = a.either(/[()]/, /[{}]/, /\[\[/, /[[\]]/, /\\/, /,/)
            ;
            return {
                name: "R", keywords: {
                    $pattern: n,
                    keyword: "function if in break next repeat else for while",
                    literal: "NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
                    built_in: "LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
                }, contains: [e.COMMENT(/#'/, /$/, {
                    contains: [{
                        scope: "doctag", match: /@examples/,
                        starts: {
                            end: a.lookahead(a.either(/\n^#'\s*(?=@[a-zA-Z]+)/, /\n^(?!#')/)),
                            endsParent: !0
                        }
                    }, {
                        scope: "doctag", begin: "@param", end: /$/, contains: [{
                            scope: "variable", variants: [{match: n}, {match: /`(?:\\.|[^`\\])+`/}], endsParent: !0
                        }]
                    }, {scope: "doctag", match: /@[a-zA-Z]+/}, {scope: "keyword", match: /\\[a-zA-Z]+/}]
                }), e.HASH_COMMENT_MODE, {
                    scope: "string", contains: [e.BACKSLASH_ESCAPE],
                    variants: [e.END_SAME_AS_BEGIN({
                        begin: /[rR]"(-*)\(/, end: /\)(-*)"/
                    }), e.END_SAME_AS_BEGIN({
                        begin: /[rR]"(-*)\{/, end: /\}(-*)"/
                    }), e.END_SAME_AS_BEGIN({
                        begin: /[rR]"(-*)\[/, end: /\](-*)"/
                    }), e.END_SAME_AS_BEGIN({
                        begin: /[rR]'(-*)\(/, end: /\)(-*)'/
                    }), e.END_SAME_AS_BEGIN({
                        begin: /[rR]'(-*)\{/, end: /\}(-*)'/
                    }), e.END_SAME_AS_BEGIN({begin: /[rR]'(-*)\[/, end: /\](-*)'/}), {
                        begin: '"', end: '"',
                        relevance: 0
                    }, {begin: "'", end: "'", relevance: 0}]
                }, {
                    relevance: 0, variants: [{
                        scope: {
                            1: "operator", 2: "number"
                        }, match: [s, i]
                    }, {
                        scope: {1: "operator", 2: "number"},
                        match: [/%[^%]*%/, i]
                    }, {scope: {1: "punctuation", 2: "number"}, match: [t, i]}, {
                        scope: {
                            2: "number"
                        }, match: [/[^a-zA-Z0-9._]|^/, i]
                    }]
                }, {
                    scope: {3: "operator"},
                    match: [n, /\s+/, /<-/, /\s+/]
                }, {
                    scope: "operator", relevance: 0, variants: [{match: s}, {
                        match: /%[^%]*%/
                    }]
                }, {scope: "punctuation", relevance: 0, match: t}, {
                    begin: "`", end: "`",
                    contains: [{begin: /\\./}]
                }]
            }
        }
    })();
    hljs.registerLanguage("r", e)
})();/*! `python` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict";
            return e => {
                const n = e.regex, a = /[\p{XID_Start}_]\p{XID_Continue}*/u,
                    i = ["and", "as", "assert", "async", "await", "break", "case", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in", "is", "lambda", "match", "nonlocal|10", "not", "or", "pass", "raise", "return", "try", "while", "with", "yield"],
                    s = {
                        $pattern: /[A-Za-z]\w+|__\w+__/, keyword: i,
                        built_in: ["__import__", "abs", "all", "any", "ascii", "bin", "bool", "breakpoint", "bytearray", "bytes", "callable", "chr", "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "exec", "filter", "float", "format", "frozenset", "getattr", "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max", "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set", "setattr", "slice", "sorted", "staticmethod", "str", "sum", "super", "tuple", "type", "vars", "zip"],
                        literal: ["__debug__", "Ellipsis", "False", "None", "NotImplemented", "True"],
                        type: ["Any", "Callable", "Coroutine", "Dict", "List", "Literal", "Generic", "Optional", "Sequence", "Set", "Tuple", "Type", "Union"]
                    }, t = {className: "meta", begin: /^(>>>|\.\.\.) /}, r = {
                        className: "subst", begin: /\{/,
                        end: /\}/, keywords: s, illegal: /#/
                    }, l = {begin: /\{\{/, relevance: 0}, b = {
                        className: "string", contains: [e.BACKSLASH_ESCAPE], variants: [{
                            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/, end: /'''/,
                            contains: [e.BACKSLASH_ESCAPE, t], relevance: 10
                        }, {
                            begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/, end: /"""/,
                            contains: [e.BACKSLASH_ESCAPE, t], relevance: 10
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])'''/, end: /'''/,
                            contains: [e.BACKSLASH_ESCAPE, t, l, r]
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])"""/,
                            end: /"""/, contains: [e.BACKSLASH_ESCAPE, t, l, r]
                        }, {
                            begin: /([uU]|[rR])'/, end: /'/,
                            relevance: 10
                        }, {begin: /([uU]|[rR])"/, end: /"/, relevance: 10}, {
                            begin: /([bB]|[bB][rR]|[rR][bB])'/, end: /'/
                        }, {
                            begin: /([bB]|[bB][rR]|[rR][bB])"/,
                            end: /"/
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])'/, end: /'/,
                            contains: [e.BACKSLASH_ESCAPE, l, r]
                        }, {
                            begin: /([fF][rR]|[rR][fF]|[fF])"/, end: /"/,
                            contains: [e.BACKSLASH_ESCAPE, l, r]
                        }, e.APOS_STRING_MODE, e.QUOTE_STRING_MODE]
                    }, o = "[0-9](_?[0-9])*", c = `(\\b(${o}))?\\.(${o})|\\b(${o})\\.`, d = "\\b|" + i.join("|"), g = {
                        className: "number", relevance: 0, variants: [{
                            begin: `(\\b(${o})|(${c}))[eE][+-]?(${o})[jJ]?(?=${d})`
                        }, {begin: `(${c})[jJ]?`}, {
                            begin: `\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${d})`
                        }, {
                            begin: `\\b0[bB](_?[01])+[lL]?(?=${d})`
                        }, {
                            begin: `\\b0[oO](_?[0-7])+[lL]?(?=${d})`
                        }, {begin: `\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${d})`}, {
                            begin: `\\b(${o})[jJ](?=${d})`
                        }]
                    }, p = {
                        className: "comment", begin: n.lookahead(/# type:/), end: /$/, keywords: s,
                        contains: [{begin: /# type:/}, {begin: /#/, end: /\b\B/, endsWithParent: !0}]
                    }, m = {
                        className: "params", variants: [{className: "", begin: /\(\s*\)/, skip: !0}, {
                            begin: /\(/,
                            end: /\)/, excludeBegin: !0, excludeEnd: !0, keywords: s,
                            contains: ["self", t, g, b, e.HASH_COMMENT_MODE]
                        }]
                    };
                return r.contains = [b, g, t], {
                    name: "Python", aliases: ["py", "gyp", "ipython"], unicodeRegex: !0, keywords: s,
                    illegal: /(<\/|->|\?)|=>/, contains: [t, g, {begin: /\bself\b/}, {
                        beginKeywords: "if",
                        relevance: 0
                    }, b, p, e.HASH_COMMENT_MODE, {
                        match: [/\bdef/, /\s+/, a], scope: {
                            1: "keyword", 3: "title.function"
                        }, contains: [m]
                    }, {
                        variants: [{
                            match: [/\bclass/, /\s+/, a, /\s*/, /\(\s*/, a, /\s*\)/]
                        }, {match: [/\bclass/, /\s+/, a]}],
                        scope: {1: "keyword", 3: "title.class", 6: "title.class.inherited"}
                    }, {
                        className: "meta", begin: /^[\t ]*@/, end: /(?=#)|$/, contains: [g, m, b]
                    }]
                }
            }
        })()
    ;hljs.registerLanguage("python", e)
})();/*! `c` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
        "use strict";
        return e => {
            const n = e.regex, t = e.COMMENT("//", "$", {
                    contains: [{begin: /\\\n/}]
                }), s = "[a-zA-Z_]\\w*::",
                a = "(decltype\\(auto\\)|" + n.optional(s) + "[a-zA-Z_]\\w*" + n.optional("<[^<>]+>") + ")", r = {
                    className: "type", variants: [{begin: "\\b[a-z\\d_]*_t\\b"}, {
                        match: /\batomic_[a-z]{3,6}\b/
                    }]
                }, i = {
                    className: "string", variants: [{
                        begin: '(u8?|U|L)?"', end: '"', illegal: "\\n", contains: [e.BACKSLASH_ESCAPE]
                    }, {
                        begin: "(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
                        end: "'", illegal: "."
                    }, e.END_SAME_AS_BEGIN({
                        begin: /(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/, end: /\)([^()\\ ]{0,16})"/
                    })]
                }, l = {
                    className: "number", variants: [{begin: "\\b(0b[01']+)"}, {
                        begin: "(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)"
                    }, {
                        begin: "(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
                    }], relevance: 0
                }, o = {
                    className: "meta", begin: /#\s*[a-z]+\b/, end: /$/, keywords: {
                        keyword: "if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
                    }, contains: [{begin: /\\\n/, relevance: 0}, e.inherit(i, {className: "string"}), {
                        className: "string", begin: /<.*?>/
                    }, t, e.C_BLOCK_COMMENT_MODE]
                }, c = {
                    className: "title", begin: n.optional(s) + e.IDENT_RE, relevance: 0
                }, d = n.optional(s) + e.IDENT_RE + "\\s*\\(", u = {
                    keyword: ["asm", "auto", "break", "case", "continue", "default", "do", "else", "enum", "extern", "for", "fortran", "goto", "if", "inline", "register", "restrict", "return", "sizeof", "struct", "switch", "typedef", "union", "volatile", "while", "_Alignas", "_Alignof", "_Atomic", "_Generic", "_Noreturn", "_Static_assert", "_Thread_local", "alignas", "alignof", "noreturn", "static_assert", "thread_local", "_Pragma"],
                    type: ["float", "double", "signed", "unsigned", "int", "short", "long", "char", "void", "_Bool", "_Complex", "_Imaginary", "_Decimal32", "_Decimal64", "_Decimal128", "const", "static", "complex", "bool", "imaginary"],
                    literal: "true false NULL",
                    built_in: "std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"
                }, g = [o, r, t, e.C_BLOCK_COMMENT_MODE, l, i], m = {
                    variants: [{begin: /=/, end: /;/}, {
                        begin: /\(/, end: /\)/
                    }, {beginKeywords: "new throw return else", end: /;/}],
                    keywords: u, contains: g.concat([{
                        begin: /\(/, end: /\)/, keywords: u,
                        contains: g.concat(["self"]), relevance: 0
                    }]), relevance: 0
                }, p = {
                    begin: "(" + a + "[\\*&\\s]+)+" + d, returnBegin: !0, end: /[{;=]/, excludeEnd: !0,
                    keywords: u, illegal: /[^\w\s\*&:<>.]/, contains: [{
                        begin: "decltype\\(auto\\)",
                        keywords: u, relevance: 0
                    }, {
                        begin: d, returnBegin: !0, contains: [e.inherit(c, {
                            className: "title.function"
                        })], relevance: 0
                    }, {relevance: 0, match: /,/}, {
                        className: "params", begin: /\(/, end: /\)/, keywords: u, relevance: 0,
                        contains: [t, e.C_BLOCK_COMMENT_MODE, i, l, r, {
                            begin: /\(/, end: /\)/, keywords: u,
                            relevance: 0, contains: ["self", t, e.C_BLOCK_COMMENT_MODE, i, l, r]
                        }]
                    }, r, t, e.C_BLOCK_COMMENT_MODE, o]
                };
            return {
                name: "C", aliases: ["h"], keywords: u,
                disableAutodetect: !0, illegal: "</", contains: [].concat(m, p, g, [o, {
                    begin: e.IDENT_RE + "::", keywords: u
                }, {
                    className: "class",
                    beginKeywords: "enum class struct union", end: /[{;:<>=]/, contains: [{
                        beginKeywords: "final class struct"
                    }, e.TITLE_MODE]
                }]), exports: {
                    preprocessor: o,
                    strings: i, keywords: u
                }
            }
        }
    })();
    hljs.registerLanguage("c", e)
})();/*! `kotlin` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
        "use strict"
        ;var e = "\\.([0-9](_*[0-9])*)", n = "[0-9a-fA-F](_*[0-9a-fA-F])*", a = {
            className: "number", variants: [{
                begin: `(\\b([0-9](_*[0-9])*)((${e})|\\.)?|(${e}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
            }, {begin: `\\b([0-9](_*[0-9])*)((${e})[fFdD]?\\b|\\.([fFdD]\\b)?)`}, {
                begin: `(${e})[fFdD]?\\b`
            }, {begin: "\\b([0-9](_*[0-9])*)[fFdD]\\b"}, {
                begin: `\\b0[xX]((${n})\\.?|(${n})?\\.(${n}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
            }, {begin: "\\b(0|[1-9](_*[0-9])*)[lL]?\\b"}, {begin: `\\b0[xX](${n})[lL]?\\b`}, {
                begin: "\\b0(_*[0-7])*[lL]?\\b"
            }, {begin: "\\b0[bB][01](_*[01])*[lL]?\\b"}],
            relevance: 0
        };
        return e => {
            const n = {
                keyword: "abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
                built_in: "Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
                literal: "true false null"
            }, i = {
                className: "symbol", begin: e.UNDERSCORE_IDENT_RE + "@"
            }, s = {className: "subst", begin: /\$\{/, end: /\}/, contains: [e.C_NUMBER_MODE]}, t = {
                className: "variable", begin: "\\$" + e.UNDERSCORE_IDENT_RE
            }, r = {
                className: "string",
                variants: [{begin: '"""', end: '"""(?=[^"])', contains: [t, s]}, {
                    begin: "'", end: "'",
                    illegal: /\n/, contains: [e.BACKSLASH_ESCAPE]
                }, {
                    begin: '"', end: '"', illegal: /\n/,
                    contains: [e.BACKSLASH_ESCAPE, t, s]
                }]
            };
            s.contains.push(r);
            const l = {
                className: "meta",
                begin: "@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*" + e.UNDERSCORE_IDENT_RE + ")?"
            }, c = {
                className: "meta", begin: "@" + e.UNDERSCORE_IDENT_RE, contains: [{
                    begin: /\(/,
                    end: /\)/, contains: [e.inherit(r, {className: "string"}), "self"]
                }]
            }, o = a, b = e.COMMENT("/\\*", "\\*/", {contains: [e.C_BLOCK_COMMENT_MODE]}), E = {
                variants: [{className: "type", begin: e.UNDERSCORE_IDENT_RE}, {
                    begin: /\(/, end: /\)/,
                    contains: []
                }]
            }, d = E;
            return d.variants[1].contains = [E], E.variants[1].contains = [d],
                {
                    name: "Kotlin", aliases: ["kt", "kts"], keywords: n,
                    contains: [e.COMMENT("/\\*\\*", "\\*/", {
                        relevance: 0, contains: [{
                            className: "doctag",
                            begin: "@[A-Za-z]+"
                        }]
                    }), e.C_LINE_COMMENT_MODE, b, {
                        className: "keyword",
                        begin: /\b(break|continue|return|this)\b/, starts: {
                            contains: [{
                                className: "symbol",
                                begin: /@\w+/
                            }]
                        }
                    }, i, l, c, {
                        className: "function", beginKeywords: "fun", end: "[(]|$",
                        returnBegin: !0, excludeEnd: !0, keywords: n, relevance: 5, contains: [{
                            begin: e.UNDERSCORE_IDENT_RE + "\\s*\\(", returnBegin: !0, relevance: 0,
                            contains: [e.UNDERSCORE_TITLE_MODE]
                        }, {
                            className: "type", begin: /</, end: />/,
                            keywords: "reified", relevance: 0
                        }, {
                            className: "params", begin: /\(/, end: /\)/,
                            endsParent: !0, keywords: n, relevance: 0, contains: [{
                                begin: /:/, end: /[=,\/]/,
                                endsWithParent: !0, contains: [E, e.C_LINE_COMMENT_MODE, b], relevance: 0
                            }, e.C_LINE_COMMENT_MODE, b, l, c, r, e.C_NUMBER_MODE]
                        }, b]
                    }, {
                        begin: [/class|interface|trait/, /\s+/, e.UNDERSCORE_IDENT_RE], beginScope: {
                            3: "title.class"
                        }, keywords: "class interface trait", end: /[:\{(]|$/, excludeEnd: !0,
                        illegal: "extends implements", contains: [{
                            beginKeywords: "public protected internal private constructor"
                        }, e.UNDERSCORE_TITLE_MODE, {
                            className: "type", begin: /</, end: />/, excludeBegin: !0,
                            excludeEnd: !0, relevance: 0
                        }, {
                            className: "type", begin: /[,:]\s*/, end: /[<\(,){\s]|$/,
                            excludeBegin: !0, returnEnd: !0
                        }, l, c]
                    }, r, {
                        className: "meta", begin: "^#!/usr/bin/env",
                        end: "$", illegal: "\n"
                    }, o]
                }
        }
    })();
    hljs.registerLanguage("kotlin", e)
})();/*! `ruby` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
            "use strict";
            return e => {
                const n = e.regex, a = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",
                    s = n.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/), i = n.concat(s, /(::\w+)*/), t = {
                        "variable.constant": ["__FILE__", "__LINE__", "__ENCODING__"],
                        "variable.language": ["self", "super"],
                        keyword: ["alias", "and", "begin", "BEGIN", "break", "case", "class", "defined", "do", "else", "elsif", "end", "END", "ensure", "for", "if", "in", "module", "next", "not", "or", "redo", "require", "rescue", "retry", "return", "then", "undef", "unless", "until", "when", "while", "yield", "include", "extend", "prepend", "public", "private", "protected", "raise", "throw"],
                        built_in: ["proc", "lambda", "attr_accessor", "attr_reader", "attr_writer", "define_method", "private_constant", "module_function"],
                        literal: ["true", "false", "nil"]
                    }, c = {className: "doctag", begin: "@[A-Za-z]+"}, r = {
                        begin: "#<", end: ">"
                    }, b = [e.COMMENT("#", "$", {
                        contains: [c]
                    }), e.COMMENT("^=begin", "^=end", {
                        contains: [c], relevance: 10
                    }), e.COMMENT("^__END__", e.MATCH_NOTHING_RE)], l = {
                        className: "subst", begin: /#\{/,
                        end: /\}/, keywords: t
                    }, d = {
                        className: "string", contains: [e.BACKSLASH_ESCAPE, l],
                        variants: [{begin: /'/, end: /'/}, {begin: /"/, end: /"/}, {begin: /`/, end: /`/}, {
                            begin: /%[qQwWx]?\(/, end: /\)/
                        }, {begin: /%[qQwWx]?\[/, end: /\]/}, {
                            begin: /%[qQwWx]?\{/, end: /\}/
                        }, {begin: /%[qQwWx]?</, end: />/}, {
                            begin: /%[qQwWx]?\//,
                            end: /\//
                        }, {begin: /%[qQwWx]?%/, end: /%/}, {begin: /%[qQwWx]?-/, end: /-/}, {
                            begin: /%[qQwWx]?\|/, end: /\|/
                        }, {begin: /\B\?(\\\d{1,3})/}, {
                            begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/
                        }, {begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/}, {
                            begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/
                        }, {
                            begin: /\B\?\\(c|C-)[\x20-\x7e]/
                        }, {begin: /\B\?\\?\S/}, {
                            begin: n.concat(/<<[-~]?'?/, n.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),
                            contains: [e.END_SAME_AS_BEGIN({
                                begin: /(\w+)/, end: /(\w+)/,
                                contains: [e.BACKSLASH_ESCAPE, l]
                            })]
                        }]
                    }, o = "[0-9](_?[0-9])*", g = {
                        className: "number",
                        relevance: 0, variants: [{
                            begin: `\\b([1-9](_?[0-9])*|0)(\\.(${o}))?([eE][+-]?(${o})|r)?i?\\b`
                        }, {
                            begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b"
                        }, {
                            begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b"
                        }, {begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b"}, {
                            begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"
                        }, {
                            begin: "\\b0(_?[0-7])+r?i?\\b"
                        }]
                    }, _ = {
                        variants: [{match: /\(\)/}, {
                            className: "params", begin: /\(/, end: /(?=\))/, excludeBegin: !0, endsParent: !0,
                            keywords: t
                        }]
                    }, u = [d, {
                        variants: [{match: [/class\s+/, i, /\s+<\s+/, i]}, {
                            match: [/\b(class|module)\s+/, i]
                        }], scope: {
                            2: "title.class",
                            4: "title.class.inherited"
                        }, keywords: t
                    }, {
                        match: [/(include|extend)\s+/, i], scope: {
                            2: "title.class"
                        }, keywords: t
                    }, {
                        relevance: 0, match: [i, /\.new[. (]/], scope: {
                            1: "title.class"
                        }
                    }, {
                        relevance: 0, match: /\b[A-Z][A-Z_0-9]+\b/,
                        className: "variable.constant"
                    }, {relevance: 0, match: s, scope: "title.class"}, {
                        match: [/def/, /\s+/, a], scope: {1: "keyword", 3: "title.function"}, contains: [_]
                    }, {
                        begin: e.IDENT_RE + "::"
                    }, {
                        className: "symbol",
                        begin: e.UNDERSCORE_IDENT_RE + "(!|\\?)?:", relevance: 0
                    }, {
                        className: "symbol",
                        begin: ":(?!\\s)", contains: [d, {begin: a}], relevance: 0
                    }, g, {
                        className: "variable",
                        begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
                    }, {
                        className: "params", begin: /\|/, end: /\|/, excludeBegin: !0, excludeEnd: !0,
                        relevance: 0, keywords: t
                    }, {
                        begin: "(" + e.RE_STARTERS_RE + "|unless)\\s*",
                        keywords: "unless", contains: [{
                            className: "regexp", contains: [e.BACKSLASH_ESCAPE, l],
                            illegal: /\n/, variants: [{begin: "/", end: "/[a-z]*"}, {begin: /%r\{/, end: /\}[a-z]*/}, {
                                begin: "%r\\(", end: "\\)[a-z]*"
                            }, {begin: "%r!", end: "![a-z]*"}, {
                                begin: "%r\\[",
                                end: "\\][a-z]*"
                            }]
                        }].concat(r, b), relevance: 0
                    }].concat(r, b)
                ;l.contains = u, _.contains = u;
                const m = [{
                    begin: /^\s*=>/, starts: {end: "$", contains: u}
                }, {
                    className: "meta.prompt",
                    begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
                    starts: {end: "$", keywords: t, contains: u}
                }];
                return b.unshift(r), {
                    name: "Ruby",
                    aliases: ["rb", "gemspec", "podspec", "thor", "irb"], keywords: t, illegal: /\/\*/,
                    contains: [e.SHEBANG({binary: "ruby"})].concat(m).concat(b).concat(u)
                }
            }
        })()
    ;hljs.registerLanguage("ruby", e)
})();/*! `yaml` grammar compiled for Highlight.js 11.7.0 */
(() => {
    var e = (() => {
        "use strict";
        return e => {
            const n = "true false yes no null", a = "[\\w#;/?:@&=+$,.~*'()[\\]]+", s = {
                    className: "string", relevance: 0, variants: [{begin: /'/, end: /'/}, {
                        begin: /"/, end: /"/
                    }, {begin: /\S+/}], contains: [e.BACKSLASH_ESCAPE, {
                        className: "template-variable",
                        variants: [{begin: /\{\{/, end: /\}\}/}, {begin: /%\{/, end: /\}/}]
                    }]
                }, i = e.inherit(s, {
                    variants: [{begin: /'/, end: /'/}, {begin: /"/, end: /"/}, {begin: /[^\s,{}[\]]+/}]
                }), l = {
                    end: ",", endsWithParent: !0, excludeEnd: !0, keywords: n, relevance: 0
                }, t = {
                    begin: /\{/,
                    end: /\}/, contains: [l], illegal: "\\n", relevance: 0
                }, g = {
                    begin: "\\[", end: "\\]",
                    contains: [l], illegal: "\\n", relevance: 0
                }, b = [{
                    className: "attr", variants: [{
                        begin: "\\w[\\w :\\/.-]*:(?=[ \t]|$)"
                    }, {begin: '"\\w[\\w :\\/.-]*":(?=[ \t]|$)'}, {
                        begin: "'\\w[\\w :\\/.-]*':(?=[ \t]|$)"
                    }]
                }, {
                    className: "meta", begin: "^---\\s*$",
                    relevance: 10
                }, {
                    className: "string",
                    begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
                }, {
                    begin: "<%[%=-]?", end: "[%-]?%>", subLanguage: "ruby", excludeBegin: !0, excludeEnd: !0,
                    relevance: 0
                }, {className: "type", begin: "!\\w+!" + a}, {
                    className: "type",
                    begin: "!<" + a + ">"
                }, {className: "type", begin: "!" + a}, {
                    className: "type", begin: "!!" + a
                }, {className: "meta", begin: "&" + e.UNDERSCORE_IDENT_RE + "$"}, {
                    className: "meta",
                    begin: "\\*" + e.UNDERSCORE_IDENT_RE + "$"
                }, {
                    className: "bullet", begin: "-(?=[ ]|$)",
                    relevance: 0
                }, e.HASH_COMMENT_MODE, {beginKeywords: n, keywords: {literal: n}}, {
                    className: "number",
                    begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
                }, {className: "number", begin: e.C_NUMBER_RE + "\\b", relevance: 0}, t, g, s], r = [...b]
            ;
            return r.pop(), r.push(i), l.contains = r, {
                name: "YAML", case_insensitive: !0,
                aliases: ["yml"], contains: b
            }
        }
    })();
    hljs.registerLanguage("yaml", e);
    hljs.registerLanguage("f-tree", (hljs) => {
        return ({
            name: "Forester Tree",
            keywords: {
                keyword: "import parallel root sequence m_sequence r_sequence fallback r_fallback inverter force_success force_fail repeat retry timeout delay impl cond",
                literal: "false true",
            },
            contains: [
                { // numbers
                    scope: 'number',
                    begin: '(-?)(\\b0[xXbBoOdD][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?f?|\\.\\d+f?)([eE][-+]?\\d+f?)?)'
                },
                {
                    className: 'string',
                    begin: '"', end: '"'
                },
                {
                    className: 'variable.constant',
                    match: /array|num|object|string|bool|tree/
                },
                {
                    className: 'punctuation',
                    match: /[(){}:,;=>\[\]]/
                },
                {
                    className: 'title.function.invoke',
                    match: /[-_0-9a-zA-Z]+\s*\(\.\.\)/
                },


                hljs.C_LINE_COMMENT_MODE, // single-line comments
                hljs.C_BLOCK_COMMENT_MODE, // comment blocks
            ],
        });
    })
})();