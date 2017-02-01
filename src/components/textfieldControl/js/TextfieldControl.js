/*
Copyright 2013-2016 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_3_0_0 = fluid_3_0_0 || {};

(function ($, fluid) {
    "use strict";

    /*********************
     * TextField Control *
     *********************/

    /**
     * TextField Control is a primarily used as a base grade for combining
     * a textfield with another UI element such as buttons or a slider
     * for inputing numerical values.
     */
    fluid.defaults("fluid.textfieldControl", {
        gradeNames: ["fluid.viewComponent"],
        strings: {
            // Specified by implementor
            // text of label to apply to both textfield and control
            // via aria-label attribute
            // "aria-label": ""
        },
        selectors: {
            textfield: ".flc-textfieldControl-field"
        },
        components: {
            textfield: {
                type: "fluid.textfieldControl.textfield",
                container: "{textfieldControl}.dom.textfield",
                options: {
                    model: "{textfieldControl}.model",
                    range: "{textfieldControl}.options.range",
                    ariaOptions: "{textfieldControl}.options.ariaOptions",
                    strings: "{textfieldControl}.options.strings"
                }
            }
        },
        model: {
            value: null
        },
        modelRelay: {
            target: "value",
            singleTransform: {
                type: "fluid.transforms.limitRange",
                input: "{that}.model.value",
                min: "{that}.options.range.min",
                max: "{that}.options.range.max"
            }
        },
        range: {
            min: 0,
            max: 100
        },
        ariaOptions: {
            // Specified by implementor
            // ID of an external label to refer to with aria-labelledby
            // attribute
            // "aria-labelledby": ""
        }
    });

    fluid.defaults("fluid.textfieldControl.textfield", {
        gradeNames: ["fluid.viewComponent"],
        modelRelay: {
            target: "value",
            singleTransform: {
                type: "fluid.transforms.stringToNumber",
                input: "{that}.model.stringValue"
            }
        },
        modelListeners: {
            value: {
                "this": "{that}.container",
                "method": "val",
                args: ["{change}.value"]
            },
            // TODO: This listener is to deal with the issue that, when the input field receives a invalid input such as a string value,
            // ignore it and populate the field with the previous value.
            // This is an area in which UX has spilled over into our model configuration, which to some extent we should try to prevent.
            // Whenever we receive a "change" event or some other similar checkpoint, if these updates occurred any faster, the user would
            // be infuriated by being unable to type into the field. This situation doesn't occur at the moment because the change event is
            // only fired when users leave the input feild. At the very least, we need to give a namespace to this listener - unfortunately
            // the current dataBinding implementation will ignore it. Having this listener here represents an interaction decision rather
            // than an implementation decision. This issue needs to be revisited.
            stringValue: {
                "this": "{that}.container",
                "method": "val",
                args: ["{that}.model.value"]
            }
        },
        listeners: {
            "onCreate.bindChangeEvt": {
                "this": "{that}.container",
                "method": "change",
                "args": ["{that}.setModel"]
            },
            "onCreate.initTextfieldAttributes": {
                "this": "{that}.container",
                method: "attr",
                args: [{
                    "aria-labelledby": "{that}.options.ariaOptions.aria-labelledby",
                    "aria-label": "{that}.options.strings.aria-label"
                }]
            }
        },
        invokers: {
            setModel: {
                changePath: "stringValue",
                value: "{arguments}.0.target.value"
            }
        }
    });

})(jQuery, fluid_3_0_0);
