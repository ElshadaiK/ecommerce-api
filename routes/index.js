var router = require("express-promise-router")();

const  {productFormRequest} = require('../middlewares/form-request/product')
const { hasPermissions } = require('../middlewares/auth');
const productController = require('../controllers/product.controller')
const cartController = require('../controllers/cart.controller')

/**
 * @typedef CART
 * @property {array} items - Array of cart items with their amount
 * @property {string} user_id - cart owner
*/

/**
 * Returns ALL Products
 * 
 * @route GET /allitems
 * @group SHOPPING - Deals with all create operation with cart model
 * @param {string} sort.query - sort parament
 * @param {string} page.query - set the page number
 * @param {string} filter.query - set filter query 
 * @security JWT
 * @returns {object} 200 - Array of products
 * @returns {Error}  default - Unexpected error
 */
router.get('/allitems', 
  hasPermissions(['view any product', 'view product']), 
  productController.All);


/**
 * Returns a  product 
 * 
 * @route GET /products/{id}
 * @group SHOPPING 
 * @param {string} id.path.required - product id
 * @security JWT
 * @returns {PRODUCT.model} 200 - product object
 * @returns {Error}  default - Unexpected error
 */
router.get('/products:id', hasPermissions(['view product']),  productController.get);

/**
 * Adds items to previously created cart. If there is none, it will create one
 * 
 * @route POST /addtocart/
 * @group SHOPPING 
 * @param {string} itemId.required - the item id
 * @param {number} quantity.required - the item amount
 * @security JWT
 * @returns {CART.model} 200 - Cart object
 * @returns {Error}  default - Unexpected error
 */
router.post('/addtocart', 
  hasPermissions(['add to cart']) && productFormRequest('addToCart'),
  cartController.addToCart);

/**
 * Purchases items in the cart 
 * 
 * @route POST /purchase/
 * @group SHOPPING 
 * @param {string} approval.required - the approval text. "APPROVAL"
 * @security JWT
 * @returns {CART.model} 200 - Cart object
 * @returns {Error}  default - Unexpected error
 */
router.post('/purchase', 
  hasPermissions(['purchase']) && productFormRequest('purchase'), 
  cartController.purchase);

/**
 * Clears cart created by the user. If there is none, it will let the user know
 * 
 * @route POST /clearcart/
 * @group SHOPPING 
 * @security JWT
 * @returns {CART.model} 200 - Cart object
 * @returns {Error}  default - Unexpected error
 */
router.post('/clearcart', 
  hasPermissions(['clear cart']), 
  cartController.clear);

/**
 * removes items from previously created cart. If there is none, it will let the user know
 * 
 * @route POST /removefromcart/
 * @group SHOPPING 
 * @param {string} itemId.required - the item id
 * @param {number} quantity_to.required - the quantity a user wants in her/his cart
 * @security JWT
 * @returns {CART.model} 200 - Cart object
 * @returns {Error}  default - Unexpected error
 */
router.post('/removefromcart', 
  hasPermissions(['remove from cart']) && productFormRequest('removeFromCart'), 
  cartController.removeFromCart)

/**
 * Returns cart created by the user. If there is none, it will let the user know
 * 
 * @route POST /getCart/
 * @group SHOPPING 
 * @security JWT
 * @returns {CART.model} 200 - Cart object
 * @returns {Error}  default - Unexpected error
 */
router.get('/getCart', 
  hasPermissions(['get cart']), 
  cartController.getCart)

/**
 * Returns cart created by the user. If there is none, it will let the user know => it will calculate the total price of the cart
 * 
 * @route POST /getTotal/
 * @group SHOPPING 
 * @security JWT
 * @returns {CART.model} 200 - Cart object
 * @returns {Error}  default - Unexpected error
 */
router.get('/getTotal', 
  hasPermissions(['get total']), 
  cartController.getTotal)


module.exports = router;
