import db from '../db/database.js';
import crypt from 'bcryptjs';

async function criarCadastro(cadastroObject){
    const hash = await crypt.hash(cadastroObject.senha, 8);
    cadastroObject.senha_hash = hash;
    delete cadastroObject.senha

    const confirmacao = db.criarLoginEmpresa(cadastroObject);

    return confirmacao 
    ? {status: 'ok', mensagem: 'Cadastro realizado com sucesso!'}
    : {status: 'erro', mensagem: 'Falha ao realizar cadastro!'};
}

async function autenticarEmpresa(infoObject){
    const empresaLogin = await db.consultarEmpresaPorEmail(infoObject.email);
    if (!empresaLogin) return { status: 'erro', mensagem: 'email não encontrado' };

    const senhaInserida = infoObject.senha;
    const hash = empresaLogin.senha_hash
    const senhaCorreta = await crypt.compare(senhaInserida,hash)

    if(!senhaCorreta){
        return { status: 'erro', mensagem: 'senha incorreta' };
    } else {
        return {
            status: 'ok',
            empresa: {
                id: empresaLogin.id_empresa,
                nome: empresaLogin.nome,
                endereco: empresaLogin.endereco,
                email: empresaLogin.email,
                cnpj: empresaLogin.cnpj,
                telefone: empresaLogin.telefone
            }
        };
    }
}

export default {criarCadastro, autenticarEmpresa};