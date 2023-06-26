import sequlize from "../database/database.js";

export async function createUser(userId) {
    try {
        let user = await sequlize.models.users.create({
            userId: userId
        })
        return user
    } catch (error) {
        console.log(error)
    }
}

export async function removeUser(userId) {
}

export async function updateUser(userId) {

}

export async function getUserById(userId) {
    try {
        let user = (await sequlize.models.users.findOne({
            where: {
                userId: userId
            }
        }))
        if (user) return user.dataValues
        else return null
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function isUserAuth(userId) {
    try {
        let user = (await sequlize.models.users.findOne({
            where: {
                userId: userId
            }
        }))
        if (user) return user.dataValues.auth
        else return null
    } catch (error) {
        console.log(error)
        return null
    }
}