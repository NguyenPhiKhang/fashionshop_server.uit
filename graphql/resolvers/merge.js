const DataLoader = require('dataloader');

const { dateToString } = require("../../helpers/date");
const Category = require("../../models/category");
const Option = require("../../models/option");
const Attribute = require("../../models/attribute");
const Account = require("../../models/account");
const Person = require("../../models/person");
const Permission = require("../../models/permission");

const categoryLoader = new DataLoader(id => {
    return Category.find({_id: {$in: id}});
});

const optionLoader = new DataLoader(optionId => {
    return OptionDetail(optionId);
});

const attributeLoader = new DataLoader(attrId => {
    return Attribute.find({ _id: { $in: attrId } });
});

const accountLoader = new DataLoader(accountId => {
    return Account.find({_id: {$in: accountId}});
});

const personLoader = new DataLoader(personId => {
    return Person.find({_id: {$in: personId}});
});

const permissionLoader = new DataLoader(perId => {
    return Permission.find({_id: {$in: perId}});
})

const categoryBind = async (parent_id) => {
    try {
        if(!parent_id)
            return null;
        const category = await categoryLoader.load(parent_id);
        return transformCategory(category);
    } catch (error) {
        throw error;
    }
}

const attributeBind = async (attr_id) => {
    try {
        const attr = await attributeLoader.load(attr_id);
        return transformAttribute(attr);
    } catch (error) {
        throw error;
    }
}

const AccountBind = async (accountId) => {
    try {
        const account = await accountLoader.load(accountId);
        return transformAccount(account);
    } catch (error) {
        throw error;
    }
};

const PermissionBind = async (perId) => {
    try {
        return await permissionLoader.load(perId);
    } catch (error) {
        throw error;
    }
}

const PersonBind = async (personId) => {
    try {
        const person = await personLoader.load(personId);
        return transformPerson(person);
    } catch (error) {
        throw error;
    }
}

const OptionDetail = async (optionId) => {
    try {
        const options = await Option.find({ _id: { $in: optionId } });
        return options.map(option => {
            return transformOption(option);
        });
    } catch (err) {
        throw err;
    }
}

const transformCategory = category => {
    return {
        ...category._doc,
        _id: category.id,
        parent: categoryBind.bind(this, category._doc.parent_id)
    }
}

const transformOption = option => {
    return {
        ...option._doc,
        _id: option.id,
        attribute: attributeBind.bind(this, option._doc.attribute_id)
    }
}

const transformAttribute = attr => {
    return {
        ...attr._doc,
        _id: attr.id,
        value: () => optionLoader.loadMany(attr._doc.value)
    }
}

const transformAccount = account => {
    return {
        ...account._doc,
        _id: account.id,
        password: null,
        person: PersonBind.bind(this, account._doc.person_id),
        permission: PermissionBind.bind(this, account._doc.permission_id)
    }
}

const transformPerson = person => {
    return {
        ...person._doc,
        _id: person.id,
        account: AccountBind.bind(this, person._doc.account_id),
        createdAt: dateToString(person._doc.createdAt),
        updatedAt: dateToString(person._doc.updatedAt)
    }
}

module.exports = {
    transformCategory: transformCategory,
    transformOption: transformOption,
    transformAttribute: transformAttribute,
    transformAccount: transformAccount,
    transformPerson: transformPerson
}