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
                  paths: ["node_modules/axis/",
                          //"node_modules/jeet/stylus/jeet",
                          "node_modules/jeet/stylus/",
                          "node_modules/rupture/",
                  ],
                  urlfunc: "embedurl",
              },
              files: {
                  "static/css/s.css": "styl/s.styl"
              }
          }
        },
         shell: { //me with ascidoctor.js
          build: {
              command: function () {
                  comm = "hugo"
                  return comm
              }
          }
         },
        cssmin: {
            options: {
                report: 'min'
            },
            main: {
                expand: true,
                cwd: 'public/',
                src: '**/*.css',
                dest: 'public/'
            }
        },
        //WARNING: never put this in a git repo dir... put it outside the repo!
        aws: grunt.file.readJSON("../../../grunt-aws-SECRET.json"),
        //tell grove we want this bucket to be in > 1 AZ...yes?
        //need another bucket for staging...doesn't need DNS (or ?)...it can be in 1 AZ
        //fork hugo to build asciidoctor and call it...Boris!
        aws_s3: {
            dev: {
                options: {
                    accessKeyId: "<%= aws.secret %>", 
                    secretAccessKey: '<%= aws.key %>',
                    bucket: "<%= aws.bucket %>",
                    region: "us-east-1",
                    access: "public-read",
                    progress: "progressBar",
                    streams: true,
                    debug: false,
                    uploadConcurrency: 30,
                    params: {
                        "CacheControl": "max-age=63072000, public",
                        "Expires": new Date(Date.now() + 6.31139e10),//.toUTCString(),
                        //"ContentEncoding": "gzip"
                        
                    }
                },
                files: [
                    { expand: true, dest: '.', cwd: 'public/', src: ['**'], action: 'upload', differential: true },
                    { dest: '/', cwd: 'public/', action: 'delete', differential: true }
                ]
            }
        },
        compress: {
            main: {
                options: { mode: 'gzip'},
                expand: true,
                cwd: "public/",
                src: ["**/*"],
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                expand: true,
                cwd: 'public',
                src: ['**/*.html'],
                dest: 'public/'
            }
        },
        concat: {
          css: {
              src: ['static/css/s.css','bower_components/icono/icono.min.css', "node_modules/grunt-highlight/node_modules/highlight.js/styles/tomorrow.css"],
              dest: 'static/css/s.css'
          },
      },
  highlight: {
    task: {
      options: {},
        expand: true,
        cwd: 'public',
        src: ["**/*.html"],
        dest: "public/"
    }
  },
  cacheBust: {
    options: {
        encoding: 'utf8',
        algorithm: 'sha1',
        length: 16,
        baseDir: "public/"
        
    },
      assets: {
          expand: true,
          cwd: "public",
          src: ["**/*.html"],
          dest: "public/"
    }
  },
      availabletasks: {     
          tasks: {}
      },
      clean: {
          build: ["public/*"],
      },
  });

    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
    grunt.registerTask('cl', ['clean:build']);
    grunt.registerTask("css", ["stylus","concat", "cssmin"]);
    grunt.registerTask('dev', ['clean:build', 'css', 'shell', 'highlight']);
    grunt.registerTask("pub", ['clean:build', "css", "shell", "cacheBust", 'highlight', "htmlmin", 'aws_s3']);
};
