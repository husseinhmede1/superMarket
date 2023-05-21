const router = require("express").Router();
const VerifyAdminToken =
    require("../controllers/AuthController").verifyAdminToken;
const StaticTypes = require("../controllers/AuthController").staticTypes;

let User = require("../models/user.model");
let Product = require("../models/product.model");
let Order = require("../models/order.model");
let Message = require("../models/message.model");


// //get all types
router.get("/getAllTypes",
    StaticTypes,
    VerifyAdminToken,
    async function (req, res, next) {
        const typeSearch = req.query.typeSearch;
        const typesArray = [];
        if (typeSearch === 'null') {
            return res.send(req.types);
        }
        req.types.map(type => {
            if (type.typeName.includes(typeSearch))
                typesArray.push(type)
        })

        return res.send(typesArray);
    });



//admin can add a new product
router.post("/addProduct", VerifyAdminToken, async function (req, res) {
    const title = req.body.title;
    const brand = req.body.brand;
    const type = req.body.type;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const discount = req.body.discount;
    const description = req.body.description;
    const img = req.body.img;
    // add new product  
    const newProduct = new Product({
        title,
        brand,
        type,
        price,
        quantity,
        discount,
        description,
        img,
    });

    newProduct
        .save()
        .then(() => {
            res.send("Product created successfully");
        })
        .catch((err) => res.status(500).json({ message: err }));
});

//admin can edit the product
router.post("/editProduct", VerifyAdminToken, async function (req, res) {
    const idProduct = req.body.idProduct;
    const title = req.body.title;
    const brand = req.body.brand;
    const type = req.body.type;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const discount = req.body.discount;
    const description = req.body.description;
    const img = req.body.img;


    Product.findById(idProduct)
        .then((item) => {
            item.title = title;
            item.brand = brand;
            item.type = type;
            item.price = price;
            item.quantity = quantity;
            item.discount = discount;
            item.description = description;
            item.img = img;
            item.save()
                .then(() => {
                    res.send("Product edited successfully");
                })
                .catch((err) => res.status(500).json({ message: err }));
        })
        .catch((err) => res.status(500).json({ message: err }));
});

router.get('/deleteProduct', VerifyAdminToken, async function (req, res, next) {
    const productId = req.query.productId;
    Product.deleteOne({ _id: productId })
        .then((p) => {
            res.json("product deleted successfully")
        })
        .catch((err) => res.status(400).json("Error: " + err));
})




// admin can get all the products by typeName with params: range, brand.
router.get(
    "/getProductByType",
    VerifyAdminToken,
    async function (req, res) {
        const typeName = req.query.typeName;
        const minRange = parseInt(req.query.minRange);
        const maxRange = parseInt(req.query.maxRange);
        let brand = req.query.brand;
        let products = null;

        if (typeName != 'null')
            products = await Product.find({ type: { $regex: typeName, $options: 'i' } });
        if (typeName === 'null')
            products = await Product.find();

        let productsResponse = []
        products.forEach((item) => {
            if (item.price >= minRange && item.price <= maxRange) {
                if (brand != 'null') {
                    if (item.brand.includes(brand))
                        productsResponse.push(item);
                }
                else {
                    productsResponse.push(item);
                }
            }
        })
        res.json(productsResponse);
    }
);

// admin can get all the products by typeName with params: range, brand.
router.get(
    "/getUsersByPhone",
    VerifyAdminToken,
    async function (req, res) {
        let phone = 'null';
        if (req.query.phone != 'null') {
            phone = parseInt(req.query.phone);
        }

        let users = null;
        if (phone != 'null')
            users = await User.find({ phone: phone })
                .catch((err) => res.status(400).json("Error: " + err));
        if (phone === 'null')
            users = await User.find()
                .catch((err) => res.status(400).json("Error: " + err));


        res.json(users);
    }
);


//user can edit a message
router.post("/changeStatus", VerifyAdminToken, async function (req, res) {
    const orderId = req.body.orderId;
    Order.findById(orderId)
        .then((o) => {
            Product.findById(o.productId)
                .then((p) => {
                    p.quantity = p.quantity - o.quantity;
                    p.save()
                        .then(() => {
                            o.status = 'delivered';
                            o.save()
                                .then(() => {
                                    res.send("message isSent");
                                })
                        })
                })
        })
        .catch((err) => res.status(500).json({ message: err }));
});

// admin can get all the products by typeName with params: range, brand.
router.get(
    "/getOrders",
    VerifyAdminToken,
    async function (req, res) {
        const status = req.query.status;
        let userId = null;
        let phone = 'null';

        if (req.query.phone != 'null') {
            phone = parseInt(req.query.phone);
            let users = await User.findOne({ phone: phone })
            userId = users._id;
        }

        let orders = null;
        if (status != 'all') {
            if (userId === null)
                orders = await Order.find({ status: { $regex: status, $options: 'i' } })
                    .populate("userId")
                    .populate("productId");
            if (userId != null)
                orders = await Order.find({ $and: [{ userId: userId }, { status: { $regex: status, $options: 'i' } }] })
                    .populate("userId")
                    .populate("productId");
        }
        if (status === 'all') {
            if (userId === null)
                orders = await Order.find()
                    .populate("userId")
                    .populate("productId");
            if (userId != null)
                orders = await Order.find({ userId: userId })
                    .populate("userId")
                    .populate("productId");
        }
        res.json(orders);
    }
);


// admin can get all the products by typeName with params: range, brand.
router.get(
    "/getMessages",
    VerifyAdminToken,
    async function (req, res) {
        messages = await Message.find()
            .populate("userId")
            .populate("productId")

        res.json(messages);
    }
);

//user can edit a message
router.post("/postInStock", VerifyAdminToken, async function (req, res) {
    const userId = req.body.userId;
    const productId = req.body.productId;
    Message.findOne({ $and: [{ userId: userId }, { productId: productId }, { isSent: "0" }] })
        .then((m) => {
            m.isSent = 1;
            m.save()
                .then(() => {
                    res.send("message isSent");
                })
                .catch((err) => res.status(500).json({ message: err }));
        })
        .catch((err) => res.status(500).json({ message: err }));
});



module.exports = router;
