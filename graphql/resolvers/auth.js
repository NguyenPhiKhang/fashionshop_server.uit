const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../../models/account');
const Permission = require("../../models/permission");
const DataLoader = require('dataloader');

const permissionLoader = new DataLoader(permission_id =>{
  return Permission.find({_id: {$in: permission_id}});
});

const permission = async (permission_id)=>{
  return await permissionLoader.load(permission_id);
}

module.exports = {
  createAccount: async args => {
    try {
      const existingAccount = await Account.findOne({ email: args.accountInput.email });
      if (existingAccount) {
        throw new Error('Account exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.accountInput.password, 12);

      const account = new Account({
        email: args.accountInput.email,
        password: hashedPassword,
        permission_id: args.accountInput.permission_id,
        record_status: true
      });

      const result = await account.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const account = await Account.findOne({ email: email });
    if (!account) {
      throw new Error('Account does not exist!');
    }
    const isEqual = await bcrypt.compare(password, account.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { accountId: account.id, email: account.email },
      'somesupersecretkey',
      {
        expiresIn: '1h'
      }
    );
    return { accountId: account.id, token: token, tokenExpiration: 1, permission: permission.bind(this, account.permission_id) };
  }
};