define([
    'require',
    '../lib/jquery'
], function(require) {
    // XXX: this is basically collapsible - think about a meta pattern
    // for that

    var init = function($el, opts) {
        // hide($el, 0);
        // if ((opts && opts.shown) || $el.hasClass('shown')) {
        //     $el.removeClass('shown');
        //     show($el, "fast");
        // } else {
        //     $el.addClass("hidden");
        // }
        $el.show();
        // var $trigger_el = opts && opts.$trigger_el;
        // if ($trigger_el) {
        //     $trigger_el.on("click", function() {
        //         $el.hide();
        //     });
        // }
        $(document).on('keyup.hide.modal', function(ev) {
            ev.which == 27 && remove($el);
        });
        $el.find('.close-panel').on('click', function(ev) {
            ev.preventDefault();
            remove($el);
        });
    };

    var remove = function($el) {
        $el.remove();
    };




    // var show = function($el, duration) {
    //     if ($el.hasClass("shown")) return;
    //     toggle($el, duration);
    //     $(document).on('keyup.hide.modal', function(ev) {
    //         ev.which == 27 && $el.hide();
    //     });
    // };

    // var hide = function($el, duration) {
    //     if ($el.hasClass("hidden")) return;
    //     toggle($el, duration);
    //     $(document).off('keyup.hide.modal');
    // };

    // var transit = function($el, from_cls, to_cls, duration) {
    //     $el.removeClass(from_cls);
    //     if (duration) $el.addClass("in-progress");
    //     $el.slideToggle(duration, function() {
    //         if (duration) $el.removeClass("in-progress");
    //         $el.addClass(to_cls);
    //     });
    // };

    // var toggle = function($el, duration) {
    //     if ($el.hasClass("shown")) {
    //         transit($el, "shown", "hidden", duration);
    //     } else {
    //         transit($el, "hidden", "shown", duration);
    //     }
    // };

    var pattern = {
        markup_trigger: "div.modal",
        initialised_class: "modal",
        supported_tags: ['div'], // XXX: unsupported
        default_opts: {
            shown: false
        },
        init: init
        // show: show,
        // hide: hide,
        // toggle: toggle
    };

    return pattern;
});
