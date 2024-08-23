import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { expect } from 'chai';
import supertest from 'supertest';

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

describe('Testing E-commerce - Sessions', () => {
    it('Debe manejar correctamente los intentos fallidos de inicio de sesión', async () => {
        const mockUserLogin = {
            email: "unregistered@mail.com",
            password: "wrongpassword"
        };
    
        const response = await requester
            .post('/api/sessions/login')
            .send(mockUserLogin)
            .redirects(0);
    
        expect(response.statusCode).to.equal(400); 
        expect(response.text).to.include('Error al iniciar sesión');
    });

    it('Debe iniciar sesión correctamente', async () => {
        const mockUserLogin = {
            email: "newuser@mail.com",
            password: "1234"
        };
    
        const response = await requester
            .post('/api/sessions/login')
            .send(mockUserLogin)
            .redirects(0);

        expect(response.statusCode).to.equal(302);
        expect(response.headers.location).to.equal('/products'); 
    
        const cookie = response.headers['set-cookie'];
        expect(cookie).to.be.an('array').that.is.not.empty;
    
        const cookieValue = cookie[0].split(';')[0].split('=')[1];
        expect(cookieValue).to.be.a('string').that.is.not.empty;
    });

    it('Debe cerrar sesión correctamente', async () => {
        const loginResponse = await requester.post('/api/sessions/login').send({
            email: "testuser@example.com",
            password: "password123"
        });

        const logoutResponse = await requester.post('/api/sessions/logout');

        expect(logoutResponse.statusCode).to.equal(302); 
        expect(logoutResponse.header.location).to.equal('/login');
    });
});