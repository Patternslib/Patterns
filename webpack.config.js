const path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './src/patterns.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	},
    module: {
	    loaders: [
	      { test: /underscore/, loader: 'exports-loader?_' },
	      { test: /backbone/, loader: 'exports-loader?Backbone!imports-loader?underscore,jquery' }
	    ]
    },
	resolve: {
		modules: ['src', 'node_modules'],
		alias: {
        		"backbone": "lib/backbone-1.1.0",
        		"jquery": "lib/jquery-1.10.2",
        		"underscore": "lib/lodash.underscore-2.3.0",
		        "jqueryUI": "lib/jquery-ui.min",
		        "ev-emitter":                       "ev-emitter",
		        "get-size":                         "get-size/get-size",
		        "google-code-prettify":             "google-code-prettify/src/prettify.js",
		        "imagesloaded":                     "imagesloaded/imagesloaded",
		        "jcrop":                            "jquery-jcrop/js/jquery.Jcrop.min.js",
		        "jquery":                           "jquery/dist/jquery",
		        "jquery.browser":                   "jquery.browser/dist/jquery.browser",
		        "jquery.anythingslider":            "anythingSlider/js/jquery.anythingslider.min.js",
		        "jquery.chosen":                    "chosen/chosen/chosen.jquery",
		        "jquery.form":                      "jquery-form/jquery.form",
		        "jquery.fullcalendar":              "fullcalendar/fullcalendar.min",
		        "jquery.fullcalendar.dnd":          "fullcalendar/lib/jquery-ui.custom.min",
		        "jquery.placeholder":               "jquery-placeholder/jquery.placeholder",
		        "jquery.textchange":                "jquery-textchange/jquery.textchange",
		        "logging":                          "logging/src/logging",
		        "masonry":                          "masonry-layout/dist/masonry.pkgd.min.js",
		        "desandro-matches-selector":        "desandro-matches-selector/matches-selector",
		        "modernizr":                        "modernizr/modernizr",
		        "modernizr-csspositionsticky":      "modernizr/feature-detects/css-positionsticky",
		        "outlayer":                         "outlayer/outlayer",
		        "parsley":                          "parsleyjs/parsley",
		        "parsley.extend":                   "parsleyjs/parsley.extend",
		        "patternslib.slides":               "slides/src/slides",
		        "photoswipe":                       "photoswipe/dist/photoswipe.js",
		        "photoswipe-ui":                    "photoswipe/dist/photoswipe-ui-default.js",
		        "pikaday":                          "pikaday/pikaday",
		        "prefixfree":                       "prefixfree/prefixfree.min",
		        "select2":                          "select2/select2.js",
		        "showdown":                         "showdown/src/showdown",
		        "showdown-github":                  "showdown-github/dist/showdown-github.min.js",
		        "showdown-prettify":                "showdown-prettify/dist/showdown-prettify.min.js",
		        "showdown-table":                   "showdown-table/dist/showdown-table.min.js",
		        "spectrum":                         "spectrum/lib/spectrum",
		        "stickyfill":                       "Stickyfill/src/stickyfill",
		        "text":                             "requirejs-text/text",
		        "tinymce":                          "jquery.tinymce/jscripts/tiny_mce/jquery.tinymce",
		        "underscore":                       "underscore/underscore",
		        "validate":                         "validate.js/validate.js",
		        // Calendar pattern
		        "moment": 							"moment/moment",
		        "moment-timezone": 					"moment-timezone/moment-timezone",
		        "moment-timezone-data": 			"pat/calendar/moment-timezone-with-data-2010-2020",

		        // Core
		        "pat-compat":               "core/compat",
		        "pat-base":                 "core/base",
		        "pat-date-picker":          "pat/date-picker/date-picker",
		        "pat-depends_parse":        "lib/depends_parse",
		        "pat-dependshandler":       "lib/dependshandler",
		        "pat-htmlparser":           "lib/htmlparser",
		        "pat-input-change-events":  "lib/input-change-events",
		        "pat-jquery-ext":           "core/jquery-ext",
		        "pat-logger":               "core/logger",
		        "pat-parser":               "core/parser",
		        "pat-mockup-parser":        "core/mockup-parser",
		        "pat-registry":             "core/registry",
		        "pat-remove":               "core/remove",
		        "pat-store":                "core/store",
		        "pat-url":                  "core/url",
		        "pat-utils":                "core/utils",

		        // Patterns
		        "pat-ajax":                    "pat/ajax/ajax",
		        "pat-autofocus":               "pat/autofocus/autofocus",
		        "pat-autoscale":               "pat/auto-scale/auto-scale",
		        "pat-auto-scale":               "pat/auto-scale/auto-scale",
		        "pat-autosubmit":              "pat/auto-submit/auto-submit",
		        "pat-auto-submit":              "pat/auto-submit/auto-submit",
		        "pat-autosuggest":             "pat/auto-suggest/auto-suggest",
		        "pat-auto-suggest":             "pat/auto-suggest/auto-suggest",
		        "pat-breadcrumbs":             "pat/breadcrumbs/breadcrumbs",
		        "pat-bumper":                  "pat/bumper/bumper",
		        "pat-calendar":                "pat/calendar/calendar",
		        "pat-carousel":                "pat/carousel/carousel",
		        "pat-checkedflag":             "pat/checked-flag/checked-flag",
		        "pat-checked-flag":             "pat/checked-flag/checked-flag",
		        "pat-checklist":               "pat/checklist/checklist",
		        "pat-chosen":                  "pat/chosen/chosen",
		        "pat-clone":                   "pat/clone/clone",
		        "pat-collapsible":             "pat/collapsible/collapsible",
		        "pat-colour-picker":           "pat/colour-picker/colour-picker",
		        "pat-depends":                 "pat/depends/depends",
		        "pat-edit-tinymce":            "pat/edit-tinymce/edit-tinymce",
		        "pat-equaliser":               "pat/equaliser/equaliser",
		        "pat-expandable":              "pat/expandable-tree/expandable-tree",
		        "pat-expandable-tree":         "pat/expandable-tree/expandable-tree",
		        "pat-focus":                   "pat/focus/focus",
		        "pat-form-state":              "pat/form-state/form-state",
		        "pat-forward":                 "pat/forward/forward",
		        "pat-gallery":                 "pat/gallery/gallery",
		        "pat-gallery-url":             "pat/gallery",
		        "pat-grid":                    "pat/grid/grid",  // Hack, there's no grid jS, but we need for website bundler
		        "pat-syntax-highlight":        "pat/syntax-highlight/syntax-highlight",
		        "pat-image-crop":              "pat/image-crop/image-crop",
		        "pat-inject":                  "pat/inject/inject",
		        "pat-legend":                  "pat/legend/legend",
		        "pat-markdown":                "pat/markdown/markdown",
		        "pat-masonry":                 "pat/masonry/masonry",
		        "pat-menu":                    "pat/menu/menu",
		        "pat-modal":                   "pat/modal/modal",
		        "pat-navigation":              "pat/navigation/navigation",
		        "pat-notification":            "pat/notification/notification",
		        "pat-placeholder":             "pat/placeholder/placeholder",
		        "pat-selectbox":               "pat/selectbox/selectbox",
		        "pat-skeleton":                "pat/skeleton/skeleton",
		        "pat-slides":                  "pat/slides/slides",
		        "pat-slideshow-builder":       "pat/slideshow-builder/slideshow-builder",
		        "pat-sortable":                "pat/sortable/sortable",
		        "pat-stacks":                  "pat/stacks/stacks",
		        "pat-sticky":                  "pat/sticky/sticky",
		        "pat-subform":                 "pat/subform/subform",
		        "pat-switch":                  "pat/switch/switch",
		        "pat-scroll":                  "pat/scroll/scroll",
		        "pat-tabs":                    "pat/tabs/tabs",
		        "pat-toggle":                  "pat/toggle/toggle",
		        "pat-tooltip":                 "pat/tooltip/tooltip",
		        "pat-validation":              "pat/validation/validation",
		        "pat-zoom":                    "pat/zoom/zoom",
		        "patterns":                    "patterns"
		}	        
	},
	devtool: "source-map",
        node: {
            // https://github.com/webpack-contrib/css-loader/issues/447
            fs: 'empty'
        },
	plugins: [
			new webpack.optimize.CommonsChunkPlugin({
		    	name: 'vendor',
		    	filename: 'vendor-[hash].min.js',
		  	}),
	        new webpack.optimize.UglifyJsPlugin({
	        	compress: {
	        		warnings: false,
	        		drop_console: false,
	        	}
	        }),
	        new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'})
	    ]
};

