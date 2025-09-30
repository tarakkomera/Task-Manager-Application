import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import {Eye, EyeOff,Lock, Mail, LogIn, CheckCircle} from 'lucide-react'
import { BUTTON_CLASSES, Inputwrapper } from '../assets/dummy';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const INITIAL_FORM = { email: '', password: '' };

const Login = ({onSubmit, onSwitchMode}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [formData , setFormData] = useState(INITIAL_FORM)
  const[rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate();
  const url = 'http://localhost:4000';

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if(token){
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/users/me`, {
              headers: { Authorization: `Bearer ${token}`
               }})
          if (data.success){
            onSubmit?.({token, userId, ...data.user})
            toast.success("Session restored. Redirecting...")
            navigate('/')
          }else{
              localStorage.clear()
            }
        }
        catch
        {
          localStorage.clear()

        }
      })()
    }
  }, [navigate, onSubmit])
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!rememberMe){
      toast.error('you must enable "Remember me" to login')

    }
    setLoading(true)

    try {
      const { data } = await axios.post(`${url}/api/users/login`, formData)
      if(!data.token) throw new Error(data.message || "Login failed")

        localStorage.setItem("token",data.token)
        localStorage.setItem("userId",data.user.id)
        setFormData(INITIAL_FORM)
        onSubmit?.({ token: data.token, userId: data.user.id, ...data.user})
        toast.success("Login successful! Redirecting... ")
        setTimeout(() => navigate("/"),1000)
       } catch (err) {
        const msg = err.response?.data?.message || err.message      
        toast.error(msg);
    } finally {
      setLoading(false);
    }
  }
  

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
  }


 const fields = [
    { name: 'email', type: 'email', placeholder: 'Email', icon: Mail },
    {
      name: 'password',
      type: showPassword ? 'text' : 'password',
      placeholder: 'Password',
      icon: Lock,
      isPassword: true,
    },
  ];
  
  return (
    <div className='max-w-7xl mx-auto px-4 bg-white'> 
      <ToastContainer position='top-center' autoClose={3000} hideProgressBar />
      <div className='mb-8 text-center'>
        <div className='w-16 h-16 bg-gradient-to-br from-green-400 to-blue-800 rounded-full mx-auto flex items-center justify-center mb-4'>
          <User className='w-8 h-8 text-white' />
        </div>
        <h2 className='text-2xl font-semibold mb-2 text-center'>Welcome Back!</h2>
        <p className='mb-4 text-grey-600 text-center'>Login to your Qubic.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon , isPassword }) => (
                 <div key={name} className={Inputwrapper}> 
                 <Icon className="text-green-600 w-5 h-5 mr-2" />
                  <input type={type}  placeholder={placeholder} value={formData[name]}
                   onChange={(e) => setFormData({ ...formData, [name]: e.target.value })} 
                   className="w-full border border-grey-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" required/>
                   {isPassword && (
                    <button type='button' onClick={() => setShowPassword((prev) => !prev)}
                    className='ma-2 text-grey-500 text-green-500 transition-colors'>
                    {showPassword? <EyeOff className='w-5 h-5'/> : <Eye className='w-5 h-5'/>}
                    </button>
                   )}
                   </div>
                ))}
                <div className="flex items-center ">
                <input type="checkbox"  id="rememberMe" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} className="h-4 w-4 " required />
  <label htmlFor="rememberMe" className="cursor-pointer">
    Remember Me
  </label>
</div>
        <button type="submit" className={BUTTON_CLASSES} disabled={loading}>
          {loading ? (  'Logging in...') : (<><LogIn className='w-4 h-4' />Login</>)}
        </button>
        <p className='text-sm text-grey-600 text-center'>
          Don't have an account? 
          <button type='button' className='text-blue-400 font-medium transition-colors' onClick={handleSwitchMode}>
          Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;