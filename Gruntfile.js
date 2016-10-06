/*
 * grunt-encoding
 * https://github.com/svetlitskiy/check-json-localization
 *
 * Copyright (c) 2016 Aleksey Svetlitskiy <a.svetlitskiy@gmail.com>
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
    grunt.initConfig({

        // Example configuration
        unambiguity: {
            src: [
                '**/locale.json'
            ]
        }
    });

    grunt.loadTasks('tasks');

};
