var { permissions, roles, users } = require('../config/migrations')


const logger = require('../config/logger');

const permissionModel = require('../models/permission-model')
const roleModel = require('../models/role-model')
const userModel = require('../models/user-model')

module.exports = {
    
    migratePermissions: async () => {
        logger.info(`Checking permissions migrations...`);
        // retrieve all permissions from db
        let permissionDocument =  await permissionModel.find({})
        
        if(permissions.length > permissionDocument.length) {
                logger.info(`Found new permissions...`);
                // some operation
                permissions = permissions.filter(per => {
                    return permissionDocument.findIndex(val => val.name === per) === -1
                })
                await permissionModel.insertMany([
                    ...permissions.map(val => ({name: val}))
                ])
                logger.info(`migrate permission completed ...`);
                return;
                
            }
            logger.info(`Noting to migrate fro permission ...`);
    },

    migrateRoles: async () => {
        logger.info(`Checking role migrations...`);

        await Object.keys(roles).forEach( async index => {
            // count if role exists
            let roleDocumentCount = await roleModel.countDocuments({ name: index})
            if(roleDocumentCount === 0) {
                logger.info(`Found new role...`);
                 let data =  await permissionModel.find({
                      name: {
                          $in: roles[index]
                      }
                  })
                  
                  await roleModel.create({
                        name: index,
                        permissions: data.map(val => val._id)
                    })
                    logger.info(`completed ${index} role migrated...`);
                   
            }
            })
            logger.info(`completed roles migrations...`);
        
    },

    migrateUsers: async () => {
        logger.info(`Checking users migrations...`);

        await users.forEach(async user => {
            let userDocumentCount = await userModel.countDocuments({
                name: user.name
            })
            
                if(userDocumentCount === 0) {
                    let data = await roleModel.find({
                        name: {
                            $in: user.roles // [1,2,3]
                        }
                    })
                        await userModel.create({
                            ...user,
                            roles: data.map(val => val._id)
                        })
                        logger.info(`completed ${user.name} user migrated...`);
                        
                }
        })
        logger.info(`completed users migrations...`);
    }
}