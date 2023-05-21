const mongoose = require("mongoose");
require("./order.model.js");
require("./message.model.js");

const Schema = mongoose.Schema;

const productSchema = new Schema(
    {
        title: {
            type: String,
        },
        brand: {
            type: String,
        },
        type: {
            type: String,
        },
        price: {
            type: Number,
        },
        quantity: {
            type: Number,
        },
        discount: {
            type: Number,
        },
        description: {
            type: String,
        },
        img: {
            type: String,
        },
        messagesList: [{ type: Schema.Types.ObjectId, ref: "Message" }],
        ordersList: [{ type: Schema.Types.ObjectId, ref: "Order" }],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
