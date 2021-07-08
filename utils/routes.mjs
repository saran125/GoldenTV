import Express from 'express'

/**
 * Retreive a list of routes registered in the router stack
 * @param {Express.IRouter} router The target router to retrieve from
 * @returns {[{method: string, path:string}]}
 */
export function ListRoutes(router) {
	return router.stack.map(ListRoute.bind(null, [], []))
						.flat(2)
						.filter(route => route != null);
}

/**
 * Recursive function to accumulate all paths registered in system
 * @param {[]} routes 		Accumulated routes
 * @param {[]} pathParent 	The parent path
 * @param {Express.IRouter} layer 	The current middleware layer
 * @returns {[{method: string, path:string}]}
 */
function ListRoute(routes = [], pathParent = [], layer) {
	if (layer.route)
		return routes.concat(layer.route.stack.map(ListRoute.bind(null,  routes, pathParent.concat(ParseRoute(layer.route.path))))).flat();
	else if (layer.name === 'router' && layer.handle.stack) 
		return routes.concat(layer.handle.stack.map(ListRoute.bind(null, routes, pathParent.concat(ParseRoute(layer.regexp))))).flat();
	else if (layer.method)
		return {
			method: layer.method.toUpperCase(),
			path  : pathParent.concat(ParseRoute(layer.regexp)).filter(Boolean).join('/')
		};
	else
		return null;
}

/**
 * Parse registered routes to human readable format
 * @param {Express.IRoute}   route 
 * @returns {string} String route path relative to parent
 */
function ParseRoute(route) {
	if (typeof route === 'string') {
		return route.split('/');
	}
	else if (route.fast_slash) {
		return '';
	}
	else {
		var match = route.toString()
		.replace('\\/?', '')
		.replace('(?=\\/|$)', '$')
		.match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
		return match? match[1].replace(/\\(.)/g, '$1').split('/'): '<complex:' + route.toString() + '>';
	}
}