const { Router } = require('express');
const router = Router();
const { postMascota, getMascota, getIdMascota, putMascota, deleteMascota } = require('../controllers/mascota-controllers')

router.post('/create', postMascota)
router.get('/get', getMascota)
router.get('/get/:id', getIdMascota)
router.put('/update/:id', putMascota)
router.delete('/delete/:id', deleteMascota)

module.exports = router