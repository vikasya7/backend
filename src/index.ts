
import { app } from "./app.js";
import { PORT } from "./config/config.js";



//console.log("Index file started");
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})