import "/vendor/.vite-deps-chunk-JVWSFFO4.js__v--e540e4bd.js";

// node_modules/@stylexjs/stylex/lib/es/stylex.mjs
var styleq$1 = {};
Object.defineProperty(styleq$1, "__esModule", {
  value: true
});
var styleq_2 = styleq$1.styleq = void 0;
var cache = /* @__PURE__ */ new WeakMap();
var compiledKey = "$$css";
function createStyleq(options) {
  var disableCache;
  var disableMix;
  var transform;
  if (options != null) {
    disableCache = options.disableCache === true;
    disableMix = options.disableMix === true;
    transform = options.transform;
  }
  return function styleq2() {
    var definedProperties = [];
    var className = "";
    var inlineStyle = null;
    var nextCache = disableCache ? null : cache;
    var styles = new Array(arguments.length);
    for (var i = 0; i < arguments.length; i++) {
      styles[i] = arguments[i];
    }
    while (styles.length > 0) {
      var possibleStyle = styles.pop();
      if (possibleStyle == null || possibleStyle === false) {
        continue;
      }
      if (Array.isArray(possibleStyle)) {
        for (var _i = 0; _i < possibleStyle.length; _i++) {
          styles.push(possibleStyle[_i]);
        }
        continue;
      }
      var style = transform != null ? transform(possibleStyle) : possibleStyle;
      if (style.$$css) {
        var classNameChunk = "";
        if (nextCache != null && nextCache.has(style)) {
          var cacheEntry = nextCache.get(style);
          if (cacheEntry != null) {
            classNameChunk = cacheEntry[0];
            definedProperties.push.apply(definedProperties, cacheEntry[1]);
            nextCache = cacheEntry[2];
          }
        } else {
          var definedPropertiesChunk = [];
          for (var prop in style) {
            var value = style[prop];
            if (prop === compiledKey) continue;
            if (typeof value === "string" || value === null) {
              if (!definedProperties.includes(prop)) {
                definedProperties.push(prop);
                if (nextCache != null) {
                  definedPropertiesChunk.push(prop);
                }
                if (typeof value === "string") {
                  classNameChunk += classNameChunk ? " " + value : value;
                }
              }
            } else {
              console.error("styleq: ".concat(prop, " typeof ").concat(String(value), ' is not "string" or "null".'));
            }
          }
          if (nextCache != null) {
            var weakMap = /* @__PURE__ */ new WeakMap();
            nextCache.set(style, [classNameChunk, definedPropertiesChunk, weakMap]);
            nextCache = weakMap;
          }
        }
        if (classNameChunk) {
          className = className ? classNameChunk + " " + className : classNameChunk;
        }
      } else {
        if (disableMix) {
          if (inlineStyle == null) {
            inlineStyle = {};
          }
          inlineStyle = Object.assign({}, style, inlineStyle);
        } else {
          var subStyle = null;
          for (var _prop in style) {
            var _value = style[_prop];
            if (_value !== void 0) {
              if (!definedProperties.includes(_prop)) {
                if (_value != null) {
                  if (inlineStyle == null) {
                    inlineStyle = {};
                  }
                  if (subStyle == null) {
                    subStyle = {};
                  }
                  subStyle[_prop] = _value;
                }
                definedProperties.push(_prop);
                nextCache = null;
              }
            }
          }
          if (subStyle != null) {
            inlineStyle = Object.assign(subStyle, inlineStyle);
          }
        }
      }
    }
    var styleProps = [className, inlineStyle];
    return styleProps;
  };
}
var styleq = createStyleq();
styleq_2 = styleq$1.styleq = styleq;
styleq.factory = createStyleq;
var errorForFn = (name) => new Error(`'stylex.${name}' should never be called at runtime. It should be compiled away by '@stylexjs/babel-plugin'`);
var errorForType = (key) => errorForFn(`types.${key}`);
function props() {
  const options = this;
  for (var _len = arguments.length, styles = new Array(_len), _key = 0; _key < _len; _key++) {
    styles[_key] = arguments[_key];
  }
  if (__implementations.props) {
    return __implementations.props.call(options, styles);
  }
  const [className, style] = styleq_2(styles);
  const result = {};
  if (className != null && className !== "") {
    result.className = className;
  }
  if (style != null && Object.keys(style).length > 0) {
    result.style = style;
  }
  return result;
}
function attrs() {
  const {
    className,
    style
  } = props(...arguments);
  const result = {};
  if (className != null && className !== "") {
    result.class = className;
  }
  if (style != null && Object.keys(style).length > 0) {
    result.style = Object.keys(style).map((key) => `${key}:${style[key]};`).join("");
  }
  return result;
}
function stylexCreate(styles) {
  if (__implementations.create != null) {
    const create2 = __implementations.create;
    return create2(styles);
  }
  throw errorForFn("create");
}
function stylexDefineVars(styles) {
  if (__implementations.defineVars) {
    return __implementations.defineVars(styles);
  }
  throw errorForFn("defineVars");
}
var stylexCreateTheme = (baseTokens, overrides) => {
  if (__implementations.createTheme) {
    return __implementations.createTheme(baseTokens, overrides);
  }
  throw errorForFn("createTheme");
};
var stylexInclude = (styles) => {
  if (__implementations.include) {
    return __implementations.include(styles);
  }
  throw errorForFn("include");
};
var create = stylexCreate;
var defineVars = stylexDefineVars;
var createTheme = stylexCreateTheme;
var include = stylexInclude;
var types = {
  angle: (_v) => {
    throw errorForType("angle");
  },
  color: (_v) => {
    throw errorForType("color");
  },
  url: (_v) => {
    throw errorForType("url");
  },
  image: (_v) => {
    throw errorForType("image");
  },
  integer: (_v) => {
    throw errorForType("integer");
  },
  lengthPercentage: (_v) => {
    throw errorForType("lengthPercentage");
  },
  length: (_v) => {
    throw errorForType("length");
  },
  percentage: (_v) => {
    throw errorForType("percentage");
  },
  number: (_v) => {
    throw errorForType("number");
  },
  resolution: (_v) => {
    throw errorForType("resolution");
  },
  time: (_v) => {
    throw errorForType("time");
  },
  transformFunction: (_v) => {
    throw errorForType("transformFunction");
  },
  transformList: (_v) => {
    throw errorForType("transformList");
  }
};
var keyframes = (keyframes2) => {
  if (__implementations.keyframes) {
    return __implementations.keyframes(keyframes2);
  }
  throw errorForFn("keyframes");
};
var firstThatWorks = function() {
  if (__implementations.firstThatWorks) {
    return __implementations.firstThatWorks(...arguments);
  }
  throw errorForFn("firstThatWorks");
};
function _stylex() {
  for (var _len2 = arguments.length, styles = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    styles[_key2] = arguments[_key2];
  }
  const [className] = styleq_2(styles);
  return className;
}
_stylex.props = props;
_stylex.attrs = attrs;
_stylex.create = create;
_stylex.defineVars = defineVars;
_stylex.createTheme = createTheme;
_stylex.include = include;
_stylex.keyframes = keyframes;
_stylex.firstThatWorks = firstThatWorks;
_stylex.types = types;
var __implementations = {};
function __monkey_patch__(key, implementation) {
  if (key === "types") {
    Object.assign(types, implementation);
  } else {
    __implementations[key] = implementation;
  }
}
var legacyMerge = _stylex;
export {
  __monkey_patch__,
  attrs,
  create,
  createTheme,
  _stylex as default,
  defineVars,
  firstThatWorks,
  include,
  keyframes,
  legacyMerge,
  props,
  types
};
//# sourceMappingURL=@stylexjs_stylex.js.map
