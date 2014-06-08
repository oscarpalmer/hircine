module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    coffee: {
      compile: {
        files: {
          "dist/ender.js":           "src/ender.coffee",
          "dist/<%= pkg.name %>.js": "src/<%= pkg.name %>.coffee"
        }
      }
    },
    uglify: {
      dist: {
        files: {
          "dist/<%= pkg.name %>.min.js": ["dist/<%= pkg.name %>.js"]
        }
      }
    },
    jshint: {
      files: ["dist/<%= pkg.name %>.js"]
    }
  });

  grunt.loadNpmTasks("grunt-contrib-coffee");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("default", ["coffee", "jshint", "uglify"]);
};