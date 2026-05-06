const router = require("express").Router();
const controller = require("../controllers/orderController");


router.get("/", controller.getOrders);
router.get("/:id", controller.getOrderById);
router.post("/", controller.createOrder);
router.patch("/:id", controller.updateOrder);
router.delete("/:id", controller.deleteOrder);


module.exports = router;