const jwt = require("jsonwebtoken");
const connectToSupabase = require("../connectors/connectToSupabase"); // assuming you already have this
const supabase = connectToSupabase();

const jwtVerifier = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access Denied. No Token Provided." });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: "Access Denied. Invalid Token Format." });
  }

  try {
    // ✅ Try verifying custom JWT (your secret)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: Fetch user from your DB (you already use `getUserDetails`)
    const { getUserDetails } = require("../repository/usersRepository");
    const user = await getUserDetails(decoded.email);

    if (!user) {
      return res.status(404).json({ message: "User not found. Access Denied." });
    }

    req.user = {
      email: user.email,
      userName: user.userName,
      role: user.role,
      provider: user.provider,
    };

    return next();
  } catch (err) {
    if (err.name !== "JsonWebTokenError" && err.name !== "TokenExpiredError") {
      console.error("Unexpected JWT error:", err);
      return res.status(500).json({ message: "Internal token verification error." });
    }

    // ❌ Failed to verify custom JWT — now try Supabase verification
    try {
      const { data: user, error } = await supabase.auth.getUser(token);

      if (error || !user?.user) {
        return res.status(401).json({ message: "Invalid or expired Supabase token." });
      }

      req.user = {
        email: user.user.email,
        id: user.user.id,
        provider: "Supabase",
      };

      return next();
    } catch (supabaseErr) {
      console.error("Supabase token verification failed:", supabaseErr);
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  }
};

module.exports = jwtVerifier;
