const EventEmitter = require('events');
const eventManager = new EventEmitter();

lobbies = {}

function board_update_handler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');


    // get the lobby_id, player_id, and player_name from the request headers
    const lobby_id = req.get('lobby_id');
    const player_id = req.get('player_id');
    const player_name = req.get('player_name');


    const onBoardUpdate = (data) => {
        if (data.lobby_id === req.get('lobby_id'))
            res.write(`event: update-board\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
    }


    const updateNames = () => {
        res.write(`event: update-name\n`);
        res.write(`data: ${JSON.stringify(lobbies[req.get('lobby_id')])}\n\n`);
    }


    // listner for board update
    eventManager.on('update_board', onBoardUpdate)
    eventManager.on('update_name', updateNames)


    add_player_to_lobby(lobby_id, player_id, player_name)


    // 4. Clean up the interval if the client closes the tab
    req.on('close', () => {
        res.end();
        // console.log("Connection closed")
        eventManager.removeListener('update_name', updateNames)
        remove_player_from_lobby(lobby_id, player_id, player_name)
        return
    });
}

function drop_coin_handler(req, res) {
    var data = req.body;
    data.user_id = req.get('Auth-Token');
    data.lobby_id = req.get('lobby_id')


    eventManager.emit('update_board', data);


    // Always send a response back so Godot's request_completed signal fires
    res.status(200).json({
        status: "success",
        message: "Coin position updated on server"
    });
}


function add_player_to_lobby(lobby_id, player_id, player_name) {
    if (!(lobby_id in lobbies)) {
        lobbies[lobby_id] = {}
    }


    lobbies[lobby_id][player_id] = player_name
    // console.log(lobbies)
    eventManager.emit('update_name', "")
}


function remove_player_from_lobby(lobby_id, player_id, player_name) {
    delete lobbies[lobby_id][player_id]
    if (Object.keys(lobbies[lobby_id]).length == 0) {
        delete lobbies[lobby_id]
    }
}

module.exports = {
    board_update_handler,
    drop_coin_handler
}