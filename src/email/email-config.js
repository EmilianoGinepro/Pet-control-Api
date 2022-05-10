const nodemailer = require('nodemailer')
const {EMAIL_HOST,EMAIL_PORT,EMAIL_USER,EMAIL_PASS} = require('../config/config')

const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    },
    secure: true,
    tls: {
        rejectUnauthorized: false}
})

module.exports = {transporter}