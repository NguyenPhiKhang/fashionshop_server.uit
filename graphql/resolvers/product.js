const mongoose = require('mongoose');
const Product = require("../../models/product");
const LevelCategories = require("../../models/level_categories");
const AttributeProduct = require("../../models/attribute_product");
const OptionAmount = require("../../models/option_amount");
const Atrribute = require("../../models/attribute");
const RatingStar = require("../../models/rating_star");
const { CeilPrice } = require("../../helpers/ceil_price");
const genCode = require("./sysGenId");
const { transformProduct } = require('./merge');
const { DeleteImage, DeleteReview, findProductInAttribute } = require('../../helpers/util');
const { deleteProductInLevelCategories } = require('./levelcategories');
const { product } = require('ramda');

module.exports = {
    createProduct: async (args) => {
        try {
            const gencode = await genCode("Product");
            const cats = await (args.productInput.category_id).split('/');
            let levelcategories = await LevelCategories.findOne({ category_level1_id: cats[0], category_level2_id: cats[1], category_level3_id: cats[2] });
            // console.log(levelcategories);
            if (levelcategories === null) {
                const levelcategory = new LevelCategories({
                    category_level1_id: cats[0],
                    category_level2_id: cats[1],
                    category_level3_id: cats[2]
                });
                levelcategories = await levelcategory.save();
                // console.log(levelcategories);
            }

            let arrColor = [];
            let arrSize = [];
            const arrOptionAmount = await Promise.all(args.productInput.option_amount.map(async opa => {
                const optionAmount = new OptionAmount({
                    product_code: gencode,
                    option_color: opa.color_id,
                    option_size: opa.size_id,
                    amount: opa.amount
                });


                if (opa.color_id !== null && arrColor.includes(opa.color_id) === false) arrColor.push(opa.color_id);
                if (opa.size_id !== null && arrSize.includes(opa.size_id) === false) arrSize.push(opa.size_id);

                const saveOpa = await optionAmount.save();
                // console.log(saveOpa);
                return saveOpa;
            }));

            // console.log("arr OptionAmount");
            // console.log(arrOptionAmount);

            const attrValues = (arrColor.length === 0 && arrSize.length !== 0) ? await Atrribute.findOne({ attribute_code: 2 }) : (arrColor.length !== 0 && arrSize.length === 0) ? await Atrribute.findOne({ attribute_code: 1 }) : (arrColor.length !== 0 && arrSize.length !== 0) ? await Atrribute.find({}) : [];
            // console.log("atrr Values");
            // console.log(attrValues);
            const attrProduct = await Promise.all(attrValues.map(async f => {
                const x = (f._doc.attribute_code === 1) ? await f._doc.value.filter(c => arrColor.includes(c.toString())) :
                    await f._doc.value.filter(c => arrSize.includes(c.toString()));
                console.log(x);

                const attrProd = new AttributeProduct({
                    attribute_code: f._doc.attribute_code,
                    product_code: gencode,
                    value: x
                });

                const saveAttrProd = await attrProd.save();
                // console.log(saveAttrProd);
                return saveAttrProd;
            }));

            // console.log("attr Product");
            // console.log(attrProduct);

            // console.log("lietke:  ");


            const product = new Product({
                name: args.productInput.name,
                product_code: gencode,
                images: args.productInput.images,
                img_url: args.productInput.images.length > 0 ? args.productInput.images[0] : "",
                price: args.productInput.price,
                promotion_percent: args.productInput.promotion_percent,
                final_price: CeilPrice(args.productInput.price, args.productInput.promotion_percent),
                description: args.productInput.description,
                total_review: 0,
                order_count: 0,
                weight: args.productInput.weight,
                short_description: "",
                rating_star: null,
                stock_status: true,
                review: [],
                is_freeship: args.productInput.is_freeship,
                category_id: args.productInput.category_id,
                categories: levelcategories._id,
                attribute: attrProduct,
                option_amount: arrOptionAmount,
                record_status: true
            });

            const saveProduct = await product.save();
            // console.log(saveProduct);

            await levelcategories.products.push(saveProduct);
            await levelcategories.save();
            return { ...saveProduct._doc, _id: saveProduct.id }


            // const arrColor = [mongoose.Types.ObjectId("5ef5c0826d9d08e65eeacb70"),mongoose.Types.ObjectId("5ef97f5cd9c816906353feac"),mongoose.Types.ObjectId("5ef5c20a6d9d08e65eeacb73")];
            // // console.log(arrColor);
            // const arrText = [];
            // const values= await Atrribute.find({});
            // // console.log(values[0]._doc.value);
            // const b = await Promise.all(values.map(async f=>{
            //     const x = await f._doc.value.filter(c => arrColor.includes(c));
            //     console.log(f._doc.value);
            //     // console.log(x);
            //     x.push(Object("xxxx"));
            //     await Promise.all(x.map(fff=>{
            //         console.log(typeof(fff));
            //     }));
            //     return {...f._doc, value: x}
            // }));

            // // const a = await Promise.all(value.map( async b=>{
            // //     const c = [];
            // //     // console.info("fsdf"+b.value);
            // //     // if(b.attribute_code === 1)
            // //     //     c = await b.value.find(c=> arrColor.indexOf(c.option_code) > -1 );
            // //     // else c = await b.value.find(c=> arrSize.indexOf(c.option_code) > -1 );

            // //     const f = await Promise.all(b.value.map(ff=>{
            // //         console.log(ff.name);
            // //     }))

            // //     // if(c.length > 0)
            // //     //     return {...b, value: c}
            // // }));
            // console.log(b);
            // return 1;
        } catch (error) {
            throw error;
        }
    },
    getProduct: async (args) => {
        try {
            let limit = 0;
            let skip = 0;
            //const pageSize = (typeof(args.pageSize)==="undefined"||args.pageSize <= 0)?0:args.pageSize;
            if (typeof (args.pageNumber) === "number" && args.pageNumber > 0) {
                skip = (args.pageNumber - 1) * 10;
                limit = 10;
            }
            const products = (typeof (args.id) !== "undefined")
                ? await Product.find({ _id: { $in: args.id } }).skip(skip).limit(limit)
                : await Product.find({}).skip(skip).limit(limit);
            return await Promise.all(products.map(async product => {
                return await transformProduct(product);
            }));
        } catch (error) {
            throw error;
        }
    },
    deleteProduct: async (args) => {
        try {
            const prodc = await Product.findById(args.id);
            await Product.deleteOne({ _id: args.id });
            await DeleteImage(prodc.images);
            if (prodc.rating_star !== null) await RatingStar.deleteOne({ _id: prodc.rating_star });
            if (prodc.attribute.length > 0) await AttributeProduct.deleteMany({ _id: { $in: prodc.attribute } });
            if (prodc.option_amount.length > 0) await OptionAmount.deleteMany({ _id: { $in: prodc.option_amount } });
            await DeleteReview(prodc.review);
            await deleteProductInLevelCategories({ id: prodc.categories, idProduct: prodc._id });
            return true;
        } catch (error) {
            throw error;
        }
    },
    getProductByCategory: async (args) => {
        try {
            let limit = 0;
            let skip = 0;
            if (typeof (args.pageNumber) === "number" && args.pageNumber > 0) {
                skip = (args.pageNumber - 1) * 10;
                limit = 10;
            }

            const levelCatId = await LevelCategories.find({
                $or: [{ category_level1_id: args.level_code },
                { category_level2_id: args.level_code }, { category_level3_id: args.level_code }]
            }, { _id: 1 }).then(value=>{
                return value.map(a => a._id);
            });

            const colors = await findProductInAttribute(args.colors, 1);
            const sizes = await findProductInAttribute(args.sizes, 2);

            let products = [];

            if (args.colors.length === 0 && args.sizes.length === 0 && args.price_max === 0) {
                products = await Product.find({ categories: { $in: levelCatId } }).skip(skip).limit(limit);
            }
            else {
                if ((colors.length > 0 || (colors.length === 0 && args.colors.length > 0))
                    && (sizes.length > 0 || (sizes.length === 0 && args.sizes.length > 0)) && args.price_max > 0) {
                    products = await Product.find({
                        $and: [{ categories: { $in: levelCatId } },
                        { product_code: { $in: colors } },
                        { prodcut_code: { $in: sizes } },
                        { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                    }).skip(skip).limit(limit);
                } else {
                    if (colors.length > 0 && sizes.length === 0 && args.sizes.length === 0 && args.price_max > 0) {
                        products = await Product.find({
                            $and: [{ categories: { $in: levelCatId } },
                            { product_code: { $in: colors } },
                            { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                        }).skip(skip).limit(limit);
                    }
                    else {
                        if (colors.length === 0 && sizes.length > 0 && args.colors.length === 0 && args.price_max > 0) {
                            products = await Product.find({
                                $and: [{ categories: { $in: levelCatId } },
                                { prodcut_code: { $in: sizes } },
                                { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                            }).skip(skip).limit(limit);
                        }
                        else {
                            if (colors.length === 0 && args.colors.length === 0 && sizes.length === 0 && args.sizes.length === 0 && args.price_max > 0) {
                                products = await Product.find({
                                    $and: [{ categories: { $in: levelCatId } },
                                    { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                                }).skip(skip).limit(limit);
                            }
                        }
                    }
                }
            }

            return await Promise.all(products.map(async product => {
                return await transformProduct(product);
            }));
            // const a = await Product.find({ product_code: { $exists: true } });
            // a.forEach(async function (x) {
            //     console.log(typeof(x.product_code))
            //     x.product_code = new Number(x.product_code); // convert field to string
            //     await x.save();
            // });

            // return a;
        } catch (error) {
            throw error;
        }
    }
}