// Generated by CoffeeScript 1.10.0
(function() {
  "use strict";

  /**
   * @author Harminder Virk
   * @since v0.6
   * @description Expressions to deep object parser, validator
   * and message constructor
   */
  var ASYNC, DOT, IS, MESSAGES, PARSER, PROMISE, RULES, UTILS, Validator, _,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('lodash');

  IS = require('is_js');

  PARSER = require('./parser');

  RULES = require('./rules');

  MESSAGES = new (require('./messages'));

  PROMISE = require('bluebird');

  ASYNC = require('async');

  UTILS = require("./utils");

  DOT = require("dot-object");


  /**
   * @class Validator
   * @extends {Class} RULES
   */

  Validator = (function(superClass) {
    extend(Validator, superClass);

    Validator.prototype['is'] = IS;

    function Validator() {
      Validator.__super__.constructor.call(this);
    }

    Validator.prototype.initiate = function(messages) {
      MESSAGES.destructor();
      return MESSAGES.setMessages(messages);
    };


    /**
     * validating single field with array of rules
     * @param  {[object]}   access to class this property
     * @param  {[object]}   data object
     * @param  {[array]}    rules array for single field
     * @param  {[string]}   field name
     * @return {[promise]}
     */

    Validator.prototype.validateField = function(data, rules, field) {
      var self;
      self = this;
      return new PROMISE(function(resolve, reject) {
        return PROMISE.reduce(_.keys(rules), function(t, f) {
          var args, message, ref, rule;
          ref = PARSER.prototype.parseRule(rules[f], field, data[field]), rule = ref.rule, args = ref.args, message = ref.message;
          return self.validations[rule].call(self, data, field, message, args)["catch"](function(message) {
            return reject({
              field: field,
              message: message,
              rule: rule
            });
          });
        }, 0).then(resolve).reject;
      });
    };


    /**
     * Public method to invoke validations
     * @param  {[object]}   object to rules
     * @param  {[data]}     object of data to apply rules on
     * @param  {[message]}  object of custom messages
     * @return {[promise]}
     */

    Validator.prototype.validateAll = function(rulesHash, data, messages) {
      var errors, normalizedData, parsedRules, ruleCopy, self, validateAsync;
      self = this;
      this.initiate(messages);
      errors = [];
      parsedRules = PARSER.prototype.parseRules(rulesHash);
      ruleCopy = rulesHash;
      DOT.object(ruleCopy);
      normalizedData = UTILS.convert_object_to_dot_notation(ruleCopy, data);
      validateAsync = function(index, cb) {
        return self.validateField(normalizedData, parsedRules[index], index).then(function(success) {
          return cb(null, success);
        })["catch"](function(err) {
          errors.push(err);
          return cb(err, null);
        });
      };
      return new PROMISE(function(resolve, reject) {
        return ASYNC.filter(_.keys(parsedRules), validateAsync, function(err) {
          if (_.size(err)) {
            return reject(errors);
          } else {
            return resolve(data);
          }
        });
      });
    };


    /**
     * Public method to invoke validations and break on first error
     * @param  {[object]}   object to rules
     * @param  {[data]}     object of data to apply rules on
     * @param  {[message]}  object of custom messages
     * @return {[promise]}
     */

    Validator.prototype.validate = function(rulesHash, data, messages) {
      var normalizedData, parsedRules, ruleCopy, self;
      self = this;
      this.initiate(messages);
      parsedRules = PARSER.prototype.parseRules(rulesHash);
      ruleCopy = rulesHash;
      DOT.object(ruleCopy);
      normalizedData = UTILS.convert_object_to_dot_notation(ruleCopy, data);
      return new PROMISE(function(resolve, reject) {
        return PROMISE.reduce(_.keys(parsedRules), function(t, field) {
          return self.validateField(normalizedData, parsedRules[field], field);
        }, 0).then(function() {
          return resolve(data);
        })["catch"](function(err) {
          return reject([err]);
        });
      });
    };


    /**
     * Interface to extend validator class
     * @param  {[string]} Name of the validator
     * @param  {[function]} Function body
     * @param  {[message]} Error message to return on erro
     * @return {[void]}
     */

    Validator.prototype.extend = function(name, message, func_body) {
      this.validations[name] = func_body;
      return MESSAGES.setMessage(name, message);
    };

    return Validator;

  })(RULES);

  module.exports = Validator;

}).call(this);