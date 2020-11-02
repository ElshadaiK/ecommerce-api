const permissions = [
    
    'create role',
    'view any role',
    'view role',
    'update role',
    'remove role',

    'create user',
    'view any user',
    'view user',
    'update user',
    'remove user',
]

const roles = {
    admin: [...permissions],
    user: [
        'create user',
        'view user',
        'update user',
    ]
}

const users = [
    {
        name: 'admin',
        email: 'super@admin.com',
        password: 'superuser',
        roles: ['admin'],
        phone_no : +251900000000

    }
]

module.exports = { permissions, roles, users }
