const Order = require("../../models/order");
const { transformOrder } = require("./merge");

module.exports = {
    renderCart: async (args)=>{
        try {
            if(args.cartInput.length !== 0)
            {
                return await Promise.all(args.cartInput.map(async a =>{
                    console.log(a.product_id);
                    const order = new Order({
                        product_id: a.product_id,
                        option_amount_id:a.option_amount_id,
                        amount: a.amount,
                        price_order: 0
                    });
                    return await transformOrder(order);
                }));
            }else return [];
        } catch (error) {
            throw error;
        }
    }
}