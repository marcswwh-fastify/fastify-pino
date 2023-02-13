'use strict'

const inject = require('light-my-request')
const errserializers = require('../../lib/serializers/err')

describe('Error log serialization', () => {
	it('should serialize defaults correctly', async () => {
		let serialized
		const dispatch = function (req, res) {
			const err = new Error('hey')
			serialized = errserializers.mapHttpError(err)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/' }, () => {})
		
		expect(serialized.err).toBeDefined()
		expect(serialized.err.type).toBeDefined()
		expect(serialized.err.type).toEqual('Error')
		expect(serialized.err.message).toBeDefined()
		expect(serialized.err.message).toEqual('hey')
		expect(serialized.err.stack).toBeDefined()
	})

	it('should serialize objects correctly', async () => {
		let serialized
		const dispatch = function (req, res) {
			const err = new String('hey')
			serialized = errserializers.mapHttpError(err)
			res.end()
		}

		inject(dispatch, { method: 'get', url: '/' }, () => {})
		
		expect(serialized.err).toBeDefined()
		expect(serialized.err).toBeInstanceOf(String)
	})

})