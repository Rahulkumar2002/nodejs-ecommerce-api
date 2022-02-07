const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const cryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register

router.post("/register", async (req, res) => {
    //Using try and catch block to catch any error .
    try {
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
        })
        //It will save our model to our DB with this save method .
        const user = await newUser.save();
        //I am sending status code and json object of the newUser model.
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

//LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json("Wrong Credential!");

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);

        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        OriginalPassword !== req.body.password && res.status(401).json("Wrong Password!");

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;

        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err)
    }

})

module.exports = router;