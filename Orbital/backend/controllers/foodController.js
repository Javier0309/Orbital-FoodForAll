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
        cookedAt: new Date(req.body.cookedAt),
        consumeBy: new Date(req.body.consumeBy),
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
        const now = new Date();
        const query = { quantity: { $gt: 0}, consumeBy: { $gt: now }};
        if (businessId) {
            query.businessId = businessId;
        }

        const foods = await foodModel.find(query).populate('businessId', 'isOpen name');
        const openShops = foods.filter(food => food.businessId?.isOpen)  // doesnt show food if shop closed
        res.json({success:true,data:openShops})
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
