// routes/pets.js
const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");

// Danh sách thú cưng với phân trang
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Lấy số trang từ query, mặc định là 1
    const limit = 10; // Số bản ghi mỗi trang
    const skip = (page - 1) * limit; // Tính số bản ghi cần bỏ qua

    // Đếm tổng số bản ghi
    const totalPets = await Pet.countDocuments();
    // Lấy danh sách thú cưng cho trang hiện tại
    const pets = await Pet.find()
      .sort({ addedDate: -1 })
      .skip(skip)
      .limit(limit);

    // Tính tổng số trang
    const totalPages = Math.ceil(totalPets / limit);

    // Tính start và end cho thông tin "Hiển thị X đến Y trong Z"
    const start = totalPets > 0 ? skip + 1 : 0; // Nếu không có bản ghi, start = 0
    const end = Math.min(skip + limit, totalPets);

    // Truyền tất cả các biến cần thiết vào template
    res.render("pets/index", {
      pets,
      currentPage: page,
      totalPages,
      totalPets, // Tổng số bản ghi
      start, // Bản ghi bắt đầu
      end, // Bản ghi kết thúc
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page - 1,
      nextPage: page + 1,
    });
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
