import React, { useContext, useRef, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const ResetPassword = () => {

  axios.defaults.withCredentials = true; // ✅ important
  const navigate = useNavigate()
  const inputRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpValue, setOtpValue] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
 
  const {backendUrl} = useContext(AppContext)
  
  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6)
    const pasteArray = paste.split("")
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async(e) => {
       e.preventDefault()
       try{
        const res = await axios.post(backendUrl + '/api/auth/reset-otp', {email})
        if(res.data.success)
        {
           toast.success(res.data.message)
           setIsEmailSent(true)
        }
        else{
          toast.error(res.data.message)
        }
     }
     catch(error){
      toast.error(error.response?.data?.message || error.message || "Something wen wrong");
     }
  }

 const onSubmitOTP = (e) => {
  e.preventDefault();

  const otp = inputRefs.current.map(i => i.value).join("");

  setOtpValue(otp);
  setIsOtpSubmitted(true);
};

 const onSubmitNewPassword = async (e)=>{
  e.preventDefault()
  try {
          const res = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp:otpValue, newpassword:newPassword })
          if(res.data.success){
            toast.success(res.data.message)
            navigate("/login")
          }
          else{
            toast.error(res.data.message)
          }
    }
           catch(error){
           console.error(error.response?.data?.message || error.message || "Something went wrong")
    }

 }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-200'>

      <img src={assets.logo} alt='' onClick={() => navigate("/")} className='absolute left-5 sm:left-20 top-5 w-30 sm:w-32 cursor-pointer' />


      {
        !isEmailSent &&
        <form onSubmit ={onSubmitEmail} className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-100 text-indigo-300 text-sm'>

          <h1 className='text-2xl font-semibold mb-2 text-center'>Reset Password</h1>

          <p className='mb-4 text-indigo-300 text-center'>Enter the Registered Email Address</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white'>
            <img src={assets.mail_icon} alt='' />
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <button className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium text-white cursor-pointer mt-2'>Submit</button>

        </form>
      }



      { /*otp input form*/}

      {!isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitOTP} className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-100 text-indigo-300 text-sm'>

          <h1 className='text-2xl font-semibold mb-2 text-center'>Reset Password OTP</h1>

          <p className='mb-4 text-indigo-300 text-center'>Enter the 6 Digit Code Sent to your Email ID</p>

          <div className="flex justify-between gap-2 mb-4" onPaste={handlePaste}>

            {
              Array(6).fill(0).map((_, index) => (
                <input
                  type="text"
                  maxLength={1}
                  ref={e => (inputRefs.current[index] = e)}
                  key={index}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md 
                  border border-gray-600 
                  focus:outline focus:outline-2 focus:outline-indigo-500"
                />
              )
              )}

          </div>
          <button className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium text-white cursor-pointer mt-2'>Submit</button>

        </form>

      }

      { /*Enter New Password*/}

      {isOtpSubmitted && isEmailSent &&

        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-100 text-indigo-300 text-sm'>

          <h1 className='text-2xl font-semibold mb-2 text-center'>New Password</h1>

          <p className='mb-4 text-indigo-300 text-center'>Enter the New Password</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C] text-white'>
            <img src={assets.lock_icon} alt='' />
            <input type='password' placeholder='New Password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          </div>
          <button className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 font-medium text-white cursor-pointer mt-2'>Submit</button>

        </form>
      }
    </div>
  )
}

export default ResetPassword