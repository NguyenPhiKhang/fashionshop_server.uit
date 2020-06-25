const DataLoader = require('dataloader');

const Category = require("../../models/category");

const categoryLoader = new DataLoader(id =>{
    return Category.findById(id);
});

const categoryBind = (parent_id)=>{
    return categoryLoader.load(parent_id);
}

const tranformCategory = category => {
    return {
        ...category._doc,
        _id: category.id,
        parent: categoryBind.bind(this, category.parent_id)
    }
}

module.exports = {tranformCategory: tranformCategory}