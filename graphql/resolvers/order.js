const Order = require("../../models/order");
const Cart = require("../../models/cart");
const Product = require("../../models/product");
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
            if(args.delivery_status.toLowerCase()==="đã xác nhận"&&order.delivery_status.toLowerCase()==="chờ xử lí"){
                await Promise.all(order.carts.map(async or=>{
                    await OptionAmount.updateOne({_id: or.option_amount_id}, {$inc: {amount: -or.amount}});
                    await Product.updateOne({_id: or.product_id}, {$inc: {order_count: 1}});
                }));
            }
            else{
                if(args.delivery_status.toLowerCase()==="huỷ"&&order.delivery_status.toLowerCase()!=="chờ xử lí"){
                    await Promise.all(order.carts.map(async or=>{
                        await OptionAmount.updateOne({_id: or.option_amount_id}, {$inc: {amount: or.amount}});
                        await Product.updateOne({_id: or.product_id}, {$inc: {order_count: -1}});
                    }));
                }
            }

            order.delivery_status = await args.delivery_status;
            order.shipping_unit = (typeof(args.shipping_unit)==="undefined")? await order.shipping_unit: await args.shipping_unit;
            await order.save();

            return true;
        } catch (error) {
            throw error;
        }
    },
    getOrder: async (args)=>{
        try {
            const orders = await Order.find({person_id: args.person_id});
            return await Promise.all(orders.map(async a =>{
                return await transformOrder(a);
            }));
        } catch (error) {
            throw error;
        }
    }
}