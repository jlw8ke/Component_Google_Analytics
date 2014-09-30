var yeoman = require('yeoman-generator'),
spawn = require('child_process').spawn,
path = require('path'),
self

module.exports = yeoman.generators.Base.extend({
	downloadSdk:function() {
		self = this
		var file_loc = path.join(__dirname, "add_analytics_dependency.sh");
		var analytics_dependency = spawn(file_loc)
		analytics_dependency.stdout.on('data', function (data) {
  			console.log('' + data);
		});
		analytics_dependency.stderr.on('data', function (data) {
  			console.log('stderr: ' + data);
		});
	}
})
