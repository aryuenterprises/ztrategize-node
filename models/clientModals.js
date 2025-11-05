import mongoose from "mongoose";
import bcrypt from "bcrypt";
const clientDetails = new mongoose.Schema({
    client_name:{
        type:String,
        required:[true,"Please provide a client name"],
        validate: {
            validator: function (value) {
                return value.length <= 40;
            },
            message: "Client name must not exceed 40 characters"
        }
    },
    company_name:{
        type:String,
        required:[false,"Please provide a company name"],
        validate: {
            validator: function (value) {
                if (!value) return true; 
                return value.length <= 40;
            },
            message: "Company name must not exceed 40 characters"
        }
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
        unique: true
    },
    phone_number: {
        type: String,
        required: [true, "Please provide a phone number"],
        match: [/^\d{10,15}$/, "Please provide a valid 10-15 digit phone number"]
    },
    address: {
  type: String,
  required: [false, "Please provide an address"],
  validate: {
    validator: function (value) {
      if (!value) return true; // skip validation if value is not provided
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount <= 50;
    },
    message: "Address must not exceed 50 words"
  }
},
    password:{type:String,required:[true,"Please provide a password"]},
    gst:{type:String,required:[false,"Please provide a gst"]},
    country:{type:String,required:[true,"Please provide a country"]},
    contact_person:{type:String,required:[true,"Please provide a contact person"]},
    contact_person_role:{type:String,required:[false,"Please provide a contact person role"]},
    website:{type:String,required:[false,"Please provide a website"]},
    status:{type:String,required:[true,"Please select a status"]},
    notes:{type:String,required:[false,"Please provide a notes"]},
    
    is_deleted:{type:Boolean,default:false},
},{
    timestamps:true,
});

clientDetails.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  next();
});

clientDetails.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  // Only hash if password is being updated
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
    this.setUpdate(update);
  }

  next();
});

clientDetails.index({ email: 1 }, { unique: true }); // (Already added via `unique: true`)
clientDetails.index({ phone_number: 1 }); // For faster lookups
clientDetails.index({ company_name: 1 }); // Optional
clientDetails.index({ is_deleted: 1 }); // Useful for filtering non-deleted clients
const ClientDetails = mongoose.model("ClientDetails",clientDetails);
export default ClientDetails;
