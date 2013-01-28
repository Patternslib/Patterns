var jam = {
    "packages": [
        {
            "name": "prefixfree",
            "location": "../jam/prefixfree",
            "main": "prefixfree.js"
        },
        {
            "name": "modernizer",
            "location": "../jam/modernizer",
            "main": "modernizr-development.js"
        },
        {
            "name": "jquery-textchange",
            "location": "../jam/jquery-textchange",
            "main": "jquery.textchange.js"
        },
        {
            "name": "jquery-placeholder",
            "location": "../jam/jquery-placeholder",
            "main": "jquery.placeholder.js"
        },
        {
            "name": "autoSuggest",
            "location": "../jam/autoSuggest",
            "main": "jquery.autoSuggest.js"
        },
        {
            "name": "jquery",
            "location": "../jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "pagedown-extra",
            "location": "../jam/pagedown-extra",
            "main": "Markdown.Extra.js"
        },
        {
            "name": "jcrop",
            "location": "../jam/jcrop"
        },
        {
            "name": "patterns-jquery-validation",
            "location": "../jam/patterns-jquery-validation",
            "main": "main.js"
        },
        {
            "name": "anythingslider",
            "location": "../jam/anythingslider",
            "main": "js/jquery.anythingslider.js"
        },
        {
            "name": "pagedown",
            "location": "../jam/pagedown",
            "main": "main.js"
        },
        {
            "name": "text",
            "location": "../jam/text",
            "main": "text.js"
        },
        {
            "name": "patterns-jquery-form",
            "location": "../jam/patterns-jquery-form",
            "main": "jquery.form.js"
        },
        {
            "name": "tiny_mce",
            "location": "../jam/tiny_mce",
            "main": "tiny_mce_src.js"
        },
        {
            "name": "less",
            "location": "../jam/less",
            "main": "./dist/less-1.4.0-alpha.js"
        },
        {
            "name": "chosen-js",
            "location": "../jam/chosen-js",
            "main": "chosen/chosen.jquery.js"
        },
        {
            "name": "logging",
            "location": "../jam/logging",
            "main": "src/logging.js"
        },
        {
            "name": "jquery-fullcalendar",
            "location": "../jam/jquery-fullcalendar",
            "main": "fullcalendar/fullcalendar.js"
        }
    ],
    "version": "0.2.13",
    "shim": {
        "jquery-textchange": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-placeholder": {
            "deps": [
                "jquery"
            ]
        },
        "autoSuggest": {
            "deps": [
                "jquery"
            ]
        },
        "pagedown-extra": {
            "deps": [
                "pagedown"
            ]
        },
        "anythingslider": {
            "deps": [
                "jquery"
            ]
        },
        "patterns-jquery-form": {
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
        }
    }
};

