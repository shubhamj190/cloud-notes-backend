var jwt = require("jsonwebtoken");
const JWT_SECRET = "redminote3kenzopocophonepocof1";

const fetchuser = (req, res, next) => {
  // Get the user for the JWT token and add it to req object

  const token = req.header("auth-token");

  if (!token) {
    res.status(401).send({ error: "please authenticate with valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.id;
    // console.log("this is the data ",data)
    // console.log("this is the data2 ",data.id)

    next();
  } catch (error) {
    res.status(401).send({ error: "please authenticate with valid token(catch)" });
  }
};

module.exports = fetchuser;
