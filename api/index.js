import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from '../api/routes/user.route.js'
import authRoute from '../api/routes/auth.route.js'
dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB');

  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});


app.use(express.json())

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
 


app.use("/api/user",userRoute);
app.use("/api/auth",authRoute);

app.use((err,req,res,next)=>{
  console.error('Error:', err); 
  const statusCode=err.statusCode||500;
  const message=err.message||'internal server errror';
  return res.status(statusCode).json({
    success:false,
    message,
    statusCode,
  })
})