import { expect } from 'chai';
import mongoose from "mongoose";
import supertest from "supertest";

const requester = supertest('http://localhost:8080');

mongoose.connect(`mongodb+srv://Mongojoje:Mongojoje@cluster0.z5uj2rj.mongodb.net/swagger?retryWrites=true&w=majority&appName=Cluster0`);

describe('CRUD Operations for Carts', () => {
    // Create Cart
    it('Should create a new cart', async function () {
        const response = await requester.post('/api/carts').send({
            user: 'userId',
            products: []
        });

        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('_id');
        expect(response.body).to.have.property('user');
        expect(response.body).to.have.property('products').that.is.an('array');
    });

    // Get Cart by ID
    it('Should get a cart by ID', async function () {
        const cart = await requester.post('/api/carts').send({
            user: 'userId',
            products: []
        });
        const cartId = cart.body._id;

        const response = await requester.get(`/api/carts/${cartId}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('_id').that.equals(cartId);
    });

    // Update Cart
    it('Should update an existing cart', async function () {
        const cart = await requester.post('/api/carts').send({
            user: 'userId',
            products: []
        });
        const cartId = cart.body._id;

        const response = await requester.put(`/api/carts/${cartId}`).send({
            products: [{ product: 'productId', quantity: 2 }]
        });

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('products').that.is.an('array').with.lengthOf(1);
        expect(response.body.products[0]).to.have.property('quantity').that.equals(2);
    });

    // Delete Cart
    it('Should delete a cart by ID', async function () {
        const cart = await requester.post('/api/carts').send({
            user: 'userId',
            products: []
        });
        const cartId = cart.body._id;

        const response = await requester.delete(`/api/carts/${cartId}`);

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message').that.equals('Cart deleted successfully');
    });

    // Additional Test: Handling invalid cart ID
    it('Should return an error for invalid cart ID', async function () {
        const response = await requester.get('/api/carts/invalidCartId');

        expect(response.status).to.equal(400);
        expect(response.body).to.have.property('error').that.equals('Invalid cart ID');
    });
});