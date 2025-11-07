import db from '../db/database.js';
import {spawn} from 'node:child_process';
import path from 'path';
//o usuário pode realizar 5 ações: login, logout, consultar, atualizar, cadastrar
//este módulo cobre as seguintes açoes: consultar e cadastrar


async function cadastrarComponente(componente){
    const hashInfo = [
        {
            id_empresa: componente.id_empresa,
            acao: componente.acao,
            hash: componente.hash, 
            hash_anterior: componente.hash_anterior
        },
        {
            id_externo: componente.id_externo,
            categoria: componente.categoria,
            marca: componente.marca, 
            modelo: componente.modelo,
            numero_serie: componente.numero_serie,
            data_fabricacao: componente.data_fabricacao,
            origem: componente.origem, 
        }
    ]

    const hashJSON = JSON.stringify(hashInfo);
    const execPath = path.resolve('./c-blockchain/primeiroCadastro');
    console.log(hashJSON);

    return new Promise((resolve, reject) => {
        console.log(hashJSON)
        const scriptC = spawn(execPath);
        let output = '';

        scriptC.stdin.write(hashJSON);
        scriptC.stdin.end();

        scriptC.stdout.on('data', (chunk) => {
            output += chunk.toString();
        });
        scriptC.stderr.on('data', (err) => {
            reject(err.toString())
        });
        scriptC.on('close', (code) => {
            if (code !== 0) reject(`Processo C saiu com código ${code}`);
            else{
                try {
                    const parsed = JSON.parse(output);
                    componente.hash = parsed.hash;
                    resolve(componente);
                } catch {
                    reject(`Erro ao interpretar JSON: ${output}`);
                }
            }
        });

    })

    .then((output) => {
        db.cadastrandoComponente(output);
        console.log(output);
        return {status: 'ok', mensagem:'Componente cadastrado com sucesso!'}
    })
    .catch((err) => {
        console.error(`Erro ao cadastrar componente: ${err}`);
        return {status: 'erro', mensagem:'Erro ao cadastrar componente!'}
    });
}

export default {cadastrarComponente};