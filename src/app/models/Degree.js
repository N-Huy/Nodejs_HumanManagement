const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);



const Degree = new Schema(
    {
        name: { type: String, require: true },
        specialized: { type: String },
        majors: { type: String },
        slug: { type: String, slug: ["name"], unique: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Degree", Degree);
