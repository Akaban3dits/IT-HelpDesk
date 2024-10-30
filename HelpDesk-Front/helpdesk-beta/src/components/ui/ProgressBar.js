import React from 'react';

const ProgressBar = ({ steps, currentStep }) => {
    return (
        <div className="w-full py-4 px-2 sm:px-0 my-4"> {/* Agregado margen vertical */}
            <div className="flex items-center justify-between mx-4"> {/* Agregado margen horizontal */}
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center relative mx-2"> {/* Margen lateral adicional */}
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-base font-medium
                                ${index <= currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                {index + 1}
                            </div>
                            <div className="text-xs sm:text-sm mt-2 absolute -bottom-6 w-max text-center">
                                <span className={`${index <= currentStep ? 'text-indigo-600' : 'text-gray-500'} 
                                    hidden sm:inline`}>
                                    {step}
                                </span>
                                <span className={`${index <= currentStep ? 'text-indigo-600' : 'text-gray-500'} 
                                    sm:hidden`}>
                                    {step.split(' ')[0]}
                                </span>
                            </div>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-grow h-0.5 mx-1 sm:mx-2 ${index < currentStep ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;
