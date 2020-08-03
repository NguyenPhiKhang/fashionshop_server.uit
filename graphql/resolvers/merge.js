const DataLoader = require('dataloader');
const mongoose = require("mongoose");

const { dateToString } = require("../../helpers/date");
const Category = require("../../models/category");
const Option = require("../../models/option");
const Attribute = require("../../models/attribute");
const Account = require("../../models/account");
const Person = require("../../models/person");
const Permission = require("../../models/permission");
const RatingStar = require("../../models/rating_star");
const LevelCategories = require("../../models/level_categories");
const Product = require("../../models/product");
const AttributeProduct = require("../../models/attribute_product");
const OptionAmount = require("../../models/option_amount");
const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Review = require("../../models/review");

const categoryLoader = new DataLoader(async id => {
    if (typeof (id) === "number" || typeof (id[0]) === "number") {
        const q = await Category.find({ category_code: { $in: id } });
        return q;
    } else {
        return await Category.find({ _id: { $in: id } });
    }
});

const categorySubLoader = new DataLoader(ids => {
    const result = ids.map(id => {
        return Category.find({ parent_id: { $in: id } });
    });
    return Promise.all(result);
});

const optionLoader = new DataLoader(opIds => {
    return options(opIds);
});

const attributeLoader = new DataLoader(attrId => {
    return attributes(attrId);
});

const accountLoader = new DataLoader(accountId => {
    return Account.find({ _id: { $in: accountId } });
});

const personLoader = new DataLoader(personId => {
    return Person.find({ _id: { $in: personId } });
});

const permissionLoader = new DataLoader(perId => {
    return Permission.find({ _id: { $in: perId } });
});

const ratingStarLoader = new DataLoader(ratingId => {
    return RatingStar.find({ _id: { $in: ratingId } });
});

const orderLoader = new DataLoader(ord => {
    return orders(ord);
});

const levelCategoriesLoader = new DataLoader(async levelId => {
    // const levelCategories = await LevelCategories.find({ _id: { $in: levelId } });
    const levelCategories = await LevelCategories.aggregate([
        { $match: { _id: { $in: levelId } } },
        { $addFields: { "__sort": { $indexOfArray: [levelId, "$_id"] } } },
        { $sort: { "__sort": 1 } }
    ]);
    // options.sort((a, b) => {
    //     return (
    //         optionIds.indexOf(a._id.toString()) - optionIds.indexOf(b._id.toString())
    //     );
    // });
    if (levelCategories.length !== levelId.length) {
        const arrayOp = await Promise.all(levelId.map(opId => {
            return levelCategories.find(oId => oId._id.toString() === opId.toString());
        }));
        return await Promise.all(arrayOp.map(async l => {
            return await transformLevelCategories(l);
        }))
    }
    return await Promise.all(levelCategories.map(async l => {
        return await transformLevelCategories(l);
    }))
});

const productLoader = new DataLoader(productId => {
    return products(productId);
});

const attributeProductLoader = new DataLoader(attrProdId => {
    return attributeProducts(attrProdId);
});

const optionAmountLoader = new DataLoader(opAmountIds => {
    return optionAmounts(opAmountIds);
});

const optionAmountDetailLoader = new DataLoader(opAmountIds => {
    return optionAmountDetail(opAmountIds);
});

const cartLoader = new DataLoader(cartIds =>{
    return carts(cartIds);
});

const reviewLoader = new DataLoader(reviewIds=>{
    return reviews(reviewIds);
})


// const optionAmountCartLoader = new DataLoader(opAmountIds => {
//     return optionAmountsCart(opAmountIds);
// });


const categoryBind = async (parent_id) => {
    try {
        if (!parent_id)
            return null;
        // const category = await categoryLoader.load(parent_id);
        if (typeof (parent_id) === "number" || typeof (parent_id[0]) === "number") {
            const q = await Category.findOne({ category_code: { $in: parent_id } });
            return await transformCategory(q);
        } else {
            const q = await Category.findOne({ _id: { $in: parent_id } });
            return await transformCategory(q);
        }
        // return transformCategory(category);
    } catch (error) {
        throw error;
    }
}

