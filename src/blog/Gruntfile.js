//require('load-grunt-tasks')(grunt);

module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
      stylus: {
          compile: {
              options: {
                  paths: ["node_modules/axis/axis/"  
                  ],
                  urlfunc: "embedurl",
              },
              files: {
                  "static/s.css": "styl/s.styl"
              }
          }
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
};
