import React from 'react'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const Navbar = () => {
 
  const navigate = useNavigate()

  const {backendUrl,setIsLoggedIn, userData, setUserData} = useContext(AppContext)
   
  axios.defaults.withCredentials = true;

  const sendOtp = async() => {
     try{
        const res = await axios.post(backendUrl + '/api/auth/send-verify-otp')
        if(res.data.success)
        {
           setIsLoggedIn(true);
           navigate('/email-verified')
        }
        else{
          toast.error(res.data.message)
        }
     }
     catch(error){
      toast.error(error.response?.data?.message || error.message || "Something wen wrong");
     }
  }

  const Logout = async ()=>{
      try{
       const res = await axios.post(backendUrl + '/api/auth/logout')
       if(res.data.success)
      {
        setIsLoggedIn(false)
        setUserData(null)
        navigate('/')
        toast.success("Logged out successfully");
      }
      }
      catch(error){
        toast.error(
          error.response?.data?.message || error.message || "Something went wrong"
        );
      }
  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6'>
      <img src={assets.logo}  alt='' className='w-28 sm:w-32'/>  
     
     {
      userData ?
      <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group'>{userData.name[0].toUpperCase()}
        <div className='absolute right-0 top-0 mt-2 text-black w-40 rounded hidden group-hover:block z-10 pt-10'>
          <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
            {
             !userData.isAccountVerified && (<li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={sendOtp}>Verify Email</li>)
            }
            <li className='py-1 px-2 hover:bg-gray-200 cursor-pointer' onClick={Logout}>Logout</li>
          </ul>
        
        </div>
      
      
      </div> :
      <button onClick={()=>navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:text-white hover:bg-gray-800 transistion-all'> 
        Login <img src={assets.arrow_icon}  alt='' className='w-[10px]'/> </button>
     
     }
   
    
    </div>
  )
}

export default Navbar