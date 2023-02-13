'use strict'

const rawSymbol = Symbol('pino-raw-err-ref')
const pinoErrProto = Object.create({}, {
	type: {
		enumerable: true,
		writable: true,
		value: undefined
	},
	message: {
		enumerable: true,
		writable: true,
		value: undefined
	},
	stack: {
		enumerable: true,
		writable: true,
		value: undefined
	}
})

Object.defineProperty(pinoErrProto, rawSymbol, {
	writable: true,
	value: {}
})

/**
 * The default way errors will be serialized
 * @param {*} err 
 * @returns 
 */
const errSerializer = (err) => {
	if(!(err instanceof Error)) {
		return err
	}
	const _err = Object.create(pinoErrProto)
	_err.type = err.name
	_err.message = err.message
	_err.stack = err.stack

	return _err
}

const mapHttpError = (err) => {
	return {
		err: errSerializer(err)
	}
}

module.exports = {
	mapHttpError,
	errSerializer
}