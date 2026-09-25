import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";

const AdminRoute = () => {
    const {authUser , isCheckingAuth} = useAuthStore()

     if (isCheckingAuth) {
      return <div className="flex h-screen items-center justify-center bg-base-100"><Loader className="size-10 animate-spin text-primary" /></div>;
    }
  
    if(!authUser || authUser.role !== "ADMIN"){
        return <Navigate to="/"/>;
    }

  return <Outlet/>
}

export default AdminRoute