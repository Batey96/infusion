/*
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 OCAD University
Copyright 2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global window, fluid_1_5:true, jQuery, swfobject*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {
    
    if (typeof(window) !== "undefined" && window.document) {
        fluid.registerNamespace("fluid.browser");
     
        fluid.browser.binaryXHR = function () {
            var canSendBinary = window.FormData || 
                (window.XMLHttpRequest && 
                    window.XMLHttpRequest.prototype &&
                    window.XMLHttpRequest.prototype.sendAsBinary);
            return canSendBinary ? fluid.typeTag("fluid.browser.supportsBinaryXHR") : undefined;
        };
        
        fluid.browser.formData  = function () {
            return window.FormData ? fluid.typeTag("fluid.browser.supportsFormData") : undefined;
        };
        
        fluid.browser.flash = function () {
            var hasModernFlash = (typeof(swfobject) !== "undefined") && (swfobject.getFlashPlayerVersion().major > 8);
            return hasModernFlash ? fluid.typeTag("fluid.browser.supportsFlash") : undefined;
        };
        
        /**********************************************************
         * This code runs immediately upon inclusion of this file *
         **********************************************************/
        
        // Use JavaScript to hide any markup that is specifically in place for cases when JavaScript is off.
        // Note: the use of fl-ProgEnhance-basic is deprecated, and replaced by fl-progEnhance-basic.
        // It is included here for backward compatibility only.
        $("head").append("<style type='text/css'>.fl-progEnhance-basic, .fl-ProgEnhance-basic { display: none; } .fl-progEnhance-enhanced, .fl-ProgEnhance-enhanced { display: block; }</style>");
        
        // Browser feature detection--adds corresponding type tags to the static environment,
        // which can be used to define appropriate demands blocks for components using the IoC system.
        var features = {
            supportsBinaryXHR: fluid.browser.binaryXHR(),
            supportsFormData: fluid.browser.formData(),
            supportsFlash: fluid.browser.flash(),
            isBrowser: fluid.typeTag("fluid.browser")
        };
        
        $.extend(fluid.staticEnvironment, features);
    }
    /*
     * takes an object of key/value pairs where the key will be the key in the static enivronment and the value is a function or function name to run.
     * {staticEnvKey: "progressiveCheckFunc"}
     */
    fluid.check = function (stuffToCheck) {
        fluid.each(stuffToCheck, function (val, key) {
            var results = val && typeof(val) === "string" ? fluid.invokeGlobalFunction(val) : val();
            
            if (results) {
                fluid.staticEnvironment[key] = fluid.typeTag(key);
            }
        });
    };
    
    /*
     * takes an array of static environemnt keys to remove
     * ["staticEnvKey1", "staticEnvKey2"]
     */
    fluid.forget = function (stuffToForget) {
        fluid.each(stuffToForget, function (val) {
            delete fluid.staticEnvironment[val];
        });
    };
    
    // Note: deprecated as of 1.5. Use fluid.check, fluid.forget, and fluid.demands instead
    fluid.progressiveChecker = function (options) {
        var that = fluid.initLittleComponent("fluid.progressiveChecker", options);
        return fluid.typeTag(fluid.find(that.options.checks, function(check) {
            if (check.feature) {
                return check.contextName;
            }}, that.options.defaultContextName
        ));
    };
    
    // Note: deprecated as of 1.5. Use fluid.check, fluid.forget, and fluid.demands instead
    fluid.defaults("fluid.progressiveChecker", {
        gradeNames: "fluid.typeFount",
        checks: [], // [{"feature": "{IoC Expression}", "contextName": "context.name"}]
        defaultContextName: undefined
    });
    
    // Note: deprecated as of 1.5. Use fluid.check, fluid.forget, and fluid.demands instead
    fluid.progressiveCheckerForComponent = function (options) {
        var that = fluid.initLittleComponent("fluid.progressiveCheckerForComponent", options);
        var defaults = fluid.defaults(that.options.componentName);
        return fluid.progressiveChecker(fluid.expandOptions(fluid.copy(defaults.progressiveCheckerOptions), that));  
    };

    // Note: deprecated as of 1.5. Use fluid.check, fluid.forget, and fluid.demands instead
    fluid.defaults("fluid.progressiveCheckerForComponent", {
        gradeNames: "fluid.typeFount"
    });
    
    
})(jQuery, fluid_1_5);
