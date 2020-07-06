const GridFSClass = require("../models/singletonGridFS");
const mongoose = require('mongoose');
const Review = require("../models/review");
const AttributeProduct = require("../models/attribute_product");

const DeleteImage = async (images) => {
    const gfs = await GridFSClass.getInstance();
    await images.map(async f => {
        await gfs.find({ filename: f }).toArray(async (err, files) => {
            await gfs.delete(new mongoose.Types.ObjectId(files[0]._id));
        });
    });
}

const DeleteReview = async (reviews) => {
    const revs = await Review.find({ _id: { $in: reviews } });
    await Review.deleteMany({ _id: { $in: reviews } });
    await Promise.all(revs.map(async imgs => {
        await DeleteImage(imgs.images);
    }));
}

const findProductInAttribute = async (options, attribute) => {
    if (options.length > 0) {
        const a = await AttributeProduct.find({ $and: [{ attribute_code: attribute }, { value: { $in: options } }] }, { product_code: 1, _id: 0 }).then(value=>{
            return value.map(a=>a.product_code);
        });
        return a;
    }
    return [];
}

module.exports = { DeleteImage, DeleteReview, findProductInAttribute }