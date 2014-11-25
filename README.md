#  Grunt-FE-Docs

**Grunt-FE-Docs** is a fork of the **[grunt-css-docs](https://github.com/roughcoder/grunt-css-docs)**-Plugin used to generate documentation from CSS, Less, Stylus, Sass files based on the **[DSS](https://github.com/darcyclarke/dss)** parser output.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install https://github.com/Webastronaut/grunt-fe-docs.git --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-fe-docs');
```

In your project's Gruntfile, add a section named `fedocs` to the data object passed into `grunt.initConfig()`.

## Settings

#### files

Type: `Array` or `Object`
Default value: `[]`

Files to parse. Using Grunt default `files` syntax. [More about that on Gruntjs wiki](https://github.com/gruntjs/grunt/wiki/Configuring-tasks#files).

#### options.template

Type: `String`
Default value: `{task_path}/template/`

A relative path to a `mustache` template to be used instead of the default.

#### options.template_index

Type: `String`
Default value: `index.mustache`

The filename of the index of the template.

#### options.output_index

Type: `String`
Default value: `index.html`

The filename of the index for the output file.

#### options.parsers

Type: `Object`
Default value: `{}`

An object filled with key value pairs of functions to be used when parsing comment blocks. See the **example** below for more context about how to use these.

### Example initConfig

I recommend to use the config below, because until now I had no time to implement all the parsers used below to the plugin. Help is very welcome!

```javascript
grunt.initConfig({
  fedocs: {
      docs: {
          files: {
              'api/': 'css/**/*.{css,scss,sass,less,styl}'
          },
          options: {
              parsers: {
                  link: function(i, line){
                      line = '<a href="' + line + '" target="_blank">' + line + '</a>';

                      return line;
                  },
                  dependencies: function(i, line){
                      return line.split(',');
                  },
                  decorator: function(i, line){
                      var string = line.split(' - ');

                      return { name: string[0], description: string[1] ? string[1] : '-' };
                  },
                  requires: function(i, line){
                      var string = line.split(' ');

                      string[0] = string[0].replace(/(\{|\})/g, '');

                      return { type: string[0], name: string[1] };
                  },
                  param: function(i, line){
                      var string = line.split(' - '),
                          description = string[1] ? string[1] : '-';

                      string = string[0].split(' ');
                      string[0] = string[0].replace(/(\{|\})/g, '');

                      return { type: string[0], name: string[1], description: description };
                  },
                  query: function(i, line) {
                      var string = line.split(' - ');

                      return { name: string[0], description: string[1] ? string[1] : '-' };
                  },
                  section: function(i, line) {
                      var string = line.split(' - ');

                      return { name: string[0], description: string[1] ? string[1] : '-' };
                  },
                  type: function(i, line) {
                      return line.replace(/(\{|\})/g, '');
                  }
              }
          }
      }
  },
});
````
