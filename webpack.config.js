const path = require('path');
var webpack = require('webpack');

var fs = require('fs');
var headerWrap = fs.readFileSync('./VERSION.txt', 'utf8');
var footerWrap = fs.readFileSync('./src/wrap-end.js', 'utf8');
var WrapperPlugin = require('wrapper-webpack-plugin');

const UglifyJsPlugin = require('webpack-uglify-js-plugin');
var JasmineWebpackPlugin = require('jasmine-webpack-plugin');

module.exports = {
	entry: {
		"bundle": "./src/patterns.js",
		"bundle.min": "./src/patterns.js"
	},
	externals: [
		{
			 "window": "window"
		}
	],
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname)
	},
    // Like shims in require.js
    module: {
	    loaders: [
	      { test: /jcrop/, loader: 'imports-loader?jquery' },
		  { test: /jquery/, loader: 'exports-loader?jQuery' },
	      { test: /jquery.anythingslider/, loader: 'imports-loader?jquery' },
	      { test: /jquery.browser/, loader: 'imports-loader?jquery,window' },
	      { test: /jcrop/, loader: 'imports-loader?jquery' },
	      { test: /jquery.chosen/, loader: 'expose-loader?AbstractChosen!imports-loader?chosen,jQuery=jquery,$=jquery,this=>window' },
	      { test: /jquery.placeholder/, loader: 'imports-loader?jquery' },
	      { test: /jquery.textchange/, loader: 'imports-loader?jquery' },
	      { test: /parsley/, loader: 'imports-loader?jquery' },
	      { test: /parsley.extend/, loader: 'imports-loader?jquery' },
	      { test: /select2/, loader: 'imports-loader?jquery' },
	      { test: /spectrum/, loader: 'imports-loader?jquery' },

	      { test: /showdown-github/, loader: 'imports-loader?showdown' },
	      { test: /showdown-prettify/, loader: 'imports-loader?showdown,google-code-prettify' },
	      { test: /showdown-table/, loader: 'imports-loader?showdown' },

	      { test: /modernizr-csspositionsticky/, loader: 'imports-loader?modernizr' },
	      // { test: /backbone/, loader: 'exports-loader?Backbone!imports-loader?underscore,jquery' }
	    ]
    },
	resolve: {
		modules: ['src', 'node_modules'],
		alias: {
				"jasmine": 							"jasmine/lib/jasmine-core/jasmine",
				"jasmine-html":                     "jasmine-core/lib/jasmine-core/jasmine-html",
				"console-runner":                   "phantom-jasmine/lib/console-runner.js",
        		"backbone": 						"lib/backbone-1.1.0",
		        "jqueryUI": 						"lib/jquery-ui.min",
		        "ev-emitter":                       "ev-emitter",
		        "get-size":                         "get-size/get-size.js",
		        "google-code-prettify":             "google-code-prettify/src/prettify.js",
		        "imagesloaded":                     "imagesloaded/imagesloaded.js",
		        "jcrop":                            "jquery-jcrop/js/jquery.Jcrop.min.js",
		        "jquery":                           "jquery/dist/jquery.js",
		        "jquery.browser":                   "jquery.browser/dist/jquery.browser.js",
		        "jquery.anythingslider":            "anythingslider/js/jquery.anythingslider.min.js",
		        "jquery.chosen":                    "chosen-js/chosen.jquery.js",
		        "jquery.form":                      "jquery-form/jquery.form.js",
		        "fullcalendar":                     "fullcalendar/dist/fullcalendar.min.js",
		        "jquery.placeholder":               "jquery-placeholder/jquery.placeholder.js",
		        "jquery.textchange":                "jquery-textchange/jquery.textchange.js",
		        "logging":                          "logging/src/logging.js",
		        "masonry":                          "masonry-layout/dist/masonry.pkgd.min.js",
		        "desandro-matches-selector":        "desandro-matches-selector/matches-selector.js",
		        "modernizr":                        "modernizr/src/Modernizr.js",
		        "modernizr-csspositionsticky$":     path.resolve(__dirname, "node_modules/modernizr/feature-detects/css/positionsticky.js"),
		        "outlayer":                         "outlayer/outlayer.js",
		        "parsley":                          "parsleyjs/parsley.js",
		        "parsley.extend":                   "parsleyjs/parsley.extend.js",
		        "patternslib.slides":               "slides/src/slides.js",
		        "photoswipe":                       "photoswipe/dist/photoswipe.js",
		        "photoswipe-ui":                    path.resolve(__dirname, "node_modules/photoswipe/dist/photoswipe-ui-default"),
		        "pikaday":                          "pikaday/pikaday.js",
		        "prefixfree":                       "prefixfree/prefixfree.min.js",
		        "select2":                          "select2/select2.js",
		        "showdown":                         "showdown/src/showdown.js",
		        "showdown-github":                  "showdown-github/dist/showdown-github.min.js",
		        "showdown-prettify":                "showdown-prettify/dist/showdown-prettify.min.js",
		        "showdown-table":                   "showdown-table/dist/showdown-table.min.js",
		        "spectrum":                         "spectrum/lib/spectrum.js",
		        "stickyfill":                       "Stickyfill/src/stickyfill.js",
		        "text":                             "requirejs-text/text.js",
		        "underscore":                       "underscore/underscore.js",
		        "validate":                         "validate.js/validate.js",
		        // Calendar pattern
		        "moment": 							"moment/moment.js",
		        "moment-timezone": 					"moment-timezone/moment-timezone.js",
		        "moment-timezone-data": 			"pat/calendar/moment-timezone-with-data-2010-2020.js",

		        // Core
		        "pat-compat":               "core/compat.js",
		        "pat-base":                 "core/base.js",
		        "pat-date-picker":          "pat/date-picker/date-picker.js",
		        "pat-depends_parse":        "lib/depends_parse.js",
		        "pat-dependshandler":       "lib/dependshandler.js",
		        "pat-htmlparser":           "lib/htmlparser.js",
		        "pat-input-change-events":  "lib/input-change-events.js",
		        "pat-jquery-ext":           "core/jquery-ext.js",
		        "pat-logger":               "core/logger.js",
		        "pat-parser":               "core/parser.js",
		        "pat-mockup-parser":        "core/mockup-parser.js",
		        "pat-registry":             "core/registry.js",
		        "pat-remove":               "core/remove.js",
		        "pat-store":                "core/store.js",
		        "pat-url":                  "core/url.js",
		        "pat-utils":                "core/utils.js",

		        // Patterns
		        "pat-ajax":                    "pat/ajax/ajax.js",
		        "pat-autofocus":               "pat/autofocus/autofocus.js",
		        "pat-autoscale":               "pat/auto-scale/auto-scale.js",
		        "pat-auto-scale":               "pat/auto-scale/auto-scale.js",
		        "pat-autosubmit":              "pat/auto-submit/auto-submit.js",
		        "pat-auto-submit":              "pat/auto-submit/auto-submit.js",
		        "pat-autosuggest":             "pat/auto-suggest/auto-suggest.js",
		        "pat-auto-suggest":             "pat/auto-suggest/auto-suggest.js",
		        "pat-breadcrumbs":             "pat/breadcrumbs/breadcrumbs.js",
		        "pat-bumper":                  "pat/bumper/bumper.js",
		        "pat-calendar":                "pat/calendar/calendar.js",
		        "pat-carousel":                "pat/carousel/carousel.js",
		        "pat-checkedflag":             "pat/checked-flag/checked-flag.js",
		        "pat-checked-flag":             "pat/checked-flag/checked-flag.js",
		        "pat-checklist":               "pat/checklist/checklist.js",
		        "pat-chosen":                  "pat/chosen/chosen.js",
		        "pat-clone":                   "pat/clone/clone.js",
		        "pat-collapsible":             "pat/collapsible/collapsible.js",
		        "pat-colour-picker":           "pat/colour-picker/colour-picker.js",
		        "pat-depends":                 "pat/depends/depends.js",
		        "pat-edit-tinymce":            "pat/edit-tinymce/edit-tinymce.js",
		        "pat-equaliser":               "pat/equaliser/equaliser.js",
		        "pat-expandable":              "pat/expandable-tree/expandable-tree.js",
		        "pat-expandable-tree":         "pat/expandable-tree/expandable-tree.js",
		        "pat-focus":                   "pat/focus/focus.js",
		        "pat-form-state":              "pat/form-state/form-state.js",
		        "pat-forward":                 "pat/forward/forward.js",
		        "pat-gallery":                 "pat/gallery/gallery.js",
		        "pat-gallery-url":             path.resolve(__dirname, "src/pat/gallery"),
		        "pat-grid":                    "pat/grid/grid.js",  // Hack, there's no grid jS, but we need for website bundler
		        "pat-syntax-highlight":        "pat/syntax-highlight/syntax-highlight.js",
		        "pat-image-crop":              "pat/image-crop/image-crop.js",
		        "pat-inject":                  "pat/inject/inject.js",
		        "pat-legend":                  "pat/legend/legend.js",
		        "pat-markdown":                "pat/markdown/markdown.js",
		        "pat-masonry":                 "pat/masonry/masonry.js",
		        "pat-menu":                    "pat/menu/menu.js",
		        "pat-modal":                   "pat/modal/modal.js",
		        "pat-navigation":              "pat/navigation/navigation.js",
		        "pat-notification":            "pat/notification/notification.js",
		        "pat-placeholder":             "pat/placeholder/placeholder.js",
		        "pat-selectbox":               "pat/selectbox/selectbox.js",
		        "pat-skeleton":                "pat/skeleton/skeleton.js",
		        "pat-slides":                  "pat/slides/slides.js",
		        "pat-slideshow-builder":       "pat/slideshow-builder/slideshow-builder.js",
		        "pat-sortable":                "pat/sortable/sortable.js",
		        "pat-stacks":                  "pat/stacks/stacks.js",
		        "pat-sticky":                  "pat/sticky/sticky.js",
		        "pat-subform":                 "pat/subform/subform.js",
		        "pat-switch":                  "pat/switch/switch.js",
		        "pat-scroll":                  "pat/scroll/scroll.js",
		        "pat-tabs":                    "pat/tabs/tabs.js",
		        "pat-toggle":                  "pat/toggle/toggle.js",
		        "pat-tooltip":                 "pat/tooltip/tooltip.js",
		        "pat-validation":              "pat/validation/validation.js",
		        "pat-zoom":                    "pat/zoom/zoom.js",
		        "patterns":                    "patterns.js"
		}	        
	},
	resolveLoader: {
	  alias: {
	      text: 'text-loader'
	  }
	},
	devtool: "source-map",
        node: {
            // https://github.com/webpack-contrib/css-loader/issues/447
            fs: 'empty'
        },
	plugins: [
		new WrapperPlugin({
	      test: /\.js$/, // only wrap output of bundle files with '.js' extension 
	      header: headerWrap,
	      footer: footerWrap
	    }),
        new UglifyJsPlugin({
		  cacheFolder: path.resolve(__dirname, 'cache/'),
		  debug: true,
		  include: /\.min\.js$/,
		  minimize: true,
		  sourceMap: true,
		  output: {
		    comments: false
		  },
		  compressor: {
		    warnings: false
		  }
		}),
        new JasmineWebpackPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};

