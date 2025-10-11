// import React, { useEffect, useState } from 'react';
// import { faL, faPencil, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import loader from "../images/loading.png"
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import right from "../images/exclamation.png"
// import { BASE_URL } from '../BASE_URL';
// import RupeesIcon from '../assets/Rupees';

// const MyCataLog = () => {

//   const [loading, setLoading] = useState(false)

//   const navigate = useNavigate();

//   const [packageExpire, setPackageExpire] = useState(false);
//   const [notPremium, setNotPremium] = useState(false);
//   const [filteredCatelog, setFilteredCatelog] = useState([])

//   const handleButtonClick = (e) => {
//     // const membershipStatus = localStorage.getItem("membershipStatus")

//     // if (membershipStatus === "free") {
//     //   setNotPremium(true)
//     // } else {
//     //   const catalogLimit = parseInt(localStorage.getItem("catalogLimit"), 10);
//     //   if (catalogLimit === filteredCatelog?.length - 1) {
//     //     setPackageExpire(true);
//     //   } else {
//     navigate("/company/insert-chemical");
//     //   }
//     // }
//   };

//   const abc = "3928";

//   const handleEdit = (e) => {
//     navigate(`/company/insert-chemical`, { state: { abc: abc, id: e } });
//   };

//   const [activeLink, setActiveLink] = useState('all');

//   const handleLinkClick = (link) => {
//     setActiveLink(link);
//   };

//   const [isOpen, setIsOpen] = useState(false);

//   const handleAddActive = () => {
//     setIsOpen(true)
//   }

//   const handleActiveClose = () => {
//     setFilteredCatelog(catelogs)
//     fetchCatelogData();
//     setIsOpen(false)
//   }

//   const [catelogs, setCatelogs] = useState([])
//   const [activeChemicalList, setActiveChemicalList] = useState([])
//   const [searchInput, setSearchInput] = useState("")

//   const handleFilter = (e) => {
//     const value = e.target.value.toLowerCase(); // Convert input value to lowercase
//     setSearchInput(value); // Update the search input state
//   };

//   const fetchCatelogData = async () => {
//     const token = `Bearer ${localStorage.getItem("chemicalToken")}`
//     const res = await fetch(`${BASE_URL}api/catalog`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: token,
//       },
//     })
//     const data = await res.json()
//     setCatelogs(data?.catalogs)
//     setActiveChemicalList(data?.catalogs)
//     setFilteredCatelog(data?.catalogs)
//   }

//   useEffect(() => {
//     fetchCatelogData();
//   }, []);

//   const filteredCatalogList = catelogs?.filter((item) => {
//     if (activeLink === 'all') return true;
//     if (activeLink === 'active') return item.active_chemicals === 'active';
//     if (activeLink === 'inactive') return item.active_chemicals === 'inactive';
//     if (activeLink === 'API') return item.category === 'API';
//     return false;
//   });

//   useEffect(() => {
//     setFilteredCatelog(filteredCatalogList)
//   }, [activeLink]);

//   const handleCheckboxChange = (index) => {
//     const updatedList = [...activeChemicalList];
//     updatedList[index].active_chemicals = updatedList[index].active_chemicals === "active" ? "inactive" : "active";
//     setActiveChemicalList(updatedList);
//   };

//   const handleActiveSubmit = async () => {

//     const membershipStatus = localStorage.getItem("membershipStatus")

//     if (membershipStatus === "free") {
//       setNotPremium(true)
//     } else {
//       const catalogLimit = parseInt(localStorage.getItem("catalogLimit"), 10);
//       if (catalogLimit === filteredCatelog?.length - 1) {
//         setPackageExpire(true);
//       } else {
//         setLoading(true)
//         try {
//           const token = `Bearer ${localStorage.getItem("chemicalToken")}`
//           const promises = activeChemicalList.map((chemical) => {
//             return axios.put(
//               `${BASE_URL}api/status/`,
//               { active_chemicals: chemical.active_chemicals, catalogId: chemical._id },
//               {
//                 headers: {
//                   "Content-Type": "application/json", // Set content type to application/json
//                   Authorization: token,
//                 },
//               }
//             );
//           });
//           await Promise.all(promises);
//           handleActiveClose();
//           fetchCatelogData();
//           setLoading(false)
//           toast.success('Active chemicals updated successfully!', {
//             position: toast.POSITION.BOTTOM_RIGHT,
//             autoClose: 1000,
//           });
//         } catch (error) {
//           setLoading(false)
//           console.error("Error updating active chemicals:", error.message);
//           toast.error(error.message, {
//             position: toast.POSITION.BOTTOM_RIGHT,
//             autoClose: 1000,
//           });
//         }
//       }
//     }
//   };

