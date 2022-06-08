const { Router } = require('express');
const router = Router();
const { postControl, getControl, getControlById, findBySintomas, findByDescripcion, findByFecha, deleteControl } = require('../controllers/control.controllers')

router.post('/create/:id', postControl)
router.get('/find/', getControl)
router.get('/find/id/:id', getControlById)
router.get('/find/sintomas/:id', findBySintomas)
router.get('/find/descripcion/:id', findByDescripcion)
router.get('/find/fecha/:id', findByFecha)
router.delete('/delete/:id', deleteControl)

module.exports = router