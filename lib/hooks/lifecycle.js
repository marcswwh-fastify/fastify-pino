'use strict'

//Required modules
const { logPino } = require('../output/logger')

/**
 * Default behaviour for onReady
 * @param {*} logger - logger instance 
 * @returns 
 */
const onReady = (logger) => (done) => {
	logger.info('Server up')
	done()
}

/**
 * Default behaviour for onRequest
 * @param {*} logger - logger instance
 * @param {*} options 
 * @returns 
 */
const onRequest = (logger, options) => (request, reply, done) => {
	logPino('Request Received', 'info', logger, 'request', options, request) 
	done()
}

/**
 * Default behaviour for onResponse
 * @param {*} logger - logger instnace
 * @param {*} options 
 * @returns 
 */
const onResponse = (logger, options) => (request, reply, done) => {
	logPino('Response Sent', 'info', logger, 'response', options, reply) 
	done()
}

/**
 * Default behaviour for onError
 * @param {*} logger - logger instance
 * @param {*} options 
 * @returns 
 */
const onError = (logger, options) => (request, reply, error, done) => {
	logPino('Error', 'error', logger, 'error', options, error) 
	done()
}

/**
 * Default behaviour for onClose
 * @param {*} logger - logger instance
 * @param {*} options 
 * @returns 
 */
const onClose = (logger, options) => (instance, done) => {
	logPino('Server Shutdown', 'info', logger, 'instance', options, instance)
	done()
}

/**
 * @todo add logic to suppress certain events
 */

//  let ignoredEventTags = {
//     log: '*'
//   }

// if (options.ignoredEventTags) {
//   ignoredEventTags = { ...ignoredEventTags, ...options.ignoredEventTags }
// }

module.exports =  {
	onReady,
	onRequest,
	onResponse,
	onError,
	onClose
}