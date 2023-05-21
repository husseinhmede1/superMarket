const mongoose = require("mongoose");
require("./user.model.js");
require("./product.model.js");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    isSent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
