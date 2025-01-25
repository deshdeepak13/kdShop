import React from 'react'
import { NavLink,Link } from 'react-router-dom'
import DropdownMenu from './DropDownMenu'
import { useSelector } from 'react-redux';


const Navbar = ({ openLogin, openSignup }) => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);


  return (
    <>
    <nav className='bg-black sticky top-0 left-0 w-full z-50 '>
      <div className='flex py-5 px-20 justify-between items-center'>
        <div className="logo font-bold text-xl text-white"><Link to="/">pottyShop</Link></div>
      
      <div className="items flex gap-5">
{/* <a href=""></a> */} 
      <NavLink
      to="/"
      className={({ isActive }) =>
        isActive ? 'text-purple-700' : 'text-purple-100' // Apply red text when active, purple otherwise
      }
    >
      Home
    </NavLink>

      <NavLink
      to="/search"
      className={({ isActive }) =>
        isActive ? 'text-purple-700' : 'text-purple-100' // Apply red text when active, purple otherwise
      }
    >
      Search
    </NavLink>

      {isLoggedIn?(<><NavLink
      to="/cart"
      className={({ isActive }) =>
        isActive ? 'text-purple-700' : 'text-purple-100' // Apply red text when active, purple otherwise
      }
    >
      Cart
    </NavLink>

    <div><DropdownMenu title={user.name}/></div></>):
    <>
    <button onClick={openLogin} className={" text-white font-semibold rounded-md  bg-purple-700 px-1 hover:opacity-90"} >Login</button> 
    <button onClick={openSignup} className={" text-white font-semibold rounded-md  bg-purple-700 px-1 hover:opacity-90"} >Signup</button>
    </>}
      {/* <NavLink
      to="/profile"
      className={({ isActive }) =>
        isActive ? 'text-purple-700' : 'text-purple-100' // Apply red text when active, purple otherwise
      }
    >
      Profile
    </NavLink> */}

      </div>
      </div>
    </nav>
    
    </>
  )
}

export default Navbar
