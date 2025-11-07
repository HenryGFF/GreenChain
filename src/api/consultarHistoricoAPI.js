import express from 'express';
import consultarService from '../services/consultar.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const {id} = req.params
        const resultado = await consultarService.consultandoHistorico(id);
        console.log(resultado);
        JSON.stringify(resultado);
        res.status(200).json({status: 'ok', historico: JSON.stringify(resultado)});
    } catch (err) {
        console.error(err);
        res.status(500).json({status: 'erro', mensagem: err.message});
    }
})

export default router;