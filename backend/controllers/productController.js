import ProductModel from "../models/productModel.js";
import { v2 as cloudinary } from 'cloudinary';
import productModel from "../models/productModel.js";
import asyncHandler from "../utils/asyncHandler.js";

// add product
const addProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, subCategory, quantity, bestseller } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
        images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
        return result.secure_url;
    })
    )

    const productData = {
        name,
        description,
        category,
        price: Number(price),
        subCategory,
        bestseller: bestseller === "true" ? true : false,
        quantity: JSON.parse(quantity),
        image: imagesUrl,
        date: Date.now()
    }

    console.log(productData);

    const product = new ProductModel(productData);
    await product.save()

    res.json({success: true, message: 'Product successfully created!'});
});

// list product
const listProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.subCategory) filter.subCategory = req.query.subCategory;

    const products = await ProductModel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });
        
    const total = await ProductModel.countDocuments(filter);

    res.json({
        success: true, 
        products,
        pagination: {
            total,
            page,
            pages: Math.ceil(total / limit)
        }
    });
});

// remove product
const removeProduct = asyncHandler(async (req, res) => {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({success: true, message: 'Product deleted successfully'});
});

// single product info
const singleProduct = asyncHandler(async (req, res) => {
    const {productId} = req.body;
    const product = await ProductModel.findById(productId);
    res.json({success: true, product});
});

export {listProducts, addProduct, removeProduct, singleProduct};