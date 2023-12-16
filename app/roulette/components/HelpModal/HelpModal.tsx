import { data, Data } from './data'
import DegradeButton from '@/app/components/DegradeButton/DegradeButton';
import { useState } from 'react';
import './HelpModal.css'

interface Modalprops {
    setIsModalHelp: () => void;
}

function HelpModal({ setIsModalHelp }: Modalprops) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentContent: Data = data[currentIndex]

    const handleButtonClick = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
            setIsModalHelp();
        }
    };
    return (


        <div className="container-help-modal"
            style={{ bottom: currentContent.bottom, left: currentContent.left }}>
            <div>
                <span>{currentIndex + 1}. </span>
                <span>{currentContent.text}</span>
            </div>
            <div className='flex justify-end'>
                <DegradeButton
                    onClick={() => { handleButtonClick() }}
                >{currentIndex < data.length - 1 ? 'NEXT' : 'FINISH'}</DegradeButton>
            </div>
        </div>

    )
}

export default HelpModal
