'use strict'

const Fastify = require('fastify')
const writeStream = require('flush-write-stream')
const split = require('split2')

// Functions to create a stream object the logger can use
const wStream = (func) => {
	const result = split(JSON.parse)
	result.pipe(writeStream.obj(func))
	return result
}

const delay = (delayInms) => {
	return new Promise(resolve => {
		setTimeout(() => {	resolve(true) }, delayInms)
	})
}

const registerLogger = async (server, options) => {
	const output = []
	const stream = wStream(function (data, enc, cb) {  // eslint-disable-line id-denylist
		output.push(data)
		cb()
	})

	await server.register(require('../lib/index'), { stream: stream, ...options})

	return output
}

const addRoutes = async(server, responseDelay) => {
	server.get('/', async function (request, reply) {
		await delay(responseDelay)
		reply.send({ hello: 'world' })
	})
}

describe('default configurations', () => {
	it('was not registered', async () => {
		const fastify = Fastify()
		expect(fastify.logger).toBeUndefined()
		fastify.close()  
	})

	it('should log default info on startup', async () => {
		const fastify = Fastify()
		const options = {
			name: 'uri:sample:application', 
			level: 'info'
		}
		const output = await registerLogger(fastify, options)
	
		fastify.listen({ port: 8000 }, (err) => {
			expect(output.length).toBeGreaterThanOrEqual(2)

			expect(output[0].embedded).toContain('Server up')
			expect(output[1].embedded).toContain('Server listening')
			fastify.close()
		})

	})
})

describe('logs with server.logger()', () => {

	[ 'trace', 'debug', 'info', 'warn', 'error', 'fatal' ].forEach(level => {
		it('logs correctly at level: ' + level, async() => {
			const fastify = Fastify()

			const options = {
				name: 'uri:sample:application', 
				level: level				
			}

			const output = await registerLogger(fastify, options)

			fastify.listen({port: 8000}, (err) => {
				fastify.logger[level]('Bonsoir, Elliot')
				if([ 'fatal', 'error', 'warn' ].includes(level))  {
					expect(output[0].level).toEqual(level)  // eslint-disable-line jest/no-conditional-expect
					expect(output[0].embedded).toContain('Bonsoir, Elliot')  // eslint-disable-line jest/no-conditional-expect
				} else {
					expect(output[0].embedded).toContain('Server up')  // eslint-disable-line jest/no-conditional-expect
					//(output[1].embedded).toContain('Server listening')  // eslint-disable-line jest/no-conditional-expect
					//expect(output[2].embedded).toContain('Server listening')  // eslint-disable-line jest/no-conditional-expect
					expect(output[1].level).toEqual(level)  // eslint-disable-line jest/no-conditional-expect
					expect(output[1].embedded).toContain('Bonsoir, Elliot')  // eslint-disable-line jest/no-conditional-expect
				}
				fastify.close()
			})
		})
	}) 
})

describe('limiting log output', () => {
	it('log redaction', async() => {
		const fastify = Fastify()

		const options = {
			name: 'uri:sample:application', 
			level: 'info',
			redact: ['req.traceId']				
		}

		const output = await registerLogger(fastify, options)

		await addRoutes(fastify, 0, async () => {
			await fastify.inject({
				method: 'GET',
				url: '/',
				headers: {
					'x-b3-traceid': '1234567890123456'
				}
			})    
			expect(output[1].req.traceId).toEqual('[Redacted]')
		})
  
		fastify.close()
	})
  
	it('ignore func', async() => {
		const fastify = Fastify()

		const options = {
			name: 'uri:sample:application', 
			level: 'info',
			ignoreFunc: (options, request) => {
				if (request.path === '/ignored') {
					return true
				}
				return false
			}			
		}

		const output = await registerLogger(fastify, options)

		await addRoutes(fastify, 0, async () => {
			await fastify.inject({
				method: 'GET',
				url: '/ignored'
			})    
			expect(output[1]).toBeUndefined()
		})

		fastify.close()
	})

	it('ignore paths', async() => {
		const fastify = Fastify()

		const options = {
			name: 'uri:sample:application', 
			level: 'info',
			ignorePaths: ['/ignored']		
		}

		const output = await registerLogger(fastify, options)

		await addRoutes(fastify, 0, async () => {
			await fastify.inject({
				method: 'GET',
				url: '/ignored'
			})  
			expect(output[1]).toBeUndefined()
		})

		fastify.close()
	})

	it('should report responseTime correctly', async() => {
		const fastify = Fastify()

		const options = {
			name: 'uri:sample:application', 
			level: 'info'
		}

		const output = await registerLogger(fastify, options)

		await addRoutes(fastify, 3000, async () => {
			await fastify.inject({
				method: 'GET',
				url: '/'
			})

			expect(output[2].embedded).toContain('Response sent')
			expect(output[2].res.statusCode).toEqual(200)
			expect(output[2].res.responseTime).toBeGreaterThanOrEqual(3000)
		})

		fastify.close()
	})

})
