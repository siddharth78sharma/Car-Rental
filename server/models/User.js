import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  storeName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  businessType: { type: String }, // e.g., car rental, furniture, electronics
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  postalCode: { type: String },
  description: { type: String },
  website: { type: String },
  gstNumber: { type: String }, // optional tax ID
  logo: { type: String }, // vendor store logo image URL
  shopCoords: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["owner", "user", "admin"], default: "user" },
  image: { type: String, default: "" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  vendorProfile: vendorSchema, // ⬅️ vendor details embedded here
}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;













// import mongoose from "mongoose";

// const userSchema = mongoose.Schema({
//     name: {type: String, required: true},
//     email: {type: String, required: true, unique: true},
//     password: {type: String, required: true},
//     // FIX: Add 'admin' to the enum to allow for an admin role.
//     role: {type: String, enum: ["owner", "user", "admin"], default: 'user'},
//     image: {type: String, default: ''},
// },{timestamps: true})

// const User = mongoose.model('User', userSchema)

// export default User;