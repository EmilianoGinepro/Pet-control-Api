const { db } = require('../db/connect')
const { TYPES } = require('mssql')
const { checkAutorizacion } = require('../auth/validaciones-auth')

//create
const postControl = async (req, res) => {

    const { body } = req
    const { nombre, sintomas, fecha, proximo_control, observaciones_vet } = body
    const autorizacion = req.get('authorization')
    const { id } = req.params

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
    const { id } = req.params
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
const findByNombre = async () => {
}

//Find by Sintomas
const findBySintomas = async () => {

}

//find by Fecha
const findByFecha = async () => {

}

//delete
const deleteControl = async () => {

}

module.exports = { postControl, getControl, findByNombre, findBySintomas, findByFecha, deleteControl }