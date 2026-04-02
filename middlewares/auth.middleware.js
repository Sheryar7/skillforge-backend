import jwt from "jsonwebtoken"
//auth 
const auth = async (req, res, next) => {
    try {
        // extract token
        // console.log(req.cookies.token)
        const token = req?.body?.token || req?.cookies?.token || req.headers["authorization"]?.replace("Bearer ",""); 

        //verify token 
        // console.log("token",token)
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token does not provided.",
            })
        }
        
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user=payload;
            // console.log("user",req.user)
        } catch (error) {
            console.log("JWT Verification Error:", error.message)
            return res.status(401).json({
                success:false,
                message:"Token is invalid.",
                error: error.message
            })
        }
        next();
        
    } catch (error) {
        console.log("Auth Middleware Error:", error.message)
        res.status(500).json({
            success:false,
            message:"Something went wrong while verifying token.",
            error: error.message
        })
    }
    

}

//student
const isStudent = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success:false,
                message:"route for student.",
            })

        }
        next(); 
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Not a student.",
            error:error
        })
    }
} 

//admin
const isAdmin = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"route for admin.",
            })

        }
        next(); 
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Not an Admin.",
            error:error
        })
    }
} 

//instructor
const isInstructor = async (req, res, next)=>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"route for instructor.",
            })

        }
        next(); 
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Not an Instructor.",
            error:error
        })
    }
} 

export {auth, isAdmin, isInstructor, isStudent};
