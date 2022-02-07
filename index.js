const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const port = process.env.PORT || "8800";
const userRoutes = require("./routes/user.js");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const cartRoutes = require("./routes/cart");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Successfully Connected to MongoDB")
    })
    .catch((err) => {
        console.log("This error is coming when we try to connect with MongoDB : \n" + err);
    });

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes middleware 

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);


app.listen(port, () => {
    console.log("App is listening at localhost:" + port);
});