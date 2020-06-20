const Permission = require("../../models/permission")

module.exports = {
  createPermission: async (args) => {
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!');
    // }
    const permission = new Permission({
      name: args.permissionInput.name,
      desc: args.permissionInput.desc
    });
    try {
      const result = await permission.save();
      return { ...result._doc };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  getPermission: async () => {
    try {
      const result = await Permission.find({});
      return result.map(permission=>{
        return {...permission._doc}
      })
    } catch (err) {
      throw err;
    }
  }
}