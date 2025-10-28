import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [items, setItems] = useState([]);

    const [adminCurrentPage, setAdminCurrentPage] = useState(1);
    const [adminTotalPages, setAdminTotalPages] = useState(1);
    const adminLimit = 10;

    // 1. Fetch all public items for the main application pages
    const fetchAllPublicItems = async () => {
        try {
            const response = await axios.get('/api/user/list-all-public');

            if (response.data.success) {
                setItems(response.data.items);
            } else {
                console.error("Failed to fetch public items:", response.data.message);
            }
        } catch (error) {
            console.error("API Error fetching public items:", error);
        }
    };
    
    // ⭐ FIX APPLIED HERE: Added sort and category parameters, and constructed the URL ⭐
    const fetchAdminItems = useCallback(async (page = 1, search = '', sort = '', category = '') => {
        try {
            // Start URL construction with required parameters
            let url = `/api/user/admin/items?page=${page}&limit=${adminLimit}&search=${search}`;
            
            // Append sort parameter if it exists
            if (sort) {
                url += `&sort=${sort}`;
            }
            
            // Append category parameter if it exists (THIS IS THE PRIMARY FIX)
            if (category) {
                url += `&category=${category}`;
            }
            
            const { data } = await axios.get(url);
            
            if (data.success) {
                setItems(data.items);
                // Update pagination states from the API response
                setAdminCurrentPage(data.currentPage);
                setAdminTotalPages(data.totalPages);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch admin items.");
            console.error(error);
        }
    }, [axios, adminLimit]);
    
    // Function to fetch user data and handle navigation
    const fetchUserData = async () => {
        try {
            const { data } = await axios.get('/api/user/data');
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
                setIsAdmin(data.user.role === 'admin');
                
                if (data.user.role === 'admin') {
                    // Admins get their specific list of items. 
                    // No filters are passed here on initial load, but the component's useEffect will call it properly.
                    fetchAdminItems(); 
                    navigate('/admin');
                } else if (data.user.role === 'owner') {
                    navigate('/');
                } else {
                    // Regular user: fetch public items
                    fetchAllPublicItems(); 
                    navigate('/');
                }
            } else {
                setUser(null);
                setIsOwner(false);
                setIsAdmin(false);
            }
        } catch (error) {
            console.error(error);
            setUser(null);
            setIsOwner(false);
            setIsAdmin(false);
        }
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        setIsAdmin(false);
        axios.defaults.headers.common['Authorization'] = '';
        toast.success('You have been logged out');
        navigate('/');
    };

    // 1. Load token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common['Authorization'] = `${storedToken}`;
        } else {
            // No token, so fetch public items immediately
            fetchAllPublicItems();
        }
    }, []);

    // 2. Run when token changes
    useEffect(() => {
        if (token) {
            fetchUserData();
        } else {
            // Token was just cleared (e.g., on logout).
            setUser(null);
            setIsOwner(false);
            setIsAdmin(false);
            fetchAllPublicItems(); 
        }
    }, [token]);

    const value = {
        axios, navigate, currency, user, updateUser, setUser, token, setToken, isOwner, setIsOwner, isAdmin, setIsAdmin, fetchUserData, showLogin, setShowLogin, logout, items, setItems, pickupDate, setPickupDate, returnDate, setReturnDate, fetchAllPublicItems, fetchAdminItems, adminCurrentPage, setAdminCurrentPage, adminTotalPages, adminLimit
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};













// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axios from 'axios';
// import { toast } from 'react-hot-toast';
// import { useNavigate } from "react-router-dom";

// axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// export const AppContext = createContext();

// export const AppProvider = ({ children }) => {
//     const navigate = useNavigate();
//     const currency = import.meta.env.VITE_CURRENCY;

//     const [token, setToken] = useState(null);
//     const [user, setUser] = useState(null);
//     const [isOwner, setIsOwner] = useState(false);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [showLogin, setShowLogin] = useState(false);
//     const [pickupDate, setPickupDate] = useState('');
//     const [returnDate, setReturnDate] = useState('');
//     const [items, setItems] = useState([]);

//     const [adminCurrentPage, setAdminCurrentPage] = useState(1);
//     const [adminTotalPages, setAdminTotalPages] = useState(1);
//     const adminLimit = 10;

//     // 1. Fetch all public items for the main application pages
//     const fetchAllPublicItems = async () => {
//         try {
//             const response = await axios.get('/api/user/list-all-public');

