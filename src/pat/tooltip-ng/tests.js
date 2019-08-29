define(['pat-tooltip-ng', 'pat-logger'], (pattern, logger) => {
    const _OAC = '_onAjaxCallback',
          _OS = '_onShow',
          _OSN = '_onShown',
          _OT = '_onTrigger',
          _OAB = '_onAjaxBypass',
          _OACS = '_onAjaxContentSet',
          _OH = '_onHidden',
          _PD =  'preventDefault',
          ANYOPTS = jasmine.any(Object), // jshint ignore:line
          LOREM = `Lorem.`,
          LONGLOREM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`

    var log = logger.getLogger('pat-tooltip-ng.tests'),
        start,
        utils = {
            createTooltip(c) {
                var cfg = c || {}
                return $('<a/>', {
                    'id':   cfg.id || 'tooltip',
                    'href': cfg.href || '#anchor',
                    'title': cfg.title || 'tooltip title attribute',
                    'data-pat-tooltip-ng': '' || cfg.data,
                    'class': 'pat-tooltip-ng'
                }).text(cfg.content
                ).appendTo($('div#lab'))
            },

            removeTooltip() {
                var $el = $('a#tooltip')
                $el.trigger('destroy.pat-tooltip-ng')
                $el.remove()
            },

            createTooltipSource() {
                return $(`<span style='display: none' id='tooltip-source'>`+
                        '<strong>Local content</strong></span>')
                    .appendTo($('div#lab'))
            },

            dispatchEvent($target, event_name) {
                $target[0].dispatchEvent(new Event(event_name))
            },

            click($target) {
                utils.dispatchEvent($target, 'click')
            },

            mouseenter($target) {
                utils.dispatchEvent($target, 'mouseenter')
            },

            mouseleave($target) {
                utils.dispatchEvent($target, 'mouseleave')
            },

            delayed(name, timeout) {
                return (...args) => {
                    setTimeout(() => {
                        pattern[name].and.callThrough()
                        pattern[name].apply(null, args)
                        pattern[name].and.callFake(utils.delayed(name, timeout))
                    }, timeout)
                }
            },

            stopwatch(name, timer) {
                return (...args) => {
                    timer[name] = Date.now()
                    pattern[name].and.callThrough()
                    pattern[name].apply(null, args)
                    pattern[name].and.callFake(utils.stopwatch(name, timer))
                }
            },

            log(msg) {
                log.debug( String(Date.now() - start) + ' ' + msg)
            }
        };

    log.setLevel(20)

    describe('pat-tooltip-ng', () => {

        beforeEach(() => {
            $('<div/>', {id: 'lab'}).appendTo(document.body)
            start = Date.now()
        })

        afterAll(() => {
        })

        describe('A tooltip', () => {
            afterEach(() => {
                utils.removeTooltip()
                $('#lab').remove()
            })

            describe(`if the 'class' parameter exists`, () => {
                it('will assign a class to the tooltip container', (done) => {
                    var $el = utils.createTooltip({
                            data: 'source: title; trigger: hover; class: wasabi',
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.mouseenter($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        var $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        var expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.hasClass('wasabi')).toBeTruthy()
                        done()
                    }, 400)
                })

                it('and only to the corresponding container', (done) => {
                    var $el1 = utils.createTooltip({
                            data: 'source: title; trigger: click; class: wasabi',
                            title: 'tooltip1'
                        }),
                        $el2 = utils.createTooltip({
                            data: 'source: title; trigger: click',
                            title: 'tooltip2'
                        }),
                        title1 = $el1.attr('title'),
                        title2 = $el2.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el1)
                    pattern.init($el2)
                    utils.click($el2)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        var $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        var expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title2)
                        expect($container.hasClass('wasabi')).toBeFalsy()
                        utils.click($el1)
                        setTimeout(() => {
                            expect(spy_shown).toHaveBeenCalled()
                            var $container = $('.tippy-tooltip')
                            expect($container.length).toEqual(1)
                            var expected = $container.find('.tippy-content').text()
                            expect(expected).toBe(title1)
                            expect($container.hasClass('wasabi')).toBeTruthy()
                            utils.click($el2)
                            setTimeout(() => {
                                expect(spy_shown).toHaveBeenCalled()
                                var $container = $('.tippy-tooltip')
                                expect($container.length).toEqual(1)
                                var expected = $container.find('.tippy-content').text()
                                expect(expected).toBe(title2)
                                expect($container.hasClass('wasabi')).toBeFalsy()
                                done()
                            }, 400)
                        }, 400)
                    }, 400)
                })
            })

            describe(`if the 'delay' parameter exists`, () => {
                it('will wait accordingly before showing the tooltip', (done) => {
                    const $el = utils.createTooltip({
                            data: 'delay: 1000; trigger: hover',
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough(),
                        timer = {}

                    spyOn(pattern, _OT).and.callFake(
                        utils.stopwatch(_OT, timer)
                    )
                    spyOn(pattern, _OS).and.callFake(
                        utils.stopwatch(_OS, timer)
                    )
                    pattern.init($el)
                    utils.mouseenter($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        const duration = timer[_OS] - timer[_OT]
                        expect(duration/1000).toBeCloseTo(1,1)
                        done()
                    }, 1500)
                })
            })

            describe(`if the 'position-list' parameter exists`, () => {
                xit(`'rt' will place the tooltip as 'left-start'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: rt',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('left-start')
                        done()
                    }, 500)
                })
                xit(`'rb' will place the tooltip as 'left-end'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: rb',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('left-end')
                        done()
                    }, 500)
                })
                xit(`'rm' will place the tooltip as 'left'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: rm',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('left')
                        done()
                    }, 500)
                })
                it(`'lt' will place the tooltip as 'right-start'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: lt',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('right-start')
                        done()
                    }, 500)
                })
                it(`'lb' will place the tooltip as 'right-end'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: lb',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('right-end')
                        done()
                    }, 500)
                })
                it(`'lm' will place the tooltip as 'right'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: lm',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('right')
                        done()
                    }, 500)
                })
                it(`'bl' will place the tooltip as 'top-start'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: bl',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('top-start')
                        done()
                    }, 500)
                })
                it(`'br' will place the tooltip as 'top-end'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: br',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('top-end')
                        done()
                    }, 500)
                })
                it(`'bm' will place the tooltip as 'top'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: bm',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('top')
                        done()
                    }, 500)
                })
                xit(`'tl' will place the tooltip as 'bottom-start'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: tl',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('bottom-start')
                        done()
                    }, 500)
                })
                xit(`'tr' will place the tooltip as 'bottom-end'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: tr',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('bottom-end')
                        done()
                    }, 500)
                })
                xit(`'tm' will place the tooltip as 'bottom'`, (done) => {
                    const $el = utils.createTooltip({
                            data: 'position-list: tm',
                            title: LOREM,
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough()

                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($container.attr('x-placement')).toBe('bottom')
                        done()
                    }, 500)
                })
            })

            describe(`the 'mark-inactive' paramater`, () => {
                it('when true, toggles the active/inactive class on the trigger', (done) => {
                    const $el = utils.createTooltip({
                        data: 'mark-inactive: true',
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough(),
                        spy_hidden = spyOn(pattern, _OH).and.callThrough()

                    pattern.init($el)
                    expect($el.hasClass('inactive')).toBeTruthy()
                    expect($el.hasClass('active')).toBeFalsy()
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($el.hasClass('active')).toBeTruthy()
                        expect($el.hasClass('inactive')).toBeFalsy()
                        utils.click($el)
                        setTimeout(() => {
                            expect(spy_hidden).toHaveBeenCalled()
                            const $container = $('.tippy-tooltip')
                            expect($container.length).toEqual(0)
                            expect($el.hasClass('active')).toBeFalsy()
                            expect($el.hasClass('inactive')).toBeTruthy()
                            done()
                        }, 500)
                    }, 500)
                })
                it('when false, the trigger does not get the active/inactive class', (done) => {
                    const $el = utils.createTooltip({
                        data: 'mark-inactive: false',
                        }),
                        title = $el.attr('title'),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough(),
                        spy_hidden = spyOn(pattern, _OH).and.callThrough()

                    pattern.init($el)
                    expect($el.hasClass('inactive')).toBeFalsy()
                    expect($el.hasClass('active')).toBeFalsy()
                    utils.click($el)
                    setTimeout(() => {
                        expect(spy_shown).toHaveBeenCalled()
                        const $container = $('.tippy-tooltip')
                        expect($container.length).toEqual(1)
                        const expected = $container.find('.tippy-content').text()
                        expect(expected).toBe(title)
                        expect($el.hasClass('active')).toBeFalsy()
                        expect($el.hasClass('inactive')).toBeFalsy()
                        utils.click($el)
                        setTimeout(() => {
                            expect(spy_hidden).toHaveBeenCalled()
                            const $container = $('.tippy-tooltip')
                            expect($container.length).toEqual(0)
                            expect($el.hasClass('active')).toBeFalsy()
                            expect($el.hasClass('inactive')).toBeFalsy()
                            done()
                        }, 500)
                    }, 500)
                })
            })

            describe(`if the 'trigger' parameter is 'hover'`, () => {
                describe(`if the 'source' parameter is 'title'`, () => {

                    it(`will show the contents of the 'title' attribute`, (done) => {
                        utils.createTooltip({
                            data: 'source: title; trigger: hover'
                        })
                        var $el = $('a#tooltip')
                        var title = $el.attr('title')
                        var spy = spyOn(pattern, _OSN).and.callThrough()
                        pattern.init($el)
                        // The 'title' attr gets removed, otherwise the browser's
                        // tooltip will appear
                        expect($el.attr('title')).toBeFalsy()

                        utils.mouseenter($el)
                        setTimeout(() => {
                            expect(spy).toHaveBeenCalled()
                            var $container = $('.tippy-popper')
                            expect($container.length).toEqual(1)
                            expect($container.find('.tippy-content').text()).toBe(title)
                            utils.mouseleave($el)
                            done()
                        }, 400)
                    })

                    it('will hide the tooltip on mouseleave', (done) => {
                        utils.createTooltip({
                            data: 'source: title; trigger: hover'
                        })
                        var $el = $('a#tooltip')
                        var spy = spyOn(pattern, '_onHidden').and.callThrough()
                        pattern.init($el)

                        utils.mouseenter($el)
                        setTimeout(() => {
                            expect(spy).not.toHaveBeenCalled()
                            utils.mouseleave($el)
                        }, 100)

                        setTimeout(() => {
                            expect(spy).toHaveBeenCalled()
                            expect($('.tippy-popper').length).toEqual(0)
                            done()
                        }, 250)
                    })
                })

                describe(`if the 'source' parameter is 'content'`, () => {
                    describe('if the href attribute is hashtag', () => {
                        it('will show the content of the link',  (done) => {
                            var content = 'Local content',
                                $el = utils.createTooltip({
                                    data: 'source: content; trigger: hover',
                                    href: '#',
                                    content: content
                                }),
                                spy_shown = spyOn(pattern, _OSN).and.callThrough()
                            pattern.init($el)
                            utils.mouseenter($el)
                            setTimeout(() => {
                                expect(spy_shown).toHaveBeenCalled()
                                var $container = $('.tippy-popper')
                                expect($container.text()).toBe(content)
                                done()
                            }, 400)
                        })
                    })
                    describe('if the href attribute is #tooltip-source', () => {
                        it('will clone a DOM element from the page',  (done) => {
                            var $el = utils.createTooltip({
                                data: 'source: content; trigger: hover',
                                href: '#tooltip-source'
                                }),
                                spy_shown = spyOn(pattern, _OSN).and.callThrough()
                            utils.createTooltipSource()
                            pattern.init($el)
                            utils.mouseenter($el)
                            setTimeout(() => {
                                expect(spy_shown).toHaveBeenCalled()
                                var $container = $('.tippy-popper')
                                expect($container.find('strong').text()).toBe('Local content')
                                done()
                            }, 400)
                        })
                    })
                })
            })
            describe(`if the 'target' parameter is 'body'`, () => {
                it('will append the .tippy-popper to the document.body', (done) => {
                    var $el = utils.createTooltip({
                        data: 'target: body',
                        href: '#',
                    })
                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect($('.tippy-popper', 'body').length).toEqual(1)
                        done()
                    }, 200)
                })
            })
            describe(`if the 'target' parameter is 'parent'`, () => {
                it(`will append the .tippy-popper to the reference element's parent node`, (done) => {
                    var $el = utils.createTooltip({
                        data: 'target: parent',
                        href: '#',
                    })
                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect($('.tippy-popper', '#lab').length).toEqual(1)
                        done()
                    }, 200)
                })
            })
            describe(`if the 'target' parameter is a selector`, () => {
                it('will append the .tippy-popper to the selected element', (done) => {
                    var $el = utils.createTooltip({
                        data: 'target: #child3',
                        href: '#',
                        })
                    $('<div/>', {id: 'child3'})
                        .appendTo($('<div/>', {id: 'child2'}))
                        .appendTo($('<div/>', {id: 'child1'}))
                        .appendTo(document.body)
                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        expect($('.tippy-popper', '#child3').length).toEqual(1)
                        done()
                    }, 200)
                })
            })

            describe(`if the "source" parameter is "auto"`, () => {
                describe(`if the "href" points to a document fragment`, () => {
                    it(`will revert to "content"`, (done) => {
                        var $el = utils.createTooltip({
                                data: 'source: auto',
                                href: '#tooltip-source'
                            }),
                            spy = spyOn(pattern, '_setSource').and.callThrough()

                        utils.createTooltipSource()
                        pattern.init($el)
                        setTimeout(() => {
                            expect(spy).toHaveBeenCalledWith(ANYOPTS, 'content')
                            done()
                        }, 0)
                    })
                })

                describe(`if the "href" points to an external URL`, () => {
                    it(`will revert to "ajax"`, (done) => {
                        var $el = utils.createTooltip({
                                data: 'source: auto',
                                href: '/tests/content.html#content'
                            }),
                            spy = spyOn(pattern, '_setSource').and.callThrough()
                        utils.createTooltipSource()

                        pattern.init($el)
                        setTimeout(() => {
                            expect(spy).toHaveBeenCalledWith(ANYOPTS, 'ajax')
                            done()
                        }, 0)
                    })
                })
            })
        })

        describe(`if the 'source' parameter is 'ajax'`, () => {
            afterEach((done) => {
                utils.log('afterEach begins!')
                setTimeout(() => {
                    utils.log('afterEach timeout is over!')
                    utils.removeTooltip()
                    $('#lab').remove()
                done()
                }, 600)
            })

            it('the default click action is prevented', done => {
                var $el = utils.createTooltip({
                        data: 'source: ajax',
                        href: 'tests/content.html#content'
                    }),
                    click = new Event('click'),
                    spy_prevented = spyOn(click, _PD).and.callThrough(),
                    spy_shown = spyOn(pattern, _OAC).and.callThrough()

                pattern.init($el)
                $el[0].dispatchEvent(click)
                $el[0].dispatchEvent(click)
                $el[0].dispatchEvent(click)
                setTimeout(() => {
                    expect(spy_shown).toHaveBeenCalledBefore(spy_prevented)
                    done()
                }, 500)
            })

            it('will fetch its contents via ajax', (done) => {
                var $el = utils.createTooltip({
                        data: 'source: ajax',
                        href: 'tests/content.html#content'
                    }),
                    spy_ajax = spyOn(pattern, _OAC).and.callThrough(),
                    spy_shown = spyOn(pattern, _OSN).and.callThrough()

                pattern.init($el)
                utils.click($el)
                setTimeout(() => {
                    expect(spy_ajax).toHaveBeenCalled()
                    expect(spy_shown).toHaveBeenCalled()
                    var $container = $('.tippy-popper .tippy-content')
                    expect($container.text()).toBe(
                        'External content fetched via an HTTP request.')
                    done()
                }, 500)
            })

            it('will handle markdown content', (done) => {
                var $el = utils.createTooltip({
                        data: 'source: ajax; ajax-data-type: markdown',
                        href: 'tests/content.md#Display'
                    }),
                    spy_ajax = spyOn(pattern, _OAC).and.callThrough()
                    // Not sure why _OSN is not called in this test
                    // spy_shown = spyOn(pattern, _OSN).and.callThrough()

                pattern.init($el)
                utils.click($el)
                setTimeout(() => {
                    expect(spy_ajax).toHaveBeenCalled()
                    // expect(spy_shown).toHaveBeenCalled()
                    var $container = $('.tippy-popper .tippy-content')
                    expect($container.text()).toContain(
                        'Tooltips are shown')
                    expect($container.text()).not.toContain(
                        'contextual')
                    done()
                }, 500)
            })

            describe('will not fetch again until tooltip is hidden', () => {
                it('with click', done => {
                    var $el = utils.createTooltip({
                            data: 'source: ajax; trigger: click',
                            href: 'tests/content.html#content'
                        }),
                        spy_ajax = spyOn(pattern, _OAC).and.callThrough(),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough(),
                        spy_byps = spyOn(pattern, _OAB).and.callThrough()

                    utils.log('pattern init')
                    pattern.init($el)
                    utils.click($el)
                    setTimeout(() => {
                        utils.log('click again')
                        utils.click($el)
                        setTimeout(() => {
                            utils.log('third click')
                            utils.click($el)
                        }, 20)
                    }, 10)
                    setTimeout(() => {
                        expect(spy_ajax).toHaveBeenCalledBefore(spy_byps)
                        expect(spy_shown).toHaveBeenCalled()
                        var $container = $('.tippy-popper .tippy-content')
                        expect($container.text()).toBe(
                            'External content fetched via an HTTP request.')
                        done()
                    }, 600)
                })

                it('with hover', done => {
                    var $el = utils.createTooltip({
                            data: 'source: ajax; trigger: hover',
                            href: 'tests/content.html#content'
                        }),
                        spy_ajax = spyOn(pattern, _OAC).and.callThrough(),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough(),
                        spy_byps = spyOn(pattern, _OAB).and.callThrough()

                    utils.log('pattern init')
                    pattern.init($el)
                    utils.mouseenter($el)
                    setTimeout(() => {
                        utils.log('leaving')
                        utils.mouseleave($el)
                        setTimeout(() => {
                            utils.log('entering')
                            utils.mouseenter($el)
                        }, 20)
                    }, 10)
                    setTimeout(() => {
                        expect(spy_ajax).toHaveBeenCalledBefore(spy_byps)
                        expect(spy_shown).toHaveBeenCalled()
                        var $container = $('.tippy-popper .tippy-content')
                        expect($container.text()).toBe(
                            'External content fetched via an HTTP request.')
                        done()
                    }, 600)
                })
            })

            describe('will not fetch again until ajax is answered', () => {
                it('with click', done => {


                    var $el = utils.createTooltip({
                            data: 'source: ajax; trigger: click',
                            href: 'tests/content.html#content'
                        }),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough(),
                        spy_byps = spyOn(pattern, _OAB).and.callThrough(),
                        spy_cset = spyOn(pattern, _OACS).and.callThrough()

                    spyOn(pattern, _OAC).and.callFake(
                        utils.delayed(_OAC, 500)
                    )
                    utils.log('pattern init')
                    pattern.init($el)
                    utils.click($el)
                    expect(spy_cset).not.toHaveBeenCalled()
                    setTimeout(() => {
                        utils.log('click again')
                        utils.click($el)
                        setTimeout(() => {
                            utils.log('third click')
                            utils.click($el)
                        }, 20)
                    }, 10)
                    // second click
                    setTimeout(() => {
                        expect(spy_byps).toHaveBeenCalledBefore(spy_cset)
                        expect(spy_shown).toHaveBeenCalled()
                        var $container = $('.tippy-popper .tippy-content')
                        expect($container.text()).toBe(
                            'External content fetched via an HTTP request.')
                        done()
                    }, 600)
                })

                it('with hover', done => {
                    var $el = utils.createTooltip({
                            data: 'source: ajax; trigger: hover',
                            href: 'tests/content.html#content'
                        }),
                        spy_shown = spyOn(pattern, _OSN).and.callThrough(),
                        spy_byps = spyOn(pattern, _OAB).and.callThrough(),
                        spy_cset = spyOn(pattern, _OACS).and.callThrough()

                    spyOn(pattern, _OAC).and.callFake(
                        utils.delayed(_OAC, 500)
                    )
                    utils.log('pattern init')
                    pattern.init($el)
                    utils.mouseenter($el)
                    expect(spy_cset).not.toHaveBeenCalled()
                    setTimeout(() => {
                        utils.log('leaving')
                        utils.mouseleave($el)
                        setTimeout(() => {
                            utils.log('entering')
                            utils.mouseenter($el)
                        }, 20)
                    }, 10)
                    setTimeout(() => {
                        expect(spy_byps).toHaveBeenCalledBefore(spy_cset)
                        expect(spy_shown).toHaveBeenCalled()
                        var $container = $('.tippy-popper .tippy-content')
                        expect($container.text()).toBe(
                            'External content fetched via an HTTP request.')
                        done()
                    }, 600)
                })
            })
        })

    })
})
// jshint indent: 4, browser: true, jquery: true, quotmark: single
/*global describe, it, beforeEach, afterEach, spyOn, afterAll, expect */
