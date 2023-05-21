const mongoose = require("mongoose");
require("./order.model.js");
require("./message.model.js");

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        phone: {
            type: Number,
        },
        password: {
            type: String,
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            required: [true, "password phone can't be blank"],
        },
        address1: {
            type: String,
        },
        address2: {
            type: String,
        },
        rol: {
            type: String,
        },
        ordersList: [{ type: Schema.Types.ObjectId, ref: "Order" }],
        messagesList: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
