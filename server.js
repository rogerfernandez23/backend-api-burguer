const express = require('express');
const app = express();
app.use(express.json());
const uuid = require('uuid');
const cors = require('cors');
app.use(cors());

const listOrder = [];

const checkId = (request, response, next) => {
    const {id} = request.params;
    const index = listOrder.findIndex(user => user.id === id);
    if(index < 0){
        return response.status(404).json({error: 'User Not Found'});
    }

    request.userIndex = index;
    request.userId = id;

    next();
}


const method = (request, response, next) => {
    console.log(`Método: ${request.method} URL: ${request.url}`);
    next();
}

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server starded on port ${port}`);
});


app.get('/storage/order', method, (request, response) => {
    return response.json(listOrder);
})

app.get('/storage/order/:id', method, checkId, (request, response) => {
    const index = request.userIndex;

    return response.json(listOrder[index]);
})

app.post('/storage/order', method, (request, response) => {
    const{order, name, price, status} = request.body;
    const listUser = {id:uuid.v4(), order, name, price, status};

    listOrder.push(listUser);
    return response.status(201).json(listUser);
})

app.put('/storage/order/:id', method, checkId, (request, response) => {
    const{order, name, price, status} = request.body;
    const index = request.userIndex;
    const id = request.userId;

    const orderUpdate = {id, order, name, price, status};   
    listOrder[index] = orderUpdate;
    return response.json(orderUpdate);
})

app.delete('/storage/order/:id', method, checkId, (request, response) => {
    const index = request.userIndex;
    listOrder.splice(index, 1);

    return response.status(204).json();
})

app.patch('/storage/order/:id', method, checkId, (request, response) => {
    const index = request.userIndex;
    listOrder[index].status = "Pronto";

    return response.json(listOrder[index]);
})