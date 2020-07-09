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
            image: args.categoryInput.image,
            type_size: args.categoryInput.type_size
        });
        const result = await category.save();

        if (args.categoryInput.parent_id)
            return transformCategory(result);
        else return result;
    },
    // updateTypeSizeCat: async (args) =>{
    //     try {
    //         await Category.updateOne(
    //             {category_code: args.id},
    //             {$set: {type_size: args.size}});
    //         return true;
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    // addImageCategory: async (args)=>{
    //     try {
    //         const arrr = [
    //             {icon:"7f389971aa2801c10a3246327a902b56.png",image:"562b5dacb07bc44e557c43ddf6e02ef3.jpeg",code:103},
    //             {icon:"db0e6886c4d82cb59cc36bb75b44d7db.png",image:"d13267f072402ea489b967f5df3a2d78.png",code:104},
    //             {icon:"bf4317701fa4f39f496767c00299f102.png",image:"a3cbe4bc4abdb053a122e0a92b4e6efa.jpg",code:105},
    //             {icon:"c525b73f135ad60b0072a8fd49eb594a.png",image:"732e4310e02fad8d666109f7db5a71c4.jpg",code:106},
    //             {icon:"6fa636e2ac31cb84e1579630ad51d686.png",image:"0fedecf887c942197c3f1cb62c05bfc8.jpg",code:107},
    //             {icon:"a01fc5a1c798065607b45a1060690355.png",image:"40210009df69a47a5f9b26a4bad768ce.jpg",code:108},
    //             {icon:"508668c8083f80a95ee1885daafc101f.png",image:"dd8370a2d0bdc325be1aba891ee774cf.jpg",code:109},
    //             {icon:"3bd440146c72dceb5d69f1c0f3b53860.png",image:"fff0f6e078640507a07a352fa2e744d8.jpg",code:110},
    //             {icon:"456f6700e31625e5386b23cbae1261cc.png",image:"3105e58a3afca1303a78241c75f2e3a8.jpg",code:111},
    //             {icon:"cf8938aa95973dc2f067c26bf90c3fcf.png",image:"b9ac3be9b040a715620a8385c5defc8a.jpg",code:112},
    //             {icon:"9882a6dcc3b3877d9040732ece1e0430.png",image:"d22e475b965da862d8f5126454213099.jpg",code:113},
    //             {icon:"d93381fad176669354ac1d9a9693ce0c.png",image:"07753a9db23457f99aa293de532bcb77.jpg",code:115},
    //             {icon:"a7e499bf7920376c4a7f06607fca6a9b.png",image:"e0217d110535f3433ce69170c98de8c5.jpg",code:118},
    //             {icon:"6a8f3af24082c72f8155ce8022b09192.png",image:"1ba9b7b8b5000a29462f971a71781303.jpg",code:119},
    //             {icon:"256497652a14ddebf48d7d6277b37abe.png",image:"dcfd4ac2621ba68a9ddc5e987981068f.jpg",code:120},
    //             {icon:"437552eef0f56aaa9a714ad499346793.png",image:"bd9966c39c421437f51c0783e309034b.jpg",code:121},
    //             {icon:"3acd3bbd2f83fd04fa896df10ad00650.png",image:"70f730e04e1d7e1cc4290ac9ab1c8dbe.jpg",code:122},
    //             {icon:"1eecec9ea1b3185dcd91e5fe8a836859.png",image:"715f1e7989f04ce6b33396b34fc91ad4.jpg",code:123},
    //             {image:"e381f7e428cb882483b09ee35ba374e7.jpg",icon:"7769e9c98e3dae6daee55307ce0a54f4.png",code:124},
    //             {image:"1e1e23fb21d0f0139a0776c00b15f25c.jpg",icon:"0356055f8d7f0e296eee9ad8fcf98f21.png",code:125},
    //             {image:"0f1747d924d340491f542422d8a5ae15.jpg",icon:"9db4b38c9554f10091519a7492ceec08.png",code:126},
    //             {image:"dac96106dd739ecaa0bbd1733939fd20.jpg",icon:"7bc654bcdf9ec4e7e517ad6a6a33923c.png",code:127},
    //             {image:"9eb19bf782485100747142bb8e8605fc.jpg",icon:"5d31f38349666e1082180e8b08b9b9f7.png",code:128},
    //             {image:"c25d74192ca6e76ac225e0a703192eb2.jpg",icon:"34dce4c358e769a17c717c422476ef8f.png",code:1122},
    //             {image:"e3cdcab5f215c1252c30216788e74b72.jpg",icon:"0b0ee2ae2b1f21e627b8d82c51a2a06f.png",code:129},
    //             {image:"acc8528eaabe0dc4387864ad64328755.jpg",icon:"5413483d71fba8cd7ee2a3970a084ccd.png",code:1133},
    //             {image:"e20a00ea7c8ac9f4d563699e2a303393.jpg",icon:"675eaa86a01064d35dc5a9161be1b0c2.png",code:130},
    //             {image:"72a00da138cfacddd01c9972c355f327.jpg",icon:"0efac92b6441f8c2d645380357cd9a72.png",code:131}
    //         ]
    //         const cats = await Category.find({level_cat: args.level});
    //         await Promise.all(cats.map(async a=>{
    //             await Promise.all(arrr.map(async b=>{
    //                 if(a.category_code === b.code){
    //                     a.icon = b.icon;
    //                     a.image = b.image;
    //                     await a.save();
    //                 }
    //             }))
    //         }))
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}