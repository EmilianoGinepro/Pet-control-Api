const jwt = require('jsonwebtoken')
const { TOKEN_PASSWORD } = require('../config/config')

const tokenFunction = (autorizacion) => {
    let token = null
    if (autorizacion && autorizacion.toLowerCase().startsWith('bearer')) {
        token = autorizacion.substring(7)
    }

    let decodedToken = {}
    try {
        decodedToken = jwt.verify(token, TOKEN_PASSWORD)
    }
    catch (err) {
        console.log(err)
    }

    if (!token || !decodedToken) {
        res.json('token invalido')
        console.log('token invalido')
    }

    return decodedToken.id
}

module.exports = { tokenFunction }