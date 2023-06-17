import React, { useEffect,useState } from "react";
import Router from 'next/router'
import LoadingSpinner from "@/components/loadingspinner";
const myPage = ()=>{
    const [loaded,setLoaded] = useState(false)
    useEffect(() => {
        const {pathname} = Router
        location.replace("/directory/newest")
      },[]);

    if(!loaded){
        return <LoadingSpinner/> //show nothing or a loader
    }
    return ( 
        <p>
            You will see this page only if pathname !== "/" , <br/>
        </p> 
    )
}
export default myPage