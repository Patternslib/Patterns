function requireDependencies(deps, cb) {
    var is_array;
    if (Array.isArray!==undefined)
        is_array=Array.isArray(deps);
    else
        is_array=Object.prototype.toString.call(deps)==="[object Array]";

    if (!is_array)
        deps=[deps];

    beforeEach(function () {
        var done = false;
        runs(function () {
            require(deps, function () {
                cb && cb.apply(cb, arguments);
                done = true;
            });
        });
        waitsFor(function () {
            return done;
        });
    });
}

// Allows me to specify stubs to return from a require
function requireStubs(stubs) {
    spyOn(window, 'require').andCallFake(function (deps, cb) {
        if (Array.isArray(deps) && deps.some(function (dep) {
            return stubs[dep.replace(/.*\//, '')]
        })) {
            var retDeps = deps.map(function (dep) {
                return stubs[dep.replace(/.*\//, '')];
            })
            cb && cb.apply(cb, retDeps);
        } else {
            return window.require.originalValue.apply(window.require, arguments);
        }
    });
}





