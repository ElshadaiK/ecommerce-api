var router = require("express-promise-router")();

const  {userFormRequest} = require('../middlewares/form-request/user')
const { hasPermissions } = require('../middlewares/auth');
const userController = require('../controllers/user.controller')

/**
 * @typedef USER
 * @property {string} full_name.required - User's full name
 * @property {email} email.required - Unique email address
 * @property {string} password.required - A strong password length of 3-30 consisting lowercase, uppercase, and numbers
 * @property {number} phone_no.required - User's phone number
 */
/**
 * Returns ALL Users
 * 
 * @route GET /users
 * @group User - Deals with all CRUD operations with user model
 * @param {string} sort.query - sort parament
 * @param {string} page.query - set the page number
 * @param {string} filter.query - set filter query 
 * @security JWT
 * @returns {object} 200 - Array of users
 * @returns {Error}  default - Unexpected error
 */
router.get('/', hasPermissions(['view any user', 'view user']),userController.All);

/**
 * Returns a  user 
 * 
 * @route GET /users/{id}
 * @group User 
 * @param {string} id.path.required - user id
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.get('/:id', hasPermissions(['view user']),userController.get);


/**
 * Create a new user 
 * 
 * @route POST /users/
 * @group User 
 * @param {USER.model} user.body.required - the new user
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.post('/', hasPermissions(['create user']) && userFormRequest('createUser'), userController.create);

/**
 * Update an existing user by id 
 * 
 * @route PATCH /users/:id
 * @group User
 * @param {string} id.path.required - user id
 * @param {USER.model} user.body - the new user object
 * @security JWT
 * @returns {USER.model} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.patch('/:id', hasPermissions(['update user']), userController.update);

/**
 * Remove a new user  with id
 * 
 * @route DELETE /users/{id}
 * @group User 
 * @param {string} id.path.required - user id
 * @security JWT
 * @returns {object} 200 - User object
 * @returns {Error}  default - Unexpected error
 */
router.delete('/:id', hasPermissions(['remove user']),userController.remove);

module.exports = router;
