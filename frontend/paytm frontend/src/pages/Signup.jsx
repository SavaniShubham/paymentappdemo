
import { useState } from "react"

import { Button } from "../components/Button"

import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import { Heading } from "../components/Heading"
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { BottomWarning } from "../components/BottonWarning"


export const Signup = () => {
   
    const [firstname , setFirstName] = useState("");
    const [lastname , setLastName] = useState("");
    const [username , setUserName] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();


    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign up"} />
        <SubHeading label={"Enter your infromation to create an account"} />
        <InputBox  onChange={(e)=>setFirstName(e.target.value)} value={firstname}
        placeholder="shubham" label={"First Name"} />
        <InputBox  onChange={(e)=>setLastName(e.target.value)}  value={lastname} placeholder="Savani" label={"Last Name"} />
        <InputBox  onChange={(e)=>setUserName(e.target.value)} value={username} placeholder="example@gmail.com" label={"Email"} />
        <InputBox  onChange={(e)=> setPassword(e.target.value)}  value={password} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button onClick={()=> Signuphandler ( {firstname , lastname , username , password  , navigate })} label={"Sign up"} />
        </div>
        <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
        
      </div>
    </div>
  </div>
}


const Signuphandler =   async ( {firstname , lastname , username , password  , navigate })=> {
            try {
                  
              const response =  await  axios.post("http://localhost:3000/api/v1/users/signup" , 
                  {
                      firstname,
                      lastname,
                      username,
                      password
                  }
               )
            //    console.log(response);
            //    console.log(response.data);
               alert("signup Sucessfully");
               navigate("/signin");
            } catch (err) {
           
           
             const statuscode = err.response.status ;
             const apiError = err.response.data;
             // console.log(apiError);
             // console.log(apiError.message)
         
             alert(`${statuscode} : ${apiError.message}`);
            }
        }

