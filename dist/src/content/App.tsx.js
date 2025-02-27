import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/content/App.tsx.js");if (!window.$RefreshReg$) throw new Error("React refresh preamble was not loaded. Something is wrong.");
const prevRefreshReg = window.$RefreshReg$;
const prevRefreshSig = window.$RefreshSig$;
window.$RefreshReg$ = RefreshRuntime.getRefreshReg("/Users/three4c/Develop/evi/src/content/App.tsx");
window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;

import * as RefreshRuntime from "/vendor/react-refresh.js";

var _s = $RefreshSig$();
import __vite__cjsImport1_react from "/vendor/.vite-deps-react.js__v--e540e4bd.js"; const useEffect = __vite__cjsImport1_react["useEffect"]; const useRef = __vite__cjsImport1_react["useRef"];
const DOM_ARRAY = [
    "INPUT",
    "TEXTAREA"
];
const App = ()=>{
    _s();
    const mode = useRef("insert");
    const pos = useRef({
        start: 0,
        end: 0
    });
    const getElement = (element)=>element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element : null;
    const getLines = (element, start)=>{
        let charCount = 0;
        let currentLine = 0;
        let col = 0;
        const lines = element.value.split("\n");
        for(let i = 0; i < lines.length; i++){
            const linesLength = lines[i].length + 1;
            if (charCount + linesLength > start) {
                currentLine = i;
                col = start - charCount;
                break;
            }
            charCount += linesLength;
        }
        return {
            lines,
            charCount,
            currentLine,
            col
        };
    };
    const startVim = (element, e)=>{
        let { start, end } = pos.current;
        if (mode.current === "normal") {
            start = element.selectionStart || 0;
            end = start + 1;
        }
        const { lines, charCount, currentLine, col } = getLines(element, start);
        if (e.key === "h" && col) {
            if (mode.current === "visual") {
                end--;
            } else {
                start--;
                end = start + 1;
            }
        }
        if (e.key === "l" && col !== lines[currentLine].length - 1) {
            if (mode.current === "visual") {
                end++;
            } else {
                start++;
                end = start + 1;
            }
        }
        if (e.key === "j" && currentLine + 1 < lines.length) {
            const nextLineLength = lines[currentLine + 1].length;
            const next = charCount + lines[currentLine].length + 1;
            if (nextLineLength) {
                const overCharCount = col >= nextLineLength ? col - nextLineLength + 1 : 0;
                start = next + col - overCharCount;
            } else {
                start = next;
            }
            end = start + 1;
        }
        if (e.key === "k" && currentLine > 0) {
            const prevLineLength = lines[currentLine - 1].length;
            const prev = charCount - (lines[currentLine - 1].length + 1);
            if (prevLineLength) {
                const overCharCount = col >= prevLineLength ? col - prevLineLength + 1 : 0;
                start = prev + col - overCharCount;
            } else {
                start = prev;
            }
            end = start + 1;
        }
        if (lines[currentLine].length && col === lines[currentLine].length) {
            start = start - 1;
            end = start + 1;
        }
        if (e.key === "i") {
            end = start;
        }
        if (e.key === "a") {
            start = end;
        }
        if ([
            "i",
            "a"
        ].includes(e.key)) {
            mode.current = "insert";
        }
        if (e.key === "v") {
            mode.current = "visual";
        }
        pos.current = {
            start,
            end
        };
        element.setSelectionRange(start, end);
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
                mode.current = "normal";
            }
            if ([
                "normal",
                "visual"
            ].includes(mode.current)) {
                startVim(element, e);
                e.preventDefault();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return ()=>window.removeEventListener("keydown", onKeyDown);
    }, []);
    return null;
};
_s(App, "qm/poDNH6jfExd4f3gyu3y3E7QI=");
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
