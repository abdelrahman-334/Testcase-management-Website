import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-950">
      <div className="max-w-lg w-full p-3 bg-white rounded-md shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;