const isAdmin = (req, res, next) => {

  
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized"
    });
  }

  next();
};

export default isAdmin;