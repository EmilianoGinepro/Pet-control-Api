const { db } = require('../db/connect')
const { TYPES } = require('mssql')
const { checkAutorizacion } = require('../auth/validaciones-auth')
const { tokenFunction } = require('../config/token')

//create
const postControl = async (req, res) => {

    const { body, params } = req
    const { sintomas, descripcion, fecha, proximo_control, observaciones_vet } = body
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
                .input('sintomas', TYPES.VarChar(50), sintomas)
                .input('descripcion', TYPES.VarChar(300), descripcion)
                .input('fecha', TYPES.DateTime, fecha)
                .input('proximo_control', TYPES.DateTime || null, proximo_control)
                .input('observaciones_vet', TYPES.VarChar(300), observaciones_vet)
                .query('INSERT INTO control (idMascota, sintomas, descripcion,fecha, proximo_control, observaciones_vet) VALUES (@idMascota,@sintomas, @descripcion, @fecha, @proximo_control, @observaciones_vet)')

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

//find bu id user
const getControl = async (req, res) => {

    const autorizacion = req.get('authorization')
    const check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            const idUsuario = tokenFunction(autorizacion)

            await db.connect()
            const findControl = await db.request()
                .input('idUsuario', TYPES.Int, idUsuario)
                .query("SELECT c.id, m.nombre, c.sintomas, convert(varchar(10), c.fecha, 103) AS fecha, convert(varchar(10), c.proximo_control,103) AS proximo_control FROM control c INNER JOIN mascota m ON c.idMascota = m.id where m.idUsuario =@idUsuario")
            res.status(202).json(findControl.recordset)
            console.log('Controles encontrados')
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

//find by id
const getControlById = async (req, res) => {

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
                .query("SELECT id, idMascota, sintomas, descripcion, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet  FROM control WHERE idMascota=@id")
            if (findControl.recordset.length === 0) {
                res.status(204).json('Esta mascota no tiee controles ingresados')
            }
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
                .query("select id, idMascota, sintomas, descripcion, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet from control where sintomas LIKE '%' + @sintomas + '%' and idMascota=@idMascota")
            if (findSintomas.recordset.length === 0) {
                res.status(204).json('No hay controles ingresados con esos sintomas')
            }
            res.status(202).json(findSintomas.recordset)
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
const findByDescripcion = async (req, res) => {

    const { body, params } = req
    const { id } = params
    const { descripcion } = body

    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            const findDescripcion = await db.request()
                .input('idMascota', TYPES.Int, id)
                .input('descripcion', TYPES.VarChar(50), descripcion)
                .query("select id, idMascota, sintomas, descripcion, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet from control where descripcion LIKE '%' + @descripcion + '%' and idMascota=@idMascota")
            if (findDescripcion.recordset.length === 0) {
                res.status(204).json('No hay controles ingresados con esa descipcion')
            };
            res.status(202).json(findDescripcion.recordset)
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
                .query("select id, idMascota, sintomas, descripcion, convert(varchar(10), fecha,103)as fecha,convert(varchar(10), proximo_control,103)as  proximo_control, observaciones_vet from control where idMascota=@idMascota and fecha BETWEEN @fecha_desde and @fecha_hasta")
            if (findFecha.recordset.length === 0) {
                res.status(204).json('No hay controles ingresados con esas fechas')
            }
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

module.exports = { postControl, getControlById, getControl, findBySintomas, findByDescripcion, findByFecha, deleteControl }