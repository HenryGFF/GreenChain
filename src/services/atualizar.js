import db from '../db/database.js';
import {spawn} from 'node:child_process';
import {updateVerification} from '../utils/verificarInfo.js';
import path from 'path';

async function atualizarCadastro(updateObject){
    const execPath = path.resolve('./c-blockchain/blockchain');

    const componente = db.consultarComponente(updateObject.id_externo);
    const empresa = db.consultarEmpresaPorEmail(updateObject.email);

    updateVerification(updateObject, componente.id_componente, empresa.id_empresa);

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
                id_empresa: empresa.id_empresa,
                acao: updateObject.acao,
                hash: null,
                hash_anterior: updateObject.hash_anterior,
        });
    
        historyArray.push({
                id_externo: updateObject.id_externo,
                categoria: componente.categoria,
                marca: componente.marca,
                modelo: componente.modelo,
                numero_serie: componente.numero_serie,
                data_fabricacao: componente.data_fabricacao,
                origem: componente.origem,
        });

        const historyJSON = JSON.stringify(historyArray);
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
                try { 
                    const parsed = JSON.parse(output);
                    console.log(parsed)
                    updateObject.hash = parsed.hash
                    resolve(updateObject)
                }
                catch { reject(`Erro ao interpretar JSON: ${output}`); }
            }
            });

        })

        .then((output) => {
            db.atualizandoComponente(output, componente);
            return {status: 'ok', mensagem: 'Componentes atualizado com sucesso'}
        })
        .catch((err) => {
            console.error(`Erro ao atualizar histórico: ${err}`);
            return {status: 'erro', mensagem: 'Erro ao atualizar histórico!'}
        });
}
    
export default {atualizarCadastro};