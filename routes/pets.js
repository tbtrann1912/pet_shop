const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");

// Danh sách thú cưng
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().sort({ addedDate: -1 });
    res.render("pets/index", { pets });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Form thêm thú cưng
router.get("/new", (req, res) => {
  res.render("pets/new");
});

// Thêm thú cưng
router.post("/", async (req, res) => {
  try {
    const pet = new Pet(req.body);
    await pet.save();
    res.redirect("/pets");
  } catch (err) {
    console.error(err);
    res.status(400).send("Error creating pet");
  }
});

// Xem chi tiết thú cưng
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).send("Pet not found");
    res.render("pets/show", { pet });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Form chỉnh sửa thú cưng
router.get("/:id/edit", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).send("Pet not found");
    res.render("pets/edit", { pet });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Cập nhật thú cưng
router.put("/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pet) return res.status(404).send("Pet not found");
    res.redirect(`/pets/${pet._id}`);
  } catch (err) {
    console.error(err);
    res.status(400).send("Error updating pet");
  }
});

// Xóa thú cưng
router.delete("/:id", async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).send("Pet not found");
    res.redirect("/pets");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
