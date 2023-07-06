require('../models/database')
const Category=require('../models/Category');
const Recipe=require('../models/Recipe');
exports.homepage=async(req,res)=>{
    try {
const limitNum=5;
const categories=await Category.find({}).limit(limitNum); 
const latest=await Recipe.find({}).sort({_id:-1}).limit(limitNum);
const thai=await Recipe.find({'category':'Thai'}).limit(limitNum);
const mexican=await Recipe.find({'category':'Mexican'}).limit(limitNum);
const american=await Recipe.find({'category':'American'}).limit(limitNum);
const indian=await Recipe.find({'category':'Indian'}).limit(limitNum);
const chinese=await Recipe.find({'category':'Chinese'}).limit(limitNum);
const food={latest,thai,american,indian,chinese,mexican};
    res.render('index',{title:'cooking blog-Home',categories,food});
    } catch (error) {
        res.send(500).send({message:error.message || "error occured"})
    }  
}



exports.exploreCategories=async(req,res)=>{
    try {
const limitNum=20;
const categories=await Category.find({}).limit(limitNum); 
    res.render('categories',{title:'cooking blog-Categories',categories});
    } catch (error) {
        res.send(500).send({message:error.message || "error occured"})
    }  
}
exports.exploreCategoriesById = async(req, res) => { 
    try {
      let categoryId = req.params.id;
      const limitNumber = 30;
      const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
      res.render('categories', { title: 'Cooking Blog - Categoreis', categoryById } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

//recipe/:id
exports.exploreRecipe = async(req, res) => {
    try {
      let recipeId = req.params.id;
      const recipe = await Recipe.findById(recipeId);
      res.render('recipe', { title: 'Cooking Blog - Recipe', recipe } );
    } catch (error) {
      res.satus(500).send({message: error.message || "Error Occured" });
    }
  } 

  //search post
  exports.searchRecipe = async(req, res) => {
    try {
      let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find( { $text: { $search:searchTerm, $diacriticSensitive: true } });
     // res.json(recipe); 
     console.log(recipe);
      res.render('search', { title: 'Cooking Blog - Search',recipe } );
    } catch (error) {
      res.status(500).send({message: error.message || "Error Occured" });
    }
  }
   exports.exploreLatest=async(req,res)=>{
    try {
        const limitNum=20;
        const recipe=await Recipe.find({}).sort({__id:-1}).limit(limitNum); 
            res.render('exploreLatest',{title:'cooking blog-explore-latest',recipe});
            } catch (error) {
                res.send(500).send({message:error.message || "error occured"})
            }   
   }
   exports.exploreRandom=async(req,res)=>{
    try {
        let count=await Recipe.find().countDocuments();
        let random=Math.floor(Math.random()*count);
        let recipe=await Recipe.findOne().skip(random).exec();
            res.render('explore-random',{title:'cooking blog-explore-random',recipe});
            } catch (error) {
                res.send(500).send({message:error.message || "error occured"})
            }  
   }

   //submit
   exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    res.render('submit-recipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
  }
  
  /**
   * POST /submit-recipe
   * Submit Recipe
  */
  exports.submitRecipeOnPost = async(req, res) => {
    try {
  
      let imageUploadFile;
      let uploadPath;
      let newImageName;
  
      if(!req.files || Object.keys(req.files).length === 0){
        console.log('No Files where uploaded.');
      } else {
  
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
  
        uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;
  
        imageUploadFile.mv(uploadPath, function(err){
          if(err) return res.satus(500).send(err);
        })
  
      }
  
      const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        email: req.body.email,
        ingredients: req.body.ingredients,
        category: req.body.category,
        image: newImageName
      });
      
      await newRecipe.save();
  
      req.flash('infoSubmit', 'Recipe has been added.')
      res.redirect('/submit-recipe');
    } catch (error) {
      // res.json(error);
      req.flash('infoErrors', error);
      res.redirect('/submit-recipe');
    }
  }
  
  // Delete Recipe
async function deleteRecipe(){
  try {
    await Recipe.deleteOne({ name: 'chicken' });
  } catch (error) {
    console.log(error);
  }
}
//deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();
