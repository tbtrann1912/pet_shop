const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  type: { type: String, required: true }, // ví dụ: Chó, Mèo
  breed: { type: String, required: true }, // ví dụ: Poodle, Mèo Ba Tư
  height: { type: Number, required: true }, // cm
  weight: { type: Number, required: true }, // kg
  color: { type: String, required: true },
  vaccinated: { type: String, enum: ["Chưa tiêm", "Đã tiêm"], required: true },
  addedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Đã bán", "Chưa bán", "Đã được đặt trước"],
    required: true,
  },
});

module.exports = mongoose.model("Pet", petSchema);
