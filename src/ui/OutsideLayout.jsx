import { Outlet } from "react-router-dom";

const OutsideLayout = () => {
  return (
     <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default OutsideLayout;