const categorySubBind = async (parent_id) => {
    try {
        const categorysubs = await categorySubLoader.load(parent_id);
        return categorysubs.map(category => {
            return transformSubCategory(category);
        });
    } catch (err) {
        throw err;
    }
}

// const attributeBind = async (attr_id) => {
//     try {
//         const attr = await attributeLoader.load(attr_id);
//         return transformAttribute(attr);
//     } catch (error) {
//         throw error;
//     }
// }

const AccountBind = async (accountId) => {
    try {
        const account = await accountLoader.load(accountId);
        return transformAccount(account);
    } catch (error) {
        throw error;
    }
};

const PermissionBind = async (perId) => {
    try {
        return await permissionLoader.load(perId);
    } catch (error) {
        throw error;
    }
}

const PersonBind = async (personId) => {
    try {
        const person = await personLoader.load(personId);
        return transformPerson(person);
    } catch (error) {
        throw error;
    }
}

const RatingStarBind = async (ratingId) => {
    try {
        if (ratingId === null)
            return null;
        const rating = await ratingStarLoader.load(ratingId);
        return await transformRatingStar(rating);
    } catch (error) {
        throw error;
    }
}

const LevelCategoriesBind = async (levelId) => {
    try {
        const levelCategories = await levelCategoriesLoader.load(levelId);
        return levelCategories;
    } catch (error) {
        throw error;
    }
}

const SingleProduct = async productId => {
    try {
        const product = await productLoader.load(productId);
        return product;
    } catch (error) {
        throw error;
    }
}

const SingleAttribute = async attrId => {
    try {
        const attr = await attributeLoader.load(attrId);
        return attr;
    } catch (error) {
        throw error;
    }
}

const SingleOption = async opId => {
    try {
        if(!opId)
            return null;
        const op = await optionLoader.load(opId);
        // const op = await Option.findById(opId);
        return op;
    } catch (error) {
        throw error;
    }
}

const SingleOptionAmount = async opAmountId => {
    try {
        const opAmount = await optionAmountDetailLoader.load(opAmountId);
        return opAmount;
    } catch (error) {
        throw error;
    }
}

const SingleCart = async cartId =>{
    try {
        const cart = await cartLoader.load(cartId);
        return cart;
    } catch (error) {
        throw error;
    }
}

const options = async (optionIds) => {
    try {
        // const options = await Promise.all(optionIds.map(async op =>{
        //     console.log(op);
        //     return await Option.findById(op);
        // }));
        // const options = await Option.find({_id: {$in: optionIds}});
        // const groupedByIdAttr = groupBy(option => option.attribute_id, options);
        // const mapOption = map(attrId => groupedByIdAttr[attrId], ["5ef5bb5dc940dae5e5baf919", "5ef5bb93c940dae5e5baf91a"]);
        const options = await Option.aggregate([
            { $match: { _id: { $in: optionIds } } },
            { $addFields: { "__sort": { $indexOfArray: [optionIds, "$_id"] } } },
            { $sort: { "__sort": 1 } }
        ]);
        // options.sort((a, b) => {
        //     return (
        //         optionIds.indexOf(a._id.toString()) - optionIds.indexOf(b._id.toString())
        //     );
        // });
        if (options.length !== optionIds.length) {
            // console.log("ok");
            const arrayOp = await (optionIds.map(opId => {
                return options.find(oId => oId._id.toString() === opId.toString());
            }));

            return await Promise.all(arrayOp.map(async opt => {
                return await transformOption(opt);
            }));
        }
        return options.map(option => {
            return transformOption(option);
        });
    } catch (err) {
        throw err;
    }
}

