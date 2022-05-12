const { db } = require('../db/connect')
const { TYPES } = require('mssql')
const { tokenFunction } = require('../config/token')


//create
const postMascota = async (req, res) => {
    const { body } = req
    const { nombre, especie, sexo, fecha_nacimiento, peso, observaciones } = body
    const autorizacion = req.get('authorization')
    const idUsuario = tokenFunction(autorizacion)

    try {
        await db.connect()

        await db.request()
            .input('idUsuario', TYPES.Int, idUsuario)
            .input('nombre', TYPES.VarChar(50), nombre)
            .input('especie', TYPES.VarChar(50), especie)
            .input('sexo', TYPES.VarChar(50), sexo)
            .input('fecha_nacimiento', TYPES.DateTime, fecha_nacimiento)
            .input('peso', TYPES.Int, peso)
            .input('observaciones', TYPES.VarChar(100), observaciones)
            //falta hacer el input de foto
            .query("insert into mascota(idUsuario,nombre,especie,sexo,fecha_nacimiento,peso,observaciones) values (@idUsuario,@nombre,@especie,@sexo,@fecha_nacimiento,@peso,@observaciones)")

        res.status(202).send('mascota ingresada')
        console.log('mascota ingresada')

        db.close()
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
};

//find
const getMascota = async (req, res) => {
    const autorizacion = req.get('authorization')
    if (!autorizacion.startsWith('bearer ')) {
        res.status(403).send('token invalido')
    } else {
        const idUsuario = tokenFunction(autorizacion)

        try {
            await db.connect()
            const findMascota = await db.request()
                .input('idUsuario', TYPES.Int, idUsuario)
                .query("select * from mascota where idUsuario=@idusuario")

            res.status(202).json(findMascota)
            console.log('mascotas encontradas')
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }

}

//find by id
const getIdMascota = async (req, res) => {
    const { id } = req.params
    const autorizacion = req.get('authorization')
    if (!autorizacion.startsWith('bearer ')) {
        res.status(403).send('token invalido')
    } else {
        const idUsuario = tokenFunction(autorizacion)

        try {
            await db.connect()
            const findByIdMascota = await db.request()
                .input('id', TYPES.Int, id)
                .input('idUsuario', TYPES.Int, idUsuario)
                .query("select * from mascota where id=@id and idUsuario=@idUsuario")

            res.status(202).json(findByIdMascota.recordsets)
            console.log('mascota encontrada')
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }

}

//update
const putMascota = async (req, res) => {

}

//delete
const deleteMascota = async (req, res) => {
    const { body } = req
    const { id } = body
    const autorizacion = req.get('authorization')
    if (!autorizacion.startsWith('bearer ')) {
        res.status(403).send('token invalido')
    } else {
        const idUsuario = tokenFunction(autorizacion)

        try {
            await db.connect()
            const deleteMascota = await db.request()
                .input('id', TYPES.Int, id)
                .input('idUsuario', TYPES.Int, idUsuario)
                .query("delete  from mascota where id=@id and idUsuario=@idUsuario")

            res.status(202).send('mascota borrada')
            console.log('mascota borrada')
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }

}

module.exports = { postMascota, getMascota, getIdMascota, putMascota, deleteMascota }