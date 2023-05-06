const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const productController = require("../controllers/productController");
const {checkAuth} = require("../middleware/auth");

//----------------------------------------------------------------

router.post("/register", userController.register);
router.post("/login", userController.login);

router.post("/product", checkAuth, productController.createProduct);
router.get("/product", checkAuth, productController.Getproduct);
router.put("/product/:productId", checkAuth, productController.updateProduct);
router.delete("/product/:productId", checkAuth, productController.deleteProduct);


module.exports = router;