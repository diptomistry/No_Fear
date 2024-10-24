"use client";
import React,{useContext} from "react";

import { UserContext } from "@/components/UserProvider";
const DashboardPage = () => {
  const { user } = useContext(UserContext) ?? {};
  console.log('user',user);
    
    return (
      <div>
        <h1 className="text-xl font-bold">Main Dashboard</h1>
        {/* Add more content here */}
      </div>
    );
  };
  
  export default DashboardPage;
  