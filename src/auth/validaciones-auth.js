const checkAutorizacion = (autorizacion) => {
    let res = false

    if (autorizacion == undefined || !autorizacion.startsWith('bearer ')) {
        res = false
    } else {
        res = true
    }
    return res
}

module.exports = { checkAutorizacion }