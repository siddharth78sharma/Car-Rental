import React, { useEffect } from 'react';
import NavbarOwner from '../../components/owner/NavbarOwner';
import Sidebar from '../../components/owner/Sidebar';
import { Outlet } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const Layout = () => {
    const { isOwner, navigate } = useAppContext();

    useEffect(() => {
        if (!isOwner) {
            navigate('/');
        }
    }, [isOwner, navigate]);

    return (
        <div className='flex flex-col min-h-screen'>
            <NavbarOwner />
            <div className='flex flex-1'>
                {/* The sidebar is now fixed and takes up space */}
                <Sidebar />
                
                {/* The content area for nested routes */}
                <div className='flex-1 md:ml-64'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;















// import React, { useEffect } from 'react';
// import NavbarOwner from '../../components/owner/NavbarOwner';
// import Sidebar from '../../components/owner/Sidebar';
// import { Outlet } from 'react-router-dom';
// import { useAppContext } from '../../context/AppContext';

// const Layout = () => {
//     const { isOwner, navigate } = useAppContext(); 

//     useEffect(() => {
//         if (!isOwner) {
//             navigate('/');
//         }
//     }, [isOwner, navigate]); // Added navigate to the dependency array

//     return (
//         <div className='flex flex-col min-h-screen'>
//             <NavbarOwner />
//             <div className='flex flex-1'>
//                 {/* The sidebar is now fixed and takes up space */}
//                 <Sidebar />
                
//                 {/* The content area needs to be pushed over by the sidebar's width. 
//                   The md:ml-64 class adds a left margin on medium screens and larger, 
//                   which prevents the content from overlapping the fixed sidebar. 
//                 */}
//                 <div className='flex-1 md:ml-64'>
//                     <Outlet />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Layout;















// import React, { useEffect } from 'react'
// import NavbarOwner from '../../components/owner/NavbarOwner'
// import Sidebar from '../../components/owner/Sidebar'
// import { Outlet } from 'react-router-dom'
// import { useAppContext } from '../../context/AppContext'

// const Layout = () => {
//   const {isOwner, navigate} = useAppContext() 

//   useEffect(()=>{
//      if(!isOwner){
//       navigate('/')
//      }
//   },[isOwner])
  
//   return (
//     <div className='flex flex-col'>
//         <NavbarOwner />
//         <div className='flex'>
//             <Sidebar />
//             <Outlet />
//         </div>
//     </div>
//   )
// }

// export default Layout