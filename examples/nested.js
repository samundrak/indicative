// Generated by CoffeeScript 1.10.0
(function() {
  var Validator, data, indicative, message, rules;

  Validator = require("../lib/validator");

  indicative = new Validator;

  rules = {
    binary: "required"
  };

  data = {
    binary: [0, 1]
  };

  indicative.validateAll(rules, data).then(function(success) {
    return console.log(success);
  })["catch"](function(error) {
    return console.log(error);
  });

  rules = {
    "person.profile.firstname": "required",
    "numbers.value": "array"
  };

  data = {
    person: {
      profile: {
        firstname: "somename"
      }
    },
    numbers: {
      value: [1]
    }
  };

  message = {
    "required": "This is required",
    person: {
      profile: {
        "firstname.required": "I need person firstname"
      }
    }
  };

  indicative.validateAll(rules, data, message).then(function(success) {
    return console.log(success);
  })["catch"](function(error) {
    return console.log(error);
  });

}).call(this);
