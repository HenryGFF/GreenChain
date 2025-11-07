import express from 'express';
import consulta from '../services/consultar.js'
import contaService from '../services/conta.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const { nome, email, telefone, endereco, cnpj, senha } = req.body;
        if ( !nome || !email || !telefone || !endereco || !cnpj || !senha ){
            return res.status(400).json({
                status: 'erro',
                mensagem: 'Todas as informações devem ser preenchidas'
            });
        }

        const confirmation = await consulta.consultandoEmpresaEmail(email);
        if ( confirmation ) {
            return res.status(409).json({
                status: 'erro',
                mensagem: 'Email já cadastrado na base de dados'
            });
        }

        const cadastroResultado = await contaService.criarCadastro(req.body);
        return res.status(201).json(cadastroResultado);
    } catch(err){
        console.error(err);
        res.status(500).json({
            status: 'erro',
            mensagem: 'Erro interno no servidor.'
        });
    }
})

export default router;