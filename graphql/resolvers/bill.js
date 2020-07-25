const Bill = require("../../models/bill");

module.exports = {
    // renderCart: async (args) => {
    //     try {
    //         // if(args.cartInput.length !== 0)
    //         // {
    //         const orders =  Promise.all(args.orders.map(async a => {
    //             // console.log(a.product_id);
    //             const order = new Order({
    //                 product_id: a.product_id,
    //                 option_amount_id: a.option_amount_id,
    //                 amount: a.amount,
    //                 price_order: a.price_order
    //             });

    //             return await order.save();
                
    //         }));
    //         const bill = new Bill({
    //             person_id: args.person_id,
    //             price_ship: a.price_ship,
    //             total_price: a.total_price,
    //             address: a.address,
    //             method_payment: a.method_payment,
    //             orders: orders,
    //             delivery_status: "Đang xử lí",
    //             isDone: false
    //         });

    //         const saveBill = await bill.save();
    //         return await transformBill(saveBill);

    //         // }else return [];
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}