'use strict'

const hooks = require('../../lib/hooks/lifecycle')
const setupLogger = require('../../lib/utils/initialize')
const { logPino } = require('../../lib/output/logger')

jest.mock('../../lib/output/logger', () => ({
	logPino: jest.fn()
}))

describe('Logging hooks', () => {
	it('should write logs for the onReady hook', async () => {
		const options = {}
		const logger = setupLogger(options)
		const consoleSpy = jest.spyOn(process.stdout, 'write')

		const myCallback = function() {
		}

		hooks.onReady(logger)(myCallback)
		await myCallback

		expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/Server up/))
	})

	it('should write logs for the onRequest hook', async () => {

		const options = {}
		const logger = setupLogger(options)
		const request = {}
		let reply

		const myCallback = function() {
		}

		hooks.onRequest(logger, {})(request, reply, myCallback)
		await myCallback

		expect(logPino).toHaveBeenCalledTimes(1)
		expect(logPino).toHaveBeenCalledWith('Request Received', 'info', expect.anything(), 'request', expect.anything(), expect.anything())
	})

	it('should write logs for the onRespose hook', async () => {

		const options = {}
		const logger = setupLogger(options)
		const request = {}
		const reply = {}

		const myCallback = function() {
		}

		hooks.onResponse(logger, {})(request, reply, myCallback)
		await myCallback

		expect(logPino).toHaveBeenCalledTimes(1)
		expect(logPino).toHaveBeenCalledWith('Response Sent', 'info', expect.anything(), 'response', expect.anything(), expect.anything())
	})

	it('should write logs for the onError hook', async () => {

		const options = {}
		const logger = setupLogger(options)
		const request = {}
		const reply = {}
		const error = {}

		const myCallback = function() {
		}

		hooks.onError(logger, {})(request, reply, error, myCallback)
		await myCallback

		expect(logPino).toHaveBeenCalledTimes(1)
		expect(logPino).toHaveBeenCalledWith('Error', 'error', expect.anything(), 'error', expect.anything(), expect.anything())
	})

	it('should write logs for the onClose hook', async () => {

		const options = {}
		const logger = setupLogger(options)
		const instance = {}

		const myCallback = function() {
		}

		hooks.onClose(logger, {})(instance, myCallback)
		await myCallback

		expect(logPino).toHaveBeenCalledTimes(1)
		expect(logPino).toHaveBeenCalledWith('Server Shutdown', 'info', expect.anything(), 'instance', expect.anything(), expect.anything())
	})
	
})