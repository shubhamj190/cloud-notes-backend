const mongoose = require('mongoose');
const mongooseURI  = process.env.MONGO_DB

main().catch(err => console.log(err));


async function main() {
  await mongoose.connect(mongooseURI);
  console.log("connected to mongo successfully !!!")
}

module.exports= main