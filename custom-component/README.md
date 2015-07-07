Custom Component Example
------------------------
This shows how a custom component can be added to a form within Form.IO.

How it works
----------------
Form.io allows you to include custom components within your forms by injecting a component within your form. An
example component schema can be found within the ```components/buttonSelect.json``` file.

```
{
  "type": "buttonSelect",
  "key": "favoriteColor",
  "label": "Pick your favorite color...",
  "values": [
    {
      "value": "red",
      "label": "Red"
    },
    {
      "value": "blue",
      "label": "Blue"
    },
    {
      "value": "green",
      "label": "Green"
    }
  ],
  "tableView": true,
  "persistent": true,
  "unique": false,
  "protected": false,
  "defaultValue": "",
  "input": true
}
```

This should then be injected within the Form you wish to include the field.  To help with this process, we have provided a custom script that assists you in this effort called ```inject.js```.  To run you will need to run the following within your terminal.

```
npm install
node inject
```

This will ask you a series of questions to help you inject this field within your Form.

Once your field has been injected into your form, you can then include a field rendering component within your HTML
file. An example of a field component plugin can be found at ```components/buttonSelect.js```.  This file looks like
the following.

```
angular.module('formio')
    .config([
        'formioComponentsProvider',
        function(formioComponentsProvider) {
            formioComponentsProvider.register('buttonSelect', {
                title: 'Button Select',
                template: 'formio/components/buttonSelect.html',
                settings: {
                    input: true,
                    tableView: true,
                    label: '',
                    key: '',
                    theme: 'default',
                    size: 'md',
                    values: [
                        {
                            value: 'value1',
                            label: 'Value 1'
                        },
                        {
                            value: 'value2',
                            label: 'Value 2'
                        }
                    ],
                    protected: false,
                    unique: false,
                    persistent: true
                }
            });
        }
    ])
    .run([
        '$templateCache',
        function(
            $templateCache
        ) {
            $templateCache.put('formio/components/buttonSelect.html',
                '<label ng-if="component.label" for="{{ component.key }}">{{ component.label }}</label>' +
                '<div class="btn-group" role="group" id="{{ component.key }}">' +
                    '<button type="button" class="btn btn-{{ component.theme }} btn-{{ component.size }}" ng-disabled="readOnly || form.submitting || (component.disableOnInvalid && form.$invalid)" ng-repeat="value in component.values" ng-click="$emit(value.value)">{{ value.label }}</button>' +
                '</div>'
            );
        }
    ]);
```

This works by registering a field "type" with the Form.io ```formComponentsProvider```. This is a global registry of
all fields that can be rendered within the form.

You also need to change the form within the ```index.html``` to point to your form.
```
<!-- CHANGE THIS TO YOUR FORM! -->
<formio src="'https://testapp.form.io/app/api/testform'"></formio>
```

When you do this, you should then be able to build the project by
typing the following.

```
bower install
npm install -g gulp;
gulp build;
```

You should then be able to open up ```dist/index.html``` to view your form with the custom field.
