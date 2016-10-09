(function () {
    function processThis(fn, context) {
        var outerArg = Array.prototype.slice.call(arguments, 2);
        return function () {
            var innerArg = Array.prototype.slice.call(arguments, 0);
            fn.apply(context, outerArg.concat(innerArg));
        }
    }

    function on(curEle, evenType, evenFn) {
        if (/^zt/.test(evenType)) {//->自定义的
            if (!curEle["myBook" + evenType]) {
                curEle["myBook" + evenType] = [];
            }
            var ary = curEle["myBook" + evenType];
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === evenFn) {
                    return;
                }
            }
            ary.push(evenFn);
        } else {//->内置的
            if ("addEventListener" in window) {
                curEle.addEventListener(evenType, evenFn, false);
                return;
            }
            if (!curEle["myEvent" + evenType]) {
                curEle["myEvent" + evenType] = [];
                curEle.attachEvent("on" + evenType, processThis(run, curEle));
            }
            var ary = curEle["myEvent" + evenType];
            for (var i = 0; i < ary.length; i++) {
                if (ary[i] === evenFn) {
                    return;
                }
            }
            ary.push(evenFn);
        }
    }

    function run(e) {
        e = e || window.event;
        e.target = e.srcElement;
        e.pageX = (document.documentElement.scrollLeft || document.body.scrollLeft) + e.clientX;
        e.pageY = (document.documentElement.scrollTop || document.body.scrollTop) + e.clientY;
        e.preventDefault = function () {
            e.returnValue = false;
        };
        e.stopPropagation = function () {
            e.cancelBubble = true;
        };

        var ary = this["myEvent" + e.type];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var tempFn = ary[i];
                if (typeof tempFn === "function") {
                    tempFn.call(this, e);
                } else {
                    ary.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function fire(evenType, e) {
        var ary = this["myBook" + evenType];
        if (ary && ary instanceof Array) {
            for (var i = 0; i < ary.length; i++) {
                var tempFn = ary[i];
                if (typeof tempFn === "function") {
                    tempFn.call(this, e);
                } else {
                    ary.splice(i, 1);
                    i--;
                }
            }
        }
    }

    function off(curEle, evenType, evenFn) {
        if (/^zt/.test(evenType)) {
            var ary = curEle["myBook" + evenType];
            if (ary && ary instanceof Array) {
                for (var i = 0; i < ary.length; i++) {
                    var tempFn = ary[i];
                    if (tempFn === evenFn) {
                        ary[i] = null;
                        return;
                    }
                }
            }
        } else {
            if ("removeEventListener" in window) {
                curEle.removeEventListener(evenType, evenFn, false);
                return;
            }
            var ary = curEle["myEvent" + evenType];
            if (ary && ary instanceof Array) {
                for (var i = 0; i < ary.length; i++) {
                    var tempFn = ary[i];
                    if (tempFn === evenFn) {
                        ary[i] = null;
                        return;
                    }
                }
            }
        }
    }

    window.ztEvent = window.$event = {
        processThis: processThis,
        on: on,
        off: off,
        fire: fire
    };
})();
