import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {type:String,required:true},
    desc: {type:String,required:true},
    cookedAt: {type: Date, required:true},
    consumeBy: {type: Date, required:true},
    comment: {type:String},
    quantity: {type:Number,required:true},
    image: {type:String,required:true},
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    }
})

// if this model is already there, use it, else create new model
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;