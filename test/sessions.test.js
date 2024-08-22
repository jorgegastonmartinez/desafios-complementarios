import dotenv from 'dotenv';
import mongoose from 'mongoose';
// import chai from 'chai';
import { expect } from 'chai';
import supertest from 'supertest';
import Users from '../desafio_complementario_clase_41/src/dao/user/user.dao.js';

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

// const expect = chai.expect;
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


describe('Testing Users', () => {
    describe('Test para users', () => {

        before(function () {
            this.usersDao = new Users()
        })
    
        // registro de un usuario
        // definimos la cookie ya que alli vamos a verificar que la info se este almacenando correctamente
        let cookie;
        it('Debe registrar correctamente a un usuario', async function () {
            const mockUser = {
                first_name: "Roberto",
                last_name: "Espinosa",
                email: "correorob@mail.com",
                age: 24,
                password: "1234"
            }
            const { _body } = await requester.post('/api/user').send(mockUser);

            console.log(_body);

            // Sólo nos basta que este definido el payload, indicando que tiene un _id registrado
            expect(_body.payload).to.be.ok;
        })

        // Login con los datos del usuario
        // necesitamos esperar (expect) 3 cosas: que el resultado de la cookie realmente funcione, que la cookie final tenga el nombre de "coderCookie" (que es el nombre que se setea desde el endpoint), y el valor que este definido.
        it('Debe loguear correctamente al usuario y DEVOLVER UNA COOKIE', async function () {
            // enviamos al login los mismos datos del usuario que recien registramos arriba
            const mockUser = {
                email: "correorob@mail.com",
                password: "1234"
            }
            // Ahora, obtendremos de supertest los headers de la respuesta y extraemos el header "set-cookie"
            // En caso de que venga correctamente, significa que efectivamente el endpoint devuelve una cookie.
            // Guardamos el valor de la cookie en la variable "cookie" declarada al principio
            
            const result = await requester.post('/api/sessions/login').send(mockUser);
            const cookieResult = result.headers['set-cookie'][0]

            expect(cookieResult).to.be.ok;

            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }

            expect(cookie.name).to.be.ok.and.eql('coderCookie');
            expect(cookie.value).to.be.ok;
        })

        // 3. Enviando la cookie recibida por el login
        // este endpoint indicamos que cuando envie la cookie al servidor, este deberia traerme el usuario guardado en el token.
        // con esto cumplimos el flujo de register, login y current

        it('Debe enviar la cookie que contiene el usuario y destructurar éste correctamente', async function () {
            // Enviamos la cookie que guardamos arriba a partir de un set
            const { _body } = await requester.get('/api/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])

            // Luego, el método current deberia devolver el correo del usuario que se guardo desde el login.
            // indicando efectivamente que se guardo una cookie con el valor del usuario (correo)
            expect(_body.payload.email).to.be.eql('correomau@mail.com')
        })
    })
})