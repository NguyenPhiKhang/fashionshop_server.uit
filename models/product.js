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
    total_review: { // tổng review
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
        ref: "RatingStar"
    },
    stock_status: { // trạng thái hàng như thế nào? 1: còn hàng, 0: hết hàng
        type: Boolean,
        default: true
    },
    review: [{ // các bài đánh giá
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    is_freeship: Boolean,
    attribute: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Attribute_Option'
        }
    ],
    category_id:{
        type: String,
        required: true
    },
    categories:{
        type: Schema.Types.ObjectId,
        ref: "Cagegories"
    },
    record_status: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model("Product", productSchema);