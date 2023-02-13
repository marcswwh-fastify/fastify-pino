'use strict'

const rawSymbol = Symbol('pino-raw-res-ref')
const pinoResProto = Object.create({}, {
	statusCode: {
		enumerable: true,
		writable: true,
		value: 0
	},
	responseTime: {
		enumerable: true,	
		writable: true,
		value: ''
	},
	contentType: {
		enumerable: true,
		writable: true,
		value: ''
	},
	contentLength: {
		enumerable: true,
		writable: true,
		value: ''
	}
})

Object.defineProperty(pinoResProto, rawSymbol, {
	writable: true,
	value: {}
})

const resSerializer = (res) => {
	const _res = Object.create(pinoResProto)
	_res.statusCode = res.statusCode
	_res.responseTime = res.getResponseTime()
	_res.contentType = res.getHeader('content-type')
	_res.contentLength = res.getHeader('content-length')
	return _res
}

const mapHttpResponse = (res) => {
	return {
		res: resSerializer(res)
	}
}

module.exports = {
	mapHttpResponse,
	resSerializer
}