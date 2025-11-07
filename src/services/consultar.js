import db from '../db/database.js';
import {spawn} from 'node:child_process';
import path from 'path';

async function consultandoComponente(id_externo){
    const componente = db.consultarComponenteUsuario(id_externo);

    return componente;
}

async function consultandoTodosComponentes(id_empresa){
    const componenteArray = db.consultarTodosComponentes(id_empresa);

    return componenteArray;
}

async function consultandoHistorico(id_externo){
    const execPath = path.resolve('./c-blockchain/blockchainValidation');
    const componente = db.consultarComponente(id_externo);

    if (!componente) return 'Componente não encontrado na base de Dados';

    const dbArray = db.consultarHistorico(componente.id_componente);
    let historyArray = [];

    dbArray.forEach((block, index) => {
        historyArray[index] = {   
            id_empresa: block.id_empresa,
            acao: block.acao,
            hash: block.hash,
            hash_anterior: block.hash_anterior,
        }
    })

    historyArray.push({
            id_externo: id_externo,
            categoria: componente.categoria,
            marca: componente.marca,
            modelo: componente.modelo,
            numero_serie: componente.numero_serie,
            data_fabricacao: componente.data_fabricacao,
            origem: componente.origem,
        });

    const historyJSON = JSON.stringify(historyArray)
    console.log(historyJSON)

    return new Promise((resolve, reject) => {
        const scriptC = spawn(execPath);
        let output = '';

        scriptC.stdin.write(historyJSON, "utf-8", () => {
            scriptC.stdin.end();
        });

        scriptC.stdout.on('data', (chunk) => {
            output += chunk.toString();
        });
        scriptC.stderr.on('data', (err) => {
            reject(err.toString());
        });
        scriptC.on('close', (code) => {
        if (code !== 0) reject(`Processo C saiu com código ${code}`);
        else {
            resolve(output);
        }
        });

    })

    .then((output) => {
        let resultadoBlockchain;
        try {
            resultadoBlockchain = JSON.parse(output); // parse apenas aqui
        } catch (err) {
            console.error(`Erro ao interpretar JSON vindo do C: ${output}`);
            return 'Erro ao interpretar retorno do programa C!';
        }

        console.log(resultadoBlockchain);
        
        if (resultadoBlockchain.status == 'integridade autenticada'){
            console.log(db.consultarHistoricoUsuario(componente.id_componente))
            
            return(db.consultarHistoricoUsuario(componente.id_componente));
        } else {
            return 'Houve um problema ao consultar o histórico, integridade da blockchain alterada!'
        }
    })
    .catch((err) => {
        console.error(`Erro ao consultar histórico: ${err}`);
        return 'Erro ao consultar histórico!'
    });
}

async function consultandoEmpresa(idEmpresa){
    const empresa = db.consultarEmpresaPorId(idEmpresa)

    return empresa.nome
}

async function consultandoEmpresaEmail(emailEmpresa){
    const empresa = db.consultarEmpresaPorEmail(emailEmpresa)
    
    return empresa
}

export default {consultandoComponente, consultandoTodosComponentes, consultandoHistorico, consultandoEmpresa, consultandoEmpresaEmail};