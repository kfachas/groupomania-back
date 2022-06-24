const express = require("express");
const multer = require("../middleware/multer-config");
const router = express.Router();

const isAuthenticated = require("../middleware/auth.js");

const {
  getProfil,
  updateProfil,
  deleteProfil,
} = require("../controllers/users.js");

// route for get profil
router.get("/:id", isAuthenticated, multer, getProfil);

// route for update profil
router.post("/:id/update", isAuthenticated, multer, updateProfil);

// route for login
router.post("/:id/delete", isAuthenticated, deleteProfil);

module.exports = router;
