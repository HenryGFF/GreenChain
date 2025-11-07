//CRUD
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '../../database/app.db')
const database = new DatabaseSync(dbPath);


/*C - CREATE

//esboço do objeato do login
/*
{
    nome: null,
    endereco: null,
    email: null,
    telefone: null,
    senha_hash: null
}
*/
function criarLoginEmpresa(loginObject) {
    const stmt = database.prepare("INSERT INTO empresas (nome, cnpj, endereco, email, telefone, senha_hash) VALUES (@nome, @cnpj, @endereco, @email, @telefone, @senha_hash)");

    return stmt.run(loginObject);
}


//esboço do objeato do componente
/*
    id_externo: definido em outro modulo, com o pacote uuid,
    id_empresa: empresalogin.lastInsertRowid, essa lógica será aplicada no modulo que chama função criarLoginEmpresa
	categoria: null,
	marca: null,
	modelo: null,
	numero_serie: null,
	ano_fabricacao: null,
	descricao_tecnica: null,
	observacoes: null,
	estado: null,
	origem: null,
	status: null,
	data_cadastro: null,

}
*/
function criarComponente(componenteObject) {
    const stmt = database.prepare(`
    INSERT INTO componentes (
        id_externo, id_empresa, categoria, marca, modelo, numero_serie, data_fabricacao,
        descricao_tecnica, observacoes, estado, origem, status
    ) VALUES (
        @id_externo, @id_empresa, @categoria, @marca, @modelo, @numero_serie, @data_fabricacao,
        @descricao_tecnica, @observacoes, @estado, @origem, @status
    )
    `);

    return stmt.run(componenteObject);
}


//esboço do objeto do historico
/*
{
    id_componente: componenteNovo.lastInsertRowid, essa lógica será aplicada no modulo que chama função criarLoginEmpresa,
    id_empresa: empresalogin.lastInsertRowid, essa lógica será aplicada no modulo que chama função criarLoginEmpresa,
    acao: null,
    hash: null,
    hash_anterior: null,
	detalhes: null,
	data_acao: null
}
*/
function criarHistorico(historicoObject) {
    const stmt = database.prepare("INSERT INTO historico (id_componente, id_empresa, acao, detalhes, hash, hash_anterior) VALUES (@id_componente, @id_empresa, @acao, @detalhes, @hash, @hash_anterior);");

    return stmt.run(historicoObject);
}


//R - READ, o usuário deve conseguir vizualizar a peça e seu histórico
function consultarComponente(componenteId){
    const stmt = database.prepare("SELECT id_empresa, id_componente, id_externo, categoria, marca, modelo, numero_serie, data_fabricacao, descricao_tecnica, observacoes, estado, origem, status, data_cadastro FROM componentes WHERE id_externo = ?");

    return stmt.get(componenteId);
}

function consultarTodosComponentes(empresaId){
    const stmt = database.prepare("SELECT id_empresa, id_componente, id_externo, categoria, marca, modelo, numero_serie, data_fabricacao, descricao_tecnica, observacoes, estado, origem, status, data_cadastro FROM componentes WHERE id_empresa = ?");

    return stmt.all(empresaId);
}

function consultarComponenteUsuario(componenteIdExterno){
    const stmt = database.prepare("SELECT id_externo, categoria, marca, modelo, numero_serie, data_fabricacao, descricao_tecnica, observacoes, estado, origem, status, data_cadastro FROM componentes WHERE id_externo = ?");

    return stmt.get(componenteIdExterno);
}

function consultarHistorico(componenteId){
    const stmt = database.prepare("SELECT id_historico, id_componente, id_empresa, acao, detalhes, data_acao, hash, hash_anterior FROM historico WHERE id_componente = ? ORDER BY data_acao");
    
    return stmt.all(componenteId);
}

function consultarHistoricoUsuario(componenteId){
    const stmt = database.prepare("SELECT id_empresa, acao, detalhes, data_acao FROM historico WHERE id_componente = ? ORDER BY data_acao");
    
    return stmt.all(componenteId);
}

function consultarEmpresaPorEmail(empresaEmail){
    const stmt = database.prepare("SELECT id_empresa, nome, cnpj, endereco, email, telefone, senha_hash FROM empresas WHERE email = ?");
    
    return stmt.get(empresaEmail);
}

function consultarEmpresaPorId(empresaId){
    const stmt = database.prepare("SELECT id_empresa, nome, endereco, email, telefone, senha_hash FROM empresas WHERE id_empresa = ?");
    return stmt.get(empresaId);
}


function ultimoComponenteBlockchain(componenteId){
    const stmt = database.prepare("SELECT h.* FROM historico h WHERE id_componente = ? AND NOT EXISTS(SELECT 1 FROM historico h2 WHERE h2.hash_anterior = h.hash) LIMIT 1")

    return stmt.get(componenteId)
}

// U - UPDATE, as empresas devem conseguir atualizar os cadastros dos componentes
function atualizarComponente(componenteUpdate){
    const stmt = database.prepare("UPDATE componentes SET id_empresa = @id_empresa observacoes = @observacoes, estado = @estado, descricao_tecnica = @descricao_tecnica, status = @status WHERE id_externo = @id_externo")

    return stmt.run(componenteUpdate);
}


function cadastrandoComponente(componente){
    database.exec('BEGIN TRANSACTION');
        try{
            const result = criarComponente({
                id_externo: componente.id_externo,
                id_empresa: componente.id_empresa,
                categoria: componente.categoria,
                marca: componente.marca,
                modelo: componente.modelo,
                numero_serie: componente.numero_serie,
                data_fabricacao: componente.data_fabricacao,
                descricao_tecnica: componente.descricao_tecnica,
                observacoes: componente.observacoes,
                estado: componente.estado,
                origem: componente.origem,
                status: componente.status,
            });

            const id_componente = result.lastInsertRowid;

            criarHistorico({
                id_componente: id_componente,
                id_empresa: componente.id_empresa,
                acao: componente.acao,
                detalhes: null,
                hash: componente.hash,
                hash_anterior: componente.hash_anterior
            });
            database.exec('COMMIT');
        } catch (err){
            database.exec('ROLLBACK');
            console.error("Erro ao cadastrar componente no banco:", err);
        }
}

function atualizandoComponente(updates, componente){
    database.exec('BEGIN TRANSACTION');
        try{
            atualizarComponente({
                id_externo: updates.id_externo,
                descricao_tecnica: updates.descricao_tecnica,
                observacoes: updates.observacoes,
                estado: updates.estado,
                status: updates.status
            });
            criarHistorico({
                id_componente: componente.id_componente,
                id_empresa: componente.id_empresa,
                acao: updates.acao,
                detalhes: updates.detalhes,
                hash: updates.hash,
                hash_anterior: updates.hash_anterior
            });
            database.exec('COMMIT');
        } catch (err){
            database.exec('ROLLBACK');
            console.error(err);
        }
}



//-exportando o módulo
export default {
  criarLoginEmpresa,
  criarComponente,
  criarHistorico,
  consultarComponente,
  consultarHistorico,
  consultarHistoricoUsuario,
  consultarEmpresaPorEmail,
  ultimoComponenteBlockchain,
  atualizarComponente,
  cadastrandoComponente,
  atualizandoComponente,
  consultarEmpresaPorId,
  consultarComponenteUsuario,
  consultarTodosComponentes
};