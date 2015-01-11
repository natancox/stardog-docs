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
              src: ['style/stylesheets/stardog.css', 'style/stylesheets/github.min.css'],
              dest: 'style/stylesheets/stardog.css'
          },
      },
      //TODO
      //get rid of @import for google fonts... how?
      //3. Optimize fonts
      //7. Optimize build: Asciidoctor.js, native sass?, composite targets, livereload, concurrent, asset revisions
      //8. figure out live examples...
      //9. move to s3/cloudfront/53
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
      shell: { //replace me with ascidoctor.js
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
              cwd: 'doc/optimized-img/',
              src: ['cp.png',],
              dest: 'website/img/',
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
    // grunt.loadNpmTasks('grunt-shell');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-text-replace');
    // grunt.loadNpmTasks('grunt-contrib-imagemin');
    // grunt.loadNpmTasks('grunt-contrib-compass');
    // grunt.loadNpmTasks('grunt-uncss');
    // grunt.loadNpmTasks('grunt-contrib-cssmin');
    // grunt.loadNpmTasks('grunt-contrib-htmlmin');
    // grunt.loadNpmTasks('grunt-embed');
    // grunt.loadNpmTasks('grunt-available-tasks');
    // grunt.loadNpmTasks('grunt-open');
    // grunt.loadNpmTasks('grunt-http');
    // grunt.loadNpmTasks('grunt-contrib-concat');
                   
    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
                  
    // Default task(s).
    //grunt.registerTask('default', ['shell:build:2.2.4:"11 December 2014"']);
    grunt.registerTask('default', ['compass',
                                   'shell',
                                   'replace',
                                   'htmlmin',
                                   'copy:img',
                                   'copy:icv_img',
                                   'copy:main',
                                   'copy:css',
                                   'uncss',
                                   'cssmin',
                                   'embed',
                                   'clean:css',
                                   'open:dev']);
    //probably should do some clean first here...
    grunt.registerTask('pub', ['clean:build',
                               'compass',
                               'shell',
                               'replace',
                               'htmlmin',
                               'copy:img',
                               'copy:icv_img',
                               'copy:main',
                               'copy:css',
                               'uncss',
                               'cssmin',
                               'embed',
                               'clean:css',
                               'copy:pub']);
    grunt.registerTask('cl', ['clean:build']);
    grunt.registerTask('t', ['availabletasks:tasks']);
    grunt.registerTask('lc', ['link-checker:web']);
};
