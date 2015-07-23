/**
 * Patterns validate - Form vlidation
 *
 * Copyright 2013 Simplon B.V. - Wichert Akkerman
 * Copyright 2014-2015 Syslab.com GmBH  - JC Brand
 */
define([
    "jquery",
    "pat-parser",
    "pat-base",
    "pat-utils",
    "moment",
    "validate"
], function($, Parser, Base, utils, moment, validate) {
    var parser = new Parser("validate");
    parser.addArgument("disable-selector"); // Elements which must be disabled if there are errors

    return Base.extend({
        name: "validate",
        trigger: "form.pat-validate",

        init: function($el, opts) {
            this.options = parser.parse(this.$el, opts);
            this.constraints = {};
            this.$inputs = this.$el.find(':input[name]');
            this.$inputs.each(this.addConstraint.bind(this));
            this.$inputs.on('change.pat-validate', this.validateElement.bind(this));
            this.$el.on('submit.pat-validate', this.validateForm.bind(this));
            this.$el.on('pat-update.pat-validate', this.onPatternUpdate.bind(this));
        },

        addConstraint: function (idx, input) {
            /* Add extra validation constraints by parsing the input element
             * for hints.
             */
            var name = input.getAttribute('name');
            if (!name) { return; }
            this.constraints[name] = {
                'presence': input.getAttribute('required') ? true : false,
                'email': input.getAttribute('type') == 'email' ? true : false,
                'numericality': input.getAttribute('type') == 'number' ? true : false,
                'datetime': input.getAttribute('type') == 'datetime' ? true : false,
                'date': input.getAttribute('type') == 'date' ? true : false
            };
        },

        validateForm: function (ev) {
            /* Handler which gets called when the entire form needs to be
             * validated. Will prevent the event's default action if validation fails.
             */
            var errors = _.compose(_.partial(validate, _, this.constraints), validate.collectFormValues)(ev.target);
            if (errors) {
                ev.preventDefault();
                ev.stopPropagation();
                _.each(Object.keys(errors), _.partial(this.showError.bind(this), errors)); 
            }
        },

        validateElement: function (ev) {
            /* Handler which gets called when a single form :input element
             * needs to be validated. Will prevent the event's default action
             * if validation fails.
             */
            var value_dict = {};
            var name = ev.target.getAttribute('name');
            value_dict[name] = ev.target.value;
            var errors = _.partial(validate, _, _.pick(this.constraints, name))(value_dict);
            if (!errors) {
                this.findErrorMessages($(ev.target)).remove();
            } else {
                ev.preventDefault();
                ev.stopPropagation();
                _.each(Object.keys(errors), _.partial(this.showError.bind(this), errors)); 
            }
        },

        onPatternUpdate: function (ev, data) {
            /* Handler which gets called when pat-update is triggered within
             * the .pat-validate element.
             *
             * Currently we handle the case where new content appears in the
             * form. In that case we need to remove and then reassign event
             * handlers.
             */
            if (data.pattern == "clone" || data.pattern == "inject") {
                this.$inputs.off('change.pat-validate');
                this.$el.off('submit.pat-validate');
                this.$el.off('pat-update.pat-validate');
                this.init();
            }
            return true;
        },

        findErrorMessages: function($el) {
            var selector = "em.validation.message",
                $messages = $el.siblings(selector);
            if ($el.is("[type=radio],[type=checkbox]")) {
                var $fieldset = $el.closest("fieldset.checklist");
                if ($fieldset.length)
                    $messages=$fieldset.find(selector);
            }
            return $messages;
        },

        showError: function(errors, name) {
            var $el = this.$el.find('[name="'+name+'"]'),
                $position = $el, strategy="after", $message;
            if ($el.is("[type=radio],[type=checkbox]")) {
                var $fieldset = $el.closest("fieldset.checklist");
                if ($fieldset.length) {
                    $position=$fieldset;
                    strategy="append";
                }
            }
            this.findErrorMessages($el).remove();
            $message = $("<em/>", {"class": "validation warning message"});
            $message.text(errors[name]);
            switch (strategy) {
                case "append":
                    $message.appendTo($position);
                    break;
                case "after":
                    $message.insertAfter($position);
                    break;
            }
            $(this.options.disableSelector).prop('disabled', true).addClass('disabled');
            $position.trigger("pat-update", {pattern: "validate"});
        }
    });
});
