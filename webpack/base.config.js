// Organised as described in https://simonsmith.io/organising-webpack-config-environments/
process.traceDeprecation = true;
const path = require('path');
var webpack = require('webpack');

var fs = require('fs');
var headerWrap = '';
try { var headerWrap = fs.readFileSync('./VERSION.txt', 'utf8'); } catch (err) {}
var footerWrap = '';
try { var footerWrap = fs.readFileSync('./src/wrap-end.js', 'utf8'); } catch (err) {}


var WrapperPlugin = require('wrapper-webpack-plugin');
var DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const BundleVisualizer = require('webpack-visualizer-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        "bundle": "./src/patterns.js",
    },
    externals: [{
        "window": "window"
    }],
    output: {
        filename: "[name].js",
        chunkFilename: 'chunks/[name].[contenthash].js',
        publicPath: '/',
        path: path.resolve(__dirname, '../'),
    },
    optimization: {
        splitChunks: {
            chunks: "async",
        },
        minimize: true,
        minimizer: [
          new TerserPlugin({
            include: /\.min\.js$/,
          }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: require.resolve('jquery'),
                use: [{
                        loader: 'expose-loader',
                        query: '$'
                    },
                    {
                        loader: 'expose-loader',
                        query: 'jQuery'
                    }
                ]
            },
            {
                test: /jquery.chosen/,
                use: [{
                        loader: 'expose-loader',
                        query: 'AbstractChosen'
                    },
                    {
                        loader: 'imports-loader?chosen,jQuery=jquery,$=jquery,this=>window',
                    }
                ]
            },
            {
                test: /jquery.anythingslider|jcrop|jquery.placeholder|jquery.textchange|parsley|parsley.extend|select2|spectrum|spectrum-colorpicker/,
                use: [
                    {
                      loader: 'imports-loader?jquery',
                    }
                ]
            },
            {
                test: /showdown-prettify/,
                use: [
                    {
                      loader: 'imports-loader?showdown,google-code-prettify',
                    }
                ]
            },
            {
                issuer: [
                    __dirname + '/../tests/specs/*/*.js$/',
                    __dirname + '../src/pat/*/tests.js$/'
                ],
                use: [
                    {
                        loader: 'imports-loader?jQuery=jquery,$=jquery'
                    }
                ]
            },
            {
                loader: "webpack-modernizr-loader",
                test: /\.modernizrrc\.js$/
            },
	        {
		        test: /\.css$/,
		        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
	        },
        ]
    },
    resolve: {
        alias: {
            "jquery": path.resolve(__dirname, "../node_modules/jquery/dist/jquery.js"),
            "autobahn": path.resolve(__dirname, "../node_modules/autobahn/lib/autobahn.js"),
            "push-kit": path.resolve(__dirname, "../node_modules/core/push_kit.js"),
            "google-code-prettify": path.resolve(__dirname, "../node_modules/google-code-prettify/src/prettify.js"),
            "intersection-observer": path.resolve(__dirname, "../node_modules/intersection-observer/intersection-observer.js"),
            "jcrop": path.resolve(__dirname, "../node_modules/jquery-jcrop/js/jquery.Jcrop.min.js"),
            "jquery.anythingslider": path.resolve(__dirname, "../node_modules/anythingslider/js/jquery.anythingslider.min.js"),
            "jquery.chosen": path.resolve(__dirname, "../node_modules/chosen-js/chosen.jquery.js"),
            "jquery.placeholder": path.resolve(__dirname, "../node_modules/jquery-placeholder/jquery.placeholder.js"),
            "jquery.textchange": path.resolve(__dirname, "../node_modules/jquery-textchange/jquery.textchange.js"),
            "logging": path.resolve(__dirname, "../node_modules/logging/src/logging.js"),
            "masonry": path.resolve(__dirname, "../node_modules/masonry-layout/dist/masonry.pkgd.min.js"),
            "modernizr": path.resolve(__dirname, "../.modernizrrc.js"),
            "patternslib.slides": path.resolve(__dirname, "../node_modules/slides/src/slides.js"),
            "photoswipe-ui": path.resolve(__dirname, "../node_modules/photoswipe/dist/photoswipe-ui-default"),
            "prefixfree": path.resolve(__dirname, "../node_modules/prefixfree/prefixfree.min.js"),
            "select2": path.resolve(__dirname, "../node_modules/select2/select2.js"),
            "showdown-prettify": path.resolve(__dirname, "../node_modules/showdown-prettify/dist/showdown-prettify.min.js"),
            "screenful": path.resolve(__dirname, "../node_modules/screenfull/dist/screenfull.js"),
            "slick-carousel": path.resolve(__dirname, "../node_modules/slick-carousel/slick/slick.js"),
            "stickyfilljs": path.resolve(__dirname, "../node_modules/stickyfilljs/dist/stickyfill.js"),
            "text": path.resolve(__dirname, "../node_modules/requirejs-text/text.js"),
	        "tippy": path.resolve(__dirname, "../node_modules/tippy.js/umd/index.all.js"),
	        "tippy-theme.css": path.resolve(__dirname, "../node_modules/tippy.js/themes/light-border.css"),
            "validate": path.resolve(__dirname, "../node_modules/validate.js/validate.js"),
            "moment-locale-bg": path.resolve(__dirname, "../node_modules/moment/locale/bg"),
            "moment-locale-hr": path.resolve(__dirname, "../node_modules/moment/locale/hr"),
            "moment-locale-cs": path.resolve(__dirname, "../node_modules/moment/locale/cs"),
            "moment-locale-da": path.resolve(__dirname, "../node_modules/moment/locale/da"),
            "moment-locale-nl": path.resolve(__dirname, "../node_modules/moment/locale/nl"),
            "moment-locale-es": path.resolve(__dirname, "../node_modules/moment/locale/es"),
            "moment-locale-fi": path.resolve(__dirname, "../node_modules/moment/locale/fi"),
            "moment-locale-fr": path.resolve(__dirname, "../node_modules/moment/locale/fr"),
            "moment-locale-de": path.resolve(__dirname, "../node_modules/moment/locale/de"),
            "moment-locale-el": path.resolve(__dirname, "../node_modules/moment/locale/el"),
            "moment-locale-hu": path.resolve(__dirname, "../node_modules/moment/locale/hu"),
            "moment-locale-it": path.resolve(__dirname, "../node_modules/moment/locale/it"),
            "moment-locale-lt": path.resolve(__dirname, "../node_modules/moment/locale/lt"),
            "moment-locale-lv": path.resolve(__dirname, "../node_modules/moment/locale/lv"),
            "moment-locale-mt": path.resolve(__dirname, "../node_modules/moment/locale/mt"),
            "moment-locale-pl": path.resolve(__dirname, "../node_modules/moment/locale/pl"),
            "moment-locale-pt": path.resolve(__dirname, "../node_modules/moment/locale/pt"),
            "moment-locale-ro": path.resolve(__dirname, "../node_modules/moment/locale/ro"),
            "moment-locale-sl": path.resolve(__dirname, "../node_modules/moment/locale/sl"),
            "moment-locale-sk": path.resolve(__dirname, "../node_modules/moment/locale/sk"),
            "moment-locale-es": path.resolve(__dirname, "../node_modules/moment/locale/es"),
            "moment-locale-sv": path.resolve(__dirname, "../node_modules/moment/locale/sv"),
            "moment-timezone-data": path.resolve(__dirname, "../src/pat/calendar/moment-timezone-with-data-2010-2020.js"),
            // Core
            "pat-compat": path.resolve(__dirname, "../src/core/compat.js"),
            "pat-base": path.resolve(__dirname, "../src/core/base.js"),
            "scroll-detection": path.resolve(__dirname, "../src/core/scroll_detection.js"),
            "pat-date-picker": path.resolve(__dirname, "../src/pat/date-picker/date-picker.js"),
            "pat-datetime-picker": path.resolve(__dirname, "../src/pat/datetime-picker/datetime-picker.js"),
            "pat-depends_parse": path.resolve(__dirname, "../src/lib/depends_parse.js"),
            "pat-dependshandler": path.resolve(__dirname, "../src/lib/dependshandler.js"),
            "pat-display-time": path.resolve(__dirname, "../src/pat/display-time/display-time.js"),
            "pat-htmlparser": path.resolve(__dirname, "../src/lib/htmlparser.js"),
            "pat-input-change-events": path.resolve(__dirname, "../src/lib/input-change-events.js"),
            "pat-jquery-ext": path.resolve(__dirname, "../src/core/jquery-ext.js"),
            "pat-logger": path.resolve(__dirname, "../src/core/logger.js"),
            "pat-parser": path.resolve(__dirname, "../src/core/parser.js"),
            "pat-mockup-parser": path.resolve(__dirname, "../src/core/mockup-parser.js"),
            "pat-registry": path.resolve(__dirname, "../src/core/registry.js"),
            "pat-remove": path.resolve(__dirname, "../src/core/remove.js"),
            "pat-store": path.resolve(__dirname, "../src/core/store.js"),
            "pat-url": path.resolve(__dirname, "../src/core/url.js"),
            "pat-utils": path.resolve(__dirname, "../src/core/utils.js"),

            // Patterns
            "pat-ajax": path.resolve(__dirname, "../src/pat/ajax/ajax.js"),
            "pat-autofocus": path.resolve(__dirname, "../src/pat/autofocus/autofocus.js"),
            "pat-autoscale": path.resolve(__dirname, "../src/pat/auto-scale/auto-scale.js"),
            "pat-auto-scale": path.resolve(__dirname, "../src/pat/auto-scale/auto-scale.js"),
            "pat-autosubmit": path.resolve(__dirname, "../src/pat/auto-submit/auto-submit.js"),
            "pat-auto-submit": path.resolve(__dirname, "../src/pat/auto-submit/auto-submit.js"),
            "pat-autosuggest": path.resolve(__dirname, "../src/pat/auto-suggest/auto-suggest.js"),
            "pat-auto-suggest": path.resolve(__dirname, "../src/pat/auto-suggest/auto-suggest.js"),
            "pat-breadcrumbs": path.resolve(__dirname, "../src/pat/breadcrumbs/breadcrumbs.js"),
            "pat-bumper": path.resolve(__dirname, "../src/pat/bumper/bumper.js"),
            "pat-calendar": path.resolve(__dirname, "../src/pat/calendar/calendar.js"),
            "pat-carousel": path.resolve(__dirname, "../src/pat/carousel/carousel.js"),
            "pat-carousel-legacy": path.resolve(__dirname, "../src/pat/carousel-legacy/carousel-legacy.js"),
            "pat-checkedflag": path.resolve(__dirname, "../src/pat/checked-flag/checked-flag.js"),
            "pat-checked-flag": path.resolve(__dirname, "../src/pat/checked-flag/checked-flag.js"),
            "pat-checklist": path.resolve(__dirname, "../src/pat/checklist/checklist.js"),
            "pat-chosen": path.resolve(__dirname, "../src/pat/chosen/chosen.js"),
            "pat-clone": path.resolve(__dirname, "../src/pat/clone/clone.js"),
            "pat-collapsible": path.resolve(__dirname, "../src/pat/collapsible/collapsible.js"),
            "pat-colour-picker": path.resolve(__dirname, "../src/pat/colour-picker/colour-picker.js"),
            "pat-depends": path.resolve(__dirname, "../src/pat/depends/depends.js"),
            "pat-edit-tinymce": path.resolve(__dirname, "../src/pat/edit-tinymce/edit-tinymce.js"),
            "pat-equaliser": path.resolve(__dirname, "../src/pat/equaliser/equaliser.js"),
            "pat-expandable": path.resolve(__dirname, "../src/pat/expandable-tree/expandable-tree.js"),
            "pat-expandable-tree": path.resolve(__dirname, "../src/pat/expandable-tree/expandable-tree.js"),
            "pat-focus": path.resolve(__dirname, "../src/pat/focus/focus.js"),
            "pat-form-state": path.resolve(__dirname, "../src/pat/form-state/form-state.js"),
            "pat-forward": path.resolve(__dirname, "../src/pat/forward/forward.js"),
            "pat-fullscreen": path.resolve(__dirname, "../src/pat/fullscreen/fullscreen.js"),
            "pat-fullscreen-close": path.resolve(__dirname, "../src/pat/fullscreen/fullscreen-close.js"),
            "pat-gallery": path.resolve(__dirname, "../src/pat/gallery/gallery.js"),
            "pat-gallery-template": path.resolve(__dirname, "../src/pat/gallery/template.html"),
            "pat-grid": path.resolve(__dirname, "../src/pat/grid/grid.js"), // Hack, there's no grid jS, but we need for website bundler
            "pat-syntax-highlight": path.resolve(__dirname, "../src/pat/syntax-highlight/syntax-highlight.js"),
            "pat-image-crop": path.resolve(__dirname, "../src/pat/image-crop/image-crop.js"),
            "pat-inject": path.resolve(__dirname, "../src/pat/inject/inject.js"),
            "pat-legend": path.resolve(__dirname, "../src/pat/legend/legend.js"),
            "pat-markdown": path.resolve(__dirname, "../src/pat/markdown/markdown.js"),
            "pat-masonry": path.resolve(__dirname, "../src/pat/masonry/masonry.js"),
            "pat-menu": path.resolve(__dirname, "../src/pat/menu/menu.js"),
            "pat-modal": path.resolve(__dirname, "../src/pat/modal/modal.js"),
            "pat-navigation": path.resolve(__dirname, "../src/pat/navigation/navigation.js"),
            "pat-notification": path.resolve(__dirname, "../src/pat/notification/notification.js"),
            "pat-placeholder": path.resolve(__dirname, "../src/pat/placeholder/placeholder.js"),
            "pat-selectbox": path.resolve(__dirname, "../src/pat/selectbox/selectbox.js"),
            "pat-skeleton": path.resolve(__dirname, "../src/pat/skeleton/skeleton.js"),
            "pat-slides": path.resolve(__dirname, "../src/pat/slides/slides.js"),
            "pat-slideshow-builder": path.resolve(__dirname, "../src/pat/slideshow-builder/slideshow-builder.js"),
            "pat-sortable": path.resolve(__dirname, "../src/pat/sortable/sortable.js"),
            "pat-stacks": path.resolve(__dirname, "../src/pat/stacks/stacks.js"),
            "pat-sticky": path.resolve(__dirname, "../src/pat/sticky/sticky.js"),
            "pat-subform": path.resolve(__dirname, "../src/pat/subform/subform.js"),
            "pat-switch": path.resolve(__dirname, "../src/pat/switch/switch.js"),
            "pat-scroll": path.resolve(__dirname, "../src/pat/scroll/scroll.js"),
            "pat-tabs": path.resolve(__dirname, "../src/pat/tabs/tabs.js"),
            "pat-toggle": path.resolve(__dirname, "../src/pat/toggle/toggle.js"),
            "pat-tooltip": path.resolve(__dirname, "../src/pat/tooltip/tooltip.js"),
            "pat-tooltip-ng": path.resolve(__dirname, "../src/pat/tooltip-ng/tooltip-ng.js"),
            "pat-validation": path.resolve(__dirname, "../src/pat/validation/validation.js"),
            "pat-zoom": path.resolve(__dirname, "../src/pat/zoom/zoom.js")
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
    devServer: {
        contentBase: './'
    },
    plugins: [
        new WrapperPlugin({
            test: /\.js$/, // only wrap output of bundle files with '.js' extension
            header: headerWrap,
            footer: footerWrap
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery"
        }),
        new DuplicatePackageCheckerPlugin({
            verbose: true,
            emitError: true
        }),
        new BundleVisualizer(),
    ]
};
