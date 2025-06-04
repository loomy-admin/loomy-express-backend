require("dotenv").config(); 

exports.swaggerAuth = (req, res, next) => {
    const auth = req.headers.authorization;

    if (!auth) {
        res.set("WWW-Authenticate", "Basic realm='Swagger UI'");
        return res.status(401).send("Authentication required.");
    }

    const credentials = Buffer.from(auth.split(" ")[1], "base64").toString().split(":");
    const username = credentials[0];
    const password = credentials[1];

    // ✅ Set your predefined username and password here
    if (username === process.env.SWAGGER_USERNAME && password === process.env.SWAGGER_PASSWORD) {
        return next();
    }

    res.set("WWW-Authenticate", "Basic realm='Swagger UI'");
    return res.status(401).send("Invalid credentials. Please try again.");
};