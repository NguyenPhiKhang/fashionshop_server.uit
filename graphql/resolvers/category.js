const Category = require("../../models/category");
const { transformCategory, transformSubCategory } = require("./merge");
const genCode = require("./sysGenId");


module.exports = {
    getAllCategory: async (args) => {
        try {
            if (!args.level || typeof (args.level) === "undefined") {
                const result = await Category.find({});
                return result.map(category => {
                    if (category.parent_id === null)
                        return category;
                    return transformCategory(category);
                });
            }else{
                const result = await Category.find({level_cat: {$in: args.level}});
                return result.map(category =>{
                    return transformSubCategory(category);
                });
            }
        } catch (err) {
            throw err;
        }
    },
    getCategoryById: async (args) => {
        try {
            const result = await Category.findById(args.id);
            if (result.parent_id === null)
                return result;
            return transformCategory(result);
        } catch (err) {
            throw err;
        }
    },
    createCategory: async (args) => {
        const nameSchema = "Category" + args.categoryInput.level_cat.toString();
        const code = await genCode(nameSchema);
        if (typeof (args.categoryInput.parent_id) === 'undefined') {
            args.categoryInput.parent_id = null;
        }
        const category = new Category({
            category_code: code,
            name: args.categoryInput.name,
            icon: args.categoryInput.icon,
            level_cat: args.categoryInput.level_cat,
            parent_id: args.categoryInput.parent_id,
            image: args.categoryInput.image
        });
        const result = await category.save();

        if (args.categoryInput.parent_id)
            return transformCategory(result);
        else return result;
    }
}