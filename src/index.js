const { board_update_handler, drop_coin_handler } = require('./c4server.js');
const app = require('express')();
const { readFile } = require('fs').promises;

app.use(require('express').json());

app.get('/', async (req, res) => 
    res.send(await readFile('./home.html', 'utf-8'))
);

// set up cors headers for all requests below that need it

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Auth-Token, lobby_id, player_id, player_name');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.get('/board_updates', board_update_handler);
app.post('/drop_coin', drop_coin_handler);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app started on http://localhost:${port}`));