//   const handleNavigate = () => {
//     navigate("/company/packages")
//   }

//   // console.log(filteredCatelog)

//   return (
//     <>

//       <div className="w-full overflow-x-hidden">
//         <ToastContainer />
//         <div className="flex flex-col p-2">
//           <h1 className="md:text-3xl text-xl font-semibold">Catalog Management</h1>

//           <div className="sm:flex hidden gap-7 mt-7">
//             <span
//               className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'all' && 'border-b-2 border-black'}`}
//               onClick={() => handleLinkClick('all')}
//             >
//               All
//               <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
//                 {catelogs?.filter((item) =>
//                   item?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
//                 ).length || 0}
//               </span>
//             </span>
//             <span
//               className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'API' && 'border-b-2 border-black'}`}
//               onClick={() => handleLinkClick('API')}
//             >
//               API
//               <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
//                 {catelogs?.filter(item =>
//                   item.category === 'API' &&
//                   item?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
//                 ).length || 0}
//               </span>
//             </span>
//             <span
//               className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'active' && 'border-b-2 border-black'}`}
//               onClick={() => handleLinkClick('active')}
//             >
//               Active Chemicals
//               <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
//                 {catelogs?.filter(item =>
//                   item.active_chemicals === 'active').length || 0}
//               </span>
//             </span>
//             <span
//               className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === 'inactive' && 'border-b-2 border-black'}`}
//               onClick={() => handleLinkClick('inactive')}
//             >
//               Inactive Chemicals
//               <span className='px-1 bg-slate-200 rounded-full text-xs ms-1'>
//                 {catelogs?.filter(item =>
//                   item.active_chemicals === 'inactive' &&
//                   item?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase())
//                 ).length || 0}
//               </span>
//             </span>
//           </div>

//           <div className='sm:hidden flex justify-between items-center mt-2'>
//             <p className='text-sm font-semibold'>
//               {activeLink && activeLink?.charAt(0)?.toUpperCase() + activeLink?.slice(1)}
//             </p>

//             <select onChange={(e) => handleLinkClick(e.target.value)} name="" className='border border-gray-300 rounded-md px-1'>
//               <option value="all">All</option>
//               <option value="api">API</option>
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           <hr className="my-4 border-t-2 border-gray-200" />

//           <div className="flex gap-3 items-center relative">
//             <FontAwesomeIcon icon={faSearch} className="absolute sm:top-3 top-2 left-4" />
//             <input
//               value={searchInput}
//               onChange={handleFilter}
//               type="text"
//               placeholder="Search By Chemical Name"
//               className="bg-gray-100 md:w-[82%] w-[80%] text-gray-800 pl-10 sm:py-2 py-1 outline-none rounded-md sm:placeholder:text-sm placeholder:text-xs"
//             />
//             <button onClick={handleAddActive} className="bg-darkBlue md:flex hidden items-center justify-center w-[18%] py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
//               Active Chemical
//             </button>
//             <button onClick={handleButtonClick} className="bg-darkBlue md:flex hidden items-center justify-center w-[18%] py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
//               <FontAwesomeIcon icon={faPlus} /> Add Chemical
//             </button>

//             <button onClick={handleButtonClick} className="md:hidden bg-darkBlue flex items-center justify-center px-4 py-2 gap-2 text-white rounded-lg" style={{ fontSize: '14px' }}>
//               <FontAwesomeIcon icon={faPlus} />
//             </button>
//           </div>

//           {/* active cheemical add form  */}

//           {isOpen && (
//             <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//               <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
//               <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
//                 <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

