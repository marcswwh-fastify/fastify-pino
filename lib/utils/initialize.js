'use strict'

// Required modules
const pino = require('pino')
const moment = require('moment')
const stdResponse = require('../serializers/response')
const stdRequest = require('../serializers/request')
const stdErr = require('../serializers/err')

/**
 * TODO: will be deprecated once structuredClone is available in js core
 * Removing lodash dependencies as they are prone to security flaws
 * @param {*} object 
 */
const cloneDeep = (obj) => {
	if(!obj) return obj

	let newObject = Array.isArray(obj) ? [] : {}
	let value 
	for (const key in newObject) {
		value = obj[key]
		newObject[key] = (value === null) ? null : (typeof value === 'object') ? cloneDeep(value) : value
	}
	return newObject
}

const _defaultLogLevel = 'info'
const _detaultMessageKey = 'embedded'
const _defaultEmptyLogValue = ''

const _defaultFormatter = {
	level (label, _number) {
		return { level: label }
	},
	bindings (bindings) {
		return { 
			time: moment().format(),
			name: bindings.name || process.env.NAME || _defaultEmptyLogValue, 
			build: process.env.BUILD_NUMBER || _defaultEmptyLogValue,
			instance: bindings.env_instance || _defaultEmptyLogValue,
			pid: bindings.pid,
			hostname: bindings.hostname
		}
	},
	log (object) {
		return object
	}
}
  
/**
* @todo fix hook to format log message
* @todo Add option to redact log data by regex match
*/
const _hooks = {
	logMethod (inputArgs, method, _level) {
		const getMsgChildBindings = (inputArgs) => ({ message: inputArgs })
		this.child(getMsgChildBindings)
		return method.apply(this, inputArgs)
	} 
}

/**
 * Initialize the logger
 * @param {*} options 
 * @returns 
 */
const initialize = (options) => {

	/** @todo Add validation */
	const { formatters, messageKey, level, prettyPrint, hooks } = options 

	// clone all user options to account for internal mutations
	const _options = Object.assign({},  cloneDeep(options), {
		formatters: formatters || _defaultFormatter, 
		messageKey: messageKey || _detaultMessageKey,
		level: level || _defaultLogLevel,
		prettyPrint: prettyPrint || false,
		timestamp: false, // By default, suppress ootb timestamp as we add our own in our serilization
		hooks: hooks || _hooks, // initialize hooks
		stream: options.stream,
		instance: options.instance // provide your own Pino instnace
	})

	// Initialize serializers for standard, request, response and error
	_options.serializers = _options.serializers || {}
	_options.serializers.res = _options.serializers.res || stdResponse.resSerializer
	_options.serializers.req = _options.serializers.req || stdRequest.reqSerializer
	_options.serializers.err = _options.serializers.err || stdErr.errSerializer

	// If logger passed in the instance option than set it here
	// otherwise initialize new pino logger, default stream is stdout
	const _stream = _options.stream || process.stdout
	const logger = _options.instance || pino(_options, _stream)

	return logger
}

module.exports = initialize