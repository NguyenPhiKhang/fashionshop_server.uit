const mongoose = require('mongoose');
const Product = require("../../models/product");
const LevelCategories = require("../../models/level_categories");
const AttributeProduct = require("../../models/attribute_product");
const OptionAmount = require("../../models/option_amount");
const Atrribute = require("../../models/attribute");
const { CeilPrice } = require("../../helpers/ceil_price");
const genCode = require("./sysGenId");
const { transformProduct } = require('./merge');

module.exports = {
    createProduct: async (args) => {
        try {
            const gencode = await genCode("Product");
            const cats = await (args.productInput.category_id).split('/');
            let levelcategories = await LevelCategories.findOne({ category_level1_id: cats[0], category_level2_id: cats[1], category_level3_id: cats[2] });
            if (levelcategories === null) {
                const levelcategory = new LevelCategories({
                    category_level1_id: cats[0],
                    category_level2_id: cats[1],
                    category_level3_id: cats[2]
                });
                levelcategories = await levelcategory.save();
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

                const checkColor = arrColor.includes(opa.color_id);
                arrColor.push(checkColor ? null : opa.color_id);
                const checkSize = arrSize.includes(opa.size_id);
                arrSize.push(checkSize ? null : opa.size_id);

                const saveOpa = await optionAmount.save();
                console.log(saveOpa);
                return saveOpa;
            }));

            const attrValues = (arrColor.length === 0 && arrSize.length !== 0) ? await Atrribute.findOne({ attribute_code: 2 }) : (arrColor.length !== 0 && arrSize.length === 0) ? await Atrribute.findOne({ attribute_code: 1 }) : await Atrribute.find({});

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
                console.log(saveAttrProd);
                return saveAttrProd;
            }));

            const product = new Product({
                name: args.productInput.name,
                product_code: gencode,
                images: [],
                img_url: null,
                price: args.productInput.price,
                promotion_percent: args.productInput.promotion_percent,
                final_price: CeilPrice(args.productInput.price, args.productInput.promotion_percent),
                description: args.productInput.description,
                total_review: 0,
                order_count: 0,
                weight: args.productInput.weight,
                short_description: args.productInput.short_description,
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

            // let attributeInput = await Promise.all(args.productInput.attribute.map(async attr => {
            //     //const a = await Attribute_Option.findOne({attribute_code: attr.attribute_code, product_code: gencode});

            //     const gencodeAttrOpt = await genCode("Attribute_Option");

            //     let attrOption = new Attribute_Option({
            //         attr_opt_code: gencodeAttrOpt,
            //         attribute_code: attr.attribute_code,
            //         product_code: gencode,
            //         value: []
            //     });

            //     //const saveAttrOption = await attrOption.save();

            //     let mapOptions = await Promise.all(attr.options.map(async op => {
            //         const opt = new Option_Amount({
            //             option_code: op.option_code,
            //             amount: op.amount,
            //             attribute_option_code: gencodeAttrOpt
            //         });

            //         return await opt.save();
            //         // await saveAttrOption._doc.value.push(saveOpt);
            //     }));

            //     console.log(mapOptions);

            //     attrOption.value.push(...mapOptions);

            //     return attrOption.save();
            // }));

            //await product.attribute.push(...attributeInput);
            const saveProduct = await product.save();

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
            if(typeof(args.pageNumber)==="number"&&args.pageNumber > 0){
                skip = (args.pageNumber - 1)*10;
                limit = 10;
            }
            console.log("skip: "+skip);
            console.log("limit: "+limit);
            const products = (typeof (args.id) !== "undefined") ? await Product.find({ _id: { $in: args.id } }).skip(skip).limit(limit) : await Product.find({}).skip(skip).limit(limit);
            return await Promise.all(products.map(async product => {
                return await transformProduct(product);
            }));
        } catch (error) {
            throw error;
        }
    },
}