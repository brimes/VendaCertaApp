
class Request {

	constructor () {
		this.url = ''
		this.body = null
		this.params = {}
		this.method = 'GET'
		this.headers = {
			'Content-Type': 'application/json'
		}
	}

	static get ACCEPTED() {
	    return '202';
	}

	static get OK() {
	    return '200';
	}

	setUrl (url) {
		this.url = url
	}

	setMethod (method) {
		this.method = method
	}

	setParams (params) {
		this.params = params
	}

	setBody (content) {
		this.body = content
	}

	addHeader (name, value) {
		this.headers[name] = value
	}

	async response() {
		let body = null;
		if (this.method != 'GET' && this.body === null) {
			this.body = JSON.stringify(this.params)
		}
		console.log(this.url);
		console.log(this.body);
		let response = await fetch(this.url, {
		  method: this.method,
		  headers: this.headers,
		  body: this.body
		});
		console.log(response);
		return response;
	}

}

module.exports = Request;
