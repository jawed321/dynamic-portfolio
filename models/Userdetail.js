const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    phone:{
        type:Number
    },
    course:{
        type:String
    },
    branch:{
        type:String
    },
    year:{
        type:String
    },
    date:{
        type:String,
        default: Date.now
    },
    tokens:[{
        token:{
            type:String
        }
    }]
}) 
//generating tokens on login
userSchema.methods.generateAuthToken=async function(){
    try{
        const token=jwt.sign({_id:this._id}, "mynameisjawedahmedfullstackdeveloper");
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;

    }catch(err){
        console.log(err);
    }
}


userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
    }
    next()
})

const Userdetail= mongoose.model("Userdetail",userSchema)
module.exports=Userdetail;
