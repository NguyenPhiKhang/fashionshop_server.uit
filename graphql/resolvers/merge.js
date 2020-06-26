const DataLoader = require('dataloader');

const Category = require("../../models/category");
const Option = require("../../models/option");
const Attribute = require("../../models/attribute");

const categoryLoader = new DataLoader(id => {
    return Category.findById(id);
});

const optionLoader = new DataLoader(optionId => {
    return OptionDetail(optionId);
});

const attributeLoader = new DataLoader(attrId => {
    return Attribute.find({ _id: { $in: attrId } });
});

const categoryBind = (parent_id) => {
    return categoryLoader.load(parent_id);
}

const attributeBind = async (attr_id) => {
    try {
        const attr = await attributeLoader.load(attr_id);
        return {
            ...attr._doc,
            _id: attr.id,
            value: () => optionLoader.loadMany(attr._doc.value)
        }
    } catch (error) {
        throw error;
    }
}

const OptionDetail = async (optionId) => {
    try {
        const options = await Option.find({ _id: { $in: optionId } });
        return options.map(option => {
            return transformOption(option);
        });
    } catch (err) {
        throw err;
    }
}

const transformCategory = category => {
    return {
        ...category._doc,
        _id: category.id,
        parent: categoryBind.bind(this, category._doc.parent_id)
    }
}

const transformOption = option => {
    return {
        ...option._doc,
        _id: option.id,
        attribute: attributeBind.bind(this, option._doc.attribute_id)
    }
}

const transformAttribute = attr => {
    return {
        ...attr._doc,
        _id: attr.id,
        value: () => optionLoader.loadMany(attr._doc.value)
    }
}

module.exports = {
    transformCategory: transformCategory, 
    transformOption: transformOption,
    transformAttribute: transformAttribute
}