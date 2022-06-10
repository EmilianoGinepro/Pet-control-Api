const { Router } = require('express');
const router = Router();
const { postMascota, getMascota, getIdMascota, putPesoMascota, putObservacionesMascota, deleteMascota, updateFoto } = require('../controllers/mascota-controllers')

router.post('/create', postMascota)
router.get('/get', getMascota)
router.get('/get/:id', getIdMascota)
router.put('/update/peso/:id', putPesoMascota)
router.put('/update/observaciones/:id', putObservacionesMascota)
router.delete('/delete/:id', deleteMascota)
router.put('/update/foto/:id', updateFoto)

module.exports = router