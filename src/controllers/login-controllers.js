const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { nanoid } = require('nanoid')
const { db } = require('../db/connect')
const { TYPES } = require('mssql')
const { TOKEN_PASSWORD } = require('../config/config')
const { transporter } = require('../email/email-config')
const { tokenFunction } = require('../config/token')
const { checkAutorizacion } = require('../auth/validaciones-auth')

//create user
const postUser = async (req, res) => {

    const { body } = req
    const { nombre, apellido, email, pwd } = body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(pwd, saltRounds)

    await db.connect()
    const findEmail = await db.request()
        .input('email', TYPES.VarChar(100), email)
        .query("select email from usuario where email=@email")

    if (findEmail.recordset[0] != undefined) {

        if (findEmail.recordset[0].email == email) {
            console.log('email ya existe')
            res.status(400).send('Email ya existe')
        }
    }
    else {
        try {
            await db.request()
                .input('nombre', TYPES.VarChar(50), nombre)
                .input('apellido', TYPES.VarChar(50), apellido)
                .input('email', TYPES.VarChar(100), email)
                .input('pwd', TYPES.VarChar(100), passwordHash)
                .query("insert into usuario(nombre,apellido,email,pwd) values (@nombre,@apellido,@email,@pwd)")

            const mailOption = {
                from: "Pet-Control",
                to: email,
                subject: "Cuenta nueva de Pet Control",
                text: `Bienvenido a Pet Control su usuario es: ${email} y tu contraseña es: ${pwd}.`
            }

            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('email enviado')
                }
            })

            res.status(202).send('usuario creado')
            console.log('usuario creado')

            db.close()
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }

}

//cambiar contraseña
const putPassword = async (req, res) => {

    const { body } = req
    const { pwd } = body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(pwd, saltRounds)
    const autorizacion = req.get('authorization')

    let check = checkAutorizacion(autorizacion)

    if (check == false) {
        res.status(403).send('token invalido')
    } else {
        const id = tokenFunction(autorizacion)

        try {
            await db.connect()
            await db.request()
                .input('id', TYPES.Int, id)
                .input('pwd', TYPES.VarChar(100), passwordHash)
                .query('update usuario set pwd=@pwd where id=@id')
            db.close()
            res.status(200).send('contraseña cambiada')
        }
        catch (err) {
            console.log(err)
            res.status(404).send(err)
        }
    }




}

//recuperar contraseña
const putNewPass = async (req, res) => {

    const { body } = req
    const { email } = body

    let newPass = nanoid(10)
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPass, saltRounds)

    try {
        await db.connect()
        const user = await db.request()
            .input('email', TYPES.VarChar(100), email)
            .query('select * from usuario where email=@email')

        if (user.recordset[0] == undefined || email !== user.recordset[0].email) {

            console.log('email incorrecto');
            res.status(404).send({
                status: "email incorrecto"
            })

        } else {
            const idUser = user.recordset[0].id

            const changePass = await db.request()
                .input('id', TYPES.Int, idUser)
                .input('password', TYPES.VarChar(100), passwordHash)
                .query('update usuario set pwd=@password where id=@id')
            console.log(changePass);

            const mailOption = {
                from: "Pet-Control",
                to: email,
                subject: "Nueva contraseña",
                text: `Hola, te enviamos este mail con la nueva contraseña: ${newPass}`
            }

            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('email enviado')
                }
            })

            res.status(202).send('contraseña actualizada por olvido')
            console.log('contraseña actualizada por olvido')

            db.close()
        }
    }
    catch (err) {
        console.log(err)
    }
}


//login user
const postLoginUser = async (req, res) => {

    const { body } = req;
    const { email, password } = body;

    try {
        await db.connect()
        const user = await db.request()
            .input('email', TYPES.VarChar(100), email)
            .query('select * from usuario where email=@email')
        db.close()

        if (user.recordset[0] == undefined || email !== user.recordset[0].email) {

            console.log('el user no existe');
            res.status(404).send({
                status: "usuario o contraseña invalido"
            })

        } else {

            passwordCorrect = await bcrypt.compare(password, user.recordset[0].pwd)

            if (!(user && passwordCorrect)) {
                console.log('usuario incorrecto o contraseña incorrecta');
                res.status(403).send('usuario incorrecto o contraseña incorrecta')
            } else {
                const userToken = {
                    id: user.recordset[0].id,
                    email: user.recordset[0].email
                }

                const token = jwt.sign(userToken, TOKEN_PASSWORD)

                console.log("login exitoso");
                res.status(200).send({
                    id: user.recordset[0].id,
                    nombre: user.recordset[0].nombre,
                    apellido: user.recordset[0].apellido,
                    email: user.recordset[0].email,
                    token
                })
            }
        }

    }
    catch (err) {
        console.log(err)
    }
}

module.exports = { postUser, postLoginUser, putPassword, putNewPass };