'use client'
import React from 'react'

import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie-player'),{ ssr: false });
// import Loading from '../../../../public/assets/images/loader/Animation - 1745566403338.json'
import Loading from '../../../../public/assets/images/loader/loading.json'
;

const Loader = ({ isInside }: { isInside?: boolean }) => {
    return (
        <>
            {isInside ? (
                <div className='d-flex justify-content-center align-items-center'
                    style={{ scale: 0.3 }}
                >
                    <Lottie
                        loop
                        animationData={Loading}
                        play
                        className='flex justify-center item-center'
                    />
                </div>
            ) : (
                <div className="fixed inset-0 flex justify-center items-center bg-white/50 z-50">
                    <div className='justify-conten-center align-items-center' style={{ scale: 0.3 }}>
                        <Lottie loop animationData={Loading} play />
                    </div>
                </div>
            )}
        </>
    )
}

export default Loader
