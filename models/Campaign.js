const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(

{

    name: {

        type: String,

        required: true

    },

    message: {

        type: String,

        required: true

    },

    mobileNumbers: [{

        type: String

    }],

    recipientCount: {

        type: Number,

        default: 0

    },

    status: {

        type: String,

        enum: ["pending", "processing", "completed"],

        default: "pending"

    },

    broadcasterId: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true

    }

},

{

    timestamps: true

});

module.exports = mongoose.model("Campaign", campaignSchema);