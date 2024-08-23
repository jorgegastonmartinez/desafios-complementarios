import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { expect } from 'chai';
import supertest from 'supertest';
import Carts from '../desafio_complementario_clase_41/src/dao/cart/cart.dao.js';

dotenv.config();
const mongoUrl = process.env.MONGO_URL;
const requester = supertest('http://localhost:8080');

before(function () {
    this.timeout(10000);
    try {
        mongoose.connect(mongoUrl);
        console.log('Conectado a la base de datos para pruebas');
    } catch (error) {
        console.error('Error al conectar con la base de datos', error);
    }
});

describe('Testing E-commerce - Carts', () => {
    describe('Test para carts', () => {
        before(function () {
            this.cartsDao = new Carts();
        });

        it('Debe crear un carrito correctamente', async () => {
            const mockCart = {
                user: '66c7c7d818922049e68ce615',
                products: [
                    {
                        product: '66c7b7ad27cc34d97561d32e',
                        quantity: 2
                    }
                ]
            };

            const { statusCode, ok, _body } = await requester.post('/api/carts').send(mockCart);
            console.log(statusCode);
            console.log(ok);
            console.log(_body);

            expect(statusCode).to.equal(201);
            expect(ok).to.be.true;
        });

        it('Debe devolver un status 400 al intentar crear un carrito sin el campo user', async () => {
            const cartWithoutUser = {
                products: [
                    {
                        product: '66c7b7ad27cc34d97561d32e',
                        quantity: 2
                    }
                ]
            };

            const { statusCode, _body } = await requester.post('/api/carts').send(cartWithoutUser);

            expect(statusCode).to.equal(400);
            expect(_body).to.have.property('status').that.equals('error');
        });

        it('El endpoint GET /api/carts debe devolver un status "success" y un payload que sea un arreglo', async () => {
            const { statusCode, _body } = await requester.get('/api/carts');
            
            expect(statusCode).to.equal(200);
            expect(_body).to.have.property('status').that.equals('success');
            expect(_body).to.have.property('payload').to.be.an('array');
        });

        it('El método DELETE debe eliminar un carrito existente en MongoDB', async () => {
            const CartId = '668c559d4d781575967ddb8a'; 
        
            const deleteResponse = await requester.delete(`/api/carts/${CartId}`);
        
            expect(deleteResponse.statusCode).to.equal(200);
            expect(deleteResponse._body).to.have.property('status').that.equals('success');
            expect(deleteResponse._body).to.have.property('message').that.equals('Carrito eliminado correctamente');
        });
    });
});