/**
 * @swagger
 * components:
 *   schemas:
 *     Tutorial:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: The tutorial title
 *         description:
 *           type: string
 *           description: The tutorial description
 *         published:
 *           type: boolean
 *           description: Published status
 *       example:
 *         id: 61a8f1d50a8b5a001c7d9d29
 *         title: Learn Node.js
 *         description: A complete guide to Node.js
 *         published: true
 */

/**
 * @swagger
 * tags:
 *   name: Tutorials
 *   description: The tutorial managing API
 */

/**
 * @swagger
 * /api/tutorials:
 *   post:
 *     summary: Create a new tutorial
 *     tags: [Tutorials]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tutorial'
 *     responses:
 *       200:
 *         description: The tutorial was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutorial'
 *       400:
 *         description: The request body is missing required fields
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/tutorials:
 *   get:
 *     summary: Retrieve all tutorials
 *     tags: [Tutorials]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter tutorials by title
 *     responses:
 *       200:
 *         description: A list of tutorials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutorial'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/tutorials/{id}:
 *   get:
 *     summary: Get a tutorial by ID
 *     tags: [Tutorials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tutorial ID
 *     responses:
 *       200:
 *         description: The tutorial description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tutorial'
 *       404:
 *         description: Tutorial not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/tutorials/{id}:
 *   put:
 *     summary: Update a tutorial by ID
 *     tags: [Tutorials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tutorial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Tutorial'
 *     responses:
 *       200:
 *         description: The tutorial was updated successfully
 *       400:
 *         description: The request body is missing or invalid
 *       404:
 *         description: Tutorial not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/tutorials/{id}:
 *   delete:
 *     summary: Delete a tutorial by ID
 *     tags: [Tutorials]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The tutorial ID
 *     responses:
 *       200:
 *         description: The tutorial was deleted successfully
 *       404:
 *         description: Tutorial not found
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/tutorials:
 *   delete:
 *     summary: Delete all tutorials
 *     tags: [Tutorials]
 *     responses:
 *       200:
 *         description: All tutorials were deleted successfully
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /api/tutorials/published:
 *   get:
 *     summary: Retrieve all published tutorials
 *     tags: [Tutorials]
 *     responses:
 *       200:
 *         description: A list of published tutorials
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tutorial'
 *       500:
 *         description: Some server error
 */


const db = require("../models");
const Tutorial = db.tutorials;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Tutorial
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save Tutorial in the database
  tutorial
    .save(tutorial)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Tutorial.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Tutorial.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else res.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Tutorial.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`
        });
      } else {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Tutorial with id=" + id
      });
    });
};

// Delete all Tutorials from the database.
exports.deleteAll = (req, res) => {
  Tutorial.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials."
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Tutorial.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials."
      });
    });
};
