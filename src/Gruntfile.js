//require('load-grunt-tasks')(grunt);
var theId = "2.2.4";
var theDate = '"11 December 2014"';

module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      compass: {                      
          dist: {                     
              options: {
                  config: 'style/config.rb',
                  basePath: 'style',
                  environment: 'production',
                  outputStyle: "compressed",
                  specify: "style/sass/stardog.scss",
                  trace: true
              },
          }
      },
      uncss: {
          dist: {
              files: {
                  'website/stardog.css': ['website/index.html']
              }
          }
      },
      imagemin: {
          dynamic: {
              options: {
                  optimizationLevel: 3,
              },
              files: [{
                  expand: true,
                  cwd: 'doc/img',
                  src: ['*.png'],
                  dest: 'doc/optimized-img/'
              }]
          }
      },
      shell: {
          build: {
              command: function () {
                  comm = "asciidoctor ";
                  comm += "-v ";
                  comm += "-t ";
                  comm += "-a ";
                  comm += "version=" + theId;
                  comm += " -a ";
                  comm += "release-date=" + theDate;
                  comm += " -a allow-uri-read";
                  comm += " -a linkcss"
                  comm += " -a stylesheet=stardog.css"; //make an arg?
                  comm += " doc/index.ad";
                  comm += " -a data-uri"
                  comm += " -o website/index.html"
                  //console.log(comm);
                  return comm
              }
          }
      },
      copy: {
          main: {
              nonull: true,
              cwd: 'doc/',
              src: 'icv/*',
              dest: 'website/',
              expand: true,
          },
          img: {
              nonull:true,
              cwd: 'doc/',
              src: 'img/cp.png',
              dest: 'website/',
              expand: true,
          },
          css: {
              nonull:true,
              src: 'style/stylesheets/stardog.css',
              dest: 'website/stardog.css',
          },
          pub: {
              nonull:true,
              src:'**',
              dest:'../published',
              expand: true,
              cwd: 'website/'
          }
      },
      htmlmin: {                                 
          dist: {                                     
              options: {                               
                  removeComments: true,
                  collapseWhitespace: true
              },
              files: {
                  'website/index.html': 'website/index.html',    
              }
          },
      },
      // somehow embedding the wrong css, one which hasn't been uncss'ified
      //disabled for now
      embed: {
          dist: {
              options: {
                  stylesheets: true,
              },
              files: {
                  "website/index.html": "website/index.html"
              }
          }
      },
      cssmin: {
          dist: {
              files: {'website/stardog.css': ['website/stardog.css']}
          }
      },
      replace: {
          main: {
              src: ['website/index.html'],
              overwrite: true,
              replacements: [{
                  from: '<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>',
                  to: ''
              },{
                  from: '<link rel="stylesheet" href="./stardog.css">',
                  to: '<link data-embed rel="stylesheet" href="./stardog.css">'
              },{
                  from: '<script>hljs.initHighlightingOnLoad()</script>',
                  to: ''
              }, {
                  from: '</body>',
                  to: '<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js"></script>\n<script>hljs.initHighlightingOnLoad()</script>\n</body>'
              }]
          }
      },
  });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-embed');

    // Default task(s).
    //grunt.registerTask('default', ['shell:build:2.2.4:"11 December 2014"']);
    grunt.registerTask('default', ['shell:build']);
};
