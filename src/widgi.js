function $(hostElement, childrenFunction) {
  const _$ = hostElement._$ || {};
  _$._parts = _$._parts || [];
  _$.t = _$.t || ((...textsOrFunctions) => {
    let txt = "";
    for (const part of textsOrFunctions) txt += typeof part === "function" ? part() : part
    _$._parts.push(() => document.createTextNode(txt))
  })
  _$.h = _$.h || ((tag, attrOrChildrenFunction, childrenFunction) => {
    _$._parts.push(() => [
      document.createElement(tag),
      typeof attrOrChildrenFunction === "object" ? attrOrChildrenFunction : {},
      typeof attrOrChildrenFunction === "function" ? attrOrChildrenFunction : childrenFunction
    ])
  })
  _$._cache = _$._cache || [];
  _$._cacheIndex = _$._cacheIndex || 0;
  _$.sub = _$.sub || ((deps, fn) => {
    deps = deps.map(d => typeof d === "function" ? d() : d)
    const cache = _$._cache[_$._cacheIndex];
    if (cache) {
      _$._cacheIndex += 1;
      const [cDeps, cfn] = cache;
      for (let index = 0; index < deps.length; index++) {
        const dp = deps[index];
        const cdp = cDeps[index];
        if (dp !== cdp) {
          cfn()
          break;
        }
      }
      return;
    }
    fn()
    _$._cache[_$._cacheIndex] = [deps, fn];
    _$._cacheIndex += 1;
  })
  _$.once = _$.once || ((fn) => {
    const cache = _$._cache[_$._cacheIndex];
    if (cache) {
      _$._cacheIndex += 1;
      return;
    }
    fn()
    _$._cache[_$._cacheIndex] = true;
    _$._cacheIndex += 1;
  })
  _$.fn = _$.fn || ((fn) => {
    const cache = _$._cache[_$._cacheIndex];
    if (cache) {
      _$._cacheIndex += 1;
      return cache;
    }
    _$._cache[_$._cacheIndex] = fn;
    _$._cacheIndex += 1;
    return fn;
  })
  _$._scheduledRender = _$._scheduledRender || undefined;
  _$.use = _$.use || ((defaultValue) => {
    const cache = _$._cache[_$._cacheIndex];
    if (cache) {
      _$._cacheIndex += 1;
      return cache;
    }
    let val = defaultValue;
    const v = (...args) => {
      if (!args.length) {
        return val;
      } else {
        const [arg] = args;
        const nval = typeof arg === "function" ? arg(val) : arg;
        if (val !== nval) {
          val = nval;
          clearTimeout(_$._scheduledRender)
          _$._scheduledRender = setTimeout(() => _$._build())
        }
      }
    };
    _$._cache[_$._cacheIndex] = v;
    _$._cacheIndex += 1;
    return v;
  })
  _$._build = () => {
    const prevParts = _$._parts;
    _$._parts = [];
    _$._cacheIndex = 0;
    if (typeof childrenFunction === "function") childrenFunction(_$)
    const doLater = [];
    const rmNodes = [];
    for (let index = 0; index < _$._parts.length; index++) {
      const pvParh = prevParts[index];
      const part = _$._parts[index];
      const pRes = part()
      const nd = Array.isArray(pRes) ? pRes[0] : pRes;
      if (pvParh && part) {
        const pvRes = pvParh()
        const pvNd = Array.isArray(pvRes) ? pvRes[0] : pvRes;
        if (nd.nodeType === pvNd.nodeType) {
          if (nd.nodeType !== 3) {
            if (nd.nodeName !== pvNd.nodeName) {
              Object.assign(nd, pRes[1])
              hostElement.replaceChild(nd, hostElement.childNodes[index])
              doLater.push(() => $(nd, pRes[2]))
            } else {
              const attrs = pRes[1];
              const pvAttrs = pvRes[1];
              const n = hostElement.childNodes[index];
              for (const key in pvAttrs) {
                const rwrt = Object.hasOwnProperty.call(attrs, key) ? attrs[key] : undefined;
                if (n[key] !== rwrt)
                  n[key] = rwrt;
              }
              for (const key in attrs) {
                const vl = attrs[key];
                if (n[key] !== vl)
                  n[key] = vl;
              }
              doLater.push(() => $(n, pRes[2]))
            }
          } else {
            hostElement.childNodes[index].nodeValue = nd.nodeValue;
          }
        } else {
          if (nd.nodeType !== 3) {
            Object.assign(nd, pRes[1])
            doLater.push(() => $(nd, pRes[2]))
          }
          hostElement.replaceChild(nd, hostElement.childNodes[index])
        }
      } else if (part) {
        if (nd.nodeType !== 3) {
          Object.assign(nd, pRes[1])
          doLater.push(() => $(nd, pRes[2]))
        }
        hostElement.append(nd)
      } else {
        rmNodes.push(hostElement.childNodes[index])
      }
    }
    for (const n of rmNodes) hostElement.removeChild(n)
    for (const task of doLater) task()
  }
  _$._build()
  hostElement._$ = hostElement._$ || _$;
  return hostElement._$;
}