import dotenv from "dotenv"
import app from "./app"
import connectDb from "./db/index.js"

dotenv.config({
    path: "./.env",
})

connectDb().then(
    () => {
        console.log("DB connection successful")
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`)
        })
    }
).catch(err => {
    console.error("DB connection error:", err)
    process.exit(1) // Exit the process with an error code
})
