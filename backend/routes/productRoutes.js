const router = require("express").Router();

const controller = require("../controllers/ProductController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

// DEBUG (xem có undefined không)
// console.log("verifyToken:", verifyToken);
// console.log("isAdmin:", isAdmin);
// console.log("createProduct:", controller.createProduct);

// ROUTES
router.post("/", verifyToken, isAdmin, controller.createProduct);
router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.put("/:id", verifyToken, isAdmin, controller.updateProduct);
router.delete("/:id", verifyToken, isAdmin, controller.deleteProduct);

module.exports = router;