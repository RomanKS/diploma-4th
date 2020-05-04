let model = require('../models');

let registration = async (res, user, type) => {
    let UserType  = null,
        UserModel = null;

    if (res && user && user.userName && user.password) {
        UserType = await model.UserType.findAll({
            where: {
                Type: type
            }
        });

        if (UserType) {
            UserModel = await model.User.create({
                UserName: user.userName,
                FirstName: user.firstName,
                LastName: user.lastName,
                FK_UserType: UserType[0].ID,
                Password: user.password,
            });

            if (UserModel) {
                return res.json({ user: UserModel.toAuthJSON() });
            } else {
                return res.json({error: true});
            }
        } else {
            return res.json({error: true});
        }
    } else {
        return res.json({error: true});
    }
};

let workerRegistration = (res, user) => {
    registration(res, user, "worker");
};

let adminRegistration = (res, user) => {
    registration(res, user, "admin");
};

module.exports = {
    workerRegistration : workerRegistration,
    adminRegistration : adminRegistration
};