/*
 * entering
 * https://github.com/svetlitskiy/check-json-localization.git
 *
 * Copyright (c) 2016 Aleksey Svetlitskiy <a.svetlitskiy@gmail.com>
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {

  var report = [];

  grunt.registerMultiTask('entering', 'check entering', function () {
    var files = grunt.file.expand(this.data.src), parts = this.data.parts,  reportFile = this.data.report.file || 'entering.txt',
      reportEncoding = this.data.report.encoding || 'utf8';
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

      var check = parts.filter(function(part){
        return part && langFromFile === part.lang;
      });


      if (check.length > 0) {
        if (!tempFiles[file.substr(0, file.length - fileName.length)]) {
          tempFiles[file.substr(0, file.length - fileName.length)] = {};
        }
        tempFiles[file.substr(0, file.length - fileName.length)][langFromFile] = fileBody;
      } else {
        tempFiles[file] = fileBody;
      }
    });

    for(var tempFile in tempFiles) {
      grunt.log.writeln('entering: check ' + tempFile);
      parts.forEach(function(part) {
        checkPattern(tempFiles[tempFile], part.lang, part.pattern, tempFile);
      });
    }

    if (report.length > 0) {
      grunt.file.write(reportFile, report.join('\n'), {encoding: reportEncoding});
      grunt.fail.warn(report[0]);
    }
  });



  /**
   * поиск строк вне заданной регулярки
   * @param {Object} obj1 - объект
   * @param {Object} pattern - паттерн
   * @returns {Array}
   */
  var sub = function (obj1, pattern, prefix) {
    var errorKeys = [];
    for (var key in obj1) {
      if (obj1.hasOwnProperty(key)) {
        if (typeof obj1[key] === 'string') {
          var matched = obj1[key].match(pattern);
          if (matched !== null) {
            errorKeys.push({key: prefix ? prefix + '.'+ key : key, string: matched[0]});
          }
        } else if (typeof obj1[key] === 'object') {
          var newErrors = sub(obj1[key], pattern, prefix ? prefix + '.'+ key : key);
          errorKeys = errorKeys.concat(newErrors);
        } else {
          //to do nothing
        }
      }
    }
    return errorKeys;
  };


  var checkPattern = function(body, lang, pattern, file) {
    var check = body && body[lang];
    var errors = sub(check, pattern) || [];
    errors.forEach(function(error){
      report.push('Localization error, the file ' + file + ' has key ' + error.key + ' with forbidden symbols ' + error.string + ' in ' + lang + ' part');
    });
  };


};
