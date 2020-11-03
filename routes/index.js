var router = require("express-promise-router")();

const  {productFormRequest} = require('../middlewares/form-request/product')
const { hasPermissions } = require('../middlewares/auth');
const productController = require('../controllers/product.controller')
const cartController = require('../controllers/cart.controller')

router.get('/products', 
  // hasPermissions(['view any product', 'view product']), 
  productController.All);

router.get('/products:id', hasPermissions(['view product']),  productController.get);

router.post('/addtocart', 
  // hasPermissions(['adding to cart']), 
  cartController.addToCart);

router.post('/purchase', 
  // hasPermissions(['purchase']), 
  cartController.purchase);

router.post('/clearcart', 
  // hasPermissions(['purchase']), 
  cartController.clear);

router.post('/removefromcart', cartController.removeFromCart)

router.get('/getCart', cartController.getCart)

router.get('/getTotal', cartController.getTotal)

// router.patch('/:id', hasPermissions(['update user']), userController.update);

// router.delete('/:id', hasPermissions(['remove user']),userController.remove);

module.exports = router;
