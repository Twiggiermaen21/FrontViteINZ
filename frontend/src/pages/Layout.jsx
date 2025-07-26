import React, {useState} from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { X, Menu } from 'lucide-react'
import SideBar from '../components/SideBar'
const Layout = () => {

  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)

   
  return (
    <div className='flex flex-col items-start justify-start min-h-screen'>
      <nav className='w-full px-8 min-h-14 flex items-center justify-between
       border-b border-gray-200 '>
        <img src={assets.logo} onClick={() => navigate('/')} alt="Logo"  />
      {sidebar ? <X onClick={() => setSidebar(false)} className='w-6 h-6 text-gray-600 sm:hidden'/> 
      : <Menu onClick={() => setSidebar(true)} className='w-6 h-6 text-gray-600 sm:hidden'/>}
      </nav>

      <div className='h-[calc(100vh-64px)] flex flex-1 w-full'>
        <SideBar sidebar={sidebar} setSidebar={setSidebar} />
   <div className='flex-1 bg-[#F4F7FB]'>
      <Outlet />
      </div>
    </div>
    </div>
  )
}

export default Layout