//require('load-grunt-tasks')(grunt);

module.exports = function(grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    var theId = grunt.option("id") || "3.0";
    var theDate = grunt.option("date") || "'16 March 2015'";

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      autoprefixer: {
          single_file: {
              options: {
                  browsers: ["> 1%", "ie10", "ie11"]
              },
              src: 'website/stardog.css',
              dest: 'website/stardog.css'
          },
        },
        //WARNING: never put this in a git repo dir...
        aws: grunt.file.readJSON("../../grunt-aws-SECRET.json"),
        aws_s3: {
             options: {
                    accessKeyId: "<%= aws.secret %>",
                    secretAccessKey: '<%= aws.key %>',
                    bucket: "<%= aws.bucket3 %>",
                    region: "us-east-1",
                    access: "public-read",
                    progress: "progressBar",
                    streams: true,
                    debug: false,
                    uploadConcurrency: 30,
                },

            production: { //everything else: images and pdfs
                options: {
                    streams: true,
                    debug: false,
                    differential: true,
                params: {
                        "CacheControl": "max-age=63072000, public",
                        "Expires": new Date(Date.now() + 6.31139e10),//.toUTCString(),
                }
                },

                files: [
                    { expand: true, dest: '.', cwd: 'website/', src: ['**/*',], action: 'upload', differential: true },
                    { dest: '/', cwd: 'website/', action: 'delete', differential: true }
                ]
            },
            gzipd: { //only the compressed html files
                options: {
                    streams: true,
                    debug: false,
                    differential: true,
                params: {
                    "CacheControl": "max-age=63072000, public",
                    "Expires": new Date(Date.now() + 6.31139e10),
                    "ContentEncoding": "gzip"
                }
                },
                files: [ {expand: true, dest: ".", cwd: "website-gzipd/", src: ["**/*"], action:"upload", differential:true},
                       ]
            },
        },
        compress: {
            main: {
                options: { mode: 'gzip', pretty: true, level: 9},
                expand: true,
                cwd: "website/",
                src: ["**/index.html"],
                dest: "website-gzipd/",
            },
        },
        invalidate_cloudfront: {
          options: {
              key: "<%= aws.secret %>",
              secret: "<%= aws.key %>",
              distribution: '<%= aws.cf3 %>'
            },
          index: {
              files: [
                  { //nothing else ever changes
                      expand: true,
                      cwd: "website/",
                      src: ["index.html", "/index.html"],
                      dest: ''
                  }
              ]
          },
        },
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
                    'style/stylesheets/github.min.css',
                    'style/stylesheets/terminal.css'],
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
          },
          pdf: {
              command: function() {
                  comm = "prince website/index.html --baseurl=http://docs.stardog.com/ --javascript --media=screen -o website/stardog-manual-";
                  comm += theId;
                  comm += ".pdf";
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
          build: ["website/index.html", "website/icv", "website-gzipd/index.html"],
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
                                   'shell:build',
                                   'replace',
                                   'htmlmin',
                                   'copy:icv_img',
                                   'copy:main',
                                   'copy:css',
                                   'autoprefixer',
                                  // 'uncss',
                                   'cssmin',
                                   'embed',
                                   'inline',
                                   'clean:css',
                                  ]);
    grunt.registerTask('pub', [
        //do we want to start off by doing a bump?
        'default',
        'shell:pdf',
        'compress',
        'aws_s3:production',
        'aws_s3:gzipd',
        //'invalidate_cloudfront:index' //won't work right now...doesn't exist yet
    ]);
    grunt.registerTask('cl', ['clean:build']);
    grunt.registerTask('t', ['availabletasks:tasks']);
    grunt.registerTask('lc', ['link-checker:web']);
};