//             if (response.data.success) {
//                 setItems(response.data.items);
//             } else {
//                 console.error("Failed to fetch public items:", response.data.message);
//             }
//         } catch (error) {
//             console.error("API Error fetching public items:", error);
//         }
//     };
    
//     // Existing function (only for admin's view)
//     // const fetchAdminItems = async () => {
//     //     try {
//     //         const { data } = await axios.get('/api/user/admin/items');
//     //         if (data.success) {
//     //             setItems(data.items);
//     //         } else {
//     //             toast.error(data.message);
//     //         }
//     //     } catch (error) {
//     //         toast.error("Failed to fetch admin items.");
//     //     }
//     // };

//     const fetchAdminItems = useCallback(async (page = 1, search = '') => {
//         try {
//             const url = `/api/user/admin/items?page=${page}&limit=${adminLimit}&search=${search}`;
//             const { data } = await axios.get(url);
            
//             if (data.success) {
//                 setItems(data.items);
//                 // Update pagination states from the API response
//                 setAdminCurrentPage(data.currentPage);
//                 setAdminTotalPages(data.totalPages);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error("Failed to fetch admin items.");
//             console.error(error);
//         }
//     }, [axios, adminLimit]);
    
//     // Function to fetch user data and handle navigation
//     const fetchUserData = async () => {
//         try {
//             const { data } = await axios.get('/api/user/data');
//             if (data.success) {
//                 setUser(data.user);
//                 setIsOwner(data.user.role === 'owner');
//                 setIsAdmin(data.user.role === 'admin');
                
//                 if (data.user.role === 'admin') {
//                     // Admins get their specific list of items
//                     fetchAdminItems(); 
//                     navigate('/admin');
//                 } else if (data.user.role === 'owner') {
//                     // Owners will typically have a separate list of their items (not implemented here)
//                     navigate('/owner');
//                 } else {
//                     // Regular user: fetch public items
//                     fetchAllPublicItems(); 
//                     navigate('/');
//                 }
//             } else {
//                 // ... (logout logic if token is invalid)
//                 setUser(null);
//                 setIsOwner(false);
//                 setIsAdmin(false);
//                 // The item list is handled below when token is cleared
//             }
//         } catch (error) {
//             console.error(error);
//             setUser(null);
//             setIsOwner(false);
//             setIsAdmin(false);
//             // The item list is handled below when token is cleared
//         }
//     };

//     const updateUser = (updatedUserData) => {
//         setUser(updatedUserData);
//     };

//     const logout = () => {
//         localStorage.removeItem('token');
//         setToken(null);
//         setUser(null);
//         setIsOwner(false);
//         setIsAdmin(false);
//         axios.defaults.headers.common['Authorization'] = '';
//         toast.success('You have been logged out');
//         navigate('/');
//     };

//     // 1. Load token from localStorage on mount
//     useEffect(() => {
//         const storedToken = localStorage.getItem('token');
//         if (storedToken) {
//             setToken(storedToken);
//             axios.defaults.headers.common['Authorization'] = `${storedToken}`;
//         } else {
//             // No token, so fetch public items immediately
//             fetchAllPublicItems();
//         }
//     }, []);

//     // 2. Run when token changes
//     useEffect(() => {
//         if (token) {
//             fetchUserData();
//         } else {
//             // Token was just cleared (e.g., on logout).
//             setUser(null);
//             setIsOwner(false);
//             setIsAdmin(false);
//             // If fetchAllPublicItems hasn't run or needs to refresh after logout
//             // It's also called in useEffect above, so this is for explicit logout 
//             // and provides a fallback.
//             fetchAllPublicItems(); 
//         }
//     }, [token]);

//     // **REMOVED** the empty dependency useEffect: 
//     // useEffect(() => { fetchAllPublicItems(); }, []); 
//     // This logic is now covered in the [token] useEffects above.

//     const value = {
//         axios, navigate, currency, user, updateUser, setUser, token, setToken, isOwner, setIsOwner, isAdmin, setIsAdmin, fetchUserData, showLogin, setShowLogin, logout, items, setItems, pickupDate, setPickupDate, returnDate, setReturnDate, fetchAllPublicItems, fetchAdminItems, adminCurrentPage, setAdminCurrentPage, adminTotalPages, adminLimit
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     );
// };

// export const useAppContext = () => {
//     return useContext(AppContext);
// };
