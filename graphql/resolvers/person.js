const Person = require("../../models/person");
const { transformPerson } = require("./merge");

module.exports = {
    getPerson: async (args) => {
        try {
            const person = await Person.findById(args.id);
            return await transformPerson(person);
        } catch (error) {
            throw error;
        }
    },
    // updatePerson: async (args)=>{
    //     try {
    //         await Person.findByIdAndUpdate(args.id, {$set: {name: args.name}});
    //         return true;
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}