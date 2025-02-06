export function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
	  return next();
	}
	return res.status(401).json({
	  error: "Unauthorized",
	  message: "You must be logged in to access this resource"
	});
  }
  
  export function ensureAuthenticatedWithRedirect(req, res, next) {
	if (req.isAuthenticated()) {
	  return next();
	}
	res.redirect(process.env.CLIENT_BASE_URL + "/login");
  }
  
  export function ensureAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.isAdmin) {
	  return next();
	}
	return res.status(403).json({
	  error: "Forbidden",
	  message: "You don't have permission to access this resource"
	});
  }