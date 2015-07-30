module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/javascripts/<%= pkg.name %>.js',
        dest: 'dist/javascripts/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      main: {
	expand: true,
	cwd: 'src',
	src: ['javascripts/*.min.js', 'javascripts/*-min.js', 'fonts/*'],
	dest: 'dist/'
      }
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'src/css',
	  src: ['*.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }]
      }
    },
    processhtml: {
      dist: {
	files: {
	  'dist/products.html': ['src/products.html']
	}
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');

  // Default task(s).
  grunt.registerTask('default', ['uglify', 'copy', 'cssmin', 'processhtml']);

};