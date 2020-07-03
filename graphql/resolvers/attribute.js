const Attribute = require("../../models/attribute");
const { transformAttribute } = require("./merge");
const genCode = require("./sysGenId");

module.exports = {
    getAttributeById: async (args) => {
        try {
            const result = await Attribute.findById(args.id).exec();
            return await transformAttribute(result);
        } catch (err) {
            throw err;
        }
    },
    getAllAttribute: async () => {
        try {
            const result = await Attribute.find({});
            // result.sort((a, b) => {
            //     return (
            //         result.indexOf(a._id.toString()) - result.indexOf(b._id.toString())
            //     );
            // });
            // console.log(result);
            return await Promise.all(result.map(async attr => {
                return await transformAttribute(attr);
            }));

        } catch (error) {
            throw error;
        }
    },
    createAttribute: async (args) => {
        try {
            const code = await genCode("Attribute");
            const attribute = new Attribute({
                attribute_code: code,
                name: args.name,
            });
            const result = await attribute.save();
            return {
                ...result._doc,
                _id: result.id
            }
        } catch (error) {
            throw error;
        }
    }
}