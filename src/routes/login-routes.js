const { Router } = require('express');
const router = Router();
const { postUser, postLoginUser, putPassword, putNewPass } = require('../controllers/login-controllers');


router.post('/create', postUser)
router.post('/login', postLoginUser)
router.put('/update', putPassword)
router.put('/recuperar', putNewPass)

module.exports = router;