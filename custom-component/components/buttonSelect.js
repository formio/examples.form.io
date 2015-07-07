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