#  Grunt-CSS-Docs

**Grunt-CSS-Docs** genertates style guide format documentation from CSS, Less, Stylus, Sass files based on the **[DSS](https://github.com/darcyclarke/dss)** parser output.

This is a fork from the orginal [Grunt DSS](https://github.com/darcyclarke/grunt-dss) plugin from [Darcy Clarke](https://github.com/darcyclarke/) (the creator of **[DSS](https://github.com/darcyclarke/dss)**).  We needed to customise some features to suit our project needs.  Check the release notes for more information.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-css-docs --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-css-docs');
```

In your project's Gruntfile, add a section named `cssdocs` to the data object passed into `grunt.initConfig()`.

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

```javascript
grunt.initConfig({
  cssdocs: {
    docs: {
      files: {
        'api/': 'css/**/*.{css,scss,sass,less,styl}'
      },
      options: {
        template: '/dark_theme/',
        parsers: {
          // Finds @link in comment blocks
          link: function(i, line, block){

            // Replace link with HTML wrapped version
            var exp = /(b(https?|ftp|file)://[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
            line.replace(exp, "<a href='$1'>$1</a>");
            return line;
          }
        }
      }
    }
  }
});
````

## DSS Sublime Text Plugin

You can now **auto-complete** DSS-style comment blocks using @sc8696's [Auto-Comments Sublime Text Plugin](https://github.com/sc8696/sublime-css-auto-comments)
