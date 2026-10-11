const app = require('express')();
const { readFile } = require('fs').promises;

app.get('/', async (req, res) => 
    res.send(await readFile('./home.html', 'utf-8'))
);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app started on http://localhost:${port}`));