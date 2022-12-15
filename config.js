const env = 'production'

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
	production:{	
		APIKey : 'SWr2-Et9S2yo8cCLbzCm2g',
		APISecret : 'l3QprkWUDsBsDjY7NJSd6o4uOOY1HTLPNcCk'
	}
};

module.exports = config[env]
