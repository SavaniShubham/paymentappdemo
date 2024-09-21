

import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import connectionDB from "./db/index.js";

connectionDB().then( ()=>
    {
        app.on("error",(error)=>
        {
            console.log("server running error :" , error);
    
        })
        app.listen(process.env.PORT || 3000,(()=>
        {
            console.log(`SERVER IS RUNNING AT PORT ${process.env.PORT}`);
        }))
    })
    .catch((err)=> console.log("Mongodb connection failed !!!"))
    

