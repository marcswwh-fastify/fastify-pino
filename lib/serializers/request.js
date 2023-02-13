'use strict'

const rawSymbol = Symbol('pino-raw-req-ref')

const pinoReqProto = Object.create({}, {
	remoteAddress: {
		enumerable: true,
		writable: true,
		value: ''
	},
	originIP: {
		enumerable: true,
		writable: true,
		value: ''
	},
	method: {
		enumerable: true,
		writable: true,
		value: ''
	},
	protocol: {
		enumerable: true,
		writable: true,
		value: ''
	},
	hostname: {
		enumerable: true,
		writable: true,
		value: ''
	},
	remotePort: {
		enumerable: true,
		writable: true,
		value: ''
	},
	userAgent: {
		enumerable: true,
		writable: true,
		value: ''
	},
	path: {
		enumerable: true,
		writable: true,
		value: ''
	},
	query: {
		enumerable: true,
		writable: true,
		value: ''
	},
	params: {
		enumerable: true,
		writable: true,
		value: ''
	},
	traceId: {
		enumerable: true,
		writable: true,
		value: ''
	},
	spanId: {
		enumerable: true,
		writable: true,
		value: ''
	}
})

Object.defineProperty(pinoReqProto, rawSymbol, {
	writable: true,
	value: {}
})

const reqSerializer = (req) => {
	const connection = req.info || req.socket
	const proto = connection.encrypted ? 'https' : 'http'
	const hostName = req.hostname || (req.headers && req.headers['host']) || (req.raw && req.raw.hostname)
	const hostnameStr = hostName.substr(0, hostName.indexOf(':') === -1 ? hostName.length : hostName.indexOf(':'))
	const port = (connection && connection.remotePort) || (hostName.indexOf(':') > -1) ? hostName.substr(hostName.indexOf(':') + 1) : ''
	const _req = Object.create(pinoReqProto)
	_req.remoteAddress = connection && connection.remoteAddress
	_req.originIP = (req.headers && req.headers['true-client-ip']) || (connection && connection.remoteAddress)
	_req.method = req.method
	_req.protocol = req.protocol || proto
	_req.hostname = hostnameStr
	_req.remotePort = port
	_req.path = req.path || (req.url && (req.url.path || req.url)) || (req.raw && req.raw.url)
	_req.params = req.params || (req.raw && req.raw.params)
	_req.query = req.query || (req.raw && req.raw.query)
	_req.userAgent = req.headers && req.headers['user-agent']
	_req.traceId = req.headers && req.headers['x-b3-traceid']
	_req.spanId = req.headers && req.headers['x-b3-spanid']
	return _req
}

const mapHttpRequest = (req) => {
	return {
		req: reqSerializer(req)
	}
}

module.exports = {
	mapHttpRequest,
	reqSerializer
}