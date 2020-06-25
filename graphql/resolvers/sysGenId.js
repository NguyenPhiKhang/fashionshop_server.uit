const SysGenId =  require("../../models/sys_gen_id");

const genCode = async (name)=>{
    try{
    const result = await SysGenId.findOne({name_schema: name});
    if(result){
        let gencode = ++result.value;
        await result.save();
        return gencode;
    }else{
        const sysid = new SysGenId({
            name_schema: name,
            value: 1
        });
        const createSys = await sysid.save();
        return createSys.value;
    }}catch(error){
        throw error;
    }
}

module.exports = genCode;