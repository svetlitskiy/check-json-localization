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
                languages: ['en', 'ru'],
                report: {
                    file: 'unambiguity.txt',
                    encoding: 'win1251'
                }
            }
        },
        entering: {
            locale: {
                src: [
                    '**/locale.json'
                ],
                parts: [
                    {lang: 'en', pattern: '[^\u0000-\u007F,\u00AB,\u00BB]+'}
                ],
                report: {
                    file: 'entering.txt',
                    encoding: 'win1251'
                }
            }
        }
    });

    grunt.loadTasks('tasks');

    //grunt.loadNpmTasks('unambiguity');
    //grunt.registerTask('default', ['jshint', 'complexity']);

};
