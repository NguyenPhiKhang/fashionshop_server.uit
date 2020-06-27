const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../../models/account');
//const Permission = require("../../models/permission");
const Person = require("../../models/person");

const {transformAccount} = require("./merge");

module.exports = {
  createAccount: async args => {
    try {
      const existingAccount = await Account.findOne({ email: args.accountInput.email });
      if (existingAccount) {
        throw new Error('Account exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.accountInput.password, 12);

      const personSchema = new Person({
        name: args.accountInput.name
      });
      const person = await personSchema.save();

      if(!person){
        throw new Error("Không tạo được tài khoản!");
      }
      
      const account = new Account({
        email: args.accountInput.email,
        password: hashedPassword,
        permission_id: args.accountInput.permission_id,
        record_status: true,
        person_id: person.id
      });

      const result = await account.save();

      return transformAccount(result);
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

    return { account: transformAccount(account), token: token, tokenExpiration: 1 };
  }
};