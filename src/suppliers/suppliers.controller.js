const suppliersService = require('./suppliers.service.js');
const hasProperties = require('../errors/hasProperties');

function create(req, res, next) {
  suppliersService
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}

function update(req, res, next) {
  const updatedSupplier = {
    ...req.body.data,
    supplier_id: res.locals.supplier.supplier_id,
  };
  suppliersService
    .update(updatedSupplier)
    .then((data) => res.json({ data }))
    .catch(next);
}

function destroy(req, res, next) {
  suppliersService
    .delete(res.locals.supplier.supplier_id)
    .then(() => res.sendStatus(204))
    .catch(next);
}

const VALID_PROPERTIES = [
  'supplier_name',
  'supplier_address_line_1',
  'supplier_address_line_2',
  'supplier_city',
  'supplier_state',
  'supplier_zip',
  'supplier_phone',
  'supplier_email',
  'supplier_notes',
  'supplier_type_of_goods',
];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(', ')}`,
    });
  }
  next();
}

const hasRequiredProperties = hasProperties('supplier_name', 'supplier_email');

function supplierExists(req, res, next) {
  suppliersService
    .read(req.params.supplierId)
    .then((supplier) => {
      if (supplier) {
        res.locals.supplier = supplier;
        return next();
      }
      next({ status: 404, message: `Supplier cannot be found.` });
    })
    .catch(next);
}

module.exports = {
  delete: [supplierExists, destroy],
  create: [hasOnlyValidProperties, hasRequiredProperties, create],
  update: [supplierExists, hasOnlyValidProperties, hasRequiredProperties, update],
};
