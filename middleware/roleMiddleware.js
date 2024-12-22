const authorizeRoles = (requiredRole) => {
    return (req, res, next) => {
      const { role, isVerified } = req.user;
  
      // Check if the user has the required role
      if (role !== requiredRole) {
        return res.status(403).json({ message: 'Access Denied. Insufficient role.' });
      }
  
      // If the user is a salon, do not require verification
      if (role === 'salon') {
        return next(); // Salon users are allowed, even if they are not verified
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
  