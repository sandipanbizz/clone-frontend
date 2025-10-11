import React, { useRef, useState } from 'react';
import buyChemical from "../images/buy-chemical.png"
import { useNavigate } from 'react-router-dom';
import RupeesIcon from '../assets/Rupees';
import chemicalLogo from "../images/anbizz-logo.png";

const Buycard = ({ dataArray }) => {
    const navigate = useNavigate();
    const [downloading, setDownloading] = useState(false);

    const handleNavigate = (id) => {
        const token = localStorage.getItem("chemicalToken")
        if (token) {
            navigate(`/company/product-detail-and-suppliers/${id}`);
        } else {
            navigate(`/login`);
        }
    }

    const handleDownload = async (structureImg, e) => {
        e.stopPropagation();
        setDownloading(true);
        
        try {
            // Create a canvas to combine the images
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Load both images
            const backgroundImg = new Image();
            backgroundImg.crossOrigin = "Anonymous";
            backgroundImg.src = chemicalLogo;
            
            const foregroundImg = new Image();
            foregroundImg.crossOrigin = "Anonymous";
            foregroundImg.src = structureImg;
            
            // Wait for both images to load
            await Promise.all([
                new Promise(resolve => { backgroundImg.onload = resolve; }),
                new Promise(resolve => { foregroundImg.onload = resolve; })
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
                ctx.drawImage(backgroundImg, (foregroundImg.width - bgWidth) / 2, 0, bgWidth, bgHeight);
            } else {
                // Background is taller relative to its width than foreground
                const bgWidth = foregroundImg.width;
                const bgHeight = bgWidth / bgAspect;
                ctx.drawImage(backgroundImg, 0, (foregroundImg.height - bgHeight) / 2, bgWidth, bgHeight);
            }
            
            // Draw the chemical structure image on top
            ctx.drawImage(foregroundImg, 0, 0);
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'chemical-with-logo.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error downloading image:', error);
        }
        
        setDownloading(false);
    };

    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {dataArray && dataArray.map((e, index) => (
                    <div key={index}>
                        <div className='rounded-lg bg-white px-4 py-3 shadow h-full'>
                            <div className='flex flex-col h-full items-center'>
                                <div className="relative w-full flex justify-center">
                                    <div 
                                        className="absolute inset-0 bg-center bg-contain bg-no-repeat z-0"
                                        style={{ 
                                            backgroundImage: `url(${chemicalLogo})`,
                                            opacity: 0.8 ,
                                        }}
                                    ></div>
                                    <img
                                        src={e.structure}
                                        alt={e.name_of_chemical}
                                        className={`relative z-10 ${e.structure === "https://chembizzstorage.blob.core.windows.net/chembizz-files/chembizzchem.png" ? 'w-[70%]' : ''}`}
                                    />
                                    <button 
                                        onClick={(event) => handleDownload(e.structure, event)}
                                        disabled={downloading}
                                        className="absolute top-0 right-0 bg-gray-200 hover:bg-gray-300 rounded p-1 z-20"
                                        title="Download image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='flex justify-between pt-3'>
                                    <h3 className='font-medium text-xl'>{e.name_of_chemical?.slice(0, 15)}</h3>
                                    {e.verified == false && <img className='w-[25px] h-[25px]' src="https://chembizzstorage.blob.core.windows.net/chembizz-files/unverify_selected_logo.png" alt="" />}
                                    
                                </div>
                                <div className='md:flex block justify-between mt-2 mb-4'>
                                    <div>
                                        <p className='text-slate-400'>CAS No:</p>
                                        <p className='font-medium'>{e.CAS_number}</p>
                                    </div>
                                    <div>
                                        <p className='text-slate-400'>Price </p>
                                        {e.catalog?.[0]?.min_price ? (
                                            <>
                                                <p className='font-medium flex items-center'><RupeesIcon /> {e.catalog?.[0]?.min_price} - <RupeesIcon /> {e.catalog?.[0]?.max_price}</p>
                                            </>
                                        ) : (
                                            <p className='font-medium flex items-center'>-</p>
                                        )}
                                    </div>
                                </div>
                                <button className='bg-darkBlue text-white text-sm mt-auto px-4 py-2 rounded-lg w-full' onClick={() => handleNavigate(e._id)}>Inquiry Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Buycard