const { db } = require('../db/connect')
const { TYPES } = require('mssql')
const { checkAutorizacion } = require('../auth/validaciones-auth')

//create
const postControl = async (req, res) => {

    const { body, params } = req
    const { nombre, sintomas, fecha, proximo_control, observaciones_vet } = body
    const { id } = params

    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            await db.request()
                .input('idMascota', TYPES.Int, id)
                .input('nombre', TYPES.VarChar(50), nombre)
                .input('sintomas', TYPES.VarChar(300), sintomas)
                .input('fecha', TYPES.DateTime, fecha)
                .input('proximo_control', TYPES.DateTime || null, proximo_control)
                .input('observaciones_vet', TYPES.VarChar(300), observaciones_vet)
                .query('INSERT INTO control (idMascota, nombre, sintomas,fecha, proximo_control, observaciones_vet) VALUES (@idMascota,@nombre, @sintomas, @fecha, @proximo_control, @observaciones_vet)')

            res.status(202).send('Control ingresado')
            console.log('Control ingresado')

            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

//find by id
const getControl = async (req, res) => {

    const { params } = req
    const { id } = params

    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            const findControl = await db.request()
                .input('id', TYPES.Int, id)
                .query("SELECT id, idMascota, nombre, sintomas, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet  FROM control WHERE idMascota=@id")
            res.status(202).json(findControl.recordset)
            console.log('Control encontrado');
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}
//Find by Nombre
const findByNombre = async (req, res) => {

    const { body, params } = req
    const { id } = params
    const { nombre } = body

    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            const findNombre = await db.request()
                .input('idMascota', TYPES.Int, id)
                .input('nombre', TYPES.VarChar(50), nombre)
                .query("select id, idMascota, nombre, sintomas, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet from control where nombre LIKE '%' + @nombre + '%' and idMascota=@idMascota")
            res.status(202).json(findNombre.recordset)
            console.log('Control por nombre encontrado');
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

//Find by Sintomas
const findBySintomas = async (req, res) => {

    const { body, params } = req
    const { id } = params
    const { sintomas } = body

    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            const findSintomas = await db.request()
                .input('idMascota', TYPES.Int, id)
                .input('sintomas', TYPES.VarChar(50), sintomas)
                .query("select id, idMascota, nombre, sintomas, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet from control where sintomas LIKE '%' + @sintomas + '%' and idMascota=@idMascota")
            res.status(202).json(findSintomas.recordset)
            console.log('Control por sintomas encontrado');
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

//find by Fecha
const findByFecha = async (req, res) => {

    const { body, params } = req
    const { id } = params
    const { fecha_desde, fecha_hasta } = body

    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            const findFecha = await db.request()
                .input('idMascota', TYPES.Int, id)
                .input('fecha_desde', TYPES.DateTime, fecha_desde)
                .input('fecha_hasta', TYPES.DateTime, fecha_hasta)
                .query("select id, idMascota, nombre, sintomas, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet from control where idMascota=@idMascota and fecha BETWEEN @fecha_desde and @fecha_hasta")
            res.status(202).json(findFecha.recordset)
            console.log('Control por fechas encontrado');
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

//delete
const deleteControl = async (req, res) => {

    const { id } = req.params

    const autorizacion = req.get('authorization')
    const check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            await db.request()
                .input('id', TYPES.Int, id)
                .query("delete from control where id=@id")

            res.status(202).send('Control borrado')
            console.log('Control borrado')
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

module.exports = { postControl, getControl, findByNombre, findBySintomas, findByFecha, deleteControl }