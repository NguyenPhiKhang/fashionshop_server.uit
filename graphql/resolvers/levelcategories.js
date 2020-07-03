const LevelCategories = require("../../models/level_categories");

module.exports = {
    deleteProductInLevelCategories: async (args)=>{
        try {
            const level = await LevelCategories.findById(args.id);
            const index = await level._doc.products.indexOf(args.idProduct);
            if (index > -1) {
                level._doc.products.splice(index, 1);
            }

            await level.save();
            return true;
        } catch (error) {
            throw error;
        }
    }
}