const mongoose = require('mongoose');
const Product = require("../../models/product");
const LevelCategories = require("../../models/level_categories");
const AttributeProduct = require("../../models/attribute_product");
const OptionAmount = require("../../models/option_amount");
const Atrribute = require("../../models/attribute");
const RatingStar = require("../../models/rating_star");
const { CeilPrice } = require("../../helpers/ceil_price");
const genCode = require("./sysGenId");
const { transformProduct, transformProductDetail } = require('./merge');
const { DeleteImage, DeleteReview, findProductInAttribute, SkipLimit } = require('../../helpers/util');
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

            const attrValues = (arrColor.length === 0 && arrSize.length !== 0) ? await Atrribute.find({ attribute_code: 2 }) : (arrColor.length !== 0 && arrSize.length === 0) ? await Atrribute.find({ attribute_code: 1 }) : (arrColor.length !== 0 && arrSize.length !== 0) ? await Atrribute.find({}) : [];
            // console.log("atrr Values");
            // console.log(attrValues);
            const attrProduct = await Promise.all(attrValues.map(async f => {
                const x = (f._doc.attribute_code === 1) ? await f._doc.value.filter(c => arrColor.includes(c.toString())) :
                    await f._doc.value.filter(c => arrSize.includes(c.toString()));

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
            var products = [];
            if (typeof (args.product_ids) !== "undefined" && args.product_ids.length > 0) {
                products = (args.sort === -1 || args.sort === 1) ? await Product.find({ _id: { $in: args.product_ids } }).sort({ final_price: args.sort }) : await Product.find({ _id: { $in: args.product_ids } });
            } else {
                let limit = 0;
                let skip = 0;
                //const pageSize = (typeof(args.pageSize)==="undefined"||args.pageSize <= 0)?0:args.pageSize;
                if (typeof (args.pageNumber) === "number" && args.pageNumber > 0) {
                    skip = (args.pageNumber - 1) * 10;
                    limit = 10;
                }
                products = (typeof (args.id) !== "undefined")
                    ? await Product.find({ _id: { $in: args.id } }, { review: { $slice: -3 } }).skip(skip).limit(limit)
                    : (args.sort === -1 || args.sort === 1) ? await Product.find({}).sort({ final_price: args.sort }).skip(skip).limit(limit) : await Product.find({}).skip(skip).limit(limit);
            }
            let total = (typeof (args.id) !== "undefined" || typeof (args.product_ids) !== "undefined") ? products.length : await Product.countDocuments({});
            let prods = await Promise.all(products.map(async product => {
                // let isFavorite = false;
                // if (typeof (args.person_id) !== "undefined" && typeof (product.favoritors.length) !== "undefined" && product.favoritors.length !== 0) {
                //     isFavorite = await product.favoritors.includes(args.person_id);
                // }
                const returnProduct = await transformProduct(product._doc);
                return await returnProduct;
                // return await { ...returnProduct, isFavorite: isFavorite };
            }));

            return { total_record: total, products: prods };
        } catch (error) {
            throw error;
        }
    },
    getProductById: async (args) => {
        try {
            const product = await Product.findById(args.id);
            // let isFavorite = false;
            // if (typeof (args.person_id) !== "undefined" && typeof (product.favoritors.length) !== "undefined" && product.favoritors.length !== 0) {
            //     isFavorite = await product.favoritors.includes(args.person_id);
            // }
            // const returnProduct = await transformProductDetail(product);
            // return await { ...returnProduct, isFavorite: isFavorite };

            return await transformProductDetail(product);
        } catch (error) {
            throw error;
        }
    },
    deleteProduct: async (args) => {
        try {
            // const producsNo = await Product.find({ images: [] });
            // console.log(producsNo.length);
            // await Promise.all(producsNo.map(async prodc => {
            //     // const prodc = await Product.findById(args.id);
            //     console.log(prod._id);
            //     // await Product.deleteOne({ _id: prodc._id });
            //     // // await DeleteImage(prodc.images);
            //     // if (prodc.rating_star !== null) await RatingStar.deleteOne({ _id: prodc.rating_star });
            //     // if (prodc.attribute.length > 0) await AttributeProduct.deleteMany({ _id: { $in: prodc.attribute } });
            //     // if (prodc.option_amount.length > 0) await OptionAmount.deleteMany({ _id: { $in: prodc.option_amount } });
            //     // await DeleteReview(prodc.review);
            //     // await deleteProductInLevelCategories({ id: prodc.categories, idProduct: prodc._id });
            // }))

            await Promise.all(args.ids.map(async id => {
                const prodc = await Product.findById(id);
                await Product.deleteOne({ _id: args.id });
                await DeleteImage(prodc.images);
                if (prodc.rating_star !== null) await RatingStar.deleteOne({ _id: prodc.rating_star });
                if (prodc.attribute.length > 0) await AttributeProduct.deleteMany({ _id: { $in: prodc.attribute } });
                if (prodc.option_amount.length > 0) await OptionAmount.deleteMany({ _id: { $in: prodc.option_amount } });
                await DeleteReview(prodc.review);
                await deleteProductInLevelCategories({ id: prodc.categories, idProduct: prodc._id });
            }));
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
            }, { _id: 1 }).then(value => {
                return value.map(a => a._id);
            });

            const colors = await findProductInAttribute(args.colors, 1);
            const sizes = await findProductInAttribute(args.sizes, 2);

            let products = [];

            if (args.colors.length === 0 && args.sizes.length === 0 && args.price_max === 0) {
                products = await Product.find({ categories: { $in: levelCatId } }).sort((typeof (args.sort) === "undefined" || args.sort === 0) ? {} : { final_price: args.sort }).skip(skip).limit(limit);
            }
            else {
                if ((colors.length > 0 || (colors.length === 0 && args.colors.length > 0))
                    && (sizes.length > 0 || (sizes.length === 0 && args.sizes.length > 0)) && args.price_max > 0) {
                    products = await Product.find({
                        $and: [{ categories: { $in: levelCatId } },
                        { product_code: { $in: colors } },
                        { product_code: { $in: sizes } },
                        { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                    }).sort((typeof (args.sort) === "undefined" || args.sort === 0) ? {} : { final_price: args.sort }).skip(skip).limit(limit);
                } else {
                    if (colors.length > 0 && sizes.length === 0 && args.sizes.length === 0 && args.price_max > 0) {
                        products = await Product.find({
                            $and: [{ categories: { $in: levelCatId } },
                            { product_code: { $in: colors } },
                            { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                        }).sort((typeof (args.sort) === "undefined" || args.sort === 0) ? {} : { final_price: args.sort }).skip(skip).limit(limit);
                    }
                    else {
                        if (colors.length === 0 && sizes.length > 0 && args.colors.length === 0 && args.price_max > 0) {

                            console.log("ok");
                            console.log(levelCatId);
                            console.log(sizes);
                            products = await Product.find({
                                $and: [{ categories: { $in: levelCatId } },
                                { product_code: { $in: sizes } },
                                { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                            }).sort((typeof (args.sort) === "undefined" || args.sort === 0) ? {} : { final_price: args.sort }).skip(skip).limit(limit);

                            console.log(products);
                        }
                        else {
                            if (colors.length === 0 && args.colors.length === 0 && sizes.length === 0 && args.sizes.length === 0 && args.price_max > 0) {
                                products = await Product.find({
                                    $and: [{ categories: { $in: levelCatId } },
                                    { final_price: { $gte: args.price_min, $lte: args.price_max } }]
                                }).sort((typeof (args.sort) === "undefined" || args.sort === 0) ? {} : { final_price: args.sort }).skip(skip).limit(limit);
                            }
                        }
                    }
                }
            }

            return await Promise.all(products.map(async product => {
                return await transformProduct(product._doc);
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
    },
    searchProduct: async (args) => {
        try {
            const newText = await args.text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d")
                .replace(/Đ/g, "D");
            const page = await SkipLimit(args.pageNumber);
            const total = await Product.countDocuments({ $text: { $search: newText } });
            const products = await Product.find({ $text: { $search: newText } }).sort((typeof (args.sort) === "undefined" || args.sort === 0) ? {} : { final_price: args.sort }).skip(page.skip).limit(page.limit);
            const prods = await Promise.all(products.map(async product => {
                return await transformProduct(product._doc);
            }));

            return { total_record: total, products: prods };
        } catch (error) {
            throw error;
        }
    },
    updateProduct: async (args) => {
        try {
            const { id, name, price, promotion_percent, weight, is_freeship,
                description, category, images, option_amount } = await args.productEditInput;

            const product = await Product.findOne({ _id: id });
            product.name = await name;
            product.price = await price;
            product.promotion_percent = await promotion_percent;
            product.weight = await weight;
            product.is_freeship = await is_freeship;
            product.description = await description;
            // if (category !== product.category_id) {
            //     const cats = await (category).split('/');
            //     let levelcategories = await LevelCategories.findOne({ category_level1_id: cats[0], category_level2_id: cats[1], category_level3_id: cats[2] });
            //     if (levelcategories === null) {
            //         const levelcategory = new LevelCategories({
            //             category_level1_id: cats[0],
            //             category_level2_id: cats[1],
            //             category_level3_id: cats[2],
            //             products: [product]
            //         });
            //         levelcategories = await levelcategory.save();
            //     } else {
            //         await levelcategories.products.push(product);
            //         await levelcategories.save();
            //     }
            //     product.category_id = category;
            //     await LevelCategories.updateOne({_id: product.categories}, {$pull: {products: product._id}});
            //     product.categories = levelcategories;
            // }

            let arrImageDel = [];
            for (const img of product.images) {
                if (images.includes(img) === false) {
                    arrImageDel.push(img);
                }
            }
            console.log(arrImageDel);
            // await DeleteImage(arrImageDel);
            product.images = await images;

            // console.log(option_amount);
            let arrNewOption = [];
            let arrNewColor = [];
            let arrNewSize = [];
            for (const op of option_amount) {
                const findOption = await OptionAmount.findOne({ $and: [{ option_color: op.color_id }, { option_size: op.size_id }, { product_code: product.product_code }] });
                if (findOption === null) {
                    const opAmount = new OptionAmount({
                        product_code: product.product_code,
                        option_color: op.color_id,
                        option_size: op.size_id,
                        amount: op.amount
                    });
                    console.log(opAmount);
                    // const opSave = await opAmount.save();
                    // arrNewOption.push(opSave);

                    if (op.color_id !== null && arrNewColor.includes(op.color_id) === false) arrNewColor.push(op.color_id);
                    if (op.size_id !== null && arrNewSize.includes(op.size_id) === false) arrNewSize.push(op.size_id);
                } else {
                    findOption.amount = await op.amount;
                    console.log(findOption.amount);
                    // await findOption.save();
                }
            }

            console.log(arrNewColor);
            console.log(arrNewSize);

            for(const attr of product.attribute){
                
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    // addFreeship: async (args)=>{
    //     try {
    //         await Product.updateMany({},{$set: {is_freeship: false}});
    //         return true;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}