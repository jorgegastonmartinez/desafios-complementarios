import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { expect } from 'chai';
import supertest from 'supertest';
import Products from '../desafio_complementario_clase_41/src/dao/product/product.dao.js';

dotenv.config();
const mongoUrl = process.env.MONGO_URL;
const requester = supertest('http://localhost:8080')

before (function () {
    this.timeout(10000);
    try {
        mongoose.connect(mongoUrl);
        console.log('Conectado a la base de datos para pruebas');
    } catch (error) {
        console.error('Error conectando a la base de datos', error);
    }
});

describe('Testing E-commerce', () => {
    describe('Test para products', () => {
        before(function () {
            this.productsDao = new Products()
        })

        it('Debe crear un producto correctamente', async () => {
            const mockProduct = {
                title: "title product test3",
                description: "description del producto test45435435",
                code: "newcodetest3",
                price: 24,
                stock: 45,
                category: "testing"
            }
            const { statusCode, ok, _body } = await requester.post('/api/products').send(mockProduct);
            console.log(statusCode);
            console.log(ok);
            console.log(_body);

            expect(statusCode).to.equal(201);
            expect(ok).to.be.true;
        })

        it('Debe devolver un status 400 al intentar crear un producto sin el campo title', async () => {
            const productTitle = {
                description: "description del producto test2",
                code: "newcodetest",
                price: 24,
                stock: 45,
                category: "testing"
            };

            const { statusCode, _body } = await requester.post("/api/products").send(productTitle);

            expect(statusCode).to.equal(400);
            expect(_body).to.have.property('status').that.equals('error')
        })

        it('El endpoint GET /api/products debe devolver un status "success" y un payload que sea un arreglo', async () => {
            const { statusCode, _body } = await requester.get('/api/products');
            
            expect(statusCode).to.equal(200);
            expect(_body).to.have.property('status').that.equals('success');
            expect(_body).to.have.property('payload').to.be.an('array');
        });

        it('El método PUT debe poder actualizar correctamente un producto determinado', async () => {
            const newProdPut = {
                title: "title product modificated",
                description: "description del producto test to modificated",
                code: "newcodedemod",
                price: 45,
                stock: 35,
                category: "testing"
            }

            const postResponse = await requester.post("/api/products").send(newProdPut)
            const prodIdToPut = postResponse._body.payload._id
            const deleteResponse = await requester.delete(`/api/products/${prodIdToPut}`)

            expect(deleteResponse.statusCode).to.equal(200)
        })

        it('El método DELETE debe eliminar el ultimo producto agregado', async () => {
            const newProdDelete = {
                title: "title product delete2",
                description: "description del producto test to delete2",
                code: "newcodedelete24",
                price: 55,
                stock: 35,
                category: "testing"
            }

            const postResponse = await requester.post("/api/products").send(newProdDelete)
            const prodIdToDelete = postResponse._body.payload._id
            const deleteResponse = await requester.delete(`/api/products/${prodIdToDelete}`)

            expect(deleteResponse.statusCode).to.equal(200)
        })
    })
});