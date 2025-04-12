// "use client";

// import { useState } from 'react';
// import Link from 'next/link';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';

// export default function Header() {
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [isProfileOpen, setIsProfileOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     router.push('/');
//     toast.success('Logged out successfully');
//   };

//   return (
//     <header className="bg-white shadow-sm">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link href="/" className="flex items-center">
//               <span className="text-2xl font-bold gradient-text">AirLink</span>
//             </Link>
//             <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//               <Link href="/flights" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600">
//                 Flights
//               </Link>
//               <Link href="/bookings" className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-indigo-600">
//                 My Bookings
//               </Link>
//             </div>
//           </div>

//           <div className="hidden sm:ml-6 sm:flex sm:items-center">
//             {user ? (
//               <div className="relative">
//                 <button
//                   onClick={() => setIsProfileOpen(!isProfileOpen)}
//                   className="flex items-center space-x-2 text-sm font-medium text-gray-900 hover:text-indigo-600 focus:outline-none"
//                 >
//                   <span>{user.name}</span>
//                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                   </svg>
//                 </button>

//                 {isProfileOpen && (
//                   <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
//                     <div className="py-1">
//                       <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                         Profile
//                       </Link>
//                       <button
//                         onClick={handleLogout}
//                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                       >
//                         Sign out
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <Link href="/login" className="btn-outline">
//                   Sign in
//                 </Link>
//                 <Link href="/register" className="btn-primary">
//                   Sign up
//                 </Link>
//               </div>
//             )}
//           </div>

//           <div className="flex items-center sm:hidden">
//             <button
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
//             >
//               <span className="sr-only">Open main menu</span>
//               <svg
//                 className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//               <svg
//                 className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile menu */}
//       <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
//         <div className="pt-2 pb-3 space-y-1">
//           <Link href="/flights" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
//             Flights
//           </Link>
//           <Link href="/bookings" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
//             My Bookings
//           </Link>
//           {user ? (
//             <>
//               <Link href="/profile" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
//                 Profile
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-red-600 hover:bg-gray-50"
//               >
//                 Sign out
//               </button>
//             </>
//           ) : (
//             <>
//               <Link href="/login" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
//                 Sign in
//               </Link>
//               <Link href="/register" className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50">
//                 Sign up
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// } 