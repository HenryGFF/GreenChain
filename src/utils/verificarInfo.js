import db from '../db/database.js';

export function updateVerification(updateObject, idComponente, empresaLogada){
    const ultimoHistorico = db.ultimoComponenteBlockchain(idComponente);
    updateObject.hash_anterior = ultimoHistorico.hash;
    updateObject.hash = null;

    switch(updateObject.status){
        case 'Disponível para doação':
            updateObject.acao = 'Componente disponibilizado para doação';
            updateObject.id_empresa = empresaLogada;
            break;

        case 'Disponível para venda':
            updateObject.acao = 'Componente disponibilizado para venda';
            updateObject.id_empresa = empresaLogada;
            break;

        case 'Componente destinado ao reuso':
            updateObject.acao = 'Componente destinado ao reuso';
            updateObject.id_empresa = empresaLogada;
            break;
        
        case 'Componente vendido':
            updateObject.acao = 'Componente vendido';
            updateObject.id_empresa = null;
            break;
        
        case 'Componente doado':
            updateObject.acao = 'Componente doado';
            updateObject.id_empresa = null;
            break;
        
        case 'Componente reciclado':
            updateObject.acao = 'Posse adquirida';
            updateObject.id_empresa = empresaLogada;
            break;

        case 'Componente destinado à desmontagem':
            updateObject.acao = 'Componente direcionado para desmontagem';
            updateObject.id_empresa = empresaLogada;
            break;

         default:
            console.warn(`Ação desconhecida: ${updateObject.acao}`);
            updateObject.acao = 'Ação desconhecida';
    }
    
}