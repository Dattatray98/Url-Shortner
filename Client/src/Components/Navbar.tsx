import { NavLinks } from "../Types/Types"
import {FaLink} from "react-icons/fa"
const Navbar = () => {

  return (
    <nav className="border-b border-gray-300 h-15 flex items-center p-5 w-full justify-between bg-blue-50">
      <div className="cursor-pointer">
        <h1 className="text-2xl flex items-center gap-1 font-bold bg-gradient-to-r from-[#468e87] to-[#580471] bg-clip-text text-transparent">
          <FaLink className="text-black w-5 h-5"/> Linkify
        </h1>
        {/* <p className="text-[9px] mt-[-9px] ml-[25px] text-gray-900">Make every link simple.</p> */}
      </div>

      <div className="flex gap-20 items-center">
        <div className="flex gap-8">
          {NavLinks.map((navlink) => (
            <h1 className="font-medium cursor-pointer">{navlink.lable}</h1>
          ))}
        </div>
        <button className="border cursor-pointer border-gray-400 shadow-md py-2 px-4 font-medium bg-gradient-to-tr from-blue-100 to-blue-300 rounded-xl">
          Login/SignUp
        </button>
      </div>
    </nav>
  )
}

export default Navbar
