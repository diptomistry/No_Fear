import Link from "next/link";
import AuthButton from "./auth/AuthButton";

const Header = () => {
  return (
    <header className="p-28 xl:py-12 text-white absolute z-20  ">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-4xl font-semibold">
        TravelEase<span className="text-lime-600">.</span>
        </Link>
        


   
      </div>
      
    </header>
  );
};

export default Header;
