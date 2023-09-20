const pg = require('pg');
const client = new pg.Client('postgres://localhost/nfl_backend_db')

const start = async() => {
    await client.connect();
    console.log('connected');
    const SQL = `
    DROP TABLE IF EXISTS players;
    CREATE TABLE players(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        position VARCHAR(10)
    );
    INSERT INTO players(name, position) values('Aaron Rodgers', 'QB');
    INSERT INTO players(name, position) values('Aaron Jones', 'RB');
    INSERT INTO players(name, position) values('Patrick Mahomes', 'QB');

    `;
    await client.query(SQL);
    console.log('tables created')
};

start();