const attributes = async attrIds => {
    try {
        let attrs = [];
        if (typeof (attrIds[0]) === "number") {
            attrs = await Attribute.find({ attribute_code: { $in: attrIds } });
        } else {
            attrs = await Attribute.find({ _id: { $in: attrIds } });
        }

        if (attrIds.length !== attrs.length) {
            const arrayAttr = await (attrIds.map(attrId => {
                return attrs.find(aId => aId.id == attrId);
            }));
            return arrayAttr.map(ats => {
                return transformAttribute(ats);
                // return ats;
            });
        }
        // arrayAttr.sort((a, b) => {
        //     return (
        //         attrIds.indexOf(a._id.toString()) - attrIds.indexOf(b._id.toString())
        //     );
        // });
        return attrs.map(ats => {
            return transformAttribute(ats);
            // return ats;
        });
    } catch (error) {
        throw error;
    }
}

const products = async productIds => {
    try {
        let prods = [];
        if (typeof (productIds[0]) === "number" || typeof (productIds) === "number") {
            // prods = await Product.find({ product_code: { $in: productIds } });
            prods = await Product.aggregate([
                { $match: { product_code: { $in: productIds } } },
                { $addFields: { "__sort": { $indexOfArray: [productIds, "$product_code"] } } },
                { $sort: { "__sort": 1 } }
            ]);
        } else {
            // await productIds.map(async ddd=>{
            //     const a =  await Product.findById(ddd);
            //     console.log(a);
            // });

            prods = await Product.aggregate([
                { $match: { _id: { $in: productIds } } },
                { $addFields: { "__sort": { $indexOfArray: [productIds, "$_id"] } } },
                { $sort: { "__sort": 1 } }
            ]);
        }

        if (prods.length !== productIds.length) {
            // console.log("ok");
            const arrayPro = await (productIds.map(proID => {
                return prods.find(pId => pId._id.toString() === proID.toString());
            }));

            return await Promise.all(arrayPro.map(async pro => {
                return await transformProduct(pro);
            }));
        }


        return prods.map(prod => {
            return transformProduct(prod);
        });
    } catch (error) {
        throw error;
    }
}

const reviews = async reviewIds=>{
    try {
        console.log(reviewIds);
        const reviews = await Review.find({_id: {$in: reviewIds}});
        return await Promise.all(reviews.map(async rv=>{
            return await transformReview(rv);
        }))
    } catch (error) {
        throw error;
    }
}

const orders = async orderIds => {
    try {
        const orders = await Order.find({ _id: { $in: orderIds } });

        // optionAmounts.sort((a, b) => {
        //     return (
        //         opAmountIds.indexOf(a._id.toString()) - opAmountIds.indexOf(b._id.toString())
        //     );
        // });
        return await Promise.all(orders.map(async ord => {
            return await transformOrder(ord);
        }));
    } catch (error) {
        throw error;
    }
}

const carts = async cartIds =>{
    try {
        const carts = await Cart.find({_id: {$in: cartIds}});
        return await Promise.all(carts.map(async cart => {
            return await transformCart(cart);
        }));
    } catch (error) {
        throw error;
    }
}

const attributeProducts = async attrProdIds => {
    try {
        const attrProds = await AttributeProduct.find({ _id: { $in: attrProdIds } });
        // attrProds.sort((a, b) => {
        //     return (
        //         attrProdIds.indexOf(a._id.toString()) - attrProdIds.indexOf(b._id.toString())
        //     );
        // });
        return await Promise.all(attrProds.map(async attrPro => {
            return await transformAttributeProduct(attrPro);
        }));
    } catch (error) {
        throw error;
    }
}

const optionAmounts = async opAmountIds => {
    try {
        const optionAmounts = await OptionAmount.find({ _id: { $in: opAmountIds } });

        // optionAmounts.sort((a, b) => {
        //     return (
        //         opAmountIds.indexOf(a._id.toString()) - opAmountIds.indexOf(b._id.toString())
        //     );
        // });
        return await Promise.all(optionAmounts.map(async opAmount => {
            return await transformOptionAmount(opAmount);
        }));
    } catch (error) {
        throw error;
    }
}

