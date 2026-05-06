const router = require("express").Router();
const controller = require("../controllers/userController");

router.post("/", controller.createUser);
router.get("/", controller.getUsers);
router.put("/:id", controller.updateUser);
router.delete("/:id", controller.deleteUser);

module.exports = router;