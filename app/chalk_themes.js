var c = require('chalk')

module.exports = {
	info : c.bold.magenta,
	error_light : c.red,
	error : c.bold.red,
	error_bad : c.bold.bgRed,
	warning : c.bold.yellow,
	warning_light : c.yellow,
	success : c.bold.green,
	success_bg : c.bold.bgGreen,
	success_light : c.green
}