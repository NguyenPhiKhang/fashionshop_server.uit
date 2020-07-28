const Person = require("../../models/person");
const { transformPerson, transformProduct } = require("./merge");

module.exports = {
    getPerson: async (args) => {
        try {
            const person = await Person.findById(args.id);
            return await transformPerson(person);
        } catch (error) {
            throw error;
        }
    },
    actionFavorite: async (args)=>{
        try {
            const Fav = await Person.findOne({_id: args.person_id});
            const isFav = await Fav.favorites.indexOf(args.product_id);
            if(isFav<0){
                await Fav.favorites.push(args.product_id);
            }else{
                await Fav.favorites.splice(isFav, 1);
            }

            await Fav.save();
            return true;
        } catch (error) {
            throw error;
        }
    },
    getFavorites: async (args)=>{
        try {
            const products = await Person.findOne({_id: args.person_id}, {favorites: 1, _id: 0}).populate("favorites");
            const prods = await Promise.all(products.favorites.map(async product => {
                return await transformProduct(product._doc);
            }));

            return prods;
        } catch (error) {
            throw error;
        }
    }
    // updatePerson: async (args)=>{
    //     try {
    //         await Person.findByIdAndUpdate(args.id, {$set: {name: args.name}});
    //         return true;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}