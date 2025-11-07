import express from 'express';
import atualizarService from '../services/atualizar.js';
import { verificarLogin } from './middleware/serviceAuthentication.js';

const router = express.Router();

router.patch('/', verificarLogin, async (req, res) => {
    try {
        const resultado = await atualizarService.atualizarCadastro(req.body);
        res.status(200).json(resultado);
    } catch (err) {
        console.error(err);
        res.status(500).json({"Erro": err.message});
    }
})

export default router;