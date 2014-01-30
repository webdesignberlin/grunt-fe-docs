/*
 * DSS
 * https://github.com/darcyclarke/DSS
 *
 * Copyright (c) 2013 darcyclarke
 * Licensed under the MIT license.
 */

// Include dependencies
var handlebars = require('handlebars');
var dss = require('dss');
var _ = require('lodash');
var marked = require('marked');
var beautify_html = require('js-beautify').html;
// Expose
module.exports = function (grunt) {

    // Register DSS
    grunt.registerMultiTask('cssdocs', 'Parse DSS comment blocks', function () {

        // Setup async promise
        var promise = this.async();

        // Merge task-specific and/or target-specific options with defaults
        var options = this.options({
            template: __dirname + '/../template/',
            template_index: 'index.handlebars',
            output_index: 'index.html',
            parsers: {
                category: function (i, line, block) {
                    return line;
                },
                subcategory: function (i, line, block) {
                    return line;
                }
            }
        });

        // TODO: Move to options
        var markedOptions = {
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        };

        // Output options if --verbose cl option is passed
        grunt.verbose.writeflags(options, 'Options');

        // Describe custom parsers
        for (var key in options.parsers) {
            dss.parser(key, options.parsers[key]);
        }

        // Build Documentation
        this.files.forEach(function (f) {

            // Filter files based on their existence
            var src = f.src.filter(function (filepath) {

                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                } else {
                    return true;
                }
            });

            // Setup
            var files = src,
                template_dir = options.template,
                output_dir = f.dest,
                length = files.length,
                styleguide = [];

            // Parse files
            files.map(function (filename) {

                // Report file
                grunt.verbose.writeln('• ' + grunt.log.wordlist([filename], {color: 'cyan'}));

                // Parse
                dss.parse(grunt.file.read(filename), { file: filename }, function (parsed) {


                    // Restructure the blocks
                    parsed.blocks.forEach(function (block) {
                        if (block['name']) {
                            if (!block['category']) {
                                block['category'] = filename;
                            }
                            block['file'] = filename;
                        }
                        if (block['description']) {
                            var tokens = marked.lexer(block['description'], markedOptions);
                            block['description'] = marked.parser(tokens);
                        }
                        if (block['markup']) {
                            block['markup']['example'] = beautify_html(block['markup']['example']);
                        }

                        styleguide.push(block);
                    });

                });

            });

            styleguide = _.groupBy(styleguide, 'category');

            // Set output template and file
            var template_filepath = template_dir + options.template_index,
                output_filepath = output_dir + options.output_index;

            if (!grunt.file.exists(template_filepath)) {
                grunt.fail('Cannot read the template file');
            }

            // copy template assets (except index.handlebars)
            grunt.file.expandMapping([
                '**/*',
                '!' + options.template_index
            ], output_dir, { cwd: template_dir }).forEach(function (filePair) {
                    filePair.src.forEach(function (src) {
                        if (grunt.file.isDir(src)) {
                            grunt.verbose.writeln('Creating ' + filePair.dest.cyan);
                            grunt.file.mkdir(filePair.dest);
                        } else {
                            grunt.verbose.writeln('Copying ' + src.cyan + ' -> ' + filePair.dest.cyan);
                            grunt.file.copy(src, filePair.dest);
                        }
                    });
                });

            // Create HTML ouput
            var html = handlebars.compile(grunt.file.read(template_filepath))({
                project: grunt.file.readJSON('package.json'),
                files: styleguide
            });

            var output_type = 'created', output = null;
            if (grunt.file.exists(output_filepath)) {
                output_type = 'overwrited';
                output = grunt.file.read(output_filepath);
            }
            // avoid write if there is no change
            if (output !== html) {
                // Render file
                grunt.file.write(output_filepath, html);

                // Report build
                grunt.log.writeln('✓ Styleguide ' + output_type + ' at: ' + grunt.log.wordlist([output_dir], {color: 'cyan'}));
            }
            else {
                // no change
                grunt.log.writeln('‣ Styleguide unchanged');
            }

            // Return promise
            promise();

        });


    });

};
