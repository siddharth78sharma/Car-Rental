import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets'
import toast from 'react-hot-toast';
import axios from 'axios'; 

const Login = () => {
    // We need axios, setToken, and fetchUserData from the context
    const { setShowLogin, setToken, fetchUserData } = useAppContext();
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            // Use the locally imported axios for the login POST request
            const { data } = await axios.post(`/api/user/${state}`, { name, email, password });

            if (data.success) {
                // Set the token state in AppContext
                setToken(data.token);
                // Immediately set the token in localStorage
                localStorage.setItem('token', data.token);
                // Instantly update the axios default headers
                axios.defaults.headers.common['Authorization'] = `${data.token}`;
                // Now, close the login modal
                setShowLogin(false);
                // Immediately fetch user data, which will update the UI
                await fetchUserData();

                toast.success(data.message || `${state === 'login' ? 'Login' : 'Registration'} successful!`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred during authentication.");
        }
    };

    return (
        <div onClick={() => setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="text" required />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <div className="relative">
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            placeholder="type here"
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary pr-10"
                            type={showPassword ? "text" : "password"}
                            required
                        />
                        <span onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                            <img 
                                src={showPassword ? assets.eye_icon : assets.eye_close_icon} 
                                alt={showPassword ? "Hide password" : "Show password"} 
                                className="w-5 h-5" 
                            />
                        </span>
                    </div>
                </div>

                <div className='flex justify-end w-full'>
                    <span onClick={() => {
                        toast('Please contact support to reset your password.', { icon: '🔑', })
                    }} className="text-primary cursor-pointer hover:underline">
                        Forgot password?
                    </span>
                </div>
                
                <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>

                <div className='flex justify-between w-full'>
                    {state === "register" ? (
                        <p>
                            Already have an account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                        </p>
                    ) : (
                        <p>
                            Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                        </p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Login













// import React, { useState } from 'react'
// import { useAppContext } from '../context/AppContext';
// import { assets } from '../assets/assets'
// import toast from 'react-hot-toast';


// const Login = ({ handleNavigate }) => {

//     // I've added setIsAdmin to this destructuring.

//     const { setShowLogin, axios, setToken, navigate, setIsAdmin } = useAppContext()

//     const [state, setState] = useState("login");
//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);

//     const onSubmitHandler = async (event) => {
//         try {
//             event.preventDefault();

//              if (email === 'admin@gmail.com') {
//                 setIsAdmin(true);
//                 setShowLogin(false);
//                 handleNavigate('/admin');
//                 toast.success("Admin login successful!");
//                 return;
//             }


//             const { data } = await axios.post(`/api/user/${state}`, { name, email, password })

//             if (data.success) {
//                 setToken(data.token)
//                 localStorage.setItem('token', data.token)
//                 setShowLogin(false)

//                 // Check user role from the API response and navigate accordingly
//                 // NOTE: Your backend API must return isAdmin: true for admin users.
//                 if (data.isAdmin) {
//                     setIsAdmin(true);
//                     navigate('/admin');
//                 } else if (data.isOwner) {
//                     navigate('/owner');
//                 } else {
//                     navigate('/');
//                 }
//             } else {
//                 toast.error(data.message)
//             }

//         } catch (error) {
//             toast.error(error.message)
//         }

//     }

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