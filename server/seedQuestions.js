const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Question = require("./models/questionModel");
const questionsData = require("./data/questionData");

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Delete existing questions
    await Question.deleteMany();
    console.log("🗑 Existing Questions Deleted");

    // Insert new questions
    await Question.insertMany(questionsData);
    console.log(`✅ ${questionsData.length} Questions Inserted Successfully`);

    console.log("🎉 Database Seeded Successfully!");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error Seeding Database:");
    console.error(err);

    process.exit(1);
  }
};

seedDatabase();