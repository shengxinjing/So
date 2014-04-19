'use strict';
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),       // read Config Information
        
         jsdoc : {
            dist : {
                src: "base/**/*.js", 
                dest: "doc/"
            }
        },
     /*     
		watch: {
			options: {
				// livereload: true,
			},
            
			js: {
				files: ['js/*.js'],
				tasks: ['concat', 'uglify'],
				options: {
					spawn: false,
				},
			}       
		} */
	});

	require('load-grunt-tasks')(grunt);
	
	grunt.registerTask('default', ['clean']);
};