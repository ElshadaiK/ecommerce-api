var router = require("express-promise-router")();

const  {productFormRequest} = require('../middlewares/form-request/product')
const { hasPermissions } = require('../middlewares/auth');
const productController = require('../controllers/product.controller')

router.get('/', 
    hasPermissions(['view any product', 'view product']), 
    productController.All);

router.get('/:id', hasPermissions(['view product']),productController.get);

router.post('/', 
    hasPermissions(['create product']) && productFormRequest('createProduct'), 
    productController.create);

router.patch('/:id', hasPermissions(['update product']), productController.update);

router.delete('/:id', hasPermissions(['remove product']),productController.remove);

module.exports = router;