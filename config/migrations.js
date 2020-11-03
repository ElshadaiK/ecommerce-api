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

    'view any product',
    'view product',
    'update product',
    'create product',
    'remove product',

    'add to cart',
    'purchase',
    'clear cart',
    'remove from cart',
    'get cart',
    'get total',

    'add to any cart',
    'purchase any',
    'clear any cart',
    'remove from any cart',
    'get any cart',
    'get any total'

]

const roles = {
    admin: [...permissions],
    user: [
        'view any product',
        'view product',

        'add to cart',
        'purchase',
        'clear cart',
        'remove from cart',
        'get cart',
        'get total'
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
