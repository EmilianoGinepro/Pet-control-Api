const { Router } = require('express');
const router = Router();
const { postControl, getControl, findByNombre, findBySintomas, findByFecha, deleteControl } = require('../controllers/control.controllers')

router.post('/create/:id', postControl)
router.get('/find/id/:id', getControl)
router.get('/find/nombre/:id', findByNombre)
router.get('/find/sintomas/:id', findBySintomas)
router.get('/find/fecha/:id', findByFecha)
router.delete('/delete/:id', deleteControl)

module.exports = router