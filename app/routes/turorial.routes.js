const { verifyToken } = require("../middlewares/auth.middleware");

module.exports = app => {
  const tutorials = require("../controllers/tutorial.controller.js");
  const router = require("express").Router();

  // Protected routes (require authentication)
  router.post("/", verifyToken, tutorials.create);
  router.put("/:id", verifyToken, tutorials.update);
  router.delete("/:id", verifyToken, tutorials.delete);
  router.delete("/", verifyToken, tutorials.deleteAll);

  // Public routes (do not require authentication)
  router.get("/", tutorials.findAll);
  router.get("/published", tutorials.findAllPublished);
  router.get("/:id", tutorials.findOne);

  app.use("/api/tutorials", router);
};
