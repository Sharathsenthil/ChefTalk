const mongoose = require('mongoose');
const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description:{
        type:String,
        required:true
  },
  email:{
    type:String,
    required:true
  },
  ingredients:{
    type:Array,
    required:true
  },
  category:{
    type:String,
    enum:["Thai","American","Chinese","Mexican","Indian"],
    required:true
  },
  image:{
    type:String,
    required:true
  },
});
recipeSchema.index({ name: 'text',email:'text'});
module.exports = mongoose.model('Recipe', recipeSchema);
