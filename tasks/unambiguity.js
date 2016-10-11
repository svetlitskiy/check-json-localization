/*
 * unambiguity
 * https://github.com/svetlitskiy/check-json-localization.git
 *
 * Copyright (c) 2013-2015 Aleksey Svetlitskiy <a.svetlitskiy@gmail.com>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

  var report = [];

  grunt.registerMultiTask('unambiguity', 'check unambiguity in different languages', function () {
    var files = grunt.file.expand(this.data.src), confLangs = this.data.languages || ['en', 'ru'], languages = languagesForCompare(confLangs),
      reportFile = this.data.report.file || 'unambiguity.txt', reportEncoding = this.data.report.encoding || 'utf8';
    if (this.data.exclude) {
      grunt.file.expand(this.data.exclude).forEach(function(e) {
        files.splice(files.indexOf(e), 1);
      });
    }
    var tempFiles = {};
    files.forEach(function (file) {
      var fileName = file.split('/').pop().toString();
      var langFromFile = fileName.substr(-7,2);
      var fileBody = grunt.file.readJSON(file);

      if (confLangs.indexOf(langFromFile) > -1) {
        if (!tempFiles[file.substr(0, file.length - fileName.length)]) {
          tempFiles[file.substr(0, file.length - fileName.length)] = {};
        }
        tempFiles[file.substr(0, file.length - fileName.length)][langFromFile] = fileBody;
      } else {
        tempFiles[file] = fileBody;
      }
    });

    for(var tempFile in tempFiles) {
      grunt.log.writeln('unambiguity: check ' + tempFile);
      languages.forEach(function (l) {
        var l1 = l.l1, l2 = l.l2;
        checkUnambiguity(tempFiles[tempFile], l1, l2, tempFile);
      })
    }


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
  var checkUnambiguity = function (body, lang1, lang2, file) {
    var ln1 = body && body[lang1], ln2 = body && body[lang2];

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
