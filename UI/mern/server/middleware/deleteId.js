export function removeId(req, res, next) {
  if (req.body && req.body._id) {
    delete req.body._id;
  }
  next();
}

//simple function to stop those trying to change the _id in
//the mongodb database
//
//Can be used in individual function, but given this project
//does not require changing the _id it is applied globally
//in server.js
