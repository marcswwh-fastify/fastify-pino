'use strict'

// This file contains code that we reuse between our tests.
const fastify = require('fastify')

// Automatically build and tear down our instance
const build = () => {
	//function build () {
	const app = fastify({
		bodyLimit: 1048576 * 2,
		logger: false,
		ajv: {
			customOptions: {
				coerceTypes: 'array'
			}
		}
	})
	
	// fastify-plugin ensures that all decorators
	// are exposed for testing purposes, this is
	// different from the production setup
	beforeAll(async () => {
		app.get('/', function (request, reply) {
			reply.send({ hello: 'world' })
		})
		await app.ready()
	})
	
	afterAll(() => app.close())
		
	return app
}
	
module.exports = {
	build
}