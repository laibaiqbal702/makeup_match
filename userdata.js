
//import UserModel from "../models/UserModel.js";
const UserModel = require("../models/UserModel.js");

export const addUser= async({name, email, Password,role}) => {
 const users =await UserModel.create({
     name,
     email,
     Password,
     role,
 });
return users;};
export const findUser= async (email) =>{
  const users =await UserModel.findOne({email});
  return users;
};