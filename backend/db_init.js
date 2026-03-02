const mysql = require('mysql2/promise');

async function initDB() {
    const connection = await mysql.createConnection({
        host: 'benserverplex.ddns.net',
        user: 'alunos',
        password: 'senhaAlunos',
        database: 'web3ma'
    });

    console.log('Conectado ao banco de dados web3ma...');

    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`João Pedro Fernandes\` (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                categoria VARCHAR(100) NOT NULL,
                descricao TEXT,
                preco DECIMAL(10, 2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await connection.query(createTableQuery);
        console.log('Tabela "João Pedro Fernandes" criada ou já existente.');

        const [rows] = await connection.query('SHOW TABLES LIKE "João Pedro Fernandes"');
        console.log('Verificação final:', rows);

    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
    } finally {
        await connection.end();
    }
}

initDB();
