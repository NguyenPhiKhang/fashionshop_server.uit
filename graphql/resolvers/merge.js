const DataLoader = require('dataloader');
const mongoose = require("mongoose");
const { map, groupBy } = require('ramda');

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

const categoryLoader = new DataLoader(async id => {
    let arr = [];
    if (!mongoose.Types.ObjectId.isValid(id)) {
        arr = await Category.find({ category_code: { $in: id } });
    } else {
        arr = await Category.find({ _id: { $in: id } });
    }
    return arr;
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

const levelCategoriesLoader = new DataLoader(async levelId => {
    const levelCategories = await LevelCategories.find({ _id: { $in: levelId } });

    //  const levelCategories = await LevelCategories.aggregate([
    //     { $match: { _id: { $in: levelId } } },
    //     { $addFields: { "__sort": { $indexOfArray: [levelId, "$_id"] } } },
    //     { $sort: { "__sort": 1 } }
    // ]);
    // options.sort((a, b) => {
    //     return (
    //         optionIds.indexOf(a._id.toString()) - optionIds.indexOf(b._id.toString())
    //     );
    // });
    if (levelCategories.length !== levelId.length) {
        const arrayOp = await (levelId.map(opId => {
            return levelCategories.find(oId => oId._id.toString() === opId.toString());
        }));
        return arrayOp;
    }
    return levelCategories;
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

const categoryBind = async (parent_id) => {
    try {
        if (!parent_id)
            return null;
        const category = await categoryLoader.load(parent_id);
        return transformCategory(category);
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
        return transformRatingStar(rating);
    } catch (error) {
        throw error;
    }
}

const LevelCategoriesBind = async (levelId) => {
    try {
        const levelCategories = await levelCategoriesLoader.load(levelId);
        return transformLevelCategories(levelCategories);
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
        const op = await optionLoader.load(opId);
        return op;
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
            const arrayOp = await (optionIds.map(opId => {
                return options.find(oId => oId._id.toString() === opId.toString());
            }));

            return arrayOp.map(option => {
                return transformOption(option);
            });
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
        if (typeof (productIds[0]) === "number") {
            prods = await Product.find({ product_code: { $in: productIds } });
        } else {
            // await productIds.map(async ddd=>{
            //     const a =  await Product.findById(ddd);
            //     console.log(a);
            // });

            prods = await Product.find({ _id: { $in: productIds } });
        }
        prods.sort((a, b) => {
            return (
                productIds.indexOf(a._id.toString()) - productIds.indexOf(b._id.toString())
            );
        });
        return prods.map(prod => {
            return transformProduct(prod);
        });
    } catch (error) {
        throw error;
    }
}

const attributeProducts = async attrProdIds => {
    try {
        const attrProds = await AttributeProduct.find({ _id: { $in: attrProdIds } });
        attrProds.sort((a, b) => {
            return (
                attrProdIds.indexOf(a._id.toString()) - attrProdIds.indexOf(b._id.toString())
            );
        });
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

        optionAmounts.sort((a, b) => {
            return (
                opAmountIds.indexOf(a._id.toString()) - opAmountIds.indexOf(b._id.toString())
            );
        });
        return await Promise.all(optionAmounts.map(async opAmount => {
            return await transformOptionAmount(opAmount);
        }));
    } catch (error) {
        throw error;
    }
}

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
        _id: option._id,
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
        product: SingleProduct.bind(rating._doc.product_id)
    }
}

const transformLevelCategories = level => {
    return {
        ...level._doc,
        _id: level.id,
        category_level1: categoryBind.bind(this, level._doc.category_level1_id),
        category_level2: categoryBind.bind(this, level._doc.category_level2_id),
        category_level3: categoryBind.bind(this, level._doc.category_level3_id),
        products: () => productLoader.loadMany(level._doc.products)
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

const transformProduct = product => {
    return {
        ...product._doc,
        _id: product.id,
        rating_star: RatingStarBind.bind(this, product._doc.rating_star),
        categories: LevelCategoriesBind.bind(this, product._doc.categories),
        attribute: () => attributeProductLoader.loadMany(product._doc.attribute),
        option_amount: () => optionAmountLoader.loadMany(product._doc.option_amount),
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

module.exports = {
    transformCategory: transformCategory,
    transformSubCategory: transformSubCategory,
    transformOption: transformOption,
    transformAttribute: transformAttribute,
    transformAccount: transformAccount,
    transformPerson: transformPerson,
    transformProduct: transformProduct
}