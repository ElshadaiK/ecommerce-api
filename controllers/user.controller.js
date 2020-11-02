const { pick } = require('lodash')

const userModel = require('../models/user-model')
const roleModel = require('../models/role-model')


exports.All = async (req, res) => {

    try {

        let sort = {}
        if(req.query.sort) {
            sort[req.query.sort] = req.query.asc ? 1 :-1 
        }

        let query = {}

        if(req.query.filter) {
            let filter = JSON.parse(req.query.filter);
            query = pick(filter, ['name', 'email', 'active']) 
            
        }
        
        const options = {
            sort: Object.values(sort).length > 0 ? sort: {
                'created_at': -1
            },
            page: req.query.page || 1,
            limit: req.query.limit || 10,
            populate: { path: 'roles', populate: {path: 'permissions'}}
        }
        const users = await userModel.paginate(query,options)

        res.json(users)

    } catch (error) {
        res.status(400).json({
            error: true,
            message: error.message
        })
    }
    
}

exports.get = async (req, res) => {

    try {
        const user = await userModel.findById(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(404).json({
            error: true,
            message: error
        })
    }

}

exports.create = async (req, res) => {
    try {
        let data = await roleModel.find({
            name: {
                $in: 'user' // [1,2,3]
            }
        })
        const user = await userModel.create({...req.body, roles: data})

        res.json(user)
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }

}

exports.update = async (req, res) => {

    try {
        let user = await userModel.findById(req.params.id)
        if(user) {
            user = await userModel.updateOne({_id: user._id}, req.body)
            return res.json(user)
        }

        throw new Error('User dosen\'t exist')
       

        
    } catch (error) {
        res.status(400).json({
            error: true,
            message: error
        })
    }
}

exports.remove = async (req, res) => {
    try {
        let user = await userModel.findById(req.params.id)
        if(user) {
            await userModel.remove({
                _id: user._id
            })
            return res.json(user)
        }
        throw new Error('User doesn\t exist')

    } catch (error) {
        
    }
}