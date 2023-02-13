'use strict'

const Fastify = require('fastify')
const resserializers = require('../../lib/serializers/response')

describe('Reqponse log serialization', () => {
	it('should serialize defaults correctly', async () => {

		const fastify = Fastify()
		let serialized
		const handler  = (req, res) => {
			serialized = resserializers.mapHttpResponse(res)
			res.end()
		}
 
		fastify.get('/en', { config: { output: 'hello world!' } }, handler)

		await fastify
			.inject()
			.get('/en')
			.end()

		expect(serialized.res).toBeDefined()
		expect(serialized.res.statusCode).toBeDefined()
		expect(serialized.res.statusCode).toEqual(200)		
 
		fastify.close()
	})
})