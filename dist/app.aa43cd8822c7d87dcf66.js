webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(246);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	var $Object = Object;
	module.exports = {
	  create:     $Object.create,
	  getProto:   $Object.getPrototypeOf,
	  isEnum:     {}.propertyIsEnumerable,
	  getDesc:    $Object.getOwnPropertyDescriptor,
	  setDesc:    $Object.defineProperty,
	  setDescs:   $Object.defineProperties,
	  getKeys:    $Object.keys,
	  getNames:   $Object.getOwnPropertyNames,
	  getSymbols: $Object.getOwnPropertySymbols,
	  each:       [].forEach
	};

/***/ },
/* 8 */,
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    "default": obj
	  };
	};
	
	exports.__esModule = true;

/***/ },
/* 10 */,
/* 11 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	
	exports.__esModule = true;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$assign = __webpack_require__(502)["default"];
	
	exports["default"] = _Object$assign || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};
	
	exports.__esModule = true;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$create = __webpack_require__(503)["default"];
	
	var _Object$setPrototypeOf = __webpack_require__(506)["default"];
	
	exports["default"] = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }
	
	  subClass.prototype = _Object$create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _Object$setPrototypeOf ? _Object$setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};
	
	exports.__esModule = true;

/***/ },
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequire = __webpack_require__(509)['default'];
	
	exports.__esModule = true;
	
	var _squashClickEvent = __webpack_require__(497);
	
	exports.SquashClickEventMixin = _interopRequire(_squashClickEvent);
	
	var _expandedStateHandler = __webpack_require__(496);
	
	exports.ExpandedStateHandlerMixin = _interopRequire(_expandedStateHandler);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var mixin = __webpack_require__(543);
	var assign = __webpack_require__(542);
	
	var mixinProto = mixin({
	  // lifecycle stuff is as you'd expect
	  componentDidMount: mixin.MANY,
	  componentWillMount: mixin.MANY,
	  componentWillReceiveProps: mixin.MANY,
	  shouldComponentUpdate: mixin.ONCE,
	  componentWillUpdate: mixin.MANY,
	  componentDidUpdate: mixin.MANY,
	  componentWillUnmount: mixin.MANY,
	  getChildContext: mixin.MANY_MERGED
	});
	
	function setDefaultProps(reactMixin) {
	  var getDefaultProps = reactMixin.getDefaultProps;
	
	  if (getDefaultProps) {
	    reactMixin.defaultProps = getDefaultProps();
	
	    delete reactMixin.getDefaultProps;
	  }
	}
	
	function setInitialState(reactMixin) {
	  var getInitialState = reactMixin.getInitialState;
	  var componentWillMount = reactMixin.componentWillMount;
	
	  function applyInitialState(instance) {
	    var state = instance.state || {};
	    assign(state, getInitialState.call(instance));
	    instance.state = state;
	  }
	
	  if (getInitialState) {
	    if (!componentWillMount) {
	      reactMixin.componentWillMount = function() {
	        applyInitialState(this);
	      };
	    } else {
	      reactMixin.componentWillMount = function() {
	        applyInitialState(this);
	        componentWillMount.call(this);
	      };
	    }
	
	    delete reactMixin.getInitialState;
	  }
	}
	
	function mixinClass(reactClass, reactMixin) {
	  setDefaultProps(reactMixin);
	  setInitialState(reactMixin);
	
	  var prototypeMethods = {};
	  var staticProps = {};
	
	  Object.keys(reactMixin).forEach(function(key) {
	    if (key === 'mixins') {
	      return; // Handled below to ensure proper order regardless of property iteration order
	    }
	    if (key === 'statics') {
	      return; // gets special handling
	    } else if (typeof reactMixin[key] === 'function') {
	      prototypeMethods[key] = reactMixin[key];
	    } else {
	      staticProps[key] = reactMixin[key];
	    }
	  });
	
	  mixinProto(reactClass.prototype, prototypeMethods);
	
	  var mergePropTypes = function(left, right, key) {
	    if (!left) return right;
	    if (!right) return left;
	
	    var result = {};
	    Object.keys(left).forEach(function(leftKey) {
	      if (!right[leftKey]) {
	        result[leftKey] = left[leftKey];
	      }
	    });
	
	    Object.keys(right).forEach(function(rightKey) {
	      if (left[rightKey]) {
	        result[rightKey] = function checkBothContextTypes() {
	          return right[rightKey].apply(this, arguments) && left[rightKey].apply(this, arguments);
	        };
	      } else {
	        result[rightKey] = right[rightKey];
	      }
	    });
	
	    return result;
	  };
	
	  mixin({
	    childContextTypes: mergePropTypes,
	    contextTypes: mergePropTypes,
	    propTypes: mixin.MANY_MERGED_LOOSE,
	    defaultProps: mixin.MANY_MERGED_LOOSE
	  })(reactClass, staticProps);
	
	  // statics is a special case because it merges directly onto the class
	  if (reactMixin.statics) {
	    Object.getOwnPropertyNames(reactMixin.statics).forEach(function(key) {
	      var left = reactClass[key];
	      var right = reactMixin.statics[key];
	
	      if (left !== undefined && right !== undefined) {
	        throw new TypeError('Cannot mixin statics because statics.' + key + ' and Component.' + key + ' are defined.');
	      }
	
	      reactClass[key] = left !== undefined ? left : right;
	    });
	  }
	
	  // If more mixins are defined, they need to run. This emulate's react's behavior.
	  // See behavior in code at:
	  // https://github.com/facebook/react/blob/41aa3496aa632634f650edbe10d617799922d265/src/isomorphic/classic/class/ReactClass.js#L468
	  // Note the .reverse(). In React, a fresh constructor is created, then all mixins are mixed in recursively,
	  // then the actual spec is mixed in last.
	  //
	  // With ES6 classes, the properties are already there, so smart-mixin mixes functions (a, b) -> b()a(), which is
	  // the opposite of how React does it. If we reverse this array, we basically do the whole logic in reverse,
	  // which makes the result the same. See the test for more.
	  // See also:
	  // https://github.com/facebook/react/blob/41aa3496aa632634f650edbe10d617799922d265/src/isomorphic/classic/class/ReactClass.js#L853
	  if (reactMixin.mixins) {
	    reactMixin.mixins.reverse().forEach(mixinClass.bind(null, reactClass));
	  }
	
	  return reactClass;
	}
	
	module.exports = (function() {
	  var reactMixin = mixinProto;
	
	  reactMixin.onClass = function(reactClass, mixin) {
	    return mixinClass(reactClass, mixin);
	  };
	
	  reactMixin.decorate = function(mixin) {
	    return function(reactClass) {
	      return reactMixin.onClass(reactClass, mixin);
	    };
	  };
	
	  return reactMixin;
	})();


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(271), __esModule: true };

/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(144);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _setPrototypeOf = __webpack_require__(257);
	
	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);
	
	var _create = __webpack_require__(255);
	
	var _create2 = _interopRequireDefault(_create);
	
	var _typeof2 = __webpack_require__(147);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }
	
	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ },
/* 23 */
/***/ function(module, exports) {

	var core = module.exports = {version: '1.2.6'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 24 */,
/* 25 */,
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _typeof2 = __webpack_require__(147);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }
	
	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ },
/* 27 */
[666, 153, 155, 66],
/* 28 */,
/* 29 */,
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = catchErrors;
	
	function catchErrors(_ref) {
	  var filename = _ref.filename;
	  var components = _ref.components;
	  var imports = _ref.imports;
	
	  var _imports = _slicedToArray(imports, 3);
	
	  var React = _imports[0];
	  var ErrorReporter = _imports[1];
	  var reporterOptions = _imports[2];
	
	  if (!React || !React.Component) {
	    throw new Error('imports[0] for react-transform-catch-errors does not look like React.');
	  }
	  if (typeof ErrorReporter !== 'function') {
	    throw new Error('imports[1] for react-transform-catch-errors does not look like a React component.');
	  }
	
	  return function wrapToCatchErrors(ReactClass, componentId) {
	    var originalRender = ReactClass.prototype.render;
	
	    ReactClass.prototype.render = function tryRender() {
	      try {
	        return originalRender.apply(this, arguments);
	      } catch (err) {
	        setTimeout(function () {
	          if (typeof console.reportErrorsAsExceptions !== 'undefined') {
	            var prevReportErrorAsExceptions = console.reportErrorsAsExceptions;
	            // We're in React Native. Don't throw.
	            // Stop react-native from triggering its own error handler
	            console.reportErrorsAsExceptions = false;
	            // Log an error
	            console.error(err);
	            // Reactivate it so other errors are still handled
	            console.reportErrorsAsExceptions = prevReportErrorAsExceptions;
	          } else {
	            throw err;
	          }
	        });
	
	        return React.createElement(ErrorReporter, _extends({
	          error: err,
	          filename: filename
	        }, reporterOptions));
	      }
	    };
	
	    return ReactClass;
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 31 */,
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _styleJs = __webpack_require__(455);
	
	var _styleJs2 = _interopRequireDefault(_styleJs);
	
	var _errorStackParser = __webpack_require__(456);
	
	var _errorStackParser2 = _interopRequireDefault(_errorStackParser);
	
	var _objectAssign = __webpack_require__(458);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _lib = __webpack_require__(454);
	
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var React = _react2['default'];
	var Component = _react.Component;
	var PropTypes = _react.PropTypes;
	
	__$Getters__['React'] = function () {
	  return React;
	};
	
	__$Setters__['React'] = function (value) {
	  React = value;
	};
	
	__$Resetters__['React'] = function () {
	  React = _react2['default'];
	};
	
	__$Getters__['Component'] = function () {
	  return Component;
	};
	
	__$Setters__['Component'] = function (value) {
	  Component = value;
	};
	
	__$Resetters__['Component'] = function () {
	  Component = _react.Component;
	};
	
	__$Getters__['PropTypes'] = function () {
	  return PropTypes;
	};
	
	__$Setters__['PropTypes'] = function (value) {
	  PropTypes = value;
	};
	
	__$Resetters__['PropTypes'] = function () {
	  PropTypes = _react.PropTypes;
	};
	
	var style = _styleJs2['default'];
	
	__$Getters__['style'] = function () {
	  return style;
	};
	
	__$Setters__['style'] = function (value) {
	  style = value;
	};
	
	__$Resetters__['style'] = function () {
	  style = _styleJs2['default'];
	};
	
	var ErrorStackParser = _errorStackParser2['default'];
	
	__$Getters__['ErrorStackParser'] = function () {
	  return ErrorStackParser;
	};
	
	__$Setters__['ErrorStackParser'] = function (value) {
	  ErrorStackParser = value;
	};
	
	__$Resetters__['ErrorStackParser'] = function () {
	  ErrorStackParser = _errorStackParser2['default'];
	};
	
	var assign = _objectAssign2['default'];
	
	__$Getters__['assign'] = function () {
	  return assign;
	};
	
	__$Setters__['assign'] = function (value) {
	  assign = value;
	};
	
	__$Resetters__['assign'] = function () {
	  assign = _objectAssign2['default'];
	};
	
	var isFilenameAbsolute = _lib.isFilenameAbsolute;
	var makeUrl = _lib.makeUrl;
	var makeLinkText = _lib.makeLinkText;
	
	__$Getters__['isFilenameAbsolute'] = function () {
	  return isFilenameAbsolute;
	};
	
	__$Setters__['isFilenameAbsolute'] = function (value) {
	  isFilenameAbsolute = value;
	};
	
	__$Resetters__['isFilenameAbsolute'] = function () {
	  isFilenameAbsolute = _lib.isFilenameAbsolute;
	};
	
	__$Getters__['makeUrl'] = function () {
	  return makeUrl;
	};
	
	__$Setters__['makeUrl'] = function (value) {
	  makeUrl = value;
	};
	
	__$Resetters__['makeUrl'] = function () {
	  makeUrl = _lib.makeUrl;
	};
	
	__$Getters__['makeLinkText'] = function () {
	  return makeLinkText;
	};
	
	__$Setters__['makeLinkText'] = function (value) {
	  makeLinkText = value;
	};
	
	__$Resetters__['makeLinkText'] = function () {
	  makeLinkText = _lib.makeLinkText;
	};
	
	var RedBox = (function (_Component) {
	  _inherits(RedBox, _Component);
	
	  function RedBox() {
	    _classCallCheck(this, RedBox);
	
	    _Component.apply(this, arguments);
	  }
	
	  RedBox.prototype.render = function render() {
	    var _props = this.props;
	    var error = _props.error;
	    var filename = _props.filename;
	    var editorScheme = _props.editorScheme;
	    var useLines = _props.useLines;
	    var useColumns = _props.useColumns;
	
	    var _assign = assign({}, style, this.props.style);
	
	    var redbox = _assign.redbox;
	    var message = _assign.message;
	    var stack = _assign.stack;
	    var frame = _assign.frame;
	    var file = _assign.file;
	    var linkToFile = _assign.linkToFile;
	
	    var frames = ErrorStackParser.parse(error).map(function (f, index) {
	      var text = undefined;
	      var url = undefined;
	
	      if (index === 0 && filename && !isFilenameAbsolute(f.fileName)) {
	        url = makeUrl(filename, editorScheme);
	        text = makeLinkText(filename);
	      } else {
	        var lines = useLines ? f.lineNumber : null;
	        var columns = useColumns ? f.columnNumber : null;
	        url = makeUrl(f.fileName, editorScheme, lines, columns);
	        text = makeLinkText(f.fileName, lines, columns);
	      }
	
	      return React.createElement(
	        'div',
	        { style: frame, key: index },
	        React.createElement(
	          'div',
	          null,
	          f.functionName
	        ),
	        React.createElement(
	          'div',
	          { style: file },
	          React.createElement(
	            'a',
	            { href: url, style: linkToFile },
	            text
	          )
	        )
	      );
	    });
	    return React.createElement(
	      'div',
	      { style: redbox },
	      React.createElement(
	        'div',
	        { style: message },
	        error.name,
	        ': ',
	        error.message
	      ),
	      React.createElement(
	        'div',
	        { style: stack },
	        frames
	      )
	    );
	  };
	
	  _createClass(RedBox, null, [{
	    key: 'propTypes',
	    value: {
	      error: PropTypes.instanceOf(Error).isRequired,
	      filename: PropTypes.string,
	      editorScheme: PropTypes.string,
	      useLines: PropTypes.bool,
	      useColumns: PropTypes.bool
	    },
	    enumerable: true
	  }, {
	    key: 'displayName',
	    value: 'RedBox',
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      useLines: true,
	      useColumns: true
	    },
	    enumerable: true
	  }]);
	
	  return RedBox;
	})(Component);
	
	var _defaultExport = RedBox;
	
	if (typeof _defaultExport === 'object' || typeof _defaultExport === 'function') {
	  Object.defineProperty(_defaultExport, '__Rewire__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__set__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__ResetDependency__', {
	    'value': __ResetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__GetDependency__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__get__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__RewireAPI__', {
	    'value': __RewireAPI__,
	    'enumberable': false
	  });
	}
	
	exports['default'] = _defaultExport;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	module.exports = exports['default'];

/***/ },
/* 33 */
23,
/* 34 */
7,
/* 35 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports["default"] = function (hex) {
	  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  return result ? {
	    r: parseInt(result[1], 16),
	    g: parseInt(result[2], 16),
	    b: parseInt(result[3], 16)
	  } : null;
	};
	
	module.exports = exports["default"];

/***/ },
/* 42 */
/***/ function(module, exports) {

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	module.exports = isObjectLike;


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	
	/**
	 * Converts `value` to an object if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Object} Returns the object.
	 */
	function toObject(value) {
	  return isObject(value) ? value : Object(value);
	}
	
	module.exports = toObject;


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(85),
	    isLength = __webpack_require__(63),
	    isObjectLike = __webpack_require__(42);
	
	/** `Object#toString` result references. */
	var arrayTag = '[object Array]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};
	
	module.exports = isArray;


/***/ },
/* 45 */
[652, 66, 23, 92],
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */
[666, 530, 534, 131],
/* 54 */,
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _utilsImmutabilityHelper = __webpack_require__(170);
	
	var _utilsImmutabilityHelper2 = _interopRequireDefault(_utilsImmutabilityHelper);
	
	var _utilsStyles = __webpack_require__(329);
	
	var _utilsStyles2 = _interopRequireDefault(_utilsStyles);
	
	// This mixin isn't necessary and will be removed
	
	/**
	 *	@params:
	 *	styles = Current styles.
	 *  props = New style properties that will override the current style.
	 */
	exports['default'] = {
	
	  propTypes: {
	    style: _react2['default'].PropTypes.object
	  },
	
	  //Moved this function to ImmutabilityHelper.merge
	  mergeStyles: function mergeStyles() {
	    return _utilsImmutabilityHelper2['default'].merge.apply(this, arguments);
	  },
	
	  //Moved this function to /utils/styles.js
	  mergeAndPrefix: function mergeAndPrefix() {
	    return _utilsStyles2['default'].mergeAndPrefix.apply(this, arguments);
	  },
	
	  // prepareStyles is used to merge multiple styles, make sure they are flipped to rtl
	  // if needed, and then autoprefix them. It should probably always be used instead of
	  // mergeAndPrefix.
	  //
	  // Never call this on the same style object twice. As a rule of thumb,
	  // only call it when passing style attribute to html elements.
	  // If you call it twice you'll get a warning anyway.
	  prepareStyles: function prepareStyles() {
	    return _utilsStyles2['default'].prepareStyles.apply(_utilsStyles2['default'], [this.state && this.state.muiTheme || this.context.muiTheme].concat([].slice.apply(arguments)));
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _baseThemesLightBaseTheme = __webpack_require__(167);
	
	exports['default'] = _interopRequire(_baseThemesLightBaseTheme);
	
	// import deprecatedExport from '../../utils/deprecatedExport';
	
	// export default deprecatedExport(
	//   lightBaseTheme,
	//   'material-ui/lib/styles/raw-themes/light-raw-theme',
	//   'material-ui/lib/styles/baseThemes/lightBaseTheme'
	// );
	module.exports = exports['default'];

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactAddonsUpdate = __webpack_require__(172);
	
	var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);
	
	var _utilsExtend = __webpack_require__(328);
	
	var _utilsExtend2 = _interopRequireDefault(_utilsExtend);
	
	var _getMuiTheme = __webpack_require__(321);
	
	var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);
	
	// import deprecatedExport from '../utils/deprecatedExport';
	
	exports['default'] = // deprecatedExport(
	{
	  getMuiTheme: _getMuiTheme2['default'],
	  modifyRawThemeSpacing: function modifyRawThemeSpacing(muiTheme, spacing) {
	    return (0, _getMuiTheme2['default'])((0, _reactAddonsUpdate2['default'])(muiTheme.baseTheme, { spacing: { $set: spacing } }));
	  },
	  modifyRawThemePalette: function modifyRawThemePalette(muiTheme, palette) {
	    var newPalette = (0, _utilsExtend2['default'])(muiTheme.baseTheme.palette, palette);
	    return (0, _getMuiTheme2['default'])((0, _reactAddonsUpdate2['default'])(muiTheme.baseTheme, { palette: { $set: newPalette } }));
	  },
	  modifyRawThemeFontFamily: function modifyRawThemeFontFamily(muiTheme, fontFamily) {
	    return (0, _getMuiTheme2['default'])((0, _reactAddonsUpdate2['default'])(muiTheme.baseTheme, { fontFamily: { $set: fontFamily } }));
	  }
	};
	// ,
	//  'material-ui/lib/styles/theme-manager',
	//  'material-ui/lib/styles/themeManager'
	//);
	module.exports = exports['default'];

/***/ },
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */
[652, 131, 33, 219],
/* 63 */
/***/ function(module, exports) {

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	module.exports = isLength;


/***/ },
/* 64 */,
/* 65 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 66 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 67 */
[664, 149, 93],
/* 68 */
[665, 93],
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */
212,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */,
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */,
/* 82 */,
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _objType = __webpack_require__(498);
	
	var _objType2 = _interopRequireDefault(_objType);
	
	var _JSONObjectNode = __webpack_require__(493);
	
	var _JSONObjectNode2 = _interopRequireDefault(_JSONObjectNode);
	
	var _JSONArrayNode = __webpack_require__(486);
	
	var _JSONArrayNode2 = _interopRequireDefault(_JSONArrayNode);
	
	var _JSONIterableNode = __webpack_require__(490);
	
	var _JSONIterableNode2 = _interopRequireDefault(_JSONIterableNode);
	
	var _JSONStringNode = __webpack_require__(494);
	
	var _JSONStringNode2 = _interopRequireDefault(_JSONStringNode);
	
	var _JSONNumberNode = __webpack_require__(492);
	
	var _JSONNumberNode2 = _interopRequireDefault(_JSONNumberNode);
	
	var _JSONBooleanNode = __webpack_require__(487);
	
	var _JSONBooleanNode2 = _interopRequireDefault(_JSONBooleanNode);
	
	var _JSONNullNode = __webpack_require__(491);
	
	var _JSONNullNode2 = _interopRequireDefault(_JSONNullNode);
	
	var _JSONDateNode = __webpack_require__(488);
	
	var _JSONDateNode2 = _interopRequireDefault(_JSONDateNode);
	
	var _JSONUndefinedNode = __webpack_require__(495);
	
	var _JSONUndefinedNode2 = _interopRequireDefault(_JSONUndefinedNode);
	
	var _JSONFunctionNode = __webpack_require__(489);
	
	var _JSONFunctionNode2 = _interopRequireDefault(_JSONFunctionNode);
	
	exports['default'] = function (key, value, prevValue, theme, styles, getItemString) {
	  var initialExpanded = arguments.length <= 6 || arguments[6] === undefined ? false : arguments[6];
	
	  var nodeType = _objType2['default'](value);
	  if (nodeType === 'Object') {
	    return _react2['default'].createElement(_JSONObjectNode2['default'], { data: value, previousData: prevValue, theme: theme, initialExpanded: initialExpanded, keyName: key, key: key, styles: styles, getItemString: getItemString });
	  } else if (nodeType === 'Array') {
	    return _react2['default'].createElement(_JSONArrayNode2['default'], { data: value, previousData: prevValue, theme: theme, initialExpanded: initialExpanded, keyName: key, key: key, styles: styles, getItemString: getItemString });
	  } else if (nodeType === 'Iterable') {
	    return _react2['default'].createElement(_JSONIterableNode2['default'], { data: value, previousData: prevValue, theme: theme, initialExpanded: initialExpanded, keyName: key, key: key, styles: styles, getItemString: getItemString });
	  } else if (nodeType === 'String') {
	    return _react2['default'].createElement(_JSONStringNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Number') {
	    return _react2['default'].createElement(_JSONNumberNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Boolean') {
	    return _react2['default'].createElement(_JSONBooleanNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Date') {
	    return _react2['default'].createElement(_JSONDateNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Null') {
	    return _react2['default'].createElement(_JSONNullNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Undefined') {
	    return _react2['default'].createElement(_JSONUndefinedNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  } else if (nodeType === 'Function') {
	    return _react2['default'].createElement(_JSONFunctionNode2['default'], { keyName: key, previousValue: prevValue, theme: theme, value: value, key: key, styles: styles });
	  }
	  return false;
	};
	
	module.exports = exports['default'];

/***/ },
/* 84 */
/***/ function(module, exports) {

	module.exports = {};

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	var isNative = __webpack_require__(620);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	module.exports = getNative;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	var getLength = __webpack_require__(615),
	    isLength = __webpack_require__(63);
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	module.exports = isArrayLike;


/***/ },
/* 87 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var FILTER_HOT = exports.FILTER_HOT = 'hot';
	var FILTER_TOP = exports.FILTER_TOP = 'top';
	var FILTER_DEFAULT = exports.FILTER_DEFAULT = FILTER_HOT;
	
	var FILTERS = {
	  FILTER_DEFAULT: FILTER_DEFAULT,
	  FILTER_HOT: FILTER_HOT,
	  FILTER_TOP: FILTER_TOP
	};
	
	exports.default = FILTERS;

/***/ },
/* 88 */
[638, 267],
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _assign = __webpack_require__(88);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];
	
	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }
	
	  return target;
	};

/***/ },
/* 90 */
[648, 150],
/* 91 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 92 */
[650, 275],
/* 93 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 94 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 95 */
[653, 7, 98, 148],
/* 96 */
84,
/* 97 */
[658, 45, 23, 65],
/* 98 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 99 */
[661, 7, 94, 27],
/* 100 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */
466,
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(184);


/***/ },
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */,
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */,
/* 123 */,
/* 124 */,
/* 125 */,
/* 126 */,
/* 127 */,
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var styles = {
	  base: {
	    display: 'inline-block',
	    marginLeft: 0,
	    marginTop: 8,
	    marginRight: 5,
	    'float': 'left',
	    transition: '150ms',
	    WebkitTransition: '150ms',
	    MozTransition: '150ms',
	    borderLeft: '5px solid transparent',
	    borderRight: '5px solid transparent',
	    borderTopWidth: 5,
	    borderTopStyle: 'solid',
	    WebkitTransform: 'rotateZ(-90deg)',
	    MozTransform: 'rotateZ(-90deg)',
	    transform: 'rotateZ(-90deg)'
	  },
	  open: {
	    WebkitTransform: 'rotateZ(0deg)',
	    MozTransform: 'rotateZ(0deg)',
	    transform: 'rotateZ(0deg)'
	  }
	};
	
	var JSONArrow = (function (_React$Component) {
	  _inherits(JSONArrow, _React$Component);
	
	  function JSONArrow() {
	    _classCallCheck(this, JSONArrow);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONArrow.prototype.render = function render() {
	    var style = _extends({}, styles.base, {
	      borderTopColor: this.props.theme.base0D
	    });
	    if (this.props.open) {
	      style = _extends({}, style, styles.open);
	    }
	    style = _extends({}, style, this.props.style);
	    return _react2['default'].createElement('div', { style: style, onClick: this.props.onClick });
	  };
	
	  return JSONArrow;
	})(_react2['default'].Component);
	
	exports['default'] = JSONArrow;
	module.exports = exports['default'];

/***/ },
/* 129 */
93,
/* 130 */
65,
/* 131 */
66,
/* 132 */
[653, 34, 223, 521],
/* 133 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = shouldPureComponentUpdate;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _shallowEqual = __webpack_require__(544);
	
	var _shallowEqual2 = _interopRequireDefault(_shallowEqual);
	
	function shouldPureComponentUpdate(nextProps, nextState) {
	  return !(0, _shallowEqual2['default'])(this.props, nextProps) || !(0, _shallowEqual2['default'])(this.state, nextState);
	}
	
	module.exports = exports['default'];

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	var isArrayLike = __webpack_require__(86),
	    isObjectLike = __webpack_require__(42);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Native method references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;
	
	/**
	 * Checks if `value` is classified as an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  return isObjectLike(value) && isArrayLike(value) &&
	    hasOwnProperty.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
	}
	
	module.exports = isArguments;


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	var getNative = __webpack_require__(85),
	    isArrayLike = __webpack_require__(86),
	    isObject = __webpack_require__(35),
	    shimKeys = __webpack_require__(618);
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};
	
	module.exports = keys;


/***/ },
/* 137 */
/***/ function(module, exports) {

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = identity;


/***/ },
/* 138 */,
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reduxDevtools = __webpack_require__(228);
	
	var _reduxDevtoolsLogMonitor = __webpack_require__(484);
	
	var _reduxDevtoolsLogMonitor2 = _interopRequireDefault(_reduxDevtoolsLogMonitor);
	
	var _reduxDevtoolsDockMonitor = __webpack_require__(469);
	
	var _reduxDevtoolsDockMonitor2 = _interopRequireDefault(_reduxDevtoolsDockMonitor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = (0, _reduxDevtools.createDevTools)(_react2.default.createElement(
	  _reduxDevtoolsDockMonitor2.default,
	  {
	    toggleVisibilityKey: 'ctrl-h',
	    changePositionKey: 'ctrl-q' },
	  _react2.default.createElement(_reduxDevtoolsLogMonitor2.default, null)
	));
	module.exports = exports['default'];

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.actions = exports.doubleAsync = exports.increment = exports.COUNTER_INCREMENT = undefined;
	
	var _defineProperty2 = __webpack_require__(261);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _reduxActions = __webpack_require__(82);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// ------------------------------------
	// Constants - Action Types
	// ------------------------------------
	var COUNTER_INCREMENT = exports.COUNTER_INCREMENT = 'COUNTER_INCREMENT';
	
	// ------------------------------------
	// Actions - functions exposed in props
	// ------------------------------------
	
	// increment() => always adds one { payload: 1 }
	// increment(value) => always adds value { payload: value}
	var increment = exports.increment = (0, _reduxActions.createAction)(COUNTER_INCREMENT, function () {
	  var value = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	  return value;
	});
	
	// This is a thunk, meaning it is a function that immediately
	// returns a function for lazy evaluation. It is incredibly useful for
	// creating async actions, especially when combined with redux-thunk!
	// NOTE: This is solely for demonstration purposes. In a real application,
	// you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
	// reducer take care of this logic.
	var doubleAsync = exports.doubleAsync = function doubleAsync() {
	  return function (dispatch, getState) {
	    setTimeout(function () {
	      dispatch(increment(getState().counter));
	    }, 1000);
	  };
	};
	
	var actions = exports.actions = {
	  increment: increment,
	  doubleAsync: doubleAsync
	};
	
	// ------------------------------------
	// Reducer - handle switch ACTION_TYPES
	// ------------------------------------
	exports.default = (0, _reduxActions.handleActions)((0, _defineProperty3.default)({}, COUNTER_INCREMENT, function (state, _ref) {
	  var payload = _ref.payload;
	  return state + payload;
	}), 1);

/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.actionCreators = exports.fetchVideos = exports.DATA_FETCHED = undefined;
	
	var _reduxActions = __webpack_require__(82);
	
	var _snoocoreHot = __webpack_require__(314);
	
	var _snoocoreHot2 = _interopRequireDefault(_snoocoreHot);
	
	var _snoocoreTop = __webpack_require__(315);
	
	var _snoocoreTop2 = _interopRequireDefault(_snoocoreTop);
	
	var _constants = __webpack_require__(87);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// ------------------------------------
	// Constants - Action Types
	// ------------------------------------
	/**
	** Actions to grab the raw video data from the API.
	**/
	
	var DATA_FETCHED = exports.DATA_FETCHED = 'DATA_FETCHED';
	
	// ------------------------------------
	// Action Creators - functions exposed as props
	// ------------------------------------
	
	// Bound action creator that automatically dispatches
	// make AJAX call via snoocore here based on the filter
	var fetchVideos = exports.fetchVideos = (0, _reduxActions.createAction)(DATA_FETCHED, function (filter) {
	  switch (filter) {
	    case _constants2.default.FILTER_HOT:
	      // get data, then dispatch
	      return _snoocoreHot2.default;
	    case _constants2.default.FILTER_TOP:
	      return _snoocoreTop2.default;
	    default:
	      return [];
	  }
	});
	
	var actionCreators = exports.actionCreators = {
	  fetchVideos: fetchVideos
	};
	
	// ------------------------------------
	// Reducer - handles multiple action types
	// ------------------------------------
	exports.default = (0, _reduxActions.handleActions)({
	  DATA_FETCHED: function DATA_FETCHED(state, action) {
	    return action.payload; // []
	  }
	}, []);

/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.actionCreators = exports.setCurrentTab = exports.SET_CURRENT_TAB = undefined;
	
	var _extends2 = __webpack_require__(89);
	
	var _extends3 = _interopRequireDefault(_extends2);
	
	var _reduxActions = __webpack_require__(82);
	
	var _constants = __webpack_require__(87);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// ------------------------------------
	// Constants - Action Types
	// ------------------------------------
	var SET_CURRENT_TAB = exports.SET_CURRENT_TAB = 'SET_CURRENT_TAB';
	
	// ------------------------------------
	// Action Creators - functions exposed in props
	// ------------------------------------
	/**
	returns {
	    type: SET_CURRENT_TAB,
	    payload: {
	      title: 'title',
	      value: 'hot'
	    }
	}
	**/
	var setCurrentTab = exports.setCurrentTab = (0, _reduxActions.createAction)(SET_CURRENT_TAB, function () {
	  var value = arguments.length <= 0 || arguments[0] === undefined ? _constants2.default.FILTER_DEFAULT : arguments[0];
	
	  return {
	    title: 'The ' + value + ' tab',
	    value: value
	  };
	});
	
	var actionCreators = exports.actionCreators = {
	  setCurrentTab: setCurrentTab
	};
	
	// ------------------------------------
	// Reducer - handles multiple action types
	// ------------------------------------
	exports.default = (0, _reduxActions.handleActions)({
	  SET_CURRENT_TAB: function SET_CURRENT_TAB(state, _ref) {
	    var payload = _ref.payload;
	    return (0, _extends3.default)({}, state, {
	      title: payload.title, // new currentTab.title
	      value: payload.value // currentTab.value
	    });
	  }
	}, {
	  title: 'INITIAL TAB',
	  value: 'INITIAL VALUE'
	});

/***/ },
/* 144 */
[640, 269],
/* 145 */
[641, 272],
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(263);

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _symbol = __webpack_require__(258);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _typeof(obj) { return obj && typeof _Symbol !== "undefined" && obj.constructor === _Symbol ? "symbol" : typeof obj; }
	
	exports.default = function (obj) {
	  return obj && typeof _symbol2.default !== "undefined" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ },
/* 148 */
[651, 65],
/* 149 */
[654, 91],
/* 150 */
133,
/* 151 */
/***/ function(module, exports) {

	module.exports = true;

/***/ },
/* 152 */
[659, 95],
/* 153 */
[662, 66],
/* 154 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 155 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _colors = __webpack_require__(168);
	
	var _colors2 = _interopRequireDefault(_colors);
	
	var _utilsColorManipulator = __webpack_require__(169);
	
	var _utilsColorManipulator2 = _interopRequireDefault(_utilsColorManipulator);
	
	var _spacing = __webpack_require__(322);
	
	var _spacing2 = _interopRequireDefault(_spacing);
	
	/*
	 *  Light Theme is the default theme used in material-ui. It is guaranteed to
	 *  have all theme variables needed for every component. Variables not defined
	 *  in a custom theme will default to these values.
	 */
	
	exports['default'] = {
	  spacing: _spacing2['default'],
	  fontFamily: 'Roboto, sans-serif',
	  palette: {
	    primary1Color: _colors2['default'].cyan500,
	    primary2Color: _colors2['default'].cyan700,
	    primary3Color: _colors2['default'].grey400,
	    accent1Color: _colors2['default'].pinkA200,
	    accent2Color: _colors2['default'].grey100,
	    accent3Color: _colors2['default'].grey500,
	    textColor: _colors2['default'].darkBlack,
	    alternateTextColor: _colors2['default'].white,
	    canvasColor: _colors2['default'].white,
	    borderColor: _colors2['default'].grey300,
	    disabledColor: _utilsColorManipulator2['default'].fade(_colors2['default'].darkBlack, 0.3),
	    pickerHeaderColor: _colors2['default'].cyan500,
	    clockCircleColor: _utilsColorManipulator2['default'].fade(_colors2['default'].darkBlack, 0.07)
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 168 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = {
	  red50: '#ffebee',
	  red100: '#ffcdd2',
	  red200: '#ef9a9a',
	  red300: '#e57373',
	  red400: '#ef5350',
	  red500: '#f44336',
	  red600: '#e53935',
	  red700: '#d32f2f',
	  red800: '#c62828',
	  red900: '#b71c1c',
	  redA100: '#ff8a80',
	  redA200: '#ff5252',
	  redA400: '#ff1744',
	  redA700: '#d50000',
	
	  pink50: '#fce4ec',
	  pink100: '#f8bbd0',
	  pink200: '#f48fb1',
	  pink300: '#f06292',
	  pink400: '#ec407a',
	  pink500: '#e91e63',
	  pink600: '#d81b60',
	  pink700: '#c2185b',
	  pink800: '#ad1457',
	  pink900: '#880e4f',
	  pinkA100: '#ff80ab',
	  pinkA200: '#ff4081',
	  pinkA400: '#f50057',
	  pinkA700: '#c51162',
	
	  purple50: '#f3e5f5',
	  purple100: '#e1bee7',
	  purple200: '#ce93d8',
	  purple300: '#ba68c8',
	  purple400: '#ab47bc',
	  purple500: '#9c27b0',
	  purple600: '#8e24aa',
	  purple700: '#7b1fa2',
	  purple800: '#6a1b9a',
	  purple900: '#4a148c',
	  purpleA100: '#ea80fc',
	  purpleA200: '#e040fb',
	  purpleA400: '#d500f9',
	  purpleA700: '#aa00ff',
	
	  deepPurple50: '#ede7f6',
	  deepPurple100: '#d1c4e9',
	  deepPurple200: '#b39ddb',
	  deepPurple300: '#9575cd',
	  deepPurple400: '#7e57c2',
	  deepPurple500: '#673ab7',
	  deepPurple600: '#5e35b1',
	  deepPurple700: '#512da8',
	  deepPurple800: '#4527a0',
	  deepPurple900: '#311b92',
	  deepPurpleA100: '#b388ff',
	  deepPurpleA200: '#7c4dff',
	  deepPurpleA400: '#651fff',
	  deepPurpleA700: '#6200ea',
	
	  indigo50: '#e8eaf6',
	  indigo100: '#c5cae9',
	  indigo200: '#9fa8da',
	  indigo300: '#7986cb',
	  indigo400: '#5c6bc0',
	  indigo500: '#3f51b5',
	  indigo600: '#3949ab',
	  indigo700: '#303f9f',
	  indigo800: '#283593',
	  indigo900: '#1a237e',
	  indigoA100: '#8c9eff',
	  indigoA200: '#536dfe',
	  indigoA400: '#3d5afe',
	  indigoA700: '#304ffe',
	
	  blue50: '#e3f2fd',
	  blue100: '#bbdefb',
	  blue200: '#90caf9',
	  blue300: '#64b5f6',
	  blue400: '#42a5f5',
	  blue500: '#2196f3',
	  blue600: '#1e88e5',
	  blue700: '#1976d2',
	  blue800: '#1565c0',
	  blue900: '#0d47a1',
	  blueA100: '#82b1ff',
	  blueA200: '#448aff',
	  blueA400: '#2979ff',
	  blueA700: '#2962ff',
	
	  lightBlue50: '#e1f5fe',
	  lightBlue100: '#b3e5fc',
	  lightBlue200: '#81d4fa',
	  lightBlue300: '#4fc3f7',
	  lightBlue400: '#29b6f6',
	  lightBlue500: '#03a9f4',
	  lightBlue600: '#039be5',
	  lightBlue700: '#0288d1',
	  lightBlue800: '#0277bd',
	  lightBlue900: '#01579b',
	  lightBlueA100: '#80d8ff',
	  lightBlueA200: '#40c4ff',
	  lightBlueA400: '#00b0ff',
	  lightBlueA700: '#0091ea',
	
	  cyan50: '#e0f7fa',
	  cyan100: '#b2ebf2',
	  cyan200: '#80deea',
	  cyan300: '#4dd0e1',
	  cyan400: '#26c6da',
	  cyan500: '#00bcd4',
	  cyan600: '#00acc1',
	  cyan700: '#0097a7',
	  cyan800: '#00838f',
	  cyan900: '#006064',
	  cyanA100: '#84ffff',
	  cyanA200: '#18ffff',
	  cyanA400: '#00e5ff',
	  cyanA700: '#00b8d4',
	
	  teal50: '#e0f2f1',
	  teal100: '#b2dfdb',
	  teal200: '#80cbc4',
	  teal300: '#4db6ac',
	  teal400: '#26a69a',
	  teal500: '#009688',
	  teal600: '#00897b',
	  teal700: '#00796b',
	  teal800: '#00695c',
	  teal900: '#004d40',
	  tealA100: '#a7ffeb',
	  tealA200: '#64ffda',
	  tealA400: '#1de9b6',
	  tealA700: '#00bfa5',
	
	  green50: '#e8f5e9',
	  green100: '#c8e6c9',
	  green200: '#a5d6a7',
	  green300: '#81c784',
	  green400: '#66bb6a',
	  green500: '#4caf50',
	  green600: '#43a047',
	  green700: '#388e3c',
	  green800: '#2e7d32',
	  green900: '#1b5e20',
	  greenA100: '#b9f6ca',
	  greenA200: '#69f0ae',
	  greenA400: '#00e676',
	  greenA700: '#00c853',
	
	  lightGreen50: '#f1f8e9',
	  lightGreen100: '#dcedc8',
	  lightGreen200: '#c5e1a5',
	  lightGreen300: '#aed581',
	  lightGreen400: '#9ccc65',
	  lightGreen500: '#8bc34a',
	  lightGreen600: '#7cb342',
	  lightGreen700: '#689f38',
	  lightGreen800: '#558b2f',
	  lightGreen900: '#33691e',
	  lightGreenA100: '#ccff90',
	  lightGreenA200: '#b2ff59',
	  lightGreenA400: '#76ff03',
	  lightGreenA700: '#64dd17',
	
	  lime50: '#f9fbe7',
	  lime100: '#f0f4c3',
	  lime200: '#e6ee9c',
	  lime300: '#dce775',
	  lime400: '#d4e157',
	  lime500: '#cddc39',
	  lime600: '#c0ca33',
	  lime700: '#afb42b',
	  lime800: '#9e9d24',
	  lime900: '#827717',
	  limeA100: '#f4ff81',
	  limeA200: '#eeff41',
	  limeA400: '#c6ff00',
	  limeA700: '#aeea00',
	
	  yellow50: '#fffde7',
	  yellow100: '#fff9c4',
	  yellow200: '#fff59d',
	  yellow300: '#fff176',
	  yellow400: '#ffee58',
	  yellow500: '#ffeb3b',
	  yellow600: '#fdd835',
	  yellow700: '#fbc02d',
	  yellow800: '#f9a825',
	  yellow900: '#f57f17',
	  yellowA100: '#ffff8d',
	  yellowA200: '#ffff00',
	  yellowA400: '#ffea00',
	  yellowA700: '#ffd600',
	
	  amber50: '#fff8e1',
	  amber100: '#ffecb3',
	  amber200: '#ffe082',
	  amber300: '#ffd54f',
	  amber400: '#ffca28',
	  amber500: '#ffc107',
	  amber600: '#ffb300',
	  amber700: '#ffa000',
	  amber800: '#ff8f00',
	  amber900: '#ff6f00',
	  amberA100: '#ffe57f',
	  amberA200: '#ffd740',
	  amberA400: '#ffc400',
	  amberA700: '#ffab00',
	
	  orange50: '#fff3e0',
	  orange100: '#ffe0b2',
	  orange200: '#ffcc80',
	  orange300: '#ffb74d',
	  orange400: '#ffa726',
	  orange500: '#ff9800',
	  orange600: '#fb8c00',
	  orange700: '#f57c00',
	  orange800: '#ef6c00',
	  orange900: '#e65100',
	  orangeA100: '#ffd180',
	  orangeA200: '#ffab40',
	  orangeA400: '#ff9100',
	  orangeA700: '#ff6d00',
	
	  deepOrange50: '#fbe9e7',
	  deepOrange100: '#ffccbc',
	  deepOrange200: '#ffab91',
	  deepOrange300: '#ff8a65',
	  deepOrange400: '#ff7043',
	  deepOrange500: '#ff5722',
	  deepOrange600: '#f4511e',
	  deepOrange700: '#e64a19',
	  deepOrange800: '#d84315',
	  deepOrange900: '#bf360c',
	  deepOrangeA100: '#ff9e80',
	  deepOrangeA200: '#ff6e40',
	  deepOrangeA400: '#ff3d00',
	  deepOrangeA700: '#dd2c00',
	
	  brown50: '#efebe9',
	  brown100: '#d7ccc8',
	  brown200: '#bcaaa4',
	  brown300: '#a1887f',
	  brown400: '#8d6e63',
	  brown500: '#795548',
	  brown600: '#6d4c41',
	  brown700: '#5d4037',
	  brown800: '#4e342e',
	  brown900: '#3e2723',
	
	  blueGrey50: '#eceff1',
	  blueGrey100: '#cfd8dc',
	  blueGrey200: '#b0bec5',
	  blueGrey300: '#90a4ae',
	  blueGrey400: '#78909c',
	  blueGrey500: '#607d8b',
	  blueGrey600: '#546e7a',
	  blueGrey700: '#455a64',
	  blueGrey800: '#37474f',
	  blueGrey900: '#263238',
	
	  grey50: '#fafafa',
	  grey100: '#f5f5f5',
	  grey200: '#eeeeee',
	  grey300: '#e0e0e0',
	  grey400: '#bdbdbd',
	  grey500: '#9e9e9e',
	  grey600: '#757575',
	  grey700: '#616161',
	  grey800: '#424242',
	  grey900: '#212121',
	
	  black: '#000000',
	  white: '#ffffff',
	
	  transparent: 'rgba(0, 0, 0, 0)',
	  fullBlack: 'rgba(0, 0, 0, 1)',
	  darkBlack: 'rgba(0, 0, 0, 0.87)',
	  lightBlack: 'rgba(0, 0, 0, 0.54)',
	  minBlack: 'rgba(0, 0, 0, 0.26)',
	  faintBlack: 'rgba(0, 0, 0, 0.12)',
	  fullWhite: 'rgba(255, 255, 255, 1)',
	  darkWhite: 'rgba(255, 255, 255, 0.87)',
	  lightWhite: 'rgba(255, 255, 255, 0.54)'
	};
	module.exports = exports['default'];

/***/ },
/* 169 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = {
	
	  /**
	   * The relative brightness of any point in a colorspace, normalized to 0 for
	   * darkest black and 1 for lightest white. RGB colors only. Does not take
	   * into account alpha values.
	   *
	   * TODO:
	   * - Take into account alpha values.
	   * - Identify why there are minor discrepancies for some use cases
	   *   (i.e. #F0F & #FFF). Note that these cases rarely occur.
	   *
	   * Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	   */
	  _luminance: function _luminance(color) {
	    color = this._decomposeColor(color);
	
	    if (color.type.indexOf('rgb') > -1) {
	      var rgb = color.values.map(function (val) {
	        val /= 255; // normalized
	        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
	      });
	
	      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
	    } else {
	      var message = 'Calculating the relative luminance is not available for ' + 'HSL and HSLA.';
	      console.error(message);
	      return -1;
	    }
	  },
	
	  /**
	   * @params:
	   * additionalValue = An extra value that has been calculated but not included
	   *                   with the original color object, such as an alpha value.
	   */
	  _convertColorToString: function _convertColorToString(color, additonalValue) {
	    var str = color.type + '(' + parseInt(color.values[0]) + ',' + parseInt(color.values[1]) + ',' + parseInt(color.values[2]);
	
	    if (additonalValue !== undefined) {
	      str += ',' + additonalValue + ')';
	    } else if (color.values.length === 4) {
	      str += ',' + color.values[3] + ')';
	    } else {
	      str += ')';
	    }
	
	    return str;
	  },
	
	  // Converts a color from hex format to rgb format.
	  _convertHexToRGB: function _convertHexToRGB(color) {
	    if (color.length === 4) {
	      var extendedColor = '#';
	      for (var i = 1; i < color.length; i++) {
	        extendedColor += color.charAt(i) + color.charAt(i);
	      }
	      color = extendedColor;
	    }
	
	    var values = {
	      r: parseInt(color.substr(1, 2), 16),
	      g: parseInt(color.substr(3, 2), 16),
	      b: parseInt(color.substr(5, 2), 16)
	    };
	
	    return 'rgb(' + values.r + ',' + values.g + ',' + values.b + ')';
	  },
	
	  // Returns the type and values of a color of any given type.
	  _decomposeColor: function _decomposeColor(color) {
	    if (color.charAt(0) === '#') {
	      return this._decomposeColor(this._convertHexToRGB(color));
	    }
	
	    var marker = color.indexOf('(');
	    var type = color.substring(0, marker);
	    var values = color.substring(marker + 1, color.length - 1).split(',');
	
	    return { type: type, values: values };
	  },
	
	  // Set the absolute transparency of a color.
	  // Any existing alpha values are overwritten.
	  fade: function fade(color, amount) {
	    color = this._decomposeColor(color);
	    if (color.type === 'rgb' || color.type === 'hsl') color.type += 'a';
	    return this._convertColorToString(color, amount);
	  },
	
	  // Desaturates rgb and sets opacity to 0.15
	  lighten: function lighten(color, amount) {
	    color = this._decomposeColor(color);
	
	    if (color.type.indexOf('hsl') > -1) {
	      color.values[2] += amount;
	      return this._decomposeColor(this._convertColorToString(color));
	    } else if (color.type.indexOf('rgb') > -1) {
	      for (var i = 0; i < 3; i++) {
	        color.values[i] *= 1 + amount;
	        if (color.values[i] > 255) color.values[i] = 255;
	      }
	    }
	
	    if (color.type.indexOf('a') <= -1) color.type += 'a';
	
	    return this._convertColorToString(color, '0.15');
	  },
	
	  darken: function darken(color, amount) {
	    color = this._decomposeColor(color);
	
	    if (color.type.indexOf('hsl') > -1) {
	      color.values[2] += amount;
	      return this._decomposeColor(this._convertColorToString(color));
	    } else if (color.type.indexOf('rgb') > -1) {
	      for (var i = 0; i < 3; i++) {
	        color.values[i] *= 1 - amount;
	        if (color.values[i] < 0) color.values[i] = 0;
	      }
	    }
	
	    return this._convertColorToString(color);
	  },
	
	  // Calculates the contrast ratio between two colors.
	  //
	  // Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
	  contrastRatio: function contrastRatio(background, foreground) {
	    var lumA = this._luminance(background);
	    var lumB = this._luminance(foreground);
	
	    if (lumA >= lumB) {
	      return ((lumA + 0.05) / (lumB + 0.05)).toFixed(2);
	    } else {
	      return ((lumB + 0.05) / (lumA + 0.05)).toFixed(2);
	    }
	  },
	
	  /**
	   * Determines how readable a color combination is based on its level.
	   * Levels are defined from @LeaVerou:
	   * https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/contrast-ratio.js
	   */
	  contrastRatioLevel: function contrastRatioLevel(background, foreground) {
	    var levels = {
	      'fail': {
	        range: [0, 3],
	        color: 'hsl(0, 100%, 40%)'
	      },
	      'aa-large': {
	        range: [3, 4.5],
	        color: 'hsl(40, 100%, 45%)'
	      },
	      'aa': {
	        range: [4.5, 7],
	        color: 'hsl(80, 60%, 45%)'
	      },
	      'aaa': {
	        range: [7, 22],
	        color: 'hsl(95, 60%, 41%)'
	      }
	    };
	
	    var ratio = this.contrastRatio(background, foreground);
	
	    for (var level in levels) {
	      var range = levels[level].range;
	      if (ratio >= range[0] && ratio <= range[1]) return level;
	    }
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _reactAddonsUpdate = __webpack_require__(172);
	
	var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);
	
	function mergeSingle(objA, objB) {
	  if (!objA) return objB;
	  if (!objB) return objA;
	  return (0, _reactAddonsUpdate2['default'])(objA, { $merge: objB });
	}
	
	exports['default'] = {
	
	  merge: function merge() {
	    var args = Array.prototype.slice.call(arguments, 0);
	    var base = args[0];
	
	    for (var i = 1; i < args.length; i++) {
	      if (args[i]) {
	        base = mergeSingle(base, args[i]);
	      }
	    }
	    return base;
	  },
	
	  mergeItem: function mergeItem(obj, key, newValueObject) {
	    var command = {};
	    command[key] = { $merge: newValueObject };
	    return (0, _reactAddonsUpdate2['default'])(obj, command);
	  },
	
	  push: function push(array, obj) {
	    var newObj = Array.isArray(obj) ? obj : [obj];
	    return (0, _reactAddonsUpdate2['default'])(array, { $push: newObj });
	  },
	
	  shift: function shift(array) {
	    return (0, _reactAddonsUpdate2['default'])(array, { $splice: [[0, 1]] });
	  }
	
	};
	module.exports = exports['default'];

/***/ },
/* 171 */
[674, 72, 104],
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(439);

/***/ },
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.toggleVisibility = toggleVisibility;
	exports.changePosition = changePosition;
	exports.changeSize = changeSize;
	var TOGGLE_VISIBILITY = exports.TOGGLE_VISIBILITY = '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
	function toggleVisibility() {
	  return { type: TOGGLE_VISIBILITY };
	}
	
	var CHANGE_POSITION = exports.CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
	function changePosition() {
	  return { type: CHANGE_POSITION };
	}
	
	var CHANGE_SIZE = exports.CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
	function changeSize(size) {
	  return { type: CHANGE_SIZE, size: size };
	}

/***/ },
/* 214 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var POSITIONS = exports.POSITIONS = ['left', 'top', 'right', 'bottom'];

/***/ },
/* 215 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports.updateScrollTop = updateScrollTop;
	var UPDATE_SCROLL_TOP = exports.UPDATE_SCROLL_TOP = '@@redux-devtools-log-monitor/UPDATE_SCROLL_TOP';
	function updateScrollTop(scrollTop) {
	  return { type: UPDATE_SCROLL_TOP, scrollTop: scrollTop };
	}

/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
	// all credits and original code to the author
	// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
	// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>
	
	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _createClass = __webpack_require__(508)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _grabNode = __webpack_require__(83);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var _themesSolarized = __webpack_require__(499);
	
	var _themesSolarized2 = _interopRequireDefault(_themesSolarized);
	
	var styles = {
	  tree: {
	    border: 0,
	    padding: 0,
	    marginTop: 8,
	    marginBottom: 8,
	    marginLeft: 2,
	    marginRight: 0,
	    fontSize: '0.90em',
	    listStyle: 'none',
	    MozUserSelect: 'none',
	    WebkitUserSelect: 'none'
	  }
	};
	
	var getEmptyStyle = function getEmptyStyle() {
	  return {};
	};
	
	var JSONTree = (function (_React$Component) {
	  _inherits(JSONTree, _React$Component);
	
	  _createClass(JSONTree, null, [{
	    key: 'propTypes',
	    value: {
	      data: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.array, _react2['default'].PropTypes.object]).isRequired
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      expandRoot: true,
	      theme: _themesSolarized2['default'],
	      getArrowStyle: getEmptyStyle,
	      getListStyle: getEmptyStyle,
	      getItemStringStyle: getEmptyStyle,
	      getLabelStyle: getEmptyStyle,
	      getValueStyle: getEmptyStyle,
	      getItemString: function getItemString(type, data, itemType, itemString) {
	        return _react2['default'].createElement(
	          'span',
	          null,
	          itemType,
	          ' ',
	          itemString
	        );
	      }
	    },
	    enumerable: true
	  }]);
	
	  function JSONTree(props) {
	    _classCallCheck(this, JSONTree);
	
	    _React$Component.call(this, props);
	  }
	
	  JSONTree.prototype.render = function render() {
	    var keyName = this.props.keyName || 'root';
	    var getStyles = {
	      getArrowStyle: this.props.getArrowStyle,
	      getListStyle: this.props.getListStyle,
	      getItemStringStyle: this.props.getItemStringStyle,
	      getLabelStyle: this.props.getLabelStyle,
	      getValueStyle: this.props.getValueStyle
	    };
	    var _props = this.props;
	    var data = _props.data;
	    var previousData = _props.previousData;
	    var theme = _props.theme;
	    var getItemString = _props.getItemString;
	    var expandRoot = _props.expandRoot;
	
	    var rootNode = _grabNode2['default'](keyName, data, previousData, theme, getStyles, getItemString, expandRoot);
	    return _react2['default'].createElement(
	      'ul',
	      { style: _extends({}, styles.tree, this.props.style) },
	      rootNode
	    );
	  };
	
	  return JSONTree;
	})(_react2['default'].Component);
	
	exports['default'] = JSONTree;
	module.exports = exports['default'];

/***/ },
/* 217 */
[648, 133],
/* 218 */
91,
/* 219 */
[650, 518],
/* 220 */
94,
/* 221 */
[654, 218],
/* 222 */
[656, 525, 62, 528, 132, 220, 84, 523, 224, 34, 53],
/* 223 */
98,
/* 224 */
[661, 34, 220, 53],
/* 225 */
[665, 129],
/* 226 */
[671, 531, 222],
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(537);
	var Iterators = __webpack_require__(84);
	Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;

/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _instrument = __webpack_require__(229);
	
	exports.instrument = _interopRequire(_instrument);
	exports.ActionCreators = _instrument.ActionCreators;
	exports.ActionTypes = _instrument.ActionTypes;
	
	var _persistState = __webpack_require__(586);
	
	exports.persistState = _interopRequire(_persistState);
	
	var _createDevTools = __webpack_require__(585);
	
	exports.createDevTools = _interopRequire(_createDevTools);

/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = instrument;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashArrayDifference = __webpack_require__(587);
	
	var _lodashArrayDifference2 = _interopRequireDefault(_lodashArrayDifference);
	
	var ActionTypes = {
	  PERFORM_ACTION: 'PERFORM_ACTION',
	  RESET: 'RESET',
	  ROLLBACK: 'ROLLBACK',
	  COMMIT: 'COMMIT',
	  SWEEP: 'SWEEP',
	  TOGGLE_ACTION: 'TOGGLE_ACTION',
	  JUMP_TO_STATE: 'JUMP_TO_STATE',
	  IMPORT_STATE: 'IMPORT_STATE'
	};
	
	exports.ActionTypes = ActionTypes;
	/**
	 * Action creators to change the History state.
	 */
	var ActionCreators = {
	  performAction: function performAction(action) {
	    return { type: ActionTypes.PERFORM_ACTION, action: action, timestamp: Date.now() };
	  },
	
	  reset: function reset() {
	    return { type: ActionTypes.RESET, timestamp: Date.now() };
	  },
	
	  rollback: function rollback() {
	    return { type: ActionTypes.ROLLBACK, timestamp: Date.now() };
	  },
	
	  commit: function commit() {
	    return { type: ActionTypes.COMMIT, timestamp: Date.now() };
	  },
	
	  sweep: function sweep() {
	    return { type: ActionTypes.SWEEP };
	  },
	
	  toggleAction: function toggleAction(id) {
	    return { type: ActionTypes.TOGGLE_ACTION, id: id };
	  },
	
	  jumpToState: function jumpToState(index) {
	    return { type: ActionTypes.JUMP_TO_STATE, index: index };
	  },
	
	  importState: function importState(nextLiftedState) {
	    return { type: ActionTypes.IMPORT_STATE, nextLiftedState: nextLiftedState };
	  }
	};
	
	exports.ActionCreators = ActionCreators;
	var INIT_ACTION = { type: '@@INIT' };
	
	/**
	 * Computes the next entry in the log by applying an action.
	 */
	function computeNextEntry(reducer, action, state, error) {
	  if (error) {
	    return {
	      state: state,
	      error: 'Interrupted by an error up the chain'
	    };
	  }
	
	  var nextState = state;
	  var nextError = undefined;
	  try {
	    nextState = reducer(state, action);
	  } catch (err) {
	    nextError = err.toString();
	    console.error(err.stack || err);
	  }
	
	  return {
	    state: nextState,
	    error: nextError
	  };
	}
	
	/**
	 * Runs the reducer on invalidated actions to get a fresh computation log.
	 */
	function recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds) {
	  // Optimization: exit early and return the same reference
	  // if we know nothing could have changed.
	  if (minInvalidatedStateIndex >= computedStates.length && computedStates.length === stagedActionIds.length) {
	    return computedStates;
	  }
	
	  var nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
	  for (var i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
	    var actionId = stagedActionIds[i];
	    var action = actionsById[actionId].action;
	
	    var previousEntry = nextComputedStates[i - 1];
	    var previousState = previousEntry ? previousEntry.state : committedState;
	    var previousError = previousEntry ? previousEntry.error : undefined;
	
	    var shouldSkip = skippedActionIds.indexOf(actionId) > -1;
	    var entry = shouldSkip ? previousEntry : computeNextEntry(reducer, action, previousState, previousError);
	
	    nextComputedStates.push(entry);
	  }
	
	  return nextComputedStates;
	}
	
	/**
	 * Lifts an app's action into an action on the lifted store.
	 */
	function liftAction(action) {
	  return ActionCreators.performAction(action);
	}
	
	/**
	 * Creates a history state reducer from an app's reducer.
	 */
	function liftReducerWith(reducer, initialCommittedState, monitorReducer) {
	  var initialLiftedState = {
	    monitorState: monitorReducer(undefined, {}),
	    nextActionId: 1,
	    actionsById: { 0: liftAction(INIT_ACTION) },
	    stagedActionIds: [0],
	    skippedActionIds: [],
	    committedState: initialCommittedState,
	    currentStateIndex: 0,
	    computedStates: []
	  };
	
	  /**
	   * Manages how the history actions modify the history state.
	   */
	  return function (liftedState, liftedAction) {
	    if (liftedState === undefined) liftedState = initialLiftedState;
	    var monitorState = liftedState.monitorState;
	    var actionsById = liftedState.actionsById;
	    var nextActionId = liftedState.nextActionId;
	    var stagedActionIds = liftedState.stagedActionIds;
	    var skippedActionIds = liftedState.skippedActionIds;
	    var committedState = liftedState.committedState;
	    var currentStateIndex = liftedState.currentStateIndex;
	    var computedStates = liftedState.computedStates;
	
	    // By default, agressively recompute every state whatever happens.
	    // This has O(n) performance, so we'll override this to a sensible
	    // value whenever we feel like we don't have to recompute the states.
	    var minInvalidatedStateIndex = 0;
	
	    switch (liftedAction.type) {
	      case ActionTypes.RESET:
	        {
	          // Get back to the state the store was created with.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          committedState = initialCommittedState;
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.COMMIT:
	        {
	          // Consider the last committed state the new starting point.
	          // Squash any staged actions into a single committed state.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          committedState = computedStates[currentStateIndex].state;
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.ROLLBACK:
	        {
	          // Forget about any staged actions.
	          // Start again from the last committed state.
	          actionsById = { 0: liftAction(INIT_ACTION) };
	          nextActionId = 1;
	          stagedActionIds = [0];
	          skippedActionIds = [];
	          currentStateIndex = 0;
	          computedStates = [];
	          break;
	        }
	      case ActionTypes.TOGGLE_ACTION:
	        {
	          var _ret = (function () {
	            // Toggle whether an action with given ID is skipped.
	            // Being skipped means it is a no-op during the computation.
	            var actionId = liftedAction.id;
	
	            var index = skippedActionIds.indexOf(actionId);
	            if (index === -1) {
	              skippedActionIds = [actionId].concat(skippedActionIds);
	            } else {
	              skippedActionIds = skippedActionIds.filter(function (id) {
	                return id !== actionId;
	              });
	            }
	            // Optimization: we know history before this action hasn't changed
	            minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
	            return 'break';
	          })();
	
	          if (_ret === 'break') break;
	        }
	      case ActionTypes.JUMP_TO_STATE:
	        {
	          // Without recomputing anything, move the pointer that tell us
	          // which state is considered the current one. Useful for sliders.
	          currentStateIndex = liftedAction.index;
	          // Optimization: we know the history has not changed.
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	      case ActionTypes.SWEEP:
	        {
	          // Forget any actions that are currently being skipped.
	          stagedActionIds = _lodashArrayDifference2['default'](stagedActionIds, skippedActionIds);
	          skippedActionIds = [];
	          currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
	          break;
	        }
	      case ActionTypes.PERFORM_ACTION:
	        {
	          if (currentStateIndex === stagedActionIds.length - 1) {
	            currentStateIndex++;
	          }
	          var actionId = nextActionId++;
	          // Mutation! This is the hottest path, and we optimize on purpose.
	          // It is safe because we set a new key in a cache dictionary.
	          actionsById[actionId] = liftedAction;
	          stagedActionIds = [].concat(stagedActionIds, [actionId]);
	          // Optimization: we know that only the new action needs computing.
	          minInvalidatedStateIndex = stagedActionIds.length - 1;
	          break;
	        }
	      case ActionTypes.IMPORT_STATE:
	        {
	          var _liftedAction$nextLiftedState = liftedAction.nextLiftedState;
	
	          // Completely replace everything.
	          monitorState = _liftedAction$nextLiftedState.monitorState;
	          actionsById = _liftedAction$nextLiftedState.actionsById;
	          nextActionId = _liftedAction$nextLiftedState.nextActionId;
	          stagedActionIds = _liftedAction$nextLiftedState.stagedActionIds;
	          skippedActionIds = _liftedAction$nextLiftedState.skippedActionIds;
	          committedState = _liftedAction$nextLiftedState.committedState;
	          currentStateIndex = _liftedAction$nextLiftedState.currentStateIndex;
	          computedStates = _liftedAction$nextLiftedState.computedStates;
	
	          break;
	        }
	      case '@@redux/INIT':
	        {
	          // Always recompute states on hot reload and init.
	          minInvalidatedStateIndex = 0;
	          break;
	        }
	      default:
	        {
	          // If the action is not recognized, it's a monitor action.
	          // Optimization: a monitor action can't change history.
	          minInvalidatedStateIndex = Infinity;
	          break;
	        }
	    }
	
	    computedStates = recomputeStates(computedStates, minInvalidatedStateIndex, reducer, committedState, actionsById, stagedActionIds, skippedActionIds);
	    monitorState = monitorReducer(monitorState, liftedAction);
	    return {
	      monitorState: monitorState,
	      actionsById: actionsById,
	      nextActionId: nextActionId,
	      stagedActionIds: stagedActionIds,
	      skippedActionIds: skippedActionIds,
	      committedState: committedState,
	      currentStateIndex: currentStateIndex,
	      computedStates: computedStates
	    };
	  };
	}
	
	/**
	 * Provides an app's view into the state of the lifted store.
	 */
	function unliftState(liftedState) {
	  var computedStates = liftedState.computedStates;
	  var currentStateIndex = liftedState.currentStateIndex;
	  var state = computedStates[currentStateIndex].state;
	
	  return state;
	}
	
	/**
	 * Provides an app's view into the lifted store.
	 */
	function unliftStore(liftedStore, liftReducer) {
	  var lastDefinedState = undefined;
	
	  return _extends({}, liftedStore, {
	
	    liftedStore: liftedStore,
	
	    dispatch: function dispatch(action) {
	      liftedStore.dispatch(liftAction(action));
	      return action;
	    },
	
	    getState: function getState() {
	      var state = unliftState(liftedStore.getState());
	      if (state !== undefined) {
	        lastDefinedState = state;
	      }
	      return lastDefinedState;
	    },
	
	    replaceReducer: function replaceReducer(nextReducer) {
	      liftedStore.replaceReducer(liftReducer(nextReducer));
	    }
	  });
	}
	
	/**
	 * Redux instrumentation store enhancer.
	 */
	
	function instrument() {
	  var monitorReducer = arguments.length <= 0 || arguments[0] === undefined ? function () {
	    return null;
	  } : arguments[0];
	
	  return function (createStore) {
	    return function (reducer, initialState) {
	      function liftReducer(r) {
	        return liftReducerWith(r, initialState, monitorReducer);
	      }
	
	      var liftedStore = createStore(liftReducer(reducer));
	      return unliftStore(liftedStore, liftReducer);
	    };
	  };
	}

/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(43);
	
	/**
	 * The base implementation of `get` without support for string paths
	 * and default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} path The path of the property to get.
	 * @param {string} [pathKey] The key representation of path.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path, pathKey) {
	  if (object == null) {
	    return;
	  }
	  if (pathKey !== undefined && pathKey in toObject(object)) {
	    path = [pathKey];
	  }
	  var index = 0,
	      length = path.length;
	
	  while (object != null && index < length) {
	    object = object[path[index++]];
	  }
	  return (index && index == length) ? object : undefined;
	}
	
	module.exports = baseGet;


/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqualDeep = __webpack_require__(599),
	    isObject = __webpack_require__(35),
	    isObjectLike = __webpack_require__(42);
	
	/**
	 * The base implementation of `_.isEqual` without support for `this` binding
	 * `customizer` functions.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, customizer, isLoose, stackA, stackB) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, baseIsEqual, customizer, isLoose, stackA, stackB);
	}
	
	module.exports = baseIsEqual;


/***/ },
/* 232 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	module.exports = baseProperty;


/***/ },
/* 233 */
/***/ function(module, exports) {

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	module.exports = isIndex;


/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(44),
	    toObject = __webpack_require__(43);
	
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\n\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;
	
	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  var type = typeof value;
	  if ((type == 'string' && reIsPlainProp.test(value)) || type == 'number') {
	    return true;
	  }
	  if (isArray(value)) {
	    return false;
	  }
	  var result = !reIsDeepProp.test(value);
	  return result || (object != null && value in toObject(object));
	}
	
	module.exports = isKey;


/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	
	/**
	 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` if suitable for strict
	 *  equality comparisons, else `false`.
	 */
	function isStrictComparable(value) {
	  return value === value && !isObject(value);
	}
	
	module.exports = isStrictComparable;


/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	var baseToString = __webpack_require__(605),
	    isArray = __webpack_require__(44);
	
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g;
	
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	
	/**
	 * Converts `value` to property path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {Array} Returns the property path array.
	 */
	function toPath(value) {
	  if (isArray(value)) {
	    return value;
	  }
	  var result = [];
	  baseToString(value).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	}
	
	module.exports = toPath;


/***/ },
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _class, _temp;
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.GridvideoList = undefined;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	var _gridList = __webpack_require__(316);
	
	var _gridList2 = _interopRequireDefault(_gridList);
	
	var _GridVideoTile = __webpack_require__(242);
	
	var _GridVideoTile2 = _interopRequireDefault(_GridVideoTile);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  GridvideoList: {
	    displayName: 'GridvideoList'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/components/GridVideoList.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	} /**
	  Presentational component to render a grid list of youtube videos, given an array of data:
	  
	  {
	    id: '3ybh3d'
	    title: 'Hello',
	    author: 'AdeleFan',
	    url: 'http://www.youtube.com/embed/M7lc1UVf-VE',
	    media_embed: {
	      content: ''
	    }
	  }
	  
	  **/
	
	var GridvideoList = exports.GridvideoList = _wrapComponent('GridvideoList')((_temp = _class = (function (_React$Component) {
	  (0, _inherits3.default)(GridvideoList, _React$Component);
	
	  function GridvideoList() {
	    (0, _classCallCheck3.default)(this, GridvideoList);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(GridvideoList).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(GridvideoList, [{
	    key: 'render',
	    value: function render() {
	      var videoList = this.props.videoList;
	
	      var renderVideoTile = function renderVideoTile(arrayItem, idx) {
	        var item = arrayItem.data;
	
	        return _react3.default.createElement(_GridVideoTile2.default, {
	          id: item.id,
	          key: item.id,
	          title: item.title,
	          author: item.author,
	          url: item.url,
	          media_embed: item.media_embed });
	      };
	
	      return _react3.default.createElement(
	        _gridList2.default,
	        {
	          cols: 2,
	          cellHeight: 250,
	          padding: 3
	        },
	        videoList.map(renderVideoTile)
	      );
	    }
	  }]);
	  return GridvideoList;
	})(_react3.default.Component), _class.propTypes = {
	  videoList: _react3.default.PropTypes.array
	}, _temp));
	
	exports.default = GridvideoList;

/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _class, _temp;
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.GridVideoTile = undefined;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	var _gridTile = __webpack_require__(317);
	
	var _gridTile2 = _interopRequireDefault(_gridTile);
	
	var _he = __webpack_require__(303);
	
	var _he2 = _interopRequireDefault(_he);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  GridVideoTile: {
	    displayName: 'GridVideoTile'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/components/GridVideoTile.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	} /**
	  Presentational component to render a single youtube video, given id, URL, title, and author (author).
	  
	  props: {
	    id: '3ybh3d',
	    url: "http://comforterband.bandcamp.com/track/cop-2",
	    title: 'Hello',
	    author: 'AdeleFan',
	    media_embed: {
	      content: '',
	      width: 350,
	      height: 467
	      scrolling: false,
	    }
	  }
	  
	  **/
	
	var GridVideoTile = exports.GridVideoTile = _wrapComponent('GridVideoTile')((_temp = _class = (function (_React$Component) {
	  (0, _inherits3.default)(GridVideoTile, _React$Component);
	
	  function GridVideoTile() {
	    (0, _classCallCheck3.default)(this, GridVideoTile);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(GridVideoTile).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(GridVideoTile, [{
	    key: 'parseMediaEmbed',
	
	    // takes iframe string and turns into node, appends to div
	    value: function parseMediaEmbed(iframeContent) {
	      if (!iframeContent) {
	        console.log('no iframeContent! not creating player');
	        return '';
	      }
	      return _he2.default.decode(iframeContent);
	    }
	  }, {
	    key: 'attachMediaEmbed',
	    value: function attachMediaEmbed(iframeNode) {
	      var range = document.createRange();
	      var documentFragment = range.createContextualFragment(iframeNode);
	      this.containerEl.appendChild(documentFragment);
	      return this.containerEl.firstElementChild;
	    }
	  }, {
	    key: 'createPlayer',
	    value: function createPlayer(iframeTag) {
	      if (!iframeTag) {
	        console.log('no iframeTag! not creating player');
	        return;
	      }
	      var player = new window.playerjs.Player(iframeTag);
	      player.on('ready', function () {
	        console.log('player ready! calling play');
	        // player.play()
	      });
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var iframeNode = this.parseMediaEmbed(this.props.media_embed.content);
	      if (iframeNode) {
	        var iframeTag = this.attachMediaEmbed(iframeNode);
	        this.createPlayer(iframeTag);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      var _props = this.props;
	      var title = _props.title;
	      var author = _props.author;
	
	      var setDivRef = function setDivRef(node) {
	        _this2.containerEl = node;
	      };
	
	      return _react3.default.createElement(
	        _gridTile2.default,
	        {
	          title: title,
	          subtitle: _react3.default.createElement(
	            'span',
	            null,
	            'by ',
	            _react3.default.createElement(
	              'b',
	              null,
	              author
	            )
	          ) },
	        _react3.default.createElement('div', { ref: setDivRef.bind(this) })
	      );
	    }
	  }]);
	  return GridVideoTile;
	})(_react3.default.Component), _class.propTypes = {
	  id: _react3.default.PropTypes.string.isRequired,
	  url: _react3.default.PropTypes.string.isRequired,
	  title: _react3.default.PropTypes.string.isRequired,
	  author: _react3.default.PropTypes.string.isRequired,
	  media_embed: _react3.default.PropTypes.object.isRequired
	}, _temp));
	
	exports.default = GridVideoTile;

/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _class, _temp;
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	var _reactRedux = __webpack_require__(47);
	
	var _reactRouter = __webpack_require__(59);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  Root: {
	    displayName: 'Root'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/containers/Root.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	}
	
	var Root = _wrapComponent('Root')((_temp = _class = (function (_React$Component) {
	  (0, _inherits3.default)(Root, _React$Component);
	
	  function Root() {
	    (0, _classCallCheck3.default)(this, Root);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Root).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(Root, [{
	    key: 'render',
	    value: function render() {
	      return _react3.default.createElement(
	        _reactRedux.Provider,
	        { store: this.props.store },
	        _react3.default.createElement(
	          'div',
	          { style: { height: '100%' } },
	          this.content,
	          this.devTools
	        )
	      );
	    }
	  }, {
	    key: 'content',
	    get: function get() {
	      return _react3.default.createElement(
	        _reactRouter.Router,
	        { history: this.props.history },
	        this.props.routes
	      );
	    }
	  }, {
	    key: 'devTools',
	    get: function get() {
	      if (true) {
	        if (false) {
	          require('../redux/utils/createDevToolsWindow')(this.props.store);
	        } else {
	          var DevTools = __webpack_require__(140);
	          return _react3.default.createElement(DevTools, null);
	        }
	      }
	    }
	  }]);
	  return Root;
	})(_react3.default.Component), _class.propTypes = {
	  history: _react3.default.PropTypes.object.isRequired,
	  routes: _react3.default.PropTypes.element.isRequired,
	  store: _react3.default.PropTypes.object.isRequired
	}, _temp));
	
	exports.default = Root;
	module.exports = exports['default'];

/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	__webpack_require__(634);
	
	var _Header = __webpack_require__(245);
	
	var _Header2 = _interopRequireDefault(_Header);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Note: Stateless/function components *will not* hot reload!
	// react-transform *only* works on component classes.
	//
	// Since layouts rarely change, they are a good place to
	// leverage React's new Statelesss Functions:
	// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
	//
	// CoreLayout is a pure function of its props, so we can
	// define it with a plain javascript function...
	function CoreLayout(_ref) {
	  var children = _ref.children;
	
	  return _react2.default.createElement(
	    'div',
	    { className: 'page-container' },
	    _react2.default.createElement(
	      'div',
	      { className: 'view-container' },
	      _react2.default.createElement(_Header2.default, null),
	      children
	    )
	  );
	}
	
	CoreLayout.propTypes = {
	  children: _react2.default.PropTypes.element
	};
	
	exports.default = CoreLayout;
	module.exports = exports['default'];

/***/ },
/* 245 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.HeaderView = undefined;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  HeaderView: {
	    displayName: 'HeaderView'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/layouts/Header.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	}
	
	var HeaderView = exports.HeaderView = _wrapComponent('HeaderView')((function (_React$Component) {
	  (0, _inherits3.default)(HeaderView, _React$Component);
	
	  function HeaderView() {
	    (0, _classCallCheck3.default)(this, HeaderView);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HeaderView).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(HeaderView, [{
	    key: 'render',
	    value: function render() {
	      return _react3.default.createElement(
	        'div',
	        { className: 'container text-center' },
	        _react3.default.createElement(
	          'h1',
	          null,
	          'HEADER'
	        )
	      );
	    }
	  }]);
	  return HeaderView;
	})(_react3.default.Component));
	
	exports.default = HeaderView;

/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _assign = __webpack_require__(88);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(105);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _createBrowserHistory = __webpack_require__(157);
	
	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);
	
	var _reduxSimpleRouter = __webpack_require__(138);
	
	var _routes = __webpack_require__(249);
	
	var _routes2 = _interopRequireDefault(_routes);
	
	var _Root = __webpack_require__(243);
	
	var _Root2 = _interopRequireDefault(_Root);
	
	var _configureStore = __webpack_require__(247);
	
	var _configureStore2 = _interopRequireDefault(_configureStore);
	
	var _reactTapEventPlugin = __webpack_require__(382);
	
	var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	(0, _reactTapEventPlugin2.default)();
	// import { actions as tabActions } from './redux/modules/tabs'
	// Needed for onTouchTap
	// Can go away when react 1.0 release
	
	var history = (0, _createBrowserHistory2.default)(); // manipulates # to look like real paths
	
	// Create Store
	var initialStore = (0, _assign2.default)({}, window.__INITIAL_STATE__, {
	  currentTab: {
	    title: 'init tab in main.js',
	    value: 'init value in main.js'
	  },
	  videoList: []
	});
	var store = (0, _configureStore2.default)(initialStore);
	
	(0, _reduxSimpleRouter.syncReduxAndRouter)(history, store, function (state) {
	  return state.router;
	});
	
	// Render the React application to the DOM
	_reactDom2.default.render(_react2.default.createElement(_Root2.default, { history: history, routes: _routes2.default, store: store }), document.getElementById('root'));

/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = configureStore;
	
	var _reduxThunk = __webpack_require__(629);
	
	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);
	
	var _modules = __webpack_require__(248);
	
	var _modules2 = _interopRequireDefault(_modules);
	
	var _redux = __webpack_require__(64);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function configureStore(initialState) {
	  var createStoreWithMiddleware = undefined;
	
	  var middleware = (0, _redux.applyMiddleware)(_reduxThunk2.default);
	
	  if (true) {
	    createStoreWithMiddleware = (0, _redux.compose)(middleware, __webpack_require__(140).instrument());
	  } else {
	    createStoreWithMiddleware = (0, _redux.compose)(middleware);
	  }
	  console.log('configureStore initialState!', initialState);
	  var store = createStoreWithMiddleware(_redux.createStore)(_modules2.default, initialState);
	  if (false) {
	    module.hot.accept('./modules', function () {
	      var nextRootReducer = require('./modules');
	
	      store.replaceReducer(nextRootReducer);
	    });
	  }
	  return store;
	}
	module.exports = exports['default'];

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _redux = __webpack_require__(64);
	
	var _reduxSimpleRouter = __webpack_require__(138);
	
	var _counter = __webpack_require__(141);
	
	var _counter2 = _interopRequireDefault(_counter);
	
	var _tabs = __webpack_require__(143);
	
	var _tabs2 = _interopRequireDefault(_tabs);
	
	var _data = __webpack_require__(142);
	
	var _data2 = _interopRequireDefault(_data);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// current video list
	
	// Build global state (store.getState()) from all reducers
	// counter value
	exports.default = (0, _redux.combineReducers)({
	  counter: _counter2.default,
	  router: _reduxSimpleRouter.routeReducer,
	  currentTab: _tabs2.default,
	  videoList: _data2.default
	}); // current tab value
	
	// COMPONENT REDUCERS

	module.exports = exports['default'];

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRouter = __webpack_require__(59);
	
	var _CoreLayout = __webpack_require__(244);
	
	var _CoreLayout2 = _interopRequireDefault(_CoreLayout);
	
	var _HomeView = __webpack_require__(251);
	
	var _HomeView2 = _interopRequireDefault(_HomeView);
	
	var _AboutView = __webpack_require__(250);
	
	var _AboutView2 = _interopRequireDefault(_AboutView);
	
	var _TabsContainer = __webpack_require__(253);
	
	var _TabsContainer2 = _interopRequireDefault(_TabsContainer);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Frontend routes - need a path and a component
	
	// NOTE: here we're making use of the `resolve.root` configuration
	// option in webpack, which allows us to specify import paths as if
	// they were from the root of the ~/src directory. This makes it
	// very easy to navigate to files regardless of how deeply nested
	// your current file is.
	exports.default = _react2.default.createElement(
	  _reactRouter.Route,
	  { path: '/', component: _CoreLayout2.default },
	  _react2.default.createElement(_reactRouter.IndexRoute, { component: _HomeView2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/about', component: _AboutView2.default }),
	  _react2.default.createElement(_reactRouter.Route, { path: '/test', component: _TabsContainer2.default })
	);
	module.exports = exports['default'];

/***/ },
/* 250 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.AboutView = undefined;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	var _reactRouter = __webpack_require__(59);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  AboutView: {
	    displayName: 'AboutView'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/views/AboutView.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	}
	
	var AboutView = exports.AboutView = _wrapComponent('AboutView')((function (_React$Component) {
	  (0, _inherits3.default)(AboutView, _React$Component);
	
	  function AboutView() {
	    (0, _classCallCheck3.default)(this, AboutView);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(AboutView).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(AboutView, [{
	    key: 'render',
	    value: function render() {
	      return _react3.default.createElement(
	        'div',
	        { className: 'container text-center' },
	        _react3.default.createElement(
	          'h1',
	          null,
	          'This is the about view!'
	        ),
	        _react3.default.createElement('hr', null),
	        _react3.default.createElement(
	          _reactRouter.Link,
	          { to: '/' },
	          'Back To Home View'
	        )
	      );
	    }
	  }]);
	  return AboutView;
	})(_react3.default.Component));
	
	exports.default = AboutView;

/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _class, _temp;
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.HomeView = undefined;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	var _reactRedux = __webpack_require__(47);
	
	var _reactRouter = __webpack_require__(59);
	
	var _counter = __webpack_require__(141);
	
	var _HomeView = __webpack_require__(635);
	
	var _HomeView2 = _interopRequireDefault(_HomeView);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  HomeView: {
	    displayName: 'HomeView'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/views/HomeView.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	}
	
	// We define mapStateToProps where we'd normally use
	// the @connect decorator so the data requirements are clear upfront, but then
	// export the decorated component after the main class definition so
	// the component can be tested w/ and w/o being connected.
	// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
	var mapStateToProps = function mapStateToProps(state) {
	  return {
	    counter: state.counter
	  };
	};
	
	var HomeView = exports.HomeView = _wrapComponent('HomeView')((_temp = _class = (function (_React$Component) {
	  (0, _inherits3.default)(HomeView, _React$Component);
	
	  function HomeView() {
	    (0, _classCallCheck3.default)(this, HomeView);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(HomeView).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(HomeView, [{
	    key: 'render',
	    value: function render() {
	      var _this2 = this;
	
	      return _react3.default.createElement(
	        'div',
	        { className: 'container text-center' },
	        _react3.default.createElement(
	          'h1',
	          null,
	          'Welcome to the React Redux Starter Kit'
	        ),
	        _react3.default.createElement(
	          'h2',
	          null,
	          'Sample Counter: ',
	          _react3.default.createElement(
	            'span',
	            { className: _HomeView2.default['counter--green'] },
	            this.props.counter
	          )
	        ),
	        _react3.default.createElement(
	          'button',
	          { className: 'btn btn-default',
	            onClick: function onClick() {
	              return _this2.props.increment(1);
	            } },
	          'Increment'
	        ),
	        _react3.default.createElement(
	          'button',
	          { className: 'btn btn-default',
	            onClick: this.props.doubleAsync },
	          'Double (Async)'
	        ),
	        _react3.default.createElement('hr', null),
	        _react3.default.createElement(
	          _reactRouter.Link,
	          { to: '/about' },
	          'Go To About View'
	        ),
	        '   ',
	        _react3.default.createElement(
	          _reactRouter.Link,
	          { to: '/test' },
	          'Go To TabsContainer View'
	        )
	      );
	    }
	  }]);
	  return HomeView;
	})(_react3.default.Component), _class.propTypes = {
	  counter: _react3.default.PropTypes.number.isRequired,
	  doubleAsync: _react3.default.PropTypes.func.isRequired,
	  increment: _react3.default.PropTypes.func.isRequired
	}, _temp));
	
	exports.default = (0, _reactRedux.connect)(mapStateToProps, _counter.actions)(HomeView);

/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _class, _temp;
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TabGrid = undefined;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	var _reactRedux = __webpack_require__(47);
	
	var _GridVideoList = __webpack_require__(241);
	
	var _GridVideoList2 = _interopRequireDefault(_GridVideoList);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  TabGrid: {
	    displayName: 'TabGrid'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/views/TabGrid.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	} /**
	  Smart component wrapping a tab with a GridVideoList to the array of videos.
	  
	  Note that this is mounted as soon as TabsContainer renders, even if the tab is not visible.
	  */
	
	var mapStateToProps = function mapStateToProps(state) {
	  return {
	    videoList: state.videoList
	  };
	};
	
	var TabGrid = exports.TabGrid = _wrapComponent('TabGrid')((_temp = _class = (function (_React$Component) {
	  (0, _inherits3.default)(TabGrid, _React$Component);
	
	  function TabGrid() {
	    (0, _classCallCheck3.default)(this, TabGrid);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TabGrid).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(TabGrid, [{
	    key: 'render',
	    value: function render() {
	      return _react3.default.createElement(_GridVideoList2.default, {
	        videoList: this.props.videoList });
	    }
	  }]);
	  return TabGrid;
	})(_react3.default.Component), _class.propTypes = {
	  videoList: _react3.default.PropTypes.array.isRequired,
	  value: _react3.default.PropTypes.string.isRequired
	}, _temp));
	
	exports.default = (0, _reactRedux.connect)(mapStateToProps)(TabGrid);

/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _class, _temp;
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.TabsContainer = undefined;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _classCallCheck2 = __webpack_require__(20);
	
	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);
	
	var _createClass2 = __webpack_require__(21);
	
	var _createClass3 = _interopRequireDefault(_createClass2);
	
	var _possibleConstructorReturn2 = __webpack_require__(26);
	
	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);
	
	var _inherits2 = __webpack_require__(22);
	
	var _inherits3 = _interopRequireDefault(_inherits2);
	
	var _assign = __webpack_require__(88);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _redboxReact2 = __webpack_require__(32);
	
	var _redboxReact3 = _interopRequireDefault(_redboxReact2);
	
	var _react2 = __webpack_require__(1);
	
	var _react3 = _interopRequireDefault(_react2);
	
	var _reactTransformCatchErrors3 = __webpack_require__(30);
	
	var _reactTransformCatchErrors4 = _interopRequireDefault(_reactTransformCatchErrors3);
	
	var _reactRedux = __webpack_require__(47);
	
	var _redux = __webpack_require__(64);
	
	var _tabs = __webpack_require__(143);
	
	var _data = __webpack_require__(142);
	
	var _constants = __webpack_require__(87);
	
	var _constants2 = _interopRequireDefault(_constants);
	
	var _tabs2 = __webpack_require__(327);
	
	var _tabs3 = _interopRequireDefault(_tabs2);
	
	var _tab = __webpack_require__(325);
	
	var _tab2 = _interopRequireDefault(_tab);
	
	var _TabsContainer = __webpack_require__(636);
	
	var _TabsContainer2 = _interopRequireDefault(_TabsContainer);
	
	var _TabGrid = __webpack_require__(252);
	
	var _TabGrid2 = _interopRequireDefault(_TabGrid);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _components = {
	  TabsContainer: {
	    displayName: 'TabsContainer'
	  }
	};
	
	var _reactTransformCatchErrors2 = (0, _reactTransformCatchErrors4.default)({
	  filename: '/Users/connieli/Google Drive/JAVASCRIPT/listentothis-web/src/views/TabsContainer.js',
	  components: _components,
	  locals: [],
	  imports: [_react3.default, _redboxReact3.default]
	});
	
	function _wrapComponent(id) {
	  return function (Component) {
	    return _reactTransformCatchErrors2(Component, id);
	  };
	}
	
	/**
	{
	  currentTab: {
	    title: "tab title",
	    value: "hot"
	  },
	  videoList: [ ... ]
	}
	**/
	var mapStateToProps = function mapStateToProps(state) {
	  return {
	    tabFilter: state.currentTab.value,
	    videoList: state.videoList
	  };
	};
	
	// Combine tab and data action creators
	var mapDispatchToProps = function mapDispatchToProps(dispatch) {
	  return (0, _redux.bindActionCreators)((0, _assign2.default)({}, _tabs.actionCreators, _data.actionCreators), dispatch);
	};
	
	var TabsContainer = exports.TabsContainer = _wrapComponent('TabsContainer')((_temp = _class = (function (_React$Component) {
	  (0, _inherits3.default)(TabsContainer, _React$Component);
	
	  function TabsContainer() {
	    (0, _classCallCheck3.default)(this, TabsContainer);
	    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(TabsContainer).apply(this, arguments));
	  }
	
	  (0, _createClass3.default)(TabsContainer, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      // populate initial tab
	      // TODO - fi
	      this.updateTab(_constants2.default.FILTER_DEFAULT);
	    }
	  }, {
	    key: 'updateTab',
	    value: function updateTab(value) {
	      var _props = this.props;
	      var setCurrentTab = _props.setCurrentTab;
	      var fetchVideos = _props.fetchVideos;
	
	      setCurrentTab(value);
	      fetchVideos(value);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var tabFilter = this.props.tabFilter;
	
	      return _react3.default.createElement(
	        'div',
	        { className: 'container text-center' },
	        _react3.default.createElement(
	          _tabs3.default,
	          {
	            value: tabFilter,
	            onChange: this.updateTab.bind(this)
	          },
	          _react3.default.createElement(
	            _tab2.default,
	            { label: 'HOT',
	              value: _constants2.default.FILTER_HOT,
	              selected: true },
	            _react3.default.createElement(
	              'div',
	              null,
	              _react3.default.createElement(
	                'h2',
	                { className: _TabsContainer2.default['headline'] },
	                'HOT'
	              ),
	              _react3.default.createElement(
	                'p',
	                null,
	                _react3.default.createElement(_TabGrid2.default, { value: _constants2.default.FILTER_HOT })
	              )
	            )
	          ),
	          _react3.default.createElement(
	            _tab2.default,
	            { label: 'TOP',
	              value: _constants2.default.FILTER_TOP },
	            _react3.default.createElement(
	              'div',
	              null,
	              _react3.default.createElement(
	                'h2',
	                { className: _TabsContainer2.default['headline'] },
	                'TOP'
	              ),
	              _react3.default.createElement(
	                'p',
	                null,
	                _react3.default.createElement(_TabGrid2.default, { value: _constants2.default.FILTER_TOP })
	              )
	            )
	          )
	        )
	      );
	    }
	  }]);
	  return TabsContainer;
	})(_react3.default.Component), _class.propTypes = {
	  tabTitle: _react3.default.PropTypes.string.isRequired,
	  tabFilter: _react3.default.PropTypes.string.isRequired,
	  setCurrentTab: _react3.default.PropTypes.func.isRequired,
	  fetchVideos: _react3.default.PropTypes.func.isRequired
	}, _temp));
	// transforms state fields and actions into this.props
	
	exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(TabsContainer);

/***/ },
/* 254 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(266), __esModule: true };

/***/ },
/* 255 */
[639, 268],
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(270), __esModule: true };

/***/ },
/* 257 */
[642, 273],
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(274), __esModule: true };

/***/ },
/* 259 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(20);

/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(21);

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(144);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	
	  return obj;
	};

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _getPrototypeOf = __webpack_require__(19);
	
	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);
	
	var _getOwnPropertyDescriptor = __webpack_require__(256);
	
	var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function get(object, property, receiver) {
	  if (object === null) object = Function.prototype;
	  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);
	
	  if (desc === undefined) {
	    var parent = (0, _getPrototypeOf2.default)(object);
	
	    if (parent === null) {
	      return undefined;
	    } else {
	      return get(parent, property, receiver);
	    }
	  } else if ("value" in desc) {
	    return desc.value;
	  } else {
	    var getter = desc.get;
	
	    if (getter === undefined) {
	      return undefined;
	    }
	
	    return getter.call(receiver);
	  }
	};

/***/ },
/* 263 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	
	exports.default = function (obj) {
	  return obj && obj.__esModule ? obj : {
	    default: obj
	  };
	};

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(265);

/***/ },
/* 265 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _from = __webpack_require__(254);
	
	var _from2 = _interopRequireDefault(_from);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
	      arr2[i] = arr[i];
	    }
	
	    return arr2;
	  } else {
	    return (0, _from2.default)(arr);
	  }
	};

/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(298);
	__webpack_require__(291);
	module.exports = __webpack_require__(23).Array.from;

/***/ },
/* 267 */
[643, 292, 23],
/* 268 */
[644, 7],
/* 269 */
[645, 7],
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(7);
	__webpack_require__(293);
	module.exports = function getOwnPropertyDescriptor(it, key){
	  return $.getDesc(it, key);
	};

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(294);
	module.exports = __webpack_require__(23).Object.getPrototypeOf;

/***/ },
/* 272 */
[646, 295, 23],
/* 273 */
[647, 296, 23],
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(299);
	__webpack_require__(297);
	module.exports = __webpack_require__(23).Symbol;

/***/ },
/* 275 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 276 */
[649, 91, 27],
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var $ = __webpack_require__(7);
	module.exports = function(it){
	  var keys       = $.getKeys(it)
	    , getSymbols = $.getSymbols;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = $.isEnum
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
	  }
	  return keys;
	};

/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(67)
	  , getNames  = __webpack_require__(7).getNames
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return getNames(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.get = function getOwnPropertyNames(it){
	  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
	  return getNames(toIObject(it));
	};

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(96)
	  , ITERATOR   = __webpack_require__(27)('iterator')
	  , ArrayProto = Array.prototype;
	
	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(91);
	module.exports = Array.isArray || function(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(90);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ },
/* 282 */
[655, 7, 98, 99, 95, 27],
/* 283 */
[656, 151, 45, 152, 95, 94, 96, 282, 99, 7, 27],
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(27)('iterator')
	  , SAFE_CLOSING = false;
	
	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }
	
	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ safe = true; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	var $         = __webpack_require__(7)
	  , toIObject = __webpack_require__(67);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = $.getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 286 */
[657, 7, 68, 149, 65],
/* 287 */
[660, 7, 150, 90, 92],
/* 288 */
[663, 154, 93],
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(154)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 290 */
[667, 276, 27, 96, 23],
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ctx         = __webpack_require__(92)
	  , $export     = __webpack_require__(45)
	  , toObject    = __webpack_require__(68)
	  , call        = __webpack_require__(281)
	  , isArrayIter = __webpack_require__(279)
	  , toLength    = __webpack_require__(289)
	  , getIterFn   = __webpack_require__(290);
	$export($export.S + $export.F * !__webpack_require__(284)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , $$      = arguments
	      , $$len   = $$.length
	      , mapfn   = $$len > 1 ? $$[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        result[index] = mapping ? mapfn(O[index], index) : O[index];
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ },
/* 292 */
[668, 45, 286],
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	var toIObject = __webpack_require__(67);
	
	__webpack_require__(97)('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
	  return function getOwnPropertyDescriptor(it, key){
	    return $getOwnPropertyDescriptor(toIObject(it), key);
	  };
	});

/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject = __webpack_require__(68);
	
	__webpack_require__(97)('getPrototypeOf', function($getPrototypeOf){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ },
/* 295 */
[669, 68, 97],
/* 296 */
[670, 45, 287],
/* 297 */
/***/ function(module, exports) {



/***/ },
/* 298 */
[671, 288, 283],
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var $              = __webpack_require__(7)
	  , global         = __webpack_require__(66)
	  , has            = __webpack_require__(94)
	  , DESCRIPTORS    = __webpack_require__(148)
	  , $export        = __webpack_require__(45)
	  , redefine       = __webpack_require__(152)
	  , $fails         = __webpack_require__(65)
	  , shared         = __webpack_require__(153)
	  , setToStringTag = __webpack_require__(99)
	  , uid            = __webpack_require__(155)
	  , wks            = __webpack_require__(27)
	  , keyOf          = __webpack_require__(285)
	  , $names         = __webpack_require__(278)
	  , enumKeys       = __webpack_require__(277)
	  , isArray        = __webpack_require__(280)
	  , anObject       = __webpack_require__(90)
	  , toIObject      = __webpack_require__(67)
	  , createDesc     = __webpack_require__(98)
	  , getDesc        = $.getDesc
	  , setDesc        = $.setDesc
	  , _create        = $.create
	  , getNames       = $names.get
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , setter         = false
	  , HIDDEN         = wks('_hidden')
	  , isEnum         = $.isEnum
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , useNative      = typeof $Symbol == 'function'
	  , ObjectProto    = Object.prototype;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(setDesc({}, 'a', {
	    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = getDesc(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  setDesc(it, key, D);
	  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
	} : setDesc;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol.prototype);
	  sym._k = tag;
	  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
	    configurable: true,
	    set: function(value){
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    }
	  });
	  return sym;
	};
	
	var isSymbol = function(it){
	  return typeof it == 'symbol';
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(D && has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return setDesc(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key);
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
	    ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  var D = getDesc(it = toIObject(it), key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
	  return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var names  = getNames(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
	  return result;
	};
	var $stringify = function stringify(it){
	  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	  var args = [it]
	    , i    = 1
	    , $$   = arguments
	    , replacer, $replacer;
	  while($$.length > i)args.push($$[i++]);
	  replacer = args[1];
	  if(typeof replacer == 'function')$replacer = replacer;
	  if($replacer || !isArray(replacer))replacer = function(key, value){
	    if($replacer)value = $replacer.call(this, key, value);
	    if(!isSymbol(value))return value;
	  };
	  args[1] = replacer;
	  return _stringify.apply($JSON, args);
	};
	var buggyJSON = $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	});
	
	// 19.4.1.1 Symbol([description])
	if(!useNative){
	  $Symbol = function Symbol(){
	    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
	    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
	  };
	  redefine($Symbol.prototype, 'toString', function toString(){
	    return this._k;
	  });
	
	  isSymbol = function(it){
	    return it instanceof $Symbol;
	  };
	
	  $.create     = $create;
	  $.isEnum     = $propertyIsEnumerable;
	  $.getDesc    = $getOwnPropertyDescriptor;
	  $.setDesc    = $defineProperty;
	  $.setDescs   = $defineProperties;
	  $.getNames   = $names.get = $getOwnPropertyNames;
	  $.getSymbols = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(151)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	}
	
	var symbolStatics = {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    return keyOf(SymbolRegistry, key);
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	};
	// 19.4.2.2 Symbol.hasInstance
	// 19.4.2.3 Symbol.isConcatSpreadable
	// 19.4.2.4 Symbol.iterator
	// 19.4.2.6 Symbol.match
	// 19.4.2.8 Symbol.replace
	// 19.4.2.9 Symbol.search
	// 19.4.2.10 Symbol.species
	// 19.4.2.11 Symbol.split
	// 19.4.2.12 Symbol.toPrimitive
	// 19.4.2.13 Symbol.toStringTag
	// 19.4.2.14 Symbol.unscopables
	$.each.call((
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
	  'species,split,toPrimitive,toStringTag,unscopables'
	).split(','), function(it){
	  var sym = wks(it);
	  symbolStatics[it] = useNative ? sym : wrap(sym);
	});
	
	setter = true;
	
	$export($export.G + $export.W, {Symbol: $Symbol});
	
	$export($export.S, 'Symbol', symbolStatics);
	
	$export($export.S + $export.F * !useNative, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});
	
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(100)();
	// imports
	
	
	// module
	exports.push([module.id, "html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background-color:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{font-size:2em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]{-webkit-appearance:textfield;box-sizing:content-box}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid silver;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}html{box-sizing:border-box}body,html{margin:0;padding:0;height:100%}*,:after,:before{box-sizing:inherit}", "", {"version":3,"sources":["/./src/styles/core.scss"],"names":[],"mappings":"AAkBA,KACE,uBAAwB,0BAEG,6BAEI,CACtB,KAMT,QAAU,CAAE,2FAuBZ,aAAe,CAAE,4BAUjB,qBAAsB,uBAEG,CAChB,sBAOT,aAAc,QACJ,CAAE,kBAQZ,YAAc,CAAE,EAQhB,4BAA8B,CAAE,iBAOhC,SAAW,CAAE,YAQb,wBAA0B,CAAE,SAO5B,eAAkB,CAAE,IAMpB,iBAAmB,CAAE,GAOrB,cAAe,cACE,CAAE,KAMnB,gBAAiB,UACL,CAAE,MAMd,aAAe,CAAE,QAOjB,cAAe,cACA,kBACI,uBACM,CAAE,IAG3B,SAAY,CAAE,IAGd,aAAgB,CAAE,IAQlB,QAAU,CAAE,eAMZ,eAAiB,CAAE,OAQnB,eAAiB,CAAE,GAOnB,uBAAwB,QACd,CAAE,IAMZ,aAAe,CAAE,kBASjB,sBAAkC,aACnB,CAAE,sCAmBjB,cAAe,aAED,QAEJ,CACD,OAMT,gBAAkB,CAAE,cAUpB,mBAAqB,CAAE,oEAavB,0BAA2B,cAEX,CACP,sCAOT,cAAgB,CAAE,iDAOlB,SAAU,SACC,CAAE,MAOb,kBAAoB,CAAE,uCAWtB,sBAAuB,SAEZ,CACF,4FAST,WAAa,CAAE,mBAQf,6BAA8B,sBAKN,CAAE,+FAS1B,uBAAyB,CAAE,SAM3B,wBAA0B,aACZ,0BACiB,CAAE,OAOjC,SAAU,SAEC,CACF,SAMT,aAAe,CAAE,SAOjB,eAAkB,CAAE,MAQpB,yBAA0B,gBACR,CAAE,MAIpB,SAAW,CAAE,KAGb,qBAAuB,CAAE,UAIzB,SAAU,UACC,WACE,CAAE,iBAKf,kBAAoB,CAAE","file":"core.scss","sourcesContent":["/*\nApplication Settings Go Here\n------------------------------------\nThis file acts as a bundler for all variables/mixins/themes, so they\ncan easily be swapped out without `core.scss` ever having to know.\n\nFor example:\n\n@import './variables/colors'\n@import './variables/components'\n@import './themes/default'\n*/\n/*! normalize.css v3.0.2 | MIT License | git.io/normalize */\n/**\n * 1. Set default font family to sans-serif.\n * 2. Prevent iOS text size adjust after orientation change, without disabling\n *    user zoom.\n */\nhtml {\n  font-family: sans-serif;\n  /* 1 */\n  -ms-text-size-adjust: 100%;\n  /* 2 */\n  -webkit-text-size-adjust: 100%;\n  /* 2 */ }\n\n/**\n * Remove default margin.\n */\nbody {\n  margin: 0; }\n\n/* HTML5 display definitions\n   ========================================================================== */\n/**\n * Correct `block` display not defined for any HTML5 element in IE 8/9.\n * Correct `block` display not defined for `details` or `summary` in IE 10/11\n * and Firefox.\n * Correct `block` display not defined for `main` in IE 11.\n */\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\n/**\n * 1. Correct `inline-block` display not defined in IE 8/9.\n * 2. Normalize vertical alignment of `progress` in Chrome, Firefox, and Opera.\n */\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */ }\n\n/**\n * Prevent modern browsers from displaying `audio` without controls.\n * Remove excess height in iOS 5 devices.\n */\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n/**\n * Address `[hidden]` styling not present in IE 8/9/10.\n * Hide the `template` element in IE 8/9/11, Safari, and Firefox < 22.\n */\n[hidden],\ntemplate {\n  display: none; }\n\n/* Links\n   ========================================================================== */\n/**\n * Remove the gray background color from active links in IE 10.\n */\na {\n  background-color: transparent; }\n\n/**\n * Improve readability when focused and also mouse hovered in all browsers.\n */\na:active,\na:hover {\n  outline: 0; }\n\n/* Text-level semantics\n   ========================================================================== */\n/**\n * Address styling not present in IE 8/9/10/11, Safari, and Chrome.\n */\nabbr[title] {\n  border-bottom: 1px dotted; }\n\n/**\n * Address style set to `bolder` in Firefox 4+, Safari, and Chrome.\n */\nb,\nstrong {\n  font-weight: bold; }\n\n/**\n * Address styling not present in Safari and Chrome.\n */\ndfn {\n  font-style: italic; }\n\n/**\n * Address variable `h1` font-size and margin within `section` and `article`\n * contexts in Firefox 4+, Safari, and Chrome.\n */\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\n/**\n * Address styling not present in IE 8/9.\n */\nmark {\n  background: #ff0;\n  color: #000; }\n\n/**\n * Address inconsistent and variable font size in all browsers.\n */\nsmall {\n  font-size: 80%; }\n\n/**\n * Prevent `sub` and `sup` affecting `line-height` in all browsers.\n */\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\n/* Embedded content\n   ========================================================================== */\n/**\n * Remove border when inside `a` element in IE 8/9/10.\n */\nimg {\n  border: 0; }\n\n/**\n * Correct overflow not hidden in IE 9/10/11.\n */\nsvg:not(:root) {\n  overflow: hidden; }\n\n/* Grouping content\n   ========================================================================== */\n/**\n * Address margin not present in IE 8/9 and Safari.\n */\nfigure {\n  margin: 1em 40px; }\n\n/**\n * Address differences between Firefox and other browsers.\n */\nhr {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n  height: 0; }\n\n/**\n * Contain overflow in all browsers.\n */\npre {\n  overflow: auto; }\n\n/**\n * Address odd `em`-unit font size rendering in all browsers.\n */\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\n/* Forms\n   ========================================================================== */\n/**\n * Known limitation: by default, Chrome and Safari on OS X allow very limited\n * styling of `select`, unless a `border` property is set.\n */\n/**\n * 1. Correct color not being inherited.\n *    Known issue: affects color of disabled elements.\n * 2. Correct font properties not being inherited.\n * 3. Address margins set differently in Firefox 4+, Safari, and Chrome.\n */\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n  margin: 0;\n  /* 3 */ }\n\n/**\n * Address `overflow` set to `hidden` in IE 8/9/10/11.\n */\nbutton {\n  overflow: visible; }\n\n/**\n * Address inconsistent `text-transform` inheritance for `button` and `select`.\n * All other form control elements do not inherit `text-transform` values.\n * Correct `button` style inheritance in Firefox, IE 8/9/10/11, and Opera.\n * Correct `select` style inheritance in Firefox.\n */\nbutton,\nselect {\n  text-transform: none; }\n\n/**\n * 1. Avoid the WebKit bug in Android 4.0.* where (2) destroys native `audio`\n *    and `video` controls.\n * 2. Correct inability to style clickable `input` types in iOS.\n * 3. Improve usability and consistency of cursor style between image-type\n *    `input` and others.\n */\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n  cursor: pointer;\n  /* 3 */ }\n\n/**\n * Re-set default cursor for disabled elements.\n */\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\n/**\n * Remove inner padding and border in Firefox 4+.\n */\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\n/**\n * Address Firefox 4+ setting `line-height` on `input` using `!important` in\n * the UA stylesheet.\n */\ninput {\n  line-height: normal; }\n\n/**\n * It's recommended that you don't attempt to style these elements.\n * Firefox's implementation doesn't respect box-sizing, padding, or width.\n *\n * 1. Address box sizing set to `content-box` in IE 8/9/10.\n * 2. Remove excess padding in IE 8/9/10.\n */\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Fix the cursor style for Chrome's increment/decrement buttons. For certain\n * `font-size` values of the `input`, it causes the cursor style of the\n * decrement button to change from `default` to `text`.\n */\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\n/**\n * 1. Address `appearance` set to `searchfield` in Safari and Chrome.\n * 2. Address `box-sizing` set to `border-box` in Safari and Chrome\n *    (include `-moz` to future-proof).\n */\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  -moz-box-sizing: content-box;\n  -webkit-box-sizing: content-box;\n  /* 2 */\n  box-sizing: content-box; }\n\n/**\n * Remove inner padding and search cancel button in Safari and Chrome on OS X.\n * Safari (but not Chrome) clips the cancel button when the search input has\n * padding (and `textfield` appearance).\n */\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\n/**\n * Define consistent border, margin, and padding.\n */\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\n/**\n * 1. Correct `color` not being inherited in IE 8/9/10/11.\n * 2. Remove padding so people aren't caught out if they zero out fieldsets.\n */\nlegend {\n  border: 0;\n  /* 1 */\n  padding: 0;\n  /* 2 */ }\n\n/**\n * Remove default vertical scrollbar in IE 8/9/10/11.\n */\ntextarea {\n  overflow: auto; }\n\n/**\n * Don't inherit the `font-weight` (applied by a rule above).\n * NOTE: the default cannot safely be changed in Chrome and Safari on OS X.\n */\noptgroup {\n  font-weight: bold; }\n\n/* Tables\n   ========================================================================== */\n/**\n * Remove most spacing between table cells.\n */\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\nhtml {\n  box-sizing: border-box; }\n\nhtml,\nbody {\n  margin: 0;\n  padding: 0;\n  height: 100%; }\n\n*,\n*:before,\n*:after {\n  box-sizing: inherit; }\n"],"sourceRoot":"webpack://"}]);
	
	// exports


/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(100)();
	// imports
	
	
	// module
	exports.push([module.id, ".HomeView__counter___3X0w_{font-weight:700}.HomeView__counter--green___EXJi3{color:#19c819}", "", {"version":3,"sources":["/./src/views/HomeView.scss"],"names":[],"mappings":"AAAA,2BACE,eAAkB,CAAE,kCAGF,aACH,CAAE","file":"HomeView.scss","sourcesContent":[".counter {\n  font-weight: bold; }\n\n.counter--green {\n  composes: counter;\n  color: #19c819; }\n"],"sourceRoot":"webpack://"}]);
	
	// exports
	exports.locals = {
		"counter": "HomeView__counter___3X0w_",
		"counter--green": "HomeView__counter--green___EXJi3 HomeView__counter___3X0w_"
	};

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(100)();
	// imports
	
	
	// module
	exports.push([module.id, ".TabsContainer__headline___n_6e9{fontSize:24;paddingTop:16;marginBottom:12;fontWeight:400}.TabsContainer__tab___3cKAZ{max-width:66%;height:auto}", "", {"version":3,"sources":["/./src/views/TabsContainer.scss"],"names":[],"mappings":"AAAA,iCACE,YAAa,cACE,gBACE,cACD,CAAE,4BAGlB,cAAe,WACF,CAAE","file":"TabsContainer.scss","sourcesContent":[".headline {\n  fontSize: 24;\n  paddingTop: 16;\n  marginBottom: 12;\n  fontWeight: 400; }\n\n.tab {\n  max-width: 66%;\n  height: auto; }\n"],"sourceRoot":"webpack://"}]);
	
	// exports
	exports.locals = {
		"headline": "TabsContainer__headline___n_6e9",
		"tab": "TabsContainer__tab___3cKAZ"
	};

/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module, global) {/*! http://mths.be/he v0.5.0 by @mathias | MIT license */
	;(function(root) {
	
		// Detect free variables `exports`.
		var freeExports = typeof exports == 'object' && exports;
	
		// Detect free variable `module`.
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;
	
		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`.
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}
	
		/*--------------------------------------------------------------------------*/
	
		// All astral symbols.
		var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
		// All ASCII symbols (not just printable ASCII) except those listed in the
		// first column of the overrides table.
		// http://whatwg.org/html/tokenization.html#table-charref-overrides
		var regexAsciiWhitelist = /[\x01-\x7F]/g;
		// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
		// code points listed in the first column of the overrides table on
		// http://whatwg.org/html/tokenization.html#table-charref-overrides.
		var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
	
		var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
		var encodeMap = {'\xC1':'Aacute','\xE1':'aacute','\u0102':'Abreve','\u0103':'abreve','\u223E':'ac','\u223F':'acd','\u223E\u0333':'acE','\xC2':'Acirc','\xE2':'acirc','\xB4':'acute','\u0410':'Acy','\u0430':'acy','\xC6':'AElig','\xE6':'aelig','\u2061':'af','\uD835\uDD04':'Afr','\uD835\uDD1E':'afr','\xC0':'Agrave','\xE0':'agrave','\u2135':'aleph','\u0391':'Alpha','\u03B1':'alpha','\u0100':'Amacr','\u0101':'amacr','\u2A3F':'amalg','&':'amp','\u2A55':'andand','\u2A53':'And','\u2227':'and','\u2A5C':'andd','\u2A58':'andslope','\u2A5A':'andv','\u2220':'ang','\u29A4':'ange','\u29A8':'angmsdaa','\u29A9':'angmsdab','\u29AA':'angmsdac','\u29AB':'angmsdad','\u29AC':'angmsdae','\u29AD':'angmsdaf','\u29AE':'angmsdag','\u29AF':'angmsdah','\u2221':'angmsd','\u221F':'angrt','\u22BE':'angrtvb','\u299D':'angrtvbd','\u2222':'angsph','\xC5':'angst','\u237C':'angzarr','\u0104':'Aogon','\u0105':'aogon','\uD835\uDD38':'Aopf','\uD835\uDD52':'aopf','\u2A6F':'apacir','\u2248':'ap','\u2A70':'apE','\u224A':'ape','\u224B':'apid','\'':'apos','\xE5':'aring','\uD835\uDC9C':'Ascr','\uD835\uDCB6':'ascr','\u2254':'colone','*':'ast','\u224D':'CupCap','\xC3':'Atilde','\xE3':'atilde','\xC4':'Auml','\xE4':'auml','\u2233':'awconint','\u2A11':'awint','\u224C':'bcong','\u03F6':'bepsi','\u2035':'bprime','\u223D':'bsim','\u22CD':'bsime','\u2216':'setmn','\u2AE7':'Barv','\u22BD':'barvee','\u2305':'barwed','\u2306':'Barwed','\u23B5':'bbrk','\u23B6':'bbrktbrk','\u0411':'Bcy','\u0431':'bcy','\u201E':'bdquo','\u2235':'becaus','\u29B0':'bemptyv','\u212C':'Bscr','\u0392':'Beta','\u03B2':'beta','\u2136':'beth','\u226C':'twixt','\uD835\uDD05':'Bfr','\uD835\uDD1F':'bfr','\u22C2':'xcap','\u25EF':'xcirc','\u22C3':'xcup','\u2A00':'xodot','\u2A01':'xoplus','\u2A02':'xotime','\u2A06':'xsqcup','\u2605':'starf','\u25BD':'xdtri','\u25B3':'xutri','\u2A04':'xuplus','\u22C1':'Vee','\u22C0':'Wedge','\u290D':'rbarr','\u29EB':'lozf','\u25AA':'squf','\u25B4':'utrif','\u25BE':'dtrif','\u25C2':'ltrif','\u25B8':'rtrif','\u2423':'blank','\u2592':'blk12','\u2591':'blk14','\u2593':'blk34','\u2588':'block','=\u20E5':'bne','\u2261\u20E5':'bnequiv','\u2AED':'bNot','\u2310':'bnot','\uD835\uDD39':'Bopf','\uD835\uDD53':'bopf','\u22A5':'bot','\u22C8':'bowtie','\u29C9':'boxbox','\u2510':'boxdl','\u2555':'boxdL','\u2556':'boxDl','\u2557':'boxDL','\u250C':'boxdr','\u2552':'boxdR','\u2553':'boxDr','\u2554':'boxDR','\u2500':'boxh','\u2550':'boxH','\u252C':'boxhd','\u2564':'boxHd','\u2565':'boxhD','\u2566':'boxHD','\u2534':'boxhu','\u2567':'boxHu','\u2568':'boxhU','\u2569':'boxHU','\u229F':'minusb','\u229E':'plusb','\u22A0':'timesb','\u2518':'boxul','\u255B':'boxuL','\u255C':'boxUl','\u255D':'boxUL','\u2514':'boxur','\u2558':'boxuR','\u2559':'boxUr','\u255A':'boxUR','\u2502':'boxv','\u2551':'boxV','\u253C':'boxvh','\u256A':'boxvH','\u256B':'boxVh','\u256C':'boxVH','\u2524':'boxvl','\u2561':'boxvL','\u2562':'boxVl','\u2563':'boxVL','\u251C':'boxvr','\u255E':'boxvR','\u255F':'boxVr','\u2560':'boxVR','\u02D8':'breve','\xA6':'brvbar','\uD835\uDCB7':'bscr','\u204F':'bsemi','\u29C5':'bsolb','\\':'bsol','\u27C8':'bsolhsub','\u2022':'bull','\u224E':'bump','\u2AAE':'bumpE','\u224F':'bumpe','\u0106':'Cacute','\u0107':'cacute','\u2A44':'capand','\u2A49':'capbrcup','\u2A4B':'capcap','\u2229':'cap','\u22D2':'Cap','\u2A47':'capcup','\u2A40':'capdot','\u2145':'DD','\u2229\uFE00':'caps','\u2041':'caret','\u02C7':'caron','\u212D':'Cfr','\u2A4D':'ccaps','\u010C':'Ccaron','\u010D':'ccaron','\xC7':'Ccedil','\xE7':'ccedil','\u0108':'Ccirc','\u0109':'ccirc','\u2230':'Cconint','\u2A4C':'ccups','\u2A50':'ccupssm','\u010A':'Cdot','\u010B':'cdot','\xB8':'cedil','\u29B2':'cemptyv','\xA2':'cent','\xB7':'middot','\uD835\uDD20':'cfr','\u0427':'CHcy','\u0447':'chcy','\u2713':'check','\u03A7':'Chi','\u03C7':'chi','\u02C6':'circ','\u2257':'cire','\u21BA':'olarr','\u21BB':'orarr','\u229B':'oast','\u229A':'ocir','\u229D':'odash','\u2299':'odot','\xAE':'reg','\u24C8':'oS','\u2296':'ominus','\u2295':'oplus','\u2297':'otimes','\u25CB':'cir','\u29C3':'cirE','\u2A10':'cirfnint','\u2AEF':'cirmid','\u29C2':'cirscir','\u2232':'cwconint','\u201D':'rdquo','\u2019':'rsquo','\u2663':'clubs',':':'colon','\u2237':'Colon','\u2A74':'Colone',',':'comma','@':'commat','\u2201':'comp','\u2218':'compfn','\u2102':'Copf','\u2245':'cong','\u2A6D':'congdot','\u2261':'equiv','\u222E':'oint','\u222F':'Conint','\uD835\uDD54':'copf','\u2210':'coprod','\xA9':'copy','\u2117':'copysr','\u21B5':'crarr','\u2717':'cross','\u2A2F':'Cross','\uD835\uDC9E':'Cscr','\uD835\uDCB8':'cscr','\u2ACF':'csub','\u2AD1':'csube','\u2AD0':'csup','\u2AD2':'csupe','\u22EF':'ctdot','\u2938':'cudarrl','\u2935':'cudarrr','\u22DE':'cuepr','\u22DF':'cuesc','\u21B6':'cularr','\u293D':'cularrp','\u2A48':'cupbrcap','\u2A46':'cupcap','\u222A':'cup','\u22D3':'Cup','\u2A4A':'cupcup','\u228D':'cupdot','\u2A45':'cupor','\u222A\uFE00':'cups','\u21B7':'curarr','\u293C':'curarrm','\u22CE':'cuvee','\u22CF':'cuwed','\xA4':'curren','\u2231':'cwint','\u232D':'cylcty','\u2020':'dagger','\u2021':'Dagger','\u2138':'daleth','\u2193':'darr','\u21A1':'Darr','\u21D3':'dArr','\u2010':'dash','\u2AE4':'Dashv','\u22A3':'dashv','\u290F':'rBarr','\u02DD':'dblac','\u010E':'Dcaron','\u010F':'dcaron','\u0414':'Dcy','\u0434':'dcy','\u21CA':'ddarr','\u2146':'dd','\u2911':'DDotrahd','\u2A77':'eDDot','\xB0':'deg','\u2207':'Del','\u0394':'Delta','\u03B4':'delta','\u29B1':'demptyv','\u297F':'dfisht','\uD835\uDD07':'Dfr','\uD835\uDD21':'dfr','\u2965':'dHar','\u21C3':'dharl','\u21C2':'dharr','\u02D9':'dot','`':'grave','\u02DC':'tilde','\u22C4':'diam','\u2666':'diams','\xA8':'die','\u03DD':'gammad','\u22F2':'disin','\xF7':'div','\u22C7':'divonx','\u0402':'DJcy','\u0452':'djcy','\u231E':'dlcorn','\u230D':'dlcrop','$':'dollar','\uD835\uDD3B':'Dopf','\uD835\uDD55':'dopf','\u20DC':'DotDot','\u2250':'doteq','\u2251':'eDot','\u2238':'minusd','\u2214':'plusdo','\u22A1':'sdotb','\u21D0':'lArr','\u21D4':'iff','\u27F8':'xlArr','\u27FA':'xhArr','\u27F9':'xrArr','\u21D2':'rArr','\u22A8':'vDash','\u21D1':'uArr','\u21D5':'vArr','\u2225':'par','\u2913':'DownArrowBar','\u21F5':'duarr','\u0311':'DownBreve','\u2950':'DownLeftRightVector','\u295E':'DownLeftTeeVector','\u2956':'DownLeftVectorBar','\u21BD':'lhard','\u295F':'DownRightTeeVector','\u2957':'DownRightVectorBar','\u21C1':'rhard','\u21A7':'mapstodown','\u22A4':'top','\u2910':'RBarr','\u231F':'drcorn','\u230C':'drcrop','\uD835\uDC9F':'Dscr','\uD835\uDCB9':'dscr','\u0405':'DScy','\u0455':'dscy','\u29F6':'dsol','\u0110':'Dstrok','\u0111':'dstrok','\u22F1':'dtdot','\u25BF':'dtri','\u296F':'duhar','\u29A6':'dwangle','\u040F':'DZcy','\u045F':'dzcy','\u27FF':'dzigrarr','\xC9':'Eacute','\xE9':'eacute','\u2A6E':'easter','\u011A':'Ecaron','\u011B':'ecaron','\xCA':'Ecirc','\xEA':'ecirc','\u2256':'ecir','\u2255':'ecolon','\u042D':'Ecy','\u044D':'ecy','\u0116':'Edot','\u0117':'edot','\u2147':'ee','\u2252':'efDot','\uD835\uDD08':'Efr','\uD835\uDD22':'efr','\u2A9A':'eg','\xC8':'Egrave','\xE8':'egrave','\u2A96':'egs','\u2A98':'egsdot','\u2A99':'el','\u2208':'in','\u23E7':'elinters','\u2113':'ell','\u2A95':'els','\u2A97':'elsdot','\u0112':'Emacr','\u0113':'emacr','\u2205':'empty','\u25FB':'EmptySmallSquare','\u25AB':'EmptyVerySmallSquare','\u2004':'emsp13','\u2005':'emsp14','\u2003':'emsp','\u014A':'ENG','\u014B':'eng','\u2002':'ensp','\u0118':'Eogon','\u0119':'eogon','\uD835\uDD3C':'Eopf','\uD835\uDD56':'eopf','\u22D5':'epar','\u29E3':'eparsl','\u2A71':'eplus','\u03B5':'epsi','\u0395':'Epsilon','\u03F5':'epsiv','\u2242':'esim','\u2A75':'Equal','=':'equals','\u225F':'equest','\u21CC':'rlhar','\u2A78':'equivDD','\u29E5':'eqvparsl','\u2971':'erarr','\u2253':'erDot','\u212F':'escr','\u2130':'Escr','\u2A73':'Esim','\u0397':'Eta','\u03B7':'eta','\xD0':'ETH','\xF0':'eth','\xCB':'Euml','\xEB':'euml','\u20AC':'euro','!':'excl','\u2203':'exist','\u0424':'Fcy','\u0444':'fcy','\u2640':'female','\uFB03':'ffilig','\uFB00':'fflig','\uFB04':'ffllig','\uD835\uDD09':'Ffr','\uD835\uDD23':'ffr','\uFB01':'filig','\u25FC':'FilledSmallSquare','fj':'fjlig','\u266D':'flat','\uFB02':'fllig','\u25B1':'fltns','\u0192':'fnof','\uD835\uDD3D':'Fopf','\uD835\uDD57':'fopf','\u2200':'forall','\u22D4':'fork','\u2AD9':'forkv','\u2131':'Fscr','\u2A0D':'fpartint','\xBD':'half','\u2153':'frac13','\xBC':'frac14','\u2155':'frac15','\u2159':'frac16','\u215B':'frac18','\u2154':'frac23','\u2156':'frac25','\xBE':'frac34','\u2157':'frac35','\u215C':'frac38','\u2158':'frac45','\u215A':'frac56','\u215D':'frac58','\u215E':'frac78','\u2044':'frasl','\u2322':'frown','\uD835\uDCBB':'fscr','\u01F5':'gacute','\u0393':'Gamma','\u03B3':'gamma','\u03DC':'Gammad','\u2A86':'gap','\u011E':'Gbreve','\u011F':'gbreve','\u0122':'Gcedil','\u011C':'Gcirc','\u011D':'gcirc','\u0413':'Gcy','\u0433':'gcy','\u0120':'Gdot','\u0121':'gdot','\u2265':'ge','\u2267':'gE','\u2A8C':'gEl','\u22DB':'gel','\u2A7E':'ges','\u2AA9':'gescc','\u2A80':'gesdot','\u2A82':'gesdoto','\u2A84':'gesdotol','\u22DB\uFE00':'gesl','\u2A94':'gesles','\uD835\uDD0A':'Gfr','\uD835\uDD24':'gfr','\u226B':'gg','\u22D9':'Gg','\u2137':'gimel','\u0403':'GJcy','\u0453':'gjcy','\u2AA5':'gla','\u2277':'gl','\u2A92':'glE','\u2AA4':'glj','\u2A8A':'gnap','\u2A88':'gne','\u2269':'gnE','\u22E7':'gnsim','\uD835\uDD3E':'Gopf','\uD835\uDD58':'gopf','\u2AA2':'GreaterGreater','\u2273':'gsim','\uD835\uDCA2':'Gscr','\u210A':'gscr','\u2A8E':'gsime','\u2A90':'gsiml','\u2AA7':'gtcc','\u2A7A':'gtcir','>':'gt','\u22D7':'gtdot','\u2995':'gtlPar','\u2A7C':'gtquest','\u2978':'gtrarr','\u2269\uFE00':'gvnE','\u200A':'hairsp','\u210B':'Hscr','\u042A':'HARDcy','\u044A':'hardcy','\u2948':'harrcir','\u2194':'harr','\u21AD':'harrw','^':'Hat','\u210F':'hbar','\u0124':'Hcirc','\u0125':'hcirc','\u2665':'hearts','\u2026':'mldr','\u22B9':'hercon','\uD835\uDD25':'hfr','\u210C':'Hfr','\u2925':'searhk','\u2926':'swarhk','\u21FF':'hoarr','\u223B':'homtht','\u21A9':'larrhk','\u21AA':'rarrhk','\uD835\uDD59':'hopf','\u210D':'Hopf','\u2015':'horbar','\uD835\uDCBD':'hscr','\u0126':'Hstrok','\u0127':'hstrok','\u2043':'hybull','\xCD':'Iacute','\xED':'iacute','\u2063':'ic','\xCE':'Icirc','\xEE':'icirc','\u0418':'Icy','\u0438':'icy','\u0130':'Idot','\u0415':'IEcy','\u0435':'iecy','\xA1':'iexcl','\uD835\uDD26':'ifr','\u2111':'Im','\xCC':'Igrave','\xEC':'igrave','\u2148':'ii','\u2A0C':'qint','\u222D':'tint','\u29DC':'iinfin','\u2129':'iiota','\u0132':'IJlig','\u0133':'ijlig','\u012A':'Imacr','\u012B':'imacr','\u2110':'Iscr','\u0131':'imath','\u22B7':'imof','\u01B5':'imped','\u2105':'incare','\u221E':'infin','\u29DD':'infintie','\u22BA':'intcal','\u222B':'int','\u222C':'Int','\u2124':'Zopf','\u2A17':'intlarhk','\u2A3C':'iprod','\u2062':'it','\u0401':'IOcy','\u0451':'iocy','\u012E':'Iogon','\u012F':'iogon','\uD835\uDD40':'Iopf','\uD835\uDD5A':'iopf','\u0399':'Iota','\u03B9':'iota','\xBF':'iquest','\uD835\uDCBE':'iscr','\u22F5':'isindot','\u22F9':'isinE','\u22F4':'isins','\u22F3':'isinsv','\u0128':'Itilde','\u0129':'itilde','\u0406':'Iukcy','\u0456':'iukcy','\xCF':'Iuml','\xEF':'iuml','\u0134':'Jcirc','\u0135':'jcirc','\u0419':'Jcy','\u0439':'jcy','\uD835\uDD0D':'Jfr','\uD835\uDD27':'jfr','\u0237':'jmath','\uD835\uDD41':'Jopf','\uD835\uDD5B':'jopf','\uD835\uDCA5':'Jscr','\uD835\uDCBF':'jscr','\u0408':'Jsercy','\u0458':'jsercy','\u0404':'Jukcy','\u0454':'jukcy','\u039A':'Kappa','\u03BA':'kappa','\u03F0':'kappav','\u0136':'Kcedil','\u0137':'kcedil','\u041A':'Kcy','\u043A':'kcy','\uD835\uDD0E':'Kfr','\uD835\uDD28':'kfr','\u0138':'kgreen','\u0425':'KHcy','\u0445':'khcy','\u040C':'KJcy','\u045C':'kjcy','\uD835\uDD42':'Kopf','\uD835\uDD5C':'kopf','\uD835\uDCA6':'Kscr','\uD835\uDCC0':'kscr','\u21DA':'lAarr','\u0139':'Lacute','\u013A':'lacute','\u29B4':'laemptyv','\u2112':'Lscr','\u039B':'Lambda','\u03BB':'lambda','\u27E8':'lang','\u27EA':'Lang','\u2991':'langd','\u2A85':'lap','\xAB':'laquo','\u21E4':'larrb','\u291F':'larrbfs','\u2190':'larr','\u219E':'Larr','\u291D':'larrfs','\u21AB':'larrlp','\u2939':'larrpl','\u2973':'larrsim','\u21A2':'larrtl','\u2919':'latail','\u291B':'lAtail','\u2AAB':'lat','\u2AAD':'late','\u2AAD\uFE00':'lates','\u290C':'lbarr','\u290E':'lBarr','\u2772':'lbbrk','{':'lcub','[':'lsqb','\u298B':'lbrke','\u298F':'lbrksld','\u298D':'lbrkslu','\u013D':'Lcaron','\u013E':'lcaron','\u013B':'Lcedil','\u013C':'lcedil','\u2308':'lceil','\u041B':'Lcy','\u043B':'lcy','\u2936':'ldca','\u201C':'ldquo','\u2967':'ldrdhar','\u294B':'ldrushar','\u21B2':'ldsh','\u2264':'le','\u2266':'lE','\u21C6':'lrarr','\u27E6':'lobrk','\u2961':'LeftDownTeeVector','\u2959':'LeftDownVectorBar','\u230A':'lfloor','\u21BC':'lharu','\u21C7':'llarr','\u21CB':'lrhar','\u294E':'LeftRightVector','\u21A4':'mapstoleft','\u295A':'LeftTeeVector','\u22CB':'lthree','\u29CF':'LeftTriangleBar','\u22B2':'vltri','\u22B4':'ltrie','\u2951':'LeftUpDownVector','\u2960':'LeftUpTeeVector','\u2958':'LeftUpVectorBar','\u21BF':'uharl','\u2952':'LeftVectorBar','\u2A8B':'lEg','\u22DA':'leg','\u2A7D':'les','\u2AA8':'lescc','\u2A7F':'lesdot','\u2A81':'lesdoto','\u2A83':'lesdotor','\u22DA\uFE00':'lesg','\u2A93':'lesges','\u22D6':'ltdot','\u2276':'lg','\u2AA1':'LessLess','\u2272':'lsim','\u297C':'lfisht','\uD835\uDD0F':'Lfr','\uD835\uDD29':'lfr','\u2A91':'lgE','\u2962':'lHar','\u296A':'lharul','\u2584':'lhblk','\u0409':'LJcy','\u0459':'ljcy','\u226A':'ll','\u22D8':'Ll','\u296B':'llhard','\u25FA':'lltri','\u013F':'Lmidot','\u0140':'lmidot','\u23B0':'lmoust','\u2A89':'lnap','\u2A87':'lne','\u2268':'lnE','\u22E6':'lnsim','\u27EC':'loang','\u21FD':'loarr','\u27F5':'xlarr','\u27F7':'xharr','\u27FC':'xmap','\u27F6':'xrarr','\u21AC':'rarrlp','\u2985':'lopar','\uD835\uDD43':'Lopf','\uD835\uDD5D':'lopf','\u2A2D':'loplus','\u2A34':'lotimes','\u2217':'lowast','_':'lowbar','\u2199':'swarr','\u2198':'searr','\u25CA':'loz','(':'lpar','\u2993':'lparlt','\u296D':'lrhard','\u200E':'lrm','\u22BF':'lrtri','\u2039':'lsaquo','\uD835\uDCC1':'lscr','\u21B0':'lsh','\u2A8D':'lsime','\u2A8F':'lsimg','\u2018':'lsquo','\u201A':'sbquo','\u0141':'Lstrok','\u0142':'lstrok','\u2AA6':'ltcc','\u2A79':'ltcir','<':'lt','\u22C9':'ltimes','\u2976':'ltlarr','\u2A7B':'ltquest','\u25C3':'ltri','\u2996':'ltrPar','\u294A':'lurdshar','\u2966':'luruhar','\u2268\uFE00':'lvnE','\xAF':'macr','\u2642':'male','\u2720':'malt','\u2905':'Map','\u21A6':'map','\u21A5':'mapstoup','\u25AE':'marker','\u2A29':'mcomma','\u041C':'Mcy','\u043C':'mcy','\u2014':'mdash','\u223A':'mDDot','\u205F':'MediumSpace','\u2133':'Mscr','\uD835\uDD10':'Mfr','\uD835\uDD2A':'mfr','\u2127':'mho','\xB5':'micro','\u2AF0':'midcir','\u2223':'mid','\u2212':'minus','\u2A2A':'minusdu','\u2213':'mp','\u2ADB':'mlcp','\u22A7':'models','\uD835\uDD44':'Mopf','\uD835\uDD5E':'mopf','\uD835\uDCC2':'mscr','\u039C':'Mu','\u03BC':'mu','\u22B8':'mumap','\u0143':'Nacute','\u0144':'nacute','\u2220\u20D2':'nang','\u2249':'nap','\u2A70\u0338':'napE','\u224B\u0338':'napid','\u0149':'napos','\u266E':'natur','\u2115':'Nopf','\xA0':'nbsp','\u224E\u0338':'nbump','\u224F\u0338':'nbumpe','\u2A43':'ncap','\u0147':'Ncaron','\u0148':'ncaron','\u0145':'Ncedil','\u0146':'ncedil','\u2247':'ncong','\u2A6D\u0338':'ncongdot','\u2A42':'ncup','\u041D':'Ncy','\u043D':'ncy','\u2013':'ndash','\u2924':'nearhk','\u2197':'nearr','\u21D7':'neArr','\u2260':'ne','\u2250\u0338':'nedot','\u200B':'ZeroWidthSpace','\u2262':'nequiv','\u2928':'toea','\u2242\u0338':'nesim','\n':'NewLine','\u2204':'nexist','\uD835\uDD11':'Nfr','\uD835\uDD2B':'nfr','\u2267\u0338':'ngE','\u2271':'nge','\u2A7E\u0338':'nges','\u22D9\u0338':'nGg','\u2275':'ngsim','\u226B\u20D2':'nGt','\u226F':'ngt','\u226B\u0338':'nGtv','\u21AE':'nharr','\u21CE':'nhArr','\u2AF2':'nhpar','\u220B':'ni','\u22FC':'nis','\u22FA':'nisd','\u040A':'NJcy','\u045A':'njcy','\u219A':'nlarr','\u21CD':'nlArr','\u2025':'nldr','\u2266\u0338':'nlE','\u2270':'nle','\u2A7D\u0338':'nles','\u226E':'nlt','\u22D8\u0338':'nLl','\u2274':'nlsim','\u226A\u20D2':'nLt','\u22EA':'nltri','\u22EC':'nltrie','\u226A\u0338':'nLtv','\u2224':'nmid','\u2060':'NoBreak','\uD835\uDD5F':'nopf','\u2AEC':'Not','\xAC':'not','\u226D':'NotCupCap','\u2226':'npar','\u2209':'notin','\u2279':'ntgl','\u22F5\u0338':'notindot','\u22F9\u0338':'notinE','\u22F7':'notinvb','\u22F6':'notinvc','\u29CF\u0338':'NotLeftTriangleBar','\u2278':'ntlg','\u2AA2\u0338':'NotNestedGreaterGreater','\u2AA1\u0338':'NotNestedLessLess','\u220C':'notni','\u22FE':'notnivb','\u22FD':'notnivc','\u2280':'npr','\u2AAF\u0338':'npre','\u22E0':'nprcue','\u29D0\u0338':'NotRightTriangleBar','\u22EB':'nrtri','\u22ED':'nrtrie','\u228F\u0338':'NotSquareSubset','\u22E2':'nsqsube','\u2290\u0338':'NotSquareSuperset','\u22E3':'nsqsupe','\u2282\u20D2':'vnsub','\u2288':'nsube','\u2281':'nsc','\u2AB0\u0338':'nsce','\u22E1':'nsccue','\u227F\u0338':'NotSucceedsTilde','\u2283\u20D2':'vnsup','\u2289':'nsupe','\u2241':'nsim','\u2244':'nsime','\u2AFD\u20E5':'nparsl','\u2202\u0338':'npart','\u2A14':'npolint','\u2933\u0338':'nrarrc','\u219B':'nrarr','\u21CF':'nrArr','\u219D\u0338':'nrarrw','\uD835\uDCA9':'Nscr','\uD835\uDCC3':'nscr','\u2284':'nsub','\u2AC5\u0338':'nsubE','\u2285':'nsup','\u2AC6\u0338':'nsupE','\xD1':'Ntilde','\xF1':'ntilde','\u039D':'Nu','\u03BD':'nu','#':'num','\u2116':'numero','\u2007':'numsp','\u224D\u20D2':'nvap','\u22AC':'nvdash','\u22AD':'nvDash','\u22AE':'nVdash','\u22AF':'nVDash','\u2265\u20D2':'nvge','>\u20D2':'nvgt','\u2904':'nvHarr','\u29DE':'nvinfin','\u2902':'nvlArr','\u2264\u20D2':'nvle','<\u20D2':'nvlt','\u22B4\u20D2':'nvltrie','\u2903':'nvrArr','\u22B5\u20D2':'nvrtrie','\u223C\u20D2':'nvsim','\u2923':'nwarhk','\u2196':'nwarr','\u21D6':'nwArr','\u2927':'nwnear','\xD3':'Oacute','\xF3':'oacute','\xD4':'Ocirc','\xF4':'ocirc','\u041E':'Ocy','\u043E':'ocy','\u0150':'Odblac','\u0151':'odblac','\u2A38':'odiv','\u29BC':'odsold','\u0152':'OElig','\u0153':'oelig','\u29BF':'ofcir','\uD835\uDD12':'Ofr','\uD835\uDD2C':'ofr','\u02DB':'ogon','\xD2':'Ograve','\xF2':'ograve','\u29C1':'ogt','\u29B5':'ohbar','\u03A9':'ohm','\u29BE':'olcir','\u29BB':'olcross','\u203E':'oline','\u29C0':'olt','\u014C':'Omacr','\u014D':'omacr','\u03C9':'omega','\u039F':'Omicron','\u03BF':'omicron','\u29B6':'omid','\uD835\uDD46':'Oopf','\uD835\uDD60':'oopf','\u29B7':'opar','\u29B9':'operp','\u2A54':'Or','\u2228':'or','\u2A5D':'ord','\u2134':'oscr','\xAA':'ordf','\xBA':'ordm','\u22B6':'origof','\u2A56':'oror','\u2A57':'orslope','\u2A5B':'orv','\uD835\uDCAA':'Oscr','\xD8':'Oslash','\xF8':'oslash','\u2298':'osol','\xD5':'Otilde','\xF5':'otilde','\u2A36':'otimesas','\u2A37':'Otimes','\xD6':'Ouml','\xF6':'ouml','\u233D':'ovbar','\u23DE':'OverBrace','\u23B4':'tbrk','\u23DC':'OverParenthesis','\xB6':'para','\u2AF3':'parsim','\u2AFD':'parsl','\u2202':'part','\u041F':'Pcy','\u043F':'pcy','%':'percnt','.':'period','\u2030':'permil','\u2031':'pertenk','\uD835\uDD13':'Pfr','\uD835\uDD2D':'pfr','\u03A6':'Phi','\u03C6':'phi','\u03D5':'phiv','\u260E':'phone','\u03A0':'Pi','\u03C0':'pi','\u03D6':'piv','\u210E':'planckh','\u2A23':'plusacir','\u2A22':'pluscir','+':'plus','\u2A25':'plusdu','\u2A72':'pluse','\xB1':'pm','\u2A26':'plussim','\u2A27':'plustwo','\u2A15':'pointint','\uD835\uDD61':'popf','\u2119':'Popf','\xA3':'pound','\u2AB7':'prap','\u2ABB':'Pr','\u227A':'pr','\u227C':'prcue','\u2AAF':'pre','\u227E':'prsim','\u2AB9':'prnap','\u2AB5':'prnE','\u22E8':'prnsim','\u2AB3':'prE','\u2032':'prime','\u2033':'Prime','\u220F':'prod','\u232E':'profalar','\u2312':'profline','\u2313':'profsurf','\u221D':'prop','\u22B0':'prurel','\uD835\uDCAB':'Pscr','\uD835\uDCC5':'pscr','\u03A8':'Psi','\u03C8':'psi','\u2008':'puncsp','\uD835\uDD14':'Qfr','\uD835\uDD2E':'qfr','\uD835\uDD62':'qopf','\u211A':'Qopf','\u2057':'qprime','\uD835\uDCAC':'Qscr','\uD835\uDCC6':'qscr','\u2A16':'quatint','?':'quest','"':'quot','\u21DB':'rAarr','\u223D\u0331':'race','\u0154':'Racute','\u0155':'racute','\u221A':'Sqrt','\u29B3':'raemptyv','\u27E9':'rang','\u27EB':'Rang','\u2992':'rangd','\u29A5':'range','\xBB':'raquo','\u2975':'rarrap','\u21E5':'rarrb','\u2920':'rarrbfs','\u2933':'rarrc','\u2192':'rarr','\u21A0':'Rarr','\u291E':'rarrfs','\u2945':'rarrpl','\u2974':'rarrsim','\u2916':'Rarrtl','\u21A3':'rarrtl','\u219D':'rarrw','\u291A':'ratail','\u291C':'rAtail','\u2236':'ratio','\u2773':'rbbrk','}':'rcub',']':'rsqb','\u298C':'rbrke','\u298E':'rbrksld','\u2990':'rbrkslu','\u0158':'Rcaron','\u0159':'rcaron','\u0156':'Rcedil','\u0157':'rcedil','\u2309':'rceil','\u0420':'Rcy','\u0440':'rcy','\u2937':'rdca','\u2969':'rdldhar','\u21B3':'rdsh','\u211C':'Re','\u211B':'Rscr','\u211D':'Ropf','\u25AD':'rect','\u297D':'rfisht','\u230B':'rfloor','\uD835\uDD2F':'rfr','\u2964':'rHar','\u21C0':'rharu','\u296C':'rharul','\u03A1':'Rho','\u03C1':'rho','\u03F1':'rhov','\u21C4':'rlarr','\u27E7':'robrk','\u295D':'RightDownTeeVector','\u2955':'RightDownVectorBar','\u21C9':'rrarr','\u22A2':'vdash','\u295B':'RightTeeVector','\u22CC':'rthree','\u29D0':'RightTriangleBar','\u22B3':'vrtri','\u22B5':'rtrie','\u294F':'RightUpDownVector','\u295C':'RightUpTeeVector','\u2954':'RightUpVectorBar','\u21BE':'uharr','\u2953':'RightVectorBar','\u02DA':'ring','\u200F':'rlm','\u23B1':'rmoust','\u2AEE':'rnmid','\u27ED':'roang','\u21FE':'roarr','\u2986':'ropar','\uD835\uDD63':'ropf','\u2A2E':'roplus','\u2A35':'rotimes','\u2970':'RoundImplies',')':'rpar','\u2994':'rpargt','\u2A12':'rppolint','\u203A':'rsaquo','\uD835\uDCC7':'rscr','\u21B1':'rsh','\u22CA':'rtimes','\u25B9':'rtri','\u29CE':'rtriltri','\u29F4':'RuleDelayed','\u2968':'ruluhar','\u211E':'rx','\u015A':'Sacute','\u015B':'sacute','\u2AB8':'scap','\u0160':'Scaron','\u0161':'scaron','\u2ABC':'Sc','\u227B':'sc','\u227D':'sccue','\u2AB0':'sce','\u2AB4':'scE','\u015E':'Scedil','\u015F':'scedil','\u015C':'Scirc','\u015D':'scirc','\u2ABA':'scnap','\u2AB6':'scnE','\u22E9':'scnsim','\u2A13':'scpolint','\u227F':'scsim','\u0421':'Scy','\u0441':'scy','\u22C5':'sdot','\u2A66':'sdote','\u21D8':'seArr','\xA7':'sect',';':'semi','\u2929':'tosa','\u2736':'sext','\uD835\uDD16':'Sfr','\uD835\uDD30':'sfr','\u266F':'sharp','\u0429':'SHCHcy','\u0449':'shchcy','\u0428':'SHcy','\u0448':'shcy','\u2191':'uarr','\xAD':'shy','\u03A3':'Sigma','\u03C3':'sigma','\u03C2':'sigmaf','\u223C':'sim','\u2A6A':'simdot','\u2243':'sime','\u2A9E':'simg','\u2AA0':'simgE','\u2A9D':'siml','\u2A9F':'simlE','\u2246':'simne','\u2A24':'simplus','\u2972':'simrarr','\u2A33':'smashp','\u29E4':'smeparsl','\u2323':'smile','\u2AAA':'smt','\u2AAC':'smte','\u2AAC\uFE00':'smtes','\u042C':'SOFTcy','\u044C':'softcy','\u233F':'solbar','\u29C4':'solb','/':'sol','\uD835\uDD4A':'Sopf','\uD835\uDD64':'sopf','\u2660':'spades','\u2293':'sqcap','\u2293\uFE00':'sqcaps','\u2294':'sqcup','\u2294\uFE00':'sqcups','\u228F':'sqsub','\u2291':'sqsube','\u2290':'sqsup','\u2292':'sqsupe','\u25A1':'squ','\uD835\uDCAE':'Sscr','\uD835\uDCC8':'sscr','\u22C6':'Star','\u2606':'star','\u2282':'sub','\u22D0':'Sub','\u2ABD':'subdot','\u2AC5':'subE','\u2286':'sube','\u2AC3':'subedot','\u2AC1':'submult','\u2ACB':'subnE','\u228A':'subne','\u2ABF':'subplus','\u2979':'subrarr','\u2AC7':'subsim','\u2AD5':'subsub','\u2AD3':'subsup','\u2211':'sum','\u266A':'sung','\xB9':'sup1','\xB2':'sup2','\xB3':'sup3','\u2283':'sup','\u22D1':'Sup','\u2ABE':'supdot','\u2AD8':'supdsub','\u2AC6':'supE','\u2287':'supe','\u2AC4':'supedot','\u27C9':'suphsol','\u2AD7':'suphsub','\u297B':'suplarr','\u2AC2':'supmult','\u2ACC':'supnE','\u228B':'supne','\u2AC0':'supplus','\u2AC8':'supsim','\u2AD4':'supsub','\u2AD6':'supsup','\u21D9':'swArr','\u292A':'swnwar','\xDF':'szlig','\t':'Tab','\u2316':'target','\u03A4':'Tau','\u03C4':'tau','\u0164':'Tcaron','\u0165':'tcaron','\u0162':'Tcedil','\u0163':'tcedil','\u0422':'Tcy','\u0442':'tcy','\u20DB':'tdot','\u2315':'telrec','\uD835\uDD17':'Tfr','\uD835\uDD31':'tfr','\u2234':'there4','\u0398':'Theta','\u03B8':'theta','\u03D1':'thetav','\u205F\u200A':'ThickSpace','\u2009':'thinsp','\xDE':'THORN','\xFE':'thorn','\u2A31':'timesbar','\xD7':'times','\u2A30':'timesd','\u2336':'topbot','\u2AF1':'topcir','\uD835\uDD4B':'Topf','\uD835\uDD65':'topf','\u2ADA':'topfork','\u2034':'tprime','\u2122':'trade','\u25B5':'utri','\u225C':'trie','\u25EC':'tridot','\u2A3A':'triminus','\u2A39':'triplus','\u29CD':'trisb','\u2A3B':'tritime','\u23E2':'trpezium','\uD835\uDCAF':'Tscr','\uD835\uDCC9':'tscr','\u0426':'TScy','\u0446':'tscy','\u040B':'TSHcy','\u045B':'tshcy','\u0166':'Tstrok','\u0167':'tstrok','\xDA':'Uacute','\xFA':'uacute','\u219F':'Uarr','\u2949':'Uarrocir','\u040E':'Ubrcy','\u045E':'ubrcy','\u016C':'Ubreve','\u016D':'ubreve','\xDB':'Ucirc','\xFB':'ucirc','\u0423':'Ucy','\u0443':'ucy','\u21C5':'udarr','\u0170':'Udblac','\u0171':'udblac','\u296E':'udhar','\u297E':'ufisht','\uD835\uDD18':'Ufr','\uD835\uDD32':'ufr','\xD9':'Ugrave','\xF9':'ugrave','\u2963':'uHar','\u2580':'uhblk','\u231C':'ulcorn','\u230F':'ulcrop','\u25F8':'ultri','\u016A':'Umacr','\u016B':'umacr','\u23DF':'UnderBrace','\u23DD':'UnderParenthesis','\u228E':'uplus','\u0172':'Uogon','\u0173':'uogon','\uD835\uDD4C':'Uopf','\uD835\uDD66':'uopf','\u2912':'UpArrowBar','\u2195':'varr','\u03C5':'upsi','\u03D2':'Upsi','\u03A5':'Upsilon','\u21C8':'uuarr','\u231D':'urcorn','\u230E':'urcrop','\u016E':'Uring','\u016F':'uring','\u25F9':'urtri','\uD835\uDCB0':'Uscr','\uD835\uDCCA':'uscr','\u22F0':'utdot','\u0168':'Utilde','\u0169':'utilde','\xDC':'Uuml','\xFC':'uuml','\u29A7':'uwangle','\u299C':'vangrt','\u228A\uFE00':'vsubne','\u2ACB\uFE00':'vsubnE','\u228B\uFE00':'vsupne','\u2ACC\uFE00':'vsupnE','\u2AE8':'vBar','\u2AEB':'Vbar','\u2AE9':'vBarv','\u0412':'Vcy','\u0432':'vcy','\u22A9':'Vdash','\u22AB':'VDash','\u2AE6':'Vdashl','\u22BB':'veebar','\u225A':'veeeq','\u22EE':'vellip','|':'vert','\u2016':'Vert','\u2758':'VerticalSeparator','\u2240':'wr','\uD835\uDD19':'Vfr','\uD835\uDD33':'vfr','\uD835\uDD4D':'Vopf','\uD835\uDD67':'vopf','\uD835\uDCB1':'Vscr','\uD835\uDCCB':'vscr','\u22AA':'Vvdash','\u299A':'vzigzag','\u0174':'Wcirc','\u0175':'wcirc','\u2A5F':'wedbar','\u2259':'wedgeq','\u2118':'wp','\uD835\uDD1A':'Wfr','\uD835\uDD34':'wfr','\uD835\uDD4E':'Wopf','\uD835\uDD68':'wopf','\uD835\uDCB2':'Wscr','\uD835\uDCCC':'wscr','\uD835\uDD1B':'Xfr','\uD835\uDD35':'xfr','\u039E':'Xi','\u03BE':'xi','\u22FB':'xnis','\uD835\uDD4F':'Xopf','\uD835\uDD69':'xopf','\uD835\uDCB3':'Xscr','\uD835\uDCCD':'xscr','\xDD':'Yacute','\xFD':'yacute','\u042F':'YAcy','\u044F':'yacy','\u0176':'Ycirc','\u0177':'ycirc','\u042B':'Ycy','\u044B':'ycy','\xA5':'yen','\uD835\uDD1C':'Yfr','\uD835\uDD36':'yfr','\u0407':'YIcy','\u0457':'yicy','\uD835\uDD50':'Yopf','\uD835\uDD6A':'yopf','\uD835\uDCB4':'Yscr','\uD835\uDCCE':'yscr','\u042E':'YUcy','\u044E':'yucy','\xFF':'yuml','\u0178':'Yuml','\u0179':'Zacute','\u017A':'zacute','\u017D':'Zcaron','\u017E':'zcaron','\u0417':'Zcy','\u0437':'zcy','\u017B':'Zdot','\u017C':'zdot','\u2128':'Zfr','\u0396':'Zeta','\u03B6':'zeta','\uD835\uDD37':'zfr','\u0416':'ZHcy','\u0436':'zhcy','\u21DD':'zigrarr','\uD835\uDD6B':'zopf','\uD835\uDCB5':'Zscr','\uD835\uDCCF':'zscr','\u200D':'zwj','\u200C':'zwnj'};
	
		var regexEscape = /["&'<>`]/g;
		var escapeMap = {
			'"': '&quot;',
			'&': '&amp;',
			'\'': '&#x27;',
			'<': '&lt;',
			// See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
			// following is not strictly necessary unless it’s part of a tag or an
			// unquoted attribute value. We’re only escaping it to support those
			// situations, and for XML support.
			'>': '&gt;',
			// In Internet Explorer ≤ 8, the backtick character can be used
			// to break out of (un)quoted attribute values or HTML comments.
			// See http://html5sec.org/#102, http://html5sec.org/#108, and
			// http://html5sec.org/#133.
			'`': '&#x60;'
		};
	
		var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
		var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
		var regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|iacute|Uacute|plusmn|otilde|Otilde|Agrave|agrave|yacute|Yacute|oslash|Oslash|Atilde|atilde|brvbar|Ccedil|ccedil|ograve|curren|divide|Eacute|eacute|Ograve|oacute|Egrave|egrave|ugrave|frac12|frac14|frac34|Ugrave|Oacute|Iacute|ntilde|Ntilde|uacute|middot|Igrave|igrave|iquest|aacute|laquo|THORN|micro|iexcl|icirc|Icirc|Acirc|ucirc|ecirc|Ocirc|ocirc|Ecirc|Ucirc|aring|Aring|aelig|AElig|acute|pound|raquo|acirc|times|thorn|szlig|cedil|COPY|Auml|ordf|ordm|uuml|macr|Uuml|auml|Ouml|ouml|para|nbsp|Euml|quot|QUOT|euml|yuml|cent|sect|copy|sup1|sup2|sup3|Iuml|iuml|shy|eth|reg|not|yen|amp|AMP|REG|uml|ETH|deg|gt|GT|LT|lt)([=a-zA-Z0-9])?/g;
		var decodeMap = {'Aacute':'\xC1','aacute':'\xE1','Abreve':'\u0102','abreve':'\u0103','ac':'\u223E','acd':'\u223F','acE':'\u223E\u0333','Acirc':'\xC2','acirc':'\xE2','acute':'\xB4','Acy':'\u0410','acy':'\u0430','AElig':'\xC6','aelig':'\xE6','af':'\u2061','Afr':'\uD835\uDD04','afr':'\uD835\uDD1E','Agrave':'\xC0','agrave':'\xE0','alefsym':'\u2135','aleph':'\u2135','Alpha':'\u0391','alpha':'\u03B1','Amacr':'\u0100','amacr':'\u0101','amalg':'\u2A3F','amp':'&','AMP':'&','andand':'\u2A55','And':'\u2A53','and':'\u2227','andd':'\u2A5C','andslope':'\u2A58','andv':'\u2A5A','ang':'\u2220','ange':'\u29A4','angle':'\u2220','angmsdaa':'\u29A8','angmsdab':'\u29A9','angmsdac':'\u29AA','angmsdad':'\u29AB','angmsdae':'\u29AC','angmsdaf':'\u29AD','angmsdag':'\u29AE','angmsdah':'\u29AF','angmsd':'\u2221','angrt':'\u221F','angrtvb':'\u22BE','angrtvbd':'\u299D','angsph':'\u2222','angst':'\xC5','angzarr':'\u237C','Aogon':'\u0104','aogon':'\u0105','Aopf':'\uD835\uDD38','aopf':'\uD835\uDD52','apacir':'\u2A6F','ap':'\u2248','apE':'\u2A70','ape':'\u224A','apid':'\u224B','apos':'\'','ApplyFunction':'\u2061','approx':'\u2248','approxeq':'\u224A','Aring':'\xC5','aring':'\xE5','Ascr':'\uD835\uDC9C','ascr':'\uD835\uDCB6','Assign':'\u2254','ast':'*','asymp':'\u2248','asympeq':'\u224D','Atilde':'\xC3','atilde':'\xE3','Auml':'\xC4','auml':'\xE4','awconint':'\u2233','awint':'\u2A11','backcong':'\u224C','backepsilon':'\u03F6','backprime':'\u2035','backsim':'\u223D','backsimeq':'\u22CD','Backslash':'\u2216','Barv':'\u2AE7','barvee':'\u22BD','barwed':'\u2305','Barwed':'\u2306','barwedge':'\u2305','bbrk':'\u23B5','bbrktbrk':'\u23B6','bcong':'\u224C','Bcy':'\u0411','bcy':'\u0431','bdquo':'\u201E','becaus':'\u2235','because':'\u2235','Because':'\u2235','bemptyv':'\u29B0','bepsi':'\u03F6','bernou':'\u212C','Bernoullis':'\u212C','Beta':'\u0392','beta':'\u03B2','beth':'\u2136','between':'\u226C','Bfr':'\uD835\uDD05','bfr':'\uD835\uDD1F','bigcap':'\u22C2','bigcirc':'\u25EF','bigcup':'\u22C3','bigodot':'\u2A00','bigoplus':'\u2A01','bigotimes':'\u2A02','bigsqcup':'\u2A06','bigstar':'\u2605','bigtriangledown':'\u25BD','bigtriangleup':'\u25B3','biguplus':'\u2A04','bigvee':'\u22C1','bigwedge':'\u22C0','bkarow':'\u290D','blacklozenge':'\u29EB','blacksquare':'\u25AA','blacktriangle':'\u25B4','blacktriangledown':'\u25BE','blacktriangleleft':'\u25C2','blacktriangleright':'\u25B8','blank':'\u2423','blk12':'\u2592','blk14':'\u2591','blk34':'\u2593','block':'\u2588','bne':'=\u20E5','bnequiv':'\u2261\u20E5','bNot':'\u2AED','bnot':'\u2310','Bopf':'\uD835\uDD39','bopf':'\uD835\uDD53','bot':'\u22A5','bottom':'\u22A5','bowtie':'\u22C8','boxbox':'\u29C9','boxdl':'\u2510','boxdL':'\u2555','boxDl':'\u2556','boxDL':'\u2557','boxdr':'\u250C','boxdR':'\u2552','boxDr':'\u2553','boxDR':'\u2554','boxh':'\u2500','boxH':'\u2550','boxhd':'\u252C','boxHd':'\u2564','boxhD':'\u2565','boxHD':'\u2566','boxhu':'\u2534','boxHu':'\u2567','boxhU':'\u2568','boxHU':'\u2569','boxminus':'\u229F','boxplus':'\u229E','boxtimes':'\u22A0','boxul':'\u2518','boxuL':'\u255B','boxUl':'\u255C','boxUL':'\u255D','boxur':'\u2514','boxuR':'\u2558','boxUr':'\u2559','boxUR':'\u255A','boxv':'\u2502','boxV':'\u2551','boxvh':'\u253C','boxvH':'\u256A','boxVh':'\u256B','boxVH':'\u256C','boxvl':'\u2524','boxvL':'\u2561','boxVl':'\u2562','boxVL':'\u2563','boxvr':'\u251C','boxvR':'\u255E','boxVr':'\u255F','boxVR':'\u2560','bprime':'\u2035','breve':'\u02D8','Breve':'\u02D8','brvbar':'\xA6','bscr':'\uD835\uDCB7','Bscr':'\u212C','bsemi':'\u204F','bsim':'\u223D','bsime':'\u22CD','bsolb':'\u29C5','bsol':'\\','bsolhsub':'\u27C8','bull':'\u2022','bullet':'\u2022','bump':'\u224E','bumpE':'\u2AAE','bumpe':'\u224F','Bumpeq':'\u224E','bumpeq':'\u224F','Cacute':'\u0106','cacute':'\u0107','capand':'\u2A44','capbrcup':'\u2A49','capcap':'\u2A4B','cap':'\u2229','Cap':'\u22D2','capcup':'\u2A47','capdot':'\u2A40','CapitalDifferentialD':'\u2145','caps':'\u2229\uFE00','caret':'\u2041','caron':'\u02C7','Cayleys':'\u212D','ccaps':'\u2A4D','Ccaron':'\u010C','ccaron':'\u010D','Ccedil':'\xC7','ccedil':'\xE7','Ccirc':'\u0108','ccirc':'\u0109','Cconint':'\u2230','ccups':'\u2A4C','ccupssm':'\u2A50','Cdot':'\u010A','cdot':'\u010B','cedil':'\xB8','Cedilla':'\xB8','cemptyv':'\u29B2','cent':'\xA2','centerdot':'\xB7','CenterDot':'\xB7','cfr':'\uD835\uDD20','Cfr':'\u212D','CHcy':'\u0427','chcy':'\u0447','check':'\u2713','checkmark':'\u2713','Chi':'\u03A7','chi':'\u03C7','circ':'\u02C6','circeq':'\u2257','circlearrowleft':'\u21BA','circlearrowright':'\u21BB','circledast':'\u229B','circledcirc':'\u229A','circleddash':'\u229D','CircleDot':'\u2299','circledR':'\xAE','circledS':'\u24C8','CircleMinus':'\u2296','CirclePlus':'\u2295','CircleTimes':'\u2297','cir':'\u25CB','cirE':'\u29C3','cire':'\u2257','cirfnint':'\u2A10','cirmid':'\u2AEF','cirscir':'\u29C2','ClockwiseContourIntegral':'\u2232','CloseCurlyDoubleQuote':'\u201D','CloseCurlyQuote':'\u2019','clubs':'\u2663','clubsuit':'\u2663','colon':':','Colon':'\u2237','Colone':'\u2A74','colone':'\u2254','coloneq':'\u2254','comma':',','commat':'@','comp':'\u2201','compfn':'\u2218','complement':'\u2201','complexes':'\u2102','cong':'\u2245','congdot':'\u2A6D','Congruent':'\u2261','conint':'\u222E','Conint':'\u222F','ContourIntegral':'\u222E','copf':'\uD835\uDD54','Copf':'\u2102','coprod':'\u2210','Coproduct':'\u2210','copy':'\xA9','COPY':'\xA9','copysr':'\u2117','CounterClockwiseContourIntegral':'\u2233','crarr':'\u21B5','cross':'\u2717','Cross':'\u2A2F','Cscr':'\uD835\uDC9E','cscr':'\uD835\uDCB8','csub':'\u2ACF','csube':'\u2AD1','csup':'\u2AD0','csupe':'\u2AD2','ctdot':'\u22EF','cudarrl':'\u2938','cudarrr':'\u2935','cuepr':'\u22DE','cuesc':'\u22DF','cularr':'\u21B6','cularrp':'\u293D','cupbrcap':'\u2A48','cupcap':'\u2A46','CupCap':'\u224D','cup':'\u222A','Cup':'\u22D3','cupcup':'\u2A4A','cupdot':'\u228D','cupor':'\u2A45','cups':'\u222A\uFE00','curarr':'\u21B7','curarrm':'\u293C','curlyeqprec':'\u22DE','curlyeqsucc':'\u22DF','curlyvee':'\u22CE','curlywedge':'\u22CF','curren':'\xA4','curvearrowleft':'\u21B6','curvearrowright':'\u21B7','cuvee':'\u22CE','cuwed':'\u22CF','cwconint':'\u2232','cwint':'\u2231','cylcty':'\u232D','dagger':'\u2020','Dagger':'\u2021','daleth':'\u2138','darr':'\u2193','Darr':'\u21A1','dArr':'\u21D3','dash':'\u2010','Dashv':'\u2AE4','dashv':'\u22A3','dbkarow':'\u290F','dblac':'\u02DD','Dcaron':'\u010E','dcaron':'\u010F','Dcy':'\u0414','dcy':'\u0434','ddagger':'\u2021','ddarr':'\u21CA','DD':'\u2145','dd':'\u2146','DDotrahd':'\u2911','ddotseq':'\u2A77','deg':'\xB0','Del':'\u2207','Delta':'\u0394','delta':'\u03B4','demptyv':'\u29B1','dfisht':'\u297F','Dfr':'\uD835\uDD07','dfr':'\uD835\uDD21','dHar':'\u2965','dharl':'\u21C3','dharr':'\u21C2','DiacriticalAcute':'\xB4','DiacriticalDot':'\u02D9','DiacriticalDoubleAcute':'\u02DD','DiacriticalGrave':'`','DiacriticalTilde':'\u02DC','diam':'\u22C4','diamond':'\u22C4','Diamond':'\u22C4','diamondsuit':'\u2666','diams':'\u2666','die':'\xA8','DifferentialD':'\u2146','digamma':'\u03DD','disin':'\u22F2','div':'\xF7','divide':'\xF7','divideontimes':'\u22C7','divonx':'\u22C7','DJcy':'\u0402','djcy':'\u0452','dlcorn':'\u231E','dlcrop':'\u230D','dollar':'$','Dopf':'\uD835\uDD3B','dopf':'\uD835\uDD55','Dot':'\xA8','dot':'\u02D9','DotDot':'\u20DC','doteq':'\u2250','doteqdot':'\u2251','DotEqual':'\u2250','dotminus':'\u2238','dotplus':'\u2214','dotsquare':'\u22A1','doublebarwedge':'\u2306','DoubleContourIntegral':'\u222F','DoubleDot':'\xA8','DoubleDownArrow':'\u21D3','DoubleLeftArrow':'\u21D0','DoubleLeftRightArrow':'\u21D4','DoubleLeftTee':'\u2AE4','DoubleLongLeftArrow':'\u27F8','DoubleLongLeftRightArrow':'\u27FA','DoubleLongRightArrow':'\u27F9','DoubleRightArrow':'\u21D2','DoubleRightTee':'\u22A8','DoubleUpArrow':'\u21D1','DoubleUpDownArrow':'\u21D5','DoubleVerticalBar':'\u2225','DownArrowBar':'\u2913','downarrow':'\u2193','DownArrow':'\u2193','Downarrow':'\u21D3','DownArrowUpArrow':'\u21F5','DownBreve':'\u0311','downdownarrows':'\u21CA','downharpoonleft':'\u21C3','downharpoonright':'\u21C2','DownLeftRightVector':'\u2950','DownLeftTeeVector':'\u295E','DownLeftVectorBar':'\u2956','DownLeftVector':'\u21BD','DownRightTeeVector':'\u295F','DownRightVectorBar':'\u2957','DownRightVector':'\u21C1','DownTeeArrow':'\u21A7','DownTee':'\u22A4','drbkarow':'\u2910','drcorn':'\u231F','drcrop':'\u230C','Dscr':'\uD835\uDC9F','dscr':'\uD835\uDCB9','DScy':'\u0405','dscy':'\u0455','dsol':'\u29F6','Dstrok':'\u0110','dstrok':'\u0111','dtdot':'\u22F1','dtri':'\u25BF','dtrif':'\u25BE','duarr':'\u21F5','duhar':'\u296F','dwangle':'\u29A6','DZcy':'\u040F','dzcy':'\u045F','dzigrarr':'\u27FF','Eacute':'\xC9','eacute':'\xE9','easter':'\u2A6E','Ecaron':'\u011A','ecaron':'\u011B','Ecirc':'\xCA','ecirc':'\xEA','ecir':'\u2256','ecolon':'\u2255','Ecy':'\u042D','ecy':'\u044D','eDDot':'\u2A77','Edot':'\u0116','edot':'\u0117','eDot':'\u2251','ee':'\u2147','efDot':'\u2252','Efr':'\uD835\uDD08','efr':'\uD835\uDD22','eg':'\u2A9A','Egrave':'\xC8','egrave':'\xE8','egs':'\u2A96','egsdot':'\u2A98','el':'\u2A99','Element':'\u2208','elinters':'\u23E7','ell':'\u2113','els':'\u2A95','elsdot':'\u2A97','Emacr':'\u0112','emacr':'\u0113','empty':'\u2205','emptyset':'\u2205','EmptySmallSquare':'\u25FB','emptyv':'\u2205','EmptyVerySmallSquare':'\u25AB','emsp13':'\u2004','emsp14':'\u2005','emsp':'\u2003','ENG':'\u014A','eng':'\u014B','ensp':'\u2002','Eogon':'\u0118','eogon':'\u0119','Eopf':'\uD835\uDD3C','eopf':'\uD835\uDD56','epar':'\u22D5','eparsl':'\u29E3','eplus':'\u2A71','epsi':'\u03B5','Epsilon':'\u0395','epsilon':'\u03B5','epsiv':'\u03F5','eqcirc':'\u2256','eqcolon':'\u2255','eqsim':'\u2242','eqslantgtr':'\u2A96','eqslantless':'\u2A95','Equal':'\u2A75','equals':'=','EqualTilde':'\u2242','equest':'\u225F','Equilibrium':'\u21CC','equiv':'\u2261','equivDD':'\u2A78','eqvparsl':'\u29E5','erarr':'\u2971','erDot':'\u2253','escr':'\u212F','Escr':'\u2130','esdot':'\u2250','Esim':'\u2A73','esim':'\u2242','Eta':'\u0397','eta':'\u03B7','ETH':'\xD0','eth':'\xF0','Euml':'\xCB','euml':'\xEB','euro':'\u20AC','excl':'!','exist':'\u2203','Exists':'\u2203','expectation':'\u2130','exponentiale':'\u2147','ExponentialE':'\u2147','fallingdotseq':'\u2252','Fcy':'\u0424','fcy':'\u0444','female':'\u2640','ffilig':'\uFB03','fflig':'\uFB00','ffllig':'\uFB04','Ffr':'\uD835\uDD09','ffr':'\uD835\uDD23','filig':'\uFB01','FilledSmallSquare':'\u25FC','FilledVerySmallSquare':'\u25AA','fjlig':'fj','flat':'\u266D','fllig':'\uFB02','fltns':'\u25B1','fnof':'\u0192','Fopf':'\uD835\uDD3D','fopf':'\uD835\uDD57','forall':'\u2200','ForAll':'\u2200','fork':'\u22D4','forkv':'\u2AD9','Fouriertrf':'\u2131','fpartint':'\u2A0D','frac12':'\xBD','frac13':'\u2153','frac14':'\xBC','frac15':'\u2155','frac16':'\u2159','frac18':'\u215B','frac23':'\u2154','frac25':'\u2156','frac34':'\xBE','frac35':'\u2157','frac38':'\u215C','frac45':'\u2158','frac56':'\u215A','frac58':'\u215D','frac78':'\u215E','frasl':'\u2044','frown':'\u2322','fscr':'\uD835\uDCBB','Fscr':'\u2131','gacute':'\u01F5','Gamma':'\u0393','gamma':'\u03B3','Gammad':'\u03DC','gammad':'\u03DD','gap':'\u2A86','Gbreve':'\u011E','gbreve':'\u011F','Gcedil':'\u0122','Gcirc':'\u011C','gcirc':'\u011D','Gcy':'\u0413','gcy':'\u0433','Gdot':'\u0120','gdot':'\u0121','ge':'\u2265','gE':'\u2267','gEl':'\u2A8C','gel':'\u22DB','geq':'\u2265','geqq':'\u2267','geqslant':'\u2A7E','gescc':'\u2AA9','ges':'\u2A7E','gesdot':'\u2A80','gesdoto':'\u2A82','gesdotol':'\u2A84','gesl':'\u22DB\uFE00','gesles':'\u2A94','Gfr':'\uD835\uDD0A','gfr':'\uD835\uDD24','gg':'\u226B','Gg':'\u22D9','ggg':'\u22D9','gimel':'\u2137','GJcy':'\u0403','gjcy':'\u0453','gla':'\u2AA5','gl':'\u2277','glE':'\u2A92','glj':'\u2AA4','gnap':'\u2A8A','gnapprox':'\u2A8A','gne':'\u2A88','gnE':'\u2269','gneq':'\u2A88','gneqq':'\u2269','gnsim':'\u22E7','Gopf':'\uD835\uDD3E','gopf':'\uD835\uDD58','grave':'`','GreaterEqual':'\u2265','GreaterEqualLess':'\u22DB','GreaterFullEqual':'\u2267','GreaterGreater':'\u2AA2','GreaterLess':'\u2277','GreaterSlantEqual':'\u2A7E','GreaterTilde':'\u2273','Gscr':'\uD835\uDCA2','gscr':'\u210A','gsim':'\u2273','gsime':'\u2A8E','gsiml':'\u2A90','gtcc':'\u2AA7','gtcir':'\u2A7A','gt':'>','GT':'>','Gt':'\u226B','gtdot':'\u22D7','gtlPar':'\u2995','gtquest':'\u2A7C','gtrapprox':'\u2A86','gtrarr':'\u2978','gtrdot':'\u22D7','gtreqless':'\u22DB','gtreqqless':'\u2A8C','gtrless':'\u2277','gtrsim':'\u2273','gvertneqq':'\u2269\uFE00','gvnE':'\u2269\uFE00','Hacek':'\u02C7','hairsp':'\u200A','half':'\xBD','hamilt':'\u210B','HARDcy':'\u042A','hardcy':'\u044A','harrcir':'\u2948','harr':'\u2194','hArr':'\u21D4','harrw':'\u21AD','Hat':'^','hbar':'\u210F','Hcirc':'\u0124','hcirc':'\u0125','hearts':'\u2665','heartsuit':'\u2665','hellip':'\u2026','hercon':'\u22B9','hfr':'\uD835\uDD25','Hfr':'\u210C','HilbertSpace':'\u210B','hksearow':'\u2925','hkswarow':'\u2926','hoarr':'\u21FF','homtht':'\u223B','hookleftarrow':'\u21A9','hookrightarrow':'\u21AA','hopf':'\uD835\uDD59','Hopf':'\u210D','horbar':'\u2015','HorizontalLine':'\u2500','hscr':'\uD835\uDCBD','Hscr':'\u210B','hslash':'\u210F','Hstrok':'\u0126','hstrok':'\u0127','HumpDownHump':'\u224E','HumpEqual':'\u224F','hybull':'\u2043','hyphen':'\u2010','Iacute':'\xCD','iacute':'\xED','ic':'\u2063','Icirc':'\xCE','icirc':'\xEE','Icy':'\u0418','icy':'\u0438','Idot':'\u0130','IEcy':'\u0415','iecy':'\u0435','iexcl':'\xA1','iff':'\u21D4','ifr':'\uD835\uDD26','Ifr':'\u2111','Igrave':'\xCC','igrave':'\xEC','ii':'\u2148','iiiint':'\u2A0C','iiint':'\u222D','iinfin':'\u29DC','iiota':'\u2129','IJlig':'\u0132','ijlig':'\u0133','Imacr':'\u012A','imacr':'\u012B','image':'\u2111','ImaginaryI':'\u2148','imagline':'\u2110','imagpart':'\u2111','imath':'\u0131','Im':'\u2111','imof':'\u22B7','imped':'\u01B5','Implies':'\u21D2','incare':'\u2105','in':'\u2208','infin':'\u221E','infintie':'\u29DD','inodot':'\u0131','intcal':'\u22BA','int':'\u222B','Int':'\u222C','integers':'\u2124','Integral':'\u222B','intercal':'\u22BA','Intersection':'\u22C2','intlarhk':'\u2A17','intprod':'\u2A3C','InvisibleComma':'\u2063','InvisibleTimes':'\u2062','IOcy':'\u0401','iocy':'\u0451','Iogon':'\u012E','iogon':'\u012F','Iopf':'\uD835\uDD40','iopf':'\uD835\uDD5A','Iota':'\u0399','iota':'\u03B9','iprod':'\u2A3C','iquest':'\xBF','iscr':'\uD835\uDCBE','Iscr':'\u2110','isin':'\u2208','isindot':'\u22F5','isinE':'\u22F9','isins':'\u22F4','isinsv':'\u22F3','isinv':'\u2208','it':'\u2062','Itilde':'\u0128','itilde':'\u0129','Iukcy':'\u0406','iukcy':'\u0456','Iuml':'\xCF','iuml':'\xEF','Jcirc':'\u0134','jcirc':'\u0135','Jcy':'\u0419','jcy':'\u0439','Jfr':'\uD835\uDD0D','jfr':'\uD835\uDD27','jmath':'\u0237','Jopf':'\uD835\uDD41','jopf':'\uD835\uDD5B','Jscr':'\uD835\uDCA5','jscr':'\uD835\uDCBF','Jsercy':'\u0408','jsercy':'\u0458','Jukcy':'\u0404','jukcy':'\u0454','Kappa':'\u039A','kappa':'\u03BA','kappav':'\u03F0','Kcedil':'\u0136','kcedil':'\u0137','Kcy':'\u041A','kcy':'\u043A','Kfr':'\uD835\uDD0E','kfr':'\uD835\uDD28','kgreen':'\u0138','KHcy':'\u0425','khcy':'\u0445','KJcy':'\u040C','kjcy':'\u045C','Kopf':'\uD835\uDD42','kopf':'\uD835\uDD5C','Kscr':'\uD835\uDCA6','kscr':'\uD835\uDCC0','lAarr':'\u21DA','Lacute':'\u0139','lacute':'\u013A','laemptyv':'\u29B4','lagran':'\u2112','Lambda':'\u039B','lambda':'\u03BB','lang':'\u27E8','Lang':'\u27EA','langd':'\u2991','langle':'\u27E8','lap':'\u2A85','Laplacetrf':'\u2112','laquo':'\xAB','larrb':'\u21E4','larrbfs':'\u291F','larr':'\u2190','Larr':'\u219E','lArr':'\u21D0','larrfs':'\u291D','larrhk':'\u21A9','larrlp':'\u21AB','larrpl':'\u2939','larrsim':'\u2973','larrtl':'\u21A2','latail':'\u2919','lAtail':'\u291B','lat':'\u2AAB','late':'\u2AAD','lates':'\u2AAD\uFE00','lbarr':'\u290C','lBarr':'\u290E','lbbrk':'\u2772','lbrace':'{','lbrack':'[','lbrke':'\u298B','lbrksld':'\u298F','lbrkslu':'\u298D','Lcaron':'\u013D','lcaron':'\u013E','Lcedil':'\u013B','lcedil':'\u013C','lceil':'\u2308','lcub':'{','Lcy':'\u041B','lcy':'\u043B','ldca':'\u2936','ldquo':'\u201C','ldquor':'\u201E','ldrdhar':'\u2967','ldrushar':'\u294B','ldsh':'\u21B2','le':'\u2264','lE':'\u2266','LeftAngleBracket':'\u27E8','LeftArrowBar':'\u21E4','leftarrow':'\u2190','LeftArrow':'\u2190','Leftarrow':'\u21D0','LeftArrowRightArrow':'\u21C6','leftarrowtail':'\u21A2','LeftCeiling':'\u2308','LeftDoubleBracket':'\u27E6','LeftDownTeeVector':'\u2961','LeftDownVectorBar':'\u2959','LeftDownVector':'\u21C3','LeftFloor':'\u230A','leftharpoondown':'\u21BD','leftharpoonup':'\u21BC','leftleftarrows':'\u21C7','leftrightarrow':'\u2194','LeftRightArrow':'\u2194','Leftrightarrow':'\u21D4','leftrightarrows':'\u21C6','leftrightharpoons':'\u21CB','leftrightsquigarrow':'\u21AD','LeftRightVector':'\u294E','LeftTeeArrow':'\u21A4','LeftTee':'\u22A3','LeftTeeVector':'\u295A','leftthreetimes':'\u22CB','LeftTriangleBar':'\u29CF','LeftTriangle':'\u22B2','LeftTriangleEqual':'\u22B4','LeftUpDownVector':'\u2951','LeftUpTeeVector':'\u2960','LeftUpVectorBar':'\u2958','LeftUpVector':'\u21BF','LeftVectorBar':'\u2952','LeftVector':'\u21BC','lEg':'\u2A8B','leg':'\u22DA','leq':'\u2264','leqq':'\u2266','leqslant':'\u2A7D','lescc':'\u2AA8','les':'\u2A7D','lesdot':'\u2A7F','lesdoto':'\u2A81','lesdotor':'\u2A83','lesg':'\u22DA\uFE00','lesges':'\u2A93','lessapprox':'\u2A85','lessdot':'\u22D6','lesseqgtr':'\u22DA','lesseqqgtr':'\u2A8B','LessEqualGreater':'\u22DA','LessFullEqual':'\u2266','LessGreater':'\u2276','lessgtr':'\u2276','LessLess':'\u2AA1','lesssim':'\u2272','LessSlantEqual':'\u2A7D','LessTilde':'\u2272','lfisht':'\u297C','lfloor':'\u230A','Lfr':'\uD835\uDD0F','lfr':'\uD835\uDD29','lg':'\u2276','lgE':'\u2A91','lHar':'\u2962','lhard':'\u21BD','lharu':'\u21BC','lharul':'\u296A','lhblk':'\u2584','LJcy':'\u0409','ljcy':'\u0459','llarr':'\u21C7','ll':'\u226A','Ll':'\u22D8','llcorner':'\u231E','Lleftarrow':'\u21DA','llhard':'\u296B','lltri':'\u25FA','Lmidot':'\u013F','lmidot':'\u0140','lmoustache':'\u23B0','lmoust':'\u23B0','lnap':'\u2A89','lnapprox':'\u2A89','lne':'\u2A87','lnE':'\u2268','lneq':'\u2A87','lneqq':'\u2268','lnsim':'\u22E6','loang':'\u27EC','loarr':'\u21FD','lobrk':'\u27E6','longleftarrow':'\u27F5','LongLeftArrow':'\u27F5','Longleftarrow':'\u27F8','longleftrightarrow':'\u27F7','LongLeftRightArrow':'\u27F7','Longleftrightarrow':'\u27FA','longmapsto':'\u27FC','longrightarrow':'\u27F6','LongRightArrow':'\u27F6','Longrightarrow':'\u27F9','looparrowleft':'\u21AB','looparrowright':'\u21AC','lopar':'\u2985','Lopf':'\uD835\uDD43','lopf':'\uD835\uDD5D','loplus':'\u2A2D','lotimes':'\u2A34','lowast':'\u2217','lowbar':'_','LowerLeftArrow':'\u2199','LowerRightArrow':'\u2198','loz':'\u25CA','lozenge':'\u25CA','lozf':'\u29EB','lpar':'(','lparlt':'\u2993','lrarr':'\u21C6','lrcorner':'\u231F','lrhar':'\u21CB','lrhard':'\u296D','lrm':'\u200E','lrtri':'\u22BF','lsaquo':'\u2039','lscr':'\uD835\uDCC1','Lscr':'\u2112','lsh':'\u21B0','Lsh':'\u21B0','lsim':'\u2272','lsime':'\u2A8D','lsimg':'\u2A8F','lsqb':'[','lsquo':'\u2018','lsquor':'\u201A','Lstrok':'\u0141','lstrok':'\u0142','ltcc':'\u2AA6','ltcir':'\u2A79','lt':'<','LT':'<','Lt':'\u226A','ltdot':'\u22D6','lthree':'\u22CB','ltimes':'\u22C9','ltlarr':'\u2976','ltquest':'\u2A7B','ltri':'\u25C3','ltrie':'\u22B4','ltrif':'\u25C2','ltrPar':'\u2996','lurdshar':'\u294A','luruhar':'\u2966','lvertneqq':'\u2268\uFE00','lvnE':'\u2268\uFE00','macr':'\xAF','male':'\u2642','malt':'\u2720','maltese':'\u2720','Map':'\u2905','map':'\u21A6','mapsto':'\u21A6','mapstodown':'\u21A7','mapstoleft':'\u21A4','mapstoup':'\u21A5','marker':'\u25AE','mcomma':'\u2A29','Mcy':'\u041C','mcy':'\u043C','mdash':'\u2014','mDDot':'\u223A','measuredangle':'\u2221','MediumSpace':'\u205F','Mellintrf':'\u2133','Mfr':'\uD835\uDD10','mfr':'\uD835\uDD2A','mho':'\u2127','micro':'\xB5','midast':'*','midcir':'\u2AF0','mid':'\u2223','middot':'\xB7','minusb':'\u229F','minus':'\u2212','minusd':'\u2238','minusdu':'\u2A2A','MinusPlus':'\u2213','mlcp':'\u2ADB','mldr':'\u2026','mnplus':'\u2213','models':'\u22A7','Mopf':'\uD835\uDD44','mopf':'\uD835\uDD5E','mp':'\u2213','mscr':'\uD835\uDCC2','Mscr':'\u2133','mstpos':'\u223E','Mu':'\u039C','mu':'\u03BC','multimap':'\u22B8','mumap':'\u22B8','nabla':'\u2207','Nacute':'\u0143','nacute':'\u0144','nang':'\u2220\u20D2','nap':'\u2249','napE':'\u2A70\u0338','napid':'\u224B\u0338','napos':'\u0149','napprox':'\u2249','natural':'\u266E','naturals':'\u2115','natur':'\u266E','nbsp':'\xA0','nbump':'\u224E\u0338','nbumpe':'\u224F\u0338','ncap':'\u2A43','Ncaron':'\u0147','ncaron':'\u0148','Ncedil':'\u0145','ncedil':'\u0146','ncong':'\u2247','ncongdot':'\u2A6D\u0338','ncup':'\u2A42','Ncy':'\u041D','ncy':'\u043D','ndash':'\u2013','nearhk':'\u2924','nearr':'\u2197','neArr':'\u21D7','nearrow':'\u2197','ne':'\u2260','nedot':'\u2250\u0338','NegativeMediumSpace':'\u200B','NegativeThickSpace':'\u200B','NegativeThinSpace':'\u200B','NegativeVeryThinSpace':'\u200B','nequiv':'\u2262','nesear':'\u2928','nesim':'\u2242\u0338','NestedGreaterGreater':'\u226B','NestedLessLess':'\u226A','NewLine':'\n','nexist':'\u2204','nexists':'\u2204','Nfr':'\uD835\uDD11','nfr':'\uD835\uDD2B','ngE':'\u2267\u0338','nge':'\u2271','ngeq':'\u2271','ngeqq':'\u2267\u0338','ngeqslant':'\u2A7E\u0338','nges':'\u2A7E\u0338','nGg':'\u22D9\u0338','ngsim':'\u2275','nGt':'\u226B\u20D2','ngt':'\u226F','ngtr':'\u226F','nGtv':'\u226B\u0338','nharr':'\u21AE','nhArr':'\u21CE','nhpar':'\u2AF2','ni':'\u220B','nis':'\u22FC','nisd':'\u22FA','niv':'\u220B','NJcy':'\u040A','njcy':'\u045A','nlarr':'\u219A','nlArr':'\u21CD','nldr':'\u2025','nlE':'\u2266\u0338','nle':'\u2270','nleftarrow':'\u219A','nLeftarrow':'\u21CD','nleftrightarrow':'\u21AE','nLeftrightarrow':'\u21CE','nleq':'\u2270','nleqq':'\u2266\u0338','nleqslant':'\u2A7D\u0338','nles':'\u2A7D\u0338','nless':'\u226E','nLl':'\u22D8\u0338','nlsim':'\u2274','nLt':'\u226A\u20D2','nlt':'\u226E','nltri':'\u22EA','nltrie':'\u22EC','nLtv':'\u226A\u0338','nmid':'\u2224','NoBreak':'\u2060','NonBreakingSpace':'\xA0','nopf':'\uD835\uDD5F','Nopf':'\u2115','Not':'\u2AEC','not':'\xAC','NotCongruent':'\u2262','NotCupCap':'\u226D','NotDoubleVerticalBar':'\u2226','NotElement':'\u2209','NotEqual':'\u2260','NotEqualTilde':'\u2242\u0338','NotExists':'\u2204','NotGreater':'\u226F','NotGreaterEqual':'\u2271','NotGreaterFullEqual':'\u2267\u0338','NotGreaterGreater':'\u226B\u0338','NotGreaterLess':'\u2279','NotGreaterSlantEqual':'\u2A7E\u0338','NotGreaterTilde':'\u2275','NotHumpDownHump':'\u224E\u0338','NotHumpEqual':'\u224F\u0338','notin':'\u2209','notindot':'\u22F5\u0338','notinE':'\u22F9\u0338','notinva':'\u2209','notinvb':'\u22F7','notinvc':'\u22F6','NotLeftTriangleBar':'\u29CF\u0338','NotLeftTriangle':'\u22EA','NotLeftTriangleEqual':'\u22EC','NotLess':'\u226E','NotLessEqual':'\u2270','NotLessGreater':'\u2278','NotLessLess':'\u226A\u0338','NotLessSlantEqual':'\u2A7D\u0338','NotLessTilde':'\u2274','NotNestedGreaterGreater':'\u2AA2\u0338','NotNestedLessLess':'\u2AA1\u0338','notni':'\u220C','notniva':'\u220C','notnivb':'\u22FE','notnivc':'\u22FD','NotPrecedes':'\u2280','NotPrecedesEqual':'\u2AAF\u0338','NotPrecedesSlantEqual':'\u22E0','NotReverseElement':'\u220C','NotRightTriangleBar':'\u29D0\u0338','NotRightTriangle':'\u22EB','NotRightTriangleEqual':'\u22ED','NotSquareSubset':'\u228F\u0338','NotSquareSubsetEqual':'\u22E2','NotSquareSuperset':'\u2290\u0338','NotSquareSupersetEqual':'\u22E3','NotSubset':'\u2282\u20D2','NotSubsetEqual':'\u2288','NotSucceeds':'\u2281','NotSucceedsEqual':'\u2AB0\u0338','NotSucceedsSlantEqual':'\u22E1','NotSucceedsTilde':'\u227F\u0338','NotSuperset':'\u2283\u20D2','NotSupersetEqual':'\u2289','NotTilde':'\u2241','NotTildeEqual':'\u2244','NotTildeFullEqual':'\u2247','NotTildeTilde':'\u2249','NotVerticalBar':'\u2224','nparallel':'\u2226','npar':'\u2226','nparsl':'\u2AFD\u20E5','npart':'\u2202\u0338','npolint':'\u2A14','npr':'\u2280','nprcue':'\u22E0','nprec':'\u2280','npreceq':'\u2AAF\u0338','npre':'\u2AAF\u0338','nrarrc':'\u2933\u0338','nrarr':'\u219B','nrArr':'\u21CF','nrarrw':'\u219D\u0338','nrightarrow':'\u219B','nRightarrow':'\u21CF','nrtri':'\u22EB','nrtrie':'\u22ED','nsc':'\u2281','nsccue':'\u22E1','nsce':'\u2AB0\u0338','Nscr':'\uD835\uDCA9','nscr':'\uD835\uDCC3','nshortmid':'\u2224','nshortparallel':'\u2226','nsim':'\u2241','nsime':'\u2244','nsimeq':'\u2244','nsmid':'\u2224','nspar':'\u2226','nsqsube':'\u22E2','nsqsupe':'\u22E3','nsub':'\u2284','nsubE':'\u2AC5\u0338','nsube':'\u2288','nsubset':'\u2282\u20D2','nsubseteq':'\u2288','nsubseteqq':'\u2AC5\u0338','nsucc':'\u2281','nsucceq':'\u2AB0\u0338','nsup':'\u2285','nsupE':'\u2AC6\u0338','nsupe':'\u2289','nsupset':'\u2283\u20D2','nsupseteq':'\u2289','nsupseteqq':'\u2AC6\u0338','ntgl':'\u2279','Ntilde':'\xD1','ntilde':'\xF1','ntlg':'\u2278','ntriangleleft':'\u22EA','ntrianglelefteq':'\u22EC','ntriangleright':'\u22EB','ntrianglerighteq':'\u22ED','Nu':'\u039D','nu':'\u03BD','num':'#','numero':'\u2116','numsp':'\u2007','nvap':'\u224D\u20D2','nvdash':'\u22AC','nvDash':'\u22AD','nVdash':'\u22AE','nVDash':'\u22AF','nvge':'\u2265\u20D2','nvgt':'>\u20D2','nvHarr':'\u2904','nvinfin':'\u29DE','nvlArr':'\u2902','nvle':'\u2264\u20D2','nvlt':'<\u20D2','nvltrie':'\u22B4\u20D2','nvrArr':'\u2903','nvrtrie':'\u22B5\u20D2','nvsim':'\u223C\u20D2','nwarhk':'\u2923','nwarr':'\u2196','nwArr':'\u21D6','nwarrow':'\u2196','nwnear':'\u2927','Oacute':'\xD3','oacute':'\xF3','oast':'\u229B','Ocirc':'\xD4','ocirc':'\xF4','ocir':'\u229A','Ocy':'\u041E','ocy':'\u043E','odash':'\u229D','Odblac':'\u0150','odblac':'\u0151','odiv':'\u2A38','odot':'\u2299','odsold':'\u29BC','OElig':'\u0152','oelig':'\u0153','ofcir':'\u29BF','Ofr':'\uD835\uDD12','ofr':'\uD835\uDD2C','ogon':'\u02DB','Ograve':'\xD2','ograve':'\xF2','ogt':'\u29C1','ohbar':'\u29B5','ohm':'\u03A9','oint':'\u222E','olarr':'\u21BA','olcir':'\u29BE','olcross':'\u29BB','oline':'\u203E','olt':'\u29C0','Omacr':'\u014C','omacr':'\u014D','Omega':'\u03A9','omega':'\u03C9','Omicron':'\u039F','omicron':'\u03BF','omid':'\u29B6','ominus':'\u2296','Oopf':'\uD835\uDD46','oopf':'\uD835\uDD60','opar':'\u29B7','OpenCurlyDoubleQuote':'\u201C','OpenCurlyQuote':'\u2018','operp':'\u29B9','oplus':'\u2295','orarr':'\u21BB','Or':'\u2A54','or':'\u2228','ord':'\u2A5D','order':'\u2134','orderof':'\u2134','ordf':'\xAA','ordm':'\xBA','origof':'\u22B6','oror':'\u2A56','orslope':'\u2A57','orv':'\u2A5B','oS':'\u24C8','Oscr':'\uD835\uDCAA','oscr':'\u2134','Oslash':'\xD8','oslash':'\xF8','osol':'\u2298','Otilde':'\xD5','otilde':'\xF5','otimesas':'\u2A36','Otimes':'\u2A37','otimes':'\u2297','Ouml':'\xD6','ouml':'\xF6','ovbar':'\u233D','OverBar':'\u203E','OverBrace':'\u23DE','OverBracket':'\u23B4','OverParenthesis':'\u23DC','para':'\xB6','parallel':'\u2225','par':'\u2225','parsim':'\u2AF3','parsl':'\u2AFD','part':'\u2202','PartialD':'\u2202','Pcy':'\u041F','pcy':'\u043F','percnt':'%','period':'.','permil':'\u2030','perp':'\u22A5','pertenk':'\u2031','Pfr':'\uD835\uDD13','pfr':'\uD835\uDD2D','Phi':'\u03A6','phi':'\u03C6','phiv':'\u03D5','phmmat':'\u2133','phone':'\u260E','Pi':'\u03A0','pi':'\u03C0','pitchfork':'\u22D4','piv':'\u03D6','planck':'\u210F','planckh':'\u210E','plankv':'\u210F','plusacir':'\u2A23','plusb':'\u229E','pluscir':'\u2A22','plus':'+','plusdo':'\u2214','plusdu':'\u2A25','pluse':'\u2A72','PlusMinus':'\xB1','plusmn':'\xB1','plussim':'\u2A26','plustwo':'\u2A27','pm':'\xB1','Poincareplane':'\u210C','pointint':'\u2A15','popf':'\uD835\uDD61','Popf':'\u2119','pound':'\xA3','prap':'\u2AB7','Pr':'\u2ABB','pr':'\u227A','prcue':'\u227C','precapprox':'\u2AB7','prec':'\u227A','preccurlyeq':'\u227C','Precedes':'\u227A','PrecedesEqual':'\u2AAF','PrecedesSlantEqual':'\u227C','PrecedesTilde':'\u227E','preceq':'\u2AAF','precnapprox':'\u2AB9','precneqq':'\u2AB5','precnsim':'\u22E8','pre':'\u2AAF','prE':'\u2AB3','precsim':'\u227E','prime':'\u2032','Prime':'\u2033','primes':'\u2119','prnap':'\u2AB9','prnE':'\u2AB5','prnsim':'\u22E8','prod':'\u220F','Product':'\u220F','profalar':'\u232E','profline':'\u2312','profsurf':'\u2313','prop':'\u221D','Proportional':'\u221D','Proportion':'\u2237','propto':'\u221D','prsim':'\u227E','prurel':'\u22B0','Pscr':'\uD835\uDCAB','pscr':'\uD835\uDCC5','Psi':'\u03A8','psi':'\u03C8','puncsp':'\u2008','Qfr':'\uD835\uDD14','qfr':'\uD835\uDD2E','qint':'\u2A0C','qopf':'\uD835\uDD62','Qopf':'\u211A','qprime':'\u2057','Qscr':'\uD835\uDCAC','qscr':'\uD835\uDCC6','quaternions':'\u210D','quatint':'\u2A16','quest':'?','questeq':'\u225F','quot':'"','QUOT':'"','rAarr':'\u21DB','race':'\u223D\u0331','Racute':'\u0154','racute':'\u0155','radic':'\u221A','raemptyv':'\u29B3','rang':'\u27E9','Rang':'\u27EB','rangd':'\u2992','range':'\u29A5','rangle':'\u27E9','raquo':'\xBB','rarrap':'\u2975','rarrb':'\u21E5','rarrbfs':'\u2920','rarrc':'\u2933','rarr':'\u2192','Rarr':'\u21A0','rArr':'\u21D2','rarrfs':'\u291E','rarrhk':'\u21AA','rarrlp':'\u21AC','rarrpl':'\u2945','rarrsim':'\u2974','Rarrtl':'\u2916','rarrtl':'\u21A3','rarrw':'\u219D','ratail':'\u291A','rAtail':'\u291C','ratio':'\u2236','rationals':'\u211A','rbarr':'\u290D','rBarr':'\u290F','RBarr':'\u2910','rbbrk':'\u2773','rbrace':'}','rbrack':']','rbrke':'\u298C','rbrksld':'\u298E','rbrkslu':'\u2990','Rcaron':'\u0158','rcaron':'\u0159','Rcedil':'\u0156','rcedil':'\u0157','rceil':'\u2309','rcub':'}','Rcy':'\u0420','rcy':'\u0440','rdca':'\u2937','rdldhar':'\u2969','rdquo':'\u201D','rdquor':'\u201D','rdsh':'\u21B3','real':'\u211C','realine':'\u211B','realpart':'\u211C','reals':'\u211D','Re':'\u211C','rect':'\u25AD','reg':'\xAE','REG':'\xAE','ReverseElement':'\u220B','ReverseEquilibrium':'\u21CB','ReverseUpEquilibrium':'\u296F','rfisht':'\u297D','rfloor':'\u230B','rfr':'\uD835\uDD2F','Rfr':'\u211C','rHar':'\u2964','rhard':'\u21C1','rharu':'\u21C0','rharul':'\u296C','Rho':'\u03A1','rho':'\u03C1','rhov':'\u03F1','RightAngleBracket':'\u27E9','RightArrowBar':'\u21E5','rightarrow':'\u2192','RightArrow':'\u2192','Rightarrow':'\u21D2','RightArrowLeftArrow':'\u21C4','rightarrowtail':'\u21A3','RightCeiling':'\u2309','RightDoubleBracket':'\u27E7','RightDownTeeVector':'\u295D','RightDownVectorBar':'\u2955','RightDownVector':'\u21C2','RightFloor':'\u230B','rightharpoondown':'\u21C1','rightharpoonup':'\u21C0','rightleftarrows':'\u21C4','rightleftharpoons':'\u21CC','rightrightarrows':'\u21C9','rightsquigarrow':'\u219D','RightTeeArrow':'\u21A6','RightTee':'\u22A2','RightTeeVector':'\u295B','rightthreetimes':'\u22CC','RightTriangleBar':'\u29D0','RightTriangle':'\u22B3','RightTriangleEqual':'\u22B5','RightUpDownVector':'\u294F','RightUpTeeVector':'\u295C','RightUpVectorBar':'\u2954','RightUpVector':'\u21BE','RightVectorBar':'\u2953','RightVector':'\u21C0','ring':'\u02DA','risingdotseq':'\u2253','rlarr':'\u21C4','rlhar':'\u21CC','rlm':'\u200F','rmoustache':'\u23B1','rmoust':'\u23B1','rnmid':'\u2AEE','roang':'\u27ED','roarr':'\u21FE','robrk':'\u27E7','ropar':'\u2986','ropf':'\uD835\uDD63','Ropf':'\u211D','roplus':'\u2A2E','rotimes':'\u2A35','RoundImplies':'\u2970','rpar':')','rpargt':'\u2994','rppolint':'\u2A12','rrarr':'\u21C9','Rrightarrow':'\u21DB','rsaquo':'\u203A','rscr':'\uD835\uDCC7','Rscr':'\u211B','rsh':'\u21B1','Rsh':'\u21B1','rsqb':']','rsquo':'\u2019','rsquor':'\u2019','rthree':'\u22CC','rtimes':'\u22CA','rtri':'\u25B9','rtrie':'\u22B5','rtrif':'\u25B8','rtriltri':'\u29CE','RuleDelayed':'\u29F4','ruluhar':'\u2968','rx':'\u211E','Sacute':'\u015A','sacute':'\u015B','sbquo':'\u201A','scap':'\u2AB8','Scaron':'\u0160','scaron':'\u0161','Sc':'\u2ABC','sc':'\u227B','sccue':'\u227D','sce':'\u2AB0','scE':'\u2AB4','Scedil':'\u015E','scedil':'\u015F','Scirc':'\u015C','scirc':'\u015D','scnap':'\u2ABA','scnE':'\u2AB6','scnsim':'\u22E9','scpolint':'\u2A13','scsim':'\u227F','Scy':'\u0421','scy':'\u0441','sdotb':'\u22A1','sdot':'\u22C5','sdote':'\u2A66','searhk':'\u2925','searr':'\u2198','seArr':'\u21D8','searrow':'\u2198','sect':'\xA7','semi':';','seswar':'\u2929','setminus':'\u2216','setmn':'\u2216','sext':'\u2736','Sfr':'\uD835\uDD16','sfr':'\uD835\uDD30','sfrown':'\u2322','sharp':'\u266F','SHCHcy':'\u0429','shchcy':'\u0449','SHcy':'\u0428','shcy':'\u0448','ShortDownArrow':'\u2193','ShortLeftArrow':'\u2190','shortmid':'\u2223','shortparallel':'\u2225','ShortRightArrow':'\u2192','ShortUpArrow':'\u2191','shy':'\xAD','Sigma':'\u03A3','sigma':'\u03C3','sigmaf':'\u03C2','sigmav':'\u03C2','sim':'\u223C','simdot':'\u2A6A','sime':'\u2243','simeq':'\u2243','simg':'\u2A9E','simgE':'\u2AA0','siml':'\u2A9D','simlE':'\u2A9F','simne':'\u2246','simplus':'\u2A24','simrarr':'\u2972','slarr':'\u2190','SmallCircle':'\u2218','smallsetminus':'\u2216','smashp':'\u2A33','smeparsl':'\u29E4','smid':'\u2223','smile':'\u2323','smt':'\u2AAA','smte':'\u2AAC','smtes':'\u2AAC\uFE00','SOFTcy':'\u042C','softcy':'\u044C','solbar':'\u233F','solb':'\u29C4','sol':'/','Sopf':'\uD835\uDD4A','sopf':'\uD835\uDD64','spades':'\u2660','spadesuit':'\u2660','spar':'\u2225','sqcap':'\u2293','sqcaps':'\u2293\uFE00','sqcup':'\u2294','sqcups':'\u2294\uFE00','Sqrt':'\u221A','sqsub':'\u228F','sqsube':'\u2291','sqsubset':'\u228F','sqsubseteq':'\u2291','sqsup':'\u2290','sqsupe':'\u2292','sqsupset':'\u2290','sqsupseteq':'\u2292','square':'\u25A1','Square':'\u25A1','SquareIntersection':'\u2293','SquareSubset':'\u228F','SquareSubsetEqual':'\u2291','SquareSuperset':'\u2290','SquareSupersetEqual':'\u2292','SquareUnion':'\u2294','squarf':'\u25AA','squ':'\u25A1','squf':'\u25AA','srarr':'\u2192','Sscr':'\uD835\uDCAE','sscr':'\uD835\uDCC8','ssetmn':'\u2216','ssmile':'\u2323','sstarf':'\u22C6','Star':'\u22C6','star':'\u2606','starf':'\u2605','straightepsilon':'\u03F5','straightphi':'\u03D5','strns':'\xAF','sub':'\u2282','Sub':'\u22D0','subdot':'\u2ABD','subE':'\u2AC5','sube':'\u2286','subedot':'\u2AC3','submult':'\u2AC1','subnE':'\u2ACB','subne':'\u228A','subplus':'\u2ABF','subrarr':'\u2979','subset':'\u2282','Subset':'\u22D0','subseteq':'\u2286','subseteqq':'\u2AC5','SubsetEqual':'\u2286','subsetneq':'\u228A','subsetneqq':'\u2ACB','subsim':'\u2AC7','subsub':'\u2AD5','subsup':'\u2AD3','succapprox':'\u2AB8','succ':'\u227B','succcurlyeq':'\u227D','Succeeds':'\u227B','SucceedsEqual':'\u2AB0','SucceedsSlantEqual':'\u227D','SucceedsTilde':'\u227F','succeq':'\u2AB0','succnapprox':'\u2ABA','succneqq':'\u2AB6','succnsim':'\u22E9','succsim':'\u227F','SuchThat':'\u220B','sum':'\u2211','Sum':'\u2211','sung':'\u266A','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','sup':'\u2283','Sup':'\u22D1','supdot':'\u2ABE','supdsub':'\u2AD8','supE':'\u2AC6','supe':'\u2287','supedot':'\u2AC4','Superset':'\u2283','SupersetEqual':'\u2287','suphsol':'\u27C9','suphsub':'\u2AD7','suplarr':'\u297B','supmult':'\u2AC2','supnE':'\u2ACC','supne':'\u228B','supplus':'\u2AC0','supset':'\u2283','Supset':'\u22D1','supseteq':'\u2287','supseteqq':'\u2AC6','supsetneq':'\u228B','supsetneqq':'\u2ACC','supsim':'\u2AC8','supsub':'\u2AD4','supsup':'\u2AD6','swarhk':'\u2926','swarr':'\u2199','swArr':'\u21D9','swarrow':'\u2199','swnwar':'\u292A','szlig':'\xDF','Tab':'\t','target':'\u2316','Tau':'\u03A4','tau':'\u03C4','tbrk':'\u23B4','Tcaron':'\u0164','tcaron':'\u0165','Tcedil':'\u0162','tcedil':'\u0163','Tcy':'\u0422','tcy':'\u0442','tdot':'\u20DB','telrec':'\u2315','Tfr':'\uD835\uDD17','tfr':'\uD835\uDD31','there4':'\u2234','therefore':'\u2234','Therefore':'\u2234','Theta':'\u0398','theta':'\u03B8','thetasym':'\u03D1','thetav':'\u03D1','thickapprox':'\u2248','thicksim':'\u223C','ThickSpace':'\u205F\u200A','ThinSpace':'\u2009','thinsp':'\u2009','thkap':'\u2248','thksim':'\u223C','THORN':'\xDE','thorn':'\xFE','tilde':'\u02DC','Tilde':'\u223C','TildeEqual':'\u2243','TildeFullEqual':'\u2245','TildeTilde':'\u2248','timesbar':'\u2A31','timesb':'\u22A0','times':'\xD7','timesd':'\u2A30','tint':'\u222D','toea':'\u2928','topbot':'\u2336','topcir':'\u2AF1','top':'\u22A4','Topf':'\uD835\uDD4B','topf':'\uD835\uDD65','topfork':'\u2ADA','tosa':'\u2929','tprime':'\u2034','trade':'\u2122','TRADE':'\u2122','triangle':'\u25B5','triangledown':'\u25BF','triangleleft':'\u25C3','trianglelefteq':'\u22B4','triangleq':'\u225C','triangleright':'\u25B9','trianglerighteq':'\u22B5','tridot':'\u25EC','trie':'\u225C','triminus':'\u2A3A','TripleDot':'\u20DB','triplus':'\u2A39','trisb':'\u29CD','tritime':'\u2A3B','trpezium':'\u23E2','Tscr':'\uD835\uDCAF','tscr':'\uD835\uDCC9','TScy':'\u0426','tscy':'\u0446','TSHcy':'\u040B','tshcy':'\u045B','Tstrok':'\u0166','tstrok':'\u0167','twixt':'\u226C','twoheadleftarrow':'\u219E','twoheadrightarrow':'\u21A0','Uacute':'\xDA','uacute':'\xFA','uarr':'\u2191','Uarr':'\u219F','uArr':'\u21D1','Uarrocir':'\u2949','Ubrcy':'\u040E','ubrcy':'\u045E','Ubreve':'\u016C','ubreve':'\u016D','Ucirc':'\xDB','ucirc':'\xFB','Ucy':'\u0423','ucy':'\u0443','udarr':'\u21C5','Udblac':'\u0170','udblac':'\u0171','udhar':'\u296E','ufisht':'\u297E','Ufr':'\uD835\uDD18','ufr':'\uD835\uDD32','Ugrave':'\xD9','ugrave':'\xF9','uHar':'\u2963','uharl':'\u21BF','uharr':'\u21BE','uhblk':'\u2580','ulcorn':'\u231C','ulcorner':'\u231C','ulcrop':'\u230F','ultri':'\u25F8','Umacr':'\u016A','umacr':'\u016B','uml':'\xA8','UnderBar':'_','UnderBrace':'\u23DF','UnderBracket':'\u23B5','UnderParenthesis':'\u23DD','Union':'\u22C3','UnionPlus':'\u228E','Uogon':'\u0172','uogon':'\u0173','Uopf':'\uD835\uDD4C','uopf':'\uD835\uDD66','UpArrowBar':'\u2912','uparrow':'\u2191','UpArrow':'\u2191','Uparrow':'\u21D1','UpArrowDownArrow':'\u21C5','updownarrow':'\u2195','UpDownArrow':'\u2195','Updownarrow':'\u21D5','UpEquilibrium':'\u296E','upharpoonleft':'\u21BF','upharpoonright':'\u21BE','uplus':'\u228E','UpperLeftArrow':'\u2196','UpperRightArrow':'\u2197','upsi':'\u03C5','Upsi':'\u03D2','upsih':'\u03D2','Upsilon':'\u03A5','upsilon':'\u03C5','UpTeeArrow':'\u21A5','UpTee':'\u22A5','upuparrows':'\u21C8','urcorn':'\u231D','urcorner':'\u231D','urcrop':'\u230E','Uring':'\u016E','uring':'\u016F','urtri':'\u25F9','Uscr':'\uD835\uDCB0','uscr':'\uD835\uDCCA','utdot':'\u22F0','Utilde':'\u0168','utilde':'\u0169','utri':'\u25B5','utrif':'\u25B4','uuarr':'\u21C8','Uuml':'\xDC','uuml':'\xFC','uwangle':'\u29A7','vangrt':'\u299C','varepsilon':'\u03F5','varkappa':'\u03F0','varnothing':'\u2205','varphi':'\u03D5','varpi':'\u03D6','varpropto':'\u221D','varr':'\u2195','vArr':'\u21D5','varrho':'\u03F1','varsigma':'\u03C2','varsubsetneq':'\u228A\uFE00','varsubsetneqq':'\u2ACB\uFE00','varsupsetneq':'\u228B\uFE00','varsupsetneqq':'\u2ACC\uFE00','vartheta':'\u03D1','vartriangleleft':'\u22B2','vartriangleright':'\u22B3','vBar':'\u2AE8','Vbar':'\u2AEB','vBarv':'\u2AE9','Vcy':'\u0412','vcy':'\u0432','vdash':'\u22A2','vDash':'\u22A8','Vdash':'\u22A9','VDash':'\u22AB','Vdashl':'\u2AE6','veebar':'\u22BB','vee':'\u2228','Vee':'\u22C1','veeeq':'\u225A','vellip':'\u22EE','verbar':'|','Verbar':'\u2016','vert':'|','Vert':'\u2016','VerticalBar':'\u2223','VerticalLine':'|','VerticalSeparator':'\u2758','VerticalTilde':'\u2240','VeryThinSpace':'\u200A','Vfr':'\uD835\uDD19','vfr':'\uD835\uDD33','vltri':'\u22B2','vnsub':'\u2282\u20D2','vnsup':'\u2283\u20D2','Vopf':'\uD835\uDD4D','vopf':'\uD835\uDD67','vprop':'\u221D','vrtri':'\u22B3','Vscr':'\uD835\uDCB1','vscr':'\uD835\uDCCB','vsubnE':'\u2ACB\uFE00','vsubne':'\u228A\uFE00','vsupnE':'\u2ACC\uFE00','vsupne':'\u228B\uFE00','Vvdash':'\u22AA','vzigzag':'\u299A','Wcirc':'\u0174','wcirc':'\u0175','wedbar':'\u2A5F','wedge':'\u2227','Wedge':'\u22C0','wedgeq':'\u2259','weierp':'\u2118','Wfr':'\uD835\uDD1A','wfr':'\uD835\uDD34','Wopf':'\uD835\uDD4E','wopf':'\uD835\uDD68','wp':'\u2118','wr':'\u2240','wreath':'\u2240','Wscr':'\uD835\uDCB2','wscr':'\uD835\uDCCC','xcap':'\u22C2','xcirc':'\u25EF','xcup':'\u22C3','xdtri':'\u25BD','Xfr':'\uD835\uDD1B','xfr':'\uD835\uDD35','xharr':'\u27F7','xhArr':'\u27FA','Xi':'\u039E','xi':'\u03BE','xlarr':'\u27F5','xlArr':'\u27F8','xmap':'\u27FC','xnis':'\u22FB','xodot':'\u2A00','Xopf':'\uD835\uDD4F','xopf':'\uD835\uDD69','xoplus':'\u2A01','xotime':'\u2A02','xrarr':'\u27F6','xrArr':'\u27F9','Xscr':'\uD835\uDCB3','xscr':'\uD835\uDCCD','xsqcup':'\u2A06','xuplus':'\u2A04','xutri':'\u25B3','xvee':'\u22C1','xwedge':'\u22C0','Yacute':'\xDD','yacute':'\xFD','YAcy':'\u042F','yacy':'\u044F','Ycirc':'\u0176','ycirc':'\u0177','Ycy':'\u042B','ycy':'\u044B','yen':'\xA5','Yfr':'\uD835\uDD1C','yfr':'\uD835\uDD36','YIcy':'\u0407','yicy':'\u0457','Yopf':'\uD835\uDD50','yopf':'\uD835\uDD6A','Yscr':'\uD835\uDCB4','yscr':'\uD835\uDCCE','YUcy':'\u042E','yucy':'\u044E','yuml':'\xFF','Yuml':'\u0178','Zacute':'\u0179','zacute':'\u017A','Zcaron':'\u017D','zcaron':'\u017E','Zcy':'\u0417','zcy':'\u0437','Zdot':'\u017B','zdot':'\u017C','zeetrf':'\u2128','ZeroWidthSpace':'\u200B','Zeta':'\u0396','zeta':'\u03B6','zfr':'\uD835\uDD37','Zfr':'\u2128','ZHcy':'\u0416','zhcy':'\u0436','zigrarr':'\u21DD','zopf':'\uD835\uDD6B','Zopf':'\u2124','Zscr':'\uD835\uDCB5','zscr':'\uD835\uDCCF','zwj':'\u200D','zwnj':'\u200C'};
		var decodeMapLegacy = {'Aacute':'\xC1','aacute':'\xE1','Acirc':'\xC2','acirc':'\xE2','acute':'\xB4','AElig':'\xC6','aelig':'\xE6','Agrave':'\xC0','agrave':'\xE0','amp':'&','AMP':'&','Aring':'\xC5','aring':'\xE5','Atilde':'\xC3','atilde':'\xE3','Auml':'\xC4','auml':'\xE4','brvbar':'\xA6','Ccedil':'\xC7','ccedil':'\xE7','cedil':'\xB8','cent':'\xA2','copy':'\xA9','COPY':'\xA9','curren':'\xA4','deg':'\xB0','divide':'\xF7','Eacute':'\xC9','eacute':'\xE9','Ecirc':'\xCA','ecirc':'\xEA','Egrave':'\xC8','egrave':'\xE8','ETH':'\xD0','eth':'\xF0','Euml':'\xCB','euml':'\xEB','frac12':'\xBD','frac14':'\xBC','frac34':'\xBE','gt':'>','GT':'>','Iacute':'\xCD','iacute':'\xED','Icirc':'\xCE','icirc':'\xEE','iexcl':'\xA1','Igrave':'\xCC','igrave':'\xEC','iquest':'\xBF','Iuml':'\xCF','iuml':'\xEF','laquo':'\xAB','lt':'<','LT':'<','macr':'\xAF','micro':'\xB5','middot':'\xB7','nbsp':'\xA0','not':'\xAC','Ntilde':'\xD1','ntilde':'\xF1','Oacute':'\xD3','oacute':'\xF3','Ocirc':'\xD4','ocirc':'\xF4','Ograve':'\xD2','ograve':'\xF2','ordf':'\xAA','ordm':'\xBA','Oslash':'\xD8','oslash':'\xF8','Otilde':'\xD5','otilde':'\xF5','Ouml':'\xD6','ouml':'\xF6','para':'\xB6','plusmn':'\xB1','pound':'\xA3','quot':'"','QUOT':'"','raquo':'\xBB','reg':'\xAE','REG':'\xAE','sect':'\xA7','shy':'\xAD','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','szlig':'\xDF','THORN':'\xDE','thorn':'\xFE','times':'\xD7','Uacute':'\xDA','uacute':'\xFA','Ucirc':'\xDB','ucirc':'\xFB','Ugrave':'\xD9','ugrave':'\xF9','uml':'\xA8','Uuml':'\xDC','uuml':'\xFC','Yacute':'\xDD','yacute':'\xFD','yen':'\xA5','yuml':'\xFF'};
		var decodeMapNumeric = {'0':'\uFFFD','128':'\u20AC','130':'\u201A','131':'\u0192','132':'\u201E','133':'\u2026','134':'\u2020','135':'\u2021','136':'\u02C6','137':'\u2030','138':'\u0160','139':'\u2039','140':'\u0152','142':'\u017D','145':'\u2018','146':'\u2019','147':'\u201C','148':'\u201D','149':'\u2022','150':'\u2013','151':'\u2014','152':'\u02DC','153':'\u2122','154':'\u0161','155':'\u203A','156':'\u0153','158':'\u017E','159':'\u0178'};
		var invalidReferenceCodePoints = [1,2,3,4,5,6,7,8,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,64976,64977,64978,64979,64980,64981,64982,64983,64984,64985,64986,64987,64988,64989,64990,64991,64992,64993,64994,64995,64996,64997,64998,64999,65000,65001,65002,65003,65004,65005,65006,65007,65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111];
	
		/*--------------------------------------------------------------------------*/
	
		var stringFromCharCode = String.fromCharCode;
	
		var object = {};
		var hasOwnProperty = object.hasOwnProperty;
		var has = function(object, propertyName) {
			return hasOwnProperty.call(object, propertyName);
		};
	
		var contains = function(array, value) {
			var index = -1;
			var length = array.length;
			while (++index < length) {
				if (array[index] == value) {
					return true;
				}
			}
			return false;
		};
	
		var merge = function(options, defaults) {
			if (!options) {
				return defaults;
			}
			var result = {};
			var key;
			for (key in defaults) {
				// A `hasOwnProperty` check is not needed here, since only recognized
				// option names are used anyway. Any others are ignored.
				result[key] = has(options, key) ? options[key] : defaults[key];
			}
			return result;
		};
	
		// Modified version of `ucs2encode`; see http://mths.be/punycode.
		var codePointToSymbol = function(codePoint, strict) {
			var output = '';
			if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
				// See issue #4:
				// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
				// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
				// REPLACEMENT CHARACTER.”
				if (strict) {
					parseError('character reference outside the permissible Unicode range');
				}
				return '\uFFFD';
			}
			if (has(decodeMapNumeric, codePoint)) {
				if (strict) {
					parseError('disallowed character reference');
				}
				return decodeMapNumeric[codePoint];
			}
			if (strict && contains(invalidReferenceCodePoints, codePoint)) {
				parseError('disallowed character reference');
			}
			if (codePoint > 0xFFFF) {
				codePoint -= 0x10000;
				output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
				codePoint = 0xDC00 | codePoint & 0x3FF;
			}
			output += stringFromCharCode(codePoint);
			return output;
		};
	
		var hexEscape = function(symbol) {
			return '&#x' + symbol.charCodeAt(0).toString(16).toUpperCase() + ';';
		};
	
		var parseError = function(message) {
			throw Error('Parse error: ' + message);
		};
	
		/*--------------------------------------------------------------------------*/
	
		var encode = function(string, options) {
			options = merge(options, encode.options);
			var strict = options.strict;
			if (strict && regexInvalidRawCodePoint.test(string)) {
				parseError('forbidden code point');
			}
			var encodeEverything = options.encodeEverything;
			var useNamedReferences = options.useNamedReferences;
			var allowUnsafeSymbols = options.allowUnsafeSymbols;
			if (encodeEverything) {
				// Encode ASCII symbols.
				string = string.replace(regexAsciiWhitelist, function(symbol) {
					// Use named references if requested & possible.
					if (useNamedReferences && has(encodeMap, symbol)) {
						return '&' + encodeMap[symbol] + ';';
					}
					return hexEscape(symbol);
				});
				// Shorten a few escapes that represent two symbols, of which at least one
				// is within the ASCII range.
				if (useNamedReferences) {
					string = string
						.replace(/&gt;\u20D2/g, '&nvgt;')
						.replace(/&lt;\u20D2/g, '&nvlt;')
						.replace(/&#x66;&#x6A;/g, '&fjlig;');
				}
				// Encode non-ASCII symbols.
				if (useNamedReferences) {
					// Encode non-ASCII symbols that can be replaced with a named reference.
					string = string.replace(regexEncodeNonAscii, function(string) {
						// Note: there is no need to check `has(encodeMap, string)` here.
						return '&' + encodeMap[string] + ';';
					});
				}
				// Note: any remaining non-ASCII symbols are handled outside of the `if`.
			} else if (useNamedReferences) {
				// Apply named character references.
				// Encode `<>"'&` using named character references.
				if (!allowUnsafeSymbols) {
					string = string.replace(regexEscape, function(string) {
						return '&' + encodeMap[string] + ';'; // no need to check `has()` here
					});
				}
				// Shorten escapes that represent two symbols, of which at least one is
				// `<>"'&`.
				string = string
					.replace(/&gt;\u20D2/g, '&nvgt;')
					.replace(/&lt;\u20D2/g, '&nvlt;');
				// Encode non-ASCII symbols that can be replaced with a named reference.
				string = string.replace(regexEncodeNonAscii, function(string) {
					// Note: there is no need to check `has(encodeMap, string)` here.
					return '&' + encodeMap[string] + ';';
				});
			} else if (!allowUnsafeSymbols) {
				// Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
				// using named character references.
				string = string.replace(regexEscape, hexEscape);
			}
			return string
				// Encode astral symbols.
				.replace(regexAstralSymbols, function($0) {
					// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
					var high = $0.charCodeAt(0);
					var low = $0.charCodeAt(1);
					var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
					return '&#x' + codePoint.toString(16).toUpperCase() + ';';
				})
				// Encode any remaining BMP symbols that are not printable ASCII symbols
				// using a hexadecimal escape.
				.replace(regexBmpWhitelist, hexEscape);
		};
		// Expose default options (so they can be overridden globally).
		encode.options = {
			'allowUnsafeSymbols': false,
			'encodeEverything': false,
			'strict': false,
			'useNamedReferences': false
		};
	
		var decode = function(html, options) {
			options = merge(options, decode.options);
			var strict = options.strict;
			if (strict && regexInvalidEntity.test(html)) {
				parseError('malformed character reference');
			}
			return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7) {
				var codePoint;
				var semicolon;
				var hexDigits;
				var reference;
				var next;
				if ($1) {
					// Decode decimal escapes, e.g. `&#119558;`.
					codePoint = $1;
					semicolon = $2;
					if (strict && !semicolon) {
						parseError('character reference was not terminated by a semicolon');
					}
					return codePointToSymbol(codePoint, strict);
				}
				if ($3) {
					// Decode hexadecimal escapes, e.g. `&#x1D306;`.
					hexDigits = $3;
					semicolon = $4;
					if (strict && !semicolon) {
						parseError('character reference was not terminated by a semicolon');
					}
					codePoint = parseInt(hexDigits, 16);
					return codePointToSymbol(codePoint, strict);
				}
				if ($5) {
					// Decode named character references with trailing `;`, e.g. `&copy;`.
					reference = $5;
					if (has(decodeMap, reference)) {
						return decodeMap[reference];
					} else {
						// Ambiguous ampersand; see http://mths.be/notes/ambiguous-ampersands.
						if (strict) {
							parseError(
								'named character reference was not terminated by a semicolon'
							);
						}
						return $0;
					}
				}
				// If we’re still here, it’s a legacy reference for sure. No need for an
				// extra `if` check.
				// Decode named character references without trailing `;`, e.g. `&amp`
				// This is only a parse error if it gets converted to `&`, or if it is
				// followed by `=` in an attribute context.
				reference = $6;
				next = $7;
				if (next && options.isAttributeValue) {
					if (strict && next == '=') {
						parseError('`&` did not start a character reference');
					}
					return $0;
				} else {
					if (strict) {
						parseError(
							'named character reference was not terminated by a semicolon'
						);
					}
					// Note: there is no need to check `has(decodeMapLegacy, reference)`.
					return decodeMapLegacy[reference] + (next || '');
				}
			});
		};
		// Expose default options (so they can be overridden globally).
		decode.options = {
			'isAttributeValue': false,
			'strict': false
		};
	
		var escape = function(string) {
			return string.replace(regexEscape, function($0) {
				// Note: there is no need to check `has(escapeMap, $0)` here.
				return escapeMap[$0];
			});
		};
	
		/*--------------------------------------------------------------------------*/
	
		var he = {
			'version': '0.5.0',
			'encode': encode,
			'decode': decode,
			'escape': escape,
			'unescape': decode
		};
	
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return he;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = he;
			} else { // in Narwhal or RingoJS v0.7.0-
				for (var key in he) {
					has(he, key) && (freeExports[key] = he[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.he = he;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(637)(module), (function() { return this; }())))

/***/ },
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */
/***/ function(module, exports) {

	module.exports = [
		{
			"kind": "t3",
			"data": {
				"domain": "comforterband.bandcamp.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 350,
					"scrolling": false,
					"height": 467
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "http://bandcamp.com",
						"description": "COP by Comforter, released 26 June 2015",
						"title": "COP, by Comforter",
						"type": "rich",
						"thumbnail_width": 350,
						"height": 467,
						"width": 350,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"version": "1.0",
						"provider_name": "BandCamp",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_2.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 350
					},
					"type": "comforterband.bandcamp.com"
				},
				"link_flair_text": "Pop",
				"id": "3ybh3d",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "billythenick",
				"media": {
					"oembed": {
						"provider_url": "http://bandcamp.com",
						"description": "COP by Comforter, released 26 June 2015",
						"title": "COP, by Comforter",
						"type": "rich",
						"thumbnail_width": 350,
						"height": 467,
						"width": 350,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"version": "1.0",
						"provider_name": "BandCamp",
						"thumbnail_url": "https://f1.bcbits.com/img/a1813492684_2.jpg",
						"thumbnail_height": 350
					},
					"type": "comforterband.bandcamp.com"
				},
				"score": 145,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?s=c2ce101a5f833115121d7a623dd9726f",
								"width": 350,
								"height": 350
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=2011f1cd4a0240d776eb3a65266941f7",
									"width": 108,
									"height": 108
								},
								{
									"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=2c60b39c3a830b432eddd0ce4cedcb65",
									"width": 216,
									"height": 216
								},
								{
									"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=f8e4e624dc98c69d368603e0b06ee310",
									"width": 320,
									"height": 320
								}
							],
							"variants": {},
							"id": "XIx6vxkROfmTAPJX4aFRXr2Xt2FDxDEx3_C8D6UVC5c"
						}
					]
				},
				"num_comments": 12,
				"thumbnail": "http://a.thumbs.redditmedia.com/LNeGXp9j5pO7Tz26LBSxrJfb-fGe9axFXtYIAwQslC0.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "pop",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 350,
					"scrolling": false,
					"height": 467
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "link",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybh3d/comforter_cop_poprock_thought_this_belonged_here/",
				"locked": false,
				"name": "t3_3ybh3d",
				"created": 1451189177,
				"url": "http://comforterband.bandcamp.com/track/cop-2",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Comforter - Cop [pop/rock] (Thought this belonged here too it was just on r/videos)",
				"created_utc": 1451160377,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 145
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "soundcloud.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "Second single off the debut album \"Slow moves\" out the 5th of February, 2014",
						"title": "People by OH MY!",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "OH MY!",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "https://i.embed.ly/1/image?url=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/thisisohmy"
					},
					"type": "soundcloud.com"
				},
				"link_flair_text": "Rock",
				"id": "3yat48",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "Perfectshadow12345",
				"media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "Second single off the debut album \"Slow moves\" out the 5th of February, 2014",
						"title": "People by OH MY!",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "OH MY!",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "http://i1.sndcdn.com/artworks-000064240441-y9cajh-t500x500.jpg",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/thisisohmy"
					},
					"type": "soundcloud.com"
				},
				"score": 94,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?s=d7c3228604084712a467a98e9817132e",
								"width": 500,
								"height": 500
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=730944f15b18d31171d7a797bf307fa0",
									"width": 108,
									"height": 108
								},
								{
									"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=c160d7af1aaf6b093ca2c5f95a363837",
									"width": 216,
									"height": 216
								},
								{
									"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=94dc47eb901d8480b30c9e392879dea4",
									"width": 320,
									"height": 320
								}
							],
							"variants": {},
							"id": "W-81H3sW4TzqFegzFPkYMx_8c6G6k1ZEl0gElSOSZQU"
						}
					]
				},
				"num_comments": 7,
				"thumbnail": "http://b.thumbs.redditmedia.com/DvPxaiLDMK95aREQOi7NA1rsJK3-lyXLXpD_76fN-Sg.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "rock",
				"author_flair_css_class": "youtube",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "link",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yat48/oh_my_people_indie_rock_2015/",
				"locked": false,
				"name": "t3_3yat48",
				"created": 1451177584,
				"url": "https://soundcloud.com/thisisohmy/people",
				"author_flair_text": "youtube",
				"quarantine": false,
				"title": "OH MY - People [Indie Rock] (2015)",
				"created_utc": 1451148784,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 94
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Band - Reflections Song - Autumnus Album - The Color Clear Label - eOne / Good Fight Reflections is a Metal/Progressive/Experimental band from Twin Cities, Minnesota. For Promotional Purposes only. Check them out on Facebook: http://www.facebook.com/reflectionsmn Please support the band by buying their records/going to their gigs/buying their merch.",
						"title": "Reflections - Autumnus | The Color Clear NEW ALBUM 2015",
						"url": "http://www.youtube.com/watch?v=isaHW7733bc",
						"type": "video",
						"author_name": "BadSurprise1",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BadSurprise1"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Heavy",
				"id": "3yatbp",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "iceharvester",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Band - Reflections Song - Autumnus Album - The Color Clear Label - eOne / Good Fight Reflections is a Metal/Progressive/Experimental band from Twin Cities, Minnesota. For Promotional Purposes only. Check them out on Facebook: http://www.facebook.com/reflectionsmn Please support the band by buying their records/going to their gigs/buying their merch.",
						"title": "Reflections - Autumnus | The Color Clear NEW ALBUM 2015",
						"url": "http://www.youtube.com/watch?v=isaHW7733bc",
						"type": "video",
						"author_name": "BadSurprise1",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/isaHW7733bc/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BadSurprise1"
					},
					"type": "youtube.com"
				},
				"score": 68,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?s=e879ffe6aaf21a5509d17a4894b31278",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=7fcd3a750b07c5c03ad6ad4550b84e90",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=24d16d1968ff468cbcecf69e0615cee4",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=46f059f06e8c7e8e1354bcf0caca1abe",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "uG-iD7Tb686qWg88NiF_1zaoPYYJLMPoQ-jHiAovOhw"
						}
					]
				},
				"num_comments": 14,
				"thumbnail": "http://b.thumbs.redditmedia.com/xns3a-kL3jPhZzKaSYgnYvs3XylVcjKDQNbb6aL44RM.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "heavy",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yatbp/reflections_autumnus_metal_metalcore_hardcore_2015/",
				"locked": false,
				"name": "t3_3yatbp",
				"created": 1451177696,
				"url": "https://www.youtube.com/watch?v=isaHW7733bc",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Reflections - Autumnus [Metal / Metalcore / Hardcore] (2015)",
				"created_utc": 1451148896,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 68
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "From The Suite(스윗) 1st EP [The Sweetest Thing] https://itunes.apple.com/us/album/the-sweetest-thing-ep/id932714845",
						"title": "스윗 (The Suite) - 취해 (Addicted)",
						"url": "http://www.youtube.com/watch?v=cDwUGXmyB4k",
						"type": "video",
						"author_name": "danielionss",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/danielionss"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Funk Soul R&amp;B",
				"id": "3yb79w",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "Abhishrekt",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "From The Suite(스윗) 1st EP [The Sweetest Thing] https://itunes.apple.com/us/album/the-sweetest-thing-ep/id932714845",
						"title": "스윗 (The Suite) - 취해 (Addicted)",
						"url": "http://www.youtube.com/watch?v=cDwUGXmyB4k",
						"type": "video",
						"author_name": "danielionss",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/cDwUGXmyB4k/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/danielionss"
					},
					"type": "youtube.com"
				},
				"score": 32,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?s=3fbd1a575c2de8f088600d9511b518f5",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=adea2831358366584c1b7272a81b7ac0",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=783e3f9b3deece91a12b23c8b4d7be75",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=12e4325c4b7efc88308d997d363ae7ff",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "dLiR_Mn87egCqqnL1bgqnuuPZfELSHkBVaJ6plYuhNA"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/1GBetY8r_3_gT8ZjGU8g0VC8q8XZIOf6VNrIoEZ_01U.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "funksoulrnb",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yb79w/스윗_the_suite_취해_addicted_rb_2014/",
				"locked": false,
				"name": "t3_3yb79w",
				"created": 1451184475,
				"url": "https://www.youtube.com/watch?v=cDwUGXmyB4k",
				"author_flair_text": null,
				"quarantine": false,
				"title": "스윗 (The Suite) - 취해 (Addicted) [R&amp;B] (2014)",
				"created_utc": 1451155675,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 32
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Namae (Name) by amazarashi I do not own anything, except the finalised video. Kekeke... Enjoy! ^^ I chewed on this song for a long time... I really enjoy amazarashi's works because a lot of their lyrics are very meaningful.",
						"title": "Namae - amazarashi (Eng Sub + Romaji)",
						"url": "http://www.youtube.com/watch?v=SOxYBHg7QQk",
						"type": "video",
						"author_name": "Hyopi",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/channel/UC06b22_2IoglpnldxIL14IQ"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Rock",
				"id": "3yb16y",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "asifmallik",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Namae (Name) by amazarashi I do not own anything, except the finalised video. Kekeke... Enjoy! ^^ I chewed on this song for a long time... I really enjoy amazarashi's works because a lot of their lyrics are very meaningful.",
						"title": "Namae - amazarashi (Eng Sub + Romaji)",
						"url": "http://www.youtube.com/watch?v=SOxYBHg7QQk",
						"type": "video",
						"author_name": "Hyopi",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/SOxYBHg7QQk/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/channel/UC06b22_2IoglpnldxIL14IQ"
					},
					"type": "youtube.com"
				},
				"score": 33,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?s=02e7c053c9c7576c0c80da09c1528801",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=a1bff049a0aec9beba6da915371ee351",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=9d57a5c50f1daca0976782c3b1c44aea",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=72c814c7d627f10df158192d23cb9d1a",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "lqqnFc_cfCYp88kge-maqos1DurpOFla8m94rwXNOxc"
						}
					]
				},
				"num_comments": 3,
				"thumbnail": "http://a.thumbs.redditmedia.com/K9Z__UQC8GNytrxpBZMBBCinx0zTjWY70uYeAsSwet4.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "rock",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yb16y/namae_amazarashi_alternative_rock_japanese_music/",
				"locked": false,
				"name": "t3_3yb16y",
				"created": 1451181626,
				"url": "https://www.youtube.com/watch?v=SOxYBHg7QQk",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Namae - Amazarashi [Alternative Rock / Japanese Music]",
				"created_utc": 1451152826,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 33
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "soundcloud.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "We've had to pitch the track up slightly due to copyright, but you can listen to the original here on spotify: http://smarturl.it/StreamUYWGRmxs Saturn: https://soundcloud.com/officialsaturn He's cool :D",
						"title": "Until You Were Gone (Skrux &amp; Saturn Remix) by Skrux",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "Skrux",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "https://i.embed.ly/1/image?url=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/skrux"
					},
					"type": "soundcloud.com"
				},
				"link_flair_text": "Electronic",
				"id": "3ybtp3",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "stabbinU",
				"media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "We've had to pitch the track up slightly due to copyright, but you can listen to the original here on spotify: http://smarturl.it/StreamUYWGRmxs Saturn: https://soundcloud.com/officialsaturn He's cool :D",
						"title": "Until You Were Gone (Skrux &amp; Saturn Remix) by Skrux",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "Skrux",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "http://i1.sndcdn.com/artworks-000140083936-61d7zq-t500x500.jpg",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/skrux"
					},
					"type": "soundcloud.com"
				},
				"score": 16,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?s=26240e5ced2813ae308e32e78e05beff",
								"width": 500,
								"height": 500
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=3bc4ba1ad1d4c19883a0335b0242c340",
									"width": 108,
									"height": 108
								},
								{
									"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=47b9f7ebf294136f3bfc0bb306ef78de",
									"width": 216,
									"height": 216
								},
								{
									"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=4554218e001f6d93bb2b3f1e79ac95a9",
									"width": 320,
									"height": 320
								}
							],
							"variants": {},
							"id": "H2h3Y_Rk-3w2k6B4G_yd54GDZoqMFfM7b9VYhH6pxYU"
						}
					]
				},
				"num_comments": 2,
				"thumbnail": "http://b.thumbs.redditmedia.com/SBaKlsvCGxy4MdceOAwm1YRfHEOK4_TVI7vvP0_WiiM.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "electronic",
				"author_flair_css_class": "curator",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "link",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybtp3/skrux_until_you_were_gone_remix_of_the/",
				"locked": false,
				"name": "t3_3ybtp3",
				"created": 1451195522,
				"url": "https://soundcloud.com/skrux/until-you-were-gone-skrux-saturn-remix",
				"author_flair_text": "moderator",
				"quarantine": false,
				"title": "skrux -- until you were gone (remix of the chainsmokers) [electronic] (2015)",
				"created_utc": 1451166722,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 16
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "New video from Rob Kelly The Four Horsemen ft. Illderberg Available on iTunes @ https://itunes.apple.com/us/album/black-irish-rogue/id876427564",
						"title": "Rob Kelly - The Four Horsemen ft. Illderberg",
						"url": "http://www.youtube.com/watch?v=Hks9bXlim6o",
						"author_name": "TheKelloVision",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/TheKelloVision"
					}
				},
				"link_flair_text": "Hip-hop",
				"id": "3yag9t",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "SetFireToTheRane",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "New video from Rob Kelly The Four Horsemen ft. Illderberg Available on iTunes @ https://itunes.apple.com/us/album/black-irish-rogue/id876427564",
						"title": "Rob Kelly - The Four Horsemen ft. Illderberg",
						"url": "http://www.youtube.com/watch?v=Hks9bXlim6o",
						"author_name": "TheKelloVision",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/Hks9bXlim6o/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/TheKelloVision"
					}
				},
				"score": 54,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?s=e14987a4fc84edc5400342bfc07d41f6",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=fe4019e7855bff771bc8107578d92bf2",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=bdb6a0f2a1e359d9d8672ad19446cd90",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=eeee93503790c497acb0f061d090ac9b",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "7Hrhz_ScJjXOBh3HWl05o1WJweWb-kizeEg8WPIc_LQ"
						}
					]
				},
				"num_comments": 14,
				"thumbnail": "http://b.thumbs.redditmedia.com/1xmfmx694ew5w8Yzlbiv6vw26uuNCv7I6wsys-NK08Q.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "hiphop",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yag9t/rob_kelly_ft_illderberg_the_four_horsemen/",
				"locked": false,
				"name": "t3_3yag9t",
				"created": 1451170386,
				"url": "https://www.youtube.com/watch?v=Hks9bXlim6o",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Rob Kelly ft Illderberg - The Four Horsemen [Rap/Irish] (2014)",
				"created_utc": 1451141586,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 54
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Download at http://www.birp.fm/playlists/2011/4831-birp-march-2011",
						"title": "048 - The Soft Province - Lazy Minds Die",
						"url": "http://www.youtube.com/watch?v=AMa5EuvSaGA",
						"author_name": "birpfmmarch2011",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/birpfmmarch2011"
					}
				},
				"link_flair_text": "Psychedelic",
				"id": "3yamfq",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "feedthecollapse",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Download at http://www.birp.fm/playlists/2011/4831-birp-march-2011",
						"title": "048 - The Soft Province - Lazy Minds Die",
						"url": "http://www.youtube.com/watch?v=AMa5EuvSaGA",
						"author_name": "birpfmmarch2011",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/AMa5EuvSaGA/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/birpfmmarch2011"
					}
				},
				"score": 46,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?s=5d70a59cb6207f2e89e9bc4e88e24201",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=85422f7e5e99bf1b883d71e910c30fec",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=9c8aaa85869863044017a0f4e9877bfe",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=9fea3b2ba0a5853b4929fc3be9ec491e",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "d8KiLlIQ9RN5ICOFDr5JnxXpYmWfymCl-TM7g_GOhks"
						}
					]
				},
				"num_comments": 0,
				"thumbnail": "http://b.thumbs.redditmedia.com/SMFnKhl9uz9t-Xmo7CPZ2NI_U8DA5ZOO7y2AqnrGIac.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "psychedelic",
				"author_flair_css_class": "curator",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yamfq/the_soft_province_lazy_minds_die_indie/",
				"locked": false,
				"name": "t3_3yamfq",
				"created": 1451174034,
				"url": "https://www.youtube.com/watch?v=AMa5EuvSaGA",
				"author_flair_text": "[Scream Pop]",
				"quarantine": false,
				"title": "The Soft Province -- Lazy Minds Die [Indie Rock/Psychedelic](2011) related to Besnard Lakes",
				"created_utc": 1451145234,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 46
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Spacesynth, synthdance, spacedance, spacedisco, synthesizerdance or whatever you want to call it is instrumental upbeat synth music that focuses on melodies instead of rhythm. Driving basslines, catchy synth riffs, sci-fi influences and futuristic track titles and album covers have always been a major part of spacesynth. Spacesynth originated in the mid 80's.",
						"title": "Mega Drive - Pulse Of The Streets",
						"url": "http://www.youtube.com/watch?v=C195TWJP-Nc",
						"type": "video",
						"author_name": "spacesynthed",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/spacesynthed"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Electronic",
				"id": "3ybzu7",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "kaiise",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Spacesynth, synthdance, spacedance, spacedisco, synthesizerdance or whatever you want to call it is instrumental upbeat synth music that focuses on melodies instead of rhythm. Driving basslines, catchy synth riffs, sci-fi influences and futuristic track titles and album covers have always been a major part of spacesynth. Spacesynth originated in the mid 80's.",
						"title": "Mega Drive - Pulse Of The Streets",
						"url": "http://www.youtube.com/watch?v=C195TWJP-Nc",
						"type": "video",
						"author_name": "spacesynthed",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/C195TWJP-Nc/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/spacesynthed"
					},
					"type": "youtube.com"
				},
				"score": 14,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?s=7e42c8535917e6e5b6fdd77eb5b00a1f",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=673ac8bc462c1617aa286a1d4cd65b6f",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=ce06974905d9e057a5bea0e97ae46341",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=1f72fc68eff00f065005d69aa3276a0e",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "B-U_31TT1Ap5iVE6ALyLN0ZKHZnyXgWUeNVooBDV1w4"
						}
					]
				},
				"num_comments": 2,
				"thumbnail": "http://b.thumbs.redditmedia.com/AVyq7Z1ILGx9U2Y9F4O6_cMGd1HLE8EYcvg7dV067nw.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "electronic",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybzu7/mega_drive_pulse_of_the_streets_synth_space/",
				"locked": false,
				"name": "t3_3ybzu7",
				"created": 1451198467,
				"url": "https://www.youtube.com/watch?v=C195TWJP-Nc",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Mega Drive - Pulse Of The Streets [synth - space disco-16bit demo-esque](2013)",
				"created_utc": 1451169667,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 14
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Incluida su álbum \"THE THIRD ALBUM FOR THE SUN\" (1997).",
						"title": "Dissolve INTO THE BLACK",
						"url": "http://www.youtube.com/watch?v=6BwdwaT-UNM",
						"type": "video",
						"author_name": "angel luis",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/montgomery2878"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Psychedelic",
				"id": "3ybrzj",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "feedthecollapse",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Incluida su álbum \"THE THIRD ALBUM FOR THE SUN\" (1997).",
						"title": "Dissolve INTO THE BLACK",
						"url": "http://www.youtube.com/watch?v=6BwdwaT-UNM",
						"type": "video",
						"author_name": "angel luis",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/6BwdwaT-UNM/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/montgomery2878"
					},
					"type": "youtube.com"
				},
				"score": 15,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?s=04d6c8a5fc05aeda8137b8a5d96a0464",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=f36b09b8daad11fbb0e2caf1d9c58de6",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=12314675bff5c7b369bb3c921707d1c1",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=e8a4116a24c5103ed6c1c6c86a8a4de4",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "7DjVlynq-hIt20_jKTSQTJu-ozbDBgfdZtCPYSd5iAw"
						}
					]
				},
				"num_comments": 0,
				"thumbnail": "http://a.thumbs.redditmedia.com/xMaJHRIWQFnFShiruS3L3PuVl22QVr68PpxMTQv2gc4.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "psychedelic",
				"author_flair_css_class": "curator",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybrzj/dissolve_into_the_black_psychedelic_folkspace/",
				"locked": false,
				"name": "t3_3ybrzj",
				"created": 1451194668,
				"url": "https://www.youtube.com/watch?v=6BwdwaT-UNM",
				"author_flair_text": "[Scream Pop]",
				"quarantine": false,
				"title": "Dissolve -- Into the Black [Psychedelic Folk/Space Rock](1997)",
				"created_utc": 1451165868,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 15
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtu.be",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Hondo! 'The History Of Future Folk' is now streaming on Netflix. In the new film 'The History Of Future Folk,' space aliens on a mission to invade earth instead fall in love with our music. The aliens' musical prowess is clearly highly advanced, as they quickly learn the rootsy feel and bare emotion of bluegrass.",
						"title": "Future Folk: \"Space Worms,\" Live On Soundcheck",
						"url": "http://www.youtube.com/watch?v=06mMD797xqY",
						"author_name": "WNYC",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/wnycradio"
					}
				},
				"link_flair_text": "Folk",
				"id": "3yc8gm",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "BadSmash4",
				"media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Hondo! 'The History Of Future Folk' is now streaming on Netflix. In the new film 'The History Of Future Folk,' space aliens on a mission to invade earth instead fall in love with our music. The aliens' musical prowess is clearly highly advanced, as they quickly learn the rootsy feel and bare emotion of bluegrass.",
						"title": "Future Folk: \"Space Worms,\" Live On Soundcheck",
						"url": "http://www.youtube.com/watch?v=06mMD797xqY",
						"author_name": "WNYC",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/06mMD797xqY/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/wnycradio"
					}
				},
				"score": 8,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?s=1a2542bc00818e1c7d8de1cf10a943a8",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=c8f200a74308c67620f2226d3cc20d16",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=54ba3f15cadc460684f7b29b14ce7cf0",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=ed7f68e292f7c858ccf449fde51f2bb8",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "xg_PBXdU3VkKg-uW0pvAZv4YDZbUUFypsr59B92wVhI"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/mg3Z56Z7DM0rKxXCiqmOOLp6rRByP-XUyPUAV7v-RTQ.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yc8gm/future_folk_space_worms_folkgimmick/",
				"locked": false,
				"name": "t3_3yc8gm",
				"created": 1451202662,
				"url": "https://youtu.be/06mMD797xqY",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Future Folk - Space Worms [Folk/Gimmick]",
				"created_utc": 1451173862,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 8
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "1st take, just like 30 yrs ago, this time with new mistakes, don't copy them, make your own. All that counts really are the 2 main themes, with the descending coda(?) everything else was improvised then and now, (I think I stole a little from early Leo Kottke in the middle).",
						"title": "Klaus Weiland playing \"das Loch in der Banane\"",
						"url": "http://www.youtube.com/watch?v=PWQ8_nOUx2o",
						"type": "video",
						"author_name": "Klaus Weiland",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Derweiland"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Folk",
				"id": "3yascz",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "Tele_Prompter",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "1st take, just like 30 yrs ago, this time with new mistakes, don't copy them, make your own. All that counts really are the 2 main themes, with the descending coda(?) everything else was improvised then and now, (I think I stole a little from early Leo Kottke in the middle).",
						"title": "Klaus Weiland playing \"das Loch in der Banane\"",
						"url": "http://www.youtube.com/watch?v=PWQ8_nOUx2o",
						"type": "video",
						"author_name": "Klaus Weiland",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/PWQ8_nOUx2o/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Derweiland"
					},
					"type": "youtube.com"
				},
				"score": 29,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?s=ddfee32a9a50853c8cbc1ee4bb315466",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=41ccb99c38202acc056868d495724ed3",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=8d0e05ad3d138239d9ca2f50d402d989",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=3de869df871652c903e7f3a572549297",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "pveMvgV32jCs9XosUnhR4aHCGTlygA3LHE4dnDqBxHg"
						}
					]
				},
				"num_comments": 3,
				"thumbnail": "http://b.thumbs.redditmedia.com/sVkHF0M2TfPqFmp1PnKz5cFag-scYs3XtNbHPm2CZKc.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yascz/klaus_weiland_das_loch_in_der_banane_folklive_2010/",
				"locked": false,
				"name": "t3_3yascz",
				"created": 1451177176,
				"url": "https://www.youtube.com/watch?v=PWQ8_nOUx2o",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Klaus Weiland - Das Loch in der Banane [folk|live] (2010)",
				"created_utc": 1451148376,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 29
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtu.be",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Song from album Tobimasu (1975). Enjoy it",
						"title": "Hako Yamasaki - Wandering",
						"url": "http://www.youtube.com/watch?v=w71N7MX9HcQ",
						"author_name": "SantiagoFred",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/SantiagoFred"
					}
				},
				"link_flair_text": "Folk",
				"id": "3y8vk8",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "DontPMmeYourAnything",
				"media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Song from album Tobimasu (1975). Enjoy it",
						"title": "Hako Yamasaki - Wandering",
						"url": "http://www.youtube.com/watch?v=w71N7MX9HcQ",
						"author_name": "SantiagoFred",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/w71N7MX9HcQ/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/SantiagoFred"
					}
				},
				"score": 345,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?s=8464014d4fa4dcf6f765cdc167688078",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=730d9d272a6a4a0a9b890b1048981331",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=6ffe4c75f1a812f5d57b59e7780807c7",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=b1bab4067f3a974c0c2885980fd13944",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "73j8iu9pg4lY7IdmhlQAfEIqPimZXcwMtCWJab7JpJ8"
						}
					]
				},
				"num_comments": 24,
				"thumbnail": "http://b.thumbs.redditmedia.com/4Z4lK1hkfHZ52vqzpkdBWgcjAYuF-8IFmEtXeJdlGwg.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3y8vk8/hako_yamasaki_wandering_folk_1975/",
				"locked": false,
				"name": "t3_3y8vk8",
				"created": 1451128104,
				"url": "https://youtu.be/w71N7MX9HcQ",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Hako Yamasaki - Wandering [folk] (1975)",
				"created_utc": 1451099304,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 345
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Artist: Hermano Title: Senor Moreno's Plan Album: Only A Suggestion Year: 2002 (All rights belong to their respective owners.)",
						"title": "Hermano - Senor Moreno's Plan",
						"url": "http://www.youtube.com/watch?v=0QKc6b6FrYg",
						"author_name": "Wardog",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/WardogsChannel"
					}
				},
				"link_flair_text": "Heavy",
				"id": "3yakwr",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "tawtaw",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Artist: Hermano Title: Senor Moreno's Plan Album: Only A Suggestion Year: 2002 (All rights belong to their respective owners.)",
						"title": "Hermano - Senor Moreno's Plan",
						"url": "http://www.youtube.com/watch?v=0QKc6b6FrYg",
						"author_name": "Wardog",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/0QKc6b6FrYg/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/WardogsChannel"
					}
				},
				"score": 34,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?s=3b35a1acb63c712823a9c51ff3e5775f",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=5daa1e695802eabaf76758c4c90cd41f",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=f56be326a79654b4cc5791f566fce55c",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=c3f4e85d28438176ec284f19db03ced3",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "E_-r85-B84NzxhcHC7SlKNVnzPaoZlgluE6zrB_YAtQ"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/mGALbmqA9xzy1JE3TPhF9MavKdQVchQC5a0FLmWWb_k.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "heavy",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yakwr/hermano_senor_morenos_plan_stoner_rock_2002/",
				"locked": false,
				"name": "t3_3yakwr",
				"created": 1451173166,
				"url": "https://www.youtube.com/watch?v=0QKc6b6FrYg",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Hermano - \"Senor Moreno's Plan\" [stoner rock] (2002)",
				"created_utc": 1451144366,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 34
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fm-0H4HOATOM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dm-0H4HOATOM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fm-0H4HOATOM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Spacey and cinematic ambient/electronic composer from Vilnius, Lithuania. Creating music since 2007. Join my Facebook page for images and more: http://www.facebook.com/pages/Space-Ambient/234697613216043",
						"title": "Stellardrone - Eternity",
						"url": "http://www.youtube.com/watch?v=m-0H4HOATOM",
						"type": "video",
						"author_name": "SpaceAmbient",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fm-0H4HOATOM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dm-0H4HOATOM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fm-0H4HOATOM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fm-0H4HOATOM%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/SpaceAmbient"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Ambient",
				"id": "3yc2g8",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "hellwanker",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Spacey and cinematic ambient/electronic composer from Vilnius, Lithuania. Creating music since 2007. Join my Facebook page for images and more: http://www.facebook.com/pages/Space-Ambient/234697613216043",
						"title": "Stellardrone - Eternity",
						"url": "http://www.youtube.com/watch?v=m-0H4HOATOM",
						"type": "video",
						"author_name": "SpaceAmbient",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fm-0H4HOATOM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dm-0H4HOATOM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fm-0H4HOATOM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/m-0H4HOATOM/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/SpaceAmbient"
					},
					"type": "youtube.com"
				},
				"score": 6,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/IU9dMiB825hSLN0ZRkUOfYYcopDM0ZFkiRnLk1Mx_Q8.jpg?s=74daf86fda9aaece9ffd5ec6f7370271",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/IU9dMiB825hSLN0ZRkUOfYYcopDM0ZFkiRnLk1Mx_Q8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=c6ea7143e9cba2a912a484b750305746",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/IU9dMiB825hSLN0ZRkUOfYYcopDM0ZFkiRnLk1Mx_Q8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=bebda17ecc5517b4d89db393870383f9",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/IU9dMiB825hSLN0ZRkUOfYYcopDM0ZFkiRnLk1Mx_Q8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=1184b4d8ad40ca812e13ebaf9acb209f",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "Aw-38yxZ3bFD_eatpVrgaPu1Ltbj0si0U34cgk_4PUE"
						}
					]
				},
				"num_comments": 4,
				"thumbnail": "http://b.thumbs.redditmedia.com/lGTTl4T5ZHgutI1c5hAiINHEDjRy8pvDque80sIgUhU.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "ambient",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fm-0H4HOATOM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dm-0H4HOATOM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fm-0H4HOATOM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yc2g8/stellardrone_eternity_space_ambientchillout_2013/",
				"locked": false,
				"name": "t3_3yc2g8",
				"created": 1451199748,
				"url": "https://www.youtube.com/watch?v=m-0H4HOATOM",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Stellardrone - Eternity [Space Ambient/Chillout] (2013)",
				"created_utc": 1451170948,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 6
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FeSu5TR9E8nQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DeSu5TR9E8nQ&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FeSu5TR9E8nQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Second track off the \"Let's Get Electric\" tape.",
						"title": "Cheap Talk - Night Heat",
						"url": "http://www.youtube.com/watch?v=eSu5TR9E8nQ",
						"author_name": "BaskinCase",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FeSu5TR9E8nQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DeSu5TR9E8nQ&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FeSu5TR9E8nQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FeSu5TR9E8nQ%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BaskinCase"
					}
				},
				"link_flair_text": "Electronic",
				"id": "3yc16g",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "thedigitalpurgatory",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Second track off the \"Let's Get Electric\" tape.",
						"title": "Cheap Talk - Night Heat",
						"url": "http://www.youtube.com/watch?v=eSu5TR9E8nQ",
						"author_name": "BaskinCase",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FeSu5TR9E8nQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DeSu5TR9E8nQ&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FeSu5TR9E8nQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/eSu5TR9E8nQ/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BaskinCase"
					}
				},
				"score": 5,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/kQKM4e_IjzRyJ9W2_DxHxS6XlrM9aaHoFUOJK5PokSQ.jpg?s=1beeacc76cc6ae4ebca48be6e25d31a0",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/kQKM4e_IjzRyJ9W2_DxHxS6XlrM9aaHoFUOJK5PokSQ.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=50d78a7e981eb45f6dada7b2ca387002",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/kQKM4e_IjzRyJ9W2_DxHxS6XlrM9aaHoFUOJK5PokSQ.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=2dd530a1bc0a2a428fc97641130365a3",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/kQKM4e_IjzRyJ9W2_DxHxS6XlrM9aaHoFUOJK5PokSQ.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=eebb86d954d5a459d18a0ea9e09eb26c",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "XNABHORLIWst5MI5HVwNk23VjsWrvvZhSVCt0xXzpKc"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/h2tk9av-xlYaeswn4mZzqlmzqtwIaN0FOjz7dLNN1lo.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "electronic",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FeSu5TR9E8nQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DeSu5TR9E8nQ&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FeSu5TR9E8nQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yc16g/cheap_talk_night_heat_synthpop_2014/",
				"locked": false,
				"name": "t3_3yc16g",
				"created": 1451199128,
				"url": "https://www.youtube.com/watch?v=eSu5TR9E8nQ",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Cheap Talk - Night Heat [Synthpop] (2014)",
				"created_utc": 1451170328,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 5
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "soundcloud.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F213443539%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fishdarr%2Fsugar&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000122359867-1e7nyv-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "my sugaaa thang. DOWNLOAD: https://itun.es/us/Teaz9",
						"title": "Sugar (Prod. MEDASIN) [DOWNLOAD LINK] by IshDARR",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F213443539%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fishdarr%2Fsugar&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000122359867-1e7nyv-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "IshDARR",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "https://i.embed.ly/1/image?url=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000122359867-1e7nyv-t500x500.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/ishdarr"
					},
					"type": "soundcloud.com"
				},
				"link_flair_text": "Hip-hop",
				"id": "3ybtcf",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "stabbinU",
				"media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "my sugaaa thang. DOWNLOAD: https://itun.es/us/Teaz9",
						"title": "Sugar (Prod. MEDASIN) [DOWNLOAD LINK] by IshDARR",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F213443539%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fishdarr%2Fsugar&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000122359867-1e7nyv-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "IshDARR",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "http://i1.sndcdn.com/artworks-000122359867-1e7nyv-t500x500.jpg",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/ishdarr"
					},
					"type": "soundcloud.com"
				},
				"score": 5,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/TxFuFMPX8KXzyJQicTc8YhSs17eIemdHKx3wNRHqvVQ.jpg?s=ded56f21f817d1b348420baf0c346360",
								"width": 500,
								"height": 500
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/TxFuFMPX8KXzyJQicTc8YhSs17eIemdHKx3wNRHqvVQ.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=7a8929057e3c4966dc6ad0580702f347",
									"width": 108,
									"height": 108
								},
								{
									"url": "https://i.redditmedia.com/TxFuFMPX8KXzyJQicTc8YhSs17eIemdHKx3wNRHqvVQ.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=84a61db2a005b0dd03141d1224978aa8",
									"width": 216,
									"height": 216
								},
								{
									"url": "https://i.redditmedia.com/TxFuFMPX8KXzyJQicTc8YhSs17eIemdHKx3wNRHqvVQ.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=4fb8dd6db91029808d7934ca7508ae7a",
									"width": 320,
									"height": 320
								}
							],
							"variants": {},
							"id": "3UTdcnGCWzqx0LF7nA5h1kIO4Ti7UiZDQxVqpasgcvg"
						}
					]
				},
				"num_comments": 0,
				"thumbnail": "http://b.thumbs.redditmedia.com/9pqbsVYCkadmwst9vZ2noYPrURheVlQ-eL-oGSX9TSQ.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "hiphop",
				"author_flair_css_class": "curator",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F213443539%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fishdarr%2Fsugar&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000122359867-1e7nyv-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "link",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybtcf/ishdarr_sugar_hiphop_electronic_2015/",
				"locked": false,
				"name": "t3_3ybtcf",
				"created": 1451195348,
				"url": "https://soundcloud.com/ishdarr/sugar",
				"author_flair_text": "moderator",
				"quarantine": false,
				"title": "IshDARR -- sugar [hip-hop, electronic] (2015)",
				"created_utc": 1451166548,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 5
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F4MsaOQT-rQ0%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D4MsaOQT-rQ0&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F4MsaOQT-rQ0%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Surf bank Social Club",
						"title": "一十三十一　Passion Girl",
						"url": "http://www.youtube.com/watch?v=4MsaOQT-rQ0",
						"type": "video",
						"author_name": "xianzhi57",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F4MsaOQT-rQ0%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D4MsaOQT-rQ0&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F4MsaOQT-rQ0%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F4MsaOQT-rQ0%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/xianzhi57"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Pop",
				"id": "3yc9kq",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "thedigitalpurgatory",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Surf bank Social Club",
						"title": "一十三十一　Passion Girl",
						"url": "http://www.youtube.com/watch?v=4MsaOQT-rQ0",
						"type": "video",
						"author_name": "xianzhi57",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F4MsaOQT-rQ0%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D4MsaOQT-rQ0&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F4MsaOQT-rQ0%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/4MsaOQT-rQ0/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/xianzhi57"
					},
					"type": "youtube.com"
				},
				"score": 4,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/spEBDH5SaffuKfPlPyoirfdz2KTXeJeAUvGT4Tu-vCY.jpg?s=c327d834a8b8b59f04e3d96dc98d1505",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/spEBDH5SaffuKfPlPyoirfdz2KTXeJeAUvGT4Tu-vCY.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=b8a0aef2df362b16e9e2388c69d89aca",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/spEBDH5SaffuKfPlPyoirfdz2KTXeJeAUvGT4Tu-vCY.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=cc2404d77b3242dd81b0d1c038278ee8",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/spEBDH5SaffuKfPlPyoirfdz2KTXeJeAUvGT4Tu-vCY.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=c299cc1417048dbbe2c72a50bb1d859a",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "HlP0hOKT0fWCUq6pgr6qj6bqdoBwie2hAGJaTirdRsc"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/pKl61u8cnxc03GIj06JTC3JgJp9vZrBz7lSSKm54aXQ.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "pop",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F4MsaOQT-rQ0%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D4MsaOQT-rQ0&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F4MsaOQT-rQ0%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yc9kq/hitomitoi_passion_girl_city_popjpop_2013/",
				"locked": false,
				"name": "t3_3yc9kq",
				"created": 1451203222,
				"url": "https://www.youtube.com/watch?v=4MsaOQT-rQ0",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Hitomitoi - Passion Girl [City Pop/J-Pop] (2013)",
				"created_utc": 1451174422,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 4
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fq7Sn65UEjvM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dq7Sn65UEjvM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fq7Sn65UEjvM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "The live version of Heavenly Persona. Taken off Live Shizuka (1995).",
						"title": "Shizuka (静香) - Heavenly Persona",
						"url": "http://www.youtube.com/watch?v=q7Sn65UEjvM",
						"author_name": "arkham1789",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fq7Sn65UEjvM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dq7Sn65UEjvM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fq7Sn65UEjvM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fq7Sn65UEjvM%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/arkham1789"
					}
				},
				"link_flair_text": "Psychedelic",
				"id": "3ycjcp",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "Snitsie",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "The live version of Heavenly Persona. Taken off Live Shizuka (1995).",
						"title": "Shizuka (静香) - Heavenly Persona",
						"url": "http://www.youtube.com/watch?v=q7Sn65UEjvM",
						"author_name": "arkham1789",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fq7Sn65UEjvM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dq7Sn65UEjvM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fq7Sn65UEjvM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/q7Sn65UEjvM/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/arkham1789"
					}
				},
				"score": 4,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/kZRqlwoY1S_1fv4Th_sLF4ro68rEUzp0bW88XQ24zoU.jpg?s=623622118e990fa5884960710f990ec0",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/kZRqlwoY1S_1fv4Th_sLF4ro68rEUzp0bW88XQ24zoU.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=4b9ff2c9f0c182b473089b0fd39d096f",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/kZRqlwoY1S_1fv4Th_sLF4ro68rEUzp0bW88XQ24zoU.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=8234b7971f842845c1957e34b4fd6268",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/kZRqlwoY1S_1fv4Th_sLF4ro68rEUzp0bW88XQ24zoU.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=adb69c4f060eb124a36ed717bee13bd6",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "fMAoEPszCS9nzzNulxhc8xqKff0c6PqECdvpEZFd7t8"
						}
					]
				},
				"num_comments": 0,
				"thumbnail": "http://b.thumbs.redditmedia.com/8OyL7dRpxNA04TyJZxodSWlE3Dmi2LfYJapZsz81K2c.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": true,
				"edited": false,
				"link_flair_css_class": "psychedelic",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fq7Sn65UEjvM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dq7Sn65UEjvM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fq7Sn65UEjvM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ycjcp/shizuka_heavenly_persona_psychedelic_noise_rock/",
				"locked": false,
				"name": "t3_3ycjcp",
				"created": 1451208141,
				"url": "https://www.youtube.com/watch?v=q7Sn65UEjvM",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Shizuka - Heavenly Persona [Psychedelic Noise Rock] (1995)",
				"created_utc": 1451179341,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 4
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "joiedevivreband.bandcamp.com",
				"banned_by": null,
				"media_embed": {},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": null,
				"link_flair_text": "Rock",
				"id": "3yaylq",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "starbuckzero",
				"media": null,
				"score": 12,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"num_comments": 4,
				"thumbnail": "default",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "rock",
				"author_flair_css_class": "lastfm",
				"downs": 0,
				"secure_media_embed": {},
				"saved": false,
				"removal_reason": null,
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yaylq/joie_de_vivre_next_year_will_be_better_emo_2010/",
				"locked": false,
				"name": "t3_3yaylq",
				"created": 1451180381,
				"url": "https://joiedevivreband.bandcamp.com/track/next-year-will-be-better",
				"author_flair_text": "lastfm",
				"quarantine": false,
				"title": "Joie De Vivre -- Next Year Will Be Better [Emo] (2010)",
				"created_utc": 1451151581,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 12
			}
		}
	];

/***/ },
/* 315 */
/***/ function(module, exports) {

	module.exports = [
		{
			"kind": "t3",
			"data": {
				"domain": "youtu.be",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Song from album Tobimasu (1975). Enjoy it",
						"title": "Hako Yamasaki - Wandering",
						"url": "http://www.youtube.com/watch?v=w71N7MX9HcQ",
						"author_name": "SantiagoFred",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/SantiagoFred"
					}
				},
				"link_flair_text": "Folk",
				"id": "3y8vk8",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "DontPMmeYourAnything",
				"media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Song from album Tobimasu (1975). Enjoy it",
						"title": "Hako Yamasaki - Wandering",
						"url": "http://www.youtube.com/watch?v=w71N7MX9HcQ",
						"author_name": "SantiagoFred",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/w71N7MX9HcQ/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/SantiagoFred"
					}
				},
				"score": 347,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?s=8464014d4fa4dcf6f765cdc167688078",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=730d9d272a6a4a0a9b890b1048981331",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=6ffe4c75f1a812f5d57b59e7780807c7",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/m2SDtmnxZqntc52abeMEBfqmIYOjnx9ga0KS-Dh1-W4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=b1bab4067f3a974c0c2885980fd13944",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "73j8iu9pg4lY7IdmhlQAfEIqPimZXcwMtCWJab7JpJ8"
						}
					]
				},
				"num_comments": 24,
				"thumbnail": "http://b.thumbs.redditmedia.com/4Z4lK1hkfHZ52vqzpkdBWgcjAYuF-8IFmEtXeJdlGwg.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2Fw71N7MX9HcQ%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3Dw71N7MX9HcQ%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2Fw71N7MX9HcQ%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3y8vk8/hako_yamasaki_wandering_folk_1975/",
				"locked": false,
				"name": "t3_3y8vk8",
				"created": 1451128104,
				"url": "https://youtu.be/w71N7MX9HcQ",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Hako Yamasaki - Wandering [folk] (1975)",
				"created_utc": 1451099304,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 347
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "comforterband.bandcamp.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 350,
					"scrolling": false,
					"height": 467
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "http://bandcamp.com",
						"description": "COP by Comforter, released 26 June 2015",
						"title": "COP, by Comforter",
						"type": "rich",
						"thumbnail_width": 350,
						"height": 467,
						"width": 350,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"version": "1.0",
						"provider_name": "BandCamp",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_2.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 350
					},
					"type": "comforterband.bandcamp.com"
				},
				"link_flair_text": "Pop",
				"id": "3ybh3d",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "billythenick",
				"media": {
					"oembed": {
						"provider_url": "http://bandcamp.com",
						"description": "COP by Comforter, released 26 June 2015",
						"title": "COP, by Comforter",
						"type": "rich",
						"thumbnail_width": 350,
						"height": 467,
						"width": 350,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"version": "1.0",
						"provider_name": "BandCamp",
						"thumbnail_url": "https://f1.bcbits.com/img/a1813492684_2.jpg",
						"thumbnail_height": 350
					},
					"type": "comforterband.bandcamp.com"
				},
				"score": 215,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?s=c2ce101a5f833115121d7a623dd9726f",
								"width": 350,
								"height": 350
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=2011f1cd4a0240d776eb3a65266941f7",
									"width": 108,
									"height": 108
								},
								{
									"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=2c60b39c3a830b432eddd0ce4cedcb65",
									"width": 216,
									"height": 216
								},
								{
									"url": "https://i.redditmedia.com/mRyU9dIgs53Ow8z0-rIJpzjz35hxTmqMvAJ5iZPnOVo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=f8e4e624dc98c69d368603e0b06ee310",
									"width": 320,
									"height": 320
								}
							],
							"variants": {},
							"id": "XIx6vxkROfmTAPJX4aFRXr2Xt2FDxDEx3_C8D6UVC5c"
						}
					]
				},
				"num_comments": 18,
				"thumbnail": "http://a.thumbs.redditmedia.com/LNeGXp9j5pO7Tz26LBSxrJfb-fGe9axFXtYIAwQslC0.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "pop",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fbandcamp.com%2FEmbeddedPlayer%2Fv%3D2%2Ftrack%3D1907558472%2Fsize%3Dlarge%2Flinkcol%3D0084B4%2Fnotracklist%3Dtrue%2Ftwittercard%3Dtrue%2F&amp;url=http%3A%2F%2Fcomforterband.bandcamp.com%2Ftrack%2Fcop-2&amp;image=http%3A%2F%2Ff1.bcbits.com%2Fimg%2Fa1813492684_5.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=bandcamp\" width=\"350\" height=\"467\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 350,
					"scrolling": false,
					"height": 467
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "link",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybh3d/comforter_cop_poprock_thought_this_belonged_here/",
				"locked": false,
				"name": "t3_3ybh3d",
				"created": 1451189177,
				"url": "http://comforterband.bandcamp.com/track/cop-2",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Comforter - Cop [pop/rock] (Thought this belonged here too it was just on r/videos)",
				"created_utc": 1451160377,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 215
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FbdmsK7x7HKY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DbdmsK7x7HKY%26ab_channel%3DTransgressive&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FbdmsK7x7HKY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Taken from the debut EP titled 'Future Visions' Buy the limited 12\" here - http://paradyserecords.bigcartel.com/ iTunes - http://hyperurl.co/aahzja Stream the full EP here: https://soundcloud.com/favelamusic/sets/future-visions-ep Director/DOP/Editor: Ozzie Pullin Special Thanks: Imogen Morris, Jack Abbot, Jakob Cizic and Craig Bingham Written, produced and mixed by Favela. Mastered by Guy Davie at Electric Mastering.",
						"title": "Favela - Future Visions",
						"url": "http://www.youtube.com/watch?v=bdmsK7x7HKY",
						"author_name": "Transgressive",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FbdmsK7x7HKY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DbdmsK7x7HKY%26ab_channel%3DTransgressive&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FbdmsK7x7HKY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FbdmsK7x7HKY%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Transgressiveofficia"
					}
				},
				"link_flair_text": "Electronic",
				"id": "3y8vca",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "RandomHypnotica",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Taken from the debut EP titled 'Future Visions' Buy the limited 12\" here - http://paradyserecords.bigcartel.com/ iTunes - http://hyperurl.co/aahzja Stream the full EP here: https://soundcloud.com/favelamusic/sets/future-visions-ep Director/DOP/Editor: Ozzie Pullin Special Thanks: Imogen Morris, Jack Abbot, Jakob Cizic and Craig Bingham Written, produced and mixed by Favela. Mastered by Guy Davie at Electric Mastering.",
						"title": "Favela - Future Visions",
						"url": "http://www.youtube.com/watch?v=bdmsK7x7HKY",
						"author_name": "Transgressive",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FbdmsK7x7HKY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DbdmsK7x7HKY%26ab_channel%3DTransgressive&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FbdmsK7x7HKY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/bdmsK7x7HKY/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Transgressiveofficia"
					}
				},
				"score": 138,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/cnxQhvPWRTgQSJ2TD1vkqZ0yCkIv_UHYtXNYGZ0MOE8.jpg?s=9333fe9bd3ecdde798632df8e80d9446",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/cnxQhvPWRTgQSJ2TD1vkqZ0yCkIv_UHYtXNYGZ0MOE8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=211d3b08b67b0860c3d3fc277d20dba8",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/cnxQhvPWRTgQSJ2TD1vkqZ0yCkIv_UHYtXNYGZ0MOE8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=2c3a574e2dd7e0ba7b4cc01bbd833513",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/cnxQhvPWRTgQSJ2TD1vkqZ0yCkIv_UHYtXNYGZ0MOE8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=846e313ee0cbdd5b690bba88783eeb52",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "0jdWYAJLJZeC-tAvfXlBTE1WeMcGrMKlG7wgpw7iFAU"
						}
					]
				},
				"num_comments": 12,
				"thumbnail": "http://b.thumbs.redditmedia.com/H0SoziS_gB4aWPIg59SGofwpRvsN2tuAOr54kYUo6jU.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "electronic",
				"author_flair_css_class": "spotify",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FbdmsK7x7HKY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DbdmsK7x7HKY%26ab_channel%3DTransgressive&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FbdmsK7x7HKY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3y8vca/favela_future_visions_electronicchilled_2015/",
				"locked": false,
				"name": "t3_3y8vca",
				"created": 1451127984,
				"url": "https://www.youtube.com/watch?v=bdmsK7x7HKY&amp;ab_channel=Transgressive",
				"author_flair_text": "spotify",
				"quarantine": false,
				"title": "Favela - Future Visions [Electronic/Chilled] (2015)",
				"created_utc": 1451099184,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 138
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "soundcloud.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "Second single off the debut album \"Slow moves\" out the 5th of February, 2014",
						"title": "People by OH MY!",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "OH MY!",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "https://i.embed.ly/1/image?url=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/thisisohmy"
					},
					"type": "soundcloud.com"
				},
				"link_flair_text": "Rock",
				"id": "3yat48",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "Perfectshadow12345",
				"media": {
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "Second single off the debut album \"Slow moves\" out the 5th of February, 2014",
						"title": "People by OH MY!",
						"type": "rich",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "OH MY!",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "http://i1.sndcdn.com/artworks-000064240441-y9cajh-t500x500.jpg",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/thisisohmy"
					},
					"type": "soundcloud.com"
				},
				"score": 98,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?s=d7c3228604084712a467a98e9817132e",
								"width": 500,
								"height": 500
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=730944f15b18d31171d7a797bf307fa0",
									"width": 108,
									"height": 108
								},
								{
									"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=c160d7af1aaf6b093ca2c5f95a363837",
									"width": 216,
									"height": 216
								},
								{
									"url": "https://i.redditmedia.com/mowrW53jNgZygJL4DTeZOl-Zom4v2V8c6erHjVn3ZsE.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=94dc47eb901d8480b30c9e392879dea4",
									"width": 320,
									"height": 320
								}
							],
							"variants": {},
							"id": "W-81H3sW4TzqFegzFPkYMx_8c6G6k1ZEl0gElSOSZQU"
						}
					]
				},
				"num_comments": 7,
				"thumbnail": "http://b.thumbs.redditmedia.com/DvPxaiLDMK95aREQOi7NA1rsJK3-lyXLXpD_76fN-Sg.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "rock",
				"author_flair_css_class": "youtube",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F122860981%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fthisisohmy%2Fpeople&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000064240441-y9cajh-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "link",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yat48/oh_my_people_indie_rock_2015/",
				"locked": false,
				"name": "t3_3yat48",
				"created": 1451177584,
				"url": "https://soundcloud.com/thisisohmy/people",
				"author_flair_text": "youtube",
				"quarantine": false,
				"title": "OH MY - People [Indie Rock] (2015)",
				"created_utc": 1451148784,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 98
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Band - Reflections Song - Autumnus Album - The Color Clear Label - eOne / Good Fight Reflections is a Metal/Progressive/Experimental band from Twin Cities, Minnesota. For Promotional Purposes only. Check them out on Facebook: http://www.facebook.com/reflectionsmn Please support the band by buying their records/going to their gigs/buying their merch.",
						"title": "Reflections - Autumnus | The Color Clear NEW ALBUM 2015",
						"url": "http://www.youtube.com/watch?v=isaHW7733bc",
						"author_name": "BadSurprise1",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BadSurprise1"
					}
				},
				"link_flair_text": "Heavy",
				"id": "3yatbp",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "iceharvester",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Band - Reflections Song - Autumnus Album - The Color Clear Label - eOne / Good Fight Reflections is a Metal/Progressive/Experimental band from Twin Cities, Minnesota. For Promotional Purposes only. Check them out on Facebook: http://www.facebook.com/reflectionsmn Please support the band by buying their records/going to their gigs/buying their merch.",
						"title": "Reflections - Autumnus | The Color Clear NEW ALBUM 2015",
						"url": "http://www.youtube.com/watch?v=isaHW7733bc",
						"author_name": "BadSurprise1",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/isaHW7733bc/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BadSurprise1"
					}
				},
				"score": 70,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?s=e879ffe6aaf21a5509d17a4894b31278",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=7fcd3a750b07c5c03ad6ad4550b84e90",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=24d16d1968ff468cbcecf69e0615cee4",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/L5_f5LT8Tnnwn4_OVswUYK9ZWTI1_6GmWTBjGO-VW7E.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=46f059f06e8c7e8e1354bcf0caca1abe",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "uG-iD7Tb686qWg88NiF_1zaoPYYJLMPoQ-jHiAovOhw"
						}
					]
				},
				"num_comments": 15,
				"thumbnail": "http://b.thumbs.redditmedia.com/xns3a-kL3jPhZzKaSYgnYvs3XylVcjKDQNbb6aL44RM.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "heavy",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FisaHW7733bc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DisaHW7733bc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FisaHW7733bc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yatbp/reflections_autumnus_metal_metalcore_hardcore_2015/",
				"locked": false,
				"name": "t3_3yatbp",
				"created": 1451177696,
				"url": "https://www.youtube.com/watch?v=isaHW7733bc",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Reflections - Autumnus [Metal / Metalcore / Hardcore] (2015)",
				"created_utc": 1451148896,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 70
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "New video from Rob Kelly The Four Horsemen ft. Illderberg Available on iTunes @ https://itunes.apple.com/us/album/black-irish-rogue/id876427564",
						"title": "Rob Kelly - The Four Horsemen ft. Illderberg",
						"url": "http://www.youtube.com/watch?v=Hks9bXlim6o",
						"type": "video",
						"author_name": "TheKelloVision",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/TheKelloVision"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Hip-hop",
				"id": "3yag9t",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "SetFireToTheRane",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "New video from Rob Kelly The Four Horsemen ft. Illderberg Available on iTunes @ https://itunes.apple.com/us/album/black-irish-rogue/id876427564",
						"title": "Rob Kelly - The Four Horsemen ft. Illderberg",
						"url": "http://www.youtube.com/watch?v=Hks9bXlim6o",
						"type": "video",
						"author_name": "TheKelloVision",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/Hks9bXlim6o/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/TheKelloVision"
					},
					"type": "youtube.com"
				},
				"score": 55,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?s=e14987a4fc84edc5400342bfc07d41f6",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=fe4019e7855bff771bc8107578d92bf2",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=bdb6a0f2a1e359d9d8672ad19446cd90",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/SVQlQl4shpRyqZKxRkJO45rTbySeaDPxMENmtai_rvc.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=eeee93503790c497acb0f061d090ac9b",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "7Hrhz_ScJjXOBh3HWl05o1WJweWb-kizeEg8WPIc_LQ"
						}
					]
				},
				"num_comments": 15,
				"thumbnail": "http://b.thumbs.redditmedia.com/1xmfmx694ew5w8Yzlbiv6vw26uuNCv7I6wsys-NK08Q.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "hiphop",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FHks9bXlim6o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DHks9bXlim6o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FHks9bXlim6o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yag9t/rob_kelly_ft_illderberg_the_four_horsemen/",
				"locked": false,
				"name": "t3_3yag9t",
				"created": 1451170386,
				"url": "https://www.youtube.com/watch?v=Hks9bXlim6o",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Rob Kelly ft Illderberg - The Four Horsemen [Rap/Irish] (2014)",
				"created_utc": 1451141586,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 55
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Download at http://www.birp.fm/playlists/2011/4831-birp-march-2011",
						"title": "048 - The Soft Province - Lazy Minds Die",
						"url": "http://www.youtube.com/watch?v=AMa5EuvSaGA",
						"author_name": "birpfmmarch2011",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/birpfmmarch2011"
					}
				},
				"link_flair_text": "Psychedelic",
				"id": "3yamfq",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "feedthecollapse",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Download at http://www.birp.fm/playlists/2011/4831-birp-march-2011",
						"title": "048 - The Soft Province - Lazy Minds Die",
						"url": "http://www.youtube.com/watch?v=AMa5EuvSaGA",
						"author_name": "birpfmmarch2011",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/AMa5EuvSaGA/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/birpfmmarch2011"
					}
				},
				"score": 46,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?s=5d70a59cb6207f2e89e9bc4e88e24201",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=85422f7e5e99bf1b883d71e910c30fec",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=9c8aaa85869863044017a0f4e9877bfe",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/WvKNE1xwscdJ2fnKjtHMeiV35yOAR6alEYomfH88TS4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=9fea3b2ba0a5853b4929fc3be9ec491e",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "d8KiLlIQ9RN5ICOFDr5JnxXpYmWfymCl-TM7g_GOhks"
						}
					]
				},
				"num_comments": 0,
				"thumbnail": "http://b.thumbs.redditmedia.com/SMFnKhl9uz9t-Xmo7CPZ2NI_U8DA5ZOO7y2AqnrGIac.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "psychedelic",
				"author_flair_css_class": "curator",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FAMa5EuvSaGA%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DAMa5EuvSaGA&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FAMa5EuvSaGA%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yamfq/the_soft_province_lazy_minds_die_indie/",
				"locked": false,
				"name": "t3_3yamfq",
				"created": 1451174034,
				"url": "https://www.youtube.com/watch?v=AMa5EuvSaGA",
				"author_flair_text": "[Scream Pop]",
				"quarantine": false,
				"title": "The Soft Province -- Lazy Minds Die [Indie Rock/Psychedelic](2011) related to Besnard Lakes",
				"created_utc": 1451145234,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 46
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPxnzhM_41uc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPxnzhM_41uc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPxnzhM_41uc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Jack Wood (With The I Can't Say), Born To Wander, Lawrence Records 2052 Recorded 1966, Grand Rapids, Michigan",
						"title": "Jack Wood - Born To Wander - Garage Soul 45",
						"url": "http://www.youtube.com/watch?v=PxnzhM_41uc",
						"author_name": "CheesebrewWaxArchive",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPxnzhM_41uc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPxnzhM_41uc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPxnzhM_41uc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPxnzhM_41uc%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/CheesebrewWaxArchive"
					}
				},
				"link_flair_text": "Pop",
				"id": "3y9q2u",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "KevinEleven007",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Jack Wood (With The I Can't Say), Born To Wander, Lawrence Records 2052 Recorded 1966, Grand Rapids, Michigan",
						"title": "Jack Wood - Born To Wander - Garage Soul 45",
						"url": "http://www.youtube.com/watch?v=PxnzhM_41uc",
						"author_name": "CheesebrewWaxArchive",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPxnzhM_41uc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPxnzhM_41uc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPxnzhM_41uc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/PxnzhM_41uc/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/CheesebrewWaxArchive"
					}
				},
				"score": 41,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/xgmrJg3Wvh8bP9v2eYlso52nKJsREsGB4_4d0m5g114.jpg?s=8203f8106d414b24beca55f8b16014b7",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/xgmrJg3Wvh8bP9v2eYlso52nKJsREsGB4_4d0m5g114.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=2660d65849e4cc7e21c35206342182ce",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/xgmrJg3Wvh8bP9v2eYlso52nKJsREsGB4_4d0m5g114.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=6c12babbde4858c7b3fe0ba65df0d08b",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/xgmrJg3Wvh8bP9v2eYlso52nKJsREsGB4_4d0m5g114.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=c7d32f2de63a23c25a3ac1ca3d2a633b",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "l0kFvT7J8x6SgFtMaBFezTwe_kDB4vZKkMCU-GQyeHg"
						}
					]
				},
				"num_comments": 4,
				"thumbnail": "http://b.thumbs.redditmedia.com/iQY846SEV4uCtYrOZOAVttLHotPhCliAoPaFlFiPr1A.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "pop",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPxnzhM_41uc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPxnzhM_41uc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPxnzhM_41uc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3y9q2u/jack_wood_born_to_wander_popjazz_1966/",
				"locked": false,
				"name": "t3_3y9q2u",
				"created": 1451148622,
				"url": "https://www.youtube.com/watch?v=PxnzhM_41uc",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Jack Wood -- Born to Wander [pop/jazz] (1966)",
				"created_utc": 1451119822,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 41
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Namae (Name) by amazarashi I do not own anything, except the finalised video. Kekeke... Enjoy! ^^ I chewed on this song for a long time... I really enjoy amazarashi's works because a lot of their lyrics are very meaningful.",
						"title": "Namae - amazarashi (Eng Sub + Romaji)",
						"url": "http://www.youtube.com/watch?v=SOxYBHg7QQk",
						"type": "video",
						"author_name": "Hyopi",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/channel/UC06b22_2IoglpnldxIL14IQ"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Rock",
				"id": "3yb16y",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "asifmallik",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Namae (Name) by amazarashi I do not own anything, except the finalised video. Kekeke... Enjoy! ^^ I chewed on this song for a long time... I really enjoy amazarashi's works because a lot of their lyrics are very meaningful.",
						"title": "Namae - amazarashi (Eng Sub + Romaji)",
						"url": "http://www.youtube.com/watch?v=SOxYBHg7QQk",
						"type": "video",
						"author_name": "Hyopi",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/SOxYBHg7QQk/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/channel/UC06b22_2IoglpnldxIL14IQ"
					},
					"type": "youtube.com"
				},
				"score": 33,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?s=02e7c053c9c7576c0c80da09c1528801",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=a1bff049a0aec9beba6da915371ee351",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=9d57a5c50f1daca0976782c3b1c44aea",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/V69Wahx95vLRQ-Rl5jIRT77lK_6kArhRU6aYKeMe39o.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=72c814c7d627f10df158192d23cb9d1a",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "lqqnFc_cfCYp88kge-maqos1DurpOFla8m94rwXNOxc"
						}
					]
				},
				"num_comments": 4,
				"thumbnail": "http://a.thumbs.redditmedia.com/K9Z__UQC8GNytrxpBZMBBCinx0zTjWY70uYeAsSwet4.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "rock",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FSOxYBHg7QQk%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DSOxYBHg7QQk&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FSOxYBHg7QQk%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yb16y/namae_amazarashi_alternative_rock_japanese_music/",
				"locked": false,
				"name": "t3_3yb16y",
				"created": 1451181626,
				"url": "https://www.youtube.com/watch?v=SOxYBHg7QQk",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Namae - Amazarashi [Alternative Rock / Japanese Music]",
				"created_utc": 1451152826,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 33
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Artist: Hermano Title: Senor Moreno's Plan Album: Only A Suggestion Year: 2002 (All rights belong to their respective owners.)",
						"title": "Hermano - Senor Moreno's Plan",
						"url": "http://www.youtube.com/watch?v=0QKc6b6FrYg",
						"type": "video",
						"author_name": "Wardog",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/WardogsChannel"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Heavy",
				"id": "3yakwr",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "tawtaw",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Artist: Hermano Title: Senor Moreno's Plan Album: Only A Suggestion Year: 2002 (All rights belong to their respective owners.)",
						"title": "Hermano - Senor Moreno's Plan",
						"url": "http://www.youtube.com/watch?v=0QKc6b6FrYg",
						"type": "video",
						"author_name": "Wardog",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/0QKc6b6FrYg/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/WardogsChannel"
					},
					"type": "youtube.com"
				},
				"score": 35,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?s=3b35a1acb63c712823a9c51ff3e5775f",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=5daa1e695802eabaf76758c4c90cd41f",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=f56be326a79654b4cc5791f566fce55c",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/OIwXbuOtXVW-a8tf6PIpllR2Pbo05AFUuZeku_GJfjM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=c3f4e85d28438176ec284f19db03ced3",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "E_-r85-B84NzxhcHC7SlKNVnzPaoZlgluE6zrB_YAtQ"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/mGALbmqA9xzy1JE3TPhF9MavKdQVchQC5a0FLmWWb_k.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "heavy",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F0QKc6b6FrYg%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0QKc6b6FrYg&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0QKc6b6FrYg%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yakwr/hermano_senor_morenos_plan_stoner_rock_2002/",
				"locked": false,
				"name": "t3_3yakwr",
				"created": 1451173166,
				"url": "https://www.youtube.com/watch?v=0QKc6b6FrYg",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Hermano - \"Senor Moreno's Plan\" [stoner rock] (2002)",
				"created_utc": 1451144366,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 35
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "From The Suite(스윗) 1st EP [The Sweetest Thing] https://itunes.apple.com/us/album/the-sweetest-thing-ep/id932714845",
						"title": "스윗 (The Suite) - 취해 (Addicted)",
						"url": "http://www.youtube.com/watch?v=cDwUGXmyB4k",
						"author_name": "danielionss",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/danielionss"
					}
				},
				"link_flair_text": "Funk Soul R&amp;B",
				"id": "3yb79w",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "Abhishrekt",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "From The Suite(스윗) 1st EP [The Sweetest Thing] https://itunes.apple.com/us/album/the-sweetest-thing-ep/id932714845",
						"title": "스윗 (The Suite) - 취해 (Addicted)",
						"url": "http://www.youtube.com/watch?v=cDwUGXmyB4k",
						"author_name": "danielionss",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/cDwUGXmyB4k/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/danielionss"
					}
				},
				"score": 38,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?s=3fbd1a575c2de8f088600d9511b518f5",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=adea2831358366584c1b7272a81b7ac0",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=783e3f9b3deece91a12b23c8b4d7be75",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/62OwbafvfOG8-y5P1X7bLpZFL64YMSc3S6EmOCvkBKo.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=12e4325c4b7efc88308d997d363ae7ff",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "dLiR_Mn87egCqqnL1bgqnuuPZfELSHkBVaJ6plYuhNA"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/1GBetY8r_3_gT8ZjGU8g0VC8q8XZIOf6VNrIoEZ_01U.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "funksoulrnb",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FcDwUGXmyB4k%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DcDwUGXmyB4k&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FcDwUGXmyB4k%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yb79w/스윗_the_suite_취해_addicted_rb_2014/",
				"locked": false,
				"name": "t3_3yb79w",
				"created": 1451184475,
				"url": "https://www.youtube.com/watch?v=cDwUGXmyB4k",
				"author_flair_text": null,
				"quarantine": false,
				"title": "스윗 (The Suite) - 취해 (Addicted) [R&amp;B] (2014)",
				"created_utc": 1451155675,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 38
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "1st take, just like 30 yrs ago, this time with new mistakes, don't copy them, make your own. All that counts really are the 2 main themes, with the descending coda(?) everything else was improvised then and now, (I think I stole a little from early Leo Kottke in the middle).",
						"title": "Klaus Weiland playing \"das Loch in der Banane\"",
						"url": "http://www.youtube.com/watch?v=PWQ8_nOUx2o",
						"author_name": "Klaus Weiland",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Derweiland"
					}
				},
				"link_flair_text": "Folk",
				"id": "3yascz",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "Tele_Prompter",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "1st take, just like 30 yrs ago, this time with new mistakes, don't copy them, make your own. All that counts really are the 2 main themes, with the descending coda(?) everything else was improvised then and now, (I think I stole a little from early Leo Kottke in the middle).",
						"title": "Klaus Weiland playing \"das Loch in der Banane\"",
						"url": "http://www.youtube.com/watch?v=PWQ8_nOUx2o",
						"author_name": "Klaus Weiland",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/PWQ8_nOUx2o/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Derweiland"
					}
				},
				"score": 32,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?s=ddfee32a9a50853c8cbc1ee4bb315466",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=41ccb99c38202acc056868d495724ed3",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=8d0e05ad3d138239d9ca2f50d402d989",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/e5sJk9bjmzRoERwRNpyUN0pt4g355MP8rc2v7Z1zKWI.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=3de869df871652c903e7f3a572549297",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "pveMvgV32jCs9XosUnhR4aHCGTlygA3LHE4dnDqBxHg"
						}
					]
				},
				"num_comments": 3,
				"thumbnail": "http://b.thumbs.redditmedia.com/sVkHF0M2TfPqFmp1PnKz5cFag-scYs3XtNbHPm2CZKc.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FPWQ8_nOUx2o%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DPWQ8_nOUx2o&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FPWQ8_nOUx2o%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yascz/klaus_weiland_das_loch_in_der_banane_folklive_2010/",
				"locked": false,
				"name": "t3_3yascz",
				"created": 1451177176,
				"url": "https://www.youtube.com/watch?v=PWQ8_nOUx2o",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Klaus Weiland - Das Loch in der Banane [folk|live] (2010)",
				"created_utc": 1451148376,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 32
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F-sNCktKP9Do%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D-sNCktKP9Do&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F-sNCktKP9Do%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Doesn't matter who's to blame. We're in this together.",
						"title": "Magic Giant - Set On Fire (Official Lyric Video)",
						"url": "http://www.youtube.com/watch?v=-sNCktKP9Do",
						"author_name": "Magic Giant",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F-sNCktKP9Do%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D-sNCktKP9Do&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F-sNCktKP9Do%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F-sNCktKP9Do%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/magicgiantmusic"
					}
				},
				"link_flair_text": "Folk",
				"id": "3y8zzc",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "vira-lata",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Doesn't matter who's to blame. We're in this together.",
						"title": "Magic Giant - Set On Fire (Official Lyric Video)",
						"url": "http://www.youtube.com/watch?v=-sNCktKP9Do",
						"author_name": "Magic Giant",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F-sNCktKP9Do%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D-sNCktKP9Do&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F-sNCktKP9Do%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/-sNCktKP9Do/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/magicgiantmusic"
					}
				},
				"score": 26,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/Y7_4fpTn8uKKONy85Kl_soCL6kuWqu24igcsHNVrmh0.jpg?s=0511f2ecd23cc35e5ab5c5d6525ffeb1",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/Y7_4fpTn8uKKONy85Kl_soCL6kuWqu24igcsHNVrmh0.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=0819d1e9d60bb8500ba394962521de08",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/Y7_4fpTn8uKKONy85Kl_soCL6kuWqu24igcsHNVrmh0.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=8d8053275ed6cca3ff203fe6c4d941a7",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/Y7_4fpTn8uKKONy85Kl_soCL6kuWqu24igcsHNVrmh0.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=013b6b6d4c36307b2aab4d1a96175658",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "eQHjbZkttyFazz8b66sIg1AISJ4pz3FJN-d0QUUFcDg"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/5w7lNFrfzun64jkk36Sl48QvwEP3qvbKOLy-TGwgZSc.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F-sNCktKP9Do%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D-sNCktKP9Do&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F-sNCktKP9Do%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3y8zzc/magic_giant_set_on_fire_indie_folk_2015/",
				"locked": false,
				"name": "t3_3y8zzc",
				"created": 1451130525,
				"url": "https://www.youtube.com/watch?v=-sNCktKP9Do",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Magic Giant -- Set On Fire [Indie Folk] (2015)",
				"created_utc": 1451101725,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 26
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "soundcloud.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "soundcloud.com",
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "We've had to pitch the track up slightly due to copyright, but you can listen to the original here on spotify: http://smarturl.it/StreamUYWGRmxs Saturn: https://soundcloud.com/officialsaturn He's cool :D",
						"title": "Until You Were Gone (Skrux &amp; Saturn Remix) by Skrux",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "Skrux",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "https://i.embed.ly/1/image?url=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "rich",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/skrux"
					}
				},
				"link_flair_text": "Electronic",
				"id": "3ybtp3",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "stabbinU",
				"media": {
					"type": "soundcloud.com",
					"oembed": {
						"provider_url": "http://soundcloud.com",
						"description": "We've had to pitch the track up slightly due to copyright, but you can listen to the original here on spotify: http://smarturl.it/StreamUYWGRmxs Saturn: https://soundcloud.com/officialsaturn He's cool :D",
						"title": "Until You Were Gone (Skrux &amp; Saturn Remix) by Skrux",
						"thumbnail_width": 500,
						"height": 500,
						"width": 500,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"author_name": "Skrux",
						"version": "1.0",
						"provider_name": "SoundCloud",
						"thumbnail_url": "http://i1.sndcdn.com/artworks-000140083936-61d7zq-t500x500.jpg",
						"type": "rich",
						"thumbnail_height": 500,
						"author_url": "http://soundcloud.com/skrux"
					}
				},
				"score": 25,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?s=26240e5ced2813ae308e32e78e05beff",
								"width": 500,
								"height": 500
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=3bc4ba1ad1d4c19883a0335b0242c340",
									"width": 108,
									"height": 108
								},
								{
									"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=47b9f7ebf294136f3bfc0bb306ef78de",
									"width": 216,
									"height": 216
								},
								{
									"url": "https://i.redditmedia.com/nFoHlkAXQGUzTmEaPNPOo07fS24LY3QpCKZUQBAoepw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=4554218e001f6d93bb2b3f1e79ac95a9",
									"width": 320,
									"height": 320
								}
							],
							"variants": {},
							"id": "H2h3Y_Rk-3w2k6B4G_yd54GDZoqMFfM7b9VYhH6pxYU"
						}
					]
				},
				"num_comments": 3,
				"thumbnail": "http://b.thumbs.redditmedia.com/SBaKlsvCGxy4MdceOAwm1YRfHEOK4_TVI7vvP0_WiiM.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "electronic",
				"author_flair_css_class": "curator",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fw.soundcloud.com%2Fplayer%2F%3Fvisual%3Dtrue%26url%3Dhttp%253A%252F%252Fapi.soundcloud.com%252Ftracks%252F238211095%26show_artwork%3Dtrue&amp;url=https%3A%2F%2Fsoundcloud.com%2Fskrux%2Funtil-you-were-gone-skrux-saturn-remix&amp;image=http%3A%2F%2Fi1.sndcdn.com%2Fartworks-000140083936-61d7zq-t500x500.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=soundcloud\" width=\"500\" height=\"500\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 500,
					"scrolling": false,
					"height": 500
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "link",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybtp3/skrux_until_you_were_gone_remix_of_the/",
				"locked": false,
				"name": "t3_3ybtp3",
				"created": 1451195522,
				"url": "https://soundcloud.com/skrux/until-you-were-gone-skrux-saturn-remix",
				"author_flair_text": "moderator",
				"quarantine": false,
				"title": "skrux -- until you were gone (remix of the chainsmokers) [electronic] (2015)",
				"created_utc": 1451166722,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 25
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Incluida su álbum \"THE THIRD ALBUM FOR THE SUN\" (1997).",
						"title": "Dissolve INTO THE BLACK",
						"url": "http://www.youtube.com/watch?v=6BwdwaT-UNM",
						"author_name": "angel luis",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/montgomery2878"
					}
				},
				"link_flair_text": "Psychedelic",
				"id": "3ybrzj",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "feedthecollapse",
				"media": {
					"type": "youtube.com",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Incluida su álbum \"THE THIRD ALBUM FOR THE SUN\" (1997).",
						"title": "Dissolve INTO THE BLACK",
						"url": "http://www.youtube.com/watch?v=6BwdwaT-UNM",
						"author_name": "angel luis",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/6BwdwaT-UNM/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/montgomery2878"
					}
				},
				"score": 16,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?s=04d6c8a5fc05aeda8137b8a5d96a0464",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=f36b09b8daad11fbb0e2caf1d9c58de6",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=12314675bff5c7b369bb3c921707d1c1",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/uZsoVImxmnV7eFWgCdmOdINf_Er3IdkDItau676dvBM.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=e8a4116a24c5103ed6c1c6c86a8a4de4",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "7DjVlynq-hIt20_jKTSQTJu-ozbDBgfdZtCPYSd5iAw"
						}
					]
				},
				"num_comments": 0,
				"thumbnail": "http://a.thumbs.redditmedia.com/xMaJHRIWQFnFShiruS3L3PuVl22QVr68PpxMTQv2gc4.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "psychedelic",
				"author_flair_css_class": "curator",
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F6BwdwaT-UNM%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6BwdwaT-UNM&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F6BwdwaT-UNM%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybrzj/dissolve_into_the_black_psychedelic_folkspace/",
				"locked": false,
				"name": "t3_3ybrzj",
				"created": 1451194668,
				"url": "https://www.youtube.com/watch?v=6BwdwaT-UNM",
				"author_flair_text": "[Scream Pop]",
				"quarantine": false,
				"title": "Dissolve -- Into the Black [Psychedelic Folk/Space Rock](1997)",
				"created_utc": 1451165868,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 16
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FCP6XdFEBqyU%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DCP6XdFEBqyU&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FCP6XdFEBqyU%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "from \"Play Nine Songs With Mr. Quintron\" an old gospel song reworked by Greg \"Oblivian\" Cartwright this Oblivians album features Quintron on keys.",
						"title": "The Oblivians - \"Live the Life\"",
						"url": "http://www.youtube.com/watch?v=CP6XdFEBqyU",
						"type": "video",
						"author_name": "BobSeger1981",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FCP6XdFEBqyU%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DCP6XdFEBqyU&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FCP6XdFEBqyU%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FCP6XdFEBqyU%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BobSeger1981"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Funk Soul R&amp;B",
				"id": "3yajni",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "tawtaw",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "from \"Play Nine Songs With Mr. Quintron\" an old gospel song reworked by Greg \"Oblivian\" Cartwright this Oblivians album features Quintron on keys.",
						"title": "The Oblivians - \"Live the Life\"",
						"url": "http://www.youtube.com/watch?v=CP6XdFEBqyU",
						"type": "video",
						"author_name": "BobSeger1981",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FCP6XdFEBqyU%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DCP6XdFEBqyU&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FCP6XdFEBqyU%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/CP6XdFEBqyU/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/BobSeger1981"
					},
					"type": "youtube.com"
				},
				"score": 13,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/4YvyQYM4ukseboOxURc25g1NRvN1LYdj_sjkT1F70Fw.jpg?s=a6759c01033aa6cabe5ac6f540da0e90",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/4YvyQYM4ukseboOxURc25g1NRvN1LYdj_sjkT1F70Fw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=9f3b7a446411f22bc6355d5bbb556756",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/4YvyQYM4ukseboOxURc25g1NRvN1LYdj_sjkT1F70Fw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=816833a99fe5d43f15a525f0019191b4",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/4YvyQYM4ukseboOxURc25g1NRvN1LYdj_sjkT1F70Fw.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=45e773fff422c49e0506794357529723",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "Ezb_fJl9CMzs2od1Pw0DvnZkqgdMqXgNEwPgyNs8I4Q"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/J-qFcm_6xXfK9AR1H7jWlS9lBbBZdVMjLR_HkonYu7g.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "funksoulrnb",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FCP6XdFEBqyU%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DCP6XdFEBqyU&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FCP6XdFEBqyU%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yajni/the_oblivians_mr_quintron_live_the_life_garage/",
				"locked": false,
				"name": "t3_3yajni",
				"created": 1451172475,
				"url": "https://www.youtube.com/watch?v=CP6XdFEBqyU",
				"author_flair_text": null,
				"quarantine": false,
				"title": "The Oblivians &amp; Mr. Quintron - \"Live the Life\" [garage punk/gospel] (1997)",
				"created_utc": 1451143675,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 13
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Spacesynth, synthdance, spacedance, spacedisco, synthesizerdance or whatever you want to call it is instrumental upbeat synth music that focuses on melodies instead of rhythm. Driving basslines, catchy synth riffs, sci-fi influences and futuristic track titles and album covers have always been a major part of spacesynth. Spacesynth originated in the mid 80's.",
						"title": "Mega Drive - Pulse Of The Streets",
						"url": "http://www.youtube.com/watch?v=C195TWJP-Nc",
						"type": "video",
						"author_name": "spacesynthed",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/spacesynthed"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Electronic",
				"id": "3ybzu7",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "kaiise",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Spacesynth, synthdance, spacedance, spacedisco, synthesizerdance or whatever you want to call it is instrumental upbeat synth music that focuses on melodies instead of rhythm. Driving basslines, catchy synth riffs, sci-fi influences and futuristic track titles and album covers have always been a major part of spacesynth. Spacesynth originated in the mid 80's.",
						"title": "Mega Drive - Pulse Of The Streets",
						"url": "http://www.youtube.com/watch?v=C195TWJP-Nc",
						"type": "video",
						"author_name": "spacesynthed",
						"height": 450,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/C195TWJP-Nc/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/spacesynthed"
					},
					"type": "youtube.com"
				},
				"score": 16,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?s=7e42c8535917e6e5b6fdd77eb5b00a1f",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=673ac8bc462c1617aa286a1d4cd65b6f",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=ce06974905d9e057a5bea0e97ae46341",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/zjfvuzVzi44Nq3NeVWPw1kZkn2Y8j6PXzVPAtaSKsQ4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=1f72fc68eff00f065005d69aa3276a0e",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "B-U_31TT1Ap5iVE6ALyLN0ZKHZnyXgWUeNVooBDV1w4"
						}
					]
				},
				"num_comments": 3,
				"thumbnail": "http://b.thumbs.redditmedia.com/AVyq7Z1ILGx9U2Y9F4O6_cMGd1HLE8EYcvg7dV067nw.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "electronic",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FC195TWJP-Nc%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DC195TWJP-Nc&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FC195TWJP-Nc%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"450\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 450
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3ybzu7/mega_drive_pulse_of_the_streets_synth_space/",
				"locked": false,
				"name": "t3_3ybzu7",
				"created": 1451198467,
				"url": "https://www.youtube.com/watch?v=C195TWJP-Nc",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Mega Drive - Pulse Of The Streets [synth - space disco-16bit demo-esque](2013)",
				"created_utc": 1451169667,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 16
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "joiedevivreband.bandcamp.com",
				"banned_by": null,
				"media_embed": {},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": null,
				"link_flair_text": "Rock",
				"id": "3yaylq",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "starbuckzero",
				"media": null,
				"score": 13,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"num_comments": 4,
				"thumbnail": "default",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "rock",
				"author_flair_css_class": "lastfm",
				"downs": 0,
				"secure_media_embed": {},
				"saved": false,
				"removal_reason": null,
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yaylq/joie_de_vivre_next_year_will_be_better_emo_2010/",
				"locked": false,
				"name": "t3_3yaylq",
				"created": 1451180381,
				"url": "https://joiedevivreband.bandcamp.com/track/next-year-will-be-better",
				"author_flair_text": "lastfm",
				"quarantine": false,
				"title": "Joie De Vivre -- Next Year Will Be Better [Emo] (2010)",
				"created_utc": 1451151581,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 13
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtu.be",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Hondo! 'The History Of Future Folk' is now streaming on Netflix. In the new film 'The History Of Future Folk,' space aliens on a mission to invade earth instead fall in love with our music. The aliens' musical prowess is clearly highly advanced, as they quickly learn the rootsy feel and bare emotion of bluegrass.",
						"title": "Future Folk: \"Space Worms,\" Live On Soundcheck",
						"url": "http://www.youtube.com/watch?v=06mMD797xqY",
						"author_name": "WNYC",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/wnycradio"
					}
				},
				"link_flair_text": "Folk",
				"id": "3yc8gm",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "BadSmash4",
				"media": {
					"type": "youtu.be",
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Hondo! 'The History Of Future Folk' is now streaming on Netflix. In the new film 'The History Of Future Folk,' space aliens on a mission to invade earth instead fall in love with our music. The aliens' musical prowess is clearly highly advanced, as they quickly learn the rootsy feel and bare emotion of bluegrass.",
						"title": "Future Folk: \"Space Worms,\" Live On Soundcheck",
						"url": "http://www.youtube.com/watch?v=06mMD797xqY",
						"author_name": "WNYC",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/06mMD797xqY/hqdefault.jpg",
						"type": "video",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/wnycradio"
					}
				},
				"score": 16,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?s=1a2542bc00818e1c7d8de1cf10a943a8",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=c8f200a74308c67620f2226d3cc20d16",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=54ba3f15cadc460684f7b29b14ce7cf0",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/t7TWXg5K5LT1FTAelS-xstvazTSY1T1NWcPHHRPs-i8.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=ed7f68e292f7c858ccf449fde51f2bb8",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "xg_PBXdU3VkKg-uW0pvAZv4YDZbUUFypsr59B92wVhI"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/mg3Z56Z7DM0rKxXCiqmOOLp6rRByP-XUyPUAV7v-RTQ.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2F06mMD797xqY%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D06mMD797xqY%26feature%3Dyoutu.be&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2F06mMD797xqY%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yc8gm/future_folk_space_worms_folkgimmick/",
				"locked": false,
				"name": "t3_3yc8gm",
				"created": 1451202662,
				"url": "https://youtu.be/06mMD797xqY",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Future Folk - Space Worms [Folk/Gimmick]",
				"created_utc": 1451173862,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 16
			}
		},
		{
			"kind": "t3",
			"data": {
				"domain": "youtube.com",
				"banned_by": null,
				"media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FQvtij8UxF5M%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQvtij8UxF5M&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FQvtij8UxF5M%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"subreddit": "listentothis",
				"selftext_html": null,
				"selftext": "",
				"likes": null,
				"suggested_sort": null,
				"user_reports": [],
				"secure_media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Preorder a physical copy at www.landontewers.bigcartel.com iTunes and Spotify December 20th LYRICS You've been cooped up way too long it's obvious you're jaded couldn't just leave you all alone and risk your colors fading I miss when you would smile you know it's been a while we'd laugh for hours",
						"title": "Landon Tewers - Cooped Up",
						"url": "http://www.youtube.com/watch?v=Qvtij8UxF5M",
						"type": "video",
						"author_name": "Landon Tewers",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FQvtij8UxF5M%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQvtij8UxF5M&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FQvtij8UxF5M%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.embed.ly/1/image?url=https%3A%2F%2Fi.ytimg.com%2Fvi%2FQvtij8UxF5M%2Fhqdefault.jpg&amp;key=b1e305db91cf4aa5a86b732cc9fffceb",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Landontewers"
					},
					"type": "youtube.com"
				},
				"link_flair_text": "Folk",
				"id": "3yaqhz",
				"from_kind": null,
				"gilded": 0,
				"archived": false,
				"clicked": false,
				"report_reasons": null,
				"author": "iceharvester",
				"media": {
					"oembed": {
						"provider_url": "https://www.youtube.com/",
						"description": "Preorder a physical copy at www.landontewers.bigcartel.com iTunes and Spotify December 20th LYRICS You've been cooped up way too long it's obvious you're jaded couldn't just leave you all alone and risk your colors fading I miss when you would smile you know it's been a while we'd laugh for hours",
						"title": "Landon Tewers - Cooped Up",
						"url": "http://www.youtube.com/watch?v=Qvtij8UxF5M",
						"type": "video",
						"author_name": "Landon Tewers",
						"height": 338,
						"width": 600,
						"html": "&lt;iframe class=\"embedly-embed\" src=\"//cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FQvtij8UxF5M%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQvtij8UxF5M&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FQvtij8UxF5M%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
						"thumbnail_width": 480,
						"version": "1.0",
						"provider_name": "YouTube",
						"thumbnail_url": "https://i.ytimg.com/vi/Qvtij8UxF5M/hqdefault.jpg",
						"thumbnail_height": 360,
						"author_url": "https://www.youtube.com/user/Landontewers"
					},
					"type": "youtube.com"
				},
				"score": 9,
				"approved_by": null,
				"over_18": false,
				"hidden": false,
				"preview": {
					"images": [
						{
							"source": {
								"url": "https://i.redditmedia.com/YqwtbMJ6mICqzvXaC9d4BTaq1SGbOaIsaSD5BCyggf4.jpg?s=e03188fef6c4493a033bf92c495be20b",
								"width": 480,
								"height": 360
							},
							"resolutions": [
								{
									"url": "https://i.redditmedia.com/YqwtbMJ6mICqzvXaC9d4BTaq1SGbOaIsaSD5BCyggf4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=108&amp;s=a62816e583758d78048a8816d4281a36",
									"width": 108,
									"height": 81
								},
								{
									"url": "https://i.redditmedia.com/YqwtbMJ6mICqzvXaC9d4BTaq1SGbOaIsaSD5BCyggf4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=216&amp;s=bff7ee3007d6910e8f5f7671b21039ea",
									"width": 216,
									"height": 162
								},
								{
									"url": "https://i.redditmedia.com/YqwtbMJ6mICqzvXaC9d4BTaq1SGbOaIsaSD5BCyggf4.jpg?fit=crop&amp;crop=faces%2Centropy&amp;arh=2&amp;w=320&amp;s=d75713b1d8852aab66121f8a4e0f2769",
									"width": 320,
									"height": 240
								}
							],
							"variants": {},
							"id": "3XFuY64MZ_8q8iTkAxplSf68LobYXlX3n78_dH8_cWI"
						}
					]
				},
				"num_comments": 1,
				"thumbnail": "http://b.thumbs.redditmedia.com/iNvJJcu78eALlAG2vF_woy7X3S6Jr_qmoY2RerQHeXY.jpg",
				"subreddit_id": "t5_2qxzy",
				"hide_score": false,
				"edited": false,
				"link_flair_css_class": "folk",
				"author_flair_css_class": null,
				"downs": 0,
				"secure_media_embed": {
					"content": "&lt;iframe class=\"embedly-embed\" src=\"https://cdn.embedly.com/widgets/media.html?src=https%3A%2F%2Fwww.youtube.com%2Fembed%2FQvtij8UxF5M%3Ffeature%3Doembed&amp;url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DQvtij8UxF5M&amp;image=https%3A%2F%2Fi.ytimg.com%2Fvi%2FQvtij8UxF5M%2Fhqdefault.jpg&amp;key=2aa3c4d5f3de4f5b9120b660ad850dc9&amp;type=text%2Fhtml&amp;schema=youtube\" width=\"600\" height=\"338\" scrolling=\"no\" frameborder=\"0\" allowfullscreen&gt;&lt;/iframe&gt;",
					"width": 600,
					"scrolling": false,
					"height": 338
				},
				"saved": false,
				"removal_reason": null,
				"post_hint": "rich:video",
				"stickied": false,
				"from": null,
				"is_self": false,
				"from_id": null,
				"permalink": "/r/listentothis/comments/3yaqhz/landon_tewers_cooped_up_acoustic_folk_2015/",
				"locked": false,
				"name": "t3_3yaqhz",
				"created": 1451176212,
				"url": "https://www.youtube.com/watch?v=Qvtij8UxF5M",
				"author_flair_text": null,
				"quarantine": false,
				"title": "Landon Tewers - Cooped Up [acoustic / folk] (2015)",
				"created_utc": 1451147412,
				"distinguished": null,
				"mod_reports": [],
				"visited": false,
				"num_reports": null,
				"ups": 9
			}
		}
	];

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _mixinsStylePropable = __webpack_require__(55);
	
	var _mixinsStylePropable2 = _interopRequireDefault(_mixinsStylePropable);
	
	var _stylesRawThemesLightRawTheme = __webpack_require__(56);
	
	var _stylesRawThemesLightRawTheme2 = _interopRequireDefault(_stylesRawThemesLightRawTheme);
	
	var _stylesThemeManager = __webpack_require__(57);
	
	var _stylesThemeManager2 = _interopRequireDefault(_stylesThemeManager);
	
	var GridList = _react2['default'].createClass({
	  displayName: 'GridList',
	
	  mixins: [_mixinsStylePropable2['default']],
	
	  contextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  propTypes: {
	    cellHeight: _react2['default'].PropTypes.number,
	    children: _react2['default'].PropTypes.node,
	    cols: _react2['default'].PropTypes.number,
	    padding: _react2['default'].PropTypes.number,
	
	    /**
	     * Override the inline-styles of the root element.
	     */
	    style: _react2['default'].PropTypes.object
	  },
	
	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      cols: 2,
	      padding: 4,
	      cellHeight: 180
	    };
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme ? this.context.muiTheme : _stylesThemeManager2['default'].getMuiTheme(_stylesRawThemesLightRawTheme2['default'])
	    };
	  },
	
	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },
	
	  getStyles: function getStyles() {
	    return {
	      root: {
	        display: 'flex',
	        flexWrap: 'wrap',
	        margin: -this.props.padding / 2
	      },
	      item: {
	        boxSizing: 'border-box',
	        padding: this.props.padding / 2
	      }
	    };
	  },
	
	  render: function render() {
	    var _this = this;
	
	    var _props = this.props;
	    var cols = _props.cols;
	    var padding = _props.padding;
	    var cellHeight = _props.cellHeight;
	    var children = _props.children;
	    var style = _props.style;
	
	    var other = _objectWithoutProperties(_props, ['cols', 'padding', 'cellHeight', 'children', 'style']);
	
	    var styles = this.getStyles();
	
	    var mergedRootStyles = this.mergeStyles(styles.root, style);
	
	    var wrappedChildren = _react2['default'].Children.map(children, function (currentChild) {
	      var childCols = currentChild.props.cols || 1;
	      var childRows = currentChild.props.rows || 1;
	      var itemStyle = _this.mergeStyles(styles.item, {
	        width: 100 / cols * childCols + '%',
	        height: cellHeight * childRows + padding
	      });
	
	      return _react2['default'].createElement(
	        'div',
	        { style: _this.prepareStyles(itemStyle) },
	        currentChild
	      );
	    });
	
	    return _react2['default'].createElement(
	      'div',
	      _extends({ style: this.prepareStyles(mergedRootStyles) }, other),
	      wrappedChildren
	    );
	  }
	});
	
	exports['default'] = GridList;
	module.exports = exports['default'];

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(105);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	var _mixinsStylePropable = __webpack_require__(55);
	
	var _mixinsStylePropable2 = _interopRequireDefault(_mixinsStylePropable);
	
	var _stylesRawThemesLightRawTheme = __webpack_require__(56);
	
	var _stylesRawThemesLightRawTheme2 = _interopRequireDefault(_stylesRawThemesLightRawTheme);
	
	var _stylesThemeManager = __webpack_require__(57);
	
	var _stylesThemeManager2 = _interopRequireDefault(_stylesThemeManager);
	
	var GridTile = _react2['default'].createClass({
	  displayName: 'GridTile',
	
	  mixins: [_mixinsStylePropable2['default']],
	
	  contextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  propTypes: {
	    actionIcon: _react2['default'].PropTypes.element,
	    actionPosition: _react2['default'].PropTypes.oneOf(['left', 'right']),
	    children: _react2['default'].PropTypes.node,
	    cols: _react2['default'].PropTypes.number,
	    rootClass: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.object]),
	    rows: _react2['default'].PropTypes.number,
	
	    /**
	     * Override the inline-styles of the root element.
	     */
	    style: _react2['default'].PropTypes.object,
	    subtitle: _react2['default'].PropTypes.node,
	    title: _react2['default'].PropTypes.node,
	    titleBackground: _react2['default'].PropTypes.string,
	    titlePosition: _react2['default'].PropTypes.oneOf(['top', 'bottom'])
	  },
	
	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      titlePosition: 'bottom',
	      titleBackground: 'rgba(0, 0, 0, 0.4)',
	      actionPosition: 'right',
	      cols: 1,
	      rows: 1,
	      rootClass: 'div'
	    };
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme ? this.context.muiTheme : _stylesThemeManager2['default'].getMuiTheme(_stylesRawThemesLightRawTheme2['default'])
	    };
	  },
	
	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },
	
	  getStyles: function getStyles() {
	    var _titleBar;
	
	    var spacing = this.state.muiTheme.rawTheme.spacing;
	    var themeVariables = this.state.muiTheme.gridTile;
	    var actionPos = this.props.actionIcon ? this.props.actionPosition : null;
	    var gutterLess = spacing.desktopGutterLess;
	
	    var styles = {
	      root: {
	        position: 'relative',
	        display: 'block',
	        height: '100%',
	        overflow: 'hidden'
	      },
	      titleBar: (_titleBar = {
	        position: 'absolute',
	        left: 0,
	        right: 0
	      }, _defineProperty(_titleBar, this.props.titlePosition, 0), _defineProperty(_titleBar, 'height', this.props.subtitle ? 68 : 48), _defineProperty(_titleBar, 'background', this.props.titleBackground), _defineProperty(_titleBar, 'display', 'flex'), _defineProperty(_titleBar, 'alignItems', 'center'), _titleBar),
	      titleWrap: {
	        flexGrow: 1,
	        marginLeft: actionPos === 'right' ? gutterLess : 0,
	        marginRight: actionPos === 'left' ? gutterLess : 0,
	        color: themeVariables.textColor,
	        overflow: 'hidden'
	      },
	      title: {
	        fontSize: '16px',
	        textOverflow: 'ellipsis',
	        overflow: 'hidden',
	        whiteSpace: 'nowrap'
	      },
	      subtitle: {
	        fontSize: '12px',
	        textOverflow: 'ellipsis',
	        overflow: 'hidden',
	        whiteSpace: 'nowrap'
	      },
	      actionIcon: {
	        order: actionPos === 'left' ? -1 : 1
	      },
	      childImg: {
	        height: '100%',
	        transform: 'translateX(-50%)',
	        position: 'relative',
	        left: '50%'
	      }
	    };
	    return styles;
	  },
	
	  componentDidMount: function componentDidMount() {
	    this._ensureImageCover();
	  },
	
	  componeneDidUpdate: function componeneDidUpdate() {
	    this._ensureImageCover();
	  },
	
	  _ensureImageCover: function _ensureImageCover() {
	    var imgEl = _reactDom2['default'].findDOMNode(this.refs.img);
	
	    if (imgEl) {
	      (function () {
	        var fit = function fit() {
	          if (imgEl.offsetWidth < imgEl.parentNode.offsetWidth) {
	            imgEl.style.height = 'auto';
	            imgEl.style.left = '0';
	            imgEl.style.width = '100%';
	            imgEl.style.top = '50%';
	            imgEl.style.transform = imgEl.style.WebkitTransform = 'translateY(-50%)';
	          }
	          imgEl.removeEventListener('load', fit);
	          imgEl = null; // prevent closure memory leak
	        };
	        if (imgEl.complete) {
	          fit();
	        } else {
	          imgEl.addEventListener('load', fit);
	        }
	      })();
	    }
	  },
	
	  render: function render() {
	    var _this = this;
	
	    var _props = this.props;
	    var title = _props.title;
	    var subtitle = _props.subtitle;
	    var titlePosition = _props.titlePosition;
	    var titleBackground = _props.titleBackground;
	    var actionIcon = _props.actionIcon;
	    var actionPosition = _props.actionPosition;
	    var style = _props.style;
	    var children = _props.children;
	    var rootClass = _props.rootClass;
	
	    var other = _objectWithoutProperties(_props, ['title', 'subtitle', 'titlePosition', 'titleBackground', 'actionIcon', 'actionPosition', 'style', 'children', 'rootClass']);
	
	    var styles = this.getStyles();
	
	    var mergedRootStyles = this.prepareStyles(styles.root, style);
	
	    var titleBar = null;
	
	    if (title) {
	      titleBar = _react2['default'].createElement(
	        'div',
	        { style: this.prepareStyles(styles.titleBar) },
	        _react2['default'].createElement(
	          'div',
	          { style: this.prepareStyles(styles.titleWrap) },
	          _react2['default'].createElement(
	            'div',
	            { style: this.prepareStyles(styles.title) },
	            title
	          ),
	          subtitle ? _react2['default'].createElement(
	            'div',
	            { style: this.prepareStyles(styles.subtitle) },
	            subtitle
	          ) : null
	        ),
	        actionIcon ? _react2['default'].createElement(
	          'div',
	          { style: this.prepareStyles(styles.actionIcon) },
	          actionIcon
	        ) : null
	      );
	    }
	
	    var newChildren = children;
	
	    // if there is an image passed as children
	    // clone it an put our styles
	    if (_react2['default'].Children.count(children) === 1) {
	      newChildren = _react2['default'].Children.map(children, function (child) {
	        if (child.type === 'img') {
	          return _react2['default'].cloneElement(child, {
	            ref: 'img',
	            style: _this.prepareStyles(styles.childImg, child.props.style)
	          });
	        } else {
	          return child;
	        }
	      });
	    }
	
	    var RootTag = rootClass;
	    return _react2['default'].createElement(
	      RootTag,
	      _extends({ style: mergedRootStyles }, other),
	      newChildren,
	      titleBar
	    );
	  }
	});
	
	exports['default'] = GridTile;
	module.exports = exports['default'];

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _stylesTransitions = __webpack_require__(323);
	
	var _stylesTransitions2 = _interopRequireDefault(_stylesTransitions);
	
	var _mixinsStylePropable = __webpack_require__(55);
	
	var _mixinsStylePropable2 = _interopRequireDefault(_mixinsStylePropable);
	
	var _stylesRawThemesLightRawTheme = __webpack_require__(56);
	
	var _stylesRawThemesLightRawTheme2 = _interopRequireDefault(_stylesRawThemesLightRawTheme);
	
	var _stylesThemeManager = __webpack_require__(57);
	
	var _stylesThemeManager2 = _interopRequireDefault(_stylesThemeManager);
	
	var InkBar = _react2['default'].createClass({
	  displayName: 'InkBar',
	
	  contextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	
	  propTypes: {
	    color: _react2['default'].PropTypes.string,
	    left: _react2['default'].PropTypes.string.isRequired,
	
	    /**
	     * Override the inline-styles of the root element.
	     */
	    style: _react2['default'].PropTypes.object,
	    width: _react2['default'].PropTypes.string.isRequired
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme ? this.context.muiTheme : _stylesThemeManager2['default'].getMuiTheme(_stylesRawThemesLightRawTheme2['default'])
	    };
	  },
	
	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },
	
	  mixins: [_mixinsStylePropable2['default']],
	
	  render: function render() {
	    var _props = this.props;
	    var color = _props.color;
	    var left = _props.left;
	    var width = _props.width;
	    var style = _props.style;
	
	    var other = _objectWithoutProperties(_props, ['color', 'left', 'width', 'style']);
	
	    var colorStyle = color ? { backgroundColor: color } : undefined;
	    var styles = this.prepareStyles({
	      left: left,
	      width: width,
	      bottom: 0,
	      display: 'block',
	      backgroundColor: this.state.muiTheme.inkBar.backgroundColor,
	      height: 2,
	      marginTop: -2,
	      position: 'relative',
	      transition: _stylesTransitions2['default'].easeOut('1s', 'left')
	    }, this.props.style, colorStyle);
	
	    return _react2['default'].createElement(
	      'div',
	      { style: styles },
	      ' '
	    );
	  }
	
	});
	
	exports['default'] = InkBar;
	module.exports = exports['default'];

/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	exports['default'] = {
	
	  propTypes: {
	    onChange: _react2['default'].PropTypes.func,
	    value: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.array]),
	    valueLink: _react2['default'].PropTypes.shape({
	      value: _react2['default'].PropTypes.string.isRequired,
	      requestChange: _react2['default'].PropTypes.func.isRequired
	    })
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      onChange: function onChange() {}
	    };
	  },
	
	  getValueLink: function getValueLink(props) {
	    return props.valueLink || {
	      value: props.value,
	      requestChange: props.onChange
	    };
	  }
	
	};
	module.exports = exports['default'];

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _inlineStylePrefixer = __webpack_require__(331);
	
	var _inlineStylePrefixer2 = _interopRequireDefault(_inlineStylePrefixer);
	
	var prefixers = {};
	
	exports['default'] = {
	
	  getPrefixer: function getPrefixer() {
	    // Server-side renderer needs to supply user agent
	    if (typeof navigator === 'undefined') {
	      console.warn('Material-UI expects the global navigator.userAgent to be defined\nfor server-side rendering. Set this property when receiving the request headers.');
	      return null;
	    }
	
	    var userAgent = navigator.userAgent;
	
	    // Get prefixing instance for this user agent
	    var prefixer = prefixers[userAgent];
	    // None found, create a new instance
	    if (!prefixer) {
	      prefixer = new _inlineStylePrefixer2['default'](userAgent);
	      prefixers[userAgent] = prefixer;
	    }
	
	    return prefixer;
	  },
	
	  all: function all(style) {
	    if (!style) {
	      return {};
	    }
	
	    var prefixer = this.getPrefixer();
	
	    if (prefixer) {
	      return prefixer.prefix(style);
	    } else {
	      return _inlineStylePrefixer2['default'].prefixAll(style);
	    }
	  },
	
	  set: function set(style, key, value) {
	    style[key] = value;
	
	    var prefixer = this.getPrefixer();
	
	    if (prefixer) {
	      style = prefixer.prefix(style);
	    } else {
	      style = _inlineStylePrefixer2['default'].prefixAll(style);
	    }
	  },
	
	  getPrefix: function getPrefix(key) {
	    var style = {};
	    style[key] = true;
	
	    var prefixer = this.getPrefixer();
	    var prefixes = undefined;
	
	    if (prefixer) {
	      prefixes = Object.keys(prefixer.prefix(style));
	    } else {
	      prefixes = Object.keys(_inlineStylePrefixer2['default'].prefixAll(style));
	    }
	
	    return prefixes ? prefixes[0] : key;
	  }
	
	};
	module.exports = exports['default'];

/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = getMuiTheme;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashMerge = __webpack_require__(342);
	
	var _lodashMerge2 = _interopRequireDefault(_lodashMerge);
	
	var _colors = __webpack_require__(168);
	
	var _colors2 = _interopRequireDefault(_colors);
	
	var _utilsColorManipulator = __webpack_require__(169);
	
	var _utilsColorManipulator2 = _interopRequireDefault(_utilsColorManipulator);
	
	var _baseThemesLightBaseTheme = __webpack_require__(167);
	
	var _baseThemesLightBaseTheme2 = _interopRequireDefault(_baseThemesLightBaseTheme);
	
	var _zIndex = __webpack_require__(324);
	
	var _zIndex2 = _interopRequireDefault(_zIndex);
	
	/**
	 * Get the MUI theme corresponding to a base theme.
	 * It's possible to override the computed theme values
	 * by providing a second argument. The calculated
	 * theme will be deeply merged with the second argument.
	 */
	
	function getMuiTheme(baseTheme, muiTheme) {
	  baseTheme = (0, _lodashMerge2['default'])({}, _baseThemesLightBaseTheme2['default'], baseTheme);
	  var _baseTheme = baseTheme;
	  var palette = _baseTheme.palette;
	  var spacing = _baseTheme.spacing;
	
	  return (0, _lodashMerge2['default'])({
	    isRtl: false,
	    zIndex: _zIndex2['default'],
	    baseTheme: baseTheme,
	    rawTheme: baseTheme, // To provide backward compatibility.
	    appBar: {
	      color: palette.primary1Color,
	      textColor: palette.alternateTextColor,
	      height: spacing.desktopKeylineIncrement
	    },
	    avatar: {
	      borderColor: 'rgba(0, 0, 0, 0.08)'
	    },
	    badge: {
	      color: palette.alternateTextColor,
	      textColor: palette.textColor,
	      primaryColor: palette.accent1Color,
	      primaryTextColor: palette.alternateTextColor,
	      secondaryColor: palette.primary1Color,
	      secondaryTextColor: palette.alternateTextColor
	    },
	    button: {
	      height: 36,
	      minWidth: 88,
	      iconButtonSize: spacing.iconSize * 2
	    },
	    cardText: {
	      textColor: palette.textColor
	    },
	    checkbox: {
	      boxColor: palette.textColor,
	      checkedColor: palette.primary1Color,
	      requiredColor: palette.primary1Color,
	      disabledColor: palette.disabledColor,
	      labelColor: palette.textColor,
	      labelDisabledColor: palette.disabledColor
	    },
	    datePicker: {
	      color: palette.primary1Color,
	      textColor: palette.alternateTextColor,
	      calendarTextColor: palette.textColor,
	      selectColor: palette.primary2Color,
	      selectTextColor: palette.alternateTextColor
	    },
	    dropDownMenu: {
	      accentColor: palette.borderColor
	    },
	    flatButton: {
	      color: _colors2['default'].transparent,
	      buttonFilterColor: '#999999',
	      disabledTextColor: _utilsColorManipulator2['default'].fade(palette.textColor, 0.3),
	      textColor: palette.textColor,
	      primaryTextColor: palette.accent1Color,
	      secondaryTextColor: palette.primary1Color
	    },
	    floatingActionButton: {
	      buttonSize: 56,
	      miniSize: 40,
	      color: palette.accent1Color,
	      iconColor: palette.alternateTextColor,
	      secondaryColor: palette.primary1Color,
	      secondaryIconColor: palette.alternateTextColor,
	      disabledTextColor: palette.disabledColor
	    },
	    gridTile: {
	      textColor: _colors2['default'].white
	    },
	    inkBar: {
	      backgroundColor: palette.accent1Color
	    },
	    leftNav: {
	      width: spacing.desktopKeylineIncrement * 4,
	      color: palette.canvasColor
	    },
	    listItem: {
	      nestedLevelDepth: 18
	    },
	    menu: {
	      backgroundColor: palette.canvasColor,
	      containerBackgroundColor: palette.canvasColor
	    },
	    menuItem: {
	      dataHeight: 32,
	      height: 48,
	      hoverColor: 'rgba(0, 0, 0, .035)',
	      padding: spacing.desktopGutter,
	      selectedTextColor: palette.accent1Color
	    },
	    menuSubheader: {
	      padding: spacing.desktopGutter,
	      borderColor: palette.borderColor,
	      textColor: palette.primary1Color
	    },
	    paper: {
	      backgroundColor: palette.canvasColor
	    },
	    radioButton: {
	      borderColor: palette.textColor,
	      backgroundColor: palette.alternateTextColor,
	      checkedColor: palette.primary1Color,
	      requiredColor: palette.primary1Color,
	      disabledColor: palette.disabledColor,
	      size: 24,
	      labelColor: palette.textColor,
	      labelDisabledColor: palette.disabledColor
	    },
	    raisedButton: {
	      color: palette.alternateTextColor,
	      textColor: palette.textColor,
	      primaryColor: palette.accent1Color,
	      primaryTextColor: palette.alternateTextColor,
	      secondaryColor: palette.primary1Color,
	      secondaryTextColor: palette.alternateTextColor,
	      disabledColor: _utilsColorManipulator2['default'].darken(palette.alternateTextColor, 0.1),
	      disabledTextColor: _utilsColorManipulator2['default'].fade(palette.textColor, 0.3)
	    },
	    refreshIndicator: {
	      strokeColor: palette.borderColor,
	      loadingStrokeColor: palette.primary1Color
	    },
	    slider: {
	      trackSize: 2,
	      trackColor: palette.primary3Color,
	      trackColorSelected: palette.accent3Color,
	      handleSize: 12,
	      handleSizeDisabled: 8,
	      handleSizeActive: 18,
	      handleColorZero: palette.primary3Color,
	      handleFillColor: palette.alternateTextColor,
	      selectionColor: palette.primary1Color,
	      rippleColor: palette.primary1Color
	    },
	    snackbar: {
	      textColor: palette.alternateTextColor,
	      backgroundColor: palette.textColor,
	      actionColor: palette.accent1Color
	    },
	    table: {
	      backgroundColor: palette.canvasColor
	    },
	    tableHeader: {
	      borderColor: palette.borderColor
	    },
	    tableHeaderColumn: {
	      textColor: palette.accent3Color,
	      height: 56,
	      spacing: 24
	    },
	    tableFooter: {
	      borderColor: palette.borderColor,
	      textColor: palette.accent3Color
	    },
	    tableRow: {
	      hoverColor: palette.accent2Color,
	      stripeColor: _utilsColorManipulator2['default'].lighten(palette.primary1Color, 0.55),
	      selectedColor: palette.borderColor,
	      textColor: palette.textColor,
	      borderColor: palette.borderColor
	    },
	    tableRowColumn: {
	      height: 48,
	      spacing: 24
	    },
	    timePicker: {
	      color: palette.alternateTextColor,
	      textColor: palette.accent3Color,
	      accentColor: palette.primary1Color,
	      clockColor: palette.textColor,
	      clockCircleColor: palette.clockCircleColor,
	      headerColor: palette.pickerHeaderColor || palette.primary1Color,
	      selectColor: palette.primary2Color,
	      selectTextColor: palette.alternateTextColor
	    },
	    toggle: {
	      thumbOnColor: palette.primary1Color,
	      thumbOffColor: palette.accent2Color,
	      thumbDisabledColor: palette.borderColor,
	      thumbRequiredColor: palette.primary1Color,
	      trackOnColor: _utilsColorManipulator2['default'].fade(palette.primary1Color, 0.5),
	      trackOffColor: palette.primary3Color,
	      trackDisabledColor: palette.primary3Color,
	      labelColor: palette.textColor,
	      labelDisabledColor: palette.disabledColor,
	      trackRequiredColor: _utilsColorManipulator2['default'].fade(palette.primary1Color, 0.5)
	    },
	    toolbar: {
	      backgroundColor: _utilsColorManipulator2['default'].darken(palette.accent2Color, 0.05),
	      height: 56,
	      titleFontSize: 20,
	      iconColor: 'rgba(0, 0, 0, .40)',
	      separatorColor: 'rgba(0, 0, 0, .175)',
	      menuHoverColor: 'rgba(0, 0, 0, .10)'
	    },
	    tabs: {
	      backgroundColor: palette.primary1Color,
	      textColor: _utilsColorManipulator2['default'].fade(palette.alternateTextColor, 0.6),
	      selectedTextColor: palette.alternateTextColor
	    },
	    textField: {
	      textColor: palette.textColor,
	      hintColor: palette.disabledColor,
	      floatingLabelColor: palette.textColor,
	      disabledTextColor: palette.disabledColor,
	      errorColor: _colors2['default'].red500,
	      focusColor: palette.primary1Color,
	      backgroundColor: 'transparent',
	      borderColor: palette.borderColor
	    }
	  }, muiTheme);
	}
	
	module.exports = exports['default'];

/***/ },
/* 322 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = {
	  iconSize: 24,
	
	  desktopGutter: 24,
	  desktopGutterMore: 32,
	  desktopGutterLess: 16,
	  desktopGutterMini: 8,
	  desktopKeylineIncrement: 64,
	  desktopDropDownMenuItemHeight: 32,
	  desktopDropDownMenuFontSize: 15,
	  desktopLeftNavMenuItemHeight: 48,
	  desktopSubheaderHeight: 48,
	  desktopToolbarHeight: 56
	};
	module.exports = exports["default"];

/***/ },
/* 323 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = {
	
	  easeOutFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
	  easeInOutFunction: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
	
	  easeOut: function easeOut(duration, property, delay, easeFunction) {
	
	    easeFunction = easeFunction || this.easeOutFunction;
	
	    if (property && Object.prototype.toString.call(property) === '[object Array]') {
	
	      var transitions = '';
	      for (var i = 0; i < property.length; i++) {
	        if (transitions) transitions += ',';
	        transitions += this.create(duration, property[i], delay, easeFunction);
	      }
	      return transitions;
	    } else {
	      return this.create(duration, property, delay, easeFunction);
	    }
	  },
	
	  create: function create(duration, property, delay, easeFunction) {
	    duration = duration || '450ms';
	    property = property || 'all';
	    delay = delay || '0ms';
	    easeFunction = easeFunction || 'linear';
	
	    return property + ' ' + duration + ' ' + easeFunction + ' ' + delay;
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 324 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = {
	  menu: 1000,
	  appBar: 1100,
	  leftNavOverlay: 1200,
	  leftNav: 1300,
	  dialogOverlay: 1400,
	  dialog: 1500,
	  layer: 2000,
	  popover: 2100,
	  snackbar: 2900,
	  tooltip: 3000
	};
	module.exports = exports["default"];

/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _mixinsStylePropable = __webpack_require__(55);
	
	var _mixinsStylePropable2 = _interopRequireDefault(_mixinsStylePropable);
	
	var _stylesRawThemesLightRawTheme = __webpack_require__(56);
	
	var _stylesRawThemesLightRawTheme2 = _interopRequireDefault(_stylesRawThemesLightRawTheme);
	
	var _stylesThemeManager = __webpack_require__(57);
	
	var _stylesThemeManager2 = _interopRequireDefault(_stylesThemeManager);
	
	var Tab = _react2['default'].createClass({
	  displayName: 'Tab',
	
	  mixins: [_mixinsStylePropable2['default']],
	
	  contextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  propTypes: {
	    /**
	     * The css class name of the root element.
	     */
	    className: _react2['default'].PropTypes.string,
	
	    /**
	     * Sets the text value of the tab item to the string specified.
	     */
	    label: _react2['default'].PropTypes.node,
	
	    /**
	     * Fired when the active tab changes by touch or tap.
	     * Use this event to specify any functionality when an active tab changes.
	     * For example - we are using this to route to home when the third tab becomes active.
	     * This function will always recieve the active tab as it\'s first argument.
	     */
	    onActive: _react2['default'].PropTypes.func,
	
	    /**
	     * This property is overriden by the Tabs component.
	     */
	    onTouchTap: _react2['default'].PropTypes.func,
	
	    /**
	     * Defines if the current tab is selected or not.
	     * The Tabs component is responsible for setting this property.
	     */
	    selected: _react2['default'].PropTypes.bool,
	
	    /**
	     * Override the inline-styles of the root element.
	     */
	    style: _react2['default'].PropTypes.object,
	
	    /**
	     * If value prop passed to Tabs component, this value prop is also required.
	     * It assigns a value to the tab so that it can be selected by the Tabs.
	     */
	    value: _react2['default'].PropTypes.any,
	
	    /**
	     * This property is overriden by the Tabs component.
	     */
	    width: _react2['default'].PropTypes.string
	  },
	
	  //for passing default theme context to children
	  childContextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	
	  getInitialState: function getInitialState() {
	    return {
	      muiTheme: this.context.muiTheme ? this.context.muiTheme : _stylesThemeManager2['default'].getMuiTheme(_stylesRawThemesLightRawTheme2['default'])
	    };
	  },
	
	  //to update theme inside state whenever a new theme is passed down
	  //from the parent / owner using context
	  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	    this.setState({ muiTheme: newMuiTheme });
	  },
	
	  render: function render() {
	    var _props = this.props;
	    var label = _props.label;
	    var onActive = _props.onActive;
	    var onTouchTap = _props.onTouchTap;
	    var selected = _props.selected;
	    var style = _props.style;
	    var value = _props.value;
	    var width = _props.width;
	
	    var other = _objectWithoutProperties(_props, ['label', 'onActive', 'onTouchTap', 'selected', 'style', 'value', 'width']);
	
	    var styles = this.prepareStyles({
	      display: 'table-cell',
	      cursor: 'pointer',
	      textAlign: 'center',
	      verticalAlign: 'middle',
	      height: 48,
	      color: selected ? this.state.muiTheme.tabs.selectedTextColor : this.state.muiTheme.tabs.textColor,
	      outline: 'none',
	      fontSize: 14,
	      fontWeight: 500,
	      whiteSpace: 'initial',
	      fontFamily: this.state.muiTheme.rawTheme.fontFamily,
	      boxSizing: 'border-box',
	      width: width
	    }, style);
	
	    return _react2['default'].createElement(
	      'div',
	      _extends({}, other, {
	        style: styles,
	        onTouchTap: this._handleTouchTap }),
	      label
	    );
	  },
	
	  _handleTouchTap: function _handleTouchTap(event) {
	    if (this.props.onTouchTap) {
	      this.props.onTouchTap(this.props.value, event, this);
	    }
	  }
	
	});
	
	exports['default'] = Tab;
	module.exports = exports['default'];

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var TabTemplate = _react2['default'].createClass({
	  displayName: 'TabTemplate',
	
	  propTypes: {
	    children: _react2['default'].PropTypes.node,
	    selected: _react2['default'].PropTypes.bool
	  },
	
	  render: function render() {
	    var styles = {
	      height: 0,
	      overflow: 'hidden',
	      width: '100%',
	      position: 'relative',
	      textAlign: 'initial'
	    };
	
	    if (this.props.selected) {
	      delete styles.height;
	      delete styles.overflow;
	    }
	
	    return _react2['default'].createElement(
	      'div',
	      { style: styles },
	      this.props.children
	    );
	  }
	});
	
	exports['default'] = TabTemplate;
	module.exports = exports['default'];

/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDom = __webpack_require__(105);
	
	var _reactDom2 = _interopRequireDefault(_reactDom);
	
	// I'm using require not to break react-codmod
	
	var _inkBar = __webpack_require__(318);
	
	var _inkBar2 = _interopRequireDefault(_inkBar);
	
	var _mixinsStylePropable = __webpack_require__(55);
	
	var _mixinsStylePropable2 = _interopRequireDefault(_mixinsStylePropable);
	
	var _mixinsControllable = __webpack_require__(319);
	
	var _mixinsControllable2 = _interopRequireDefault(_mixinsControllable);
	
	var _stylesRawThemesLightRawTheme = __webpack_require__(56);
	
	var _stylesRawThemesLightRawTheme2 = _interopRequireDefault(_stylesRawThemesLightRawTheme);
	
	var _stylesThemeManager = __webpack_require__(57);
	
	var _stylesThemeManager2 = _interopRequireDefault(_stylesThemeManager);
	
	var _warning = __webpack_require__(356);
	
	var _warning2 = _interopRequireDefault(_warning);
	
	var TabTemplate = __webpack_require__(326);
	
	var Tabs = _react2['default'].createClass({
	  displayName: 'Tabs',
	
	  mixins: [_mixinsStylePropable2['default'], _mixinsControllable2['default']],
	
	  contextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  propTypes: {
	    /**
	     * Should be used to pass Tab components.
	     */
	    children: _react2['default'].PropTypes.node,
	
	    /**
	     * The css class name of the root element.
	     */
	    className: _react2['default'].PropTypes.string,
	
	    /**
	     * The css class name of the content's container.
	     */
	    contentContainerClassName: _react2['default'].PropTypes.string,
	
	    /**
	     * Override the inline-styles of the content's container.
	     */
	    contentContainerStyle: _react2['default'].PropTypes.object,
	
	    /**
	     * Specify initial visible tab index.
	     * Initial selected index is set by default to 0.
	     * If initialSelectedIndex is set but larger than the total amount of specified tabs,
	     * initialSelectedIndex will revert back to default.
	     */
	    initialSelectedIndex: _react2['default'].PropTypes.number,
	
	    /**
	     * Override the inline-styles of the InkBar.
	     */
	    inkBarStyle: _react2['default'].PropTypes.object,
	
	    /**
	     * Called when the selected value change.
	     */
	    onChange: _react2['default'].PropTypes.func,
	
	    /**
	     * Override the inline-styles of the root element.
	     */
	    style: _react2['default'].PropTypes.object,
	
	    /**
	     * Override the inline-styles of the tab-labels container.
	     */
	    tabItemContainerStyle: _react2['default'].PropTypes.object,
	
	    /**
	     * Override the default tab template used to wrap the content of each tab element.
	     */
	    tabTemplate: _react2['default'].PropTypes.func,
	
	    /**
	     * Makes Tabs controllable and selects the tab whose value prop matches this prop.
	     */
	    value: _react2['default'].PropTypes.any
	  },
	
	  childContextTypes: {
	    muiTheme: _react2['default'].PropTypes.object
	  },
	
	  getChildContext: function getChildContext() {
	    return {
	      muiTheme: this.state.muiTheme
	    };
	  },
	
	  getDefaultProps: function getDefaultProps() {
	    return {
	      initialSelectedIndex: 0,
	      tabTemplate: TabTemplate
	    };
	  },
	
	  getInitialState: function getInitialState() {
	    var valueLink = this.getValueLink(this.props);
	    var initialIndex = this.props.initialSelectedIndex;
	
	    return {
	      selectedIndex: valueLink.value !== undefined ? this._getSelectedIndex(this.props) : initialIndex < this.getTabCount() ? initialIndex : 0,
	      muiTheme: this.context.muiTheme ? this.context.muiTheme : _stylesThemeManager2['default'].getMuiTheme(_stylesRawThemesLightRawTheme2['default'])
	    };
	  },
	
	  getEvenWidth: function getEvenWidth() {
	    return parseInt(window.getComputedStyle(_reactDom2['default'].findDOMNode(this)).getPropertyValue('width'), 10);
	  },
	
	  getTabCount: function getTabCount() {
	    return _react2['default'].Children.count(this.props.children);
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps(newProps, nextContext) {
	    var valueLink = this.getValueLink(newProps);
	    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
	
	    if (valueLink.value !== undefined) {
	      this.setState({ selectedIndex: this._getSelectedIndex(newProps) });
	    }
	
	    this.setState({ muiTheme: newMuiTheme });
	  },
	
	  render: function render() {
	    var _this = this;
	
	    var _props = this.props;
	    var children = _props.children;
	    var contentContainerClassName = _props.contentContainerClassName;
	    var contentContainerStyle = _props.contentContainerStyle;
	    var initialSelectedIndex = _props.initialSelectedIndex;
	    var inkBarStyle = _props.inkBarStyle;
	    var style = _props.style;
	    var tabItemContainerStyle = _props.tabItemContainerStyle;
	    var tabTemplate = _props.tabTemplate;
	
	    var other = _objectWithoutProperties(_props, ['children', 'contentContainerClassName', 'contentContainerStyle', 'initialSelectedIndex', 'inkBarStyle', 'style', 'tabItemContainerStyle', 'tabTemplate']);
	
	    var themeVariables = this.state.muiTheme.tabs;
	    var styles = {
	      tabItemContainer: {
	        margin: 0,
	        padding: 0,
	        width: '100%',
	        height: 48,
	        backgroundColor: themeVariables.backgroundColor,
	        whiteSpace: 'nowrap',
	        display: 'table'
	      }
	    };
	
	    var valueLink = this.getValueLink(this.props);
	    var tabValue = valueLink.value;
	    var tabContent = [];
	
	    var width = 100 / this.getTabCount() + '%';
	
	    var left = 'calc(' + width + '*' + this.state.selectedIndex + ')';
	
	    var tabs = _react2['default'].Children.map(children, function (tab, index) {
	       true ? (0, _warning2['default'])(tab.type && tab.type.displayName === 'Tab', 'Tabs only accepts Tab Components as children.\n        Found ' + (tab.type.displayName || tab.type) + ' as child number ' + (index + 1) + ' of Tabs') : undefined;
	
	       true ? (0, _warning2['default'])(!tabValue || tab.props.value !== undefined, 'Tabs value prop has been passed, but Tab ' + index + '\n        does not have a value prop. Needs value if Tabs is going\n        to be a controlled component.') : undefined;
	
	      tabContent.push(tab.props.children ? _react2['default'].createElement(tabTemplate, {
	        key: index,
	        selected: _this._getSelected(tab, index)
	      }, tab.props.children) : undefined);
	
	      return _react2['default'].cloneElement(tab, {
	        key: index,
	        selected: _this._getSelected(tab, index),
	        tabIndex: index,
	        width: width,
	        onTouchTap: _this._handleTabTouchTap
	      });
	    });
	
	    var inkBar = this.state.selectedIndex !== -1 ? _react2['default'].createElement(_inkBar2['default'], {
	      left: left,
	      width: width,
	      style: inkBarStyle
	    }) : null;
	
	    var inkBarContainerWidth = tabItemContainerStyle ? tabItemContainerStyle.width : '100%';
	
	    return _react2['default'].createElement(
	      'div',
	      _extends({}, other, {
	        style: this.prepareStyles(style) }),
	      _react2['default'].createElement(
	        'div',
	        { style: this.prepareStyles(styles.tabItemContainer, tabItemContainerStyle) },
	        tabs
	      ),
	      _react2['default'].createElement(
	        'div',
	        { style: { width: inkBarContainerWidth } },
	        inkBar
	      ),
	      _react2['default'].createElement(
	        'div',
	        {
	          style: this.prepareStyles(contentContainerStyle),
	          className: contentContainerClassName
	        },
	        tabContent
	      )
	    );
	  },
	
	  _getSelectedIndex: function _getSelectedIndex(props) {
	    var valueLink = this.getValueLink(props);
	    var selectedIndex = -1;
	
	    _react2['default'].Children.forEach(props.children, function (tab, index) {
	      if (valueLink.value === tab.props.value) {
	        selectedIndex = index;
	      }
	    });
	
	    return selectedIndex;
	  },
	
	  _handleTabTouchTap: function _handleTabTouchTap(value, e, tab) {
	    var valueLink = this.getValueLink(this.props);
	    var tabIndex = tab.props.tabIndex;
	
	    if (valueLink.value && valueLink.value !== value || this.state.selectedIndex !== tabIndex) {
	      valueLink.requestChange(value, e, tab);
	    }
	
	    this.setState({ selectedIndex: tabIndex });
	
	    if (tab.props.onActive) {
	      tab.props.onActive(tab);
	    }
	  },
	
	  _getSelected: function _getSelected(tab, index) {
	    var valueLink = this.getValueLink(this.props);
	    return valueLink.value ? valueLink.value === tab.props.value : this.state.selectedIndex === index;
	  }
	
	});
	
	exports['default'] = Tabs;
	module.exports = exports['default'];

/***/ },
/* 328 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	function isObject(obj) {
	  return typeof obj === 'object' && obj !== null;
	}
	
	/**
	*  A recursive merge between two objects.
	*
	*  @param base     - the object whose properties are to be overwritten. It
	*                    should be either the root level or some nested level.
	*  @param override - an object containing properties to be overwritten. It
	*                    should have the same structure as the object object.
	*/
	var extend = function extend(base, override) {
	
	  var mergedObject = {};
	
	  //Loop through each key in the base object
	  Object.keys(base).forEach(function (key) {
	
	    var baseProp = base[key];
	    var overrideProp = undefined;
	
	    if (isObject(override)) overrideProp = override[key];
	
	    //Recursive call extend if the prop is another object, else just copy it over
	    mergedObject[key] = isObject(baseProp) && !Array.isArray(baseProp) ? extend(baseProp, overrideProp) : baseProp;
	  });
	
	  //Loop through each override key and override the props in the
	  //base object
	  if (isObject(override)) {
	
	    Object.keys(override).forEach(function (overrideKey) {
	
	      var overrideProp = override[overrideKey];
	
	      //Only copy over props that are not objects
	      if (!isObject(overrideProp) || Array.isArray(overrideProp)) {
	        mergedObject[overrideKey] = overrideProp;
	      }
	    });
	  }
	
	  return mergedObject;
	};
	
	exports['default'] = extend;
	module.exports = exports['default'];

/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _stylesAutoPrefix = __webpack_require__(320);
	
	var _stylesAutoPrefix2 = _interopRequireDefault(_stylesAutoPrefix);
	
	var _utilsImmutabilityHelper = __webpack_require__(170);
	
	var _utilsImmutabilityHelper2 = _interopRequireDefault(_utilsImmutabilityHelper);
	
	var reTranslate = /((^|\s)translate(3d|X)?\()(\-?[\d]+)/;
	
	var reSkew = /((^|\s)skew(x|y)?\()\s*(\-?[\d]+)(deg|rad|grad)(,\s*(\-?[\d]+)(deg|rad|grad))?/;
	
	exports['default'] = {
	
	  merge: function merge() {
	    return _utilsImmutabilityHelper2['default'].merge.apply(this, arguments);
	  },
	
	  mergeAndPrefix: function mergeAndPrefix() {
	    var mergedStyles = _utilsImmutabilityHelper2['default'].merge.apply(this, arguments);
	    return _stylesAutoPrefix2['default'].all(mergedStyles);
	  },
	
	  // This function ensures that `style` supports both ltr and rtl directions by checking
	  //   `styleConstants` in `muiTheme` and replacing attribute keys if necessary.
	  ensureDirection: function ensureDirection(muiTheme, style) {
	    if (true) {
	      if (style.didFlip) {
	        console.warn(new Error('You\'re calling `ensureDirection` on the same style object twice.'));
	      }
	      style = _utilsImmutabilityHelper2['default'].merge({
	        didFlip: 'true'
	      }, style);
	    }
	
	    // Left to right is the default. No need to flip anything.
	    if (!muiTheme.isRtl) return style;
	
	    var flippedAttributes = {
	      // Keys and their replacements.
	      right: 'left',
	      left: 'right',
	      marginRight: 'marginLeft',
	      marginLeft: 'marginRight',
	      paddingRight: 'paddingLeft',
	      paddingLeft: 'paddingRight',
	      borderRight: 'borderLeft',
	      borderLeft: 'borderRight'
	    };
	
	    var newStyle = {};
	
	    Object.keys(style).forEach(function (attribute) {
	      var value = style[attribute];
	      var key = attribute;
	
	      if (flippedAttributes.hasOwnProperty(attribute)) {
	        key = flippedAttributes[attribute];
	      }
	
	      switch (attribute) {
	        case 'float':
	        case 'textAlign':
	          if (value === 'right') {
	            value = 'left';
	          } else if (value === 'left') {
	            value = 'right';
	          }
	          break;
	        case 'direction':
	          if (value === 'ltr') {
	            value = 'rtl';
	          } else if (value === 'rtl') {
	            value = 'ltr';
	          }
	          break;
	        case 'transform':
	          var matches = undefined;
	          if (matches = value.match(reTranslate)) {
	            value = value.replace(matches[0], matches[1] + -parseFloat(matches[4]));
	          }
	          if (matches = value.match(reSkew)) {
	            value = value.replace(matches[0], matches[1] + -parseFloat(matches[4]) + matches[5] + matches[6] ? ',' + -parseFloat(matches[7]) + matches[8] : '');
	          }
	          break;
	        case 'transformOrigin':
	          if (value.indexOf('right') > -1) {
	            value = value.replace('right', 'left');
	          } else if (value.indexOf('left') > -1) {
	            value = value.replace('left', 'right');
	          }
	          break;
	      }
	
	      newStyle[key] = value;
	    });
	
	    return newStyle;
	  },
	
	  prepareStyles: function prepareStyles(muiTheme) {
	    for (var _len = arguments.length, styles = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      styles[_key - 1] = arguments[_key];
	    }
	
	    styles = styles.length > 1 ? _utilsImmutabilityHelper2['default'].merge.apply(this, styles) : styles[0] || {};
	    var flipped = this.ensureDirection(muiTheme, styles);
	    return _stylesAutoPrefix2['default'].all(flipped);
	  }
	};
	module.exports = exports['default'];

/***/ },
/* 330 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _pluginsCursor = __webpack_require__(335);
	
	var _pluginsCursor2 = _interopRequireDefault(_pluginsCursor);
	
	var _pluginsFlex = __webpack_require__(336);
	
	var _pluginsFlex2 = _interopRequireDefault(_pluginsFlex);
	
	var _pluginsSizing = __webpack_require__(340);
	
	var _pluginsSizing2 = _interopRequireDefault(_pluginsSizing);
	
	var _pluginsGradient = __webpack_require__(339);
	
	var _pluginsGradient2 = _interopRequireDefault(_pluginsGradient);
	
	// special flexbox specifications
	
	var _pluginsFlexboxIE = __webpack_require__(337);
	
	var _pluginsFlexboxIE2 = _interopRequireDefault(_pluginsFlexboxIE);
	
	var _pluginsFlexboxOld = __webpack_require__(338);
	
	var _pluginsFlexboxOld2 = _interopRequireDefault(_pluginsFlexboxOld);
	
	exports['default'] = [_pluginsCursor2['default'], _pluginsFlex2['default'], _pluginsSizing2['default'], _pluginsGradient2['default'], _pluginsFlexboxIE2['default'], _pluginsFlexboxOld2['default']];
	module.exports = exports['default'];

/***/ },
/* 331 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _getBrowserInformation = __webpack_require__(333);
	
	var _getBrowserInformation2 = _interopRequireDefault(_getBrowserInformation);
	
	var _getPrefixedKeyframes = __webpack_require__(334);
	
	var _getPrefixedKeyframes2 = _interopRequireDefault(_getPrefixedKeyframes);
	
	var _caniuseData = __webpack_require__(332);
	
	var _caniuseData2 = _interopRequireDefault(_caniuseData);
	
	var _Plugins = __webpack_require__(330);
	
	var _Plugins2 = _interopRequireDefault(_Plugins);
	
	var defaultUserAgent = typeof navigator !== 'undefined' ? navigator.userAgent : undefined;
	
	// only throw warnings if devmode is enabled
	var warn = function warn() {
	  if (true) {
	    console.warn.apply(console, arguments);
	  }
	};
	// helper to capitalize strings
	var caplitalizeString = function caplitalizeString(str) {
	  return str.charAt(0).toUpperCase() + str.slice(1);
	};
	
	// leight polyfill for Object.assign
	var assign = function assign(base, extend) {
	  if (extend) {
	    Object.keys(extend).forEach(function (key) {
	      return base[key] = extend[key];
	    });
	  }
	  return extend;
	};
	
	var Prefixer = (function () {
	  /**
	   * Instantiante a new prefixer. Pass an asterisk as userAgent to combine all prefixes
	   * @param {string} userAgent - userAgent to gather prefix information according to caniuse.com
	   */
	
	  function Prefixer() {
	    var _this = this;
	
	    var userAgent = arguments.length <= 0 || arguments[0] === undefined ? defaultUserAgent : arguments[0];
	
	    _classCallCheck(this, Prefixer);
	
	    this._userAgent = userAgent;
	    this._browserInfo = (0, _getBrowserInformation2['default'])(userAgent);
	
	    // Checks if the userAgent was resolved correctly
	    if (this._browserInfo && this._browserInfo.prefix) {
	      this.cssPrefix = this._browserInfo.prefix.CSS;
	      this.jsPrefix = this._browserInfo.prefix.inline;
	      this.prefixedKeyframes = (0, _getPrefixedKeyframes2['default'])(this._browserInfo);
	    } else {
	      this._hasPropsRequiringPrefix = false;
	      warn('Either the global navigator was undefined or an invalid userAgent was provided.', 'Using a valid userAgent? Please let us know and create an issue at https://github.com/rofrischmann/inline-style-prefixer/issues');
	      return false;
	    }
	    var data = this._browserInfo.browser && _caniuseData2['default'][this._browserInfo.browser];
	    if (data) {
	      this._requiresPrefix = Object.keys(data).filter(function (key) {
	        return data[key] >= _this._browserInfo.version;
	      }).reduce(function (result, name) {
	        result[name] = true;
	        return result;
	      }, {});
	      this._hasPropsRequiringPrefix = Object.keys(this._requiresPrefix).length > 0;
	    } else {
	      this._hasPropsRequiringPrefix = false;
	      warn('Your userAgent seems to be not supported by inline-style-prefixer. Feel free to open an issue.');
	      return false;
	    }
	  }
	
	  /**
	   * Returns a prefixed version of the style object
	   * @param {Object} styles - Style object that gets prefixed properties added
	   * @returns {Object} - Style object with prefixed properties and values
	   */
	
	  _createClass(Prefixer, [{
	    key: 'prefix',
	    value: function prefix(styles) {
	      var _this2 = this;
	
	      // only add prefixes if needed
	      if (!this._hasPropsRequiringPrefix) {
	        return styles;
	      }
	
	      styles = assign({}, styles);
	
	      Object.keys(styles).forEach(function (property) {
	        var value = styles[property];
	        if (value instanceof Object) {
	          // recurse through nested style objects
	          styles[property] = _this2.prefix(value);
	        } else {
	          // add prefixes if needed
	          if (_this2._requiresPrefix[property]) {
	            styles[_this2.jsPrefix + caplitalizeString(property)] = value;
	            delete styles[property];
	          }
	
	          // resolve plugins
	          _Plugins2['default'].forEach(function (plugin) {
	            assign(styles, plugin(property, value, _this2._browserInfo, styles, false));
	          });
	        }
	      });
	
	      return styles;
	    }
	
	    /**
	     * Returns a prefixed version of the style object using all vendor prefixes
	     * @param {Object} styles - Style object that gets prefixed properties added
	     * @returns {Object} - Style object with prefixed properties and values
	     */
	  }], [{
	    key: 'prefixAll',
	    value: function prefixAll(styles) {
	      var prefixes = {};
	      var browserInfo = (0, _getBrowserInformation2['default'])('*');
	
	      browserInfo.browsers.forEach(function (browser) {
	        var data = _caniuseData2['default'][browser];
	        if (data) {
	          assign(prefixes, data);
	        }
	      });
	
	      // there should always be at least one prefixed style, but just incase
	      if (!Object.keys(prefixes).length > 0) {
	        return styles;
	      }
	
	      styles = assign({}, styles);
	
	      Object.keys(styles).forEach(function (property) {
	        var value = styles[property];
	        if (value instanceof Object) {
	          // recurse through nested style objects
	          styles[property] = Prefixer.prefixAll(value);
	        } else {
	          var browsers = Object.keys(browserInfo.prefixes);
	          browsers.forEach(function (browser) {
	            var style = browserInfo.prefixes[browser];
	            // add prefixes if needed
	            if (prefixes[property]) {
	              styles[style.inline + caplitalizeString(property)] = value;
	            }
	
	            // resolve plugins for each browser
	            _Plugins2['default'].forEach(function (plugin) {
	              var browserInfo = {
	                name: browser,
	                prefix: style,
	                version: 0 // assume lowest
	              };
	              assign(styles, plugin(property, value, browserInfo, styles, true));
	            });
	          });
	        }
	      });
	
	      return styles;
	    }
	  }]);
	
	  return Prefixer;
	})();
	
	exports['default'] = Prefixer;
	module.exports = exports['default'];

/***/ },
/* 332 */
/***/ function(module, exports) {

	var caniuseData = {"chrome":{"transform":35,"transformOrigin":35,"transformOriginX":35,"transformOriginY":35,"backfaceVisibility":35,"perspective":35,"perspectiveOrigin":35,"transformStyle":35,"transformOriginZ":35,"animation":42,"animationDelay":42,"animationDirection":42,"animationFillMode":42,"animationDuration":42,"animationIterationCount":42,"animationName":42,"animationPlayState":42,"animationTimingFunction":42,"appearance":49,"userSelect":49,"fontKerning":32,"textEmphasisPosition":49,"textEmphasis":49,"textEmphasisStyle":49,"textEmphasisColor":49,"boxDecorationBreak":49,"clipPath":49,"maskImage":49,"maskMode":49,"maskRepeat":49,"maskPosition":49,"maskClip":49,"maskOrigin":49,"maskSize":49,"maskComposite":49,"mask":49,"maskBorderSource":49,"maskBorderMode":49,"maskBorderSlice":49,"maskBorderWidth":49,"maskBorderOutset":49,"maskBorderRepeat":49,"maskBorder":49,"maskType":49,"textDecorationStyle":49,"textDecorationSkip":49,"textDecorationLine":49,"textDecorationColor":49,"filter":49,"fontFeatureSettings":49,"breakAfter":49,"breakBefore":49,"breakInside":49,"columnCount":49,"columnFill":49,"columnGap":49,"columnRule":49,"columnRuleColor":49,"columnRuleStyle":49,"columnRuleWidth":49,"columns":49,"columnSpan":49,"columnWidth":49},"safari":{"flex":8,"flexBasis":8,"flexDirection":8,"flexGrow":8,"flexFlow":8,"flexShrink":8,"flexWrap":8,"alignContent":8,"alignItems":8,"alignSelf":8,"justifyContent":8,"order":8,"transition":6,"transitionDelay":6,"transitionDuration":6,"transitionProperty":6,"transitionTimingFunction":6,"transform":8,"transformOrigin":8,"transformOriginX":8,"transformOriginY":8,"backfaceVisibility":8,"perspective":8,"perspectiveOrigin":8,"transformStyle":8,"transformOriginZ":8,"animation":8,"animationDelay":8,"animationDirection":8,"animationFillMode":8,"animationDuration":8,"animationIterationCount":8,"animationName":8,"animationPlayState":8,"animationTimingFunction":8,"appearance":9,"userSelect":9,"backdropFilter":9,"fontKerning":9,"scrollSnapType":9,"scrollSnapPointsX":9,"scrollSnapPointsY":9,"scrollSnapDestination":9,"scrollSnapCoordinate":9,"textEmphasisPosition":7,"textEmphasis":7,"textEmphasisStyle":7,"textEmphasisColor":7,"boxDecorationBreak":9,"clipPath":9,"maskImage":9,"maskMode":9,"maskRepeat":9,"maskPosition":9,"maskClip":9,"maskOrigin":9,"maskSize":9,"maskComposite":9,"mask":9,"maskBorderSource":9,"maskBorderMode":9,"maskBorderSlice":9,"maskBorderWidth":9,"maskBorderOutset":9,"maskBorderRepeat":9,"maskBorder":9,"maskType":9,"textDecorationStyle":9,"textDecorationSkip":9,"textDecorationLine":9,"textDecorationColor":9,"shapeImageThreshold":9,"shapeImageMargin":9,"shapeImageOutside":9,"filter":9,"hyphens":9,"flowInto":9,"flowFrom":9,"breakBefore":8,"breakAfter":8,"breakInside":8,"regionFragment":9,"columnCount":8,"columnFill":8,"columnGap":8,"columnRule":8,"columnRuleColor":8,"columnRuleStyle":8,"columnRuleWidth":8,"columns":8,"columnSpan":8,"columnWidth":8},"firefox":{"appearance":45,"userSelect":45,"boxSizing":28,"textAlignLast":45,"textDecorationStyle":35,"textDecorationSkip":35,"textDecorationLine":35,"textDecorationColor":35,"tabSize":45,"hyphens":42,"fontFeatureSettings":33,"breakAfter":45,"breakBefore":45,"breakInside":45,"columnCount":45,"columnFill":45,"columnGap":45,"columnRule":45,"columnRuleColor":45,"columnRuleStyle":45,"columnRuleWidth":45,"columns":45,"columnSpan":45,"columnWidth":45},"opera":{"flex":16,"flexBasis":16,"flexDirection":16,"flexGrow":16,"flexFlow":16,"flexShrink":16,"flexWrap":16,"alignContent":16,"alignItems":16,"alignSelf":16,"justifyContent":16,"order":16,"transform":22,"transformOrigin":22,"transformOriginX":22,"transformOriginY":22,"backfaceVisibility":22,"perspective":22,"perspectiveOrigin":22,"transformStyle":22,"transformOriginZ":22,"animation":29,"animationDelay":29,"animationDirection":29,"animationFillMode":29,"animationDuration":29,"animationIterationCount":29,"animationName":29,"animationPlayState":29,"animationTimingFunction":29,"appearance":35,"userSelect":35,"fontKerning":19,"textEmphasisPosition":35,"textEmphasis":35,"textEmphasisStyle":35,"textEmphasisColor":35,"boxDecorationBreak":35,"clipPath":35,"maskImage":35,"maskMode":35,"maskRepeat":35,"maskPosition":35,"maskClip":35,"maskOrigin":35,"maskSize":35,"maskComposite":35,"mask":35,"maskBorderSource":35,"maskBorderMode":35,"maskBorderSlice":35,"maskBorderWidth":35,"maskBorderOutset":35,"maskBorderRepeat":35,"maskBorder":35,"maskType":35,"filter":35,"fontFeatureSettings":35,"breakAfter":35,"breakBefore":35,"breakInside":35,"columnCount":35,"columnFill":35,"columnGap":35,"columnRule":35,"columnRuleColor":35,"columnRuleStyle":35,"columnRuleWidth":35,"columns":35,"columnSpan":35,"columnWidth":35},"ie":{"gridTemplateRows":11,"grid":11,"flowInto":11,"flexDirection":10,"touchAction":10,"gridRow":11,"scrollSnapPointsX":11,"wrapMargin":11,"breakBefore":11,"gridRowEnd":11,"gridRowStart":11,"breakInside":11,"transformOrigin":9,"scrollSnapType":11,"scrollSnapDestination":11,"gridTemplate":11,"flexWrap":10,"transformOriginX":9,"flowFrom":11,"gridColumnStart":11,"userSelect":11,"wrapFlow":11,"scrollSnapCoordinate":11,"gridGap":11,"gridAutoRows":11,"hyphens":11,"regionFragment":11,"flex":10,"columnGap":11,"wrapThrough":11,"transformOriginY":9,"breakAfter":11,"rowGap":11,"gridTemplateColumns":11,"gridArea":11,"transform":9,"gridAutoFlow":11,"flexFlow":10,"gridTemplateAreas":11,"gridColumn":11,"gridAutoColumns":11,"scrollSnapPointsY":11,"textSizeAdjust":11},"ios_saf":{"flex":8.1,"flexBasis":8.1,"flexDirection":8.1,"flexGrow":8.1,"flexFlow":8.1,"flexShrink":8.1,"flexWrap":8.1,"alignContent":8.1,"alignItems":8.1,"alignSelf":8.1,"justifyContent":8.1,"order":8.1,"transition":6,"transitionDelay":6,"transitionDuration":6,"transitionProperty":6,"transitionTimingFunction":6,"transform":8.1,"transformOrigin":8.1,"transformOriginX":8.1,"transformOriginY":8.1,"backfaceVisibility":8.1,"perspective":8.1,"perspectiveOrigin":8.1,"transformStyle":8.1,"transformOriginZ":8.1,"animation":8.1,"animationDelay":8.1,"animationDirection":8.1,"animationFillMode":8.1,"animationDuration":8.1,"animationIterationCount":8.1,"animationName":8.1,"animationPlayState":8.1,"animationTimingFunction":8.1,"appearance":9,"userSelect":9,"backdropFilter":9,"fontKerning":9,"scrollSnapType":9,"scrollSnapPointsX":9,"scrollSnapPointsY":9,"scrollSnapDestination":9,"scrollSnapCoordinate":9,"boxDecorationBreak":9,"clipPath":9,"maskImage":9,"maskMode":9,"maskRepeat":9,"maskPosition":9,"maskClip":9,"maskOrigin":9,"maskSize":9,"maskComposite":9,"mask":9,"maskBorderSource":9,"maskBorderMode":9,"maskBorderSlice":9,"maskBorderWidth":9,"maskBorderOutset":9,"maskBorderRepeat":9,"maskBorder":9,"maskType":9,"textSizeAdjust":9,"textDecorationStyle":9,"textDecorationSkip":9,"textDecorationLine":9,"textDecorationColor":9,"shapeImageThreshold":9,"shapeImageMargin":9,"shapeImageOutside":9,"filter":9,"hyphens":9,"flowInto":9,"flowFrom":9,"breakBefore":8.1,"breakAfter":8.1,"breakInside":8.1,"regionFragment":9,"columnCount":8.1,"columnFill":8.1,"columnGap":8.1,"columnRule":8.1,"columnRuleColor":8.1,"columnRuleStyle":8.1,"columnRuleWidth":8.1,"columns":8.1,"columnSpan":8.1,"columnWidth":8.1},"android":{"borderImage":4.2,"borderImageOutset":4.2,"borderImageRepeat":4.2,"borderImageSlice":4.2,"borderImageSource":4.2,"borderImageWidth":4.2,"flex":4.2,"flexBasis":4.2,"flexDirection":4.2,"flexGrow":4.2,"flexFlow":4.2,"flexShrink":4.2,"flexWrap":4.2,"alignContent":4.2,"alignItems":4.2,"alignSelf":4.2,"justifyContent":4.2,"order":4.2,"transition":4.2,"transitionDelay":4.2,"transitionDuration":4.2,"transitionProperty":4.2,"transitionTimingFunction":4.2,"transform":4.4,"transformOrigin":4.4,"transformOriginX":4.4,"transformOriginY":4.4,"backfaceVisibility":4.4,"perspective":4.4,"perspectiveOrigin":4.4,"transformStyle":4.4,"transformOriginZ":4.4,"animation":4.4,"animationDelay":4.4,"animationDirection":4.4,"animationFillMode":4.4,"animationDuration":4.4,"animationIterationCount":4.4,"animationName":4.4,"animationPlayState":4.4,"animationTimingFunction":4.4,"appearance":44,"userSelect":44,"fontKerning":4.4,"textEmphasisPosition":44,"textEmphasis":44,"textEmphasisStyle":44,"textEmphasisColor":44,"boxDecorationBreak":44,"clipPath":44,"maskImage":44,"maskMode":44,"maskRepeat":44,"maskPosition":44,"maskClip":44,"maskOrigin":44,"maskSize":44,"maskComposite":44,"mask":44,"maskBorderSource":44,"maskBorderMode":44,"maskBorderSlice":44,"maskBorderWidth":44,"maskBorderOutset":44,"maskBorderRepeat":44,"maskBorder":44,"maskType":44,"filter":44,"fontFeatureSettings":44,"breakAfter":44,"breakBefore":44,"breakInside":44,"columnCount":44,"columnFill":44,"columnGap":44,"columnRule":44,"columnRuleColor":44,"columnRuleStyle":44,"columnRuleWidth":44,"columns":44,"columnSpan":44,"columnWidth":44},"and_chr":{"appearance":46,"userSelect":46,"textEmphasisPosition":46,"textEmphasis":46,"textEmphasisStyle":46,"textEmphasisColor":46,"boxDecorationBreak":46,"clipPath":46,"maskImage":46,"maskMode":46,"maskRepeat":46,"maskPosition":46,"maskClip":46,"maskOrigin":46,"maskSize":46,"maskComposite":46,"mask":46,"maskBorderSource":46,"maskBorderMode":46,"maskBorderSlice":46,"maskBorderWidth":46,"maskBorderOutset":46,"maskBorderRepeat":46,"maskBorder":46,"maskType":46,"textDecorationStyle":46,"textDecorationSkip":46,"textDecorationLine":46,"textDecorationColor":46,"filter":46,"fontFeatureSettings":46,"breakAfter":46,"breakBefore":46,"breakInside":46,"columnCount":46,"columnFill":46,"columnGap":46,"columnRule":46,"columnRuleColor":46,"columnRuleStyle":46,"columnRuleWidth":46,"columns":46,"columnSpan":46,"columnWidth":46},"and_uc":{"flex":9.9,"flexBasis":9.9,"flexDirection":9.9,"flexGrow":9.9,"flexFlow":9.9,"flexShrink":9.9,"flexWrap":9.9,"alignContent":9.9,"alignItems":9.9,"alignSelf":9.9,"justifyContent":9.9,"order":9.9,"transition":9.9,"transitionDelay":9.9,"transitionDuration":9.9,"transitionProperty":9.9,"transitionTimingFunction":9.9,"transform":9.9,"transformOrigin":9.9,"transformOriginX":9.9,"transformOriginY":9.9,"backfaceVisibility":9.9,"perspective":9.9,"perspectiveOrigin":9.9,"transformStyle":9.9,"transformOriginZ":9.9,"animation":9.9,"animationDelay":9.9,"animationDirection":9.9,"animationFillMode":9.9,"animationDuration":9.9,"animationIterationCount":9.9,"animationName":9.9,"animationPlayState":9.9,"animationTimingFunction":9.9,"appearance":9.9,"userSelect":9.9,"fontKerning":9.9,"textEmphasisPosition":9.9,"textEmphasis":9.9,"textEmphasisStyle":9.9,"textEmphasisColor":9.9,"maskImage":9.9,"maskMode":9.9,"maskRepeat":9.9,"maskPosition":9.9,"maskClip":9.9,"maskOrigin":9.9,"maskSize":9.9,"maskComposite":9.9,"mask":9.9,"maskBorderSource":9.9,"maskBorderMode":9.9,"maskBorderSlice":9.9,"maskBorderWidth":9.9,"maskBorderOutset":9.9,"maskBorderRepeat":9.9,"maskBorder":9.9,"maskType":9.9,"textSizeAdjust":9.9,"filter":9.9,"hyphens":9.9,"flowInto":9.9,"flowFrom":9.9,"breakBefore":9.9,"breakAfter":9.9,"breakInside":9.9,"regionFragment":9.9,"fontFeatureSettings":9.9,"columnCount":9.9,"columnFill":9.9,"columnGap":9.9,"columnRule":9.9,"columnRuleColor":9.9,"columnRuleStyle":9.9,"columnRuleWidth":9.9,"columns":9.9,"columnSpan":9.9,"columnWidth":9.9},"op_mini":{"borderImage":5,"borderImageOutset":5,"borderImageRepeat":5,"borderImageSlice":5,"borderImageSource":5,"borderImageWidth":5,"tabSize":5,"objectFit":5,"objectPosition":5}}; module.exports = caniuseData

/***/ },
/* 333 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _bowser = __webpack_require__(341);
	
	var _bowser2 = _interopRequireDefault(_bowser);
	
	var vendorPrefixes = {
	  Webkit: ['chrome', 'safari', 'ios', 'android', 'phantom', 'opera', 'webos', 'blackberry', 'bada', 'tizen'],
	  Moz: ['firefox', 'seamonkey', 'sailfish'],
	  ms: ['msie', 'msedge']
	};
	
	var browsers = {
	  chrome: [['chrome']],
	  safari: [['safari']],
	  firefox: [['firefox']],
	  ie: [['msie'], ['msedge']],
	  opera: [['opera']],
	  ios_saf: [['ios', 'mobile'], ['ios', 'tablet']],
	  ie_mob: [['windowsphone', 'mobile', 'msie'], ['windowsphone', 'tablet', 'msie'], ['windowsphone', 'mobile', 'msedge'], ['windowsphone', 'tablet', 'msedge']],
	  op_mini: [['opera', 'mobile'], ['opera', 'tablet']],
	  and_chr: [['android', 'chrome', 'mobile'], ['android', 'chrome', 'tablet']],
	  and_uc: [['android', 'mobile'], ['android', 'tablet']],
	  android: [['android', 'mobile'], ['android', 'tablet']]
	};
	
	/**
	 * Returns an object containing prefix data associated with a browser
	 * @param {string} browser - browser to find a prefix for
	 */
	var getPrefixes = function getPrefixes(browser) {
	  var prefixKeys = undefined;
	  var prefix = undefined;
	  var vendors = undefined;
	  var conditions = undefined;
	  var prefixVendor = undefined;
	  var browserVendors = undefined;
	
	  // Find the prefix for this browser (if any)
	  prefixKeys = Object.keys(vendorPrefixes);
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;
	
	  try {
	    for (var _iterator = prefixKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      prefix = _step.value;
	
	      // Find a matching vendor
	      vendors = vendorPrefixes[prefix];
	      conditions = browsers[browser];
	      var _iteratorNormalCompletion2 = true;
	      var _didIteratorError2 = false;
	      var _iteratorError2 = undefined;
	
	      try {
	        for (var _iterator2 = vendors[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	          prefixVendor = _step2.value;
	          var _iteratorNormalCompletion3 = true;
	          var _didIteratorError3 = false;
	          var _iteratorError3 = undefined;
	
	          try {
	            for (var _iterator3 = conditions[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	              browserVendors = _step3.value;
	
	              if (browserVendors.indexOf(prefixVendor) !== -1) {
	                return {
	                  inline: prefix,
	                  CSS: '-' + prefix.toLowerCase() + '-'
	                };
	              }
	            }
	          } catch (err) {
	            _didIteratorError3 = true;
	            _iteratorError3 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion3 && _iterator3['return']) {
	                _iterator3['return']();
	              }
	            } finally {
	              if (_didIteratorError3) {
	                throw _iteratorError3;
	              }
	            }
	          }
	        }
	      } catch (err) {
	        _didIteratorError2 = true;
	        _iteratorError2 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
	            _iterator2['return']();
	          }
	        } finally {
	          if (_didIteratorError2) {
	            throw _iteratorError2;
	          }
	        }
	      }
	    }
	
	    // No prefix found for this browser
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator['return']) {
	        _iterator['return']();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }
	
	  return { inline: '', CSS: '' };
	};
	
	/**
	 * Uses bowser to get default browser information such as version and name
	 * Evaluates bowser info and adds vendorPrefix information
	 * @param {string} userAgent - userAgent that gets evaluated
	 */
	
	exports['default'] = function (userAgent) {
	  if (!userAgent) {
	    return false;
	  }
	
	  var info = {};
	
	  // Special user agent, return all supported prefixes
	  // instead of returning a string browser name and a prefix object
	  // we return an array of browser names and map of prefixes for each browser
	  if (userAgent === '*') {
	    // Return an array of supported browsers
	    info.browsers = Object.keys(browsers);
	
	    // Return prefixes associated by browser
	    info.prefixes = {};
	
	    // Iterate browser list, assign prefix to each
	    info.browsers.forEach(function (browser) {
	      info.prefixes[browser] = getPrefixes(browser);
	    });
	
	    return info;
	  }
	
	  // Normal user agent, detect browser
	  info = _bowser2['default']._detect(userAgent);
	
	  Object.keys(vendorPrefixes).forEach(function (prefix) {
	    vendorPrefixes[prefix].forEach(function (browser) {
	      if (info[browser]) {
	        info.prefix = {
	          inline: prefix,
	          CSS: '-' + prefix.toLowerCase() + '-'
	        };
	      }
	    });
	  });
	
	  var name = '';
	  Object.keys(browsers).forEach(function (browser) {
	    browsers[browser].forEach(function (condition) {
	      var match = 0;
	      condition.forEach(function (single) {
	        if (info[single]) {
	          match += 1;
	        }
	      });
	      if (condition.length === match) {
	        name = browser;
	      }
	    });
	  });
	
	  info.browser = name;
	  info.version = parseFloat(info.version);
	  info.osversion = parseFloat(info.osversion);
	
	  // For android < 4.4 we want to check the osversion
	  // not the chrome version, see issue #26
	  // https://github.com/rofrischmann/inline-style-prefixer/issues/26
	  if (name === 'android' && info.osversion < 5) {
	    info.version = info.osversion;
	  }
	
	  return info;
	};
	
	module.exports = exports['default'];

/***/ },
/* 334 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	exports['default'] = function (_ref) {
	  var browser = _ref.browser;
	  var version = _ref.version;
	  var prefix = _ref.prefix;
	
	  var prefixedKeyframes = 'keyframes';
	  if (browser === 'chrome' && version < 43 || (browser === 'safari' || browser === 'ios_saf') && version < 9 || browser === 'opera' && version < 30 || browser === 'android' && version <= 4.4 || browser === 'and_uc') {
	    prefixedKeyframes = prefix.CSS + prefixedKeyframes;
	  }
	  return prefixedKeyframes;
	};
	
	module.exports = exports['default'];

/***/ },
/* 335 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var values = ['zoom-in', 'zoom-out', 'grab', 'grabbing'];
	
	exports['default'] = function (property, value, _ref2) {
	  var browser = _ref2.browser;
	  var version = _ref2.version;
	  var prefix = _ref2.prefix;
	
	  if (property === 'cursor' && values.indexOf(value) > -1 && (browser === 'firefox' && version < 24 || browser === 'chrome' && version < 37 || browser === 'safari' && version < 9 || browser === 'opera' && version < 24)) {
	    return _defineProperty({}, property, prefix.CSS + value);
	  }
	};
	
	module.exports = exports['default'];

/***/ },
/* 336 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var values = ['flex', 'inline-flex'];
	
	exports['default'] = function (property, value, _ref2) {
	  var browser = _ref2.browser;
	  var version = _ref2.version;
	  var prefix = _ref2.prefix;
	
	  if (property === 'display' && values.indexOf(value) > -1 && (browser === 'chrome' && (version < 29 || version > 20) || (browser === 'safari' || browser === 'ios_saf') && (version < 9 || version > 6) || browser === 'opera' && (version == 15 || version == 16))) {
	    return _defineProperty({}, property, prefix.CSS + value);
	  }
	};
	
	module.exports = exports['default'];

/***/ },
/* 337 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var alternativeValues = {
	  'space-around': 'distribute',
	  'space-between': 'justify',
	  'flex-start': 'start',
	  'flex-end': 'end',
	  flex: '-ms-flexbox',
	  'inline-flex': '-ms-inline-flexbox'
	};
	
	var alternativeProps = {
	  alignContent: 'msFlexLinePack',
	  alignSelf: 'msFlexItemAlign',
	  alignItems: 'msFlexAlign',
	  justifyContent: 'msFlexPack',
	  order: 'msFlexOrder',
	  flexGrow: 'msFlexPositive',
	  flexShrink: 'msFlexNegative',
	  flexBasis: 'msPreferredSize'
	};
	
	var properties = Object.keys(alternativeProps).concat('display');
	
	exports['default'] = function (property, value, _ref2, styles) {
	  var browser = _ref2.browser;
	  var version = _ref2.version;
	
	  if (properties.indexOf(property) > -1 && (browser === 'ie_mob' || browser === 'ie') && version == 10) {
	    delete styles[property];
	    return _defineProperty({}, alternativeProps[property] || property, alternativeValues[value] || value);
	  }
	};
	
	module.exports = exports['default'];

/***/ },
/* 338 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var alternativeValues = {
	  'space-around': 'justify',
	  'space-between': 'justify',
	  'flex-start': 'start',
	  'flex-end': 'end',
	  'wrap-reverse': 'multiple',
	  wrap: 'multiple',
	  flex: 'box',
	  'inline-flex': 'inline-box'
	};
	
	var alternativeProps = {
	  alignItems: 'WebkitBoxAlign',
	  justifyContent: 'WebkitBoxPack',
	  flexWrap: 'WebkitBoxLines'
	};
	
	var properties = Object.keys(alternativeProps).concat(['alignContent', 'alignSelf', 'display', 'order', 'flexGrow', 'flexShrink', 'flexBasis', 'flexDirection']);
	
	exports['default'] = function (property, value, _ref2) {
	  var browser = _ref2.browser;
	  var version = _ref2.version;
	  var prefix = _ref2.prefix;
	
	  if (properties.indexOf(property) > -1 && (browser === 'firefox' && version < 22 || browser === 'chrome' && version < 21 || (browser === 'safari' || browser === 'ios_saf') && version <= 6.1 || browser === 'android' && version < 4.4 || browser === 'and_uc')) {
	    if (property === 'flexDirection') {
	      return {
	        WebkitBoxOrient: value.indexOf('column') > -1 ? 'vertical' : 'horizontal',
	        WebkitBoxDirection: value.indexOf('reverse') > -1 ? 'reverse' : 'normal'
	      };
	    }
	    if (property === 'display' && alternativeValues[value]) {
	      return { display: prefix.CSS + alternativeValues[value] };
	    }
	    return _defineProperty({}, alternativeProps[property] || property, alternativeValues[value] || value);
	  }
	};
	
	module.exports = exports['default'];

/***/ },
/* 339 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var properties = ['background', 'backgroundImage'];
	var values = ['linear-gradient', 'radial-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient'];
	
	exports['default'] = function (property, value, _ref2) {
	  var browser = _ref2.browser;
	  var version = _ref2.version;
	  var prefix = _ref2.prefix;
	
	  if (properties.indexOf(property) > -1 && values.indexOf(value) > -1 && (browser === 'firefox' && version < 16 || browser === 'chrome' && version < 26 || (browser === 'safari' || browser === 'ios_saf') && version < 7 || (browser === 'opera' || browser === 'op_mini') && version < 12.1 || browser === 'android' && version < 4.4 || browser === 'and_uc')) {
	    return _defineProperty({}, property, prefix.CSS + value);
	  }
	};
	
	module.exports = exports['default'];

/***/ },
/* 340 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	var properties = ['maxHeight', 'maxWidth', 'width', 'height', 'columnWidth', 'minWidth', 'minHeight'];
	var values = ['min-content', 'max-content', 'fill-available', 'fit-content', 'contain-floats'];
	
	exports['default'] = function (property, value, _ref2) {
	  var prefix = _ref2.prefix;
	
	  /**
	   * This actually is only available with prefixes
	   * NOTE: This might change in the feature
	   */
	  if (properties.indexOf(property) > -1 && values.indexOf(value) > -1) {
	    return _defineProperty({}, property, prefix.CSS + value);
	  }
	};
	
	module.exports = exports['default'];

/***/ },
/* 341 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	  * Bowser - a browser detector
	  * https://github.com/ded/bowser
	  * MIT License | (c) Dustin Diaz 2015
	  */
	
	!function (name, definition) {
	  if (typeof module != 'undefined' && module.exports) module.exports = definition()
	  else if (true) !(__WEBPACK_AMD_DEFINE_FACTORY__ = (definition), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else this[name] = definition()
	}('bowser', function () {
	  /**
	    * See useragents.js for examples of navigator.userAgent
	    */
	
	  var t = true
	
	  function detect(ua) {
	
	    function getFirstMatch(regex) {
	      var match = ua.match(regex);
	      return (match && match.length > 1 && match[1]) || '';
	    }
	
	    function getSecondMatch(regex) {
	      var match = ua.match(regex);
	      return (match && match.length > 1 && match[2]) || '';
	    }
	
	    var iosdevice = getFirstMatch(/(ipod|iphone|ipad)/i).toLowerCase()
	      , likeAndroid = /like android/i.test(ua)
	      , android = !likeAndroid && /android/i.test(ua)
	      , chromeBook = /CrOS/.test(ua)
	      , edgeVersion = getFirstMatch(/edge\/(\d+(\.\d+)?)/i)
	      , versionIdentifier = getFirstMatch(/version\/(\d+(\.\d+)?)/i)
	      , tablet = /tablet/i.test(ua)
	      , mobile = !tablet && /[^-]mobi/i.test(ua)
	      , result
	
	    if (/opera|opr/i.test(ua)) {
	      result = {
	        name: 'Opera'
	      , opera: t
	      , version: versionIdentifier || getFirstMatch(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)
	      }
	    }
	    else if (/yabrowser/i.test(ua)) {
	      result = {
	        name: 'Yandex Browser'
	      , yandexbrowser: t
	      , version: versionIdentifier || getFirstMatch(/(?:yabrowser)[\s\/](\d+(\.\d+)?)/i)
	      }
	    }
	    else if (/windows phone/i.test(ua)) {
	      result = {
	        name: 'Windows Phone'
	      , windowsphone: t
	      }
	      if (edgeVersion) {
	        result.msedge = t
	        result.version = edgeVersion
	      }
	      else {
	        result.msie = t
	        result.version = getFirstMatch(/iemobile\/(\d+(\.\d+)?)/i)
	      }
	    }
	    else if (/msie|trident/i.test(ua)) {
	      result = {
	        name: 'Internet Explorer'
	      , msie: t
	      , version: getFirstMatch(/(?:msie |rv:)(\d+(\.\d+)?)/i)
	      }
	    } else if (chromeBook) {
	      result = {
	        name: 'Chrome'
	      , chromeBook: t
	      , chrome: t
	      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
	      }
	    } else if (/chrome.+? edge/i.test(ua)) {
	      result = {
	        name: 'Microsoft Edge'
	      , msedge: t
	      , version: edgeVersion
	      }
	    }
	    else if (/chrome|crios|crmo/i.test(ua)) {
	      result = {
	        name: 'Chrome'
	      , chrome: t
	      , version: getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)
	      }
	    }
	    else if (iosdevice) {
	      result = {
	        name : iosdevice == 'iphone' ? 'iPhone' : iosdevice == 'ipad' ? 'iPad' : 'iPod'
	      }
	      // WTF: version is not part of user agent in web apps
	      if (versionIdentifier) {
	        result.version = versionIdentifier
	      }
	    }
	    else if (/sailfish/i.test(ua)) {
	      result = {
	        name: 'Sailfish'
	      , sailfish: t
	      , version: getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i)
	      }
	    }
	    else if (/seamonkey\//i.test(ua)) {
	      result = {
	        name: 'SeaMonkey'
	      , seamonkey: t
	      , version: getFirstMatch(/seamonkey\/(\d+(\.\d+)?)/i)
	      }
	    }
	    else if (/firefox|iceweasel/i.test(ua)) {
	      result = {
	        name: 'Firefox'
	      , firefox: t
	      , version: getFirstMatch(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)
	      }
	      if (/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(ua)) {
	        result.firefoxos = t
	      }
	    }
	    else if (/silk/i.test(ua)) {
	      result =  {
	        name: 'Amazon Silk'
	      , silk: t
	      , version : getFirstMatch(/silk\/(\d+(\.\d+)?)/i)
	      }
	    }
	    else if (android) {
	      result = {
	        name: 'Android'
	      , version: versionIdentifier
	      }
	    }
	    else if (/phantom/i.test(ua)) {
	      result = {
	        name: 'PhantomJS'
	      , phantom: t
	      , version: getFirstMatch(/phantomjs\/(\d+(\.\d+)?)/i)
	      }
	    }
	    else if (/blackberry|\bbb\d+/i.test(ua) || /rim\stablet/i.test(ua)) {
	      result = {
	        name: 'BlackBerry'
	      , blackberry: t
	      , version: versionIdentifier || getFirstMatch(/blackberry[\d]+\/(\d+(\.\d+)?)/i)
	      }
	    }
	    else if (/(web|hpw)os/i.test(ua)) {
	      result = {
	        name: 'WebOS'
	      , webos: t
	      , version: versionIdentifier || getFirstMatch(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)
	      };
	      /touchpad\//i.test(ua) && (result.touchpad = t)
	    }
	    else if (/bada/i.test(ua)) {
	      result = {
	        name: 'Bada'
	      , bada: t
	      , version: getFirstMatch(/dolfin\/(\d+(\.\d+)?)/i)
	      };
	    }
	    else if (/tizen/i.test(ua)) {
	      result = {
	        name: 'Tizen'
	      , tizen: t
	      , version: getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i) || versionIdentifier
	      };
	    }
	    else if (/safari/i.test(ua)) {
	      result = {
	        name: 'Safari'
	      , safari: t
	      , version: versionIdentifier
	      }
	    }
	    else {
	      result = {
	        name: getFirstMatch(/^(.*)\/(.*) /),
	        version: getSecondMatch(/^(.*)\/(.*) /)
	     };
	   }
	
	    // set webkit or gecko flag for browsers based on these engines
	    if (!result.msedge && /(apple)?webkit/i.test(ua)) {
	      result.name = result.name || "Webkit"
	      result.webkit = t
	      if (!result.version && versionIdentifier) {
	        result.version = versionIdentifier
	      }
	    } else if (!result.opera && /gecko\//i.test(ua)) {
	      result.name = result.name || "Gecko"
	      result.gecko = t
	      result.version = result.version || getFirstMatch(/gecko\/(\d+(\.\d+)?)/i)
	    }
	
	    // set OS flags for platforms that have multiple browsers
	    if (!result.msedge && (android || result.silk)) {
	      result.android = t
	    } else if (iosdevice) {
	      result[iosdevice] = t
	      result.ios = t
	    }
	
	    // OS version extraction
	    var osVersion = '';
	    if (result.windowsphone) {
	      osVersion = getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i);
	    } else if (iosdevice) {
	      osVersion = getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i);
	      osVersion = osVersion.replace(/[_\s]/g, '.');
	    } else if (android) {
	      osVersion = getFirstMatch(/android[ \/-](\d+(\.\d+)*)/i);
	    } else if (result.webos) {
	      osVersion = getFirstMatch(/(?:web|hpw)os\/(\d+(\.\d+)*)/i);
	    } else if (result.blackberry) {
	      osVersion = getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i);
	    } else if (result.bada) {
	      osVersion = getFirstMatch(/bada\/(\d+(\.\d+)*)/i);
	    } else if (result.tizen) {
	      osVersion = getFirstMatch(/tizen[\/\s](\d+(\.\d+)*)/i);
	    }
	    if (osVersion) {
	      result.osversion = osVersion;
	    }
	
	    // device type extraction
	    var osMajorVersion = osVersion.split('.')[0];
	    if (tablet || iosdevice == 'ipad' || (android && (osMajorVersion == 3 || (osMajorVersion == 4 && !mobile))) || result.silk) {
	      result.tablet = t
	    } else if (mobile || iosdevice == 'iphone' || iosdevice == 'ipod' || android || result.blackberry || result.webos || result.bada) {
	      result.mobile = t
	    }
	
	    // Graded Browser Support
	    // http://developer.yahoo.com/yui/articles/gbs
	    if (result.msedge ||
	        (result.msie && result.version >= 10) ||
	        (result.yandexbrowser && result.version >= 15) ||
	        (result.chrome && result.version >= 20) ||
	        (result.firefox && result.version >= 20.0) ||
	        (result.safari && result.version >= 6) ||
	        (result.opera && result.version >= 10.0) ||
	        (result.ios && result.osversion && result.osversion.split(".")[0] >= 6) ||
	        (result.blackberry && result.version >= 10.1)
	        ) {
	      result.a = t;
	    }
	    else if ((result.msie && result.version < 10) ||
	        (result.chrome && result.version < 20) ||
	        (result.firefox && result.version < 20.0) ||
	        (result.safari && result.version < 6) ||
	        (result.opera && result.version < 10.0) ||
	        (result.ios && result.osversion && result.osversion.split(".")[0] < 6)
	        ) {
	      result.c = t
	    } else result.x = t
	
	    return result
	  }
	
	  var bowser = detect(typeof navigator !== 'undefined' ? navigator.userAgent : '')
	
	  bowser.test = function (browserList) {
	    for (var i = 0; i < browserList.length; ++i) {
	      var browserItem = browserList[i];
	      if (typeof browserItem=== 'string') {
	        if (browserItem in bowser) {
	          return true;
	        }
	      }
	    }
	    return false;
	  }
	
	  /*
	   * Set our detect method to the main bowser object so we can
	   * reuse it to test other user agents.
	   * This is needed to implement future tests.
	   */
	  bowser._detect = detect;
	
	  return bowser
	});


/***/ },
/* 342 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.3.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var arrayCopy = __webpack_require__(343),
	    arrayEach = __webpack_require__(344),
	    createAssigner = __webpack_require__(345),
	    isArguments = __webpack_require__(72),
	    isArray = __webpack_require__(104),
	    isPlainObject = __webpack_require__(350),
	    isTypedArray = __webpack_require__(352),
	    keys = __webpack_require__(353),
	    toPlainObject = __webpack_require__(354);
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * The base implementation of `_.merge` without support for argument juggling,
	 * multiple sources, and `this` binding `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Array} [stackA=[]] Tracks traversed source objects.
	 * @param {Array} [stackB=[]] Associates values with source counterparts.
	 * @returns {Object} Returns `object`.
	 */
	function baseMerge(object, source, customizer, stackA, stackB) {
	  if (!isObject(object)) {
	    return object;
	  }
	  var isSrcArr = isArrayLike(source) && (isArray(source) || isTypedArray(source)),
	      props = isSrcArr ? undefined : keys(source);
	
	  arrayEach(props || source, function(srcValue, key) {
	    if (props) {
	      key = srcValue;
	      srcValue = source[key];
	    }
	    if (isObjectLike(srcValue)) {
	      stackA || (stackA = []);
	      stackB || (stackB = []);
	      baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
	    }
	    else {
	      var value = object[key],
	          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	          isCommon = result === undefined;
	
	      if (isCommon) {
	        result = srcValue;
	      }
	      if ((result !== undefined || (isSrcArr && !(key in object))) &&
	          (isCommon || (result === result ? (result !== value) : (value === value)))) {
	        object[key] = result;
	      }
	    }
	  });
	  return object;
	}
	
	/**
	 * A specialized version of `baseMerge` for arrays and objects which performs
	 * deep merges and tracks traversed objects enabling objects with circular
	 * references to be merged.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @param {string} key The key of the value to merge.
	 * @param {Function} mergeFunc The function to merge values.
	 * @param {Function} [customizer] The function to customize merged values.
	 * @param {Array} [stackA=[]] Tracks traversed source objects.
	 * @param {Array} [stackB=[]] Associates values with source counterparts.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
	  var length = stackA.length,
	      srcValue = source[key];
	
	  while (length--) {
	    if (stackA[length] == srcValue) {
	      object[key] = stackB[length];
	      return;
	    }
	  }
	  var value = object[key],
	      result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
	      isCommon = result === undefined;
	
	  if (isCommon) {
	    result = srcValue;
	    if (isArrayLike(srcValue) && (isArray(srcValue) || isTypedArray(srcValue))) {
	      result = isArray(value)
	        ? value
	        : (isArrayLike(value) ? arrayCopy(value) : []);
	    }
	    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
	      result = isArguments(value)
	        ? toPlainObject(value)
	        : (isPlainObject(value) ? value : {});
	    }
	    else {
	      isCommon = false;
	    }
	  }
	  // Add the source value to the stack of traversed objects and associate
	  // it with its merged value.
	  stackA.push(srcValue);
	  stackB.push(result);
	
	  if (isCommon) {
	    // Recursively merge objects and arrays (susceptible to call stack limits).
	    object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
	  } else if (result === result ? (result !== value) : (value === value)) {
	    object[key] = result;
	  }
	}
	
	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Recursively merges own enumerable properties of the source object(s), that
	 * don't resolve to `undefined` into the destination object. Subsequent sources
	 * overwrite property assignments of previous sources. If `customizer` is
	 * provided it is invoked to produce the merged values of the destination and
	 * source properties. If `customizer` returns `undefined` merging is handled
	 * by the method instead. The `customizer` is bound to `thisArg` and invoked
	 * with five arguments: (objectValue, sourceValue, key, object, source).
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The destination object.
	 * @param {...Object} [sources] The source objects.
	 * @param {Function} [customizer] The function to customize assigned values.
	 * @param {*} [thisArg] The `this` binding of `customizer`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * var users = {
	 *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
	 * };
	 *
	 * var ages = {
	 *   'data': [{ 'age': 36 }, { 'age': 40 }]
	 * };
	 *
	 * _.merge(users, ages);
	 * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
	 *
	 * // using a customizer callback
	 * var object = {
	 *   'fruits': ['apple'],
	 *   'vegetables': ['beet']
	 * };
	 *
	 * var other = {
	 *   'fruits': ['banana'],
	 *   'vegetables': ['carrot']
	 * };
	 *
	 * _.merge(object, other, function(a, b) {
	 *   if (_.isArray(a)) {
	 *     return a.concat(b);
	 *   }
	 * });
	 * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
	 */
	var merge = createAssigner(baseMerge);
	
	module.exports = merge;


/***/ },
/* 343 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * Copies the values of `source` to `array`.
	 *
	 * @private
	 * @param {Array} source The array to copy values from.
	 * @param {Array} [array=[]] The array to copy values to.
	 * @returns {Array} Returns `array`.
	 */
	function arrayCopy(source, array) {
	  var index = -1,
	      length = source.length;
	
	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}
	
	module.exports = arrayCopy;


/***/ },
/* 344 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * A specialized version of `_.forEach` for arrays without support for callback
	 * shorthands or `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Array} Returns `array`.
	 */
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}
	
	module.exports = arrayEach;


/***/ },
/* 345 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var bindCallback = __webpack_require__(346),
	    isIterateeCall = __webpack_require__(347),
	    restParam = __webpack_require__(348);
	
	/**
	 * Creates a function that assigns properties of source object(s) to a given
	 * destination object.
	 *
	 * **Note:** This function is used to create `_.assign`, `_.defaults`, and `_.merge`.
	 *
	 * @private
	 * @param {Function} assigner The function to assign values.
	 * @returns {Function} Returns the new assigner function.
	 */
	function createAssigner(assigner) {
	  return restParam(function(object, sources) {
	    var index = -1,
	        length = object == null ? 0 : sources.length,
	        customizer = length > 2 ? sources[length - 2] : undefined,
	        guard = length > 2 ? sources[2] : undefined,
	        thisArg = length > 1 ? sources[length - 1] : undefined;
	
	    if (typeof customizer == 'function') {
	      customizer = bindCallback(customizer, thisArg, 5);
	      length -= 2;
	    } else {
	      customizer = typeof thisArg == 'function' ? thisArg : undefined;
	      length -= (customizer ? 1 : 0);
	    }
	    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
	      customizer = length < 3 ? undefined : customizer;
	      length = 1;
	    }
	    while (++index < length) {
	      var source = sources[index];
	      if (source) {
	        assigner(object, source, customizer);
	      }
	    }
	    return object;
	  });
	}
	
	module.exports = createAssigner;


/***/ },
/* 346 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}
	
	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}
	
	module.exports = bindCallback;


/***/ },
/* 347 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.9 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	/**
	 * Checks if the provided arguments are from an iteratee call.
	 *
	 * @private
	 * @param {*} value The potential iteratee value argument.
	 * @param {*} index The potential iteratee index or key argument.
	 * @param {*} object The potential iteratee object argument.
	 * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	 */
	function isIterateeCall(value, index, object) {
	  if (!isObject(object)) {
	    return false;
	  }
	  var type = typeof index;
	  if (type == 'number'
	      ? (isArrayLike(object) && isIndex(index, object.length))
	      : (type == 'string' && index in object)) {
	    var other = object[index];
	    return value === value ? (value === other) : (other !== other);
	  }
	  return false;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isIterateeCall;


/***/ },
/* 348 */
/***/ function(module, exports) {

	/**
	 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);
	
	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}
	
	module.exports = restParam;


/***/ },
/* 349 */
/***/ function(module, exports) {

	/**
	 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = getNative;


/***/ },
/* 350 */
[673, 351, 72, 171],
/* 351 */
464,
/* 352 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Used as the [maximum length](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}
	
	module.exports = isTypedArray;


/***/ },
/* 353 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(349),
	    isArguments = __webpack_require__(72),
	    isArray = __webpack_require__(104);
	
	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');
	
	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;
	
	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}
	
	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}
	
	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
	
	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;
	
	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));
	
	  var index = -1,
	      result = [];
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keys;


/***/ },
/* 354 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.0.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseCopy = __webpack_require__(355),
	    keysIn = __webpack_require__(171);
	
	/**
	 * Converts `value` to a plain object flattening inherited enumerable
	 * properties of `value` to own properties of the plain object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {Object} Returns the converted plain object.
	 * @example
	 *
	 * function Foo() {
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.assign({ 'a': 1 }, new Foo);
	 * // => { 'a': 1, 'b': 2 }
	 *
	 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
	 * // => { 'a': 1, 'b': 2, 'c': 3 }
	 */
	function toPlainObject(value) {
	  return baseCopy(value, keysIn(value));
	}
	
	module.exports = toPlainObject;


/***/ },
/* 355 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property names to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @returns {Object} Returns `object`.
	 */
	function baseCopy(source, props, object) {
	  object || (object = {});
	
	  var index = -1,
	      length = props.length;
	
	  while (++index < length) {
	    var key = props[index];
	    object[key] = source[key];
	  }
	  return object;
	}
	
	module.exports = baseCopy;


/***/ },
/* 356 */
46,
/* 357 */,
/* 358 */,
/* 359 */,
/* 360 */,
/* 361 */,
/* 362 */,
/* 363 */,
/* 364 */,
/* 365 */,
/* 366 */,
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */,
/* 371 */,
/* 372 */,
/* 373 */,
/* 374 */,
/* 375 */,
/* 376 */,
/* 377 */,
/* 378 */,
/* 379 */
25,
/* 380 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TapEventPlugin
	 * @typechecks static-only
	 */
	
	"use strict";
	
	var EventConstants = __webpack_require__(15);
	var EventPluginUtils = __webpack_require__(180);
	var EventPropagators = __webpack_require__(50);
	var SyntheticUIEvent = __webpack_require__(52);
	var TouchEventUtils = __webpack_require__(381);
	var ViewportMetrics = __webpack_require__(116);
	
	var keyOf = __webpack_require__(379);
	var topLevelTypes = EventConstants.topLevelTypes;
	
	var isStartish = EventPluginUtils.isStartish;
	var isEndish = EventPluginUtils.isEndish;
	
	var isTouch = function(topLevelType) {
	  var touchTypes = [
	    topLevelTypes.topTouchCancel,
	    topLevelTypes.topTouchEnd,
	    topLevelTypes.topTouchStart,
	    topLevelTypes.topTouchMove
	  ];
	  return touchTypes.indexOf(topLevelType) >= 0;
	}
	
	/**
	 * Number of pixels that are tolerated in between a `touchStart` and `touchEnd`
	 * in order to still be considered a 'tap' event.
	 */
	var tapMoveThreshold = 10;
	var ignoreMouseThreshold = 750;
	var startCoords = {x: null, y: null};
	var lastTouchEvent = null;
	
	var Axis = {
	  x: {page: 'pageX', client: 'clientX', envScroll: 'currentPageScrollLeft'},
	  y: {page: 'pageY', client: 'clientY', envScroll: 'currentPageScrollTop'}
	};
	
	function getAxisCoordOfEvent(axis, nativeEvent) {
	  var singleTouch = TouchEventUtils.extractSingleTouch(nativeEvent);
	  if (singleTouch) {
	    return singleTouch[axis.page];
	  }
	  return axis.page in nativeEvent ?
	    nativeEvent[axis.page] :
	    nativeEvent[axis.client] + ViewportMetrics[axis.envScroll];
	}
	
	function getDistance(coords, nativeEvent) {
	  var pageX = getAxisCoordOfEvent(Axis.x, nativeEvent);
	  var pageY = getAxisCoordOfEvent(Axis.y, nativeEvent);
	  return Math.pow(
	    Math.pow(pageX - coords.x, 2) + Math.pow(pageY - coords.y, 2),
	    0.5
	  );
	}
	
	var touchEvents = [
	  topLevelTypes.topTouchStart,
	  topLevelTypes.topTouchCancel,
	  topLevelTypes.topTouchEnd,
	  topLevelTypes.topTouchMove,
	];
	
	var dependencies = [
	  topLevelTypes.topMouseDown,
	  topLevelTypes.topMouseMove,
	  topLevelTypes.topMouseUp,
	].concat(touchEvents);
	
	var eventTypes = {
	  touchTap: {
	    phasedRegistrationNames: {
	      bubbled: keyOf({onTouchTap: null}),
	      captured: keyOf({onTouchTapCapture: null})
	    },
	    dependencies: dependencies
	  }
	};
	
	var now = (function() {
	  if (Date.now) {
	    return Date.now;
	  } else {
	    // IE8 support: http://stackoverflow.com/questions/9430357/please-explain-why-and-how-new-date-works-as-workaround-for-date-now-in
	    return function () {
	      return +new Date;
	    }
	  }
	})();
	
	var TapEventPlugin = {
	
	  tapMoveThreshold: tapMoveThreshold,
	
	  ignoreMouseThreshold: ignoreMouseThreshold,
	
	  eventTypes: eventTypes,
	
	  /**
	   * @param {string} topLevelType Record from `EventConstants`.
	   * @param {DOMEventTarget} topLevelTarget The listening component root node.
	   * @param {string} topLevelTargetID ID of `topLevelTarget`.
	   * @param {object} nativeEvent Native browser event.
	   * @return {*} An accumulation of synthetic events.
	   * @see {EventPluginHub.extractEvents}
	   */
	  extractEvents: function(
	      topLevelType,
	      topLevelTarget,
	      topLevelTargetID,
	      nativeEvent,
	      nativeEventTarget) {
	
	    if (isTouch(topLevelType)) {
	      lastTouchEvent = now();
	    } else {
	      if (lastTouchEvent && (now() - lastTouchEvent) < ignoreMouseThreshold) {
	        return null;
	      }
	    }
	
	    if (!isStartish(topLevelType) && !isEndish(topLevelType)) {
	      return null;
	    }
	    var event = null;
	    var distance = getDistance(startCoords, nativeEvent);
	    if (isEndish(topLevelType) && distance < tapMoveThreshold) {
	      event = SyntheticUIEvent.getPooled(
	        eventTypes.touchTap,
	        topLevelTargetID,
	        nativeEvent,
	        nativeEventTarget
	      );
	    }
	    if (isStartish(topLevelType)) {
	      startCoords.x = getAxisCoordOfEvent(Axis.x, nativeEvent);
	      startCoords.y = getAxisCoordOfEvent(Axis.y, nativeEvent);
	    } else if (isEndish(topLevelType)) {
	      startCoords.x = 0;
	      startCoords.y = 0;
	    }
	    EventPropagators.accumulateTwoPhaseDispatches(event);
	    return event;
	  }
	
	};
	
	module.exports = TapEventPlugin;


/***/ },
/* 381 */
/***/ function(module, exports) {

	/**
	 * Copyright 2013-2014 Facebook, Inc.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 * @providesModule TouchEventUtils
	 */
	
	var TouchEventUtils = {
	  /**
	   * Utility function for common case of extracting out the primary touch from a
	   * touch event.
	   * - `touchEnd` events usually do not have the `touches` property.
	   *   http://stackoverflow.com/questions/3666929/
	   *   mobile-sarai-touchend-event-not-firing-when-last-touch-is-removed
	   *
	   * @param {Event} nativeEvent Native event that may or may not be a touch.
	   * @return {TouchesObject?} an object with pageX and pageY or null.
	   */
	  extractSingleTouch: function(nativeEvent) {
	    var touches = nativeEvent.touches;
	    var changedTouches = nativeEvent.changedTouches;
	    var hasTouches = touches && touches.length > 0;
	    var hasChangedTouches = changedTouches && changedTouches.length > 0;
	
	    return !hasTouches && hasChangedTouches ? changedTouches[0] :
	           hasTouches ? touches[0] :
	           nativeEvent;
	  }
	};
	
	module.exports = TouchEventUtils;


/***/ },
/* 382 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function injectTapEventPlugin () {
	  __webpack_require__(49).injection.injectEventPluginsByName({
	    "TapEventPlugin":       __webpack_require__(380)
	  });
	};


/***/ },
/* 383 */,
/* 384 */,
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */,
/* 390 */,
/* 391 */,
/* 392 */,
/* 393 */,
/* 394 */,
/* 395 */,
/* 396 */,
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */,
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */,
/* 408 */,
/* 409 */,
/* 410 */,
/* 411 */,
/* 412 */,
/* 413 */,
/* 414 */,
/* 415 */,
/* 416 */,
/* 417 */,
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */,
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */,
/* 427 */,
/* 428 */,
/* 429 */,
/* 430 */,
/* 431 */,
/* 432 */,
/* 433 */,
/* 434 */,
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule update
	 */
	
	/* global hasOwnProperty:true */
	
	'use strict';
	
	var assign = __webpack_require__(3);
	var keyOf = __webpack_require__(25);
	var invariant = __webpack_require__(2);
	var hasOwnProperty = ({}).hasOwnProperty;
	
	function shallowCopy(x) {
	  if (Array.isArray(x)) {
	    return x.concat();
	  } else if (x && typeof x === 'object') {
	    return assign(new x.constructor(), x);
	  } else {
	    return x;
	  }
	}
	
	var COMMAND_PUSH = keyOf({ $push: null });
	var COMMAND_UNSHIFT = keyOf({ $unshift: null });
	var COMMAND_SPLICE = keyOf({ $splice: null });
	var COMMAND_SET = keyOf({ $set: null });
	var COMMAND_MERGE = keyOf({ $merge: null });
	var COMMAND_APPLY = keyOf({ $apply: null });
	
	var ALL_COMMANDS_LIST = [COMMAND_PUSH, COMMAND_UNSHIFT, COMMAND_SPLICE, COMMAND_SET, COMMAND_MERGE, COMMAND_APPLY];
	
	var ALL_COMMANDS_SET = {};
	
	ALL_COMMANDS_LIST.forEach(function (command) {
	  ALL_COMMANDS_SET[command] = true;
	});
	
	function invariantArrayCase(value, spec, command) {
	  !Array.isArray(value) ?  true ? invariant(false, 'update(): expected target of %s to be an array; got %s.', command, value) : invariant(false) : undefined;
	  var specValue = spec[command];
	  !Array.isArray(specValue) ?  true ? invariant(false, 'update(): expected spec of %s to be an array; got %s. ' + 'Did you forget to wrap your parameter in an array?', command, specValue) : invariant(false) : undefined;
	}
	
	function update(value, spec) {
	  !(typeof spec === 'object') ?  true ? invariant(false, 'update(): You provided a key path to update() that did not contain one ' + 'of %s. Did you forget to include {%s: ...}?', ALL_COMMANDS_LIST.join(', '), COMMAND_SET) : invariant(false) : undefined;
	
	  if (hasOwnProperty.call(spec, COMMAND_SET)) {
	    !(Object.keys(spec).length === 1) ?  true ? invariant(false, 'Cannot have more than one key in an object with %s', COMMAND_SET) : invariant(false) : undefined;
	
	    return spec[COMMAND_SET];
	  }
	
	  var nextValue = shallowCopy(value);
	
	  if (hasOwnProperty.call(spec, COMMAND_MERGE)) {
	    var mergeObj = spec[COMMAND_MERGE];
	    !(mergeObj && typeof mergeObj === 'object') ?  true ? invariant(false, 'update(): %s expects a spec of type \'object\'; got %s', COMMAND_MERGE, mergeObj) : invariant(false) : undefined;
	    !(nextValue && typeof nextValue === 'object') ?  true ? invariant(false, 'update(): %s expects a target of type \'object\'; got %s', COMMAND_MERGE, nextValue) : invariant(false) : undefined;
	    assign(nextValue, spec[COMMAND_MERGE]);
	  }
	
	  if (hasOwnProperty.call(spec, COMMAND_PUSH)) {
	    invariantArrayCase(value, spec, COMMAND_PUSH);
	    spec[COMMAND_PUSH].forEach(function (item) {
	      nextValue.push(item);
	    });
	  }
	
	  if (hasOwnProperty.call(spec, COMMAND_UNSHIFT)) {
	    invariantArrayCase(value, spec, COMMAND_UNSHIFT);
	    spec[COMMAND_UNSHIFT].forEach(function (item) {
	      nextValue.unshift(item);
	    });
	  }
	
	  if (hasOwnProperty.call(spec, COMMAND_SPLICE)) {
	    !Array.isArray(value) ?  true ? invariant(false, 'Expected %s target to be an array; got %s', COMMAND_SPLICE, value) : invariant(false) : undefined;
	    !Array.isArray(spec[COMMAND_SPLICE]) ?  true ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. ' + 'Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : invariant(false) : undefined;
	    spec[COMMAND_SPLICE].forEach(function (args) {
	      !Array.isArray(args) ?  true ? invariant(false, 'update(): expected spec of %s to be an array of arrays; got %s. ' + 'Did you forget to wrap your parameters in an array?', COMMAND_SPLICE, spec[COMMAND_SPLICE]) : invariant(false) : undefined;
	      nextValue.splice.apply(nextValue, args);
	    });
	  }
	
	  if (hasOwnProperty.call(spec, COMMAND_APPLY)) {
	    !(typeof spec[COMMAND_APPLY] === 'function') ?  true ? invariant(false, 'update(): expected spec of %s to be a function; got %s.', COMMAND_APPLY, spec[COMMAND_APPLY]) : invariant(false) : undefined;
	    nextValue = spec[COMMAND_APPLY](nextValue);
	  }
	
	  for (var k in spec) {
	    if (!(ALL_COMMANDS_SET.hasOwnProperty(k) && ALL_COMMANDS_SET[k])) {
	      nextValue[k] = update(value[k], spec[k]);
	    }
	  }
	
	  return nextValue;
	}
	
	module.exports = update;

/***/ },
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */,
/* 447 */,
/* 448 */,
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var filenameWithoutLoaders = function filenameWithoutLoaders(filename) {
	  var index = filename.lastIndexOf('!');
	
	  return index < 0 ? filename : filename.substr(index + 1);
	};
	
	var _filenameWithoutLoaders = filenameWithoutLoaders;
	
	__$Getters__['filenameWithoutLoaders'] = function () {
	  return filenameWithoutLoaders;
	};
	
	__$Setters__['filenameWithoutLoaders'] = function (value) {
	  exports.filenameWithoutLoaders = filenameWithoutLoaders = value;
	};
	
	__$Resetters__['filenameWithoutLoaders'] = function () {
	  exports.filenameWithoutLoaders = filenameWithoutLoaders = _filenameWithoutLoaders;
	};
	
	exports.filenameWithoutLoaders = _filenameWithoutLoaders;
	var filenameHasLoaders = function filenameHasLoaders(filename) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  return actualFilename !== filename;
	};
	
	var _filenameHasLoaders = filenameHasLoaders;
	
	__$Getters__['filenameHasLoaders'] = function () {
	  return filenameHasLoaders;
	};
	
	__$Setters__['filenameHasLoaders'] = function (value) {
	  exports.filenameHasLoaders = filenameHasLoaders = value;
	};
	
	__$Resetters__['filenameHasLoaders'] = function () {
	  exports.filenameHasLoaders = filenameHasLoaders = _filenameHasLoaders;
	};
	
	exports.filenameHasLoaders = _filenameHasLoaders;
	var filenameHasSchema = function filenameHasSchema(filename) {
	  return /^[\w]+\:/.test(filename);
	};
	
	var _filenameHasSchema = filenameHasSchema;
	
	__$Getters__['filenameHasSchema'] = function () {
	  return filenameHasSchema;
	};
	
	__$Setters__['filenameHasSchema'] = function (value) {
	  exports.filenameHasSchema = filenameHasSchema = value;
	};
	
	__$Resetters__['filenameHasSchema'] = function () {
	  exports.filenameHasSchema = filenameHasSchema = _filenameHasSchema;
	};
	
	exports.filenameHasSchema = _filenameHasSchema;
	var isFilenameAbsolute = function isFilenameAbsolute(filename) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  if (actualFilename.indexOf('/') === 0) {
	    return true;
	  }
	
	  return false;
	};
	
	var _isFilenameAbsolute = isFilenameAbsolute;
	
	__$Getters__['isFilenameAbsolute'] = function () {
	  return isFilenameAbsolute;
	};
	
	__$Setters__['isFilenameAbsolute'] = function (value) {
	  exports.isFilenameAbsolute = isFilenameAbsolute = value;
	};
	
	__$Resetters__['isFilenameAbsolute'] = function () {
	  exports.isFilenameAbsolute = isFilenameAbsolute = _isFilenameAbsolute;
	};
	
	exports.isFilenameAbsolute = _isFilenameAbsolute;
	var makeUrl = function makeUrl(filename, scheme, line, column) {
	  var actualFilename = filenameWithoutLoaders(filename);
	
	  if (filenameHasSchema(filename)) {
	    return actualFilename;
	  }
	
	  var url = 'file://' + actualFilename;
	
	  if (scheme) {
	    url = scheme + '://open?url=' + url;
	
	    if (line && actualFilename === filename) {
	      url = url + '&line=' + line;
	
	      if (column) {
	        url = url + '&column=' + column;
	      }
	    }
	  }
	
	  return url;
	};
	
	var _makeUrl = makeUrl;
	
	__$Getters__['makeUrl'] = function () {
	  return makeUrl;
	};
	
	__$Setters__['makeUrl'] = function (value) {
	  exports.makeUrl = makeUrl = value;
	};
	
	__$Resetters__['makeUrl'] = function () {
	  exports.makeUrl = makeUrl = _makeUrl;
	};
	
	exports.makeUrl = _makeUrl;
	var makeLinkText = function makeLinkText(filename, line, column) {
	  var text = filenameWithoutLoaders(filename);
	
	  if (line && text === filename) {
	    text = text + ':' + line;
	
	    if (column) {
	      text = text + ':' + column;
	    }
	  }
	
	  return text;
	};
	var _makeLinkText = makeLinkText;
	
	__$Getters__['makeLinkText'] = function () {
	  return makeLinkText;
	};
	
	__$Setters__['makeLinkText'] = function (value) {
	  exports.makeLinkText = makeLinkText = value;
	};
	
	__$Resetters__['makeLinkText'] = function () {
	  exports.makeLinkText = makeLinkText = _makeLinkText;
	};
	
	exports.makeLinkText = _makeLinkText;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	exports['default'] = __RewireAPI__;

/***/ },
/* 455 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	var __$Getters__ = [];
	var __$Setters__ = [];
	var __$Resetters__ = [];
	
	function __GetDependency__(name) {
	  return __$Getters__[name]();
	}
	
	function __Rewire__(name, value) {
	  __$Setters__[name](value);
	}
	
	function __ResetDependency__(name) {
	  __$Resetters__[name]();
	}
	
	var __RewireAPI__ = {
	  '__GetDependency__': __GetDependency__,
	  '__get__': __GetDependency__,
	  '__Rewire__': __Rewire__,
	  '__set__': __Rewire__,
	  '__ResetDependency__': __ResetDependency__
	};
	var _defaultExport = {
	  redbox: {
	    boxSizing: 'border-box',
	    fontFamily: 'sans-serif',
	    position: 'fixed',
	    padding: 10,
	    top: 0,
	    left: 0,
	    bottom: 0,
	    right: 0,
	    width: '100%',
	    background: 'rgb(204, 0, 0)',
	    color: 'white',
	    zIndex: 9999,
	    textAlign: 'left',
	    fontSize: '16px',
	    lineHeight: 1.2
	  },
	  message: {
	    fontWeight: 'bold'
	  },
	  stack: {
	    fontFamily: 'monospace',
	    marginTop: '2em'
	  },
	  frame: {
	    marginTop: '1em'
	  },
	  file: {
	    fontSize: '0.8em',
	    color: 'rgba(255, 255, 255, 0.7)'
	  },
	  linkToFile: {
	    textDecoration: 'none',
	    color: 'rgba(255, 255, 255, 0.7)'
	  }
	};
	
	if (typeof _defaultExport === 'object' || typeof _defaultExport === 'function') {
	  Object.defineProperty(_defaultExport, '__Rewire__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__set__', {
	    'value': __Rewire__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__ResetDependency__', {
	    'value': __ResetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__GetDependency__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__get__', {
	    'value': __GetDependency__,
	    'enumberable': false
	  });
	  Object.defineProperty(_defaultExport, '__RewireAPI__', {
	    'value': __RewireAPI__,
	    'enumberable': false
	  });
	}
	
	exports['default'] = _defaultExport;
	exports.__GetDependency__ = __GetDependency__;
	exports.__get__ = __GetDependency__;
	exports.__Rewire__ = __Rewire__;
	exports.__set__ = __Rewire__;
	exports.__ResetDependency__ = __ResetDependency__;
	exports.__RewireAPI__ = __RewireAPI__;
	module.exports = exports['default'];

/***/ },
/* 456 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
	
	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(457)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('stackframe'));
	    } else {
	        root.ErrorStackParser = factory(root.StackFrame);
	    }
	}(this, function ErrorStackParser(StackFrame) {
	    'use strict';
	
	    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
	    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
	    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;
	
	    return {
	        /**
	         * Given an Error object, extract the most information from it.
	         * @param error {Error}
	         * @return Array[StackFrame]
	         */
	        parse: function ErrorStackParser$$parse(error) {
	            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
	                return this.parseOpera(error);
	            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
	                return this.parseV8OrIE(error);
	            } else if (error.stack) {
	                return this.parseFFOrSafari(error);
	            } else {
	                throw new Error('Cannot parse given Error object');
	            }
	        },
	
	        /**
	         * Separate line and column numbers from a URL-like string.
	         * @param urlLike String
	         * @return Array[String]
	         */
	        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
	            // Fail-fast but return locations like "(native)"
	            if (urlLike.indexOf(':') === -1) {
	                return [urlLike];
	            }
	
	            var locationParts = urlLike.replace(/[\(\)\s]/g, '').split(':');
	            var lastNumber = locationParts.pop();
	            var possibleNumber = locationParts[locationParts.length - 1];
	            if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
	                var lineNumber = locationParts.pop();
	                return [locationParts.join(':'), lineNumber, lastNumber];
	            } else {
	                return [locationParts.join(':'), lastNumber, undefined];
	            }
	        },
	
	        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !!line.match(CHROME_IE_STACK_REGEXP);
	            }, this).map(function (line) {
	                if (line.indexOf('(eval ') > -1) {
	                    // Throw away eval information until we implement stacktrace.js/stackframe#8
	                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
	                }
	                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionName = tokens.join(' ') || undefined;
	                var fileName = locationParts[0] === 'eval' ? undefined : locationParts[0];
	
	                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
	            }, this);
	        },
	
	        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
	            }, this).map(function (line) {
	                // Throw away eval information until we implement stacktrace.js/stackframe#8
	                if (line.indexOf(' > eval') > -1) {
	                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
	                }
	
	                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
	                    // Safari eval frames only have function names and nothing else
	                    return new StackFrame(line);
	                } else {
	                    var tokens = line.split('@');
	                    var locationParts = this.extractLocation(tokens.pop());
	                    var functionName = tokens.shift() || undefined;
	                    return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2], line);
	                }
	            }, this);
	        },
	
	        parseOpera: function ErrorStackParser$$parseOpera(e) {
	            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
	                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
	                return this.parseOpera9(e);
	            } else if (!e.stack) {
	                return this.parseOpera10(e);
	            } else {
	                return this.parseOpera11(e);
	            }
	        },
	
	        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
	            var lines = e.message.split('\n');
	            var result = [];
	
	            for (var i = 2, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
	                }
	            }
	
	            return result;
	        },
	
	        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
	            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
	            var lines = e.stacktrace.split('\n');
	            var result = [];
	
	            for (var i = 0, len = lines.length; i < len; i += 2) {
	                var match = lineRE.exec(lines[i]);
	                if (match) {
	                    result.push(new StackFrame(match[3] || undefined, undefined, match[2], match[1], undefined, lines[i]));
	                }
	            }
	
	            return result;
	        },
	
	        // Opera 10.65+ Error.stack very similar to FF/Safari
	        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
	            return error.stack.split('\n').filter(function (line) {
	                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) &&
	                    !line.match(/^Error created at/);
	            }, this).map(function (line) {
	                var tokens = line.split('@');
	                var locationParts = this.extractLocation(tokens.pop());
	                var functionCall = (tokens.shift() || '');
	                var functionName = functionCall
	                        .replace(/<anonymous function(: (\w+))?>/, '$2')
	                        .replace(/\([^\)]*\)/g, '') || undefined;
	                var argsRaw;
	                if (functionCall.match(/\(([^\)]*)\)/)) {
	                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
	                }
	                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ? undefined : argsRaw.split(',');
	                return new StackFrame(functionName, args, locationParts[0], locationParts[1], locationParts[2], line);
	            }, this);
	        }
	    };
	}));
	


/***/ },
/* 457 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
	    'use strict';
	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
	
	    /* istanbul ignore next */
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports === 'object') {
	        module.exports = factory();
	    } else {
	        root.StackFrame = factory();
	    }
	}(this, function () {
	    'use strict';
	    function _isNumber(n) {
	        return !isNaN(parseFloat(n)) && isFinite(n);
	    }
	
	    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
	        if (functionName !== undefined) {
	            this.setFunctionName(functionName);
	        }
	        if (args !== undefined) {
	            this.setArgs(args);
	        }
	        if (fileName !== undefined) {
	            this.setFileName(fileName);
	        }
	        if (lineNumber !== undefined) {
	            this.setLineNumber(lineNumber);
	        }
	        if (columnNumber !== undefined) {
	            this.setColumnNumber(columnNumber);
	        }
	        if (source !== undefined) {
	            this.setSource(source);
	        }
	    }
	
	    StackFrame.prototype = {
	        getFunctionName: function () {
	            return this.functionName;
	        },
	        setFunctionName: function (v) {
	            this.functionName = String(v);
	        },
	
	        getArgs: function () {
	            return this.args;
	        },
	        setArgs: function (v) {
	            if (Object.prototype.toString.call(v) !== '[object Array]') {
	                throw new TypeError('Args must be an Array');
	            }
	            this.args = v;
	        },
	
	        // NOTE: Property name may be misleading as it includes the path,
	        // but it somewhat mirrors V8's JavaScriptStackTraceApi
	        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
	        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
	        getFileName: function () {
	            return this.fileName;
	        },
	        setFileName: function (v) {
	            this.fileName = String(v);
	        },
	
	        getLineNumber: function () {
	            return this.lineNumber;
	        },
	        setLineNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Line Number must be a Number');
	            }
	            this.lineNumber = Number(v);
	        },
	
	        getColumnNumber: function () {
	            return this.columnNumber;
	        },
	        setColumnNumber: function (v) {
	            if (!_isNumber(v)) {
	                throw new TypeError('Column Number must be a Number');
	            }
	            this.columnNumber = Number(v);
	        },
	
	        getSource: function () {
	            return this.source;
	        },
	        setSource: function (v) {
	            this.source = String(v);
	        },
	
	        toString: function() {
	            var functionName = this.getFunctionName() || '{anonymous}';
	            var args = '(' + (this.getArgs() || []).join(',') + ')';
	            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
	            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
	            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
	            return functionName + args + fileName + lineNumber + columnNumber;
	        }
	    };
	
	    return StackFrame;
	}));


/***/ },
/* 458 */
/***/ function(module, exports) {

	/* eslint-disable no-unused-vars */
	'use strict';
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	
	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;
	
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
	
			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}
	
			if (Object.getOwnPropertySymbols) {
				symbols = Object.getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}
	
		return to;
	};


/***/ },
/* 459 */,
/* 460 */,
/* 461 */,
/* 462 */,
/* 463 */,
/* 464 */,
/* 465 */,
/* 466 */,
/* 467 */,
/* 468 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactDock = __webpack_require__(475);
	
	var _reactDock2 = _interopRequireDefault(_reactDock);
	
	var _constants = __webpack_require__(214);
	
	var _actions = __webpack_require__(213);
	
	var _reducers = __webpack_require__(470);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	var _parseKey = __webpack_require__(472);
	
	var _parseKey2 = _interopRequireDefault(_parseKey);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var DockMonitor = (function (_Component) {
	  _inherits(DockMonitor, _Component);
	
	  function DockMonitor(props) {
	    _classCallCheck(this, DockMonitor);
	
	    var _this = _possibleConstructorReturn(this, _Component.call(this, props));
	
	    _this.handleKeyDown = _this.handleKeyDown.bind(_this);
	    _this.handleSizeChange = _this.handleSizeChange.bind(_this);
	    return _this;
	  }
	
	  DockMonitor.prototype.componentDidMount = function componentDidMount() {
	    window.addEventListener('keydown', this.handleKeyDown);
	  };
	
	  DockMonitor.prototype.componentWillUnmount = function componentWillUnmount() {
	    window.removeEventListener('keydown', this.handleKeyDown);
	  };
	
	  DockMonitor.prototype.matchesKey = function matchesKey(key, event) {
	    var charCode = event.keyCode || event.which;
	    var char = String.fromCharCode(charCode);
	    return key.name.toUpperCase() === char.toUpperCase() && key.alt === event.altKey && key.ctrl === event.ctrlKey && key.meta === event.metaKey && key.shift === event.shiftKey;
	  };
	
	  DockMonitor.prototype.handleKeyDown = function handleKeyDown(e) {
	    var visibilityKey = (0, _parseKey2.default)(this.props.toggleVisibilityKey);
	    var positionKey = (0, _parseKey2.default)(this.props.changePositionKey);
	
	    if (this.matchesKey(visibilityKey, e)) {
	      e.preventDefault();
	      this.props.dispatch((0, _actions.toggleVisibility)());
	    } else if (this.matchesKey(positionKey, e)) {
	      e.preventDefault();
	      this.props.dispatch((0, _actions.changePosition)());
	    }
	  };
	
	  DockMonitor.prototype.handleSizeChange = function handleSizeChange(requestedSize) {
	    this.props.dispatch((0, _actions.changeSize)(requestedSize));
	  };
	
	  DockMonitor.prototype.render = function render() {
	    var _props = this.props;
	    var monitorState = _props.monitorState;
	    var children = _props.children;
	    var fluid = _props.fluid;
	
	    var rest = _objectWithoutProperties(_props, ['monitorState', 'children', 'fluid']);
	
	    var position = monitorState.position;
	    var isVisible = monitorState.isVisible;
	    var size = monitorState.size;
	
	    var childProps = _extends({}, rest, {
	      monitorState: monitorState.childMonitorState
	    });
	
	    return _react2.default.createElement(
	      _reactDock2.default,
	      { position: position,
	        isVisible: isVisible,
	        size: size,
	        fluid: fluid,
	        onSizeChange: this.handleSizeChange,
	        dimMode: 'none' },
	      (0, _react.cloneElement)(children, childProps)
	    );
	  };
	
	  return DockMonitor;
	})(_react.Component);
	
	DockMonitor.update = _reducers2.default;
	DockMonitor.propTypes = {
	  defaultPosition: _react.PropTypes.oneOf(_constants.POSITIONS).isRequired,
	  defaultIsVisible: _react.PropTypes.bool.isRequired,
	  defaultSize: _react.PropTypes.number.isRequired,
	  toggleVisibilityKey: _react.PropTypes.string.isRequired,
	  changePositionKey: _react.PropTypes.string.isRequired,
	  fluid: _react.PropTypes.bool,
	  children: _react.PropTypes.element,
	
	  dispatch: _react.PropTypes.func,
	  monitorState: _react.PropTypes.shape({
	    position: _react.PropTypes.oneOf(_constants.POSITIONS).isRequired,
	    size: _react.PropTypes.number.isRequired,
	    isVisible: _react.PropTypes.bool.isRequired,
	    childMonitorState: _react.PropTypes.any
	  })
	};
	DockMonitor.defaultProps = {
	  defaultIsVisible: true,
	  defaultPosition: 'right',
	  defaultSize: 0.3,
	  fluid: true
	};
	exports.default = DockMonitor;

/***/ },
/* 469 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = undefined;
	
	var _DockMonitor = __webpack_require__(468);
	
	var _DockMonitor2 = _interopRequireDefault(_DockMonitor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _DockMonitor2.default;

/***/ },
/* 470 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = reducer;
	
	var _actions = __webpack_require__(213);
	
	var _constants = __webpack_require__(214);
	
	function position(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? props.defaultPosition : arguments[1];
	  var action = arguments[2];
	
	  return action.type === _actions.CHANGE_POSITION ? _constants.POSITIONS[(_constants.POSITIONS.indexOf(state) + 1) % _constants.POSITIONS.length] : state;
	}
	
	function size(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? props.defaultSize : arguments[1];
	  var action = arguments[2];
	
	  return action.type === _actions.CHANGE_SIZE ? action.size : state;
	}
	
	function isVisible(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? props.defaultIsVisible : arguments[1];
	  var action = arguments[2];
	
	  return action.type === _actions.TOGGLE_VISIBILITY ? !state : state;
	}
	
	function childMonitorState(props, state, action) {
	  var child = props.children;
	  return child.type.update(child.props, state, action);
	}
	
	function reducer(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var action = arguments[2];
	
	  return {
	    position: position(props, state.position, action),
	    isVisible: isVisible(props, state.isVisible, action),
	    size: size(props, state.size, action),
	    childMonitorState: childMonitorState(props, state.childMonitorState, action)
	  };
	}

/***/ },
/* 471 */
/***/ function(module, exports) {

	// Most of these are according to this table: http://www.ssicom.org/js/x171166.htm
	// However where nodejs readline diverges, they are adjusted to conform to it
	module.exports = {
	  nomod: {
	      escape: '\u001b'
	    , space: ' ' // actually '\u0020'
	    }
	  , ctrl: {
	        ' ': '\u0000'
	      , 'a': '\u0001'
	      , 'b': '\u0002'
	      , 'c': '\u0003'
	      , 'd': '\u0004'
	      , 'e': '\u0005'
	      , 'f': '\u0006'
	      , 'g': '\u0007'
	      , 'h': '\u0008'
	      , 'i': '\u0009'
	      , 'j': '\u000a'
	      , 'k': '\u000b'
	      , 'm': '\u000c'
	      , 'n': '\u000d'
	      , 'l': '\u000e'
	      , 'o': '\u000f'
	      , 'p': '\u0010'
	      , 'q': '\u0011'
	      , 'r': '\u0012'
	      , 's': '\u0013'
	      , 't': '\u0014'
	      , 'u': '\u0015'
	      , 'v': '\u0016'
	      , 'w': '\u0017'
	      , 'x': '\u0018'
	      , 'y': '\u0019'
	      , 'z': '\u001a'
	      , '[': '\u001b'
	      , '\\':'\u001c'
	      , ']': '\u001d'
	      , '^': '\u001e'
	      , '_': '\u001f'
	
	      , 'space': '\u0000'
	    }
	};


/***/ },
/* 472 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var keycodes = __webpack_require__(471);
	
	function assertKeyString(s) {
	  if (!/^(ctrl-|shift-|alt-|meta-){0,4}\w+$/.test(s))
	    throw new Error('The string to parse needs to be of the format "c", "ctrl-c", "shift-ctrl-c".');
	}
	
	module.exports = function parse(s) {
	  var keyString = s.trim().toLowerCase();
	
	  assertKeyString(keyString);
	
	  var key = {
	      name     :  undefined
	    , ctrl     :  false
	    , meta     :  false
	    , shift    :  false
	    , alt      :  false
	    , sequence :  undefined
	  }
	  , parts = keyString.split('-')
	  , c;
	
	  key.name = parts.pop();
	  while((c = parts.pop())) key[c] = true;
	  key.sequence = key.ctrl 
	    ? keycodes.ctrl[key.name] || key.name
	    : keycodes.nomod[key.name] || key.name;
	
	  // uppercase sequence for single chars when shift was pressed
	  if (key.shift && key.sequence && key.sequence.length === 1)
	    key.sequence = key.sequence.toUpperCase();
	
	  return key;
	};


/***/ },
/* 473 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _get = __webpack_require__(262)['default'];
	
	var _inherits = __webpack_require__(22)['default'];
	
	var _createClass = __webpack_require__(260)['default'];
	
	var _classCallCheck = __webpack_require__(259)['default'];
	
	var _extends = __webpack_require__(89)['default'];
	
	var _toConsumableArray = __webpack_require__(264)['default'];
	
	var _Object$keys = __webpack_require__(145)['default'];
	
	var _interopRequireDefault = __webpack_require__(146)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _lodashDebounce = __webpack_require__(476);
	
	var _lodashDebounce2 = _interopRequireDefault(_lodashDebounce);
	
	var _objectAssign = __webpack_require__(478);
	
	var _objectAssign2 = _interopRequireDefault(_objectAssign);
	
	var _autoprefix = __webpack_require__(474);
	
	var _autoprefix2 = _interopRequireDefault(_autoprefix);
	
	function autoprefixes(styles) {
	  return _Object$keys(styles).reduce(function (obj, key) {
	    return (obj[key] = (0, _autoprefix2['default'])(styles[key]), obj);
	  }, {});
	}
	
	var styles = autoprefixes({
	  wrapper: {
	    position: 'fixed',
	    width: 0,
	    height: 0,
	    top: 0,
	    left: 0
	  },
	
	  dim: {
	    position: 'fixed',
	    left: 0,
	    right: 0,
	    top: 0,
	    bottom: 0,
	    zIndex: 0,
	    background: 'rgba(0, 0, 0, 0.2)',
	    opacity: 1
	  },
	
	  dimAppear: {
	    opacity: 0
	  },
	
	  dimTransparent: {
	    pointerEvents: 'none'
	  },
	
	  dimHidden: {
	    opacity: 0
	  },
	
	  dock: {
	    position: 'fixed',
	    zIndex: 1,
	    boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
	    background: 'white',
	    left: 0,
	    top: 0,
	    width: '100%',
	    height: '100%'
	  },
	
	  dockHidden: {
	    opacity: 0
	  },
	
	  dockResizing: {
	    transition: 'none'
	  },
	
	  dockContent: {
	    width: '100%',
	    height: '100%',
	    overflow: 'auto'
	  },
	
	  resizer: {
	    position: 'absolute',
	    zIndex: 2,
	    opacity: 0
	  }
	});
	
	function getTransitions(duration) {
	  return ['left', 'top', 'width', 'height'].map(function (p) {
	    return p + ' ' + duration / 1000 + 's ease-out';
	  });
	}
	
	function getDockStyles(_ref, _ref2) {
	  var fluid = _ref.fluid;
	  var dockStyle = _ref.dockStyle;
	  var dockHiddenStyle = _ref.dockHiddenStyle;
	  var duration = _ref.duration;
	  var position = _ref.position;
	  var isVisible = _ref.isVisible;
	  var size = _ref2.size;
	  var isResizing = _ref2.isResizing;
	  var fullWidth = _ref2.fullWidth;
	  var fullHeight = _ref2.fullHeight;
	
	  var posStyle = undefined;
	  var absSize = fluid ? size * 100 + '%' : size + 'px';
	
	  function getRestSize(fullSize) {
	    return fluid ? 100 - size * 100 + '%' : fullSize - size + 'px';
	  }
	
	  switch (position) {
	    case 'left':
	      posStyle = {
	        width: absSize,
	        left: isVisible ? 0 : '-' + absSize
	      };
	      break;
	    case 'right':
	      posStyle = {
	        left: isVisible ? getRestSize(fullWidth) : fullWidth,
	        width: absSize
	      };
	      break;
	    case 'top':
	      posStyle = {
	        top: isVisible ? 0 : '-' + absSize,
	        height: absSize
	      };
	      break;
	    case 'bottom':
	      posStyle = {
	        top: isVisible ? getRestSize(fullHeight) : fullHeight,
	        height: absSize
	      };
	      break;
	  }
	
	  var transitions = getTransitions(duration);
	
	  return [styles.dock, (0, _autoprefix2['default'])({
	    transition: [].concat(_toConsumableArray(transitions), [!isVisible && 'opacity 0.01s linear ' + duration / 1000 + 's']).filter(function (t) {
	      return t;
	    }).join(',')
	  }), dockStyle, (0, _autoprefix2['default'])(posStyle), isResizing && styles.dockResizing, !isVisible && styles.dockHidden, !isVisible && dockHiddenStyle];
	}
	
	function getDimStyles(_ref3, _ref4) {
	  var dimMode = _ref3.dimMode;
	  var dimStyle = _ref3.dimStyle;
	  var duration = _ref3.duration;
	  var isVisible = _ref3.isVisible;
	  var isTransitionStarted = _ref4.isTransitionStarted;
	
	  return [styles.dim, (0, _autoprefix2['default'])({
	    transition: 'opacity ' + duration / 1000 + 's ease-out'
	  }), dimStyle, dimMode === 'transparent' && styles.dimTransparent, !isVisible && styles.dimHidden, isTransitionStarted && isVisible && styles.dimAppear, isTransitionStarted && !isVisible && styles.dimDisappear];
	}
	
	function getResizerStyles(position) {
	  var resizerStyle = undefined;
	  var size = 10;
	
	  switch (position) {
	    case 'left':
	      resizerStyle = {
	        right: -size / 2,
	        width: size,
	        top: 0,
	        height: '100%',
	        cursor: 'col-resize'
	      };
	      break;
	    case 'right':
	      resizerStyle = {
	        left: -size / 2,
	        width: size,
	        top: 0,
	        height: '100%',
	        cursor: 'col-resize'
	      };
	      break;
	    case 'top':
	      resizerStyle = {
	        bottom: -size / 2,
	        height: size,
	        left: 0,
	        width: '100%',
	        cursor: 'row-resize'
	      };
	      break;
	    case 'bottom':
	      resizerStyle = {
	        top: -size / 2,
	        height: size,
	        left: 0,
	        width: '100%',
	        cursor: 'row-resize'
	      };
	      break;
	  }
	
	  return [styles.resizer, (0, _autoprefix2['default'])(resizerStyle)];
	}
	
	function getFullSize(position, fullWidth, fullHeight) {
	  return position === 'left' || position === 'right' ? fullWidth : fullHeight;
	}
	
	var Dock = (function (_Component) {
	  _inherits(Dock, _Component);
	
	  function Dock(props) {
	    var _this = this;
	
	    _classCallCheck(this, Dock);
	
	    _get(Object.getPrototypeOf(Dock.prototype), 'constructor', this).call(this, props);
	
	    this.transitionEnd = function () {
	      _this.setState({ isTransitionStarted: false });
	    };
	
	    this.hideDim = function () {
	      if (!_this.props.isVisible) {
	        _this.setState({ isDimHidden: true });
	      }
	    };
	
	    this.handleDimClick = function () {
	      if (_this.props.dimMode === 'opaque') {
	        _this.props.onVisibleChange && _this.props.onVisibleChange(false);
	      }
	    };
	
	    this.handleResize = function () {
	      if (window.requestAnimationFrame) {
	        window.requestAnimationFrame(_this.updateWindowSize.bind(_this, true));
	      } else {
	        _this.updateWindowSize(true);
	      }
	    };
	
	    this.updateWindowSize = function (windowResize) {
	      var sizeState = {
	        fullWidth: window.innerWidth,
	        fullHeight: window.innerHeight
	      };
	
	      if (windowResize) {
	        _this.setState(_extends({}, sizeState, {
	          isResizing: true,
	          isWindowResizing: windowResize
	        }));
	
	        _this.debouncedUpdateWindowSizeEnd();
	      } else {
	        _this.setState(sizeState);
	      }
	    };
	
	    this.updateWindowSizeEnd = function () {
	      _this.setState({
	        isResizing: false,
	        isWindowResizing: false
	      });
	    };
	
	    this.debouncedUpdateWindowSizeEnd = (0, _lodashDebounce2['default'])(this.updateWindowSizeEnd, 30);
	
	    this.handleWrapperLeave = function () {
	      _this.setState({ isResizing: false });
	    };
	
	    this.handleMouseDown = function () {
	      _this.setState({ isResizing: true });
	    };
	
	    this.handleMouseUp = function () {
	      _this.setState({ isResizing: false });
	    };
	
	    this.handleMouseMove = function (e) {
	      if (!_this.state.isResizing || _this.state.isWindowResizing) return;
	      e.preventDefault();
	
	      var _props = _this.props;
	      var position = _props.position;
	      var fluid = _props.fluid;
	      var _state = _this.state;
	      var fullWidth = _state.fullWidth;
	      var fullHeight = _state.fullHeight;
	      var isControlled = _state.isControlled;
	      var x = e.clientX;
	      var y = e.clientY;
	
	      var size = undefined;
	
	      switch (position) {
	        case 'left':
	          size = fluid ? x / fullWidth : x;
	          break;
	        case 'right':
	          size = fluid ? (fullWidth - x) / fullWidth : fullWidth - x;
	          break;
	        case 'top':
	          size = fluid ? y / fullHeight : y;
	          break;
	        case 'bottom':
	          size = fluid ? (fullHeight - y) / fullHeight : fullHeight - y;
	          break;
	      }
	
	      _this.props.onSizeChange && _this.props.onSizeChange(size);
	
	      if (!isControlled) {
	        _this.setState({ size: size });
	      }
	    };
	
	    this.state = {
	      isControlled: typeof props.size !== 'undefined',
	      size: props.size || props.defaultSize,
	      isDimHidden: !props.isVisible,
	      fullWidth: typeof window !== 'undefined' && window.innerWidth,
	      fullHeight: typeof window !== 'undefined' && window.innerHeight,
	      isTransitionStarted: false,
	      isWindowResizing: false
	    };
	  }
	
	  _createClass(Dock, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      window.addEventListener('mouseup', this.handleMouseUp);
	      window.addEventListener('mousemove', this.handleMouseMove);
	      window.addEventListener('resize', this.handleResize);
	
	      if (!window.fullWidth) {
	        this.updateWindowSize();
	      }
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      window.removeEventListener('mouseup', this.handleMouseUp);
	      window.removeEventListener('mousemove', this.handleMouseMove);
	      window.removeEventListener('resize', this.handleResize);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      var isControlled = typeof nextProps.size !== 'undefined';
	
	      this.setState({ isControlled: isControlled });
	
	      if (isControlled && this.props.size !== nextProps.size) {
	        this.setState({ size: nextProps.size });
	      } else if (this.props.fluid !== nextProps.fluid) {
	        this.updateSize(nextProps);
	      }
	
	      if (this.props.isVisible !== nextProps.isVisible) {
	        this.setState({
	          isTransitionStarted: true
	        });
	      }
	    }
	  }, {
	    key: 'updateSize',
	    value: function updateSize(props) {
	      var _state2 = this.state;
	      var fullWidth = _state2.fullWidth;
	      var fullHeight = _state2.fullHeight;
	
	      this.setState({
	        size: props.fluid ? this.state.size / getFullSize(props.position, fullWidth, fullHeight) : getFullSize(props.position, fullWidth, fullHeight) * this.state.size
	      });
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate(prevProps) {
	      var _this2 = this;
	
	      if (this.props.isVisible !== prevProps.isVisible) {
	        if (!this.props.isVisible) {
	          window.setTimeout(function () {
	            return _this2.hideDim();
	          }, this.props.duration);
	        } else {
	          this.setState({ isDimHidden: false });
	        }
	
	        window.setTimeout(function () {
	          return _this2.setState({ isTransitionStarted: false });
	        }, 0);
	      }
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _props2 = this.props;
	      var children = _props2.children;
	      var zIndex = _props2.zIndex;
	      var dimMode = _props2.dimMode;
	      var position = _props2.position;
	      var isVisible = _props2.isVisible;
	      var _state3 = this.state;
	      var isResizing = _state3.isResizing;
	      var size = _state3.size;
	      var isDimHidden = _state3.isDimHidden;
	
	      var dimStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getDimStyles(this.props, this.state))));
	      var dockStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getDockStyles(this.props, this.state))));
	      var resizerStyles = _objectAssign2['default'].apply(undefined, [{}].concat(_toConsumableArray(getResizerStyles(position))));
	
	      return _react2['default'].createElement(
	        'div',
	        { style: (0, _objectAssign2['default'])({}, styles.wrapper, { zIndex: zIndex }) },
	        dimMode !== 'none' && !isDimHidden && _react2['default'].createElement('div', { style: dimStyles, onClick: this.handleDimClick }),
	        _react2['default'].createElement(
	          'div',
	          { style: dockStyles },
	          _react2['default'].createElement('div', { style: resizerStyles,
	            onMouseDown: this.handleMouseDown }),
	          _react2['default'].createElement(
	            'div',
	            { style: styles.dockContent },
	            typeof children === 'function' ? children({
	              position: position,
	              isResizing: isResizing,
	              size: size,
	              isVisible: isVisible
	            }) : children
	          )
	        )
	      );
	    }
	  }], [{
	    key: 'propTypes',
	    value: {
	      position: _react.PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
	      zIndex: _react.PropTypes.number,
	      fluid: _react.PropTypes.bool,
	      size: _react.PropTypes.number,
	      defaultSize: _react.PropTypes.number,
	      dimMode: _react.PropTypes.oneOf(['none', 'transparent', 'opaque']),
	      isVisible: _react.PropTypes.bool,
	      onVisibleChange: _react.PropTypes.func,
	      onSizeChange: _react.PropTypes.func,
	      dimStyle: _react.PropTypes.object,
	      dockStyle: _react.PropTypes.object,
	      duration: _react.PropTypes.number
	    },
	    enumerable: true
	  }, {
	    key: 'defaultProps',
	    value: {
	      position: 'left',
	      zIndex: 99999999,
	      fluid: true,
	      defaultSize: 0.3,
	      dimMode: 'opaque',
	      duration: 200
	    },
	    enumerable: true
	  }]);
	
	  return Dock;
	})(_react.Component);
	
	exports['default'] = Dock;
	module.exports = exports['default'];

/***/ },
/* 474 */
/***/ function(module, exports, __webpack_require__) {

	// Same as https://github.com/SimenB/react-vendor-prefixes/blob/master/src/index.js,
	// but dumber
	
	'use strict';
	
	var _extends = __webpack_require__(89)['default'];
	
	var _Object$keys = __webpack_require__(145)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	exports['default'] = autoprefix;
	var vendorSpecificProperties = ['animation', 'animationDelay', 'animationDirection', 'animationDuration', 'animationFillMode', 'animationIterationCount', 'animationName', 'animationPlayState', 'animationTimingFunction', 'appearance', 'backfaceVisibility', 'backgroundClip', 'borderImage', 'borderImageSlice', 'boxSizing', 'boxShadow', 'contentColumns', 'transform', 'transformOrigin', 'transformStyle', 'transition', 'transitionDelay', 'transitionDuration', 'transitionProperty', 'transitionTimingFunction', 'perspective', 'perspectiveOrigin', 'userSelect'];
	
	var prefixes = ['Moz', 'Webkit', 'ms', 'O'];
	
	function prefixProp(key, value) {
	  return prefixes.reduce(function (obj, pre) {
	    return (obj[pre + key[0].toUpperCase() + key.substr(1)] = value, obj);
	  }, {});
	}
	
	function autoprefix(style) {
	  return _Object$keys(style).reduce(function (obj, key) {
	    return vendorSpecificProperties.indexOf(key) !== -1 ? _extends({}, obj, prefixProp(key, style[key])) : obj;
	  }, style);
	}
	
	module.exports = exports['default'];

/***/ },
/* 475 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _interopRequireDefault = __webpack_require__(146)['default'];
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _Dock = __webpack_require__(473);
	
	var _Dock2 = _interopRequireDefault(_Dock);
	
	exports['default'] = _Dock2['default'];
	module.exports = exports['default'];

/***/ },
/* 476 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(477);
	
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max,
	    nativeNow = getNative(Date, 'now');
	
	/**
	 * Gets the number of milliseconds that have elapsed since the Unix epoch
	 * (1 January 1970 00:00:00 UTC).
	 *
	 * @static
	 * @memberOf _
	 * @category Date
	 * @example
	 *
	 * _.defer(function(stamp) {
	 *   console.log(_.now() - stamp);
	 * }, _.now());
	 * // => logs the number of milliseconds it took for the deferred function to be invoked
	 */
	var now = nativeNow || function() {
	  return new Date().getTime();
	};
	
	/**
	 * Creates a debounced function that delays invoking `func` until after `wait`
	 * milliseconds have elapsed since the last time the debounced function was
	 * invoked. The debounced function comes with a `cancel` method to cancel
	 * delayed invocations. Provide an options object to indicate that `func`
	 * should be invoked on the leading and/or trailing edge of the `wait` timeout.
	 * Subsequent calls to the debounced function return the result of the last
	 * `func` invocation.
	 *
	 * **Note:** If `leading` and `trailing` options are `true`, `func` is invoked
	 * on the trailing edge of the timeout only if the the debounced function is
	 * invoked more than once during the `wait` timeout.
	 *
	 * See [David Corbacho's article](http://drupalmotion.com/article/debounce-and-throttle-visual-explanation)
	 * for details over the differences between `_.debounce` and `_.throttle`.
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to debounce.
	 * @param {number} [wait=0] The number of milliseconds to delay.
	 * @param {Object} [options] The options object.
	 * @param {boolean} [options.leading=false] Specify invoking on the leading
	 *  edge of the timeout.
	 * @param {number} [options.maxWait] The maximum time `func` is allowed to be
	 *  delayed before it is invoked.
	 * @param {boolean} [options.trailing=true] Specify invoking on the trailing
	 *  edge of the timeout.
	 * @returns {Function} Returns the new debounced function.
	 * @example
	 *
	 * // avoid costly calculations while the window size is in flux
	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
	 *
	 * // invoke `sendMail` when the click event is fired, debouncing subsequent calls
	 * jQuery('#postbox').on('click', _.debounce(sendMail, 300, {
	 *   'leading': true,
	 *   'trailing': false
	 * }));
	 *
	 * // ensure `batchLog` is invoked once after 1 second of debounced calls
	 * var source = new EventSource('/stream');
	 * jQuery(source).on('message', _.debounce(batchLog, 250, {
	 *   'maxWait': 1000
	 * }));
	 *
	 * // cancel a debounced call
	 * var todoChanges = _.debounce(batchLog, 1000);
	 * Object.observe(models.todo, todoChanges);
	 *
	 * Object.observe(models, function(changes) {
	 *   if (_.find(changes, { 'user': 'todo', 'type': 'delete'})) {
	 *     todoChanges.cancel();
	 *   }
	 * }, ['delete']);
	 *
	 * // ...at some point `models.todo` is changed
	 * models.todo.completed = true;
	 *
	 * // ...before 1 second has passed `models.todo` is deleted
	 * // which cancels the debounced `todoChanges` call
	 * delete models.todo;
	 */
	function debounce(func, wait, options) {
	  var args,
	      maxTimeoutId,
	      result,
	      stamp,
	      thisArg,
	      timeoutId,
	      trailingCall,
	      lastCalled = 0,
	      maxWait = false,
	      trailing = true;
	
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  wait = wait < 0 ? 0 : (+wait || 0);
	  if (options === true) {
	    var leading = true;
	    trailing = false;
	  } else if (isObject(options)) {
	    leading = !!options.leading;
	    maxWait = 'maxWait' in options && nativeMax(+options.maxWait || 0, wait);
	    trailing = 'trailing' in options ? !!options.trailing : trailing;
	  }
	
	  function cancel() {
	    if (timeoutId) {
	      clearTimeout(timeoutId);
	    }
	    if (maxTimeoutId) {
	      clearTimeout(maxTimeoutId);
	    }
	    lastCalled = 0;
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	  }
	
	  function complete(isCalled, id) {
	    if (id) {
	      clearTimeout(id);
	    }
	    maxTimeoutId = timeoutId = trailingCall = undefined;
	    if (isCalled) {
	      lastCalled = now();
	      result = func.apply(thisArg, args);
	      if (!timeoutId && !maxTimeoutId) {
	        args = thisArg = undefined;
	      }
	    }
	  }
	
	  function delayed() {
	    var remaining = wait - (now() - stamp);
	    if (remaining <= 0 || remaining > wait) {
	      complete(trailingCall, maxTimeoutId);
	    } else {
	      timeoutId = setTimeout(delayed, remaining);
	    }
	  }
	
	  function maxDelayed() {
	    complete(trailing, timeoutId);
	  }
	
	  function debounced() {
	    args = arguments;
	    stamp = now();
	    thisArg = this;
	    trailingCall = trailing && (timeoutId || !leading);
	
	    if (maxWait === false) {
	      var leadingCall = leading && !timeoutId;
	    } else {
	      if (!maxTimeoutId && !leading) {
	        lastCalled = stamp;
	      }
	      var remaining = maxWait - (stamp - lastCalled),
	          isCalled = remaining <= 0 || remaining > maxWait;
	
	      if (isCalled) {
	        if (maxTimeoutId) {
	          maxTimeoutId = clearTimeout(maxTimeoutId);
	        }
	        lastCalled = stamp;
	        result = func.apply(thisArg, args);
	      }
	      else if (!maxTimeoutId) {
	        maxTimeoutId = setTimeout(maxDelayed, remaining);
	      }
	    }
	    if (isCalled && timeoutId) {
	      timeoutId = clearTimeout(timeoutId);
	    }
	    else if (!timeoutId && wait !== maxWait) {
	      timeoutId = setTimeout(delayed, wait);
	    }
	    if (leadingCall) {
	      isCalled = true;
	      result = func.apply(thisArg, args);
	    }
	    if (isCalled && !timeoutId && !maxTimeoutId) {
	      args = thisArg = undefined;
	    }
	    return result;
	  }
	  debounced.cancel = cancel;
	  return debounced;
	}
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = debounce;


/***/ },
/* 477 */
349,
/* 478 */
458,
/* 479 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _LogMonitorEntry = __webpack_require__(481);
	
	var _LogMonitorEntry2 = _interopRequireDefault(_LogMonitorEntry);
	
	var _LogMonitorButton = __webpack_require__(480);
	
	var _LogMonitorButton2 = _interopRequireDefault(_LogMonitorButton);
	
	var _function = __webpack_require__(134);
	
	var _function2 = _interopRequireDefault(_function);
	
	var _reduxDevtoolsThemes = __webpack_require__(545);
	
	var themes = _interopRequireWildcard(_reduxDevtoolsThemes);
	
	var _reduxDevtools = __webpack_require__(228);
	
	var _actions = __webpack_require__(215);
	
	var _reducers = __webpack_require__(485);
	
	var _reducers2 = _interopRequireDefault(_reducers);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var reset = _reduxDevtools.ActionCreators.reset;
	var rollback = _reduxDevtools.ActionCreators.rollback;
	var commit = _reduxDevtools.ActionCreators.commit;
	var sweep = _reduxDevtools.ActionCreators.sweep;
	var toggleAction = _reduxDevtools.ActionCreators.toggleAction;
	
	var styles = {
	  container: {
	    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
	    position: 'relative',
	    overflowY: 'hidden',
	    width: '100%',
	    height: '100%',
	    minWidth: 300,
	    direction: 'ltr'
	  },
	  buttonBar: {
	    textAlign: 'center',
	    borderBottomWidth: 1,
	    borderBottomStyle: 'solid',
	    borderColor: 'transparent',
	    zIndex: 1,
	    display: 'flex',
	    flexDirection: 'row'
	  },
	  elements: {
	    position: 'absolute',
	    left: 0,
	    right: 0,
	    top: 38,
	    bottom: 0,
	    overflowX: 'hidden',
	    overflowY: 'auto'
	  }
	};
	
	var LogMonitor = (function (_Component) {
	  _inherits(LogMonitor, _Component);
	
	  function LogMonitor(props) {
	    _classCallCheck(this, LogMonitor);
	
	    var _this = _possibleConstructorReturn(this, _Component.call(this, props));
	
	    _this.shouldComponentUpdate = _function2.default;
	
	    _this.handleToggleAction = _this.handleToggleAction.bind(_this);
	    _this.handleReset = _this.handleReset.bind(_this);
	    _this.handleRollback = _this.handleRollback.bind(_this);
	    _this.handleSweep = _this.handleSweep.bind(_this);
	    _this.handleCommit = _this.handleCommit.bind(_this);
	    return _this;
	  }
	
	  LogMonitor.prototype.componentDidMount = function componentDidMount() {
	    var node = this.refs.container;
	    if (!node) {
	      return;
	    }
	
	    node.scrollTop = this.props.monitorState.initialScrollTop;
	    this.interval = setInterval(this.updateScrollTop.bind(this), 1000);
	  };
	
	  LogMonitor.prototype.componentWillUnmount = function componentWillUnmount() {
	    clearInterval(this.setInterval);
	  };
	
	  LogMonitor.prototype.updateScrollTop = function updateScrollTop() {
	    var node = this.refs.container;
	    this.props.dispatch((0, _actions.updateScrollTop)(node ? node.scrollTop : 0));
	  };
	
	  LogMonitor.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
	    var node = this.refs.container;
	    if (!node) {
	      this.scrollDown = true;
	    } else if (this.props.stagedActionIds.length < nextProps.stagedActionIds.length) {
	      var scrollTop = node.scrollTop;
	      var offsetHeight = node.offsetHeight;
	      var scrollHeight = node.scrollHeight;
	
	      this.scrollDown = Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
	    } else {
	      this.scrollDown = false;
	    }
	  };
	
	  LogMonitor.prototype.componentDidUpdate = function componentDidUpdate() {
	    var node = this.refs.container;
	    if (!node) {
	      return;
	    }
	    if (this.scrollDown) {
	      var offsetHeight = node.offsetHeight;
	      var scrollHeight = node.scrollHeight;
	
	      node.scrollTop = scrollHeight - offsetHeight;
	      this.scrollDown = false;
	    }
	  };
	
	  LogMonitor.prototype.handleRollback = function handleRollback() {
	    this.props.dispatch(rollback());
	  };
	
	  LogMonitor.prototype.handleSweep = function handleSweep() {
	    this.props.dispatch(sweep());
	  };
	
	  LogMonitor.prototype.handleCommit = function handleCommit() {
	    this.props.dispatch(commit());
	  };
	
	  LogMonitor.prototype.handleToggleAction = function handleToggleAction(id) {
	    this.props.dispatch(toggleAction(id));
	  };
	
	  LogMonitor.prototype.handleReset = function handleReset() {
	    this.props.dispatch(reset());
	  };
	
	  LogMonitor.prototype.getTheme = function getTheme() {
	    var theme = this.props.theme;
	
	    if (typeof theme !== 'string') {
	      return theme;
	    }
	
	    if (typeof themes[theme] !== 'undefined') {
	      return themes[theme];
	    }
	
	    console.warn('DevTools theme ' + theme + ' not found, defaulting to nicinabox');
	    return themes.nicinabox;
	  };
	
	  LogMonitor.prototype.render = function render() {
	    var elements = [];
	    var theme = this.getTheme();
	    var _props = this.props;
	    var actionsById = _props.actionsById;
	    var skippedActionIds = _props.skippedActionIds;
	    var stagedActionIds = _props.stagedActionIds;
	    var computedStates = _props.computedStates;
	    var select = _props.select;
	
	    for (var i = 0; i < stagedActionIds.length; i++) {
	      var actionId = stagedActionIds[i];
	      var action = actionsById[actionId].action;
	      var _computedStates$i = computedStates[i];
	      var state = _computedStates$i.state;
	      var error = _computedStates$i.error;
	
	      var previousState = undefined;
	      if (i > 0) {
	        previousState = computedStates[i - 1].state;
	      }
	      elements.push(_react2.default.createElement(_LogMonitorEntry2.default, { key: actionId,
	        theme: theme,
	        select: select,
	        action: action,
	        actionId: actionId,
	        state: state,
	        previousState: previousState,
	        collapsed: skippedActionIds.indexOf(actionId) > -1,
	        error: error,
	        onActionClick: this.handleToggleAction }));
	    }
	
	    return _react2.default.createElement(
	      'div',
	      { style: _extends({}, styles.container, { backgroundColor: theme.base00 }) },
	      _react2.default.createElement(
	        'div',
	        { style: _extends({}, styles.buttonBar, { borderColor: theme.base02 }) },
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleReset,
	            enabled: true },
	          'Reset'
	        ),
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleRollback,
	            enabled: computedStates.length > 1 },
	          'Revert'
	        ),
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleSweep,
	            enabled: skippedActionIds.length > 0 },
	          'Sweep'
	        ),
	        _react2.default.createElement(
	          _LogMonitorButton2.default,
	          {
	            theme: theme,
	            onClick: this.handleCommit,
	            enabled: computedStates.length > 1 },
	          'Commit'
	        )
	      ),
	      _react2.default.createElement(
	        'div',
	        { style: styles.elements, ref: 'container' },
	        elements
	      )
	    );
	  };
	
	  return LogMonitor;
	})(_react.Component);
	
	LogMonitor.update = _reducers2.default;
	LogMonitor.propTypes = {
	  dispatch: _react.PropTypes.func,
	  computedStates: _react.PropTypes.array,
	  actionsById: _react.PropTypes.object,
	  stagedActionIds: _react.PropTypes.array,
	  skippedActionIds: _react.PropTypes.array,
	  monitorState: _react.PropTypes.shape({
	    initialScrollTop: _react.PropTypes.number
	  }),
	
	  preserveScrollTop: _react.PropTypes.bool,
	  select: _react.PropTypes.func.isRequired,
	  theme: _react.PropTypes.oneOfType([_react.PropTypes.object, _react.PropTypes.string])
	};
	LogMonitor.defaultProps = {
	  select: function select(state) {
	    return state;
	  },
	  theme: 'nicinabox',
	  preserveScrollTop: true
	};
	exports.default = LogMonitor;

/***/ },
/* 480 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _brighten = __webpack_require__(483);
	
	var _brighten2 = _interopRequireDefault(_brighten);
	
	var _function = __webpack_require__(134);
	
	var _function2 = _interopRequireDefault(_function);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var styles = {
	  base: {
	    cursor: 'pointer',
	    fontWeight: 'bold',
	    borderRadius: 3,
	    padding: 4,
	    marginLeft: 3,
	    marginRight: 3,
	    marginTop: 5,
	    marginBottom: 5,
	    flexGrow: 1,
	    display: 'inline-block',
	    fontSize: '0.8em',
	    color: 'white',
	    textDecoration: 'none'
	  }
	};
	
	var LogMonitorButton = (function (_React$Component) {
	  _inherits(LogMonitorButton, _React$Component);
	
	  function LogMonitorButton(props) {
	    _classCallCheck(this, LogMonitorButton);
	
	    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));
	
	    _this.shouldComponentUpdate = _function2.default;
	
	    _this.handleMouseEnter = _this.handleMouseEnter.bind(_this);
	    _this.handleMouseLeave = _this.handleMouseLeave.bind(_this);
	    _this.handleMouseDown = _this.handleMouseDown.bind(_this);
	    _this.handleMouseUp = _this.handleMouseUp.bind(_this);
	    _this.onClick = _this.onClick.bind(_this);
	
	    _this.state = {
	      hovered: false,
	      active: false
	    };
	    return _this;
	  }
	
	  LogMonitorButton.prototype.handleMouseEnter = function handleMouseEnter() {
	    this.setState({ hovered: true });
	  };
	
	  LogMonitorButton.prototype.handleMouseLeave = function handleMouseLeave() {
	    this.setState({ hovered: false });
	  };
	
	  LogMonitorButton.prototype.handleMouseDown = function handleMouseDown() {
	    this.setState({ active: true });
	  };
	
	  LogMonitorButton.prototype.handleMouseUp = function handleMouseUp() {
	    this.setState({ active: false });
	  };
	
	  LogMonitorButton.prototype.onClick = function onClick() {
	    if (!this.props.enabled) {
	      return;
	    }
	    if (this.props.onClick) {
	      this.props.onClick();
	    }
	  };
	
	  LogMonitorButton.prototype.render = function render() {
	    var style = _extends({}, styles.base, {
	      backgroundColor: this.props.theme.base02
	    });
	    if (this.props.enabled && this.state.hovered) {
	      style = _extends({}, style, {
	        backgroundColor: (0, _brighten2.default)(this.props.theme.base02, 0.2)
	      });
	    }
	    if (!this.props.enabled) {
	      style = _extends({}, style, {
	        opacity: 0.2,
	        cursor: 'text',
	        backgroundColor: 'transparent'
	      });
	    }
	    return _react2.default.createElement(
	      'a',
	      { onMouseEnter: this.handleMouseEnter,
	        onMouseLeave: this.handleMouseLeave,
	        onMouseDown: this.handleMouseDown,
	        onMouseUp: this.handleMouseUp,
	        onClick: this.onClick,
	        style: style },
	      this.props.children
	    );
	  };
	
	  return LogMonitorButton;
	})(_react2.default.Component);
	
	exports.default = LogMonitorButton;

/***/ },
/* 481 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactJsonTree = __webpack_require__(216);
	
	var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);
	
	var _LogMonitorEntryAction = __webpack_require__(482);
	
	var _LogMonitorEntryAction2 = _interopRequireDefault(_LogMonitorEntryAction);
	
	var _function = __webpack_require__(134);
	
	var _function2 = _interopRequireDefault(_function);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var styles = {
	  entry: {
	    display: 'block',
	    WebkitUserSelect: 'none'
	  },
	  tree: {
	    paddingLeft: 0
	  }
	};
	
	var LogMonitorEntry = (function (_Component) {
	  _inherits(LogMonitorEntry, _Component);
	
	  function LogMonitorEntry(props) {
	    _classCallCheck(this, LogMonitorEntry);
	
	    var _this = _possibleConstructorReturn(this, _Component.call(this, props));
	
	    _this.shouldComponentUpdate = _function2.default;
	
	    _this.handleActionClick = _this.handleActionClick.bind(_this);
	    return _this;
	  }
	
	  LogMonitorEntry.prototype.printState = function printState(state, error) {
	    var errorText = error;
	    if (!errorText) {
	      try {
	        return _react2.default.createElement(_reactJsonTree2.default, {
	          theme: this.props.theme,
	          keyName: 'state',
	          data: this.props.select(state),
	          previousData: this.props.select(this.props.previousState),
	          style: styles.tree });
	      } catch (err) {
	        errorText = 'Error selecting state.';
	      }
	    }
	
	    return _react2.default.createElement(
	      'div',
	      { style: {
	          color: this.props.theme.base08,
	          paddingTop: 20,
	          paddingLeft: 30,
	          paddingRight: 30,
	          paddingBottom: 35
	        } },
	      errorText
	    );
	  };
	
	  LogMonitorEntry.prototype.handleActionClick = function handleActionClick() {
	    var _props = this.props;
	    var actionId = _props.actionId;
	    var onActionClick = _props.onActionClick;
	
	    if (actionId > 0) {
	      onActionClick(actionId);
	    }
	  };
	
	  LogMonitorEntry.prototype.render = function render() {
	    var _props2 = this.props;
	    var actionId = _props2.actionId;
	    var error = _props2.error;
	    var action = _props2.action;
	    var state = _props2.state;
	    var collapsed = _props2.collapsed;
	
	    var styleEntry = {
	      opacity: collapsed ? 0.5 : 1,
	      cursor: actionId > 0 ? 'pointer' : 'default'
	    };
	
	    return _react2.default.createElement(
	      'div',
	      { style: {
	          textDecoration: collapsed ? 'line-through' : 'none',
	          color: this.props.theme.base06
	        } },
	      _react2.default.createElement(_LogMonitorEntryAction2.default, {
	        theme: this.props.theme,
	        collapsed: collapsed,
	        action: action,
	        onClick: this.handleActionClick,
	        style: _extends({}, styles.entry, styleEntry) }),
	      !collapsed && _react2.default.createElement(
	        'div',
	        null,
	        this.printState(state, error)
	      )
	    );
	  };
	
	  return LogMonitorEntry;
	})(_react.Component);
	
	LogMonitorEntry.propTypes = {
	  state: _react.PropTypes.object.isRequired,
	  action: _react.PropTypes.object.isRequired,
	  actionId: _react.PropTypes.number.isRequired,
	  select: _react.PropTypes.func.isRequired,
	  error: _react.PropTypes.string,
	  onActionClick: _react.PropTypes.func.isRequired,
	  collapsed: _react.PropTypes.bool
	};
	exports.default = LogMonitorEntry;

/***/ },
/* 482 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactJsonTree = __webpack_require__(216);
	
	var _reactJsonTree2 = _interopRequireDefault(_reactJsonTree);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var styles = {
	  actionBar: {
	    paddingTop: 8,
	    paddingBottom: 7,
	    paddingLeft: 16
	  },
	  payload: {
	    margin: 0,
	    overflow: 'auto'
	  }
	};
	
	var LogMonitorAction = (function (_Component) {
	  _inherits(LogMonitorAction, _Component);
	
	  function LogMonitorAction() {
	    _classCallCheck(this, LogMonitorAction);
	
	    return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	  }
	
	  LogMonitorAction.prototype.renderPayload = function renderPayload(payload) {
	    return _react2.default.createElement(
	      'div',
	      { style: _extends({}, styles.payload, {
	          backgroundColor: this.props.theme.base00
	        }) },
	      Object.keys(payload).length > 0 ? _react2.default.createElement(_reactJsonTree2.default, { theme: this.props.theme, keyName: 'action', data: payload }) : ''
	    );
	  };
	
	  LogMonitorAction.prototype.render = function render() {
	    var _props$action = this.props.action;
	    var type = _props$action.type;
	
	    var payload = _objectWithoutProperties(_props$action, ['type']);
	
	    return _react2.default.createElement(
	      'div',
	      { style: _extends({
	          backgroundColor: this.props.theme.base02,
	          color: this.props.theme.base06
	        }, this.props.style) },
	      _react2.default.createElement(
	        'div',
	        { style: styles.actionBar,
	          onClick: this.props.onClick },
	        type
	      ),
	      !this.props.collapsed ? this.renderPayload(payload) : ''
	    );
	  };
	
	  return LogMonitorAction;
	})(_react.Component);
	
	exports.default = LogMonitorAction;

/***/ },
/* 483 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	
	exports.default = function (hexColor, lightness) {
	  var hex = String(hexColor).replace(/[^0-9a-f]/gi, '');
	  if (hex.length < 6) {
	    hex = hex.replace(/(.)/g, '$1$1');
	  }
	  var lum = lightness || 0;
	
	  var rgb = '#';
	  var c = undefined;
	  for (var i = 0; i < 3; ++i) {
	    c = parseInt(hex.substr(i * 2, 2), 16);
	    c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
	    rgb += ('00' + c).substr(c.length);
	  }
	  return rgb;
	};

/***/ },
/* 484 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = undefined;
	
	var _LogMonitor = __webpack_require__(479);
	
	var _LogMonitor2 = _interopRequireDefault(_LogMonitor);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = _LogMonitor2.default;

/***/ },
/* 485 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	exports.default = reducer;
	
	var _actions = __webpack_require__(215);
	
	function initialScrollTop(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
	  var action = arguments[2];
	
	  if (!props.preserveScrollTop) {
	    return 0;
	  }
	
	  return action.type === _actions.UPDATE_SCROLL_TOP ? action.scrollTop : state;
	}
	
	function reducer(props) {
	  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var action = arguments[2];
	
	  return {
	    initialScrollTop: initialScrollTop(props, state.initialScrollTop, action)
	  };
	}

/***/ },
/* 486 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _JSONArrow = __webpack_require__(128);
	
	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);
	
	var _grabNode = __webpack_require__(83);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var styles = {
	  base: {
	    position: 'relative',
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14
	  },
	  label: {
	    margin: 0,
	    padding: 0,
	    display: 'inline-block'
	  },
	  span: {
	    cursor: 'default'
	  },
	  spanType: {
	    marginLeft: 5,
	    marginRight: 5
	  }
	};
	
	var JSONArrayNode = (function (_React$Component) {
	  _inherits(JSONArrayNode, _React$Component);
	
	  function JSONArrayNode(props) {
	    _classCallCheck(this, _JSONArrayNode);
	
	    _React$Component.call(this, props);
	    this.defaultProps = {
	      data: [],
	      initialExpanded: false
	    };
	    this.needsChildNodes = true;
	    this.renderedChildren = [];
	    this.itemString = false;
	    this.state = {
	      expanded: this.props.initialExpanded,
	      createdChildNodes: false
	    };
	  }
	
	  // Returns the child nodes for each element in the array. If we have
	  // generated them previously, we return from cache, otherwise we create
	  // them.
	
	  JSONArrayNode.prototype.getChildNodes = function getChildNodes() {
	    var _this = this;
	
	    if (this.state.expanded && this.needsChildNodes) {
	      (function () {
	        var childNodes = [];
	        _this.props.data.forEach(function (element, idx) {
	          var prevData = undefined;
	          if (typeof _this.props.previousData !== 'undefined' && _this.props.previousData !== null) {
	            prevData = _this.props.previousData[idx];
	          }
	          var node = _grabNode2['default'](idx, element, prevData, _this.props.theme, _this.props.styles, _this.props.getItemString);
	          if (node !== false) {
	            childNodes.push(node);
	          }
	        });
	        _this.needsChildNodes = false;
	        _this.renderedChildren = childNodes;
	      })();
	    }
	    return this.renderedChildren;
	  };
	
	  // Returns the "n Items" string for this node, generating and
	  // caching it if it hasn't been created yet.
	
	  JSONArrayNode.prototype.getItemString = function getItemString(itemType) {
	    if (!this.itemString) {
	      this.itemString = this.props.data.length + ' item' + (this.props.data.length !== 1 ? 's' : '');
	    }
	    return this.props.getItemString('Array', this.props.data, itemType, this.itemString);
	  };
	
	  JSONArrayNode.prototype.render = function render() {
	    var childNodes = this.getChildNodes();
	    var childListStyle = {
	      padding: 0,
	      margin: 0,
	      listStyle: 'none',
	      display: this.state.expanded ? 'block' : 'none'
	    };
	    var containerStyle = undefined;
	    var spanStyle = _extends({}, styles.span, {
	      color: this.props.theme.base0E
	    });
	    containerStyle = _extends({}, styles.base);
	    if (this.state.expanded) {
	      spanStyle = _extends({}, spanStyle, {
	        color: this.props.theme.base03
	      });
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: containerStyle },
	      _react2['default'].createElement(_JSONArrow2['default'], { theme: this.props.theme, open: this.state.expanded, onClick: this.handleClick.bind(this), style: this.props.styles.getArrowStyle(this.state.expanded) }),
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Array', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({}, spanStyle, this.props.styles.getItemStringStyle('Array', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.getItemString(_react2['default'].createElement(
	          'span',
	          { style: styles.spanType },
	          '[]'
	        ))
	      ),
	      _react2['default'].createElement(
	        'ol',
	        { style: _extends({}, childListStyle, this.props.styles.getListStyle('Array', this.state.expanded)) },
	        childNodes
	      )
	    );
	  };
	
	  var _JSONArrayNode = JSONArrayNode;
	  JSONArrayNode = _reactMixin2['default'].decorate(_mixins.ExpandedStateHandlerMixin)(JSONArrayNode) || JSONArrayNode;
	  return JSONArrayNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONArrayNode;
	module.exports = exports['default'];
	
	// flag to see if we still need to render our child nodes
	
	// cache store for our child nodes
	
	// cache store for the number of items string we display

/***/ },
/* 487 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _utilsHexToRgb = __webpack_require__(41);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONBooleanNode = (function (_React$Component) {
	  _inherits(JSONBooleanNode, _React$Component);
	
	  function JSONBooleanNode() {
	    _classCallCheck(this, _JSONBooleanNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONBooleanNode.prototype.render = function render() {
	    var truthString = this.props.value ? 'true' : 'false';
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Boolean', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base09
	          }, this.props.styles.getValueStyle('Boolean', true)) },
	        truthString
	      )
	    );
	  };
	
	  var _JSONBooleanNode = JSONBooleanNode;
	  JSONBooleanNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONBooleanNode) || JSONBooleanNode;
	  return JSONBooleanNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONBooleanNode;
	module.exports = exports['default'];

/***/ },
/* 488 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _utilsHexToRgb = __webpack_require__(41);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONDateNode = (function (_React$Component) {
	  _inherits(JSONDateNode, _React$Component);
	
	  function JSONDateNode() {
	    _classCallCheck(this, _JSONDateNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONDateNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Date', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base0B
	          }, this.props.styles.getValueStyle('Date', true)) },
	        this.props.value.toISOString()
	      )
	    );
	  };
	
	  var _JSONDateNode = JSONDateNode;
	  JSONDateNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONDateNode) || JSONDateNode;
	  return JSONDateNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONDateNode;
	module.exports = exports['default'];

/***/ },
/* 489 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _utilsHexToRgb = __webpack_require__(41);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONFunctionNode = (function (_React$Component) {
	  _inherits(JSONFunctionNode, _React$Component);
	
	  function JSONFunctionNode() {
	    _classCallCheck(this, _JSONFunctionNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONFunctionNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Undefined', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base08
	          }, this.props.styles.getValueStyle('Undefined', true)) },
	        this.props.value.toString()
	      )
	    );
	  };
	
	  var _JSONFunctionNode = JSONFunctionNode;
	  JSONFunctionNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONFunctionNode) || JSONFunctionNode;
	  return JSONFunctionNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONFunctionNode;
	module.exports = exports['default'];

/***/ },
/* 490 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _getIterator = __webpack_require__(500)['default'];
	
	var _Number$isSafeInteger = __webpack_require__(501)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _JSONArrow = __webpack_require__(128);
	
	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);
	
	var _grabNode = __webpack_require__(83);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var styles = {
	  base: {
	    position: 'relative',
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14
	  },
	  label: {
	    margin: 0,
	    padding: 0,
	    display: 'inline-block'
	  },
	  span: {
	    cursor: 'default'
	  },
	  spanType: {
	    marginLeft: 5,
	    marginRight: 5
	  }
	};
	
	var JSONIterableNode = (function (_React$Component) {
	  _inherits(JSONIterableNode, _React$Component);
	
	  function JSONIterableNode(props) {
	    _classCallCheck(this, _JSONIterableNode);
	
	    _React$Component.call(this, props);
	    this.defaultProps = {
	      data: [],
	      initialExpanded: false
	    };
	    this.needsChildNodes = true;
	    this.renderedChildren = [];
	    this.itemString = false;
	    this.state = {
	      expanded: this.props.initialExpanded,
	      createdChildNodes: false
	    };
	  }
	
	  // Returns the child nodes for each entry in iterable. If we have
	  // generated them previously, we return from cache, otherwise we create
	  // them.
	
	  JSONIterableNode.prototype.getChildNodes = function getChildNodes() {
	    if (this.state.expanded && this.needsChildNodes) {
	      var childNodes = [];
	      for (var _iterator = this.props.data, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
	        var _ref;
	
	        if (_isArray) {
	          if (_i >= _iterator.length) break;
	          _ref = _iterator[_i++];
	        } else {
	          _i = _iterator.next();
	          if (_i.done) break;
	          _ref = _i.value;
	        }
	
	        var entry = _ref;
	
	        var key = null;
	        var value = null;
	        if (Array.isArray(entry)) {
	          key = entry[0];
	          value = entry[1];
	        } else {
	          key = childNodes.length;
	          value = entry;
	        }
	
	        var prevData = undefined;
	        if (typeof this.props.previousData !== 'undefined' && this.props.previousData !== null) {
	          prevData = this.props.previousData[key];
	        }
	        var node = _grabNode2['default'](key, value, prevData, this.props.theme, this.props.styles, this.props.getItemString);
	        if (node !== false) {
	          childNodes.push(node);
	        }
	      }
	      this.needsChildNodes = false;
	      this.renderedChildren = childNodes;
	    }
	    return this.renderedChildren;
	  };
	
	  // Returns the "n entries" string for this node, generating and
	  // caching it if it hasn't been created yet.
	
	  JSONIterableNode.prototype.getItemString = function getItemString(itemType) {
	    if (!this.itemString) {
	      var data = this.props.data;
	
	      var count = 0;
	      if (_Number$isSafeInteger(data.size)) {
	        count = data.size;
	      } else {
	        for (var _iterator2 = data, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _getIterator(_iterator2);;) {
	          var _ref2;
	
	          if (_isArray2) {
	            if (_i2 >= _iterator2.length) break;
	            _ref2 = _iterator2[_i2++];
	          } else {
	            _i2 = _iterator2.next();
	            if (_i2.done) break;
	            _ref2 = _i2.value;
	          }
	
	          var entry = _ref2;
	          // eslint-disable-line no-unused-vars
	          count += 1;
	        }
	      }
	      this.itemString = count + ' entr' + (count !== 1 ? 'ies' : 'y');
	    }
	    return this.props.getItemString('Iterable', this.props.data, itemType, this.itemString);
	  };
	
	  JSONIterableNode.prototype.render = function render() {
	    var childNodes = this.getChildNodes();
	    var childListStyle = {
	      padding: 0,
	      margin: 0,
	      listStyle: 'none',
	      display: this.state.expanded ? 'block' : 'none'
	    };
	    var containerStyle = undefined;
	    var spanStyle = _extends({}, styles.span, {
	      color: this.props.theme.base0E
	    });
	    containerStyle = _extends({}, styles.base);
	    if (this.state.expanded) {
	      spanStyle = _extends({}, spanStyle, {
	        color: this.props.theme.base03
	      });
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: containerStyle },
	      _react2['default'].createElement(_JSONArrow2['default'], { theme: this.props.theme, open: this.state.expanded, onClick: this.handleClick.bind(this), style: this.props.styles.getArrowStyle(this.state.expanded) }),
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Iterable', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({}, spanStyle, this.props.styles.getItemStringStyle('Iterable', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.getItemString(_react2['default'].createElement(
	          'span',
	          { style: styles.spanType },
	          '()'
	        ))
	      ),
	      _react2['default'].createElement(
	        'ol',
	        { style: _extends({}, childListStyle, this.props.styles.getListStyle('Iterable', this.state.expanded)) },
	        childNodes
	      )
	    );
	  };
	
	  var _JSONIterableNode = JSONIterableNode;
	  JSONIterableNode = _reactMixin2['default'].decorate(_mixins.ExpandedStateHandlerMixin)(JSONIterableNode) || JSONIterableNode;
	  return JSONIterableNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONIterableNode;
	module.exports = exports['default'];
	
	// flag to see if we still need to render our child nodes
	
	// cache store for our child nodes
	
	// cache store for the number of items string we display

/***/ },
/* 491 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _utilsHexToRgb = __webpack_require__(41);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONNullNode = (function (_React$Component) {
	  _inherits(JSONNullNode, _React$Component);
	
	  function JSONNullNode() {
	    _classCallCheck(this, _JSONNullNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONNullNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Null', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base08
	          }, this.props.styles.getValueStyle('Null', true)) },
	        'null'
	      )
	    );
	  };
	
	  var _JSONNullNode = JSONNullNode;
	  JSONNullNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONNullNode) || JSONNullNode;
	  return JSONNullNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONNullNode;
	module.exports = exports['default'];

/***/ },
/* 492 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _utilsHexToRgb = __webpack_require__(41);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONNumberNode = (function (_React$Component) {
	  _inherits(JSONNumberNode, _React$Component);
	
	  function JSONNumberNode() {
	    _classCallCheck(this, _JSONNumberNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONNumberNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Number', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base09
	          }, this.props.styles.getValueStyle('Number', true)) },
	        this.props.value
	      )
	    );
	  };
	
	  var _JSONNumberNode = JSONNumberNode;
	  JSONNumberNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONNumberNode) || JSONNumberNode;
	  return JSONNumberNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONNumberNode;
	module.exports = exports['default'];

/***/ },
/* 493 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _Object$keys = __webpack_require__(505)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _JSONArrow = __webpack_require__(128);
	
	var _JSONArrow2 = _interopRequireDefault(_JSONArrow);
	
	var _grabNode = __webpack_require__(83);
	
	var _grabNode2 = _interopRequireDefault(_grabNode);
	
	var styles = {
	  base: {
	    position: 'relative',
	    paddingTop: 3,
	    paddingBottom: 3,
	    marginLeft: 14
	  },
	  label: {
	    margin: 0,
	    padding: 0,
	    display: 'inline-block'
	  },
	  span: {
	    cursor: 'default'
	  },
	  spanType: {
	    marginLeft: 5,
	    marginRight: 5
	  }
	};
	
	var JSONObjectNode = (function (_React$Component) {
	  _inherits(JSONObjectNode, _React$Component);
	
	  function JSONObjectNode(props) {
	    _classCallCheck(this, _JSONObjectNode);
	
	    _React$Component.call(this, props);
	    this.defaultProps = {
	      data: [],
	      initialExpanded: false
	    };
	    this.itemString = false;
	    this.needsChildNodes = true;
	    this.renderedChildren = [];
	    this.state = {
	      expanded: this.props.initialExpanded,
	      createdChildNodes: false
	    };
	  }
	
	  // Returns the child nodes for each element in the object. If we have
	  // generated them previously, we return from cache, otherwise we create
	  // them.
	
	  JSONObjectNode.prototype.getChildNodes = function getChildNodes() {
	    if (this.state.expanded && this.needsChildNodes) {
	      var obj = this.props.data;
	      var childNodes = [];
	      for (var k in obj) {
	        if (obj.hasOwnProperty(k)) {
	          var prevData = undefined;
	          if (typeof this.props.previousData !== 'undefined' && this.props.previousData !== null) {
	            prevData = this.props.previousData[k];
	          }
	          var node = _grabNode2['default'](k, obj[k], prevData, this.props.theme, this.props.styles, this.props.getItemString);
	          if (node !== false) {
	            childNodes.push(node);
	          }
	        }
	      }
	      this.needsChildNodes = false;
	      this.renderedChildren = childNodes;
	    }
	    return this.renderedChildren;
	  };
	
	  // Returns the "n Items" string for this node, generating and
	  // caching it if it hasn't been created yet.
	
	  JSONObjectNode.prototype.getItemString = function getItemString(itemType) {
	    if (!this.itemString) {
	      var len = _Object$keys(this.props.data).length;
	      this.itemString = len + ' key' + (len !== 1 ? 's' : '');
	    }
	    return this.props.getItemString('Object', this.props.data, itemType, this.itemString);
	  };
	
	  JSONObjectNode.prototype.render = function render() {
	    var childListStyle = {
	      padding: 0,
	      margin: 0,
	      listStyle: 'none',
	      display: this.state.expanded ? 'block' : 'none'
	    };
	    var containerStyle = undefined;
	    var spanStyle = _extends({}, styles.span, {
	      color: this.props.theme.base0B
	    });
	    containerStyle = _extends({}, styles.base);
	    if (this.state.expanded) {
	      spanStyle = _extends({}, spanStyle, {
	        color: this.props.theme.base03
	      });
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: containerStyle },
	      _react2['default'].createElement(_JSONArrow2['default'], { theme: this.props.theme, open: this.state.expanded, onClick: this.handleClick.bind(this), style: this.props.styles.getArrowStyle(this.state.expanded) }),
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Object', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({}, spanStyle, this.props.styles.getItemStringStyle('Object', this.state.expanded)), onClick: this.handleClick.bind(this) },
	        this.getItemString(_react2['default'].createElement(
	          'span',
	          { style: styles.spanType },
	          '{}'
	        ))
	      ),
	      _react2['default'].createElement(
	        'ul',
	        { style: _extends({}, childListStyle, this.props.styles.getListStyle('Object', this.state.expanded)) },
	        this.getChildNodes()
	      )
	    );
	  };
	
	  var _JSONObjectNode = JSONObjectNode;
	  JSONObjectNode = _reactMixin2['default'].decorate(_mixins.ExpandedStateHandlerMixin)(JSONObjectNode) || JSONObjectNode;
	  return JSONObjectNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONObjectNode;
	module.exports = exports['default'];
	
	// cache store for the number of items string we display
	
	// flag to see if we still need to render our child nodes
	
	// cache store for our child nodes

/***/ },
/* 494 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _utilsHexToRgb = __webpack_require__(41);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONStringNode = (function (_React$Component) {
	  _inherits(JSONStringNode, _React$Component);
	
	  function JSONStringNode() {
	    _classCallCheck(this, _JSONStringNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONStringNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('String', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base0B
	          }, this.props.styles.getValueStyle('String', true)) },
	        '"',
	        this.props.value,
	        '"'
	      )
	    );
	  };
	
	  var _JSONStringNode = JSONStringNode;
	  JSONStringNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONStringNode) || JSONStringNode;
	  return JSONStringNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONStringNode;
	module.exports = exports['default'];

/***/ },
/* 495 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _inherits = __webpack_require__(13)['default'];
	
	var _classCallCheck = __webpack_require__(11)['default'];
	
	var _extends = __webpack_require__(12)['default'];
	
	var _interopRequireDefault = __webpack_require__(9)['default'];
	
	exports.__esModule = true;
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactMixin = __webpack_require__(18);
	
	var _reactMixin2 = _interopRequireDefault(_reactMixin);
	
	var _mixins = __webpack_require__(17);
	
	var _utilsHexToRgb = __webpack_require__(41);
	
	var _utilsHexToRgb2 = _interopRequireDefault(_utilsHexToRgb);
	
	var styles = {
	  base: {
	    paddingTop: 3,
	    paddingBottom: 3,
	    paddingRight: 0,
	    marginLeft: 14,
	    WebkitUserSelect: 'text',
	    MozUserSelect: 'text'
	  },
	  label: {
	    display: 'inline-block',
	    marginRight: 5
	  }
	};
	
	var JSONUndefinedNode = (function (_React$Component) {
	  _inherits(JSONUndefinedNode, _React$Component);
	
	  function JSONUndefinedNode() {
	    _classCallCheck(this, _JSONUndefinedNode);
	
	    _React$Component.apply(this, arguments);
	  }
	
	  JSONUndefinedNode.prototype.render = function render() {
	    var backgroundColor = 'transparent';
	    if (this.props.previousValue !== this.props.value) {
	      var bgColor = _utilsHexToRgb2['default'](this.props.theme.base06);
	      backgroundColor = 'rgba(' + bgColor.r + ', ' + bgColor.g + ', ' + bgColor.b + ', 0.1)';
	    }
	    return _react2['default'].createElement(
	      'li',
	      { style: _extends({}, styles.base, { backgroundColor: backgroundColor }), onClick: this.handleClick.bind(this) },
	      _react2['default'].createElement(
	        'label',
	        { style: _extends({}, styles.label, {
	            color: this.props.theme.base0D
	          }, this.props.styles.getLabelStyle('Undefined', true)) },
	        this.props.keyName,
	        ':'
	      ),
	      _react2['default'].createElement(
	        'span',
	        { style: _extends({
	            color: this.props.theme.base08
	          }, this.props.styles.getValueStyle('Undefined', true)) },
	        'undefined'
	      )
	    );
	  };
	
	  var _JSONUndefinedNode = JSONUndefinedNode;
	  JSONUndefinedNode = _reactMixin2['default'].decorate(_mixins.SquashClickEventMixin)(JSONUndefinedNode) || JSONUndefinedNode;
	  return JSONUndefinedNode;
	})(_react2['default'].Component);
	
	exports['default'] = JSONUndefinedNode;
	module.exports = exports['default'];

/***/ },
/* 496 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = {
	  handleClick: function handleClick(e) {
	    e.stopPropagation();
	    this.setState({
	      expanded: !this.state.expanded
	    });
	  },
	
	  componentWillReceiveProps: function componentWillReceiveProps() {
	    // resets our caches and flags we need to build child nodes again
	    this.renderedChildren = [];
	    this.itemString = false;
	    this.needsChildNodes = true;
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 497 */
/***/ function(module, exports) {

	"use strict";
	
	exports.__esModule = true;
	exports["default"] = {
	  handleClick: function handleClick(e) {
	    e.stopPropagation();
	  }
	};
	module.exports = exports["default"];

/***/ },
/* 498 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Symbol$iterator = __webpack_require__(507)['default'];
	
	exports.__esModule = true;
	
	exports['default'] = function (obj) {
	  if (obj !== null && typeof obj === 'object' && !Array.isArray(obj) && typeof obj[_Symbol$iterator] === 'function') {
	    return 'Iterable';
	  }
	  return Object.prototype.toString.call(obj).slice(8, -1);
	};
	
	module.exports = exports['default'];

/***/ },
/* 499 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'solarized',
	  author: 'ethan schoonover (http://ethanschoonover.com/solarized)',
	  base00: '#002b36',
	  base01: '#073642',
	  base02: '#586e75',
	  base03: '#657b83',
	  base04: '#839496',
	  base05: '#93a1a1',
	  base06: '#eee8d5',
	  base07: '#fdf6e3',
	  base08: '#dc322f',
	  base09: '#cb4b16',
	  base0A: '#b58900',
	  base0B: '#859900',
	  base0C: '#2aa198',
	  base0D: '#268bd2',
	  base0E: '#6c71c4',
	  base0F: '#d33682'
	};
	module.exports = exports['default'];

/***/ },
/* 500 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(510), __esModule: true };

/***/ },
/* 501 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(511), __esModule: true };

/***/ },
/* 502 */
[638, 512],
/* 503 */
[639, 513],
/* 504 */
[640, 514],
/* 505 */
[641, 515],
/* 506 */
[642, 516],
/* 507 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(517), __esModule: true };

/***/ },
/* 508 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _Object$defineProperty = __webpack_require__(504)["default"];
	
	exports["default"] = (function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	
	      _Object$defineProperty(target, descriptor.key, descriptor);
	    }
	  }
	
	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	})();
	
	exports.__esModule = true;

/***/ },
/* 509 */
/***/ function(module, exports) {

	"use strict";
	
	exports["default"] = function (obj) {
	  return obj && obj.__esModule ? obj["default"] : obj;
	};
	
	exports.__esModule = true;

/***/ },
/* 510 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(227);
	__webpack_require__(226);
	module.exports = __webpack_require__(536);

/***/ },
/* 511 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(538);
	module.exports = __webpack_require__(33).Number.isSafeInteger;

/***/ },
/* 512 */
[643, 539, 33],
/* 513 */
[644, 34],
/* 514 */
[645, 34],
/* 515 */
[646, 540, 33],
/* 516 */
[647, 541, 33],
/* 517 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(226);
	__webpack_require__(227);
	module.exports = __webpack_require__(53)('iterator');

/***/ },
/* 518 */
275,
/* 519 */
/***/ function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ },
/* 520 */
[649, 218, 53],
/* 521 */
[651, 130],
/* 522 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(133)
	  , floor    = Math.floor;
	module.exports = function isInteger(it){
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};

/***/ },
/* 523 */
[655, 34, 223, 224, 132, 53],
/* 524 */
/***/ function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ },
/* 525 */
151,
/* 526 */
[657, 34, 225, 221, 130],
/* 527 */
[658, 62, 33, 130],
/* 528 */
[659, 132],
/* 529 */
[660, 34, 133, 217, 219],
/* 530 */
[662, 131],
/* 531 */
[663, 532, 129],
/* 532 */
154,
/* 533 */
[664, 221, 129],
/* 534 */
155,
/* 535 */
[667, 520, 53, 84, 33],
/* 536 */
/***/ function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(217)
	  , get      = __webpack_require__(535);
	module.exports = __webpack_require__(33).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ },
/* 537 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(519)
	  , step             = __webpack_require__(524)
	  , Iterators        = __webpack_require__(84)
	  , toIObject        = __webpack_require__(533);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(222)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ },
/* 538 */
/***/ function(module, exports, __webpack_require__) {

	// 20.1.2.5 Number.isSafeInteger(number)
	var $export   = __webpack_require__(62)
	  , isInteger = __webpack_require__(522)
	  , abs       = Math.abs;
	
	$export($export.S, 'Number', {
	  isSafeInteger: function isSafeInteger(number){
	    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
	  }
	});

/***/ },
/* 539 */
[668, 62, 526],
/* 540 */
[669, 225, 527],
/* 541 */
[670, 62, 529],
/* 542 */
/***/ function(module, exports) {

	'use strict';
	
	function ToObject(val) {
		if (val == null) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}
	
		return Object(val);
	}
	
	module.exports = Object.assign || function (target, source) {
		var from;
		var keys;
		var to = ToObject(target);
	
		for (var s = 1; s < arguments.length; s++) {
			from = arguments[s];
			keys = Object.keys(Object(from));
	
			for (var i = 0; i < keys.length; i++) {
				to[keys[i]] = from[keys[i]];
			}
		}
	
		return to;
	};


/***/ },
/* 543 */
/***/ function(module, exports) {

	var objToStr = function(x){ return Object.prototype.toString.call(x); };
	
	var thrower = function(error){
	    throw error;
	};
	
	var mixins = module.exports = function makeMixinFunction(rules, _opts){
	    var opts = _opts || {};
	    if (!opts.unknownFunction) {
	        opts.unknownFunction = mixins.ONCE;
	    }
	
	    if (!opts.nonFunctionProperty) {
	        opts.nonFunctionProperty = function(left, right, key){
	            if (left !== undefined && right !== undefined) {
	                var getTypeName = function(obj){
	                    if (obj && obj.constructor && obj.constructor.name) {
	                        return obj.constructor.name;
	                    }
	                    else {
	                        return objToStr(obj).slice(8, -1);
	                    }
	                };
	                throw new TypeError('Cannot mixin key ' + key + ' because it is provided by multiple sources, '
	                        + 'and the types are ' + getTypeName(left) + ' and ' + getTypeName(right));
	            }
	            return left === undefined ? right : left;
	        };
	    }
	
	    function setNonEnumerable(target, key, value){
	        if (key in target){
	            target[key] = value;
	        }
	        else {
	            Object.defineProperty(target, key, {
	                value: value,
	                writable: true,
	                configurable: true
	            });
	        }
	    }
	
	    return function applyMixin(source, mixin){
	        Object.keys(mixin).forEach(function(key){
	            var left = source[key], right = mixin[key], rule = rules[key];
	
	            // this is just a weird case where the key was defined, but there's no value
	            // behave like the key wasn't defined
	            if (left === undefined && right === undefined) return;
	
	            var wrapIfFunction = function(thing){
	                return typeof thing !== "function" ? thing
	                : function(){
	                    return thing.call(this, arguments);
	                };
	            };
	
	            // do we have a rule for this key?
	            if (rule) {
	                // may throw here
	                var fn = rule(left, right, key);
	                setNonEnumerable(source, key, wrapIfFunction(fn));
	                return;
	            }
	
	            var leftIsFn = typeof left === "function";
	            var rightIsFn = typeof right === "function";
	
	            // check to see if they're some combination of functions or undefined
	            // we already know there's no rule, so use the unknown function behavior
	            if (leftIsFn && right === undefined
	             || rightIsFn && left === undefined
	             || leftIsFn && rightIsFn) {
	                // may throw, the default is ONCE so if both are functions
	                // the default is to throw
	                setNonEnumerable(source, key, wrapIfFunction(opts.unknownFunction(left, right, key)));
	                return;
	            }
	
	            // we have no rule for them, one may be a function but one or both aren't
	            // our default is MANY_MERGED_LOOSE which will merge objects, concat arrays
	            // and throw if there's a type mismatch or both are primitives (how do you merge 3, and "foo"?)
	            source[key] = opts.nonFunctionProperty(left, right, key);
	        });
	    };
	};
	
	mixins._mergeObjects = function(obj1, obj2) {
	    var assertObject = function(obj, obj2){
	        var type = objToStr(obj);
	        if (type !== '[object Object]') {
	            var displayType = obj.constructor ? obj.constructor.name : 'Unknown';
	            var displayType2 = obj2.constructor ? obj2.constructor.name : 'Unknown';
	            thrower('cannot merge returned value of type ' + displayType + ' with an ' + displayType2);
	        }
	    };
	
	    if (Array.isArray(obj1) && Array.isArray(obj2)) {
	        return obj1.concat(obj2);
	    }
	
	    assertObject(obj1, obj2);
	    assertObject(obj2, obj1);
	
	    var result = {};
	    Object.keys(obj1).forEach(function(k){
	        if (Object.prototype.hasOwnProperty.call(obj2, k)) {
	            thrower('cannot merge returns because both have the ' + JSON.stringify(k) + ' key');
	        }
	        result[k] = obj1[k];
	    });
	
	    Object.keys(obj2).forEach(function(k){
	        // we can skip the conflict check because all conflicts would already be found
	        result[k] = obj2[k];
	    });
	    return result;
	
	}
	
	// define our built-in mixin types
	mixins.ONCE = function(left, right, key){
	    if (left && right) {
	        throw new TypeError('Cannot mixin ' + key + ' because it has a unique constraint.');
	    }
	
	    var fn = left || right;
	
	    return function(args){
	        return fn.apply(this, args);
	    };
	};
	
	mixins.MANY = function(left, right, key){
	    return function(args){
	        if (right) right.apply(this, args);
	        return left ? left.apply(this, args) : undefined;
	    };
	};
	
	mixins.MANY_MERGED_LOOSE = function(left, right, key) {
	    if(left && right) {
	        return mixins._mergeObjects(left, right);
	    }
	
	    return left || right;
	}
	
	mixins.MANY_MERGED = function(left, right, key){
	    return function(args){
	        var res1 = right && right.apply(this, args);
	        var res2 = left && left.apply(this, args);
	        if (res1 && res2) {
	            return mixins._mergeObjects(res1, res2)
	        }
	        return res2 || res1;
	    };
	};
	
	
	mixins.REDUCE_LEFT = function(_left, _right, key){
	    var left = _left || function(x){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return right.call(this, left.apply(this, args));
	    };
	};
	
	mixins.REDUCE_RIGHT = function(_left, _right, key){
	    var left = _left || function(x){ return x };
	    var right = _right || function(x){ return x };
	    return function(args){
	        return left.call(this, right.apply(this, args));
	    };
	};
	


/***/ },
/* 544 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = shallowEqual;
	
	function shallowEqual(objA, objB) {
	  if (objA === objB) {
	    return true;
	  }
	
	  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
	    return false;
	  }
	
	  var keysA = Object.keys(objA);
	  var keysB = Object.keys(objB);
	
	  if (keysA.length !== keysB.length) {
	    return false;
	  }
	
	  // Test for A's keys different from B.
	  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);
	  for (var i = 0; i < keysA.length; i++) {
	    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
	      return false;
	    }
	  }
	
	  return true;
	}
	
	module.exports = exports['default'];

/***/ },
/* 545 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	function _interopExportWildcard(obj, defaults) { var newObj = defaults({}, obj); delete newObj['default']; return newObj; }
	
	function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }
	
	var _base16 = __webpack_require__(569);
	
	_defaults(exports, _interopExportWildcard(_base16, _defaults));
	
	var _nicinabox = __webpack_require__(546);
	
	exports.nicinabox = _interopRequire(_nicinabox);

/***/ },
/* 546 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'nicinabox',
	  author: 'nicinabox (http://github.com/nicinabox)',
	  base00: '#2A2F3A',
	  base01: '#3C444F',
	  base02: '#4F5A65',
	  base03: '#BEBEBE',
	  base04: '#b0b0b0', // based on ocean theme
	  base05: '#d0d0d0', // based on ocean theme
	  base06: '#FFFFFF',
	  base07: '#f5f5f5', // based on ocean theme
	  base08: '#fb9fb1', // based on ocean theme
	  base09: '#FC6D24',
	  base0A: '#ddb26f', // based on ocean theme
	  base0B: '#A1C659',
	  base0C: '#12cfc0', // based on ocean theme
	  base0D: '#6FB3D2',
	  base0E: '#D381C3',
	  base0F: '#deaf8f' // based on ocean theme
	};
	module.exports = exports['default'];

/***/ },
/* 547 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'apathy',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#031A16',
	  base01: '#0B342D',
	  base02: '#184E45',
	  base03: '#2B685E',
	  base04: '#5F9C92',
	  base05: '#81B5AC',
	  base06: '#A7CEC8',
	  base07: '#D2E7E4',
	  base08: '#3E9688',
	  base09: '#3E7996',
	  base0A: '#3E4C96',
	  base0B: '#883E96',
	  base0C: '#963E4C',
	  base0D: '#96883E',
	  base0E: '#4C963E',
	  base0F: '#3E965B'
	};
	module.exports = exports['default'];

/***/ },
/* 548 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'ashes',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#1C2023',
	  base01: '#393F45',
	  base02: '#565E65',
	  base03: '#747C84',
	  base04: '#ADB3BA',
	  base05: '#C7CCD1',
	  base06: '#DFE2E5',
	  base07: '#F3F4F5',
	  base08: '#C7AE95',
	  base09: '#C7C795',
	  base0A: '#AEC795',
	  base0B: '#95C7AE',
	  base0C: '#95AEC7',
	  base0D: '#AE95C7',
	  base0E: '#C795AE',
	  base0F: '#C79595'
	};
	module.exports = exports['default'];

/***/ },
/* 549 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier dune',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/dune)',
	  base00: '#20201d',
	  base01: '#292824',
	  base02: '#6e6b5e',
	  base03: '#7d7a68',
	  base04: '#999580',
	  base05: '#a6a28c',
	  base06: '#e8e4cf',
	  base07: '#fefbec',
	  base08: '#d73737',
	  base09: '#b65611',
	  base0A: '#cfb017',
	  base0B: '#60ac39',
	  base0C: '#1fad83',
	  base0D: '#6684e1',
	  base0E: '#b854d4',
	  base0F: '#d43552'
	};
	module.exports = exports['default'];

/***/ },
/* 550 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier forest',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)',
	  base00: '#1b1918',
	  base01: '#2c2421',
	  base02: '#68615e',
	  base03: '#766e6b',
	  base04: '#9c9491',
	  base05: '#a8a19f',
	  base06: '#e6e2e0',
	  base07: '#f1efee',
	  base08: '#f22c40',
	  base09: '#df5320',
	  base0A: '#d5911a',
	  base0B: '#5ab738',
	  base0C: '#00ad9c',
	  base0D: '#407ee7',
	  base0E: '#6666ea',
	  base0F: '#c33ff3'
	};
	module.exports = exports['default'];

/***/ },
/* 551 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier heath',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/heath)',
	  base00: '#1b181b',
	  base01: '#292329',
	  base02: '#695d69',
	  base03: '#776977',
	  base04: '#9e8f9e',
	  base05: '#ab9bab',
	  base06: '#d8cad8',
	  base07: '#f7f3f7',
	  base08: '#ca402b',
	  base09: '#a65926',
	  base0A: '#bb8a35',
	  base0B: '#379a37',
	  base0C: '#159393',
	  base0D: '#516aec',
	  base0E: '#7b59c0',
	  base0F: '#cc33cc'
	};
	module.exports = exports['default'];

/***/ },
/* 552 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier lakeside',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/lakeside/)',
	  base00: '#161b1d',
	  base01: '#1f292e',
	  base02: '#516d7b',
	  base03: '#5a7b8c',
	  base04: '#7195a8',
	  base05: '#7ea2b4',
	  base06: '#c1e4f6',
	  base07: '#ebf8ff',
	  base08: '#d22d72',
	  base09: '#935c25',
	  base0A: '#8a8a0f',
	  base0B: '#568c3b',
	  base0C: '#2d8f6f',
	  base0D: '#257fad',
	  base0E: '#5d5db1',
	  base0F: '#b72dd2'
	};
	module.exports = exports['default'];

/***/ },
/* 553 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'atelier seaside',
	  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/seaside/)',
	  base00: '#131513',
	  base01: '#242924',
	  base02: '#5e6e5e',
	  base03: '#687d68',
	  base04: '#809980',
	  base05: '#8ca68c',
	  base06: '#cfe8cf',
	  base07: '#f0fff0',
	  base08: '#e6193c',
	  base09: '#87711d',
	  base0A: '#c3c322',
	  base0B: '#29a329',
	  base0C: '#1999b3',
	  base0D: '#3d62f5',
	  base0E: '#ad2bee',
	  base0F: '#e619c3'
	};
	module.exports = exports['default'];

/***/ },
/* 554 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'bespin',
	  author: 'jan t. sott',
	  base00: '#28211c',
	  base01: '#36312e',
	  base02: '#5e5d5c',
	  base03: '#666666',
	  base04: '#797977',
	  base05: '#8a8986',
	  base06: '#9d9b97',
	  base07: '#baae9e',
	  base08: '#cf6a4c',
	  base09: '#cf7d34',
	  base0A: '#f9ee98',
	  base0B: '#54be0d',
	  base0C: '#afc4db',
	  base0D: '#5ea6ea',
	  base0E: '#9b859d',
	  base0F: '#937121'
	};
	module.exports = exports['default'];

/***/ },
/* 555 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'brewer',
	  author: 'timothée poisot (http://github.com/tpoisot)',
	  base00: '#0c0d0e',
	  base01: '#2e2f30',
	  base02: '#515253',
	  base03: '#737475',
	  base04: '#959697',
	  base05: '#b7b8b9',
	  base06: '#dadbdc',
	  base07: '#fcfdfe',
	  base08: '#e31a1c',
	  base09: '#e6550d',
	  base0A: '#dca060',
	  base0B: '#31a354',
	  base0C: '#80b1d3',
	  base0D: '#3182bd',
	  base0E: '#756bb1',
	  base0F: '#b15928'
	};
	module.exports = exports['default'];

/***/ },
/* 556 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'bright',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#000000',
	  base01: '#303030',
	  base02: '#505050',
	  base03: '#b0b0b0',
	  base04: '#d0d0d0',
	  base05: '#e0e0e0',
	  base06: '#f5f5f5',
	  base07: '#ffffff',
	  base08: '#fb0120',
	  base09: '#fc6d24',
	  base0A: '#fda331',
	  base0B: '#a1c659',
	  base0C: '#76c7b7',
	  base0D: '#6fb3d2',
	  base0E: '#d381c3',
	  base0F: '#be643c'
	};
	module.exports = exports['default'];

/***/ },
/* 557 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'chalk',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#151515',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#b0b0b0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#f5f5f5',
	  base08: '#fb9fb1',
	  base09: '#eda987',
	  base0A: '#ddb26f',
	  base0B: '#acc267',
	  base0C: '#12cfc0',
	  base0D: '#6fc2ef',
	  base0E: '#e1a3ee',
	  base0F: '#deaf8f'
	};
	module.exports = exports['default'];

/***/ },
/* 558 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'codeschool',
	  author: 'brettof86',
	  base00: '#232c31',
	  base01: '#1c3657',
	  base02: '#2a343a',
	  base03: '#3f4944',
	  base04: '#84898c',
	  base05: '#9ea7a6',
	  base06: '#a7cfa3',
	  base07: '#b5d8f6',
	  base08: '#2a5491',
	  base09: '#43820d',
	  base0A: '#a03b1e',
	  base0B: '#237986',
	  base0C: '#b02f30',
	  base0D: '#484d79',
	  base0E: '#c59820',
	  base0F: '#c98344'
	};
	module.exports = exports['default'];

/***/ },
/* 559 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'colors',
	  author: 'mrmrs (http://clrs.cc)',
	  base00: '#111111',
	  base01: '#333333',
	  base02: '#555555',
	  base03: '#777777',
	  base04: '#999999',
	  base05: '#bbbbbb',
	  base06: '#dddddd',
	  base07: '#ffffff',
	  base08: '#ff4136',
	  base09: '#ff851b',
	  base0A: '#ffdc00',
	  base0B: '#2ecc40',
	  base0C: '#7fdbff',
	  base0D: '#0074d9',
	  base0E: '#b10dc9',
	  base0F: '#85144b'
	};
	module.exports = exports['default'];

/***/ },
/* 560 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'default',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#181818',
	  base01: '#282828',
	  base02: '#383838',
	  base03: '#585858',
	  base04: '#b8b8b8',
	  base05: '#d8d8d8',
	  base06: '#e8e8e8',
	  base07: '#f8f8f8',
	  base08: '#ab4642',
	  base09: '#dc9656',
	  base0A: '#f7ca88',
	  base0B: '#a1b56c',
	  base0C: '#86c1b9',
	  base0D: '#7cafc2',
	  base0E: '#ba8baf',
	  base0F: '#a16946'
	};
	module.exports = exports['default'];

/***/ },
/* 561 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'eighties',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2d2d2d',
	  base01: '#393939',
	  base02: '#515151',
	  base03: '#747369',
	  base04: '#a09f93',
	  base05: '#d3d0c8',
	  base06: '#e8e6df',
	  base07: '#f2f0ec',
	  base08: '#f2777a',
	  base09: '#f99157',
	  base0A: '#ffcc66',
	  base0B: '#99cc99',
	  base0C: '#66cccc',
	  base0D: '#6699cc',
	  base0E: '#cc99cc',
	  base0F: '#d27b53'
	};
	module.exports = exports['default'];

/***/ },
/* 562 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'embers',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#16130F',
	  base01: '#2C2620',
	  base02: '#433B32',
	  base03: '#5A5047',
	  base04: '#8A8075',
	  base05: '#A39A90',
	  base06: '#BEB6AE',
	  base07: '#DBD6D1',
	  base08: '#826D57',
	  base09: '#828257',
	  base0A: '#6D8257',
	  base0B: '#57826D',
	  base0C: '#576D82',
	  base0D: '#6D5782',
	  base0E: '#82576D',
	  base0F: '#825757'
	};
	module.exports = exports['default'];

/***/ },
/* 563 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'flat',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2C3E50',
	  base01: '#34495E',
	  base02: '#7F8C8D',
	  base03: '#95A5A6',
	  base04: '#BDC3C7',
	  base05: '#e0e0e0',
	  base06: '#f5f5f5',
	  base07: '#ECF0F1',
	  base08: '#E74C3C',
	  base09: '#E67E22',
	  base0A: '#F1C40F',
	  base0B: '#2ECC71',
	  base0C: '#1ABC9C',
	  base0D: '#3498DB',
	  base0E: '#9B59B6',
	  base0F: '#be643c'
	};
	module.exports = exports['default'];

/***/ },
/* 564 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'google',
	  author: 'seth wright (http://sethawright.com)',
	  base00: '#1d1f21',
	  base01: '#282a2e',
	  base02: '#373b41',
	  base03: '#969896',
	  base04: '#b4b7b4',
	  base05: '#c5c8c6',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#CC342B',
	  base09: '#F96A38',
	  base0A: '#FBA922',
	  base0B: '#198844',
	  base0C: '#3971ED',
	  base0D: '#3971ED',
	  base0E: '#A36AC7',
	  base0F: '#3971ED'
	};
	module.exports = exports['default'];

/***/ },
/* 565 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'grayscale',
	  author: 'alexandre gavioli (https://github.com/alexx2/)',
	  base00: '#101010',
	  base01: '#252525',
	  base02: '#464646',
	  base03: '#525252',
	  base04: '#ababab',
	  base05: '#b9b9b9',
	  base06: '#e3e3e3',
	  base07: '#f7f7f7',
	  base08: '#7c7c7c',
	  base09: '#999999',
	  base0A: '#a0a0a0',
	  base0B: '#8e8e8e',
	  base0C: '#868686',
	  base0D: '#686868',
	  base0E: '#747474',
	  base0F: '#5e5e5e'
	};
	module.exports = exports['default'];

/***/ },
/* 566 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'green screen',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#001100',
	  base01: '#003300',
	  base02: '#005500',
	  base03: '#007700',
	  base04: '#009900',
	  base05: '#00bb00',
	  base06: '#00dd00',
	  base07: '#00ff00',
	  base08: '#007700',
	  base09: '#009900',
	  base0A: '#007700',
	  base0B: '#00bb00',
	  base0C: '#005500',
	  base0D: '#009900',
	  base0E: '#00bb00',
	  base0F: '#005500'
	};
	module.exports = exports['default'];

/***/ },
/* 567 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'harmonic16',
	  author: 'jannik siebert (https://github.com/janniks)',
	  base00: '#0b1c2c',
	  base01: '#223b54',
	  base02: '#405c79',
	  base03: '#627e99',
	  base04: '#aabcce',
	  base05: '#cbd6e2',
	  base06: '#e5ebf1',
	  base07: '#f7f9fb',
	  base08: '#bf8b56',
	  base09: '#bfbf56',
	  base0A: '#8bbf56',
	  base0B: '#56bf8b',
	  base0C: '#568bbf',
	  base0D: '#8b56bf',
	  base0E: '#bf568b',
	  base0F: '#bf5656'
	};
	module.exports = exports['default'];

/***/ },
/* 568 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'hopscotch',
	  author: 'jan t. sott',
	  base00: '#322931',
	  base01: '#433b42',
	  base02: '#5c545b',
	  base03: '#797379',
	  base04: '#989498',
	  base05: '#b9b5b8',
	  base06: '#d5d3d5',
	  base07: '#ffffff',
	  base08: '#dd464c',
	  base09: '#fd8b19',
	  base0A: '#fdcc59',
	  base0B: '#8fc13e',
	  base0C: '#149b93',
	  base0D: '#1290bf',
	  base0E: '#c85e7c',
	  base0F: '#b33508'
	};
	module.exports = exports['default'];

/***/ },
/* 569 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }
	
	var _threezerotwofour = __webpack_require__(581);
	
	exports.threezerotwofour = _interopRequire(_threezerotwofour);
	
	var _apathy = __webpack_require__(547);
	
	exports.apathy = _interopRequire(_apathy);
	
	var _ashes = __webpack_require__(548);
	
	exports.ashes = _interopRequire(_ashes);
	
	var _atelierDune = __webpack_require__(549);
	
	exports.atelierDune = _interopRequire(_atelierDune);
	
	var _atelierForest = __webpack_require__(550);
	
	exports.atelierForest = _interopRequire(_atelierForest);
	
	var _atelierHeath = __webpack_require__(551);
	
	exports.atelierHeath = _interopRequire(_atelierHeath);
	
	var _atelierLakeside = __webpack_require__(552);
	
	exports.atelierLakeside = _interopRequire(_atelierLakeside);
	
	var _atelierSeaside = __webpack_require__(553);
	
	exports.atelierSeaside = _interopRequire(_atelierSeaside);
	
	var _bespin = __webpack_require__(554);
	
	exports.bespin = _interopRequire(_bespin);
	
	var _brewer = __webpack_require__(555);
	
	exports.brewer = _interopRequire(_brewer);
	
	var _bright = __webpack_require__(556);
	
	exports.bright = _interopRequire(_bright);
	
	var _chalk = __webpack_require__(557);
	
	exports.chalk = _interopRequire(_chalk);
	
	var _codeschool = __webpack_require__(558);
	
	exports.codeschool = _interopRequire(_codeschool);
	
	var _colors = __webpack_require__(559);
	
	exports.colors = _interopRequire(_colors);
	
	var _default = __webpack_require__(560);
	
	exports['default'] = _interopRequire(_default);
	
	var _eighties = __webpack_require__(561);
	
	exports.eighties = _interopRequire(_eighties);
	
	var _embers = __webpack_require__(562);
	
	exports.embers = _interopRequire(_embers);
	
	var _flat = __webpack_require__(563);
	
	exports.flat = _interopRequire(_flat);
	
	var _google = __webpack_require__(564);
	
	exports.google = _interopRequire(_google);
	
	var _grayscale = __webpack_require__(565);
	
	exports.grayscale = _interopRequire(_grayscale);
	
	var _greenscreen = __webpack_require__(566);
	
	exports.greenscreen = _interopRequire(_greenscreen);
	
	var _harmonic = __webpack_require__(567);
	
	exports.harmonic = _interopRequire(_harmonic);
	
	var _hopscotch = __webpack_require__(568);
	
	exports.hopscotch = _interopRequire(_hopscotch);
	
	var _isotope = __webpack_require__(570);
	
	exports.isotope = _interopRequire(_isotope);
	
	var _marrakesh = __webpack_require__(571);
	
	exports.marrakesh = _interopRequire(_marrakesh);
	
	var _mocha = __webpack_require__(572);
	
	exports.mocha = _interopRequire(_mocha);
	
	var _monokai = __webpack_require__(573);
	
	exports.monokai = _interopRequire(_monokai);
	
	var _ocean = __webpack_require__(574);
	
	exports.ocean = _interopRequire(_ocean);
	
	var _paraiso = __webpack_require__(575);
	
	exports.paraiso = _interopRequire(_paraiso);
	
	var _pop = __webpack_require__(576);
	
	exports.pop = _interopRequire(_pop);
	
	var _railscasts = __webpack_require__(577);
	
	exports.railscasts = _interopRequire(_railscasts);
	
	var _shapeshifter = __webpack_require__(578);
	
	exports.shapeshifter = _interopRequire(_shapeshifter);
	
	var _solarized = __webpack_require__(579);
	
	exports.solarized = _interopRequire(_solarized);
	
	var _summerfruit = __webpack_require__(580);
	
	exports.summerfruit = _interopRequire(_summerfruit);
	
	var _tomorrow = __webpack_require__(582);
	
	exports.tomorrow = _interopRequire(_tomorrow);
	
	var _tube = __webpack_require__(583);
	
	exports.tube = _interopRequire(_tube);
	
	var _twilight = __webpack_require__(584);
	
	exports.twilight = _interopRequire(_twilight);

/***/ },
/* 570 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'isotope',
	  author: 'jan t. sott',
	  base00: '#000000',
	  base01: '#404040',
	  base02: '#606060',
	  base03: '#808080',
	  base04: '#c0c0c0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#ff0000',
	  base09: '#ff9900',
	  base0A: '#ff0099',
	  base0B: '#33ff00',
	  base0C: '#00ffff',
	  base0D: '#0066ff',
	  base0E: '#cc00ff',
	  base0F: '#3300ff'
	};
	module.exports = exports['default'];

/***/ },
/* 571 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'marrakesh',
	  author: 'alexandre gavioli (http://github.com/alexx2/)',
	  base00: '#201602',
	  base01: '#302e00',
	  base02: '#5f5b17',
	  base03: '#6c6823',
	  base04: '#86813b',
	  base05: '#948e48',
	  base06: '#ccc37a',
	  base07: '#faf0a5',
	  base08: '#c35359',
	  base09: '#b36144',
	  base0A: '#a88339',
	  base0B: '#18974e',
	  base0C: '#75a738',
	  base0D: '#477ca1',
	  base0E: '#8868b3',
	  base0F: '#b3588e'
	};
	module.exports = exports['default'];

/***/ },
/* 572 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'mocha',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#3B3228',
	  base01: '#534636',
	  base02: '#645240',
	  base03: '#7e705a',
	  base04: '#b8afad',
	  base05: '#d0c8c6',
	  base06: '#e9e1dd',
	  base07: '#f5eeeb',
	  base08: '#cb6077',
	  base09: '#d28b71',
	  base0A: '#f4bc87',
	  base0B: '#beb55b',
	  base0C: '#7bbda4',
	  base0D: '#8ab3b5',
	  base0E: '#a89bb9',
	  base0F: '#bb9584'
	};
	module.exports = exports['default'];

/***/ },
/* 573 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'monokai',
	  author: 'wimer hazenberg (http://www.monokai.nl)',
	  base00: '#272822',
	  base01: '#383830',
	  base02: '#49483e',
	  base03: '#75715e',
	  base04: '#a59f85',
	  base05: '#f8f8f2',
	  base06: '#f5f4f1',
	  base07: '#f9f8f5',
	  base08: '#f92672',
	  base09: '#fd971f',
	  base0A: '#f4bf75',
	  base0B: '#a6e22e',
	  base0C: '#a1efe4',
	  base0D: '#66d9ef',
	  base0E: '#ae81ff',
	  base0F: '#cc6633'
	};
	module.exports = exports['default'];

/***/ },
/* 574 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'ocean',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#2b303b',
	  base01: '#343d46',
	  base02: '#4f5b66',
	  base03: '#65737e',
	  base04: '#a7adba',
	  base05: '#c0c5ce',
	  base06: '#dfe1e8',
	  base07: '#eff1f5',
	  base08: '#bf616a',
	  base09: '#d08770',
	  base0A: '#ebcb8b',
	  base0B: '#a3be8c',
	  base0C: '#96b5b4',
	  base0D: '#8fa1b3',
	  base0E: '#b48ead',
	  base0F: '#ab7967'
	};
	module.exports = exports['default'];

/***/ },
/* 575 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'paraiso',
	  author: 'jan t. sott',
	  base00: '#2f1e2e',
	  base01: '#41323f',
	  base02: '#4f424c',
	  base03: '#776e71',
	  base04: '#8d8687',
	  base05: '#a39e9b',
	  base06: '#b9b6b0',
	  base07: '#e7e9db',
	  base08: '#ef6155',
	  base09: '#f99b15',
	  base0A: '#fec418',
	  base0B: '#48b685',
	  base0C: '#5bc4bf',
	  base0D: '#06b6ef',
	  base0E: '#815ba4',
	  base0F: '#e96ba8'
	};
	module.exports = exports['default'];

/***/ },
/* 576 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'pop',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#000000',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#b0b0b0',
	  base05: '#d0d0d0',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#eb008a',
	  base09: '#f29333',
	  base0A: '#f8ca12',
	  base0B: '#37b349',
	  base0C: '#00aabb',
	  base0D: '#0e5a94',
	  base0E: '#b31e8d',
	  base0F: '#7a2d00'
	};
	module.exports = exports['default'];

/***/ },
/* 577 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'railscasts',
	  author: 'ryan bates (http://railscasts.com)',
	  base00: '#2b2b2b',
	  base01: '#272935',
	  base02: '#3a4055',
	  base03: '#5a647e',
	  base04: '#d4cfc9',
	  base05: '#e6e1dc',
	  base06: '#f4f1ed',
	  base07: '#f9f7f3',
	  base08: '#da4939',
	  base09: '#cc7833',
	  base0A: '#ffc66d',
	  base0B: '#a5c261',
	  base0C: '#519f50',
	  base0D: '#6d9cbe',
	  base0E: '#b6b3eb',
	  base0F: '#bc9458'
	};
	module.exports = exports['default'];

/***/ },
/* 578 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'shapeshifter',
	  author: 'tyler benziger (http://tybenz.com)',
	  base00: '#000000',
	  base01: '#040404',
	  base02: '#102015',
	  base03: '#343434',
	  base04: '#555555',
	  base05: '#ababab',
	  base06: '#e0e0e0',
	  base07: '#f9f9f9',
	  base08: '#e92f2f',
	  base09: '#e09448',
	  base0A: '#dddd13',
	  base0B: '#0ed839',
	  base0C: '#23edda',
	  base0D: '#3b48e3',
	  base0E: '#f996e2',
	  base0F: '#69542d'
	};
	module.exports = exports['default'];

/***/ },
/* 579 */
499,
/* 580 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'summerfruit',
	  author: 'christopher corley (http://cscorley.github.io/)',
	  base00: '#151515',
	  base01: '#202020',
	  base02: '#303030',
	  base03: '#505050',
	  base04: '#B0B0B0',
	  base05: '#D0D0D0',
	  base06: '#E0E0E0',
	  base07: '#FFFFFF',
	  base08: '#FF0086',
	  base09: '#FD8900',
	  base0A: '#ABA800',
	  base0B: '#00C918',
	  base0C: '#1faaaa',
	  base0D: '#3777E6',
	  base0E: '#AD00A1',
	  base0F: '#cc6633'
	};
	module.exports = exports['default'];

/***/ },
/* 581 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'threezerotwofour',
	  author: 'jan t. sott (http://github.com/idleberg)',
	  base00: '#090300',
	  base01: '#3a3432',
	  base02: '#4a4543',
	  base03: '#5c5855',
	  base04: '#807d7c',
	  base05: '#a5a2a2',
	  base06: '#d6d5d4',
	  base07: '#f7f7f7',
	  base08: '#db2d20',
	  base09: '#e8bbd0',
	  base0A: '#fded02',
	  base0B: '#01a252',
	  base0C: '#b5e4f4',
	  base0D: '#01a0e4',
	  base0E: '#a16a94',
	  base0F: '#cdab53'
	};
	module.exports = exports['default'];

/***/ },
/* 582 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'tomorrow',
	  author: 'chris kempson (http://chriskempson.com)',
	  base00: '#1d1f21',
	  base01: '#282a2e',
	  base02: '#373b41',
	  base03: '#969896',
	  base04: '#b4b7b4',
	  base05: '#c5c8c6',
	  base06: '#e0e0e0',
	  base07: '#ffffff',
	  base08: '#cc6666',
	  base09: '#de935f',
	  base0A: '#f0c674',
	  base0B: '#b5bd68',
	  base0C: '#8abeb7',
	  base0D: '#81a2be',
	  base0E: '#b294bb',
	  base0F: '#a3685a'
	};
	module.exports = exports['default'];

/***/ },
/* 583 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'london tube',
	  author: 'jan t. sott',
	  base00: '#231f20',
	  base01: '#1c3f95',
	  base02: '#5a5758',
	  base03: '#737171',
	  base04: '#959ca1',
	  base05: '#d9d8d8',
	  base06: '#e7e7e8',
	  base07: '#ffffff',
	  base08: '#ee2e24',
	  base09: '#f386a1',
	  base0A: '#ffd204',
	  base0B: '#00853e',
	  base0C: '#85cebc',
	  base0D: '#009ddc',
	  base0E: '#98005d',
	  base0F: '#b06110'
	};
	module.exports = exports['default'];

/***/ },
/* 584 */
/***/ function(module, exports) {

	'use strict';
	
	exports.__esModule = true;
	exports['default'] = {
	  scheme: 'twilight',
	  author: 'david hart (http://hart-dev.com)',
	  base00: '#1e1e1e',
	  base01: '#323537',
	  base02: '#464b50',
	  base03: '#5f5a60',
	  base04: '#838184',
	  base05: '#a7a7a7',
	  base06: '#c3c3c3',
	  base07: '#ffffff',
	  base08: '#cf6a4c',
	  base09: '#cda869',
	  base0A: '#f9ee98',
	  base0B: '#8f9d6a',
	  base0C: '#afc4db',
	  base0D: '#7587a6',
	  base0E: '#9b859d',
	  base0F: '#9b703f'
	};
	module.exports = exports['default'];

/***/ },
/* 585 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	exports['default'] = createDevTools;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var _react = __webpack_require__(1);
	
	var _react2 = _interopRequireDefault(_react);
	
	var _reactRedux = __webpack_require__(47);
	
	var _instrument = __webpack_require__(229);
	
	var _instrument2 = _interopRequireDefault(_instrument);
	
	function createDevTools(children) {
	  var monitorElement = _react.Children.only(children);
	  var monitorProps = monitorElement.props;
	  var Monitor = monitorElement.type;
	  var ConnectedMonitor = _reactRedux.connect(function (state) {
	    return state;
	  })(Monitor);
	  var enhancer = _instrument2['default'](function (state, action) {
	    return Monitor.update(monitorProps, state, action);
	  });
	
	  return (function (_Component) {
	    _inherits(DevTools, _Component);
	
	    _createClass(DevTools, null, [{
	      key: 'contextTypes',
	      value: {
	        store: _react.PropTypes.object
	      },
	      enumerable: true
	    }, {
	      key: 'propTypes',
	      value: {
	        store: _react.PropTypes.object
	      },
	      enumerable: true
	    }, {
	      key: 'instrument',
	      value: function value() {
	        return enhancer;
	      },
	      enumerable: true
	    }]);
	
	    function DevTools(props, context) {
	      _classCallCheck(this, DevTools);
	
	      _Component.call(this, props, context);
	      if (context.store) {
	        this.liftedStore = context.store.liftedStore;
	      } else {
	        this.liftedStore = props.store.liftedStore;
	      }
	    }
	
	    DevTools.prototype.render = function render() {
	      return _react2['default'].createElement(ConnectedMonitor, _extends({}, monitorProps, {
	        store: this.liftedStore }));
	    };
	
	    return DevTools;
	  })(_react.Component);
	}
	
	module.exports = exports['default'];

/***/ },
/* 586 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	exports.__esModule = true;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports['default'] = persistState;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _lodashObjectMapValues = __webpack_require__(623);
	
	var _lodashObjectMapValues2 = _interopRequireDefault(_lodashObjectMapValues);
	
	var _lodashUtilityIdentity = __webpack_require__(137);
	
	var _lodashUtilityIdentity2 = _interopRequireDefault(_lodashUtilityIdentity);
	
	function persistState(sessionId) {
	  var deserializeState = arguments.length <= 1 || arguments[1] === undefined ? _lodashUtilityIdentity2['default'] : arguments[1];
	  var deserializeAction = arguments.length <= 2 || arguments[2] === undefined ? _lodashUtilityIdentity2['default'] : arguments[2];
	
	  if (!sessionId) {
	    return function (next) {
	      return function () {
	        return next.apply(undefined, arguments);
	      };
	    };
	  }
	
	  function deserialize(state) {
	    return _extends({}, state, {
	      actionsById: _lodashObjectMapValues2['default'](state.actionsById, function (liftedAction) {
	        return _extends({}, liftedAction, {
	          action: deserializeAction(liftedAction.action)
	        });
	      }),
	      committedState: deserializeState(state.committedState),
	      computedStates: state.computedStates.map(function (computedState) {
	        return _extends({}, computedState, {
	          state: deserializeState(computedState.state)
	        });
	      })
	    });
	  }
	
	  return function (next) {
	    return function (reducer, initialState) {
	      var key = 'redux-dev-session-' + sessionId;
	
	      var finalInitialState = undefined;
	      try {
	        var json = localStorage.getItem(key);
	        if (json) {
	          finalInitialState = deserialize(JSON.parse(json)) || initialState;
	          next(reducer, initialState);
	        }
	      } catch (e) {
	        console.warn('Could not read debug session from localStorage:', e);
	        try {
	          localStorage.removeItem(key);
	        } finally {
	          finalInitialState = undefined;
	        }
	      }
	
	      var store = next(reducer, finalInitialState);
	
	      return _extends({}, store, {
	        dispatch: function dispatch(action) {
	          store.dispatch(action);
	
	          try {
	            localStorage.setItem(key, JSON.stringify(store.getState()));
	          } catch (e) {
	            console.warn('Could not write debug session to localStorage:', e);
	          }
	
	          return action;
	        }
	      });
	    };
	  };
	}
	
	module.exports = exports['default'];

/***/ },
/* 587 */
/***/ function(module, exports, __webpack_require__) {

	var baseDifference = __webpack_require__(594),
	    baseFlatten = __webpack_require__(595),
	    isArrayLike = __webpack_require__(86),
	    isObjectLike = __webpack_require__(42),
	    restParam = __webpack_require__(589);
	
	/**
	 * Creates an array of unique `array` values not included in the other
	 * provided arrays using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to inspect.
	 * @param {...Array} [values] The arrays of values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 * @example
	 *
	 * _.difference([1, 2, 3], [4, 2]);
	 * // => [1, 3]
	 */
	var difference = restParam(function(array, values) {
	  return (isObjectLike(array) && isArrayLike(array))
	    ? baseDifference(array, baseFlatten(values, false, true))
	    : [];
	});
	
	module.exports = difference;


/***/ },
/* 588 */
/***/ function(module, exports) {

	/**
	 * Gets the last element of `array`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {Array} array The array to query.
	 * @returns {*} Returns the last element of `array`.
	 * @example
	 *
	 * _.last([1, 2, 3]);
	 * // => 3
	 */
	function last(array) {
	  var length = array ? array.length : 0;
	  return length ? array[length - 1] : undefined;
	}
	
	module.exports = last;


/***/ },
/* 589 */
/***/ function(module, exports) {

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;
	
	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);
	
	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}
	
	module.exports = restParam;


/***/ },
/* 590 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var cachePush = __webpack_require__(608),
	    getNative = __webpack_require__(85);
	
	/** Native method references. */
	var Set = getNative(global, 'Set');
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeCreate = getNative(Object, 'create');
	
	/**
	 *
	 * Creates a cache object to store unique values.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var length = values ? values.length : 0;
	
	  this.data = { 'hash': nativeCreate(null), 'set': new Set };
	  while (length--) {
	    this.push(values[length]);
	  }
	}
	
	// Add functions to the `Set` cache.
	SetCache.prototype.push = cachePush;
	
	module.exports = SetCache;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 591 */
/***/ function(module, exports) {

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;
	
	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}
	
	module.exports = arrayPush;


/***/ },
/* 592 */
/***/ function(module, exports) {

	/**
	 * A specialized version of `_.some` for arrays without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} predicate The function invoked per iteration.
	 * @returns {boolean} Returns `true` if any element passes the predicate check,
	 *  else `false`.
	 */
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	module.exports = arraySome;


/***/ },
/* 593 */
/***/ function(module, exports, __webpack_require__) {

	var baseMatches = __webpack_require__(601),
	    baseMatchesProperty = __webpack_require__(602),
	    bindCallback = __webpack_require__(606),
	    identity = __webpack_require__(137),
	    property = __webpack_require__(625);
	
	/**
	 * The base implementation of `_.callback` which supports specifying the
	 * number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {*} [func=_.identity] The value to convert to a callback.
	 * @param {*} [thisArg] The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function baseCallback(func, thisArg, argCount) {
	  var type = typeof func;
	  if (type == 'function') {
	    return thisArg === undefined
	      ? func
	      : bindCallback(func, thisArg, argCount);
	  }
	  if (func == null) {
	    return identity;
	  }
	  if (type == 'object') {
	    return baseMatches(func);
	  }
	  return thisArg === undefined
	    ? property(func)
	    : baseMatchesProperty(func, thisArg);
	}
	
	module.exports = baseCallback;


/***/ },
/* 594 */
/***/ function(module, exports, __webpack_require__) {

	var baseIndexOf = __webpack_require__(598),
	    cacheIndexOf = __webpack_require__(607),
	    createCache = __webpack_require__(610);
	
	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;
	
	/**
	 * The base implementation of `_.difference` which accepts a single array
	 * of values to exclude.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Array} values The values to exclude.
	 * @returns {Array} Returns the new array of filtered values.
	 */
	function baseDifference(array, values) {
	  var length = array ? array.length : 0,
	      result = [];
	
	  if (!length) {
	    return result;
	  }
	  var index = -1,
	      indexOf = baseIndexOf,
	      isCommon = true,
	      cache = (isCommon && values.length >= LARGE_ARRAY_SIZE) ? createCache(values) : null,
	      valuesLength = values.length;
	
	  if (cache) {
	    indexOf = cacheIndexOf;
	    isCommon = false;
	    values = cache;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index];
	
	    if (isCommon && value === value) {
	      var valuesIndex = valuesLength;
	      while (valuesIndex--) {
	        if (values[valuesIndex] === value) {
	          continue outer;
	        }
	      }
	      result.push(value);
	    }
	    else if (indexOf(values, value, 0) < 0) {
	      result.push(value);
	    }
	  }
	  return result;
	}
	
	module.exports = baseDifference;


/***/ },
/* 595 */
/***/ function(module, exports, __webpack_require__) {

	var arrayPush = __webpack_require__(591),
	    isArguments = __webpack_require__(135),
	    isArray = __webpack_require__(44),
	    isArrayLike = __webpack_require__(86),
	    isObjectLike = __webpack_require__(42);
	
	/**
	 * The base implementation of `_.flatten` with added support for restricting
	 * flattening and specifying the start index.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isDeep] Specify a deep flatten.
	 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, isDeep, isStrict, result) {
	  result || (result = []);
	
	  var index = -1,
	      length = array.length;
	
	  while (++index < length) {
	    var value = array[index];
	    if (isObjectLike(value) && isArrayLike(value) &&
	        (isStrict || isArray(value) || isArguments(value))) {
	      if (isDeep) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, isDeep, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}
	
	module.exports = baseFlatten;


/***/ },
/* 596 */
/***/ function(module, exports, __webpack_require__) {

	var createBaseFor = __webpack_require__(609);
	
	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();
	
	module.exports = baseFor;


/***/ },
/* 597 */
/***/ function(module, exports, __webpack_require__) {

	var baseFor = __webpack_require__(596),
	    keys = __webpack_require__(136);
	
	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}
	
	module.exports = baseForOwn;


/***/ },
/* 598 */
/***/ function(module, exports, __webpack_require__) {

	var indexOfNaN = __webpack_require__(617);
	
	/**
	 * The base implementation of `_.indexOf` without support for binary searches.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  if (value !== value) {
	    return indexOfNaN(array, fromIndex);
	  }
	  var index = fromIndex - 1,
	      length = array.length;
	
	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = baseIndexOf;


/***/ },
/* 599 */
/***/ function(module, exports, __webpack_require__) {

	var equalArrays = __webpack_require__(612),
	    equalByTag = __webpack_require__(613),
	    equalObjects = __webpack_require__(614),
	    isArray = __webpack_require__(44),
	    isTypedArray = __webpack_require__(621);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	 * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = arrayTag,
	      othTag = arrayTag;
	
	  if (!objIsArr) {
	    objTag = objToString.call(object);
	    if (objTag == argsTag) {
	      objTag = objectTag;
	    } else if (objTag != objectTag) {
	      objIsArr = isTypedArray(object);
	    }
	  }
	  if (!othIsArr) {
	    othTag = objToString.call(other);
	    if (othTag == argsTag) {
	      othTag = objectTag;
	    } else if (othTag != objectTag) {
	      othIsArr = isTypedArray(other);
	    }
	  }
	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;
	
	  if (isSameTag && !(objIsArr || objIsObj)) {
	    return equalByTag(object, other, objTag);
	  }
	  if (!isLoose) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');
	
	    if (objIsWrapped || othIsWrapped) {
	      return equalFunc(objIsWrapped ? object.value() : object, othIsWrapped ? other.value() : other, customizer, isLoose, stackA, stackB);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  // Assume cyclic values are equal.
	  // For more information on detecting circular references see https://es5.github.io/#JO.
	  stackA || (stackA = []);
	  stackB || (stackB = []);
	
	  var length = stackA.length;
	  while (length--) {
	    if (stackA[length] == object) {
	      return stackB[length] == other;
	    }
	  }
	  // Add `object` and `other` to the stack of traversed objects.
	  stackA.push(object);
	  stackB.push(other);
	
	  var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isLoose, stackA, stackB);
	
	  stackA.pop();
	  stackB.pop();
	
	  return result;
	}
	
	module.exports = baseIsEqualDeep;


/***/ },
/* 600 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsEqual = __webpack_require__(231),
	    toObject = __webpack_require__(43);
	
	/**
	 * The base implementation of `_.isMatch` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to inspect.
	 * @param {Array} matchData The propery names, values, and compare flags to match.
	 * @param {Function} [customizer] The function to customize comparing objects.
	 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	 */
	function baseIsMatch(object, matchData, customizer) {
	  var index = matchData.length,
	      length = index,
	      noCustomizer = !customizer;
	
	  if (object == null) {
	    return !length;
	  }
	  object = toObject(object);
	  while (index--) {
	    var data = matchData[index];
	    if ((noCustomizer && data[2])
	          ? data[1] !== object[data[0]]
	          : !(data[0] in object)
	        ) {
	      return false;
	    }
	  }
	  while (++index < length) {
	    data = matchData[index];
	    var key = data[0],
	        objValue = object[key],
	        srcValue = data[1];
	
	    if (noCustomizer && data[2]) {
	      if (objValue === undefined && !(key in object)) {
	        return false;
	      }
	    } else {
	      var result = customizer ? customizer(objValue, srcValue, key) : undefined;
	      if (!(result === undefined ? baseIsEqual(srcValue, objValue, customizer, true) : result)) {
	        return false;
	      }
	    }
	  }
	  return true;
	}
	
	module.exports = baseIsMatch;


/***/ },
/* 601 */
/***/ function(module, exports, __webpack_require__) {

	var baseIsMatch = __webpack_require__(600),
	    getMatchData = __webpack_require__(616),
	    toObject = __webpack_require__(43);
	
	/**
	 * The base implementation of `_.matches` which does not clone `source`.
	 *
	 * @private
	 * @param {Object} source The object of property values to match.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatches(source) {
	  var matchData = getMatchData(source);
	  if (matchData.length == 1 && matchData[0][2]) {
	    var key = matchData[0][0],
	        value = matchData[0][1];
	
	    return function(object) {
	      if (object == null) {
	        return false;
	      }
	      return object[key] === value && (value !== undefined || (key in toObject(object)));
	    };
	  }
	  return function(object) {
	    return baseIsMatch(object, matchData);
	  };
	}
	
	module.exports = baseMatches;


/***/ },
/* 602 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(230),
	    baseIsEqual = __webpack_require__(231),
	    baseSlice = __webpack_require__(604),
	    isArray = __webpack_require__(44),
	    isKey = __webpack_require__(234),
	    isStrictComparable = __webpack_require__(235),
	    last = __webpack_require__(588),
	    toObject = __webpack_require__(43),
	    toPath = __webpack_require__(236);
	
	/**
	 * The base implementation of `_.matchesProperty` which does not clone `srcValue`.
	 *
	 * @private
	 * @param {string} path The path of the property to get.
	 * @param {*} srcValue The value to compare.
	 * @returns {Function} Returns the new function.
	 */
	function baseMatchesProperty(path, srcValue) {
	  var isArr = isArray(path),
	      isCommon = isKey(path) && isStrictComparable(srcValue),
	      pathKey = (path + '');
	
	  path = toPath(path);
	  return function(object) {
	    if (object == null) {
	      return false;
	    }
	    var key = pathKey;
	    object = toObject(object);
	    if ((isArr || !isCommon) && !(key in object)) {
	      object = path.length == 1 ? object : baseGet(object, baseSlice(path, 0, -1));
	      if (object == null) {
	        return false;
	      }
	      key = last(path);
	      object = toObject(object);
	    }
	    return object[key] === srcValue
	      ? (srcValue !== undefined || (key in object))
	      : baseIsEqual(srcValue, object[key], undefined, true);
	  };
	}
	
	module.exports = baseMatchesProperty;


/***/ },
/* 603 */
/***/ function(module, exports, __webpack_require__) {

	var baseGet = __webpack_require__(230),
	    toPath = __webpack_require__(236);
	
	/**
	 * A specialized version of `baseProperty` which supports deep paths.
	 *
	 * @private
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function basePropertyDeep(path) {
	  var pathKey = (path + '');
	  path = toPath(path);
	  return function(object) {
	    return baseGet(object, path, pathKey);
	  };
	}
	
	module.exports = basePropertyDeep;


/***/ },
/* 604 */
/***/ function(module, exports) {

	/**
	 * The base implementation of `_.slice` without an iteratee call guard.
	 *
	 * @private
	 * @param {Array} array The array to slice.
	 * @param {number} [start=0] The start position.
	 * @param {number} [end=array.length] The end position.
	 * @returns {Array} Returns the slice of `array`.
	 */
	function baseSlice(array, start, end) {
	  var index = -1,
	      length = array.length;
	
	  start = start == null ? 0 : (+start || 0);
	  if (start < 0) {
	    start = -start > length ? 0 : (length + start);
	  }
	  end = (end === undefined || end > length) ? length : (+end || 0);
	  if (end < 0) {
	    end += length;
	  }
	  length = start > end ? 0 : ((end - start) >>> 0);
	  start >>>= 0;
	
	  var result = Array(length);
	  while (++index < length) {
	    result[index] = array[index + start];
	  }
	  return result;
	}
	
	module.exports = baseSlice;


/***/ },
/* 605 */
/***/ function(module, exports) {

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` or `undefined` values.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  return value == null ? '' : (value + '');
	}
	
	module.exports = baseToString;


/***/ },
/* 606 */
/***/ function(module, exports, __webpack_require__) {

	var identity = __webpack_require__(137);
	
	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}
	
	module.exports = bindCallback;


/***/ },
/* 607 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	
	/**
	 * Checks if `value` is in `cache` mimicking the return signature of
	 * `_.indexOf` by returning `0` if the value is found, else `-1`.
	 *
	 * @private
	 * @param {Object} cache The cache to search.
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `0` if `value` is found, else `-1`.
	 */
	function cacheIndexOf(cache, value) {
	  var data = cache.data,
	      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];
	
	  return result ? 0 : -1;
	}
	
	module.exports = cacheIndexOf;


/***/ },
/* 608 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	
	/**
	 * Adds `value` to the cache.
	 *
	 * @private
	 * @name push
	 * @memberOf SetCache
	 * @param {*} value The value to cache.
	 */
	function cachePush(value) {
	  var data = this.data;
	  if (typeof value == 'string' || isObject(value)) {
	    data.set.add(value);
	  } else {
	    data.hash[value] = true;
	  }
	}
	
	module.exports = cachePush;


/***/ },
/* 609 */
/***/ function(module, exports, __webpack_require__) {

	var toObject = __webpack_require__(43);
	
	/**
	 * Creates a base function for `_.forIn` or `_.forInRight`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length,
	        index = fromRight ? length : -1;
	
	    while ((fromRight ? index-- : ++index < length)) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}
	
	module.exports = createBaseFor;


/***/ },
/* 610 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var SetCache = __webpack_require__(590),
	    getNative = __webpack_require__(85);
	
	/** Native method references. */
	var Set = getNative(global, 'Set');
	
	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeCreate = getNative(Object, 'create');
	
	/**
	 * Creates a `Set` cache object to optimize linear searches of large arrays.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
	 */
	function createCache(values) {
	  return (nativeCreate && Set) ? new SetCache(values) : null;
	}
	
	module.exports = createCache;
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 611 */
/***/ function(module, exports, __webpack_require__) {

	var baseCallback = __webpack_require__(593),
	    baseForOwn = __webpack_require__(597);
	
	/**
	 * Creates a function for `_.mapKeys` or `_.mapValues`.
	 *
	 * @private
	 * @param {boolean} [isMapKeys] Specify mapping keys instead of values.
	 * @returns {Function} Returns the new map function.
	 */
	function createObjectMapper(isMapKeys) {
	  return function(object, iteratee, thisArg) {
	    var result = {};
	    iteratee = baseCallback(iteratee, thisArg, 3);
	
	    baseForOwn(object, function(value, key, object) {
	      var mapped = iteratee(value, key, object);
	      key = isMapKeys ? mapped : key;
	      value = isMapKeys ? value : mapped;
	      result[key] = value;
	    });
	    return result;
	  };
	}
	
	module.exports = createObjectMapper;


/***/ },
/* 612 */
/***/ function(module, exports, __webpack_require__) {

	var arraySome = __webpack_require__(592);
	
	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing arrays.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var index = -1,
	      arrLength = array.length,
	      othLength = other.length;
	
	  if (arrLength != othLength && !(isLoose && othLength > arrLength)) {
	    return false;
	  }
	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index],
	        result = customizer ? customizer(isLoose ? othValue : arrValue, isLoose ? arrValue : othValue, index) : undefined;
	
	    if (result !== undefined) {
	      if (result) {
	        continue;
	      }
	      return false;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (isLoose) {
	      if (!arraySome(other, function(othValue) {
	            return arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB);
	          })) {
	        return false;
	      }
	    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, customizer, isLoose, stackA, stackB))) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = equalArrays;


/***/ },
/* 613 */
/***/ function(module, exports) {

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    stringTag = '[object String]';
	
	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag) {
	  switch (tag) {
	    case boolTag:
	    case dateTag:
	      // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	      // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	      return +object == +other;
	
	    case errorTag:
	      return object.name == other.name && object.message == other.message;
	
	    case numberTag:
	      // Treat `NaN` vs. `NaN` as equal.
	      return (object != +object)
	        ? other != +other
	        : object == +other;
	
	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings primitives and string
	      // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	      return object == (other + '');
	  }
	  return false;
	}
	
	module.exports = equalByTag;


/***/ },
/* 614 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(136);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Function} [customizer] The function to customize comparing values.
	 * @param {boolean} [isLoose] Specify performing partial comparisons.
	 * @param {Array} [stackA] Tracks traversed `value` objects.
	 * @param {Array} [stackB] Tracks traversed `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, equalFunc, customizer, isLoose, stackA, stackB) {
	  var objProps = keys(object),
	      objLength = objProps.length,
	      othProps = keys(other),
	      othLength = othProps.length;
	
	  if (objLength != othLength && !isLoose) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isLoose ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  var skipCtor = isLoose;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key],
	        result = customizer ? customizer(isLoose ? othValue : objValue, isLoose? objValue : othValue, key) : undefined;
	
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(result === undefined ? equalFunc(objValue, othValue, customizer, isLoose, stackA, stackB) : result)) {
	      return false;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (!skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;
	
	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      return false;
	    }
	  }
	  return true;
	}
	
	module.exports = equalObjects;


/***/ },
/* 615 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(232);
	
	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');
	
	module.exports = getLength;


/***/ },
/* 616 */
/***/ function(module, exports, __webpack_require__) {

	var isStrictComparable = __webpack_require__(235),
	    pairs = __webpack_require__(624);
	
	/**
	 * Gets the propery names, values, and compare flags of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the match data of `object`.
	 */
	function getMatchData(object) {
	  var result = pairs(object),
	      length = result.length;
	
	  while (length--) {
	    result[length][2] = isStrictComparable(result[length][1]);
	  }
	  return result;
	}
	
	module.exports = getMatchData;


/***/ },
/* 617 */
/***/ function(module, exports) {

	/**
	 * Gets the index at which the first occurrence of `NaN` is found in `array`.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	 */
	function indexOfNaN(array, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 0 : -1);
	
	  while ((fromRight ? index-- : ++index < length)) {
	    var other = array[index];
	    if (other !== other) {
	      return index;
	    }
	  }
	  return -1;
	}
	
	module.exports = indexOfNaN;


/***/ },
/* 618 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(135),
	    isArray = __webpack_require__(44),
	    isIndex = __webpack_require__(233),
	    isLength = __webpack_require__(63),
	    keysIn = __webpack_require__(622);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;
	
	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));
	
	  var index = -1,
	      result = [];
	
	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = shimKeys;


/***/ },
/* 619 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(35);
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]';
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 which returns 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}
	
	module.exports = isFunction;


/***/ },
/* 620 */
/***/ function(module, exports, __webpack_require__) {

	var isFunction = __webpack_require__(619),
	    isObjectLike = __webpack_require__(42);
	
	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}
	
	module.exports = isNative;


/***/ },
/* 621 */
/***/ function(module, exports, __webpack_require__) {

	var isLength = __webpack_require__(63),
	    isObjectLike = __webpack_require__(42);
	
	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    weakMapTag = '[object WeakMap]';
	
	var arrayBufferTag = '[object ArrayBuffer]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';
	
	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;
	
	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	function isTypedArray(value) {
	  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[objToString.call(value)];
	}
	
	module.exports = isTypedArray;


/***/ },
/* 622 */
/***/ function(module, exports, __webpack_require__) {

	var isArguments = __webpack_require__(135),
	    isArray = __webpack_require__(44),
	    isIndex = __webpack_require__(233),
	    isLength = __webpack_require__(63),
	    isObject = __webpack_require__(35);
	
	/** Used for native method references. */
	var objectProto = Object.prototype;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;
	
	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;
	
	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}
	
	module.exports = keysIn;


/***/ },
/* 623 */
/***/ function(module, exports, __webpack_require__) {

	var createObjectMapper = __webpack_require__(611);
	
	/**
	 * Creates an object with the same keys as `object` and values generated by
	 * running each own enumerable property of `object` through `iteratee`. The
	 * iteratee function is bound to `thisArg` and invoked with three arguments:
	 * (value, key, object).
	 *
	 * If a property name is provided for `iteratee` the created `_.property`
	 * style callback returns the property value of the given element.
	 *
	 * If a value is also provided for `thisArg` the created `_.matchesProperty`
	 * style callback returns `true` for elements that have a matching property
	 * value, else `false`.
	 *
	 * If an object is provided for `iteratee` the created `_.matches` style
	 * callback returns `true` for elements that have the properties of the given
	 * object, else `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	 *  per iteration.
	 * @param {*} [thisArg] The `this` binding of `iteratee`.
	 * @returns {Object} Returns the new mapped object.
	 * @example
	 *
	 * _.mapValues({ 'a': 1, 'b': 2 }, function(n) {
	 *   return n * 3;
	 * });
	 * // => { 'a': 3, 'b': 6 }
	 *
	 * var users = {
	 *   'fred':    { 'user': 'fred',    'age': 40 },
	 *   'pebbles': { 'user': 'pebbles', 'age': 1 }
	 * };
	 *
	 * // using the `_.property` callback shorthand
	 * _.mapValues(users, 'age');
	 * // => { 'fred': 40, 'pebbles': 1 } (iteration order is not guaranteed)
	 */
	var mapValues = createObjectMapper();
	
	module.exports = mapValues;


/***/ },
/* 624 */
/***/ function(module, exports, __webpack_require__) {

	var keys = __webpack_require__(136),
	    toObject = __webpack_require__(43);
	
	/**
	 * Creates a two dimensional array of the key-value pairs for `object`,
	 * e.g. `[[key1, value1], [key2, value2]]`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the new array of key-value pairs.
	 * @example
	 *
	 * _.pairs({ 'barney': 36, 'fred': 40 });
	 * // => [['barney', 36], ['fred', 40]] (iteration order is not guaranteed)
	 */
	function pairs(object) {
	  object = toObject(object);
	
	  var index = -1,
	      props = keys(object),
	      length = props.length,
	      result = Array(length);
	
	  while (++index < length) {
	    var key = props[index];
	    result[index] = [key, object[key]];
	  }
	  return result;
	}
	
	module.exports = pairs;


/***/ },
/* 625 */
/***/ function(module, exports, __webpack_require__) {

	var baseProperty = __webpack_require__(232),
	    basePropertyDeep = __webpack_require__(603),
	    isKey = __webpack_require__(234);
	
	/**
	 * Creates a function that returns the property value at `path` on a
	 * given object.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {Array|string} path The path of the property to get.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var objects = [
	 *   { 'a': { 'b': { 'c': 2 } } },
	 *   { 'a': { 'b': { 'c': 1 } } }
	 * ];
	 *
	 * _.map(objects, _.property('a.b.c'));
	 * // => [2, 1]
	 *
	 * _.pluck(_.sortBy(objects, _.property(['a', 'b', 'c'])), 'a.b.c');
	 * // => [1, 2]
	 */
	function property(path) {
	  return isKey(path) ? baseProperty(path) : basePropertyDeep(path);
	}
	
	module.exports = property;


/***/ },
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = thunkMiddleware;
	function thunkMiddleware(_ref) {
	  var dispatch = _ref.dispatch;
	  var getState = _ref.getState;
	
	  return function (next) {
	    return function (action) {
	      return typeof action === 'function' ? action(dispatch, getState) : next(action);
	    };
	  };
	}
	module.exports = exports['default'];

/***/ },
/* 630 */,
/* 631 */,
/* 632 */,
/* 633 */,
/* 634 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(300);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(139)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./core.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./core.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 635 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(301);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(139)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./HomeView.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./HomeView.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 636 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(302);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(139)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./TabsContainer.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!./../../node_modules/postcss-loader/index.js!./../../node_modules/sass-loader/index.js!./TabsContainer.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 637 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 638 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	module.exports = { "default": __webpack_require__(__webpack_module_template_argument_0__), __esModule: true };

/***/ },
/* 639 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	module.exports = { "default": __webpack_require__(__webpack_module_template_argument_0__), __esModule: true };

/***/ },
/* 640 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	module.exports = { "default": __webpack_require__(__webpack_module_template_argument_0__), __esModule: true };

/***/ },
/* 641 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	module.exports = { "default": __webpack_require__(__webpack_module_template_argument_0__), __esModule: true };

/***/ },
/* 642 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	module.exports = { "default": __webpack_require__(__webpack_module_template_argument_0__), __esModule: true };

/***/ },
/* 643 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	__webpack_require__(__webpack_module_template_argument_0__);
	module.exports = __webpack_require__(__webpack_module_template_argument_1__).Object.assign;

/***/ },
/* 644 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	var $ = __webpack_require__(__webpack_module_template_argument_0__);
	module.exports = function create(P, D){
	  return $.create(P, D);
	};

/***/ },
/* 645 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	var $ = __webpack_require__(__webpack_module_template_argument_0__);
	module.exports = function defineProperty(it, key, desc){
	  return $.setDesc(it, key, desc);
	};

/***/ },
/* 646 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	__webpack_require__(__webpack_module_template_argument_0__);
	module.exports = __webpack_require__(__webpack_module_template_argument_1__).Object.keys;

/***/ },
/* 647 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	__webpack_require__(__webpack_module_template_argument_0__);
	module.exports = __webpack_require__(__webpack_module_template_argument_1__).Object.setPrototypeOf;

/***/ },
/* 648 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	var isObject = __webpack_require__(__webpack_module_template_argument_0__);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 649 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(__webpack_module_template_argument_0__)
	  , TAG = __webpack_require__(__webpack_module_template_argument_1__)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 650 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(__webpack_module_template_argument_0__);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 651 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(__webpack_module_template_argument_0__)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 652 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {

	var global    = __webpack_require__(__webpack_module_template_argument_0__)
	  , core      = __webpack_require__(__webpack_module_template_argument_1__)
	  , ctx       = __webpack_require__(__webpack_module_template_argument_2__)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && key in target;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(param){
	        return this instanceof C ? new C(param) : C(param);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
	  }
	};
	// type bitmap
	$export.F = 1;  // forced
	$export.G = 2;  // global
	$export.S = 4;  // static
	$export.P = 8;  // proto
	$export.B = 16; // bind
	$export.W = 32; // wrap
	module.exports = $export;

/***/ },
/* 653 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {

	var $          = __webpack_require__(__webpack_module_template_argument_0__)
	  , createDesc = __webpack_require__(__webpack_module_template_argument_1__);
	module.exports = __webpack_require__(__webpack_module_template_argument_2__) ? function(object, key, value){
	  return $.setDesc(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 654 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(__webpack_module_template_argument_0__);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 655 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__) {

	'use strict';
	var $              = __webpack_require__(__webpack_module_template_argument_0__)
	  , descriptor     = __webpack_require__(__webpack_module_template_argument_1__)
	  , setToStringTag = __webpack_require__(__webpack_module_template_argument_2__)
	  , IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(__webpack_module_template_argument_3__)(IteratorPrototype, __webpack_require__(__webpack_module_template_argument_4__)('iterator'), function(){ return this; });
	
	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ },
/* 656 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__, __webpack_module_template_argument_4__, __webpack_module_template_argument_5__, __webpack_module_template_argument_6__, __webpack_module_template_argument_7__, __webpack_module_template_argument_8__, __webpack_module_template_argument_9__) {

	'use strict';
	var LIBRARY        = __webpack_require__(__webpack_module_template_argument_0__)
	  , $export        = __webpack_require__(__webpack_module_template_argument_1__)
	  , redefine       = __webpack_require__(__webpack_module_template_argument_2__)
	  , hide           = __webpack_require__(__webpack_module_template_argument_3__)
	  , has            = __webpack_require__(__webpack_module_template_argument_4__)
	  , Iterators      = __webpack_require__(__webpack_module_template_argument_5__)
	  , $iterCreate    = __webpack_require__(__webpack_module_template_argument_6__)
	  , setToStringTag = __webpack_require__(__webpack_module_template_argument_7__)
	  , getProto       = __webpack_require__(__webpack_module_template_argument_8__).getProto
	  , ITERATOR       = __webpack_require__(__webpack_module_template_argument_9__)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';
	
	var returnThis = function(){ return this; };
	
	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , methods, key;
	  // Fix native
	  if($native){
	    var IteratorPrototype = getProto($default.call(new Base));
	    // Set @@toStringTag to native iterators
	    setToStringTag(IteratorPrototype, TAG, true);
	    // FF fix
	    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    // fix Array#{values, @@iterator}.name in V8 / FF
	    if(DEF_VALUES && $native.name !== VALUES){
	      VALUES_BUG = true;
	      $default = function values(){ return $native.call(this); };
	    }
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES  ? $default : getMethod(VALUES),
	      keys:    IS_SET      ? $default : getMethod(KEYS),
	      entries: !DEF_VALUES ? $default : getMethod('entries')
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ },
/* 657 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__) {

	// 19.1.2.1 Object.assign(target, source, ...)
	var $        = __webpack_require__(__webpack_module_template_argument_0__)
	  , toObject = __webpack_require__(__webpack_module_template_argument_1__)
	  , IObject  = __webpack_require__(__webpack_module_template_argument_2__);
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = __webpack_require__(__webpack_module_template_argument_3__)(function(){
	  var a = Object.assign
	    , A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , $$    = arguments
	    , $$len = $$.length
	    , index = 1
	    , getKeys    = $.getKeys
	    , getSymbols = $.getSymbols
	    , isEnum     = $.isEnum;
	  while($$len > index){
	    var S      = IObject($$[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  }
	  return T;
	} : Object.assign;

/***/ },
/* 658 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(__webpack_module_template_argument_0__)
	  , core    = __webpack_require__(__webpack_module_template_argument_1__)
	  , fails   = __webpack_require__(__webpack_module_template_argument_2__);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ },
/* 659 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	module.exports = __webpack_require__(__webpack_module_template_argument_0__);

/***/ },
/* 660 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var getDesc  = __webpack_require__(__webpack_module_template_argument_0__).getDesc
	  , isObject = __webpack_require__(__webpack_module_template_argument_1__)
	  , anObject = __webpack_require__(__webpack_module_template_argument_2__);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(__webpack_module_template_argument_3__)(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ },
/* 661 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {

	var def = __webpack_require__(__webpack_module_template_argument_0__).setDesc
	  , has = __webpack_require__(__webpack_module_template_argument_1__)
	  , TAG = __webpack_require__(__webpack_module_template_argument_2__)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 662 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	var global = __webpack_require__(__webpack_module_template_argument_0__)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 663 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	var toInteger = __webpack_require__(__webpack_module_template_argument_0__)
	  , defined   = __webpack_require__(__webpack_module_template_argument_1__);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ },
/* 664 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(__webpack_module_template_argument_0__)
	  , defined = __webpack_require__(__webpack_module_template_argument_1__);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 665 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(__webpack_module_template_argument_0__);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ },
/* 666 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__) {

	var store  = __webpack_require__(__webpack_module_template_argument_0__)('wks')
	  , uid    = __webpack_require__(__webpack_module_template_argument_1__)
	  , Symbol = __webpack_require__(__webpack_module_template_argument_2__).Symbol;
	module.exports = function(name){
	  return store[name] || (store[name] =
	    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
	};

/***/ },
/* 667 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__, __webpack_module_template_argument_2__, __webpack_module_template_argument_3__) {

	var classof   = __webpack_require__(__webpack_module_template_argument_0__)
	  , ITERATOR  = __webpack_require__(__webpack_module_template_argument_1__)('iterator')
	  , Iterators = __webpack_require__(__webpack_module_template_argument_2__);
	module.exports = __webpack_require__(__webpack_module_template_argument_3__).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ },
/* 668 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(__webpack_module_template_argument_0__);
	
	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(__webpack_module_template_argument_1__)});

/***/ },
/* 669 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(__webpack_module_template_argument_0__);
	
	__webpack_require__(__webpack_module_template_argument_1__)('keys', function($keys){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ },
/* 670 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(__webpack_module_template_argument_0__);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(__webpack_module_template_argument_1__).set});

/***/ },
/* 671 */
/***/ function(module, exports, __webpack_require__, __webpack_module_template_argument_0__, __webpack_module_template_argument_1__) {

	'use strict';
	var $at  = __webpack_require__(__webpack_module_template_argument_0__)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(__webpack_module_template_argument_1__)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ }
]);
//# sourceMappingURL=app.aa43cd8822c7d87dcf66.js.map