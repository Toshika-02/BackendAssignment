const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const productModel = require('../models/productModel');

let isValid = function (value) {
    if (typeof value === "undefined" || value === "null") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };

//====================Create Product==============================

const createProduct = async function (req, res) {
    try {
      let requestBody = req.body; 
      let { name,brand, category,price } = requestBody; 
  
      
      if (!isValid(name)) {
        return res.status(400).send({status: false,message: "Please provide a name"});
      }
  
       if (!isValid(brand)) {
        return res.status(400).send({
          status: false,
          message: "please provide brand ",
        });
      }

      if (!isValid(category)) {
        return res.status(400).send({
          status: false,
          message: "please provide category ",
        });
      }

      if (!isValid(price)) {
        return res.status(400).send({
          status: false,
          message: "please provide price ",
        });
      }

      let createProduct = await productModel.create(requestBody);
      return res.status(201).send({
        status: true,
        message: "product sucessfully Created",
        data: createProduct,
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };


  //=========================Read product========================================

  const Getproduct = async function (req, res) {
    try {
      let query = req.query;
  
      let product = await productModel
        .find({ $and: [query, { isDeleted: false }] })
        .select({
          _id: 1,
          name: 1,
          brand: 1,
          category: 1,
          price: 1,
        });
  
      /* product.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      }); */

      if (product.length == 0)
      return res
        .status(404)
        .send({ status: false, message: "products are not present" });

  
      return res
        .status(200)
        .send({ status: true, message: "products", data: product });
    } catch (error) {
      res.status(500).send({ status: false, message: error.message });
    }
  };


//=================Update product========================================

const updateProduct = async function (req, res) {
    try {
      let productId = req.params.productId; 
  
      if (!productId) {
        return res
          .status(400)
          .send({ status: false, message: "productId is Required" });
      }
  
      let findProducs = await productModel.findById({ _id: productId });
      if (!findProducs) {
        return res
          .status(403)
          .send({ status: false, message: "Producs Id is not Valid" });
      }
  
      let findProduct = await productModel.findById({ _id: productId });
      if (findProduct.length == 0) {
        return res.status(404).send({ status: false, message: "Product not Found" });
      }
  
      let deleted = findProduct.isDeleted;
      if (deleted == true) {
        return res.status(404).send({ status: false, message: "product not Found" });
      }
  
      if (findProduct.productId != req.productId) {
        return res
          .status(403)
          .send({ status: false, message: "You are not Authorized" });
      }
      let requestBody = req.body;
      let { name, brand, category, price } = requestBody; //Destructuring data coming from request body
  
      //validation starts
      if (name) {
        if (!isValid(name)) {
          return res
            .status(400)
            .send({ status: false, message: "Provide a Valid name" });
        }
      }

      if (brand) {
        if (!isValid(brand)) {
          return res
            .status(400)
            .send({ status: false, message: "Provide a Valid brand" });
        }
      }
      if (category) {
        if (!isValid(category)) {
          return res
            .status(400)
            .send({ status: false, message: "Provide a Valid category" });
        }
      }
      if (price) {
        if (!isValid(price)) {
          return res
            .status(400)
            .send({ status: false, message: "Provide a Valid price" });
        }
      }
  
      let productUpdated = await productModel.findOneAndUpdate(
        { _id: productId },
        {
          $set: {
            name: requestBody.name,
            brand: requestBody.brand,
            category: requestBody.category,
            price: requestBody.price,
          },
        },
        { new: true }
      );
  
      return res.status(200).send({
        status: true,
        message: "Product Updated Successfully",
        data: productUpdated,
      });
    } catch (error) {
      return res.status(500).send({ status: false, message: error.message });
    }
  };
  
  //================================================DELETE product===========================================================================//
  const deleteProduct = async function (req, res) {
    try {
      let productId = req.params.productId; 
      
      if (!productId) {
        return res
          .status(400)
          .send({ status: false, message: "productId is Required" });
      }
  
      let findProducts = await productModel.findById({ _id: productId });
      if (!findProducts) {
        return res
          .status(400)
          .send({ status: false, message: "Book Id is not Valid" });
      }
  
      if (findProducts.productId != req.productId) {
        return res
          .status(403)
          .send({ status: false, message: "You are not Authorized" });
      }
  
      let deletedProduct = await productModel.findOneAndUpdate(
        { _id: productId },
        { $set: { isDeleted: true, deletedAt: new Date() } },
        { new: true }
      );
      return res.status(200).send({
        status: true,
        message: "Book Deleted Successfully",
      });
    } catch (error) {
      res.status(500).send({ status: false, Error: error.message });
    }
  };


  module.exports = { createProduct, Getproduct, updateProduct, deleteProduct}
 