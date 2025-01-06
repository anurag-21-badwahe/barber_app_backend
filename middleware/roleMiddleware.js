const authorizeRoles = (requiredRole) => {
    return (req, res, next) => {
      const { role, isVerified } = req.user;

      console.log("inside roleMiddleware",req.user);
      
  
      // If the user is a admin, do not require verification
      if (role === 'admin') {
        return next(); // admin are allowed, even if they are not verified
      }
      // Check if the user has the required role
      if (role !== requiredRole) {
        return res.status(403).json({ message: 'Access Denied. Insufficient role.' });
      }
  
  
      // Check if the user is verified for all other roles
      if (!isVerified) {
        return res.status(403).json({ message: 'Access Denied. User not verified.' });
      }
  
      // Proceed if the user has the correct role and is verified
      next(); 
    };
  };
  
  module.exports = authorizeRoles;
  