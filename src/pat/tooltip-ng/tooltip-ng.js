(function (root, factory) {
    // We use AMD (Asynchronous Module Definition) or browser globals to create
    // this module.
    if (typeof define === 'function' && define.amd) {
        define([
            'jquery',
            'pat-base',
            'pat-registry',
            'pat-utils',
            'pat-parser',
            'pat-markdown',
            'pat-logger',
            'tippy.js'
        ], function() {
            return factory.apply(this, arguments)
        })
    } else {
        // If require.js is not available, you'll need to make sure that these
        // global variables are available.
//        factory($, patterns.Base, patterns, patterns.Parser, patterns.logger, tippy, tippytheme)
        factory($, patterns.Base, patterns, patterns.utils, patterns.Parser, patterns.markdown, patterns.logger, tippy)
    }
//}(this, function($, Base, registry, Parser, logger, tippy, tippytheme) {
}(this, function($, Base, registry, utils, Parser, Markdown, logger, tippy) {
    'use strict'

    let start = 0
    const log = logger.getLogger('pat-tooltip-ng'),
          timelog = msg => { log.debug(`${Date.now() - start} ${msg}`) }

    log.setLevel(20)
    timelog('Initializing pat-tooltip-ng')

    /* For logging, you can call log.debug, log.info, log.warn, log.error and log.fatal.
     *
     * For more information on how to use the logger and how to view log messages, please read:
     * https://github.com/Patternslib/logging
     */

    let parser = new Parser('tooltip-ng')
    /* If you'd like your pattern to be configurable via the
     * data-pat-tooltip-ng attribute, then you need to
     * specify the available arguments here, by calling parser.addArgument.
     *
     * The addArgument method takes the following parameters:
     *  - name: The required name of the pattern property which you want to make
     *      configurable.
     *  - default_value: An optional default string value of the property if the user
     *      doesn't provide one.
     *  - choices: An optional set (Array) of values that the property might take.
     *      If specified, values outside of this set will not be accepted.
     *  - multiple: An optional boolean value which specifies wether the
     *      property can be multivalued or not.
     *
     *  For example:
     *      parser.addArgument('color', 'blue', ['red', 'green', 'blue'], false)
     */
    const all_positions = ['tl', 'tm', 'tr',
                           'rt', 'rm', 'rb',
                           'br', 'bm', 'bl',
                           'lb', 'lm', 'lt']
    parser.addArgument('position-list', [], all_positions, true)
    parser.addArgument('position-policy', 'auto', ['auto', 'force'])
    parser.addArgument('trigger', 'click', ['click', 'hover'])
    parser.addArgument('source', 'title', ['auto', 'ajax', 'content', 'content-html', 'title'])
    parser.addArgument('ajax-data-type', 'html', ['html', 'markdown'])
    parser.addArgument('delay')
    parser.addArgument('distance')
    parser.addArgument('mark-inactive', true)
    parser.addArgument('class')
    parser.addArgument('target', 'body')


    //return Base.extend({
    let tooltip = {
        /* The name is used to store the pattern in a registry and needs to be
         * unique.
         */
        name: 'tooltip-ng',
        /* The trigger specifies the selector (CSS or jQuery) which Patternslib
         * will scan for in order to identifiy and initialize this pattern.
         */
        trigger: '.pat-tooltip-ng',

        jquery_plugin: true,

        tippy: tippy.default,

        init($el, opts, debuglevel=20) {
            log.setLevel(debuglevel)

            return $el.each(function() {
                this.defaultProps = {
                    'allowHTML': true,
                    'animation': false,
                    'arrow': true,
                    //'delay': [0, 1800],
                    //'duration': [325, 275],
                    'distance': 20,
                    'flipOnUpdate': true,
                    'hideOnClick': true,
                    'ignoreAttributes': true,
                    'interactive': true,
                    'onHidden': tooltip._onHidden,
                    'onHide': tooltip._onHide,
                    'onMount': tooltip._onMount,
                    'onShow': tooltip._onShow,
                    'onShown': tooltip._onShown,
                    'onTrigger': tooltip._onTrigger,
                    'trigger': 'click',
                    'boundary': "window"

                }

                start = Date.now()
                const tippy = tooltip.tippy,
                      $trigger = $(this)

                tippy.setDefaultProps(this.defaultProps)
                this.options = parser.parse($trigger, opts)

                /* this.options will now contain the configured pattern properties
                 * you've registered with the parser.addArgument method.
                 *
                 * If the user provided any values via the data-pat-tooltip-ng
                 * attribute, those values will already be set.
                 */

                $trigger.data('patterns.tooltip-ng', tooltip._mutateOptions(this.options))
                        .on('destroy.pat-tooltip-ng', tooltip._onDestroy)

                this.options = tooltip.parseOptionsForTippy(this.options, $trigger)
                tippy($trigger[0], this.options)
                tooltip.setupShowEvents($trigger)
            })
        },
        _returnBody: function _returnBody(args) {
            return document.body;
        },
        parseOptionsForTippy(opts, $trigger) {
            const notImplemented = (name) => { log.error(`${name} not implemented`) },

                placement = (pos) => {
                    // note that Cornelis needs the positioning to be the placement of the thingy on the bubble
                    // tippy though refers to positioning as the placement of the bubble relatively to the reference element
                    // so we invert the meaning below. It's intentional.
                    const primary = (pos) => ({
                            t: 'bottom',
                            r: 'left',
                            b: 'top',
                            l: 'right',
                        }[pos])

                    const secondary = (pos) => ({
                            l: '-start',
                            r: '-end',
                            m: '',
                            t: '-start',
                            b: '-end',
                        }[pos])

                    return `${primary(pos[0])}${secondary(pos[1])}`
                },

                flipBehavior = (pos) => placement(`${pos[0]}m`),

                parsers = {
                    position() {
                        if (opts.hasOwnProperty('position')) {
                            const prefs = opts.position.list
                            if (prefs.length > 0) {
                                const pos = prefs[0]
                                opts.placement = placement(pos)

                                if (prefs.length > 1) {
                                    opts.flipBehavior = prefs.map(flipBehavior)
                                    opts.flip = true
                                    opts.flipOnUpdate = true
                                }
                            }
                            if (opts.position.policy === 'force') {
                                opts.flip = false
                                opts.flipOnUpdate = false
                            }
                            delete opts.position
                        }
                    },

                    height: notImplemented,

                    trigger() {
                        if (opts.trigger === 'hover') {
                            opts.trigger = 'mouseenter focus'
                        }
                    },

                    closing: notImplemented,

                    source() {
                        if (opts.hasOwnProperty('source')) {
                            if (opts.source==='title') {
                                opts.content = $trigger.attr('title')
                            }
                            if (opts.source === 'auto') {
                                const href = $trigger.attr('href')
                                if (typeof(href) !== 'string') {
                                    log.error(`href must be specified if 'source' is set to 'auto'`)
                                    return
                                }
                                if (href.indexOf('#') === 0) {
                                    tooltip._setSource(opts, 'content')
                                } else {
                                    tooltip._setSource(opts, 'ajax')
                                }
                            }
                            if (opts.source==='content') {
                                const href = $trigger.attr('href'),
                                      is_string = typeof(href) === 'string',
                                      has_hash = href.indexOf('#') !== -1,
                                      has_more = href.length > 1
                                let $content

                                if (is_string && has_hash && has_more) {
                                    $content = $('#'+href.split('#')[1]).children().clone()
                                } else {
                                    $content = $trigger.children().clone()
                                    if (!$content.length) {
                                        $content = $('<p/>').text($trigger.text())
                                    }
                                }
                                opts.content = $content[0]
                                registry.scan($content[0])
                            }
                            if (opts.source==='ajax') {
                                const $p = $('<progress/>')[0]

                                opts.content = $p
                                opts.onShow = tooltip._onAjax($trigger)
                                opts.onHidden = instance => {
                                    timelog('ONAJAXHIDDEN')
                                    instance.setContent($p)
                                    instance.state.ajax.canFetch = true
                                }
                            }
                            delete opts.source
                        }
                    },

                    ajaxDataType() {
                        delete opts.ajaxDataType
                    },

                    delay() {
                        if (opts.hasOwnProperty('delay')) {
                            opts.delay = [utils.parseTime(opts.delay), 0]
                        }
                    },

                    distance() {
                        if (opts.hasOwnProperty('distance')) {
                            opts.distance = [parseInt(opts.distance), 20];
                        }
                    },

                    markInactive() {
                        if (opts.markInactive) {
                            $trigger.addClass('inactive')
                        }
                        delete opts.markInactive
                    },

                    'class': () => {
                        if (opts.hasOwnProperty('class')) {
                            const klass = opts.class,
                                  handler = tooltip._addClassHandler(klass)

                            $trigger.on('pat-tippy-mount', handler)
                            delete opts.class
                        }
                    },

                    target() {
                        if (opts.hasOwnProperty('target')) {
                            if (opts.target === 'parent') {
                                opts.appendTo = 'parent'
                            } else if (opts.target !== 'body') {
                                opts.appendTo = $(opts.target)[0]
                            } else {
                                opts.appendTo = tooltip._returnBody;
                            }

                            delete opts.target;
                        }
                    }
                }

            for (let arg in opts) {
                switch (arg) {
                    case 'ajax-data-type':
                        arg = 'ajaxDataType'
                        break
                    case 'mark-inactive':
                        arg = 'markInactive'
                        break
                }
                log.debug(arg)
                parsers[arg](arg)
            }

            if ($trigger.attr('title')) {
                $trigger.removeAttr('title')
            }
            return opts
        },

        setupShowEvents($trigger) {
            $trigger.on('click.pat-tooltip-ng', tooltip.blockDefault)
        },

        removeShowEvents($trigger) {// jshint ignore:line
        },

        setupHideEvents($trigger) {
            $trigger.on('click.pat-tooltip-ng', tooltip.blockdefault)
        },

        removeHideEvents($trigger) {// jshint ignore:line
        },

        blockDefault(event) {
            if (event.preventDefault) {
                event.preventDefault()
            }
        },

        _mutateOptions(opts) {
            // shallow copy
            return Object.assign({}, opts)
        },

        _addClassHandler(klass) {
            return (event, tooltip) => { $(tooltip).addClass(klass) }
        },

        _setSource(opts, source) {
            opts.source = source
        },

        _onDestroy(event) {
            timelog('ONDESTROY')
            const $trigger = event.target
            $trigger._tippy.destroy()
        },

        _onClick(instance, event) {
            timelog('ONCLICK')
            if (event.type === 'click') {
                timelog(`it's click`)
                event.stopPropagation()
                event.preventDefault()
            }
        },

        _onTrigger(instance, event) {// jshint ignore:line
            timelog('ONTRIGGER')
        },

        _onMount(instance) {
            timelog('ONMOUNT')
            $(instance.reference).trigger('pat-tippy-mount', instance.popperChildren.tooltip)
        },

        _onShow(instance) {// jshint ignore:line
            timelog('ONSHOW')
        },

        _onShown(instance) {
            timelog('ONSHOWN')
            const $trigger = $(instance.reference)
            const options = $trigger.data('patterns.tooltip-ng')
            tooltip.removeShowEvents($trigger)
            tooltip.setupHideEvents($trigger)
            if (options.markInactive) {
                $trigger.removeClass('inactive').addClass('active')
            }
        },

        _onHide(instance) {
            timelog('ONHIDE')
            const $trigger = $(instance.reference)
            tooltip.removeHideEvents($trigger)
            tooltip.setupShowEvents($trigger)
        },

        _onHidden(instance) { // jshint ignore:line
            timelog('ONHIDDEN')
            const $trigger = $(instance.reference)
            const options = $trigger.data('patterns.tooltip-ng')
            if (options.markInactive) {
                $trigger.removeClass('active').addClass('inactive')
            }
        },

        _onAjax($trigger) {
            timelog('OnAJAX')
            const source = $trigger.attr('href').split('#')
            return instance => {
                timelog('in ajax content function')
                timelog(`instance.state.ajax ${JSON.stringify(instance.state.ajax)}`)
                if (instance.state.ajax === undefined) {
                    instance.state.ajax = {
                        isFetching : false,
                        canFetch : true
                    }
                }

                if (instance.state.ajax.isFetching || !instance.state.ajax.canFetch) {
                    return tooltip._onAjaxBypass()
                }

                instance.state.ajax = {
                    isFetching: true,
                    canFetch: false
                }
                tooltip._onAjaxCallback(instance, source)
            }
        },

        _onAjaxCallback(instance, src) {
            timelog('AJAXCALLBACK')
            const $trigger = $(instance.reference),
                  options = $trigger.data('patterns.tooltip-ng'),
                  handler = tooltip._ajaxDataTypeHandlers[options.ajaxDataType]
            fetch(src[0]).then(response => {
                return response.text().then(text => {
                    instance.setContent(handler(text, src))
                }).finally(() => {
                    tooltip._onAjaxContentSet(instance)
                    registry.scan(instance.popper)
                })
            })
        },

        _onAjaxBypass() {
            timelog('AJAX BYPASSED')
            return undefined
        },

        _onAjaxContentSet(instance) {
            timelog('AJAXCONTENTSET')
            instance.state.ajax.isFetching = false
        },

        _ajaxDataTypeHandlers: {
            html(text, src) {
                const $tmp = $('<div/>').append($.parseHTML(text))
                return $tmp.find("#".concat(src[1])).prop('innerHTML');
            },

            markdown(text, src) {
                const [url, source] = src,
                       cfg = { url, source: `#${source}` },
                       pat = Markdown.init($('<div/>'))
                return pat.renderForInjection(cfg, text)[0]
            }
        }
    }

    registry.register(tooltip)
    return tooltip
}))
/*global $, patterns, tippy */
