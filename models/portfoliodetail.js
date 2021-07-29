const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    orgemail:{
        type: String
    },
    name: {
        type: String
    },
    role:[{
        role1:{
            type:String
        },
        role2:{
            type:String
        },
        role3:{
            type:String
        }
    }],
    about:{
        type:String
    },
    skill1:{
        type: String
    },
    skill2:{
        type: String
    },
    skill3:{
        type: String
    }
    ,
    skill4:{
        type: String
    },
    skill5:{
        type: String
    },
    rate1:{
        type: String
    },
    rate2:{
        type: String
    },
    rate3:{
        type: String
    },
    rate4:{
        type: String
    },
    rate5:{
        type: String
    },
    schoolname:{
        type: String
    },
    schoolyearjoin:{
        type:String
    },
    schoolyearleft:{
        type:String
    },
    collegename:{
        type:String
    },
    collegeyearjoin:{
        type:String
    },
    collegeyearleft:{
        type:String
    },
    coursename:{
        type: String
    },
    universityname:{
        type: String
    },
    universityyearjoin:{
        type: String
    },
    universityyearleft:{
        type: String
    },
    emailport:{
        type: String
    },
    numberport:{
        type: String
    },
    linkedinport:{
        type: String
    },
    githubport:{
        type: String
    },
    instaport:{
        type: String
    }


})
const Portfoliodetail=mongoose.model("Portfoliodetail",userSchema);
module.exports=Portfoliodetail;