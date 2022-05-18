const { Router } = require('express');
const router = Router();
const { postMascota, getMascota, getIdMascota, putMascota, deleteMascota } = require('../controllers/mascota-controllers')

router.post('/createmascota', postMascota)
router.get('/getmascota', getMascota)
router.get('/getidmascota/:id', getIdMascota)
router.put('/updatemascota/:id', putMascota)
router.delete('/deletemascota/:id', deleteMascota)

module.exports = router