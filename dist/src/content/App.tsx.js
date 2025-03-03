import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/App.tsx.js");if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/three4c/Develop/evi/src/content/App.tsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

import * as RefreshRuntime from "/vendor/react-refresh.js";

import __vite__cjsImport1_react_jsxDevRuntime from "/vendor/.vite-deps-react_jsx-dev-runtime.js__v--e540e4bd.js"; const _jsxDEV = __vite__cjsImport1_react_jsxDevRuntime["jsxDEV"];
var _s = $RefreshSig$();
import __vite__cjsImport2_react from "/vendor/.vite-deps-react.js__v--e540e4bd.js"; const useEffect = __vite__cjsImport2_react["useEffect"]; const useState = __vite__cjsImport2_react["useState"];
import { Textarea } from "/src/components/Textarea.tsx.js";
const DOM_ARRAY = [
    "INPUT",
    "TEXTAREA"
];
const App = ()=>{
    _s();
    const [isShow, setShow] = useState(false);
    const [pos, setPos] = useState({
        top: 0,
        left: 0
    });
    const [size, setSize] = useState({
        width: 0,
        height: 9
    });
    const getElement = (element)=>element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element : null;
    const startVim = (element, e)=>{
        setShow(!isShow);
        const dom = getElement(element);
        if (!dom) {
            return;
        }
        const { top, left, width, height } = dom.getBoundingClientRect();
        setPos({
            top,
            left
        });
        setSize({
            width,
            height
        });
    };
    useEffect(()=>{
        const onKeyDown = (e)=>{
            const activeElement = document.activeElement;
            const element = getElement(activeElement);
            if (!element) {
                return;
            }
            if (!DOM_ARRAY.includes(element.tagName)) {
                return;
            }
            if (e.ctrlKey && e.metaKey && e.key === "e") {
                startVim(element, e);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return ()=>window.removeEventListener("keydown", onKeyDown);
    }, []);
    return isShow ? /*#__PURE__*/ _jsxDEV(Textarea, {
        fontSize: 16,
        top: pos.top,
        left: pos.left,
        width: size.width,
        height: size.height
    }, void 0, false, {
        fileName: "/Users/three4c/Develop/evi/src/content/App.tsx",
        lineNumber: 68,
        columnNumber: 5
    }, this) : null;
};
_s(App, "VeI9NOelQvwrCpbPsC7kv9CCTjY=");
_c = App;
export default App;
var _c;
$RefreshReg$(_c, "App");


window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;

RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
  RefreshRuntime.registerExportsForReactRefresh("/Users/three4c/Develop/evi/src/content/App.tsx", currentExports);
  import.meta.hot.accept((nextExports) => {
    if (!nextExports) return;
    const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("/Users/three4c/Develop/evi/src/content/App.tsx", currentExports, nextExports);
    if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
  });
});
