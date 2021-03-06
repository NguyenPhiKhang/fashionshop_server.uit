const Cart = require("../../models/cart");
const Person = require("../../models/person");
const { transformCart } = require("./merge");

module.exports = {
    addCart: async (args) => {
        try {
            const a = await args.cartInput;
            const cart = new Cart({
                person_id: a.person_id,
                product_id: a.product_id,
                option_amount_id: a.option_amount_id,
                amount: a.amount,
                isOrder: false,
                isReview: false
            });
            const cartSave = await cart.save();
            const person = await Person.findById(a.person_id);
            await person.carts.push(cartSave);
            await person.save();
            return await transformCart(cartSave);
        } catch (error) {
            throw error;
        }
    },
    getCarts: async (args) => {
        try {
            if (typeof (args.person_id) === "undefined") {
                const carts = await Cart.find({ $and: [{ _id: { $in: args.ids } }, { isOrder: false }] });
                return await Promise.all(carts.map(async c => {
                    return await transformCart(c);
                }))
            }
            else{
                const person = await Person.findById(args.person_id);
                const carts = await Cart.find({ $and: [{ _id: { $in: person.carts } }, { isOrder: false }] });
                console.log(carts);
                return await Promise.all(carts.map(async c => {
                    return await transformCart(c);
                }))
            }
        } catch (error) {
            throw error;
        }
    },
    deleteCart: async (args) => {
        try {
            await Cart.deleteMany({ _id: { $in: args.ids } });
            const person = await Person.findOne({ carts: { $all: args.ids } });
            for (const c of args.ids){
                const i = await person.carts.indexOf(c);
                await person.carts.splice(i, 1);
            };
            await person.save();
            // await Person.findByIdAndUpdate("5f0212a9a3834d2fc0d639f0", {$set: {carts: []}})
            return true;
        } catch (error) {
            throw error;
        }
    },
    updateCart: async (args) => {
        try {
            await Cart.updateOne({_id: args.id}, { $set: { amount: args.amount} });
            return true;
        } catch (error) {
            throw error;
        }
    }

}