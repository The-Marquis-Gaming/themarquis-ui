import './ModalConfirm.css'

interface Modalprops {
    setIsModalOpen: () => void;
    bets : number;
    handleConfirm: () => void;
}

function ModalConfirm(props: Modalprops) {
    const { setIsModalOpen , bets, handleConfirm } = props
    return (
        <div className="container-modal">
            <div className="content-modal">
                <span className='text-3xl'>
                    TOTAL BET
                </span>
                <span className='text-3xl'>{bets} STARK</span>
                <button
                    className="btn-degrade py-3 px-8"
                    onClick={() => {
                        handleConfirm();
                        setIsModalOpen();
                    }}
                >CONFIRM</button>
            </div>
        </div>
    )
}

export default ModalConfirm
