import ratelimit from "../config/upstash.js";

const rateLimiter = async(req, res, next) => {

    try {
        // Here I just keep it simple
        // In a real world app, you would like to put the userId or ipAddress as your key
        const {success} = await ratelimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message: "Too many requests. Please try again later."
            })
        }

        next();

    } catch (error) {
        console.log("Rate Limit Error:", error);
        next(error);
    }
}

export default rateLimiter;