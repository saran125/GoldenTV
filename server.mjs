import Express         from 'express';
import ExpHandlebars   from 'express-handlebars';
import ExpSession      from 'express-session';
import BodyParser      from 'body-parser';
import CookieParser    from 'cookie-parser';

import MethodOverrides from 'method-override';
import path            from 'path';
import favicon from 'serve-favicon';
import Flash           from 'connect-flash';
import FlashMessenger  from 'flash-messenger';

import Handlebars      from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

const Server = Express();
const Port   = process.env.PORT || 3000;

/**
 * Template Engine
 * You may choose to use Nunjucks if you want to recycle everything from your old project.
 * Strongly recommended. However, do note the minor differences in syntax. :)
 * Trust me it saves your time more.
 * https://www.npmjs.com/package/express-nunjucks
 */
Server.set('views',       'templates');		//	Let express know where to find HTML templates
Server.set('view engine', 'handlebars');	//	Let express know what template engine to use
Server.engine('handlebars', ExpHandlebars({
	handlebars:     allowInsecurePrototypeAccess(Handlebars),
	defaultLayout: 'main'
}));
//	Let express know where to access static files
//	Host them at locahost/public
Server.use("/public", Express.static('public'));
Handlebars.registerHelper("noop", function (options) {
	return options.fn(this);
});
const __dirname = path.resolve();
Server.use(Express.static(path.join(__dirname, "public")));
Server.use(favicon(path.join(__dirname, "public", "img", "goldentvlogo.png")));
/**
 * Form body parsers etc
 */
Server.use(BodyParser.urlencoded( { extended: false }));
Server.use(BodyParser.json());
Server.use(CookieParser());
Server.use(MethodOverrides('_method'));
import { initialize_passport } from "./utils/passport.mjs";

/**
 * Initialize passport
 **/
initialize_passport(Server);

import { SessionStore, initialize_database } from './data/database.mjs'
/**
 * Express Session
 */
 Server.use(ExpSession({
	name:   'example-app',
	secret: 'random-secret',
	store:   SessionStore,
	resave:  false,
	saveUninitialized: false
}));

/**
 * Initialize database
 */
initialize_database(false);

/**
 * Flash Messenger 
 */
Server.use(Flash());
Server.use(FlashMessenger.middleware);

//-----------------------------------------

//-----------------------------------------

/**
 * TODO: Setup global contexts here. Basically stuff your variables in locals
 */
Server.use(function (req, res, next) {
	res.locals.user = req.user || null;
	next();
});


import Routes from './routes/main.mjs'
Server.use("/", Routes);

/**
 * DEBUG USAGE
 * Use this to check your routes
 * Prints all the routes registered into the application
**/
import { ListRoutes } from './utils/routes.mjs'
console.log(`=====Registered Routes=====`);
ListRoutes(Server._router).forEach(route => {
	console.log(`${route.method.padStart(8)} | /${route.path}`);
});
console.log(`===========================`);

/**
 * Start the server in infinite loop
 */
Server.listen(Port, function() {
	console.log(`Server listening at port ${Port}`);
});
