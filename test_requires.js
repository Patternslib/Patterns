var req = require.context("./tests/specs/lib", true, /^(.*\.(js$))[^.]*$/igm);
req.keys().forEach(req)
