import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-slate-800">
      <div className="w-full max-w-md p-6  rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;