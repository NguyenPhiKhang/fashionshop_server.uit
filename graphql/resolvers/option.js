const Option = require("../../models/option");
const Attribute = require("../../models/attribute");
const genCode = require("./sysGenId");
const { transformOption } = require("./merge");

module.exports = {
    createOption: async (args)=>{
        try{
            const code = await genCode("Option");
            const option = new Option({
                option_code: code,
                name: args.optionInput.name,
                attribute_id: args.optionInput.attribute_id,
                type_option: args.optionInput.type_option
            });
            const result = await option.save();
            const attr_value = await Attribute.findById(result.attribute_id);
            if(!attr_value){
                throw new Error("Không tìm thấy thuộc tính");
            }
            attr_value.value.push(option);
            await attr_value.save();
            return transformOption(result);
        }catch(error){
            throw error;
        }
    }
}