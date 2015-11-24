// Generated by CoffeeScript 1.10.0
(function() {
    "use strict";

    /**
     * @author Harminder Virk
     * @since v1.0.5
     * @description Class to store error messages, build them as per priority
     */
    var Messages, UTILS, _;

    _ = require('lodash');

    UTILS = require("./utils");

    _.templateSettings = {
        interpolate: /{{([\s\S]+?)}}/g
    };

    Messages = (function() {
        var instance;

        instance = null;

        function Messages() {
            if (!instance) {
                instance = this;
            }
            this.CVM = {};
            return instance;
        }

        Messages.prototype.destructor = function() {
            return this.CVM = {};
        };


        /**
         * Return best possible error message
         * @param  {[string]} Validation name
         * @param  {[string]} Field name
         * @return {[string]} Constructed message
         */

        Messages.prototype.buildMessage = function(rule, field, args, value) {
            var argument, expression, fieldNotation, matches, md, template, templateData;
            argument = args != null ? args.split(",") : void 0;
            templateData = {
                field: field,
                argument: argument,
                rule: rule,
                value: value
            };
            fieldNotation = field + "." + rule;
            if (this.CVM[fieldNotation] != null) {
                md = this.CVM[fieldNotation];
            } else if (this.CVM[rule] != null) {
                md = this.CVM[rule];
            } else {
                md = "{{field}} must be {{rule}} ";
            }
            expression = new RegExp("(?:\\.)(\\w)(?:}})", "g");
            matches = md.match(expression);
            md = md.replace(expression, "[$1]}}");
            template = _.template(md);

            String.prototype.replaceAll = function(search, replace) {
                //if replace is not sent, return original string otherwise it will
                //replace search string with 'undefined'.
                if (replace === undefined) {
                    return this.toString();
                }

                return this.replace(new RegExp('[' + search + ']', 'g'), replace);
            };

            return template(templateData).replaceAll("_", " ");
        };


        /**
         * Setting a single message to CVM object
         * @param { String} name message unique name
         * @param {String} message message to print
         */

        Messages.prototype.setMessage = function(name, message) {
            return this.CVM[name] = message;
        };


        /**
         * Setting hash of messages
         * @param {Object} Object to store after converting .[dot] value to nested objects
         */

        Messages.prototype.setMessages = function(hash) {
            hash || (hash = {});
            if (_.size(hash)) {
                hash = UTILS.convert_object_to_dot_notation({}, hash);
            }
            return this.CVM = hash;
        };

        return Messages;

    })();

    module.exports = Messages;

}).call(this);