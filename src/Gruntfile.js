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
      concat: {
          css: {
              src: ['style/stylesheets/stardog.css',
                    'style/stylesheets/github.min.css'],
              dest: 'style/stylesheets/stardog.css'
          },
      },
      uncss: {
          dist: {
              files: {
                  'website/stardog.css': ['website/index.html']
              }
          }
      },
      availabletasks: {     
          tasks: {}
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
      shell: { //me with ascidoctor.js
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
                  comm += " -o website/index.html 2> /dev/null"
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
          icv_img: {
              nonull: true,
              cwd: 'doc/optimized-img',
              src: 'ClassDiagram.png',
              dest: 'website/icv/',
              expand: true
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
       open: {
           dev: {
               path: 'http://127.0.0.1:8001',
               app: 'Safari',
           },
           prod: {
               path : 'http://docs.stardog.com/',
               app: 'Google Chrome'
           },
      },
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
      clean: {
          css: ["website/stardog.css"],
          css2: ["style/stylesheets/stardog.css"],
          build: ["website"],
          release: ["doc/optimized-img"]
      },
      "link-checker": {
          options: {
              maxConcurrency: 20,
              noFragment: true,
          },
          web: {
              site: "docs.stardog.com"
          }
      },
      inline: {
          dist: {
              options:{
                  tag: 'img'
              },
              src: 'website/index.html',
              dest: 'website/index.html'
          }
      },
      replace: {
          main: {
              src: ['website/index.html'],
              overwrite: true,
              replacements: [{
                  from: "</title>",
                  to: "</title><link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:200,300,400,600,400italic|Anonymous+Pro:400,400italic' rel='stylesheet' type='text/css'>"
              },{
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

    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
                  
    grunt.registerTask('default', ['clean:build',
                                   'compass',
                                   'shell',
                                   'replace',
                                   'htmlmin',
                                   'copy:icv_img',
                                   'copy:main',
                                   'copy:css',
                                   'uncss',
                                   'cssmin',
                                   'embed',
                                   'inline',
                                   'clean:css',
                                   'open:dev']);
    grunt.registerTask('pub', ['default',
                               'copy:pub']);
    grunt.registerTask('cl', ['clean:build']);
    grunt.registerTask('t', ['availabletasks:tasks']);
    grunt.registerTask('lc', ['link-checker:web']);
};
