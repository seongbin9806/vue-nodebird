const middleware = {}

middleware['anonymous'] = require('../middleware/anonymous.js')
middleware['anonymous'] = middleware['anonymous'].default || middleware['anonymous']

middleware['authenticated'] = require('../middleware/authenticated.js')
middleware['authenticated'] = middleware['authenticated'].default || middleware['authenticated']

middleware['pageNavigation'] = require('../middleware/pageNavigation.js')
middleware['pageNavigation'] = middleware['pageNavigation'].default || middleware['pageNavigation']

export default middleware
