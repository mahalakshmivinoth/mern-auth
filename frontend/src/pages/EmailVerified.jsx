import React, { useContext, useEffect, useRef } from 'react'
import { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerified = () => {

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);

  axios.defaults.withCredentials = true;

  const navigate = useNavigate()

  const inputRefs = useRef([]);
   

  const handleInput = (e, index) => {
    if(e.target.value.length > 0 && index < inputRefs.current.length-1){
      inputRefs.current[index+1].focus()
    }
  }
 
  const handleKeyDown = (e, index) => 
  {
    if(e.key === "Backspace" && e.target.value === '' && index > 0){
        inputRefs.current[index-1].focus()
    }
  }
  
  const handlePaste = (e) =>{
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0,6)
    const pasteArray = paste.split("")
    pasteArray.forEach((char, index)=>{
    if (inputRefs.current[index]) {
      inputRefs.current[index].value = char;
    }
    })
  }

  const onSubmitHandler = async(e) =>{
    try {
          e.preventDefault();
          const storeOTP = inputRefs.current.map((input)=>input.value);
          const otp = storeOTP.join("")
          console.log(otp)
    
          const res = await axios.post(backendUrl + '/api/auth/verify-account', {otp})
          if(res.data.success){
            toast.success("Your Email Verified")
            getUserData()
            navigate("/")
          }
          else{
            toast.error(res.data.message)
          }
    }
           catch(error){
           console.error(error.response?.data?.error.message || error.message)
    }

  }

  useEffect(()=>{
     isLoggedIn && userData && userData.isAccountVerified && navigate('/')
  },[isLoggedIn, userData])

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-200'>

      <img src={assets.logo} alt='' className='absolute left-5 sm:left-20 top-5 w-30 sm:w-32 cursor-pointer' />

      <form className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-100 text-indigo-300 text-sm' onSubmit={onSubmitHandler}>

        <h1 className='text-2xl font-semibold mb-2 text-center'>Email Verify OTP</h1>

        <p className='mb-4 text-indigo-300 text-center'>Enter the 6 Digit Code Sent to your Email ID</p>

       <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>

          {
            Array(6).fill(0).map((_, index) => (
              <input
                type="text"
                maxLength={1}
                ref={e => (inputRefs.current[index] = e)}
                key={index}
                onInput={(e)=>handleInput(e, index)}
                onKeyDown={(e)=>handleKeyDown(e, index)}
                required
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md 
                border border-gray-600 
                focus:outline focus:outline-2 focus:outline-indigo-500"
              />
            )
            )}

        </div>
        <button className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium text-white cursor-pointer mt-2'>Verify Email</button>

      </form>
    </div>
  )
}

export default EmailVerified