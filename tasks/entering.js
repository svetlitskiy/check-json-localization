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

  grunt.registerMultiTask('entering', 'check entering', function () {
    var files = grunt.file.expand(this.data.src), parts = this.data.parts,  reportFile = this.data.report || 'entering.txt';
    if (this.data.exclude) {
      grunt.file.expand(this.data.exclude).forEach(function(e) {
        files.splice(files.indexOf(e), 1);
      });
    }
    files.forEach(function (file) {
      grunt.log.writeln('unambiguity: check ' + file);
      parts.forEach(function(part) {
        checkPattern(file, part.lang, part.pattern);
      });
      
    });
    
    if (report.length > 0) {
      grunt.file.write(reportFile, report.join('\n'));
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
          console.log('String');
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


  var checkPattern = function(file, lang, pattern) {
    var body = grunt.file.readJSON(file);
    var check = body && body[lang];
    var errors = sub(check, pattern) || [];
    errors.forEach(function(error){
      console.log(error);
      report.push('Localization error, the file ' + file + ' has key ' + error.key + ' with forbidden symbols in string ' + error.string + ' in ' + lang + ' part');
    });
  };


};