const optionAmountDetail = async opAmountIds => {
    try {
        // const optionAmounts = await OptionAmount.find({ _id: { $in: opAmountIds } });

        const optionAmounts = await OptionAmount.aggregate([
            { $match: { _id: { $in: opAmountIds } } },
            { $addFields: { "__sort": { $indexOfArray: [opAmountIds, "$_id"] } } },
            { $sort: { "__sort": 1 } }
        ]);

        if (optionAmounts.length !== opAmountIds.length) {
            // console.log("ok");
            const arrayPro = await (opAmountIds.map(opA => {
                return prods.find(op => op._id.toString() === opA.toString());
            }));

            return await Promise.all(arrayPro.map(async opAmount => {
                return await transformOptionAmountDetail(opAmount);
            }));
        }
        
        return await Promise.all(optionAmounts.map(async opAmount => {
            return await transformOptionAmountDetail(opAmount);
        }));
    } catch (error) {
        throw error;
    }
}

// const optionAmountsCart = async opAmountIds => {
//     try {
//         const optionAmounts = await OptionAmount.find({ _id: { $in: opAmountIds } });

//         // optionAmounts.sort((a, b) => {
//         //     return (
//         //         opAmountIds.indexOf(a._id.toString()) - opAmountIds.indexOf(b._id.toString())
//         //     );
//         // });
//         return await Promise.all(optionAmounts.map(async opAmount => {
//             // const a = opAmount._doc.product_code;
//             return await
//                 {
//                     ...opAmount._doc,
//                     _id: opAmount.id,
//                     option_color: SingleOption.bind(this, opAmount._doc.option_color),
//                     option_size: SingleOption.bind(this, opAmount._doc.option_size),
//                     product: SingleProduct.bind(this, opAmount._doc.product_code)
//                 };
//         }));
//     } catch (error) {
//         throw error;
//     }
// }

const transformCategory = category => {
    return {
        ...category._doc,
        _id: category.id,
        parent: categoryBind.bind(this, category._doc.parent_id)
    }
}

const transformSubCategory = category => {
    return {
        ...category._doc,
        _id: category.id,
        parent: categoryBind.bind(this, category._doc.parent_id),
        subCat: categorySubBind.bind(this, category.id)
    }
}

const transformOption = option => {
    return {
        ...option,
        attribute: SingleAttribute.bind(this, option.attribute_id)
    }
}

const transformAttribute = (attr) => {
    return {
        ...attr._doc,
        _id: attr.id,
        value: () => {
            // if(typeof(args.typeOption)==='undefined')
            //     options = await Option.find({ _id: { $in: attr._doc.value } });
            // else options = await Option.find({ _id: { $in: attr._doc.value }, type_option: args.typeOption });
            // if (typeof (args.typeOption) === 'undefined' || attr._doc.name !== "Kích thước") {
            return optionLoader.loadMany(attr._doc.value);
            //return await options(attr._doc.value);
            //     return await attr._doc.value.map(async d=>{
            //         return await options(d);
            //     });
            // }
            // else {
            //     const options = (await Option.find({ _id: { $in: attr._doc.value }, type_option: args.typeOption }));
            //     if (options.length === 0)
            //         return null;
            //     // else return await options(options);
            //     return options.map(async d=>{
            //         return await transformOption(d);
            //     });
            // }
        }
    }
}

const transformAccount = account => {
    return {
        ...account._doc,
        _id: account.id,
        password: null,
        person: PersonBind.bind(this, account._doc.person_id),
        permission: PermissionBind.bind(this, account._doc.permission_id)
    }
}

const transformPerson = person => {
    return {
        ...person._doc,
        _id: person.id,
        account: AccountBind.bind(this, person._doc.account_id),
        createdAt: dateToString(person._doc.createdAt),
        updatedAt: dateToString(person._doc.updatedAt)
    }
}

const transformRatingStar = rating => {
    return {
        ...rating._doc,
        _id: rating.id,
        product: SingleProduct.bind(this, rating._doc.product_id)
    }
}

const transformLevelCategories = level => {
    return {
        ...level,
        category_level1: categoryBind.bind(this, level.category_level1_id),
        category_level2: categoryBind.bind(this, level.category_level2_id),
        category_level3: categoryBind.bind(this, level.category_level3_id),
        products: () => productLoader.loadMany(level.products)
    }
}

