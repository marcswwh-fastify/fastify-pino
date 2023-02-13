'use strict'

const children = require('../../lib/bindings/children')

describe('Request bindings', () => {
	it('should create a request binding object', async () => {
		const obj = {
			test: 'object'
		}
		const options = {}
		const reqBindings = children.getChildBindings('request', options, obj)

		expect(reqBindings).toBeDefined()
		expect(reqBindings.req).toBeDefined()		
	})

	it('should accept a predefined request binding object', async () => {
		const obj = {
			test: 'object'
		}

		const getChildBindings = () => {
			return obj
		}
		const options = {}
		options.getRequestChildBindings = getChildBindings
		const reqBindings = children.getChildBindings('request', options, obj)

		expect(reqBindings).toBeDefined()
	})	

})

describe('Response bindings', () => {
	it('should create a response binding object', async () => {
		const obj = {
			test: 'object'
		}
		const options = {}
		const resBindings = children.getChildBindings('response', options, obj)

		expect(resBindings).toBeDefined()
		expect(resBindings.res).toBeDefined()		
	})

	it('accept a predefined response binding object', async () => {
		const obj = {
			test: 'object'
		}

		const getChildBindings = () => {
			return obj
		}
		const options = {}
		options.getResponseChildBindings = getChildBindings
		const resBindings = children.getChildBindings('response', options, obj)

		expect(resBindings).toBeDefined()
	})	
})

describe('Error bindings', () => {
	it('should create a error binding object', async () => {
		const obj = {
			test: 'object'
		}
		const options = {}
		const errBindings = children.getChildBindings('error', options, obj)

		expect(errBindings).toBeDefined()
		expect(errBindings.err).toBeDefined()
	})	

	it('accept a predefined error binding object', async () => {
		const obj = {
			test: 'object'
		}

		const getChildBindings = () => {
			return obj
		}
		const options = {}
		options.getErrorChildBindings = getChildBindings
		const errBindings = children.getChildBindings('error', options, obj)

		expect(errBindings).toBeDefined()
	})
})

describe('Instance bindings', () => {
	it('should create a instance binding object', async () => {
		const obj = {
			test: 'object'
		}
		const options = {}
		const insBindings = children.getChildBindings('instance', options, obj)

		expect(insBindings).toBeDefined()
		expect(insBindings.instance).toBeDefined()	
	})

	it('accept a predefined instance binding object', async () => {
		const obj = {
			test: 'object'
		}

		const getChildBindings = () => {
			return obj
		}
		const options = {}
		options.getInstanceChildBindings = getChildBindings
		const insBindings = children.getChildBindings('instance', options, obj)

		expect(insBindings).toBeDefined()
	})
})

describe('Unknown bindings', () => {
	it('should fail if the binding object is not supported', async () => {
		const obj = {
			test: 'object'
		}
		const options = {}

		expect(() => {
			(children.getChildBindings('unknown', options, obj))
		}).toThrow('getChildBindings type unknown not supported')	
	})
})