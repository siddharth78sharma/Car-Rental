import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import toast from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
  const { setShowLogin, setToken, fetchUserData } = useAppContext();
  const [state, setState] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (forgotPasswordMode) {
        // Forgot password request
        const { data } = await axios.post('/api/user/forgot-password', { email });
        if (data.success) {
          toast.success(data.message || 'Check your email for reset link.');
          setForgotPasswordMode(false);
        } else {
          toast.error(data.message);
        }
        return;
      }

      // Login or Register
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        axios.defaults.headers.common['Authorization'] = `${data.token}`;
        setShowLogin(false);
        await fetchUserData();
        toast.success(data.message || `${state === 'login' ? 'Login' : 'Registration'} successful!`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/50'>
      <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 p-8 py-12 w-80 sm:w-[360px] rounded-lg shadow-xl bg-white border border-gray-200">
        <p className="text-2xl font-medium text-center">
          {forgotPasswordMode ? "Reset Password" : <><span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}</>}
        </p>

        {!forgotPasswordMode && state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Type here" className="border p-2 w-full mt-1 rounded outline-primary" type="text" required />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Type here" className="border p-2 w-full mt-1 rounded outline-primary" type="email" required />
        </div>

        {!forgotPasswordMode && (
          <div className="w-full">
            <p>Password</p>
            <div className="relative">
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Type here" className="border p-2 w-full mt-1 rounded outline-primary pr-10" type={showPassword ? "text" : "password"} required />
              <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                <img src={showPassword ? assets.eye_icon : assets.eye_close_icon} alt="Toggle" className="w-5 h-5" />
              </span>
            </div>
          </div>
        )}

        {!forgotPasswordMode && (
          <div className='flex justify-end w-full'>
            <span onClick={() => setForgotPasswordMode(true)} className="text-primary cursor-pointer hover:underline">
              Forgot password?
            </span>
          </div>
        )}

        <button className="bg-primary text-white w-full py-2 rounded hover:bg-blue-800 transition">
          {forgotPasswordMode ? "Send Reset Link" : state === "register" ? "Create Account" : "Login"}
        </button>

        {!forgotPasswordMode && (
          <div className='flex justify-center w-full text-sm mt-2'>
            {state === "register" ? (
              <>Already have an account? <span onClick={() => setState("login")} className="text-primary cursor-pointer hover:underline">Click here</span></>
            ) : (
              <>Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer hover:underline">Click here</span></>
            )}
          </div>
        )}

        {forgotPasswordMode && (
          <div className='flex justify-center w-full text-sm mt-2'>
            <span onClick={() => setForgotPasswordMode(false)} className="text-primary cursor-pointer hover:underline">
              Back to Login
            </span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;

















// import React, { useState } from 'react'
// import { useAppContext } from '../context/AppContext';
// import { assets } from '../assets/assets'
// import toast from 'react-hot-toast';
// import axios from 'axios'; 

// const Login = () => {
//     // We need axios, setToken, and fetchUserData from the context
//     const { setShowLogin, setToken, fetchUserData } = useAppContext();
//     const [state, setState] = useState("login");
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const onSubmitHandler = async (event) => {
//         try {
//             event.preventDefault();

//             // Use the locally imported axios for the login POST request
//             const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

//             if (data.success) {
//                 // Set the token state in AppContext
//                 setToken(data.token);
//                 // Immediately set the token in localStorage
//                 localStorage.setItem('token', data.token);
//                 // Instantly update the axios default headers
//                 axios.defaults.headers.common['Authorization'] = `${data.token}`;
//                 // Now, close the login modal
//                 setShowLogin(false);
//                 // Immediately fetch user data, which will update the UI
//                 await fetchUserData();

//                 toast.success(data.message || `${state === 'login' ? 'Login' : 'Registration'} successful!`);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error("An error occurred during authentication.");
//         }
//     };

//     return (
//         <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>
//             <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
//                 <p className="text-2xl font-medium m-auto">
//                     <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
//                 </p>
//                 {state === "register" && (
//                     <div className="w-full">
//                         <p>Name</p>
//                         <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
//                     </div>
//                 )}
//                 <div className="w-full ">
//                     <p>Email</p>
//                     <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
//                 </div>
//                 <div className="w-full ">
//                     <p>Password</p>
//                     <div className="relative">
//                         <input
//                             onChange={(e) => setPassword(e.target.value)}
//                             value={password}
//                             placeholder="type here"
//                             className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary pr-10"
//                             type={showPassword ? "text" : "password"}
//                             required
//                         />
//                         <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
//                             <img 
//                                 src={showPassword ? assets.eye_icon : assets.eye_close_icon} 
//                                 alt={showPassword ? "Hide password" : "Show password"} 
//                                 className="w-5 h-5" 
//                             />
//                         </span>
//                     </div>
//                 </div>

//                 <div className='flex justify-end w-full'>
//                     <span onClick={() => {
//                         toast('Please contact support to reset your password.', { icon: '🔑', })
//                     }} className="text-primary cursor-pointer hover:underline">
//                         Forgot password?
//                     </span>
//                 </div>
//                 
//                 <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
//                     {state === "register" ? "Create Account" : "Login"}
//                 </button>

//                 <div className='flex justify-between w-full'>
//                     {state === "register" ? (
//                         <p>
//                             Already have an account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
//                         </p>
//                     ) : (
//                         <p>
//                             Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
//                         </p>
//                     )}
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default Login


















// import React, { useState } from 'react'
// import { useAppContext } from '../context/AppContext';
// import { assets } from '../assets/assets'
// import toast from 'react-hot-toast';


// const Login = () => {

//     const { setShowLogin, axios, setToken, navigate } = useAppContext()

//     const [state, setState] = useState("login");
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const onSubmitHandler = async (event) => {
//         try {
//             event.preventDefault();
//             const { data } = await axios.post(`/api/user/${state}`, { name, email, password })

//             if (data.success) {
//                 navigate('/')
//                 setToken(data.token)
//                 localStorage.setItem('token', data.token)
//                 setShowLogin(false)
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }

//     }

//     return (
//         <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>
//             <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
//                 <p className="text-2xl font-medium m-auto">
//                     <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
//                 </p>
//                 {state === "register" && (
//                     <div className="w-full">
//                         <p>Name</p>
//                         <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
//                     </div>
//                 )}
//                 <div className="w-full ">
//                     <p>Email</p>
//                     <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
//                 </div>
//                 <div className="w-full ">
//                     <p>Password</p>
//                     <div className="relative">
//                         <input
//                             onChange={(e) => setPassword(e.target.value)}
//                             value={password}
//                             placeholder="type here"
//                             className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary pr-10"
//                             type={showPassword ? "text" : "password"}
//                             required
//                         />
//                         <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
//                             <img 
//                                 src={showPassword ? assets.eye_icon : assets.eye_close_icon} 
//                                 alt={showPassword ? "Hide password" : "Show password"} 
//                                 className="w-5 h-5" 
//                             />
//                         </span>
//                     </div>
//                 </div>

//                 <div className='flex justify-end w-full'>
//                     <span onClick={() => {
//                         toast('Please contact support to reset your password.', { icon: '🔑', })
//                     }} className="text-primary cursor-pointer hover:underline">
//                         Forgot password?
//                     </span>
//                 </div>
                
//                 <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
//                     {state === "register" ? "Create Account" : "Login"}
//                 </button>

//                 <div className='flex justify-between w-full'>
//                     {state === "register" ? (
//                         <p>
//                             Already have an account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
//                         </p>
//                     ) : (
//                         <p>
//                             Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
//                         </p>
//                     )}
//                 </div>
//             </form>
//         </div>
//     )
// }

// export default Login