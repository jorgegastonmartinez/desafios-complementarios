import Carts from "../../models/cart.model.js";
import mongoose from "mongoose";


export default class CartDAO {
    async create(cartData) {
        try {
            const cart = new Carts(cartData);
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al crear el carrito: ' + error.message);
        }
    }

    async getAll() {
        try {
            const carts = await Carts.find().populate('products.product').populate('user');
            return carts;
        } catch (error) {
            throw new Error('Error al obtener carritos: ' + error.message);
        }
    }

    async getById(cartId) {
        try {
            const cart = await Carts.findById(cartId).populate('products.product').populate('user');
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error('Error al obtener el carrito: ' + error.message);
        }
    }

    async update(cartId, cartData) {
        try {
            const cart = await Carts.findByIdAndUpdate(cartId, cartData, { new: true });
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar el carrito: ' + error.message);
        }
    }

    async delete(cartId) {
        try {
            const result = await Carts.findByIdAndDelete(cartId);
            if (!result) {
                throw new Error('Carrito no encontrado');
            }
            return result;
        } catch (error) {
            throw new Error('Error al eliminar el carrito: ' + error.message);
        }
    }
}