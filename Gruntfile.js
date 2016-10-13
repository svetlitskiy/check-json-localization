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
                    '**/locale*.json'
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
                    '**/locale*.json'
                ],
                parts: [
                    {lang: 'en', pattern: '[^\u0000-\u007F,\u2010,\u2014,\u2026,\u00AB,\u00BB]+'},
                    {lang: 'ru', pattern: '[^\u0000-\u007F,\u0410-\u044F,\u00AB,\u00BB,\u0401,\u0451]+'}
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
