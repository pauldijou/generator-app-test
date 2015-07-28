'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();

    var prompts = [{
      type: 'input',
      name: 'funny',
      message: '[sub] Just enter something funny...'
    }];

    this.prompt(prompts, function (props) {
      this.options.composed = props;
      done();
    }.bind(this));
  }
});