//                   <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
//                     <div class="bg-white py-3 ps-3">
//                       <div class="">
//                         <h3 className='font-semibold text-gray-600 text-md'>Active Chemical ({activeChemicalList?.filter(e => e?.active_chemicals === 'active')?.length}/{activeChemicalList?.length})</h3>
//                         <p className='text-[10px] mt-[2px]'>(Total chemical : {activeChemicalList?.length})</p>
//                       </div>
//                     </div>
//                     <div class="bg-gray-50">
//                       {activeChemicalList && activeChemicalList.map((e, index) => {
//                         const isEven = index % 2 === 0;
//                         const bgColorClass = isEven ? 'bg-gray-200' : '';
//                         return (
//                           <div key={e._id} className={`flex gap-3 ps-3 py-2 ${bgColorClass}`}>
//                             <input
//                               type="checkbox"
//                               checked={e.active_chemicals === "active"}
//                               onChange={() => handleCheckboxChange(index)}
//                             />
//                             <p className='font-medium'>{e.productDetails?.[0]?.name_of_chemical}</p>
//                           </div>
//                         );
//                       })}
//                     </div>
//                     <div className="bg-white flex justify-end mx-8 py-3">
//                       <button onClick={handleActiveClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
//                       <button onClick={handleActiveSubmit} type="button" className="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4">
//                         {loading ? (
//                           <img src={loader} alt="" className='h-[20px] px-5 animate-spin' />
//                         ) : (
//                           <>
//                             Submit
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {packageExpire && (
//             <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//               <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

//               <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
//                 <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

//                   <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
//                     <div class="bg-white py-3">
//                       <div class="flex flex-col items-center">
//                         <img src={right} alt="" className='h-[120px] border border-black rounded-full p-3' />
//                         <h3 className='font-semibold text-xl text-center px-5 mt-4'>With Your Current Membership Plan You Can Active Only {localStorage.getItem("catalogLimit")} Chemicals Into Your Catalog</h3>
//                       </div>
//                     </div>
//                     <div class="bg-white mx-8 py-3">
//                       <button onClick={handleNavigate} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {notPremium && (
//             <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
//               <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

//               <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
//                 <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

//                   <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
//                     <div class="bg-white py-3">
//                       <div class="flex flex-col items-center">
//                         <img src={right} alt="" className='h-[120px] border border-black rounded-full p-3' />
//                         <h3 className='font-semibold text-xl text-center px-5 mt-4'>You Are Not Premium Member</h3>
//                       </div>
//                     </div>
//                     <div class="bg-white mx-8 py-3">
//                       <button onClick={handleNavigate} type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]">Browse</button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* active cheemical add form end */}

//           {/* Table */}
//           <div className="relative" style={{ height: "calc(80vh - 180px)" }}>
//           <div className="overflow-y-auto h-full">
//             <table style={{ border: "none" }} className="table-auto w-full border-0 mt-6">
//               <tbody>
//                 {filteredCatelog && [...filteredCatelog]?.filter((e) => e?.productDetails?.[0]?.name_of_chemical?.toLowerCase()?.includes(searchInput?.toLowerCase()))?.map((item, index) => (
//                   <React.Fragment key={index}>
//                     <tr className={`flex py-3 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
//                       <td className="px-2 py-2 sm:text-sm text-xs flex sm:justify-center justify-start items-center font-semibold gap-2">
//                         {index + 1}
//                         {item.active_chemicals === "active" ? (
//                           <span className='border-[5px] border-green-500 rounded-full'></span>
//                         ) : (
//                           <span className='border-[5px] border-red-500 rounded-full'></span>
//                         )}
//                       </td>
//                       <td className="ps-2 pe-6 py-2 sm:flex flex-col justify-center w-[200px] hidden sm:block">
//                         <img src={item.productDetails?.[0]?.structure} alt="" className={item.productDetails?.[0]?.structure === "https://chembizzstorage.blob.core.windows.net/chembizz-files/chembizzchem.png" ? 'w-[60%]':'h-[100px]' } />
//                       </td>

//                       <td className=" pe-6 py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="font-semibold sm:text-sm text-xs">{item.productDetails?.[0]?.name_of_chemical}</h2>
//                           <p className='text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%] sm:w-[200px] w-[120px]'>{item.productDetails?.[0]?.molecularFormula}</p>
//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">CAS No.</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.productDetails?.[0]?.CAS_number}</p>
//                         </div>
//                       </td>
//                       <td className="pe-6 py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Category</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[120px] w-[120px]'>{item.category}</p>
//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Appearance</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.productDetails?.[0]?.Appearance}</p>
//                         </div>
//                       </td>
//                       <td className="py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Sub Category</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[220px] w-[120px]'>{item.subcategory === "undefined" ? "-" : item.subcategory}</p>
//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Storage</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.productDetails?.[0]?.storage}</p>
//                         </div>
//                       </td>
//                       <td className=" py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Grade</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>
//                             {(!item.grade || item.grade === "undefined") ? "-" : Array.isArray(item.grade) ? item.grade.join(", ") : item.grade}
//                           </p>

//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Sample Lot</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center'>{item?.one_lot_qty}{item?.one_lot_qty_type} / <span className='flex items-center'><RupeesIcon />{item.one_lot_qty_price}</span></p>
//                         </div>
//                       </td>
//                       {/* <td className=" py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Price Per Lot</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center'><RupeesIcon />{item.one_lot_qty_price}</p>
//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Max Lot</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item?.max_lot_qty}</p>
//                         </div>
//                       </td> */}
//                       <td className="pe-6 py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Price</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center'><RupeesIcon />{item.max_price}</p>
//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Country Origin / Make</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[170px] w-[120px]'>{item.country_origin}</p>
//                         </div>
//                       </td>
//                       <td className="pe-6 py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Quantity</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.qty} {item.qty_type}</p>
//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Supply Capacity </h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[170px] w-[120px]'>{item.supply_capacity} Kg/Month</p>
//                         </div>
//                       </td>
//                       <td className="pe-6 py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Purity</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item.purity}%</p>
//                         </div>
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]"></h2>
//                           <a href={item.COA} target='_blamk' className="text-blue-600 font-semibold underline cursor-pointer sm:text-sm text-xs">COA</a>
//                         </div>
//                       </td>
//                       {/* <td className=" py-2 flex flex-col justify-center gap-3">
//                         <div>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Purity</h2>
//                           <p className='sm:text-[15px] text-xs font-semibold sm:w-[100px] w-[50px]'>{item.purity}%</p>
//                         </div>
//                         <div className='text-blue-500 h-full'>
//                           <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]"></h2>
//                           <a href={item.COA} target='_blamk' className="font-semibold underline cursor-pointer sm:text-sm text-xs">COA</a>
//                         </div>
//                       </td> */}
//                       <td className="px-4 py-2 flex sjustify-center items-center font-semibold gap-3 cursor-pointer sm:text-sm text-xs" onClick={() => handleEdit(item)}>Edit <FontAwesomeIcon icon={faPencil} /> </td>
//                     </tr>
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           </div>
//         </div>
//       </div>

//     </>
//   )
// }

// export default MyCataLog
import React, { useEffect, useState, useRef } from "react";
import {
  faL,
  faPencil,
  faPlus,
  faSearch,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loader from "../images/loading.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import right from "../images/exclamation.png";
import { BASE_URL } from "../BASE_URL";
import RupeesIcon from "../assets/Rupees";
import chemicalLogo from "../images/anbizz-logo.png";

const MyCataLog = () => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // ADD THIS STATE
  const [catalogToDelete, setCatalogToDelete] = useState(null); // ADD THIS STATE
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ADD THIS STATE
  const navigate = useNavigate();

  const [packageExpire, setPackageExpire] = useState(false);
  const [notPremium, setNotPremium] = useState(false);
  const [filteredCatelog, setFilteredCatelog] = useState([]);

  const handleDelete = (catalog) => {
    setCatalogToDelete(catalog);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!catalogToDelete) return;

    setDeleteLoading(true);
    try {
      const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
      const response = await axios.delete(
        `${BASE_URL}api/catalog/${catalogToDelete._id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Catalog deleted successfully!", {
          position: toast.POSITION.BOTTOM_RIGHT,
          autoClose: 1000,
        });
        // Refresh the catalog list
        fetchCatelogData();
      }
    } catch (error) {
      console.error("Error deleting catalog:", error);
      toast.error(error.response?.data?.message || "Failed to delete catalog", {
        position: toast.POSITION.BOTTOM_RIGHT,
        autoClose: 1000,
      });
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setCatalogToDelete(null);
    }
  };

  // ADD CANCEL DELETE FUNCTION
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCatalogToDelete(null);
  };

  const handleButtonClick = (e) => {
    // const membershipStatus = localStorage.getItem("membershipStatus")

    // if (membershipStatus === "free") {
    //   setNotPremium(true)
    // } else {
    //   const catalogLimit = parseInt(localStorage.getItem("catalogLimit"), 10);
    //   if (catalogLimit === filteredCatelog?.length - 1) {
    //     setPackageExpire(true);
    //   } else {
    navigate("/company/insert-chemical");
    //   }
    // }
  };

  const abc = "3928";

  const handleEdit = (e) => {
    navigate(`/company/insert-chemical`, { state: { abc: abc, id: e } });
  };

  const [activeLink, setActiveLink] = useState("all");

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleAddActive = () => {
    setIsOpen(true);
  };

  const handleActiveClose = () => {
    setFilteredCatelog(catelogs);
    fetchCatelogData();
    setIsOpen(false);
  };

  const [catelogs, setCatelogs] = useState([]);
  const [activeChemicalList, setActiveChemicalList] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase(); // Convert input value to lowercase
    setSearchInput(value); // Update the search input state
  };

  const fetchCatelogData = async () => {
    const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
    const res = await fetch(`${BASE_URL}api/catalog`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    const data = await res.json();
    setCatelogs(data?.catalogs);
    setActiveChemicalList(data?.catalogs);
    setFilteredCatelog(data?.catalogs);
  };

  useEffect(() => {
    fetchCatelogData();
  }, []);

  const filteredCatalogList = catelogs?.filter((item) => {
    if (activeLink === "all") return true;
    if (activeLink === "active") return item.active_chemicals === "active";
    if (activeLink === "inactive") return item.active_chemicals === "inactive";
    if (activeLink === "API") return item.category === "API";
    if (activeLink === "sale") return item.listing_type === "sale"; // Add this line
    if (activeLink === "buy") return item.listing_type === "buy"; // Add this line
    return false;
  });

  useEffect(() => {
    setFilteredCatelog(filteredCatalogList);
  }, [activeLink]);

  const handleCheckboxChange = (index) => {
    const updatedList = [...activeChemicalList];
    updatedList[index].active_chemicals =
      updatedList[index].active_chemicals === "active" ? "inactive" : "active";
    setActiveChemicalList(updatedList);
  };

  const handleActiveSubmit = async () => {
    const membershipStatus = localStorage.getItem("membershipStatus");

    if (membershipStatus === "free") {
      setNotPremium(true);
    } else {
      const catalogLimit = parseInt(localStorage.getItem("catalogLimit"), 10);
      if (catalogLimit === filteredCatelog?.length - 1) {
        setPackageExpire(true);
      } else {
        setLoading(true);
        try {
          const token = `Bearer ${localStorage.getItem("chemicalToken")}`;
          const promises = activeChemicalList.map((chemical) => {
            return axios.put(
              `${BASE_URL}api/status/`,
              {
                active_chemicals: chemical.active_chemicals,
                catalogId: chemical._id,
              },
              {
                headers: {
                  "Content-Type": "application/json", // Set content type to application/json
                  Authorization: token,
                },
              }
            );
          });
          await Promise.all(promises);
          handleActiveClose();
          fetchCatelogData();
          setLoading(false);
          toast.success("Active chemicals updated successfully!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        } catch (error) {
          setLoading(false);
          console.error("Error updating active chemicals:", error.message);
          toast.error(error.message, {
            position: toast.POSITION.BOTTOM_RIGHT,
            autoClose: 1000,
          });
        }
      }
    }
  };

  const handleNavigate = () => {
    navigate("/company/packages");
  };

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (structureImg, e) => {
    e.stopPropagation();
    setDownloading(true);

    try {
      // Create a canvas to combine the images
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Load both images
      const backgroundImg = new Image();
      backgroundImg.crossOrigin = "Anonymous";
      backgroundImg.src = chemicalLogo;

      const foregroundImg = new Image();
      foregroundImg.crossOrigin = "Anonymous";
      foregroundImg.src = structureImg;

      // Wait for both images to load
      await Promise.all([
        new Promise((resolve) => {
          backgroundImg.onload = resolve;
        }),
        new Promise((resolve) => {
          foregroundImg.onload = resolve;
        }),
      ]);

      // Set canvas dimensions
      canvas.width = foregroundImg.width;
      canvas.height = foregroundImg.height;

      // Draw background (scaled to fit)
      const bgAspect = backgroundImg.width / backgroundImg.height;
      const fgAspect = foregroundImg.width / foregroundImg.height;

      if (bgAspect > fgAspect) {
        // Background is wider relative to its height than foreground
        const bgHeight = foregroundImg.height;
        const bgWidth = bgHeight * bgAspect;
        ctx.drawImage(
          backgroundImg,
          (foregroundImg.width - bgWidth) / 2,
          0,
          bgWidth,
          bgHeight
        );
      } else {
        // Background is taller relative to its width than foreground
        const bgWidth = foregroundImg.width;
        const bgHeight = bgWidth / bgAspect;
        ctx.drawImage(
          backgroundImg,
          0,
          (foregroundImg.height - bgHeight) / 2,
          bgWidth,
          bgHeight
        );
      }

      // Draw the chemical structure image on top
      ctx.drawImage(foregroundImg, 0, 0);

      // Create download link
      const link = document.createElement("a");
      link.download = "chemical-with-logo.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
    }

    setDownloading(false);
  };

  // console.log(filteredCatelog)

  return (
    <>
      <div className="w-full overflow-x-hidden">
        <ToastContainer />

        {/* ADD DELETE CONFIRMATION MODAL */}
        {showDeleteModal && (
          <div
            className="relative z-50"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <svg
                          className="h-6 w-6 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                          />
                        </svg>
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3
                          className="text-base font-semibold leading-6 text-gray-900"
                          id="modal-title"
                        >
                          Delete Catalog
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to delete{" "}
                            <strong>
                              {
                                catalogToDelete?.productDetails?.[0]
                                  ?.name_of_chemical
                              }
                            </strong>
                            ? This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={confirmDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <img
                          src={loader}
                          alt=""
                          className="h-5 w-5 animate-spin"
                        />
                      ) : (
                        "Delete"
                      )}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={cancelDelete}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col p-2">
          <h1 className="md:text-3xl text-xl font-semibold">
            Catalog Management
          </h1>

          <div className="sm:flex hidden gap-7 mt-7">
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === "all" && "border-b-2 border-black"
                }`}
              onClick={() => handleLinkClick("all")}
            >
              All
              <span className="px-1 bg-slate-200 rounded-full text-xs ms-1">
                {catelogs?.filter((item) =>
                  item?.productDetails?.[0]?.name_of_chemical
                    ?.toLowerCase()
                    ?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === "API" && "border-b-2 border-black"
                }`}
              onClick={() => handleLinkClick("API")}
            >
              API
              <span className="px-1 bg-slate-200 rounded-full text-xs ms-1">
                {catelogs?.filter(
                  (item) =>
                    item.category === "API" &&
                    item?.productDetails?.[0]?.name_of_chemical
                      ?.toLowerCase()
                      ?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === "active" && "border-b-2 border-black"
                }`}
              onClick={() => handleLinkClick("active")}
            >
              Active Chemicals
              <span className="px-1 bg-slate-200 rounded-full text-xs ms-1">
                {catelogs?.filter((item) => item.active_chemicals === "active")
                  .length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === "inactive" && "border-b-2 border-black"
                }`}
              onClick={() => handleLinkClick("inactive")}
            >
              Inactive Chemicals
              <span className="px-1 bg-slate-200 rounded-full text-xs ms-1">
                {catelogs?.filter(
                  (item) =>
                    item.active_chemicals === "inactive" &&
                    item?.productDetails?.[0]?.name_of_chemical
                      ?.toLowerCase()
                      ?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === "sale" && "border-b-2 border-black"
                }`}
              onClick={() => handleLinkClick("sale")} // Make sure it's 'sale' not 'Sale Chemicals'
            >
              Sale Chemicals
              <span className="px-1 bg-slate-200 rounded-full text-xs ms-1">
                {catelogs?.filter(
                  (item) =>
                    item.listing_type === "sale" &&
                    item?.productDetails?.[0]?.name_of_chemical
                      ?.toLowerCase()
                      ?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
            <span
              className={`cursor-pointer sm:text-sm text-xs pb-2 ${activeLink === "buy" && "border-b-2 border-black"
                }`}
              onClick={() => handleLinkClick("buy")} // Make sure it's 'buy' not 'Buy Chemicals'
            >
              Buy Chemicals
              <span className="px-1 bg-slate-200 rounded-full text-xs ms-1">
                {catelogs?.filter(
                  (item) =>
                    item.listing_type === "buy" &&
                    item?.productDetails?.[0]?.name_of_chemical
                      ?.toLowerCase()
                      ?.includes(searchInput?.toLowerCase())
                ).length || 0}
              </span>
            </span>
          </div>

          <div className="sm:hidden flex justify-between items-center mt-2">
            <p className="text-sm font-semibold">
              {activeLink &&
                activeLink?.charAt(0)?.toUpperCase() + activeLink?.slice(1)}
            </p>

            <select
              onChange={(e) => handleLinkClick(e.target.value)}
              name=""
              className="border border-gray-300 rounded-md px-1"
            >
              <option value="all">All</option>
              <option value="api">API</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <hr className="my-4 border-t-2 border-gray-200" />

          <div className="flex gap-3 items-center relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute sm:top-3 top-2 left-4"
            />
            <input
              value={searchInput}
              onChange={handleFilter}
              type="text"
              placeholder="Search By Chemical Name"
              className="bg-gray-100 md:w-[82%] w-[80%] text-gray-800 pl-10 sm:py-2 py-1 outline-none rounded-md sm:placeholder:text-sm placeholder:text-xs"
            />
            <button
              onClick={handleAddActive}
              className="bg-darkBlue md:flex hidden items-center justify-center w-[18%] py-2 gap-2 text-white rounded-lg"
              style={{ fontSize: "14px" }}
            >
              Active Chemical
            </button>
            <button
              onClick={handleButtonClick}
              className="bg-darkBlue md:flex hidden items-center justify-center w-[18%] py-2 gap-2 text-white rounded-lg"
              style={{ fontSize: "14px" }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Chemical
            </button>

            <button
              onClick={handleButtonClick}
              className="md:hidden bg-darkBlue flex items-center justify-center px-4 py-2 gap-2 text-white rounded-lg"
              style={{ fontSize: "14px" }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>

          {/* active cheemical add form  */}

          {isOpen && (
            <div
              class="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                    <div class="bg-white py-3 ps-3">
                      <div class="">
                        <h3 className="font-semibold text-gray-600 text-md">
                          Active Chemical (
                          {
                            activeChemicalList?.filter(
                              (e) => e?.active_chemicals === "active"
                            )?.length
                          }
                          /{activeChemicalList?.length})
                        </h3>
                        <p className="text-[10px] mt-[2px]">
                          (Total chemical : {activeChemicalList?.length})
                        </p>
                      </div>
                    </div>
                    <div class="bg-gray-50">
                      {activeChemicalList &&
                        activeChemicalList.map((e, index) => {
                          const isEven = index % 2 === 0;
                          const bgColorClass = isEven ? "bg-gray-200" : "";
                          return (
                            <div
                              key={e._id}
                              className={`flex gap-3 ps-3 py-2 ${bgColorClass}`}
                            >
                              <input
                                type="checkbox"
                                checked={e.active_chemicals === "active"}
                                onChange={() => handleCheckboxChange(index)}
                              />
                              <p className="font-medium">
                                {e.productDetails?.[0]?.name_of_chemical}
                              </p>
                            </div>
                          );
                        })}
                    </div>
                    <div className="bg-white flex justify-end mx-8 py-3">
                      <button
                        onClick={handleActiveClose}
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleActiveSubmit}
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-[#0A122A] px-3 py-2 text-sm font-semibold text-white shadow-sm sm:w-auto ml-4"
                      >
                        {loading ? (
                          <img
                            src={loader}
                            alt=""
                            className="h-[20px] px-5 animate-spin"
                          />
                        ) : (
                          <>Submit</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {packageExpire && (
            <div
              class="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white py-3">
                      <div class="flex flex-col items-center">
                        <img
                          src={right}
                          alt=""
                          className="h-[120px] border border-black rounded-full p-3"
                        />
                        <h3 className="font-semibold text-xl text-center px-5 mt-4">
                          With Your Current Membership Plan You Can Active Only{" "}
                          {localStorage.getItem("catalogLimit")} Chemicals Into
                          Your Catalog
                        </h3>
                      </div>
                    </div>
                    <div class="bg-white mx-8 py-3">
                      <button
                        onClick={handleNavigate}
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {notPremium && (
            <div
              class="relative z-10"
              aria-labelledby="modal-title"
              role="dialog"
              aria-modal="true"
            >
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

              <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md py-4">
                    <div class="bg-white py-3">
                      <div class="flex flex-col items-center">
                        <img
                          src={right}
                          alt=""
                          className="h-[120px] border border-black rounded-full p-3"
                        />
                        <h3 className="font-semibold text-xl text-center px-5 mt-4">
                          You Are Not Premium Member
                        </h3>
                      </div>
                    </div>
                    <div class="bg-white mx-8 py-3">
                      <button
                        onClick={handleNavigate}
                        type="button"
                        class="mt-3 inline-flex w-full justify-center rounded-md bg-darkBlue px-3 py-3 text-sm font-medium text-white shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-[100%]"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* active cheemical add form end */}

          {/* Table */}
          <div className="relative" style={{ height: "calc(80vh - 180px)" }}>
            <div className="overflow-y-auto h-full">
              <table
                style={{ border: "none" }}
                className="table-auto w-full border-0 mt-6"
              >
                <tbody>
                  {filteredCatelog &&
                    [...filteredCatelog]
                      ?.filter((e) =>
                        e?.productDetails?.[0]?.name_of_chemical
                          ?.toLowerCase()
                          ?.includes(searchInput?.toLowerCase())
                      )
                      ?.map((item, index) => (
                        <React.Fragment key={index}>
                          <tr
                            className={`flex py-3 ${index % 2 === 0 ? "bg-white" : "bg-gray-100"
                              }`}
                          >
                            <td className="px-2 py-2 sm:text-sm text-xs flex sm:justify-center justify-start items-center font-semibold gap-2">
                              {index + 1}
                              {item.active_chemicals === "active" ? (
                                <span className="border-[5px] border-green-500 rounded-full"></span>
                              ) : (
                                <span className="border-[5px] border-red-500 rounded-full"></span>
                              )}
                            </td>
                            <td className="ps-2 pe-6 py-2 sm:flex flex-col justify-center w-[200px] hidden sm:block">
                              <div className="relative w-full flex justify-center">
                                <div
                                  className="absolute inset-0 bg-center bg-contain bg-no-repeat z-0"
                                  style={{
                                    backgroundImage: `url(${chemicalLogo})`,
                                    opacity: 0.7, // Make background logo semi-transparent
                                  }}
                                ></div>
                                <img
                                  src={item.productDetails?.[0]?.structure}
                                  alt={
                                    item.productDetails?.[0]?.name_of_chemical
                                  }
                                  className={`relative z-10 ${item.productDetails?.[0]?.structure ===
                                      "https://chembizzstorage.blob.core.windows.net/chembizz-files/chembizzchem.png"
                                      ? "w-[60%]"
                                      : "h-[100px]"
                                    }`}
                                />
                                <button
                                  onClick={(event) =>
                                    handleDownload(
                                      item.productDetails?.[0]?.structure,
                                      event
                                    )
                                  }
                                  disabled={downloading}
                                  className="absolute top-0 right-0 bg-gray-200 hover:bg-gray-300 rounded p-1 z-20"
                                  title="Download image"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>

                            <td className=" pe-6 py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="font-semibold sm:text-sm text-xs">
                                  {item.productDetails?.[0]?.name_of_chemical}
                                </h2>
                                <p className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%] sm:w-[200px] w-[120px]">
                                  {item.productDetails?.[0]?.molecularFormula}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  CAS No.
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]">
                                  {item.productDetails?.[0]?.CAS_number}
                                </p>
                              </div>
                            </td>
                            {/* ... existing Grade column ... */}

                            {/* Add Synonyms column */}
                            <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Synonyms Name
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]">
                                  {item.synonyms || "-"}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Sample Lot
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center">
                                  {item?.one_lot_qty}
                                  {item?.one_lot_qty_type} /{" "}
                                  <span className="flex items-center">
                                    <RupeesIcon />
                                    {item.one_lot_qty_price}
                                  </span>
                                </p>
                              </div>
                            </td>
                            <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Category
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[120px] w-[120px]">
                                  {item.category}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Appearance
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]">
                                  {item.productDetails?.[0]?.Appearance}
                                </p>
                              </div>
                            </td>
                            <td className="py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Sub Category
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[220px] w-[120px]">
                                  {item.subcategory === "undefined"
                                    ? "-"
                                    : item.subcategory}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Storage
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]">
                                  {item.productDetails?.[0]?.storage}
                                </p>
                              </div>
                            </td>
                            <td className=" py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Grade
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]">
                                  {!item.grade || item.grade === "undefined"
                                    ? "-"
                                    : Array.isArray(item.grade)
                                      ? item.grade.join(", ")
                                      : item.grade}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Sample Lot
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center">
                                  {item?.one_lot_qty}
                                  {item?.one_lot_qty_type} /{" "}
                                  <span className="flex items-center">
                                    <RupeesIcon />
                                    {item.one_lot_qty_price}
                                  </span>
                                </p>
                              </div>
                            </td>
                            {/* <td className=" py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Price Per Lot</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center'><RupeesIcon />{item.one_lot_qty_price}</p>
                        </div>
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Max Lot</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]'>{item?.max_lot_qty}</p>
                        </div>
                      </td> */}
                            <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Price
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px] flex items-center">
                                  <RupeesIcon />
                                  {item.max_price}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Country Origin / Make
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[170px] w-[120px]">
                                  {item.country_origin}
                                </p>
                              </div>
                            </td>
                            <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Quantity
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]">
                                  {item.qty} {item.qty_type}
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Supply Capacity{" "}
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[170px] w-[120px]">
                                  {item.supply_capacity} Kg/Month
                                </p>
                              </div>
                            </td>
                            <td className="pe-6 py-2 flex flex-col justify-center gap-3">
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">
                                  Purity
                                </h2>
                                <p className="sm:text-[15px] text-xs font-semibold sm:w-[150px] w-[120px]">
                                  {item.purity}%
                                </p>
                              </div>
                              <div>
                                <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]"></h2>
                                <a
                                  href={item.COA}
                                  target="_blamk"
                                  className="text-blue-600 font-semibold underline cursor-pointer sm:text-sm text-xs"
                                >
                                  COA
                                </a>
                              </div>
                            </td>
                            {/* <td className=" py-2 flex flex-col justify-center gap-3">
                        <div>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]">Purity</h2>
                          <p className='sm:text-[15px] text-xs font-semibold sm:w-[100px] w-[50px]'>{item.purity}%</p>
                        </div>
                        <div className='text-blue-500 h-full'>
                          <h2 className="text-[#0A122A]/[.6] sm:text-sm text-xs font-medium tracking-[2%]"></h2>
                          <a href={item.COA} target='_blamk' className="font-semibold underline cursor-pointer sm:text-sm text-xs">COA</a>
                        </div>
                      </td> */}

                            <td
                              className="px-4 py-2 flex sjustify-center items-center font-semibold gap-3 cursor-pointer sm:text-sm text-xs"
                              onClick={() => handleEdit(item)}
                            >
                              Edit <FontAwesomeIcon icon={faPencil} />{" "}
                            </td>
                            <td className="px-4 py-2 flex justify-center items-center font-semibold gap-3 cursor-pointer sm:text-sm text-xs text-red-600 hover:text-red-800">
                              <button
                                onClick={() => handleDelete(item)}
                                className="flex items-center gap-1"
                                title="   Delete Catalog"
                              >
                                Delete <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyCataLog;
