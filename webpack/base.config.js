// Organised as described in https://simonsmith.io/organising-webpack-config-environments/
const path = require('path');
var webpack = require('webpack');

var fs = require('fs');
var headerWrap = '';
try { var headerWrap = fs.readFileSync('./VERSION.txt', 'utf8'); } catch (err) {}
var footerWrap = '';
try { var footerWrap = fs.readFileSync('./src/wrap-end.js', 'utf8'); } catch (err) {}


var WrapperPlugin = require('wrapper-webpack-plugin');

var JasmineWebpackPlugin = require('jasmine-webpack-plugin');

module.exports = {
    entry: {
        "bundle": "./src/patterns.js",
    },
    externals: [{
        "window": "window"
    }],
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, '..')
    },
    // Like shims in require.js
    module: {
        rules: [
            // { test: /fullcalendar/, loader: 'imports-loader?jquery,moment' },
            // {
            //     test: /pat-date-picker\.js$/,
            //     loader: 'babel-loader',
            //     query: {
            //         presets: [ 
            //             ["env", {
            //                 "targets": {
            //                 "browsers": ["last 2 versions", "ie >= 11"]
            //                 }
            //             }]
            //         ]
            //     }
            // },
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
            // { test: /pat-calendar/, loader: 'imports-loader?fullcalendar' }
        ]
    },
    resolve: {
        modules: ['src', 'node_modules'],
        alias: {
            "jquery": "jquery/dist/jquery.js",
            "autobahn": "autobahn/lib/autobahn.js",
            "push-kit": "core/push_kit.js",
            "google-code-prettify": "google-code-prettify/src/prettify.js",
            "intersection-observer": "intersection-observer/intersection-observer.js",
            "jcrop": "jquery-jcrop/js/jquery.Jcrop.min.js",
            "jquery.anythingslider": "anythingslider/js/jquery.anythingslider.min.js",
            "jquery.chosen": "chosen-js/chosen.jquery.js",
            "jquery.form": "jquery-form/dist/jquery.form.min.js",
            "jquery.placeholder": "jquery-placeholder/jquery.placeholder.js",
            "jquery.textchange": "jquery-textchange/jquery.textchange.js",
            "logging": "logging/src/logging.js",
            "masonry": "masonry-layout/dist/masonry.pkgd.min.js",
            "modernizr$": "modernizr.js",
            "patternslib.slides": "slides/src/slides.js",
            "photoswipe-ui": "photoswipe/dist/photoswipe-ui-default",
            "prefixfree": "prefixfree/prefixfree.min.js",
            "select2": "select2/select2.js",
            "showdown-prettify": "showdown-prettify/dist/showdown-prettify.min.js",
            "slick-carousel": "slick-carousel/slick/slick.js",
            "stickyfilljs": "stickyfilljs/dist/stickyfill.js",
            "text": "requirejs-text/text.js",
            "validate": "validate.js/validate.js",
            // Calendar pattern
            "moment-timezone-data": "pat/calendar/moment-timezone-with-data-2010-2020.js",
            // Core
            "pat-compat": "core/compat.js",
            "pat-base": "core/base.js",
            "pat-date-picker": "pat/date-picker/date-picker.js",
            "pat-datetime-picker": "pat/datetime-picker/datetime-picker.js",
            "pat-depends_parse": "lib/depends_parse.js",
            "pat-dependshandler": "lib/dependshandler.js",
            "pat-htmlparser": "lib/htmlparser.js",
            "pat-input-change-events": "lib/input-change-events.js",
            "pat-jquery-ext": "core/jquery-ext.js",
            "pat-logger": "core/logger.js",
            "pat-parser": "core/parser.js",
            "pat-mockup-parser": "core/mockup-parser.js",
            "pat-registry": "core/registry.js",
            "pat-remove": "core/remove.js",
            "pat-store": "core/store.js",
            "pat-url": "core/url.js",
            "pat-utils": "core/utils.js",

            // Patterns
            "pat-ajax": "pat/ajax/ajax.js",
            "pat-autofocus": "pat/autofocus/autofocus.js",
            "pat-autoscale": "pat/auto-scale/auto-scale.js",
            "pat-auto-scale": "pat/auto-scale/auto-scale.js",
            "pat-autosubmit": "pat/auto-submit/auto-submit.js",
            "pat-auto-submit": "pat/auto-submit/auto-submit.js",
            "pat-autosuggest": "pat/auto-suggest/auto-suggest.js",
            "pat-auto-suggest": "pat/auto-suggest/auto-suggest.js",
            "pat-breadcrumbs": "pat/breadcrumbs/breadcrumbs.js",
            "pat-bumper": "pat/bumper/bumper.js",
            "pat-calendar": "pat/calendar/calendar.js",
            "pat-carousel": "pat/carousel/carousel.js",
            "pat-carousel-legacy": "pat/carousel-legacy/carousel-legacy.js",
            "pat-checkedflag": "pat/checked-flag/checked-flag.js",
            "pat-checked-flag": "pat/checked-flag/checked-flag.js",
            "pat-checklist": "pat/checklist/checklist.js",
            "pat-chosen": "pat/chosen/chosen.js",
            "pat-clone": "pat/clone/clone.js",
            "pat-collapsible": "pat/collapsible/collapsible.js",
            "pat-colour-picker": "pat/colour-picker/colour-picker.js",
            "pat-depends": "pat/depends/depends.js",
            "pat-edit-tinymce": "pat/edit-tinymce/edit-tinymce.js",
            "pat-equaliser": "pat/equaliser/equaliser.js",
            "pat-expandable": "pat/expandable-tree/expandable-tree.js",
            "pat-expandable-tree": "pat/expandable-tree/expandable-tree.js",
            "pat-focus": "pat/focus/focus.js",
            "pat-form-state": "pat/form-state/form-state.js",
            "pat-forward": "pat/forward/forward.js",
            "pat-gallery": "pat/gallery/gallery.js",
            "pat-gallery-template": "pat/gallery/template.html",
            "pat-grid": "pat/grid/grid.js", // Hack, there's no grid jS, but we need for website bundler
            "pat-syntax-highlight": "pat/syntax-highlight/syntax-highlight.js",
            "pat-image-crop": "pat/image-crop/image-crop.js",
            "pat-inject": "pat/inject/inject.js",
            "pat-legend": "pat/legend/legend.js",
            "pat-markdown": "pat/markdown/markdown.js",
            "pat-masonry": "pat/masonry/masonry.js",
            "pat-menu": "pat/menu/menu.js",
            "pat-modal": "pat/modal/modal.js",
            "pat-navigation": "pat/navigation/navigation.js",
            "pat-notification": "pat/notification/notification.js",
            "pat-placeholder": "pat/placeholder/placeholder.js",
            "pat-selectbox": "pat/selectbox/selectbox.js",
            "pat-skeleton": "pat/skeleton/skeleton.js",
            "pat-slides": "pat/slides/slides.js",
            "pat-slideshow-builder": "pat/slideshow-builder/slideshow-builder.js",
            "pat-sortable": "pat/sortable/sortable.js",
            "pat-stacks": "pat/stacks/stacks.js",
            "pat-sticky": "pat/sticky/sticky.js",
            "pat-subform": "pat/subform/subform.js",
            "pat-switch": "pat/switch/switch.js",
            "pat-scroll": "pat/scroll/scroll.js",
            "pat-tabs": "pat/tabs/tabs.js",
            "pat-toggle": "pat/toggle/toggle.js",
            "pat-tooltip": "pat/tooltip/tooltip.js",
            "pat-validation": "pat/validation/validation.js",
            "pat-zoom": "pat/zoom/zoom.js",
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
            Promise: 'es6-promise-promise',
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery"
        })
    ]
};
