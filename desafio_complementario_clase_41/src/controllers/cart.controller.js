import cartsModel from '../models/cart.model.js';

// Crear un nuevo carrito
export const createCart = async (req, res) => {
    try {
        const newCart = new cartsModel(req.body);
        const savedCart = await newCart.save();
        res.status(201).send({ result: "success", payload: savedCart });
    } catch (error) {
        console.error("Error creando el carrito", error);
        res.status(500).send({ error: "Error creando el carrito" });
    }
};

// Obtener un carrito por ID
export const getCartById = async (req, res) => {
    const { id } = req.params;
    try {
        const cart = await cartsModel.findById(id).populate('products.product').populate('user');
        if (!cart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }
        res.send({ result: "success", payload: cart });
    } catch (error) {
        console.error("Error obteniendo el carrito", error);
        res.status(500).send({ error: "Error obteniendo el carrito" });
    }
};

// Actualizar un carrito por ID
export const updateCart = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCart = await cartsModel.findByIdAndUpdate(id, req.body, { new: true }).populate('products.product').populate('user');
        if (!updatedCart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }
        res.send({ result: "success", payload: updatedCart });
    } catch (error) {
        console.error("Error actualizando el carrito", error);
        res.status(500).send({ error: "Error actualizando el carrito" });
    }
};

// Eliminar un carrito por ID
export const deleteCart = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCart = await cartsModel.findByIdAndDelete(id);
        if (!deletedCart) {
            return res.status(404).send({ error: "Carrito no encontrado" });
        }
        res.send({ result: "success", payload: deletedCart });
    } catch (error) {
        console.error("Error eliminando el carrito", error);
        res.status(500).send({ error: "Error eliminando el carrito" });
    }
};
