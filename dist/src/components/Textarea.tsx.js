import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/Textarea.tsx");import _inject from "/vendor/.vite-deps-@stylexjs_stylex_lib_stylex-inject.js__v--e540e4bd.js";
var _inject2 = _inject;
if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/three4c/Develop/evi/src/components/Textarea.tsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
import * as RefreshRuntime from "/vendor/react-refresh.js";
import __vite__cjsImport2_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--e540e4bd.js"; const _jsxDEV = __vite__cjsImport2_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport3_react from "/vendor/.vite-deps-react.js__v--e540e4bd.js"; const _createElement = __vite__cjsImport3_react["createElement"];
var _s = $RefreshSig$();
import __vite__cjsImport4_react from "/vendor/.vite-deps-react.js__v--e540e4bd.js"; const React = __vite__cjsImport4_react.__esModule ? __vite__cjsImport4_react.default : __vite__cjsImport4_react; const useEffect = __vite__cjsImport4_react["useEffect"]; const useState = __vite__cjsImport4_react["useState"];
import * as stylex from "/vendor/.vite-deps-@stylexjs_stylex.js__v--e540e4bd.js";
_inject2(".xmgby6i{border:1px solid #000}", 1000);
_inject2(".xo5v014{line-height:1}", 3000);
_inject2(".x13jbg0v{font-size:var(--fontSize,revert)}", 3000);
_inject2(".xixxii4{position:fixed}", 3000);
_inject2(".xrzbxsz{top:var(--top,revert)}", 4000);
_inject2(".x101gtxs{left:var(--left,revert)}", 4000);
_inject2(".x17fnjtu{width:var(--width,revert)}", 4000);
_inject2(".x1jwls1v{height:var(--height,revert)}", 4000);
_inject2(".x78zum5{display:flex}", 3000);
_inject2(".xdt5ytf{flex-direction:column}", 3000);
_inject2(".x1rg5ohu{display:inline-block}", 3000);
const styles = {
  editor: (fontSize, top, left, width, height) => [{
    "Textarea__styles.editor": "Textarea__styles.editor",
    border: "xmgby6i",
    borderWidth: null,
    borderInlineWidth: null,
    borderInlineStartWidth: null,
    borderLeftWidth: null,
    borderInlineEndWidth: null,
    borderRightWidth: null,
    borderBlockWidth: null,
    borderTopWidth: null,
    borderBottomWidth: null,
    borderStyle: null,
    borderInlineStyle: null,
    borderInlineStartStyle: null,
    borderLeftStyle: null,
    borderInlineEndStyle: null,
    borderRightStyle: null,
    borderBlockStyle: null,
    borderTopStyle: null,
    borderBottomStyle: null,
    borderColor: null,
    borderInlineColor: null,
    borderInlineStartColor: null,
    borderLeftColor: null,
    borderInlineEndColor: null,
    borderRightColor: null,
    borderBlockColor: null,
    borderTopColor: null,
    borderBottomColor: null,
    lineHeight: "xo5v014",
    fontSize: "x13jbg0v",
    position: "xixxii4",
    top: "xrzbxsz",
    left: "x101gtxs",
    insetInlineStart: null,
    insetInlineEnd: null,
    width: "x17fnjtu",
    height: "x1jwls1v",
    $$css: true
  }, {
    "--fontSize": (val => typeof val === "number" ? val + "px" : val != null ? val : "initial")(fontSize),
    "--top": (val => typeof val === "number" ? val + "px" : val != null ? val : "initial")(top),
    "--left": (val => typeof val === "number" ? val + "px" : val != null ? val : "initial")(left),
    "--width": (val => typeof val === "number" ? val + "px" : val != null ? val : "initial")(width),
    "--height": (val => typeof val === "number" ? val + "px" : val != null ? val : "initial")(height)
  }],
  lineWrapper: width => [{
    "Textarea__styles.lineWrapper": "Textarea__styles.lineWrapper",
    display: "x78zum5",
    flexDirection: "xdt5ytf",
    width: "x17fnjtu",
    $$css: true
  }, {
    "--width": (val => typeof val === "number" ? val + "px" : val != null ? val : "initial")(width)
  }]
};
export const Textarea = props => {
  _s();
  const [length, setLength] = useState(0);
  useEffect(() => {
    let sumHeight = props.fontSize;
    let sumLength = 0;
    while (sumHeight < props.height) {
      sumHeight += props.fontSize;
      sumLength++;
    }
    setLength(sumLength);
  }, [props.height, props.fontSize]);
  return /*#__PURE__*/_jsxDEV("div", {
    ...stylex.props(styles.editor(props.fontSize, props.top, props.left, props.width, props.height)),
    children: /*#__PURE__*/_jsxDEV("div", {
      ...stylex.props(styles.lineWrapper(props.fontSize)),
      children: [...Array(length)].map((_, index) => /*#__PURE__*/_createElement("span", {
        ...{
          className: "Textarea__styles.line x1rg5ohu"
        },
        key: index,
        __source: {
          fileName: "/Users/three4c/Develop/evi/src/components/Textarea.tsx",
          lineNumber: 68,
          columnNumber: 11
        },
        __self: this
      }, "~"))
    }, void 0, false, {
      fileName: "/Users/three4c/Develop/evi/src/components/Textarea.tsx",
      lineNumber: 66,
      columnNumber: 7
    }, this)
  }, void 0, false, {
    fileName: "/Users/three4c/Develop/evi/src/components/Textarea.tsx",
    lineNumber: 55,
    columnNumber: 5
  }, this);
};
_s(Textarea, "J4NAy9gK3M3rfj6Zw8E+Vc/3mz0=");
_c = Textarea;
var _c;
$RefreshReg$(_c, "Textarea");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
RefreshRuntime.__hmr_import(import.meta.url).then(currentExports => {
  RefreshRuntime.registerExportsForReactRefresh("/Users/three4c/Develop/evi/src/components/Textarea.tsx", currentExports);
  import.meta.hot.accept(nextExports => {
    if (!nextExports) return;
    const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/three4c/Develop/evi/src/components/Textarea.tsx", currentExports, nextExports);
    if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
  });
});