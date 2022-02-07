const router = require("express").Router();
const Cart = require("../models/Cart");
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("./verifyToken");

//Create Cart

router.post("/", verifyToken, async (req, res) => {
    try {
        const newCart = await Cart(req.body);
        const savedCart = await newCart.save();

        res.status(200).json(savedCart);
    } catch (err) { res.status(500).json(err); }
});

//Update Cart

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete Cart

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted....")
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get User Cart

router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.id });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
})

//Get All

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) { res.status(500).json(err) }
})
module.exports = router;