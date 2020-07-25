const Order = require("../../models/order");
const Cart = require("../../models/cart");
const OptionAmount = require("../../models/option_amount");
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
                delivery_status: "Chờ xử lí"
            });
            const orderSave = await order.save();
            await Cart.updateMany({_id:{$in: input.carts}}, {$set: {isOrder: true}});
            return await transformOrder(orderSave);
        } catch (error) {
            throw error;
        }
    },
    updateOrder: async (args)=>{
        try {
            const order = await Order.findOne({_id: args.id}).populate("carts");
            console.log(order);
            // if(args.delivery_status==="Đã xác nhận"&&order.delivery_status==="Chờ xác nhận"){
            //     await order.carts
            // }
            // else{
            //     if(args.delivery_status==="Huỷ"&&order.delivery_status!=="Chờ xác nhận"){

            //     }
            // }

            // order.delivery_status = await args.delivery_status;
            // order.shipping_unit = (typeof(args.shipping_unit)==="undefined")? await order.shipping_unit: await args.shipping_unit;
            // await order.save();

            return true;
        } catch (error) {
            throw error;
        }
    }
}