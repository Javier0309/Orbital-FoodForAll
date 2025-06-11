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

    try {
        await food.save();
        res.json({success:true, message:"Food Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Error"})
    }
}

//to display the food added
const listFood = async (req,res) => {
    try {
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'Error'})
    }
}

//to remove food item
const removeFood = async (req,res) => {
    try {
        const food = await foodModel.findById(req.body.id);     //finds foodmodel using id
        fs.unlink(`uploads/${food.image}`,()=>{})   //deletes image

        await foodModel.findByIdAndDelete(req.body.id);  //deletes data
        res.json({success:true,message:"Food Removed"})
    } catch (error){
        console.log(error)
        res.json({success:false,message:'Error'})
    }
}

export {addFood, listFood, removeFood}
