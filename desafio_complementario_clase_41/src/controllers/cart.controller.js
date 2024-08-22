import CartDAO from '../dao/cart/cart.dao.js'; 

const cartDAO = new CartDAO();

export const createCart = async (req, res) => {
    try {
        const cartData = req.body;
        const cart = await cartDAO.create(cartData);
        res.status(201).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const getAllCarts = async (req, res) => {
    try {
        const carts = await cartDAO.getAll();
        res.status(200).json({ status: 'success', payload: carts });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const { cartId } = req.params;
        const cart = await cartDAO.getById(cartId);
        res.status(200).json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};

export const updateCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        const cartData = req.body;
        const updatedCart = await cartDAO.update(cartId, cartData);
        res.status(200).json({ status: 'success', payload: updatedCart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const { cartId } = req.params;
        await cartDAO.delete(cartId);
        res.status(200).json({ status: 'success', message: 'Carrito eliminado correctamente' });
    } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
    }
};