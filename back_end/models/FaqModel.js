import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, unique: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FaqModel = mongoose.model("Faq", faqSchema);

export default FaqModel;
