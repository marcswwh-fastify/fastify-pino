'use strict'

const inject = require('light-my-request')
const reqserializers = require('../../lib/serializers/request')

describe('Request log serialization', () => {
	it('should serialize defaults correctly', async () => {

		let serialized
		const dispatch = function (req, res) {
			serialized = reqserializers.mapHttpRequest(req)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/' }, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.remoteAddress).toBeDefined()
		expect(serialized.req.remoteAddress).toEqual('127.0.0.1')
		expect(serialized.req.originIP).toBeDefined()
		expect(serialized.req.originIP).toEqual('127.0.0.1')
		expect(serialized.req.method).toBeDefined()
		expect(serialized.req.method).toEqual('GET')
		expect(serialized.req.protocol).toBeDefined()
		expect(serialized.req.protocol).toEqual('http')
		expect(serialized.req.hostname).toBeDefined()
		expect(serialized.req.hostname).toEqual('localhost')
		expect(serialized.req.remotePort).toBeDefined()
		expect(serialized.req.remotePort).toEqual('80')
		expect(serialized.req.remotePort).toBeDefined()
		expect(serialized.req.remotePort).toEqual('80')
		expect(serialized.req.path).toBeDefined()
		expect(serialized.req.path).toEqual('/')
		expect(serialized.req.query).toBeUndefined()
		expect(serialized.req.userAgent).toBeDefined()
		expect(serialized.req.userAgent).toEqual('lightMyRequest')
		expect(serialized.req.traceId).toBeUndefined()
		expect(serialized.req.spanId).toBeUndefined()
	})

	it('should set remoteAddress from req.info if available', async () => {

		let serialized
		const dispatch = function (req, res) {
			req.info = {
				_events: {},
				_eventsCount: {},
				remoteAddress: '127.0.0.2',
				encrypted: true
			}
			serialized = reqserializers.mapHttpRequest(req)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/' }, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.remoteAddress).toBeDefined()
		expect(serialized.req.remoteAddress).toEqual('127.0.0.2')
		expect(serialized.req.originIP).toBeDefined()
		expect(serialized.req.originIP).toEqual('127.0.0.2')
		expect(serialized.req.protocol).toBeDefined()
		expect(serialized.req.protocol).toEqual('https')
	})

	it('should set hostname if present', async () => {

		let serialized
		const dispatch = function (req, res) {
			req = { ...req, hostname: 'hostlocal'}
			serialized = reqserializers.mapHttpRequest(req)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/'}, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.hostname).toBeDefined()
		expect(serialized.req.hostname).toEqual('hostlocal')
	})

	it('should set true ip from req header if present', async () => {

		let serialized
		const dispatch = function (req, res) {
			serialized = reqserializers.mapHttpRequest(req)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/', headers: { 'true-client-ip': '111.222.333' }}, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.originIP).toBeDefined()
		expect(serialized.req.originIP).toEqual('111.222.333')
	})

	it('should set true ip from req.info present', async () => {

		let serialized
		const dispatch = function (req, res) {
			req = { ...req, hostname: 'https'}
			req.info = {
				_events: {},
				_eventsCount: {},
				remoteAddress: '127.0.0.2',
				encrypted: true
			}
			const reply = 'Hello World'
			serialized = reqserializers.mapHttpRequest(req)
			res.writeHead(200, { 'Content-Type': 'text/plain', 'Content-Length': reply.length })
			res.end(reply)
		}

		inject(dispatch, { method: 'get', url: '/', headers: { 'true-client-ip': '111.222.333' }}, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.originIP).toBeDefined()
		expect(serialized.req.originIP).toEqual('111.222.333')	
	})

	it('should set query from req.raw if present', async () => {

		let serialized
		const dispatch = function (req, res) {
			req.raw = {
				query: 'this'
			}
			
			serialized = reqserializers.mapHttpRequest(req)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/'}, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.query).toBeDefined()
		expect(serialized.req.query).toEqual('this')	
	})

	it('should set header from req.raw if present', async () => {

		let serialized
		const dispatch = function (req, res) {

			req.headers['host'] = undefined
			req = { ...req, raw: { hostname: 'hostlocal'}}

			serialized = reqserializers.mapHttpRequest(req)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/'}, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.hostname).toBeDefined()
		expect(serialized.req.hostname).toEqual('hostlocal')
	})
	
	it('should set path from req.raw if present', async () => {

		let serialized
		const dispatch = function (req, res) {

			req.url = undefined
			req = { ...req, raw: { url: 'hostlocal'}}

			serialized = reqserializers.mapHttpRequest(req)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/'}, () => {})

		expect(serialized.req).toBeDefined()
		expect(serialized.req.path).toBeDefined()
		expect(serialized.req.path).toEqual('hostlocal')	
	})
})