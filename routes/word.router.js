const { Router } = require("express");
const { param, body } = require("express-validator");
const router = Router();

const authMiddleware = require("../middlewares/auth.middleware");
const WordController = require("../controllers/Word.controller");

router.get("/", authMiddleware, WordController.getAll);
router.get("/csv", authMiddleware, WordController.exportCSV)
router.get("/pdf", authMiddleware, WordController.exportPDF)
router.post("/", authMiddleware, WordController.create);
router.put(
  "/:id",
  param("id", "ID is not provided"),
  authMiddleware,
  WordController.update
);
router.delete(
  "/:id",
  param("id", "ID is not provided"),
  authMiddleware,
  WordController.delete
);

module.exports = router;
