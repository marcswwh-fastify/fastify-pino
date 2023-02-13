'use strict'

/**
 * 
 * @param {LogType} type 
 * @param {any} options 
 * @param {any} object 
 * @returns 
 */
const getChildBindings = (type, options, object) => {
	const getRequestChildBindings = options.getRequestChildBindings ? options.getRequestChildBindings : (request) => ({ req: request })
	const getResponseChildBindings = options.getResponseChildBindings ? options.getResponseChildBindings : (response) => ({ res: response })    
	const getErrorChildBindings = options.getErrorChildBindings ? options.getErrorChildBindings : (error) => ({ err: error }) 
	const getInstanceChildBindings = options.getInstanceChildBindings ? options.getInstanceChildBindings : (instance) => ({ instance })
	switch (type) {
		case 'request':
			return getRequestChildBindings(object)
		case 'response':
			return getResponseChildBindings(object)
		case 'error':
			return getErrorChildBindings(object)
		case 'instance':
			return getInstanceChildBindings(object)
		default:
			throw new Error(`getChildBindings type ${type} not supported`)
	}
}

module.exports = {
	getChildBindings
}