import React from 'react'
import Lottie from "react-lottie-player";
import Loading from '../../../../public/assets/images/loader/Animation - 1745566403338.json'
import loaderStyle from "./loader.module.scss";

const Loader = ({ isInside }: { isInside?: boolean }) => {
    return (
        <>
            {isInside ? (
                <div className='d-flex justify-content-center align-items-center'
                    style={{ scale: 0.2 }}
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
                    <div className='justify-conten-center align-items-center' style={{ scale: 0.2 }}>
                        <Lottie loop animationData={Loading} play />
                    </div>
                </div>
            )}
        </>
    )
}

export default Loader