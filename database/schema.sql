CREATE TABLE empresas (
	id_empresa INTEGER PRIMARY KEY AUTOINCREMENT,
	nome TEXT NOT NULL,
    cnpj TEXT UNIQUE NOT NULL,
	endereco TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	telefone TEXT NOT NULL,
	senha_hash TEXT NOT NULL
);

CREATE TABLE componentes (
    id_componente INTEGER PRIMARY KEY AUTOINCREMENT,
    id_externo TEXT UNIQUE NOT NULL,
    id_empresa INTEGER,
    categoria TEXT NOT NULL,
    marca TEXT,
    modelo TEXT,
    numero_serie TEXT UNIQUE,
    data_fabricacao TEXT,
    descricao_tecnica TEXT,
    observacoes TEXT,
    estado TEXT NOT NULL,
    origem TEXT NOT NULL,
    status TEXT NOT NULL,        
    data_cadastro DATETIME DEFAULT (DATETIME('now', '-3 hours')),
    FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa)
);


CREATE TABLE historico (
	id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
	id_componente INTEGER NOT NULL,
	id_empresa INTEGER NOT NULL,
	acao TEXT NOT NULL,
	detalhes TEXT,
	data_acao DATETIME DEFAULT (DATETIME('now', '-3 hours')),
    hash TEXT NOT NULL,
    hash_anterior TEXT,
	FOREIGN KEY (id_componente) REFERENCES componentes(id_componente),
	FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa)
);