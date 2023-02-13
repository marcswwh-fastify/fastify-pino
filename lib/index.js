'use strict'

// #region Required Modules
const fp = require('fastify-plugin')
const { onRequest, onResponse, onError, onClose, onReady } = require('./hooks/lifecycle')
const initialize = require('./utils/initialize')
 
// #endregion
 
// #region Primary Plugin
const fastifyPino = (fastify, options, done) => {
	const logger = initialize(options)
	fastify.log = logger

	// Decorate the logger to be accessible
	fastify.decorate('logger', logger)
 
	// Add Default Lifecycle Hooks
	fastify.addHook('onReady', onReady(logger))
	fastify.addHook('onClose', onClose(logger, options))
	fastify.addHook('onRequest', onRequest(logger, options))
	fastify.addHook('onResponse', onResponse(logger, options))
	fastify.addHook('onError', onError(logger, options))

	done()
}
 
// #endregion
 
module.exports = fp(fastifyPino, {
	fastify: '>= 3.0.0',
	name: 'fastify-pino'
})