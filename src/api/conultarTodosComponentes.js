import express from 'express';
import consultarService from '../services/consultar.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const resultado = await consultarService.consultandoTodosComponentes(id);
        res.status(200).json({status: 'ok', componentes: resultado});
    } catch (err) {
        console.error(err);
        res.status(500).json({status: 'erro', mensagem: err.message});
    }
})

export default router;