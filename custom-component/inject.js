var _ = require('lodash');
var config = require('./config.json');
var prompt = require('prompt');
var components = require('./components/index');
var colors = require('colors');
var componentsText = '';
var componentNum = 1;
components.forEach(function(component) {
    var num = ('' + componentNum++ + '').white;
    componentsText = '   ' + num + '.) ' + component.type.white + "\n";
});

var prompts = {
    email: {
        message: 'Enter your Form.IO username (email)',
        required: true
    },
    pass: {
        message: 'Enter your Form.IO password',
        required: true,
        hidden: true
    },
    form: {
        message: 'Enter the Form API URL which would like to add the custom component.',
        required: true
    },
    component: {
        message: "Which component would you like to add?\n" + componentsText,
        required: true
    },
    placement: {
        message: 'Enter where you would like to place this component? Format: "(before|after) {{ component.key }}", Example "before email"'
    }
};

// Remove configurations that already have a value.
_.each(config, function(value, key) {
    if (value) { delete prompts[key]; }
});

// Prompt the user.
prompt.start();
prompt.get({ properties: prompts }, function (err, input) {
    if (err) { return console.log(err); }

    // Extend the configuration.
    config = _.assign(config, input);

    var Formio = require('formio-service')({
        formio: config.formio
    });
    var form = new Formio.Form(config.form);
    Formio
        .authenticate(config.email, config.pass)
        .then(form.load.bind(form))
        .then(function() {
            var parts = config.placement.split(' ');
            var selectedComp = components[parseInt(config.component, 10) - 1];
            var op = null;
            form.eachComponent(function(component, index, components) {
                if (!op && (component.key === parts[1])) {
                    op = {components: components, index: index};
                }
            });

            // If there is an operation to perform.
            if (op) {
                var insertIndex = (parts[0].toLowerCase() === 'before') ? op.index : (op.index + 1);
                op.components.splice(insertIndex, 0, selectedComp);
                return form.save();
            }
            else {
                return false;
            }
        })
        .then(function() {
            console.log('Form saved successfully!');
        })
        .catch(function(error) {
            console.log(error);
        });
});