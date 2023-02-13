'use strict'

const { getChildBindings } = require('../bindings/children')

/**
 * 
 * @param {*} message 
 * @param {*} level 
 * @param {*} logger 
 * @param {*} type 
 * @param {*} options 
 * @param {*} object 
 * @returns 
 */
const logPino = async(message, level, logger, type, options, object) => {
	if (isLoggingIgnored(options, object)) {
		object.logger = () => null
		return
	}
	if (!object.logger) {
		const childBindings = getChildBindings(type, options, object)
		object.logger = logger.child(childBindings)
	}
	object.logger[level](message)

	return Promise.resolve()
}

// Create array of paths to ignore
/**
 * Create array of paths to ignore
 * @param {*} options 
 * @returns 
 */ 
const ignoreTable = (options) => {
	const table = []

	for (let i = 0; i < options.ignorePaths.length; i++) {  // eslint-disable-line id-length
		table[options.ignorePaths[i]] = true
	}
	return table
}

/**
 * 
 * @param {*} options 
 * @param {*} object 
 * @returns 
 */
const isLoggingIgnored = (options, object) => {
	// an advanced option for ignoring routes
	if(typeof options.ignoreFunc === 'function') {
		return !!options.ignoreFunc(options, object)
	}

	if (options.ignorePaths && object.path && ignoreTable(options)[object.path]) {
		return true
	}

	/** 
	* @deprecated - ignoreTags (use ignorePaths or ignoreFunc instead)
	* 
	* Fastify does not allow for route tagging, unlike Hapi
	* If this is re-introduced we can use this mechanism as an 
	* alternate way of suppressing logs for specific routes
	* 
	* const ignoreTags = options.ignoreTags
	* 
	* if (!ignoreTags) {
	* return false
	* }
	* 
	*/

	return false
}

module.exports = {
	logPino
}