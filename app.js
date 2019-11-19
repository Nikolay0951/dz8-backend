const express = require('express');
const cors = require('cors');

let nextId = 1;
const posts = [];

const server = express();
server.use(express.json());
server.use(cors());

server.get('/posts', (req, res) => {
    res.send(posts);
});

server.post('/posts', (req, res) => {
    posts.push({
        id: nextId++,
        content: req.body.content,
        type: req.body.type,
        likes: 0,
    })

    res.send(posts);
});

server.delete('/posts/:id', (req, res) => {
    const id = Number(req.params['id']);
    const index = posts.findIndex((o) => {
        return o.id === id;
    });

    if (index === -1) {
        res.status(404).send({ error: 'id.not_found' });
        return;
    }

    const removed = posts.splice(index, 1);
    res.send(posts);
});

server.post('/posts/:id/likes', (req, res) => {
    const id = Number(req.params['id']);
    const index = posts.findIndex((o) => {
        return o.id === id;
    });

    if (index === -1) {
        res.status(404).send({ error: 'id.not_found' });
        return;
    }

    posts[index].likes++;
    res.send(posts[index]);
});

server.delete('/posts/:id/likes', (req, res) => {
    const id = Number(req.params['id']);
    const index = posts.findIndex((o) => {
        return o.id === id;
    });

    if (index === -1) {
        res.status(404).send({ error: 'id.not_found' });
        return;
    }

    posts[index].likes--;
    res.send(posts[index]);
});
