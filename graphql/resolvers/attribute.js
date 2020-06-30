const Attribute = require("../../models/attribute");
const { transformAttribute } = require("./merge");
const genCode = require("./sysGenId");

module.exports = {
    getAttributeById: async (args)=>{
        try {
            const result = await Attribute.findById(args.id);
            return await transformAttribute(result);
        } catch (err) {
            throw err;
        }
    },
    getAllAttribute: async () =>{
        try{
            const result = await Attribute.find({});
            return result.map(async attr=>{
                return await transformAttribute(attr);
            });

        }catch(error){
            throw error;
        }
    },
    createAttribute: async (args)=>{
        try{
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
        }catch(error){
            throw error;
        }
    }
}