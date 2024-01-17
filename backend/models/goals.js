const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
    name: { type: String,required: true },
    desc: { type: String,required: true },
    isCompleted: { type: Boolean,default: false },
});

const Goal = mongoose.model("Goal",goalSchema);

module.exports = Goal;