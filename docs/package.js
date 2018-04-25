(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "MIT License\n\nCopyright (c) 2018 Daniel X Moore\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "# cssgrid\nMessing with css grid\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "style = document.createElement \"style\"\nstyle.innerText = require \"./style\"\ndocument.head.appendChild style\n\ndocument.body.appendChild require('./layout')()\n",
      "mode": "100644"
    },
    "layout.jadelet": {
      "path": "layout.jadelet",
      "content": ".grid\n  .e1 a\n  .e2 b\n  .e3 c\n  .e4 d\n  .e5 e\n  .e6 f\n  .e7 g\n  .e8 h\n  .e9 i\n",
      "mode": "100644"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "html, body\n  height: 100%\n\nbody\n  margin: 0\n\n.grid\n  display: grid\n  font-size: 4rem\n  grid-template-columns: 1fr 1fr 1fr\n  grid-template-rows: 1fr 1fr 1fr\n  height: 100%\n\n  > *\n    align-items: center\n    display: flex\n    justify-content: center\n    &:nth-child(even)\n      background-color: #ccc\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var style;\n\n  style = document.createElement(\"style\");\n\n  style.innerText = require(\"./style\");\n\n  document.head.appendChild(style);\n\n  document.body.appendChild(require('./layout')());\n\n}).call(this);\n",
      "type": "blob"
    },
    "layout": {
      "path": "layout",
      "content": "module.exports = function(data) {\n  \"use strict\";\n  return (function() {\n    var __root;\n    __root = require(\"/lib/jadelet-runtime\")(this);\n    __root.buffer(__root.element(\"div\", this, {\n      \"class\": [\"grid\"]\n    }, function(__root) {\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e1\"]\n      }, function(__root) {\n        __root.buffer(\"a\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e2\"]\n      }, function(__root) {\n        __root.buffer(\"b\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e3\"]\n      }, function(__root) {\n        __root.buffer(\"c\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e4\"]\n      }, function(__root) {\n        __root.buffer(\"d\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e5\"]\n      }, function(__root) {\n        __root.buffer(\"e\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e6\"]\n      }, function(__root) {\n        __root.buffer(\"f\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e7\"]\n      }, function(__root) {\n        __root.buffer(\"g\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e8\"]\n      }, function(__root) {\n        __root.buffer(\"h\\n\");\n      }));\n      __root.buffer(__root.element(\"div\", this, {\n        \"class\": [\"e9\"]\n      }, function(__root) {\n        __root.buffer(\"i\\n\");\n      }));\n    }));\n    return __root.root;\n  }).call(data);\n};\n",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"html,\\nbody {\\n  height: 100%;\\n}\\nbody {\\n  margin: 0;\\n}\\n.grid {\\n  display: grid;\\n  font-size: 4rem;\\n  grid-template-columns: 1fr 1fr 1fr;\\n  grid-template-rows: 1fr 1fr 1fr;\\n  height: 100%;\\n}\\n.grid > * {\\n  align-items: center;\\n  display: flex;\\n  justify-content: center;\\n}\\n.grid > *:nth-child(even) {\\n  background-color: #ccc;\\n}\\n\";",
      "type": "blob"
    },
    "lib/jadelet-runtime": {
      "path": "lib/jadelet-runtime",
      "content": "!function(n){if(\"object\"==typeof exports&&\"undefined\"!=typeof module)module.exports=n();else if(\"function\"==typeof define&&define.amd)define([],n);else{(\"undefined\"!=typeof window?window:\"undefined\"!=typeof global?global:\"undefined\"!=typeof self?self:this).JadeletRuntime=n()}}(function(){return function n(e,t,r){function o(i,c){if(!t[i]){if(!e[i]){var f=\"function\"==typeof require&&require;if(!c&&f)return f(i,!0);if(u)return u(i,!0);var l=new Error(\"Cannot find module '\"+i+\"'\");throw l.code=\"MODULE_NOT_FOUND\",l}var a=t[i]={exports:{}};e[i][0].call(a.exports,function(n){var t=e[i][1][n];return o(t||n)},a,a.exports,n,e,t,r)}return t[i].exports}for(var u=\"function\"==typeof require&&require,i=0;i<r.length;i++)o(r[i]);return o}({1:[function(n,e,t){(function(){\"use strict\";var t,r,o,u,i,c,f,l,a,s,d,p,v,h,g,y,b,m,E,O,_,x,w,A,C;t=n(\"o_0\"),a=new WeakMap,s=new WeakMap,_=function(n){var e;e=s.get(n)||0,s.set(n,e+1)},O=function(n){var e;e=s.get(n)||0,--e>0?s.set(n,e):(s.delete(n),l(n))},l=function(n){var e,t;null!=(e=n.children)&&Array.prototype.forEach.call(e,l),null!=(t=a.get(n))&&t.forEach(function(e){e(),a.delete(n)})},o=function(n,e){var t;(t=a.get(n))?t.push(e):a.set(n,[e])},p=/^on(touch|animation|transition)(start|iteration|move|end|cancel)$/,h=function(n,e){return n.match(p)||n in e},A=function(n,e,t){switch(n.nodeName){case\"SELECT\":n.oninput=n.onchange=function(){var n,t,r;n=(t=this.children[this.selectedIndex]).value,r=t._value,\"function\"==typeof e&&e(r||n)},i(n,e,t,function(e){var t;n._value=e,(t=n._options)?null!=e.value?n.value=(\"function\"==typeof e.value?e.value():void 0)||e.value:n.selectedIndex=C(t,e):n.value=e});break;default:n.oninput=n.onchange=function(){\"function\"==typeof e&&e(n.value)},i(n,e,t,function(e){n.value!==e&&(n.value=e)})}},x={INPUT:{checked:function(n,e,t){return n.onchange=function(){\"function\"==typeof e&&e(n.checked)},i(n,e,t,function(e){n.checked=e})}},SELECT:{options:function(n,e,t){i(n,e,t,function(e){d(n),n._options=e,e.map(function(e,t){var r,o,u;return r=f(\"option\"),r._value=e,u=g(e)?(null!=e?e.value:void 0)||t:e.toString(),i(r,u,e,function(n){r.value=n}),o=(null!=e?e.name:void 0)||e,i(r,o,e,function(n){r.textContent=n}),n.appendChild(r),e===n._value&&(n.selectedIndex=t),r})})}}},b=function(n,e,t,r){var o,c,f;c=n.nodeName,\"value\"===t?A(n,r):(o=null!=(f=x[c])?f[t]:void 0)?o(n,r,e):t.match(/^on/)&&h(t,n)?u(n,t.substr(2),r,e):h(\"on\"+t,n)?u(n,t,r,e):i(n,r,e,function(e){null!=e&&!1!==e?n.setAttribute(t,e):n.removeAttribute(t)})},m=function(n,e,t){c(n,e,t,\"id\",function(e){var t;t=e[e.length-1],e.length?n.id=t:n.removeAttribute(\"id\")}),c(n,e,t,\"class\",function(e){n.className=e.join(\" \")}),c(n,e,t,\"style\",function(e){n.removeAttribute(\"style\"),e.forEach(function(e){return g(e)?Object.assign(n.style,e):n.setAttribute(\"style\",e)})}),Object.keys(t).forEach(function(r){b(n,e,r,t[r])})},i=function(n,e,r,u){var i;i=t(function(){u(v(e,r))}),o(n,i.releaseDependencies)},u=function(n,e,t,r){\"function\"==typeof t&&n.addEventListener(e,t.bind(r))},c=function(n,e,t,r,o){var u;null!=(u=t[r])&&(delete t[r],i(n,function(){return w(u,e)},e,o))},E=function(n,e,t){var r;r=function(e){null==e||(\"function\"==typeof e.forEach?e.forEach(r):e instanceof Node?(_(e),n.appendChild(e)):n.appendChild(document.createTextNode(e)))},i(n,function(){var n;return n=[],t.call(e,{buffer:function(t){n.push(v(t,e))},element:y}),n},e,function(e){d(n),e.forEach(r)})},y=function(n,e,t,r){var o;return o=f(n),m(o,e,t),\"SELECT\"!==o.nodeName&&E(o,e,r),o},(r=function(n){var e;return e={buffer:function(n){if(e.root)throw new Error(\"Cannot have multiple root elements\");e.root=n},element:y}}).Observable=t,r._elementCleaners=a,r._dispose=l,r.retain=_,r.release=O,e.exports=r,f=function(n){return document.createElement(n)},d=function(n){for(var e;e=n.firstChild;)n.removeChild(e),O(e)},g=function(n){return\"object\"==typeof n},C=function(n,e){return g(e)?n.indexOf(e):n.map(function(n){return n.toString()}).indexOf(e.toString())},w=function(n,e){return n.map(function(n){return v(n,e)}).reduce(function(n,e){return n.concat(v(e))},[]).filter(function(n){return null!=n})},v=function(n,e){return\"function\"==typeof n?n.call(e):n}}).call(this)},{o_0:2}],2:[function(n,e,t){(function(n){(function(){\"use strict\";var t,r,o,u,i,c,f,l,a=[].slice;e.exports=function(n,e){var u,s,d,p,v;return\"function\"==typeof(null!=n?n.observe:void 0)?n:(d=[],p=function(n){return r(d).forEach(function(e){return e(n)})},\"function\"==typeof n?(s=n,(v=function(){return i(v),n}).releaseDependencies=function(){var n;return null!=(n=v._observableDependencies)?n.forEach(function(n){return n.stopObserving(u)}):void 0},(u=function(){var t;return t=new Set,n=l(t,s,e),v.releaseDependencies(),v._observableDependencies=t,t.forEach(function(n){return n.observe(u)}),p(n)})()):(v=function(e){return arguments.length>0?n!==e&&(n=e,p(e)):i(v),n}).releaseDependencies=c,Array.isArray(n)&&([\"concat\",\"every\",\"filter\",\"forEach\",\"indexOf\",\"join\",\"lastIndexOf\",\"map\",\"reduce\",\"reduceRight\",\"slice\",\"some\"].forEach(function(e){return v[e]=function(){var t;return t=1<=arguments.length?a.call(arguments,0):[],i(v),n[e].apply(n,t)}}),[\"pop\",\"push\",\"reverse\",\"shift\",\"splice\",\"sort\",\"unshift\"].forEach(function(e){return v[e]=function(){var t,r;return t=1<=arguments.length?a.call(arguments,0):[],r=n[e].apply(n,t),p(n),r}}),t&&Object.defineProperty(v,\"length\",{get:function(){return i(v),n.length},set:function(e){var t;return t=n.length=e,p(n),t}}),o(v,{remove:function(e){var t,r;if((t=n.indexOf(e))>=0)return r=n.splice(t,1)[0],p(n),r},get:function(e){return i(v),n[e]},first:function(){return i(v),n[0]},last:function(){return i(v),n[n.length-1]},size:function(){return i(v),n.length}})),o(v,{listeners:d,observe:function(n){return d.push(n)},stopObserving:function(n){return f(d,n)},toggle:function(){return v(!n)},increment:function(e){return null==e&&(e=1),v(n+e)},decrement:function(e){return null==e&&(e=1),v(n-e)},toString:function(){return\"Observable(\"+n+\")\"}}),v)},o=Object.assign,n.OBSERVABLE_ROOT_HACK=[],i=function(e){var t;if(t=u(n.OBSERVABLE_ROOT_HACK))return t.add(e)},l=function(e,t,r){n.OBSERVABLE_ROOT_HACK.push(e);try{return t.call(r)}finally{n.OBSERVABLE_ROOT_HACK.pop()}},f=function(n,e){var t;if((t=n.indexOf(e))>=0)return n.splice(t,1)[0]},r=function(n){return n.concat([])},u=function(n){return n[n.length-1]},c=function(){};try{Object.defineProperty(function(){},\"length\",{get:c,set:c}),t=!0}catch(n){t=!1}}).call(this)}).call(this,\"undefined\"!=typeof global?global:\"undefined\"!=typeof self?self:\"undefined\"!=typeof window?window:{})},{}]},{},[1])(1)});\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "config": {},
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "STRd6/cssgrid",
    "homepage": null,
    "description": "Messing with css grid",
    "html_url": "https://github.com/STRd6/cssgrid",
    "url": "https://api.github.com/repos/STRd6/cssgrid",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});