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
            locale: {
                src: [
                    '**/locale.json'
                ],
                exclude: ['**/task/**'],
                languages: ['en', 'ru', 'es'],
                report: 'unambiguity.txt'
            }
        }
    });

    grunt.loadTasks('tasks');

    //grunt.loadNpmTasks('unambiguity');
    //grunt.registerTask('default', ['jshint', 'complexity']);

};
