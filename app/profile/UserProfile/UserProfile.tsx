import Image from "next/image"
import './UserProfile.css'

function UserProfile() {
    const gamesWon = [];
    for (let i = 0; i < 23; i++) {
        gamesWon.push(i);
    }

    const gamesLost = [];
    for (let i = 0; i < 12; i++) {
        gamesLost.push(i);
    }
    return (
        <section className="container-profile">
            <div className="flex items-center gap-44 my-6">
                <div className="flex gap-8">
                    <div className="container">
                        <div className="hexagono">
                            {/* <Image src="/images/mama.jpg" alt="user" width={250} height={250}></Image> */}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        <span className="text-2xl font-bold">Ng Yi Xuan</span>
                        <span className="text-lg">1Lbcfr7sAHTD9CgdQo3H...</span>
                        <span className="text-lg">Kuala Lumpur, Malaysia</span>
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end">
                    <div className="flex gap-2">
                        <Image src="/images/eth.png" alt="eth" width={28} height={28}></Image>
                        <span className="text-4xl">0.00043 ETH</span>
                    </div>
                    <span className="text-[#C7C7C7]">Total amount earned</span>
                </div>
            </div>
            <div className="flex gap-24 font-roboto">
                <div className="results-container">
                    <Image src="/images/win.png" alt="win" width={80} height={80}></Image>
                    <span className="text-4xl">{gamesWon.length}</span>
                    <span className="text-2xl">Games won</span>
                </div>
                <div className="results-container">
                    <Image src="/images/lost.png" alt="win" width={80} height={80}></Image>
                    <span className="text-4xl">{gamesLost.length}</span>
                    <span className="text-2xl">Games lost</span>
                </div>
            </div>
        </section>
    )
}

export default UserProfile
