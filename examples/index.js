'use strict'

const fastify = require('fastify')()

/**
 * @example you may want to use trustProxy to ensure on X-Forwarded-* header value is not spoofed when using a proxy
 * 
 * const fastify = require('fastify')({ trustProxy: true })
 * 
 * function myTrustFn(address, hop) {
 *   return address === '127.0.0.1' || hop === 1
 * }
 */

/**
 * @todo update .after to ensure routes are not registered until plugin is loaded
 */
fastify
	.register(require('../lib/index'), { name: 'fastify:sample:application', level: 'info'})
	.after(err => {
		if (err) throw err
	})

fastify.get('/', function (request, reply) {
	request.log.info('Sample info request')
	request.logger.info('Some info about the current request')
	reply.send({ hello: 'world' })
})

fastify.get('/err', function (request, reply) {
	fastify.logger.error('Sample warn request')
	reply.send({ hello: 'error' })
})

fastify.get('/warn', function (request, reply) {
	fastify.logger.warn('Sample warn request')
	reply.send({ hello: 'error' })
})

const start = async() => {
	try {
		await fastify.ready().then(server => {
			server.listen({port: 3000}, (err) => {
				if(err) {
					server.logger.error(err.message)
					process.exit(1)
				}
				process.on('SIGINT', () => server.close())
				process.on('SIGTERM', () => server.close())
			})
		}) 
	} catch (err) {
		console.error(err.stack)
	}
}

start()