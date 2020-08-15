const Person = require("../../models/person");
const { transformPerson, transformProduct } = require("./merge");
const bcrypt = require('bcryptjs');
const Account = require('../../models/account');
const { dateToString } = require("../../helpers/date");

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
    },
    updatePerson: async (args)=>{
        try {
            const {id, name, avatar, sex, number_phone, birthday, shipping_address, password} = args.personInput;
            const person = await Person.findById(id);
            console.log(person);

            console.log(password);
            console.log(typeof(password));
            if(password!==null&&typeof(password)!=="undefined"){
                const account = await Account.findOne({person_id: id});
                const isEqual = await bcrypt.compare(password, account.password);
                if(isEqual===false){
                    const hashedPassword = await bcrypt.hash(password, 12);
                    account.password = hashedPassword;
                    await account.save();
                    console.log("password new 1: "+hashedPassword);
                }
            }
            
            if(shipping_address!==null)
                person.shipping_address = [shipping_address];
            person.name= await name;
            console.log("name");
            person.avatar = await avatar;
            console.log(avatar);
            person.sex = await sex;
            person.number_phone = await number_phone;
            person.birthday = await dateToString(new Date(birthday));

            await person.save();
            const a = await Account.findOne({person_id: id});
            console.log("password new: "+a.password);
            
            return true;
        } catch (error) {
            throw error;
        }
    }
}