const transformAttributeProduct = attrProduct => {
    return {
        ...attrProduct._doc,
        _id: attrProduct.id,
        product: SingleProduct.bind(this, attrProduct._doc.product_code),
        attribute: SingleAttribute.bind(this, attrProduct._doc.attribute_code),
        value: () => optionLoader.loadMany(attrProduct._doc.value),
    }
}

const transformProduct = async product => {
    return await {
        ...product,
        _id: product._id,
        rating_star: RatingStarBind.bind(this, product.rating_star),
        categories: LevelCategoriesBind.bind(this, product.categories),
        attribute: () => attributeProductLoader.loadMany(product.attribute),
        option_amount: () => optionAmountLoader.loadMany(product.option_amount),
        review: ()=> reviewLoader.loadMany(product.review),
        isFavorite: async (args)=> await Person.countDocuments({$and: [{_id: args.person_id}, {favorites: product._id}]})>0
    }
}

const transformProductDetail = product => {
    return {
        ...product._doc,
        _id: product.id,
        rating_star: RatingStarBind.bind(this, product._doc.rating_star),
        categories: LevelCategoriesBind.bind(this, product._doc.categories),
        attribute: () => attributeProductLoader.loadMany(product._doc.attribute),
        option_amount: () => optionAmountDetailLoader.loadMany(product._doc.option_amount),
        isFavorite: async (args)=> await Person.countDocuments({$and: [{_id: args.person_id}, {favorites: product.id}]})>0
    }
}

const transformOptionAmount = opAmount => {
    return {
        ...opAmount._doc,
        _id: opAmount.id,
        // option_color: SingleOption.bind(this, opAmount._doc.option_color),
        // option_size: SingleOption.bind(this, opAmount._doc.option_size),
        product: SingleProduct.bind(this, opAmount._doc.product_code)
    }
}

const transformOptionAmountDetail = opAmount => {
    return {
        ...opAmount,
        _id: opAmount._id,
        option_color: SingleOption.bind(this, opAmount.option_color),
        option_size: SingleOption.bind(this, opAmount.option_size),
        product: SingleProduct.bind(this, opAmount.product_code)
    }
}

const transformOrder = order => {
    return {
        ...order._doc,
        _id: order.id,
        // product: SingleProduct.bind(this, order._doc.product_id),
        // option_amount: SingleOptionAmount.bind(this, order._doc.option_amount_id),
        person: PersonBind.bind(this, order._doc.person_id),
        carts: ()=> cartLoader.loadMany(order._doc.carts),
        createdAt: dateToString(order._doc.createdAt),
        updatedAt: dateToString(order._doc.updatedAt)
    }
}

const transformCart = cart => {
    return {
        ...cart._doc,
        _id: cart.id,
        product: SingleProduct.bind(this, cart._doc.product_id),
        option_amount: SingleOptionAmount.bind(this, cart._doc.option_amount_id),
        person: PersonBind.bind(this, cart._doc.person_id)
    }
}

const transformReview = review =>{
    return {
        ...review._doc,
        _id: review.id,
        createdAt: dateToString(review._doc.createdAt),
        updatedAt: dateToString(review._doc.updatedAt),
        cartItem: SingleCart.bind(this, review._doc.cartItem_id)
    }
}

const transformBill = bill => {
    return {
        ...bill._doc,
        _id: bill.id,
        orders: () => orderLoader.loadMany(bill._doc.orders)
    }
}

module.exports = {
    transformCategory: transformCategory,
    transformSubCategory: transformSubCategory,
    transformOption: transformOption,
    transformAttribute: transformAttribute,
    transformAccount: transformAccount,
    transformPerson: transformPerson,
    transformProduct: transformProduct,
    transformOrder: transformOrder,
    transformBill: transformBill,
    transformProductDetail: transformProductDetail,
    transformCart: transformCart,
    transformReview: transformReview,
}