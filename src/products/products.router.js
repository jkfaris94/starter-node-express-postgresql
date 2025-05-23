const router = require("express").Router({ mergeParams: true });
const controller = require("./products.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/:productId([0-9]+)").get(controller.read).all(methodNotAllowed);
router.route("/:productId").get(controller.read).all(methodNotAllowed);

module.exports = router;
