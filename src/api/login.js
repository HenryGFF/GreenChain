import express from 'express';
import contaService from '../services/conta.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const { email, senha } = req.body;
        if (!email || !senha) return res.status(400).json({
            status: 'erro', mensagem:'Preencha corretamente todos os campos'
        });

        const resultado = await contaService.autenticarEmpresa({ email, senha });

        if (resultado.status == 'erro') return res.status(401).json(resultado);

        req.session.user = resultado.empresa;
        
        res.json({
                status: "ok",
                mensagem: "Login realizado com sucesso!",
                empresa: resultado.empresa
            });

    } catch (err){
        console.error(err);
        res.status(500).json({ status: "erro", mensagem: "Erro interno no servidor." });
    }
})

export default router;