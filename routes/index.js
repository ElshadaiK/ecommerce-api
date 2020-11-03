var router = require("express-promise-router")();

const  {productFormRequest} = require('../middlewares/form-request/product')
const { hasPermissions } = require('../middlewares/auth');
const productController = require('../controllers/product.controller')
const cartController = require('../controllers/cart.controller')

router.get('/allitems', 
  hasPermissions(['view any product', 'view product']), 
  productController.All);

router.get('/products:id', hasPermissions(['view product']),  productController.get);

router.post('/addtocart', 
  hasPermissions(['add to cart']), 
  cartController.addToCart);

router.post('/purchase', 
  hasPermissions(['purchase']), 
  cartController.purchase);

router.post('/clearcart', 
  hasPermissions(['clear cart']), 
  cartController.clear);

router.post('/removefromcart', 
  hasPermissions(['remove from cart']), 
  cartController.removeFromCart)

router.get('/getCart', 
  hasPermissions(['get cart']), 
  cartController.getCart)

router.get('/getTotal', 
  hasPermissions(['get total']), 
  cartController.getTotal)


module.exports = router;
