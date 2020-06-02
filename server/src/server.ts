import express from 'express';

const app = express();

app.get("/users", (req, res) => {
    console.log("Listagem de usuários");


    res.json([
        'Diego 5000',
        'Cleiton',
        'Robson'
    ]);
});

app.listen(3333);