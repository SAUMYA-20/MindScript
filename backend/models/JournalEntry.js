const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
  content: { type: String, required: true },
  mood: { type: String },
  aiSummary: { type: String },
  themes: [{ type: String }],
  shared: { type: Boolean, default: false },
  userId: { type: String }, // optional: for multi-user support
  date: { type: Date, default: Date.now }
});

journalEntrySchema.index({ content: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("JournalEntry", journalEntrySchema);
