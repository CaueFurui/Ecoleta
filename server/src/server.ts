import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

// Rota: Endereço completo da Requisição
// Recurso: Qual entidade estamos acessando do sistema

// Request Param: Parâmetros que vem na própria rota que identificam um recurso
// Query Param: Parâmetros que vem na própria rota geralmente opcionais para filtros, paginação
// Request Body: Parâmetros para criação/atualização de informações

const users = [
    'Diego',
    'Cleiton',
    'Robson'
];

app.listen(3333);