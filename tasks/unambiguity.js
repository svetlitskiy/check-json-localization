/*
 * unambiguity
 * https://github.com/pigulla/grunt-encoding
 *
 * Copyright (c) 2013-2015 Raphael Pigulla <pigulla@four66.com>
 * Licensed under the MIT license.
 */
'use strict';

var jschardet = require('jschardet');

module.exports = function (grunt) {

    grunt.registerTask('unambiguity', 'check unambiguity in different languages', function() {
        var files = grunt.file.expand(this.data.src);

        files.forEach(function(file) {
            grunt.log.write('checking English part in ' + file + '\n');
            checkUnambiguity(file);
        });
    });

    /**
     * Проверка что в русской и английской частях есть все объекты
     * @param {String} file - путь к файлу
     */
    var checkUnambiguity = function(file) {
        var body = grunt.file.readJSON(file);
        var eng = body && body.en || body.eng || {};
        var rus = body && body.ru || body.rus || {};

        var keysEng = sub(eng, rus);
        var msg;
        if (keysEng.length > 0) {
            msg = 'Localization error, the file ' + file + ' has keys ' + keysEng.join(', ') + ' in the English part, but doesn\'t have them in the Russian part.\n';
        }
        var keysRus = sub(rus, eng);
        if (keysRus.length > 0) {
            msg = 'Localization error, the file ' + file + ' has keys ' + keysRus.join(', ') + ' in the Russian part, but doesn\'t have them in the English part.\n';
        }
        if (msg) {
            //grunt.log.writeln("##teamcity[buildProblem description='" + msg + "' identity='checkLocalizationFailed']");
            //grunt.fail.warn(msg);
            grunt.file.write('localization.log',msg);
        }
    };

};
