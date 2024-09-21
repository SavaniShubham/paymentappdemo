
import { useState } from "react"
import { BottomWarning } from "../components/BottonWarning.jsx"
import { Button } from "../components/Button.jsx"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useNavigate } from "react-router-dom"


export const Signin = () => {

    const [username , setUserName] = useState("");
    const [password , setPassword] = useState("");
    const navigate = useNavigate();

    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox  onChange={(e)=>setUserName(e.target.value)} value={username} placeholder="example@gmail.com" label={"Email"} />
        <InputBox  onChange={(e)=> setPassword(e.target.value)}  value={password} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button  onClick={ ()=> backendSignInRequest( { username , password , navigate  })} label={"Sign in"} />
        </div>
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}

const backendSignInRequest = async ({ username , password , navigate })=>
    {
     try {
        
          const response = await  axios.post("http://localhost:3000/api/v1/users/signIn" , 
               {
                   username,
                   password
               }
            )
          alert("signIn Suceessfully");
       //    console.log(response);
       //    console.log(response.data.data);
           const AccessToken = response.data.data.AccessToken;
           localStorage.setItem("AccessToken" , AccessToken);
           navigate("/dashboard");

       
     } catch (err) {
        const statuscode = err.response.status ;
        const apiError = err.response.data;
        
    
        alert(`${statuscode} : ${apiError.message}`);
       }
     }