if (typeof require !== "undefined" && require.config) {
    require.config({
    "packages": [
        {
            "name": "prefixfree",
            "location": "../jam/prefixfree",
            "main": "prefixfree.js"
        },
        {
            "name": "modernizer",
            "location": "../jam/modernizer",
            "main": "modernizr-development.js"
        },
        {
            "name": "jquery-textchange",
            "location": "../jam/jquery-textchange",
            "main": "jquery.textchange.js"
        },
        {
            "name": "jquery-placeholder",
            "location": "../jam/jquery-placeholder",
            "main": "jquery.placeholder.js"
        },
        {
            "name": "autoSuggest",
            "location": "../jam/autoSuggest",
            "main": "jquery.autoSuggest.js"
        },
        {
            "name": "jquery",
            "location": "../jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "pagedown-extra",
            "location": "../jam/pagedown-extra",
            "main": "Markdown.Extra.js"
        },
        {
            "name": "jcrop",
            "location": "../jam/jcrop"
        },
        {
            "name": "patterns-jquery-validation",
            "location": "../jam/patterns-jquery-validation",
            "main": "main.js"
        },
        {
            "name": "anythingslider",
            "location": "../jam/anythingslider",
            "main": "js/jquery.anythingslider.js"
        },
        {
            "name": "pagedown",
            "location": "../jam/pagedown",
            "main": "main.js"
        },
        {
            "name": "text",
            "location": "../jam/text",
            "main": "text.js"
        },
        {
            "name": "patterns-jquery-form",
            "location": "../jam/patterns-jquery-form",
            "main": "jquery.form.js"
        },
        {
            "name": "tiny_mce",
            "location": "../jam/tiny_mce",
            "main": "tiny_mce_src.js"
        },
        {
            "name": "less",
            "location": "../jam/less",
            "main": "./dist/less-1.4.0-alpha.js"
        },
        {
            "name": "chosen-js",
            "location": "../jam/chosen-js",
            "main": "chosen/chosen.jquery.js"
        },
        {
            "name": "logging",
            "location": "../jam/logging",
            "main": "src/logging.js"
        },
        {
            "name": "jquery-fullcalendar",
            "location": "../jam/jquery-fullcalendar",
            "main": "fullcalendar/fullcalendar.js"
        }
    ],
    "shim": {
        "jquery-textchange": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-placeholder": {
            "deps": [
                "jquery"
            ]
        },
        "autoSuggest": {
            "deps": [
                "jquery"
            ]
        },
        "pagedown-extra": {
            "deps": [
                "pagedown"
            ]
        },
        "anythingslider": {
            "deps": [
                "jquery"
            ]
        },
        "patterns-jquery-form": {
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
        }
    }
});
}
else {
    var require = {
    "packages": [
        {
            "name": "prefixfree",
            "location": "../jam/prefixfree",
            "main": "prefixfree.js"
        },
        {
            "name": "modernizer",
            "location": "../jam/modernizer",
            "main": "modernizr-development.js"
        },
        {
            "name": "jquery-textchange",
            "location": "../jam/jquery-textchange",
            "main": "jquery.textchange.js"
        },
        {
            "name": "jquery-placeholder",
            "location": "../jam/jquery-placeholder",
            "main": "jquery.placeholder.js"
        },
        {
            "name": "autoSuggest",
            "location": "../jam/autoSuggest",
            "main": "jquery.autoSuggest.js"
        },
        {
            "name": "jquery",
            "location": "../jam/jquery",
            "main": "dist/jquery.js"
        },
        {
            "name": "pagedown-extra",
            "location": "../jam/pagedown-extra",
            "main": "Markdown.Extra.js"
        },
        {
            "name": "jcrop",
            "location": "../jam/jcrop"
        },
        {
            "name": "patterns-jquery-validation",
            "location": "../jam/patterns-jquery-validation",
            "main": "main.js"
        },
        {
            "name": "anythingslider",
            "location": "../jam/anythingslider",
            "main": "js/jquery.anythingslider.js"
        },
        {
            "name": "pagedown",
            "location": "../jam/pagedown",
            "main": "main.js"
        },
        {
            "name": "text",
            "location": "../jam/text",
            "main": "text.js"
        },
        {
            "name": "patterns-jquery-form",
            "location": "../jam/patterns-jquery-form",
            "main": "jquery.form.js"
        },
        {
            "name": "tiny_mce",
            "location": "../jam/tiny_mce",
            "main": "tiny_mce_src.js"
        },
        {
            "name": "less",
            "location": "../jam/less",
            "main": "./dist/less-1.4.0-alpha.js"
        },
        {
            "name": "chosen-js",
            "location": "../jam/chosen-js",
            "main": "chosen/chosen.jquery.js"
        },
        {
            "name": "logging",
            "location": "../jam/logging",
            "main": "src/logging.js"
        },
        {
            "name": "jquery-fullcalendar",
            "location": "../jam/jquery-fullcalendar",
            "main": "fullcalendar/fullcalendar.js"
        }
    ],
    "shim": {
        "jquery-textchange": {
            "deps": [
                "jquery"
            ]
        },
        "jquery-placeholder": {
            "deps": [
                "jquery"
            ]
        },
        "autoSuggest": {
            "deps": [
                "jquery"
            ]
        },
        "pagedown-extra": {
            "deps": [
                "pagedown"
            ]
        },
        "anythingslider": {
            "deps": [
                "jquery"
            ]
        },
        "patterns-jquery-form": {
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
        }
    }
};
}

if (typeof exports !== "undefined" && typeof module !== "undefined") {
    module.exports = jam;
}