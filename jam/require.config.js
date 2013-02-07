var jam = {
    "packages": [
        {
            "name": "anythingslider",
            "location": "../jam/anythingslider",
            "main": "js/jquery.anythingslider.js"
        },
        {
            "name": "autoSuggest",
            "location": "../jam/autoSuggest",
            "main": "jquery.autoSuggest.js"
        },
        {
            "name": "chosen-js",
            "location": "../jam/chosen-js",
            "main": "chosen/chosen.jquery.js"
        },
        {
            "name": "jasmine",
            "location": "../jam/jasmine"
        },
        {
            "name": "jcrop",
            "location": "../jam/jcrop"
        },
        {
            "name": "jquery",
            "location": "../jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-fullcalendar",
            "location": "../jam/jquery-fullcalendar",
            "main": "fullcalendar/fullcalendar.js"
        },
        {
            "name": "jquery-placeholder",
            "location": "../jam/jquery-placeholder",
            "main": "jquery.placeholder.js"
        },
        {
            "name": "jquery-textchange",
            "location": "../jam/jquery-textchange",
            "main": "jquery.textchange.js"
        },
        {
            "name": "less",
            "location": "../jam/less",
            "main": "./dist/less-1.4.0-alpha.js"
        },
        {
            "name": "logging",
            "location": "../jam/logging",
            "main": "src/logging.js"
        },
        {
            "name": "modernizer",
            "location": "../jam/modernizer",
            "main": "modernizr-development.js"
        },
        {
            "name": "pagedown",
            "location": "../jam/pagedown",
            "main": "node-pagedown.js"
        },
        {
            "name": "pagedown-extra",
            "location": "../jam/pagedown-extra",
            "main": "Markdown.Extra.js"
        },
        {
            "name": "patterns-jquery-form",
            "location": "../jam/patterns-jquery-form",
            "main": "jquery.form.js"
        },
        {
            "name": "patterns-jquery-validation",
            "location": "../jam/patterns-jquery-validation",
            "main": "main.js"
        },
        {
            "name": "prefixfree",
            "location": "../jam/prefixfree",
            "main": "prefixfree.js"
        },
        {
            "name": "text",
            "location": "../jam/text",
            "main": "text.js"
        },
        {
            "name": "tiny_mce",
            "location": "../jam/tiny_mce",
            "main": "tiny_mce_src.js"
        }
    ],
    "version": "0.2.13",
    "shim": {
        "anythingslider": {
            "deps": [
                "jquery"
            ]
        },
        "autoSuggest": {
            "deps": [
                "jquery"
            ]
        },
        "chosen-js": {
            "deps": [
                "jquery"
            ],
            "exports": "chosen"
        },
        "jquery-fullcalendar": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-placeholder": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-textchange": {
            "deps": [
                "jquery"
            ]
        },
        "pagedown-extra": {
            "deps": [
                "pagedown"
            ]
        },
        "patterns-jquery-form": {
            "deps": [
                "jquery"
            ]
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "anythingslider",
            "location": "../jam/anythingslider",
            "main": "js/jquery.anythingslider.js"
        },
        {
            "name": "autoSuggest",
            "location": "../jam/autoSuggest",
            "main": "jquery.autoSuggest.js"
        },
        {
            "name": "chosen-js",
            "location": "../jam/chosen-js",
            "main": "chosen/chosen.jquery.js"
        },
        {
            "name": "jasmine",
            "location": "../jam/jasmine"
        },
        {
            "name": "jcrop",
            "location": "../jam/jcrop"
        },
        {
            "name": "jquery",
            "location": "../jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-fullcalendar",
            "location": "../jam/jquery-fullcalendar",
            "main": "fullcalendar/fullcalendar.js"
        },
        {
            "name": "jquery-placeholder",
            "location": "../jam/jquery-placeholder",
            "main": "jquery.placeholder.js"
        },
        {
            "name": "jquery-textchange",
            "location": "../jam/jquery-textchange",
            "main": "jquery.textchange.js"
        },
        {
            "name": "less",
            "location": "../jam/less",
            "main": "./dist/less-1.4.0-alpha.js"
        },
        {
            "name": "logging",
            "location": "../jam/logging",
            "main": "src/logging.js"
        },
        {
            "name": "modernizer",
            "location": "../jam/modernizer",
            "main": "modernizr-development.js"
        },
        {
            "name": "pagedown",
            "location": "../jam/pagedown",
            "main": "node-pagedown.js"
        },
        {
            "name": "pagedown-extra",
            "location": "../jam/pagedown-extra",
            "main": "Markdown.Extra.js"
        },
        {
            "name": "patterns-jquery-form",
            "location": "../jam/patterns-jquery-form",
            "main": "jquery.form.js"
        },
        {
            "name": "patterns-jquery-validation",
            "location": "../jam/patterns-jquery-validation",
            "main": "main.js"
        },
        {
            "name": "prefixfree",
            "location": "../jam/prefixfree",
            "main": "prefixfree.js"
        },
        {
            "name": "text",
            "location": "../jam/text",
            "main": "text.js"
        },
        {
            "name": "tiny_mce",
            "location": "../jam/tiny_mce",
            "main": "tiny_mce_src.js"
        }
    ],
    "shim": {
        "anythingslider": {
            "deps": [
                "jquery"
            ]
        },
        "autoSuggest": {
            "deps": [
                "jquery"
            ]
        },
        "chosen-js": {
            "deps": [
                "jquery"
            ],
            "exports": "chosen"
        },
        "jquery-fullcalendar": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-placeholder": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-textchange": {
            "deps": [
                "jquery"
            ]
        },
        "pagedown-extra": {
            "deps": [
                "pagedown"
            ]
        },
        "patterns-jquery-form": {
            "deps": [
                "jquery"
            ]
        }
    }
});
}
else {
    var require = {
    "packages": [
        {
            "name": "anythingslider",
            "location": "../jam/anythingslider",
            "main": "js/jquery.anythingslider.js"
        },
        {
            "name": "autoSuggest",
            "location": "../jam/autoSuggest",
            "main": "jquery.autoSuggest.js"
        },
        {
            "name": "chosen-js",
            "location": "../jam/chosen-js",
            "main": "chosen/chosen.jquery.js"
        },
        {
            "name": "jasmine",
            "location": "../jam/jasmine"
        },
        {
            "name": "jcrop",
            "location": "../jam/jcrop"
        },
        {
            "name": "jquery",
            "location": "../jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "jquery-fullcalendar",
            "location": "../jam/jquery-fullcalendar",
            "main": "fullcalendar/fullcalendar.js"
        },
        {
            "name": "jquery-placeholder",
            "location": "../jam/jquery-placeholder",
            "main": "jquery.placeholder.js"
        },
        {
            "name": "jquery-textchange",
            "location": "../jam/jquery-textchange",
            "main": "jquery.textchange.js"
        },
        {
            "name": "less",
            "location": "../jam/less",
            "main": "./dist/less-1.4.0-alpha.js"
        },
        {
            "name": "logging",
            "location": "../jam/logging",
            "main": "src/logging.js"
        },
        {
            "name": "modernizer",
            "location": "../jam/modernizer",
            "main": "modernizr-development.js"
        },
        {
            "name": "pagedown",
            "location": "../jam/pagedown",
            "main": "node-pagedown.js"
        },
        {
            "name": "pagedown-extra",
            "location": "../jam/pagedown-extra",
            "main": "Markdown.Extra.js"
        },
        {
            "name": "patterns-jquery-form",
            "location": "../jam/patterns-jquery-form",
            "main": "jquery.form.js"
        },
        {
            "name": "patterns-jquery-validation",
            "location": "../jam/patterns-jquery-validation",
            "main": "main.js"
        },
        {
            "name": "prefixfree",
            "location": "../jam/prefixfree",
            "main": "prefixfree.js"
        },
        {
            "name": "text",
            "location": "../jam/text",
            "main": "text.js"
        },
        {
            "name": "tiny_mce",
            "location": "../jam/tiny_mce",
            "main": "tiny_mce_src.js"
        }
    ],
    "shim": {
        "anythingslider": {
            "deps": [
                "jquery"
            ]
        },
        "autoSuggest": {
            "deps": [
                "jquery"
            ]
        },
        "chosen-js": {
            "deps": [
                "jquery"
            ],
            "exports": "chosen"
        },
        "jquery-fullcalendar": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-placeholder": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-textchange": {
            "deps": [
                "jquery"
            ]
        },
        "pagedown-extra": {
            "deps": [
                "pagedown"
            ]
        },
        "patterns-jquery-form": {
            "deps": [
                "jquery"
            ]
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}