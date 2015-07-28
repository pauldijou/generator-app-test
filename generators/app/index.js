'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');

var context = {};
var checkboxChoices = ['Coffee', 'Tea', 'Water', 'Beer', 'Mojito'];

module.exports = yeoman.generators.Base.extend({
  prompting: {
    basic: function () {
      var done = this.async();

      var prompts = [{
        type: 'confirm',
        name: 'confirm1',
        message: 'Do you agree?',
        default: true
      },{
        type: 'confirm',
        name: 'confirm2',
        message: 'Do you disagree?'
      }, {
        type: 'input',
        name: 'input1',
        message: 'Want to say something?',
        default: 'Maybe'
      }, {
        type: 'input',
        name: 'input2',
        message: function (answers) {
          return 'Did you just said ' + answers.input1 + '?';
        },
        validate: function (value) {
          if (value !== 'Yes' && value !== 'No') {
            return 'Please, answer Yes or No';
          } else {
            return true;
          }
        }
      }, {
        type: 'password',
        name: 'password1',
        message: 'Any secret to share? Promise, this will stay between us.',
        validate: function (value) {
          if (!value) {
            return 'Come on... tell me something...';
          } else {
            return true;
          }
        }
      }, {
        type: 'checkbox',
        name: 'checkbox1',
        message: 'What do you drink?',
        choices: checkboxChoices,
        default: function () {
          // Random default, just for fun
          var idx1 = Math.floor(Math.random() * checkboxChoices.length - 0.0000001);
          var idx2 = Math.floor(Math.random() * checkboxChoices.length - 0.0000001);
          var res = [];
          res.push(checkboxChoices[idx1]);
          if (idx1 !== idx2) {
            res.push(checkboxChoices[idx2]);
          }
          return res;
        },
        filter: function (values) {
          var filtered = values.filter(function (value) {
            return value !== 'Beer' && value !== 'Mojito';
          });

          if (values.length !== filtered.length) {
            console.log('Sorry, alcohol is forbidden.');
          }

          return filtered;
        }
      }, {
        type: 'list',
        name: 'list1',
        message: 'But which is your favorite one?',
        default: function (answers) {
          return answers.checkbox1[0];
        },
        choices: function (answers) {
          return answers.checkbox1;
        },
        when: function (answers) {
          return answers.checkbox1.length > 1;
        }
      }];

      this.prompt(prompts, function (props) {
        context.basic = props;
        done();
      }.bind(this));
    },
    loop: function () {
      var done = this.async();

      var prompts = [{
        type: 'input',
        name: 'famous',
        message: 'Enter the names of famous brands (leave empty to end)'
      }];

      context.loop = [];

      function ask() {
        this.prompt(prompts, function (props) {
          if (props.famous) {
            context.loop.push(props.famous);
            ask.call(this);
          } else {
            done();
          }
        }.bind(this));
      };

      ask.call(this);
    },
    composed: function () {
      this.composeWith('sub', {options: context}, {local: path.resolve(__dirname, '..', 'sub')});
    },
    more: function () {
      var done = this.async();

      var prompts = [{
        type: 'rawlist',
        name: 'rawlist1',
        message: 'Pick your favorite brand',
        choices: context.loop.map(function (value, idx) {
          return {
            name: value,
            value: idx
          };
        })
      }];

      this.prompt(prompts, function (props) {
        context.more = props;
        done();
      }.bind(this));
    }
  },
  end: function () {
    console.log('ANSWERS');
    console.log({
      basic: context.basic,
      loop: context.loop,
      more: context.more,
      composed: context.composed
    });
  }
});
