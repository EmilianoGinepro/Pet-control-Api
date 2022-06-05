const fileUpload = require('express-fileupload')
const { db } = require('../db/connect')
const { TYPES } = require('mssql')
const { tokenFunction } = require('../config/token')
const { checkAutorizacion } = require('../auth/validaciones-auth')

//cargar foto
const updateFoto = async (req, res) => {
    const { id } = req.params
    const EDFile = req.files.foto
    const uploadPath = `${__dirname}\\files\\${EDFile.name}`
    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {

        if (!req.files) {
            res.status(404).send('No se cargo una imagen')
        }

        EDFile.mv(uploadPath, err => {
            if (err) {
                res.status(500).send('Error al guardar la imagen')
                console.log(err);
            }
        })

        try {
            await db.connect()
            await db.request()
                .input('foto', TYPES.VarChar(500), uploadPath)
                .input('id', TYPES.Int, id)
                .query("update mascota set foto=@foto where id=@id")
            db.close()
            res.status(200).send('Imagen subida')
        }
        catch (err) {
            console.log(err)
        }
    }
}

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
            .input('peso', TYPES.Float, peso)
            .input('observaciones', TYPES.VarChar(200), observaciones)
            .query("declare @UserID int INSERT INTO mascota(idUsuario,nombre,especie,sexo,fecha_nacimiento) VALUES (@idUsuario,@nombre,@especie,@sexo,@fecha_nacimiento) SET @UserID = @@IDENTITY INSERT INTO peso(idMascota,peso) VALUES (@UserID, @peso) INSERT INTO observaciones(idMascota, observaciones) VALUES (@UserID, @observaciones) ")

        res.status(202).send('mascota ingresada')
        console.log('mascota ingresada')

        db.close()
    }
    catch (err) {
        console.log(err)
        res.status(404).send(err)
    }
}

//find  no trae la foto
const getMascota = async (req, res) => {
    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        const idUsuario = tokenFunction(autorizacion)

        try {
            await db.connect()
            const findMascota = await db.request()
                .input('idUsuario', TYPES.Int, idUsuario)
                .query("select  m.id,m.idUsuario,m.nombre,m.especie,sexo,convert(varchar(10), m.fecha_nacimiento,103)as fecha,p.peso, o.observaciones from mascota m INNER join peso p on m.id = p.idMascota inner join observaciones o on m.id = o.idMascota where m.idUsuario=@idusuario")

            res.status(202).json(findMascota.recordset)
            console.log('mascotas encontradas')
            console.log();
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

//find by  no trae la foto
const getIdMascota = async (req, res) => {
    const { id } = req.params
    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        const idUsuario = tokenFunction(autorizacion)

        try {
            await db.connect()
            const findByIdMascota = await db.request()
                .input('id', TYPES.Int, id)
                .input('idUsuario', TYPES.Int, idUsuario)
                .query("select  m.id,m.idUsuario,m.nombre,m.especie,sexo,convert(varchar(10), m.fecha_nacimiento,103)as fecha,p.peso, o.observaciones from mascota m INNER join peso p on m.id = p.idMascota inner join observaciones o on m.id = o.idMascota where m.id=@id and m.idUsuario=@idUsuario")

            res.status(202).json(findByIdMascota.recordset)
            console.log('mascota encontrada')
            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }
}

//update peso
const putPesoMascota = async (req, res) => {
    const { body } = req
    const { id } = req.params
    const { peso } = body
    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            const updateMascota = await db.request()
                .input('id', TYPES.Int, id)
                .input('peso', TYPES.Float, peso)
                .query('update peso set peso=@peso where idMascota=@id')
            db.close()

            res.status(202).json('Peso de la mascota actualizada')
            console.log('Peso de la mascota actualizada')
        }
        catch (error) {
            console.log(error);
            res.status(404).send(err)
        }
    }
}

//update observaciones
const putObservacionesMascota = async (req, res) => {
    const { body } = req
    const { id } = req.params
    const { observaciones } = body
    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        try {
            await db.connect()
            await db.request()
                .input('id', TYPES.Int, id)
                .input('observaciones', TYPES.VarChar(100), observaciones)
                .query('update observaciones set observaciones=@observaciones where idMascota=@id')
            db.close()

            res.status(202).json('observaciones de la mascota actualizada')
            console.log('observaciones de la mascota actualizada')
        }
        catch (error) {
            console.log(error);
            res.status(404).send(err)
        }
    }
}

//delete
const deleteMascota = async (req, res) => {
    const { id } = req.params
    const autorizacion = req.get('authorization')
    let check = checkAutorizacion(autorizacion)
    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        const idUsuario = tokenFunction(autorizacion)

        try {
            await db.connect()
            const deleteMascota = await db.request()
                .input('id', TYPES.Int, id)
                .input('idUsuario', TYPES.Int, idUsuario)
                .query("delete from mascota where id=@id and idUsuario=@idUsuario delete from peso where idMascota=@id delete from observaciones where idMascota=@id")

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

module.exports = { postMascota, getMascota, getIdMascota, putPesoMascota, putObservacionesMascota, deleteMascota, updateFoto }