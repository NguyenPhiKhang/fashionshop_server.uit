const Review = require("../../models/review");
const Product = require("../../models/product");
const Person = require("../../models/person");
const RatingStar = require("../../models/rating_star");
const Cart = require("../../models/cart");
const { transformReview } = require("./merge");
const { sort } = require("ramda");

module.exports = {
    createReview: async (args) => {
        try {
            const review = new Review({
                cartItem_id: args.cartItem_id,
                data: args.data,
                images: typeof (args.images) === "undefined" ? [] : args.images,
                star: args.star,
            });
            const reviewSave = await review.save();
            const cartInfo = await Cart.findOne({ _id: args.cartItem_id }).populate("person_id");
            console.log(cartInfo);
            // await Product.updateOne({_id: args.product_id}, {$push: {review: reviewSave.id}, $inc: {total_review: 1}});
            const prod = await Product.findOne({ _id: cartInfo.product_id }).populate("rating_star");
            await prod.review.push(reviewSave.id);
            prod.total_review = await (prod.total_review + 1);
            if (prod.rating_star !== null) {
                switch (args.star) {
                    case 1:
                        prod.rating_star.star1 = await prod.rating_star.star1 + 1;
                        break;
                    case 2:
                        prod.rating_star.star2 = await prod.rating_star.star2 + 1;
                        break;
                    case 3:
                        prod.rating_star.star3 = await prod.rating_star.star3 + 1;
                        break;
                    case 4:
                        prod.rating_star.star4 = await prod.rating_star.star4 + 1;
                        break;
                    case 5:
                        prod.rating_star.star5 = await prod.rating_star.star5 + 1;
                        break;
                    default:
                        break;
                }
                prod.rating_star.total_star = await prod.rating_star.total_star + 1;
                await prod.rating_star.save();
            } else {
                const rating = new RatingStar({
                    total_star: 1,
                    product_id: args.product_id,
                    star1: args.star === 1 ? 1 : 0,
                    star2: args.star === 2 ? 1 : 0,
                    star3: args.star === 3 ? 1 : 0,
                    star4: args.star === 4 ? 1 : 0,
                    star5: args.star === 5 ? 1 : 0,
                });
                const ratingSave = await rating.save();
                prod.rating_star = await ratingSave;
            }
            await prod.save();
            await cartInfo.person_id.reviews.push(reviewSave.id);
            await cartInfo.person_id.save();
            cartInfo.isReview = await true;
            await cartInfo.save();

            // await Review.deleteOne({_id: "5f2023bed384450ac25375c5"});
            // await Product.updateOne({_id: "5f02bbd1cbe29022dcd29791"}, {$set: {review: []}});
            // await Person.updateOne
            return await transformReview(reviewSave);
        } catch (error) {
            throw error;
        }
    },
    getReviews: async (args) => {
        try {
            const reviews = await Person.findOne({ _id: args.person_id }, { _id: 0, reviews: 1 }).populate("reviews");
            return await Promise.all(reviews.reviews.map(async rv => {
                return await transformReview(rv);
            }));
        } catch (error) {
            throw error;
        }
    },
    getReviewsOfProduct: async (args) => {
        try {
            let infoReview;
            let limit = 0;
            let skip = 0;
            if (typeof (args.pageNumber) === "number" && args.pageNumber > 0) {
                skip = (args.pageNumber - 1) * 10;
                limit = 10;
            }

            if (typeof (args.sort) === "undefined" || args.sort === 0) {
                infoReview = await Product.findOne({ _id: args.product_id }, { review: 1, rating_star: 1 }).populate({ path: 'review', options: { skip: skip, limit: limit, sort: { createAt: -1 } } }).populate('rating_star');
            } else {
                if (args.sort < 6 && args.sort > 0) { 
                    infoReview = await Product.findOne({ _id: args.product_id }, { review: 1, rating_star: 1 }).populate({ path: 'review', match: { star: args.sort }, options: { skip: skip, limit: limit, sort: { createAt: -1 } } }).populate('rating_star'); }
                else { 
                    infoReview = await Product.findOne({ _id: args.product_id }, { review: 1, rating_star: 1 }).populate({ path: 'review', match: { $expr: { $gt: [{ $size: "$images" }, 0] } }, options: { skip: skip, limit: limit, sort: { createAt: -1 } } }).populate('rating_star'); 
                }
            }
            const reviews = await Promise.all(infoReview.review.map(async a => {
                return await transformReview(a);
            }));

            return { rating_star: infoReview.rating_star, reviews: reviews };
        } catch (error) {
            throw error;
        }
    }
}