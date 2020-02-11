var req = require.context("./tests/specs/lib", true, /^(.*\.(js$))[^.]*$/gim);
req.keys().forEach(req);
