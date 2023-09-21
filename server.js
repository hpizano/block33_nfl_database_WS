const pg = require('pg');
const cors = require('cors');
const morgan = require('morgan');
const client = new pg.Client('postgres://localhost/nfl_backend_db')
const express = require('express');
const app = express();
app.use(cors());
app.use(morgan('dev'))
app.use(express.json())


app.get('/api/players', async(req, res, next)=> {
    try {
        const SQL = `
        SELECT * FROM players
        `;
        const response = await client.query(SQL);
        res.send(response.rows);
    }
    catch(error){
        next(error);
    }
})

app.get('/api/players/:id', async(req,res,next) => {
    try {
        const SQL = `
            SELECT * FROM players
            WHERE id = $1
        `;
        const response = await client.query(SQL, [req.params.id]);
        res.send(response.rows[0]);
    } catch(error){
        next(error);
    };
});

app.delete('/api/players/:id', async(req, res, next) => {
    try{
        const SQL = `
        DELETE FROM players
        WHERE id = $1
        `
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows);
    } catch(error){
        next(error);
    }
})

app.post('/api/players', async(req,res,next) => {
    // const body = req.body
    try{
        const SQL = `
        INSERT INTO players(name, position)
        VALUES($1, $2)
        RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.position])
        res.send(response.rows)
    }catch(error){
        next(error);
    }
})

app.put('/api/players/:id', async(req,res,next) => {
    try{
        const SQL = `
        UPDATE players 
        SET name = $1, position = $2
        WHERE id = $3
        RETURNING *
        `;
        const response = await client.query(SQL, [req.body.name, req.body.position, req.params.id])
        res.send(response.rows)
    } catch(error){
        next(error);
    }
})

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
    INSERT INTO players(name, position) values('Stefon Diggs', 'WR');

    `;
    await client.query(SQL);
    console.log('tables created')
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, ()=> console.log(`listening on port ${PORT}`));
};

start();