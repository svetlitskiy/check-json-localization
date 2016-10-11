/*
 * unambiguity
 * https://github.com/pigulla/grunt-encoding
 *
 * Copyright (c) 2013-2015 Raphael Pigulla <pigulla@four66.com>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

  var report = [];

  grunt.registerMultiTask('unambiguity', 'check unambiguity in different languages', function () {
    var files = grunt.file.expand(this.data.src), languages = languagesForCompare(this.data.languages || ['en', 'ru']),
      reportFile = this.data.report.file || 'unambiguity.txt', reportEncoding = this.data.report.encoding || 'utf8';
    if (this.data.exclude) {
      grunt.file.expand(this.data.exclude).forEach(function(e) {
        files.splice(files.indexOf(e), 1);
      });
    }
    files.forEach(function (file) {
      grunt.log.writeln('unambiguity: check ' + file);
      languages.forEach(function(l){
        var l1 = l.l1, l2 = l.l2;
        checkUnambiguity(file, l1,l2);
      })
    });


    if (report.length > 0) {
      grunt.file.write(reportFile, report.join('\n'), {encoding: reportEncoding});
      grunt.fail.warn(report[0]);
    }
  });


  var languagesForCompare = function(langArray) {
    var compare = [];
    langArray.forEach(function(lang1, i, arr) {
      var copy = arr.concat();
      copy.splice(0, i+1);
      copy.forEach(function(lang2){
        compare.push({l1: lang1, l2: lang2});
      });

    });
    return compare;
  };

  /**
   * поиск недостающих ключей в объектах с учетом вложений
   * @param {Object} obj1 - первый объект
   * @param {Object} obj2 - второй объект
   * @returns {Array}
   */
  var sub = function (obj1, obj2, prefix) {
    var errorKeys = [];
    for (var key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
          var newErrors = sub(obj1[key], obj2[key], prefix ? prefix + '.'+ key : key);
          errorKeys = errorKeys.concat(newErrors);
        } else {
          if (!obj2[key]) {
            errorKeys.push(prefix ? prefix + '.'+ key : key);
          }
        }
      }
    }
    return errorKeys;
  };

  /**
   * Проверка что в русской и английской частях есть все объекты
   * @param {String} file - путь к файлу
   */
  var checkUnambiguity = function (file, lang1, lang2) {
    var body = grunt.file.readJSON(file), ln1 = body && body[lang1], ln2 = body && body[lang2];

    if (!ln1) {
      report.push('file ' + file + ' doesn\'t have "'+ lang1 + '" part');
    } else if (!ln2) {
      report.push('file ' + file + ' doesn\'t have "'+ lang2 + '" part');
    } else {
      var keysLn1 = sub(ln1, ln2), keysLn2 = sub(ln2, ln1);
      if (keysLn1.length > 0) {
        report.push(
          'Localization error, the file ' + file + ' has keys ' + keysLn1.join(', ') + ' in the "' + lang1 + '" part, but doesn\'t have them in the "' + lang2 +
          '" part.');
      }
      if (keysLn2.length > 0) {
        report.push(
          'Localization error, the file ' + file + ' has keys ' + keysLn2.join(', ') + ' in the "' + lang2 + '" part, but doesn\'t have them in the "' + lang1 +
          '" part.');
      }
    }


  };

};
