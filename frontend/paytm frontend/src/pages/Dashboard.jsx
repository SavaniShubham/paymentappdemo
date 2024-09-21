import axios from "axios"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect, useState } from "react"

export const Dashboard = () => {
    const [currbal , setCurrbal]=useState(0);

    useEffect(() => {
        const fetchCurrentBalance = async () => {
            try {
                let bal = await getCurrentBal();

                bal = parseFloat(bal).toFixed(2);
                setCurrbal(bal);
            } catch (error) {
                console.error("Failed to fetch balance", error);
            }
        };

        fetchCurrentBalance();
    }, []); 
    return  currbal && <div>
        <Appbar />
        <div className="m-8">
            <Balance value={currbal} />
            <Users />
        </div>
    </div>
}


const getCurrentBal = async () => {
    try {
        const res = await axios.get("http://localhost:3000/api/v1/account/balance" ,{ headers: {
            Authorization: "Bearer " + localStorage.getItem("AccessToken")
        }});
        console.log(res);
        return res.data.data.balance; 
    } catch (error) {
        console.error("Error fetching balance", error);
        return 0;  
    }
};