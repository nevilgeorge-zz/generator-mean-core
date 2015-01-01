// app/index.js 
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');
	},

	// Prompt users for options
	prompting: function () {
		var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
    	'Welcome to the super ' + chalk.bgRed('mean-core') + ' generator!'
    	));

    // create array of questions that need to be prompted to the user
    var prompts = [{
    	type: 'input',
    	name: 'appName',
    	message: 'What would you like to call this MEAN app?',
    	default: 'MEANstack app'
    },
    {
    	type: 'confirm',
    	name: 'addBootstrap',
    	message: 'Would you like to add Boostrap to your project?',
    	default: true
    },
    {
    	type: 'confirm',
    	name: 'useSass',
    	message: 'Would you like to use Sass in your project?',
    	default: false
    },
    {
    	type: 'checkbox',
    	name: 'modules',
    	message: 'Which AngularJS modules would you like to add to your project?',
    	choices: [
    	{
    		value: 'animateModule',
    		name: 'angular-animate.js',
    		checked: true
    	},
    	{
    		value: 'ariaModule',
    		name: 'angular-aria.js',
    		checked: false
    	},
    	{
    		value: 'cookiesModule',
    		name: 'angular-cookies.js',
    		checked: true
    	},
    	{
    		value: 'resourceModule',
    		name: 'angular-resource.js',
    		checked: true
    	},
    	{
    		value: 'messagesModule',
    		name: 'angular-messages.js',
    		checked: false
    	},
    	{
    		value: 'routeModule',
    		name: 'angular-route.js',
    		checked: true
    	},
    	{
    		value: 'sanitizeModule',
    		name: 'angular-sanitize.js',
    		checked: true
    	},
    	{
    		value: 'touchModule',
    		name: 'angular-touch.js',
    		checked: true
    	}
    	]
    }
    ];

    this.prompt(prompts, function (props) {

    	// define properties of the generator from the prompts' responses
    	this.appName = props.appName;
    	this.addBootstrap = props.addBootstrap;
    	this.useSass = props.useSass;

    	// check if the user requires 
    	function needsModule(module) {
    		return props.modules.indexOf(module) !== -1;
    	};

    	this.animateModule = needsModule('animateModule');
    	this.ariaModule = needsModule('ariaModule');
    	this.cookiesModule = needsModule('cookiesModule');
    	this.messagesModule = needsModule('messagesModule');
    	this.resourceModule = needsModule('resourceModule');
    	this.routeModule = needsModule('routeModule');
    	this.sanitizeModule = needsModule('sanitizeModule');
    	this.touchModule = needsModule('touchModule');

    	// initialize an array to hold the names of all the angular modules that are to be added to the project
    	var angularModules = [];

    	if (this.animateModule) {
    		angularModules.push("'ngAnimate'");
    	}

    	if (this.ariaModule) {
    		angularModules.push("'ngAria'");
    	}

    	if (this.cookiesModule) {
    		angularModules.push("'ngCookies'");
    	}

    	if (this.messagesModule) {
    		angularModules.push("'ngMessages'");
    	}

    	if (this.resourceModule) {
    		angularModules.push("'ngResource'");
    	}

    	if (this.routeModule) {
    		angularModules.push("'ngRoute'");
    	}

    	if (this.sanitizeModule) {
    		angularModules.push("'ngSanitize'");
    	}

    	if (this.touchModule) {
    		angularModules.push("'ngTouch'");
    	}

    	this.angularDependencies = angularModules;

    	done();
    }.bind(this));
	},

	// Save configurations and configure the project files
	configuring: {

	},

	// write/ copy generator specific files
	writing: {
		createFolders: function() {
			this.mkdir('public');
			this.mkdir('public/images');
		},

		app: function () {
			this.fs.copy(
				this.templatePath('_package.json'),
				this.destinationPath('package.json')
				);
			this.fs.copy(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json')
				);
		},

		projectfiles: function () {
			this.fs.copy(
				this.templatePath('editorconfig'),
				this.destinationPath('.editorconfig')
				);
			this.fs.copy(
				this.templatePath('jshintrc'),
				this.destinationPath('.jshintrc')
				);
			// this.fs.copy(
			// 	this.templatePath('_Gruntfile.js'),
			// 	this.destinationPath('Gruntfile.js')
			// 	);
			
		}
	},

	// install bower and npm dependencies
	install: function () {
		this.installDependencies({
			skipInstall: this.options['skip-install']
		});
	},

	// say bye
	end: function() {
		//this.log(yosay('Thanks for using Yeoman! Happy hacking!'));
	}
});
