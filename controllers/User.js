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
                let responseJson = await UserModel.toAuthJSON(model.UserType);

                return res.json({ user: responseJson });
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

let managerRegistration = (res, user) => {
    registration(res, user, "Manager");
};

let spectatorRegistration = (res, user) => {
    registration(res, user, "Spectator");
};

module.exports = {
    managerRegistration : managerRegistration,
    spectatorRegistration : spectatorRegistration
};