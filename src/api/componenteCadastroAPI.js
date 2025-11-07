import express from 'express';
import { verificarLogin } from './middleware/serviceAuthentication.js';
import { idMaker } from '../utils/idgenerator.js';
import cadastroService from '../services/cadastrar.js';
import consultaService from '../services/consultar.js';

const router = express.Router();

router.post('/', verificarLogin, async (req, res) => {
    try {
        const email = req.session.user.email; 

        if (!email) {
            return res.status(401).json({ status: 'erro', mensagem: 'Sessão expirada ou inválida' });
        }

        let {id_externo, id_empresa, categoria: categoria, marca, modelo, numero_serie, data_fabricacao, status, origem, descricao_tecnica, observacoes, estado, acao, hash, hash_anterior} = req.body;

        id_externo = idMaker();

        const infoEmpresa = await consultaService.consultandoEmpresaEmail(email);
        if (!infoEmpresa) {
            return res.status(404).json({ status: 'erro', mensagem: 'Empresa não encontrada para este email'});
        }

        id_empresa = infoEmpresa.id_empresa;

        const resultado = await cadastroService.cadastrarComponente({id_externo, id_empresa, categoria: categoria, marca, modelo, numero_serie, data_fabricacao, status, origem, descricao_tecnica, observacoes, estado, acao, hash, hash_anterior});

        res.status(201).json({status: resultado.status, mensagem: resultado.mensagem, id: `${id_externo}`});
    } catch (err) {
        console.error(err);
        res.status(500).json({status: 'erro', mensagem: err.message});
    }
})

export default router;