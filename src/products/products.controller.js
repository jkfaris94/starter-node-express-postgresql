const productsService = require('./products.service');

function read(req, res) {
  const { product: data } = res.locals;
  res.json({ data });
}

async function list(req, res, next) {
  const data = await productsService.list();
  res.json({ data });
}

async function productExists(req, res, next) {
  const product = await productsService.read(req.params.productId);
  if (product) {
    res.locals.product = product;
    return next();
  }
  next({ status: 404, message: `Product cannot be found.` });
}

module.exports = {
  read: [productExists, read],
  list: [list],
};
