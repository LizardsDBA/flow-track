-- 1. USUÁRIO
CREATE TABLE IF NOT EXISTS usuario (
                                       id INT NOT NULL AUTO_INCREMENT,
                                       nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(20) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    primeiro_acesso BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );

-- 2. VIATURA
CREATE TABLE IF NOT EXISTS viatura (
                                       id INT NOT NULL AUTO_INCREMENT,
                                       prefixo VARCHAR(20) NOT NULL UNIQUE,
    placa VARCHAR(10) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    ano YEAR NOT NULL,
    tipo ENUM('UTILITARIO','PASSEIO') NOT NULL,
    status ENUM('DISPONIVEL','EM_USO','INDISPONIVEL') NOT NULL DEFAULT 'DISPONIVEL',
    km_atual INT NOT NULL DEFAULT 0,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
    );

-- 3. TIPO DE SERVIÇO
CREATE TABLE IF NOT EXISTS tipo_servico (
                                            id    INT          NOT NULL AUTO_INCREMENT,
                                            nome  VARCHAR(120) NOT NULL UNIQUE,
    ativo BOOLEAN      NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
    );

-- 4. TIPO DE DESPESA
CREATE TABLE IF NOT EXISTS tipo_despesa (
                                            id INT NOT NULL AUTO_INCREMENT,
                                            nome VARCHAR(50) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
    );

-- 5. CIDADE
CREATE TABLE IF NOT EXISTS cidade (
                                      id INT NOT NULL AUTO_INCREMENT,
                                      nome VARCHAR(100) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
    );

-- 6. TIPO DE COMBUSTÍVEL
CREATE TABLE IF NOT EXISTS tipo_combustivel (
                                                id INT NOT NULL AUTO_INCREMENT,
                                                nome VARCHAR(50) NOT NULL UNIQUE,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
    );

-- 7. ORDEM DE SERVIÇO
CREATE TABLE IF NOT EXISTS ordem_servico (
                                             id INT NOT NULL AUTO_INCREMENT,
                                             viatura_id INT NOT NULL,
                                             usuario_id INT NOT NULL,
                                             tipo_servico_id INT NOT NULL,
                                             cidade_id INT NULL,
                                             tipo_despesa_id INT NULL,
                                             km_saida INT NOT NULL,
                                             km_chegada INT NULL,
                                             horario_saida DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                             horario_chegada DATETIME NULL,
                                             status ENUM('ABERTA','ENCERRADA','CANCELADA') NOT NULL DEFAULT 'ABERTA',
    observacao TEXT NULL,
    numero_os_externo VARCHAR(20) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_os_viatura FOREIGN KEY (viatura_id) REFERENCES viatura(id),
    CONSTRAINT fk_os_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_os_tipo_servico FOREIGN KEY (tipo_servico_id) REFERENCES tipo_servico(id),
    CONSTRAINT fk_os_cidade FOREIGN KEY (cidade_id) REFERENCES cidade(id),
    CONSTRAINT fk_os_tipo_despesa FOREIGN KEY (tipo_despesa_id) REFERENCES tipo_despesa(id)
    );

-- 7. ABASTECIMENTO
CREATE TABLE IF NOT EXISTS abastecimento (
                                             id INT NOT NULL AUTO_INCREMENT,
                                             os_id INT NULL,
                                             viatura_id INT NOT NULL,
                                             usuario_id INT NOT NULL,
                                             tipo_combustivel VARCHAR(20) NOT NULL,
    litros DECIMAL(8,3) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    km_abastecimento INT NOT NULL,
    numero_nf VARCHAR(50) NULL,
    data_abastecimento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    observacao TEXT NULL,
    comprovante LONGBLOB NULL,
    comprovante_tipo VARCHAR(50) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_abast_os FOREIGN KEY (os_id) REFERENCES ordem_servico(id),
    CONSTRAINT fk_abast_viatura FOREIGN KEY (viatura_id) REFERENCES viatura(id),
    CONSTRAINT fk_abast_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );

-- 8. DESPESA
CREATE TABLE IF NOT EXISTS despesa (
                                       id  INT NOT NULL AUTO_INCREMENT,
                                       os_id INT NOT NULL,
                                       tipo_despesa_id INT NOT NULL,
                                       valor DECIMAL(10,2) NOT NULL,
    observacao TEXT NULL,
    data_despesa DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_despesa_os FOREIGN KEY (os_id) REFERENCES ordem_servico(id),
    CONSTRAINT fk_despesa_tipo FOREIGN KEY (tipo_despesa_id) REFERENCES tipo_despesa(id)
    );

-- 9. MANUTENÇÃO
CREATE TABLE IF NOT EXISTS manutencao (
                                          id INT NOT NULL AUTO_INCREMENT,
                                          viatura_id  INT NOT NULL,
                                          usuario_id  INT NOT NULL,
                                          tipo ENUM('PREVENTIVA','CORRETIVA','INUTILIDADE','OUTROS') NOT NULL,
    descricao   TEXT NOT NULL,
    data_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    data_fim DATETIME NULL,
    custo DECIMAL(10,2) NULL,
    km_registro INT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_manut_viatura FOREIGN KEY (viatura_id) REFERENCES viatura(id),
    CONSTRAINT fk_manut_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
    );