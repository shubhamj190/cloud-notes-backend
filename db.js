const mongoose = require('mongoose');
const mongooseURI  = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"

main().catch(err => console.log(err));


async function main() {
  await mongoose.connect(mongooseURI);
  console.log("connected to mongo successfully !!!")
}

module.exports= main