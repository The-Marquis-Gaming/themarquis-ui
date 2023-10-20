import './Footer.css';
import Image from 'next/image';

function Footer() {
    return (
        <div className="flex justify-center gap-12 py-20">
            <span>Managed by The Marquis</span>
            <span className="text-[#848895] text-font">©2023 The marquis. All rights reserved.</span>
            <span className="text-[#848895] flex gap-2 text-font">
            <Image alt="svg-world" src="/images/icon-world.png" width={22} height={20}></Image>EN</span>
        </div>
    )
}

export default Footer
