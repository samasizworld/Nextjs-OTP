'use client'
import React, { useState, useRef, useEffect } from "react";
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'

export default function Home() {
  const [otp, setOTP] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<HTMLInputElement[]>([])
  const router = useRouter();
  useEffect(() => {
    console.log('Initial Rendering')
    inputRefs.current[0].focus()
  }, [])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const otpValue = e.target.value;
    console.log(otpValue)
    if (isNaN(otpValue?.substring(otpValue?.length - 1) as any) == true) {
      toast.error('Only digit is allowed')
    }
    setOTP((prevOtp) => {
      const updatedOtp = [...prevOtp]

      updatedOtp[index] = otpValue?.substring(otpValue?.length - 1);
      return updatedOtp
    });
    if (index < otp.length - 1 && otp[index] && otpValue != '') {
      inputRefs.current[index + 1].focus()
    }

  }


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardValues = e.clipboardData?.getData('text')?.split('')?.slice(0, otp.length);

    for (const cv of clipboardValues) {
      if (isNaN(cv?.substring(cv?.length - 1) as any) == true) {
        toast.error('Only digit is allowed')
      }
      setOTP((prevOtp) => {
        const updatedOTP = [...prevOtp]
        updatedOTP[clipboardValues.indexOf(cv)] = cv?.substring(cv?.length - 1);
        return updatedOTP
      })
    }

  }
  const handleClick = (index: number) => {
    inputRefs.current[index].setSelectionRange(1, 1)
  }


  const handleSubmit = () => {
    const otpBody = JSON.stringify({ OTP: otp.join('') })
    axios.post('http://localhost:3000/api/otp', otpBody, { headers: { "Content-Type": 'application/json' } }).then((response) => {
      toast.success('User is successfully verified')
      router.push('/success')
    }).catch(error => {
      if (error?.response?.status == 400) {
        toast.error('Validation Issue')

      } else
        toast.error('Internal Server error')

    }
    )
  }
  return (
    <div className="container m-auto flex flex-col items-center font-bold h-[100vh] justify-center space-y-4">
      <h1 className="uppercase leading-6">Verification Code:</h1>
      <div className="flex">
        {otp?.map((otpvalue, index) =>
          <input
            key={index}
            className="w-[40px] mr-[5px] h-[40px] rounded-md text-black text-center"
            type="text"
            value={otpvalue}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onClick={() => { handleClick(index) }}
            onPaste={handlePaste}
            ref={(input: any) => {
              return (inputRefs.current[index] = input)
            }}
          />
        )}
      </div>

      <button
        className="bg-blue-950 text-white rounded-md uppercase px-[40px] py-[10px] leading-6"
        onClick={handleSubmit}

      >Submit</button></div>
  );
}
