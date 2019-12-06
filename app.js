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
    const newPost = {
        id: nextId++,
        content: req.body.content,
        likes: 0,
        type: req.body.type
    }
    posts.push(newPost)
    res.send(newPost);
})

server.delete('/posts/:id', (req, res) => {
    const id = +req.params['id'];
    const index = posts.findIndex((o) => {
        return o.id === id;
    });
    if (index === -1) {
        res.send();
        return;
    }
    posts.splice(index, 1);
    res.end();
})

server.post('/posts/:id/likes', (req, res) => {
    const id = +req.params['id'];
    const index = posts.findIndex((post) => {
        return post.id === id;
    });
    posts[index].likes++;
    res.send(`${posts[index].likes}`);
});

server.delete('/posts/:id/likes', (req, res) => {
    const id = +req.params['id'];
    const index = posts.findIndex((o) => {
        return o.id === id;
    });
    posts[index].likes--
    res.send(`${posts[index].likes}`);
});

server.listen(process.env.PORT || '9999');