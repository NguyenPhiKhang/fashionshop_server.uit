const Category = require("../../models/category");
const { tranformCategory } = require("./merge");
const genCode = require("./sysGenId");


module.exports = {
    getAllCategory: async () => {
        try {
            const result = await Category.find({});
            return result.map(category => {
                return tranformCategory(category);
            });
        } catch (err) {
            throw err;
        }
    },
    getCategoryById: async (args)=>{
        try{
            const result = await Category.findById(args.id);
            return tranformCategory(result);
          }catch(err){
            throw err;
          }
    },
    createCategory: async (args)=>{
        const code = await genCode("Category");
        if(typeof(args.categoryInput.parent_id) === 'undefined'){
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

        if(args.categoryInput.parent_id)
            return tranformCategory(result);
        else return result;
    }
}