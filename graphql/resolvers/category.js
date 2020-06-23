const Category = require("../../models/category");

module.exports = {
    getAllCategory: async () => {
        try {
            const result = await Category.find({});
            return result.map(category => {
                return { ...category._doc, _id: category.id }
            });
        } catch (err) {
            throw err;
        }
    },
    getCategoryById: async (args)=>{
        try{
            const result = await Category.findById(args.id);
            return {...result, _id: result.id};
          }catch(err){
            throw err;
          }
    },
    // createCategory: async (args)=>{
        

    //     const result = new Category({
    //         name: 
    //     })
    // }
}