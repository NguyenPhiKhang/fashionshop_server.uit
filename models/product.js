const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_code:{
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    images: [{ // list image sản phẩm
        type: String,
    }],
    price: { // giá gốc
        type: Number,
    },
    final_price: { // giá khi giảm giá
        type: Number,
    },
    promotion_percent: { // phần trăm giảm giá
        type: Number
    },
    description: { // mô tả sản phẩm
        type: String,
    },
    total_comment: { // tổng comment
        type: Number,
    },
    counter_like: { // tổng lượt lke
        type: Number,
    },
    order_count: { // số lần đặt hàng
        type: Number,
    },
    weight: { // cân nặng sản phầm
        type: Number,
    },
    short_description: { // mô tả ngắn gọn sản phẩm
        type: String,
    },
    rating_star: { // các sao đã được đánh giá
        type: Schema.Types.ObjectId,
        ref: "Rating"
    },
    stock_status: { // trạng thái hàng như thế nào? 1: còn hàng, 0: hết hàng
        type: Boolean,
        default: true
    },
    status_text: { // text trạng thái hàng
        type: String
    },
    rating_comment: { // các bài đánh giá
        type: Schema.Types.ObjectId
    },
    is_freeship: Boolean,
    attribute: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attribute_Option'
        }
    ]
});

module.exports = mongoose.model("Product", productSchema);