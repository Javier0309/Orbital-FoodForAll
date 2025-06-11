import foodModel from "../models/foodModel.js";
import fs from 'fs'


//add food item
const addFood = async (req,res) => {
    //store data in database
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name:req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        category: req.body.category,
        image: image_filename

    })
}

export {addFood}
