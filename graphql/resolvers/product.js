const Product = require("../../models/product");
const LevelCategories = require("../../models/level_categories");
const { CeilPrice } = require("../../helpers/ceil_price");
const { description } = require("../schema");
const genCode = require("./sysGenId");

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
            const product = new Product({
                name: args.productInput.name,
                product_code: gencode,
                images: null,
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
                review: null,
                is_freeship: args.productInput.is_freeship,
                category_id: args.productInput.category_id,
                categories: levelcategories._id,
                attribute: null,
                record_status: true
            });

            const saveProduct = await product.save();
            levelcategories.products.push(saveProduct);
            await levelcategories.save();
            return { ...saveProduct._doc, _id: saveProduct.id }
        } catch (error) {
            throw error;
        }
    }
}