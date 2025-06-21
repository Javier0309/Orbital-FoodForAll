import foodModel from "../models/foodModel.js";
import fs from 'fs'


//add food item
const addFood = async (req,res) => {
    //store data in database
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name:req.body.name,
        desc: req.body.desc,
        quantity: req.body.quantity,
        image: image_filename,
        businessId: req.body.businessId

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
        const {businessId} = req.params;
        let query = {};
        if (businessId) {
            query.businessId = businessId;
        }

        const foods = await foodModel.find(query).populate('businessId', 'name');
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
