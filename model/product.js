var mongoose=require('mongoose');
var Schema=mongoose.Schema;
 
var detail = new Schema({
    product_name: String,
    product_price : Number
})

module.exports=mongoose.model('product', detail);