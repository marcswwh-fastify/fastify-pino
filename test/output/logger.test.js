'use strict'

const initialize = require('../../lib/utils/initialize')
const split = require('split2')
const writeStream = require('flush-write-stream')
const logger = require('../../lib/output/logger')

jest.mock('../../lib/bindings/children', () => ({
	getChildBindings: jest.fn()
		.mockImplementation((type, options, object) => { return { req: object } })
}))

const wStream = (func) => {
	const result = split(JSON.parse)
	result.pipe(writeStream.obj(func))
	return result
}

describe('Writing logs', () => {
	it('should write logs to the specified stream', async () => {
		const output = []
		const stream = wStream(function (data, enc, cb) { // eslint-disable-line id-denylist
			output.push(data)
			cb()
		})

		const options = {
			stream: stream,
			level: 'info',
			name: 'uri:sample:application'
		}
		
		const instance = initialize(options)
		
		const opts = {}
		const request = { 
			logger: instance
		}
		logger.logPino('Request Received', 'info', instance, 'request', opts, request) 

		expect(output.length).toEqual(1)
		expect(output[0].embedded).toContain('Request Received')
	})

	it('should not write logs for ignored paths', async () => {
		const output = []
		const stream = wStream(function (data, enc, cb) { // eslint-disable-line id-denylist
			output.push(data)
			cb()
		})

		const options = {
			stream: stream,
			level: 'info',
			name: 'uri:sample:application'
		}
		
		const instance = initialize(options)

		const opts = { ignorePaths: ['/ignored'] }
		const request = { 
			logger: instance,
			path: '/ignored'
		}
		logger.logPino('Request Received', 'info', instance, 'request', opts, request) 

		expect(output.length).toEqual(0)
	})

	it('should write logs for child bindings', async () => {
		const output = []
		const stream = wStream(function (data, enc, cb) { // eslint-disable-line id-denylist
			output.push(data)
			cb()
		})

		const options = {
			stream: stream,
			level: 'info',
			name: 'uri:sample:application'
		}
		
		const instance = initialize(options)
		
		const opts = { }
		const request = {
			info: {
				encrypted: true,
				remoteAddress: '127.0.0.1'
			},
			method: 'GET',
			protocol: 'https',
			path: '/',
			hostname: 'host',
			params: '',
			query: '' 
		}
		logger.logPino('Request Received', 'info', instance, 'request', opts, request) 

		expect(output.length).toEqual(1)
		expect(output[0].embedded).toContain('Request Received')

	})


	it('should not write logs for ignore functions', async () => {
		const output = []
		const stream = wStream(function (data, enc, cb) { // eslint-disable-line id-denylist
			output.push(data)
			cb()
		})

		const options = {
			stream: stream,
			level: 'info',
			name: 'uri:sample:application'
		}
		
		const instance = initialize(options)

		const opts = { 
			ignoreFunc: (options, request) => {
				if (request.path === '/ignored') {
					return true
				}
				return false
			}
		}
		const request = { 
			logger: instance,
			path: '/ignored'
		}
		logger.logPino('Request Received', 'info', instance, 'request', opts, request) 

		expect(output.length).toEqual(0)
	})	

})