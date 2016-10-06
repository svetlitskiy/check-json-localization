/*
 * unambiguity
 * https://github.com/pigulla/grunt-encoding
 *
 * Copyright (c) 2013-2015 Raphael Pigulla <pigulla@four66.com>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

  grunt.registerMultiTask('unambiguity', 'check unambiguity in different languages', function () {
    var files = grunt.file.expand(this.data.src), languages = languagesForCompare(this.data.languages || ['en', 'ru']);
    if (this.data.exclude) {
      grunt.file.expand(this.data.exclude).forEach(function(e) {
        files.splice(files.indexOf(e), 1);
      });
    }
    files.forEach(function (file) {
      grunt.log.writeln('unambiguity: check' + file);
      languages.forEach(function(l){
        var l1 = l.l1, l2 = l.l2;
        checkUnambiguity(file, l1,l2);
      })
    });

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
  var sub = function (obj1, obj2) {
    var errorKeys = [];
    for (var key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if (typeof obj1[key] === 'object') {
          sub(obj1[key], obj2[key]);
        } else {
          if (!obj2[key]) {
            errorKeys.push(key);
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
      console.log('file ' + file + ' doesn\'t have "'+ lang1 + '" part');
    }
    if (!ln2) {
      console.log('file ' + file + ' doesn\'t have "'+ lang2 + '" part');
    }

    var keysLn1 = sub(ln1, ln2), keysLn2 = sub(ln1, ln2);

    var msg;
    if (keysLn1.length > 0) {
      msg = 'Localization error, the file ' + file + ' has keys ' + keysLn1.join(', ') + ' in the "'+lang1+'" part, but doesn\'t have them in the "'+lang2+'" part.\n';
    }
    if (keysLn2.length > 0) {
      msg = 'Localization error, the file ' + file + ' has keys ' + keysLn2.join(', ') + ' in the "'+lang2+'" part, but doesn\'t have them in the "'+lang1+'" part.\n';
    }

    if (msg) {
      //grunt.log.writeln("##teamcity[buildProblem description='" + msg + "' identity='checkLocalizationFailed']");
      grunt.fail.warn(msg);
      //grunt.file.write('localization.log', msg);
    }

  };

};
