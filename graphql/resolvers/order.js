const Order = require("../../models/order");
const Cart = require("../../models/cart");
const { transformOrder } = require("./merge");

module.exports = {
    createOrder: async (args)=>{
        try {
            const input = await args.orderInput;
            const order = new Order({
                person_id: input.person_id,
                price_ship: input.price_ship,
                total_price: input.total_price,
                address: input.address,
                method_payment: input.method_payment,
                carts: input.carts,
                shipping_unit: '',
                delivery: "Chờ xử lí"
            });
            const orderSave = await order.save();
            await Cart.updateMany({_id:{$in: input.carts}}, {$set: {isOrder: true}});
            return await transformOrder(orderSave);
        } catch (error) {
            throw error;
        }
    }
}