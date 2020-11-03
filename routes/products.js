var router = require("express-promise-router")();

const  {productFormRequest} = require('../middlewares/form-request/product')
const { hasPermissions } = require('../middlewares/auth');
const productController = require('../controllers/product.controller')

/**
 * @typedef PRODUCT
 * @property {string} name.required - Products's name
 * @property {string} vendor.required - Products's vendor
 * @property {number} quantity.required - Products's quantity
 * @property {number} price_per_item.required - Products's price per item
 * @property {date} expiring_date - Products's expiring date
*/

/**
 * Returns ALL Products
 * 
 * @route GET /products
 * @group PRODUCT - Deals with all create operation with product model
 * @param {string} sort.query - sort parament
 * @param {string} page.query - set the page number
 * @param {string} filter.query - set filter query 
 * @security JWT
 * @returns {object} 200 - Array of products
 * @returns {Error}  default - Unexpected error
 */
router.get('/', 
    hasPermissions(['view any product', 'view product']), 
    productController.All);


/**
 * Returns a  product 
 * 
 * @route GET /products/{id}
 * @group PRODUCT 
 * @param {string} id.path.required - product id
 * @security JWT
 * @returns {object} 200 - product object
 * @returns {Error}  default - Unexpected error
 */
router.get('/:id', hasPermissions(['view product']),productController.get);


/**
 * Create a new product 
 * 
 * @route POST /products/
 * @group PRODUCT 
 * @param {PRODUCT.model} product.body.required - the new product
 * @security JWT
 * @returns {PRODUCT.model} 200 - Product object
 * @returns {Error}  default - Unexpected error
 */
router.post('/', 
    hasPermissions(['create product']) && productFormRequest('createProduct'), 
    productController.create);


/**
 * Update an existing product by id 
 * 
 * @route PATCH /products/:id
 * @group PRODUCT
 * @param {string} id.path.required - product id
 * @param {PRODUCT.model} product.body - the new product object
 * @security JWT
 * @returns {PRODUCT.model} 200 - Product object
 * @returns {Error}  default - Unexpected error
 */
router.patch('/:id', hasPermissions(['update product']), productController.update);

/**
 * Remove a product  with id
 * 
 * @route DELETE /products/{id}
 * @group PRODUCT 
 * @param {string} id.path.required - product id
 * @security JWT
 * @returns {PRODUCT.model} 200 - Product object
 * @returns {Error}  default - Unexpected error
 */
router.delete('/:id', hasPermissions(['remove product']),productController.remove);

module.exports = router;