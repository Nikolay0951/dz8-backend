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


server.get('/posts/seenPosts/:lastSeenId', (req, res) => {
    const lastSeenId = +req.params['lastSeenId']
    let lastPosts;
    if (lastSeenId === 0) {
        lastPosts = posts.length < 5 ? posts : posts.slice(posts.length - 5);
    } else {
        const sortedPosts = posts.filter(post => post.id < lastSeenId);
        lastPosts = sortedPosts.length < 5 ? sortedPosts : sortedPosts.slice(sortedPosts.length - 5);    
    }
    res.send(lastPosts);
});

server.get('/posts/newPosts/:firstSeenId', (req, res) => {
    const firstSeenId = +req.params['firstSeenId'];
    const lastPosts = posts.filter(post => post.id > firstSeenId);
    res.send(lastPosts);
})

server.get('/posts/poll-seenPosts/:fifthPostId', (req, res) => {
    const fifthPostId = +req.params['fifthPostId'];
    if (fifthPostId === posts[0].id) {
        res.send(true);
        return;
    }
    res.send(false);    
})

server.get('/posts/poll/:firstSeenId', (req, res) => {
    const newPostId = +req.params['firstSeenId'];
    if (posts.length === 0) {
        res.send(false);
        return;
    } else if (newPostId < posts[posts.length - 1].id) {
        res.send(true);
        return;
    }
    res.send(false);
})

server.listen(process.env.PORT || '9999');