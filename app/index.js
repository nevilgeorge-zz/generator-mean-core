// app/index.js 
'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

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

    	// format module list nicely
    	if (angularModules.length) {
    		this.angularDependencies = '\n    ' + angularModules.join(',\n    ') + '\n  ';
            this.bowerModules = angularModules;
    	}

    	done();
    }.bind(this));
	},

	// Save configurations and configure the project files
	configuring: {
		setAppName: function() {
			this.appName = this._.camelize(this._.slugify(this._.humanize(this.appName)));
		},
        aggregateNpmModules: function() {
            this.npmModules = ['body-parser', 'cookie-parser', 'express', 'method-override', 'mongoose'];
        },
        aggregateBowerModules: function() {
            // add bootstrap through bower if required by user
            if (this.addBootstrap) {
                this.bowerModules.push('bootstrap');
            }
        }
	},

	// write/ copy generator specific files
	writing: {
		app: function () {
			this.fs.copyTpl(
				this.templatePath('_package.json'),
				this.destinationPath('package.json'),
				{
					appName: this.appName
				}
				);
			this.fs.copyTpl(
				this.templatePath('_bower.json'),
				this.destinationPath('bower.json'),
				{
					appName: this.appName
				}
				);
		},

		// copy all static public files that don't change with respect to user preferences
		staticPublicFiles: function() {
			this.directory('public', 'public');
		},

		// add index file to the "public" directory, passing in the appName and whether or not ngRoute is being used
		indexFile: function() {
			this.fs.copyTpl(
				this.templatePath('public/index.html'),
				this.destinationPath('public/index.html'),
				{
					appName: this.appName,
					ngRoute: this.routeModule
				}
				)
		},

		// create intitial JavaScript files
		jsTemplates: function() {
			// create app.js with parameters file and copy to public/scripts
			this.fs.copyTpl(
				this.templatePath('js_templates/app.js'),
				this.destinationPath('public/scripts/app.js'),
				{
					appName: this.appName,
					moduleList: this.angularDependencies,
					ngRoute: this.routeModule
				}
				);

			// create sample controller, MainCtrl, and copy to the correct location
			this.fs.copyTpl(
				this.templatePath('js_templates/controller.js'),
				this.destinationPath('public/scripts/controllers/main.js'),
				{
					appName: this.appName,
					controllerName: 'Main'
				}
				);
		},

		// copy backend files into the new app
		serverFiles: function() {
			// copy main server file, server.js, passing in the app name
			this.fs.copyTpl(
				this.templatePath('server.js'),
				this.destinationPath('server.js'),
				{
					appName: this.appName
				}
				);

			// copy the server folder into the app directory
			this.directory('server', 'server');

		},

		// copy project-related files
		projectFiles: function () {
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
	install: {
        npmDependencies: function() {
            if (!this.options['skip-install']) {
                this.npmInstall(this.npmModules, { 'save': true });
            }
        },

        bowerDependencies: function() {
            if (!this.options['skip-install']) {
                this.bowerInstall(this.bowerModules, { 'save': true });
            }
        }
	},

	// say bye
	end: function() {
		//this.log(yosay('Thanks for using Yeoman! Happy hacking!'));
	}
});
