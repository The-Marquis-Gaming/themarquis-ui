import Image from "next/image";
import Row from "./components/Row/Row";
import DegradeButton from "./components/DegradeButton/DegradeButton";
import ActionButton from "./components/ActionButton/ActionButton";
import PillButton from "./components/PillButton/PillButton";
import "./styles/styles.css";
import ServiceContainer from "./components/ServiceContainer/ServiceContainer";
import Footer from "./components/Footer/Footer";
import ImageCarousel from "./components/ImageCarousel/ImageCarousel";
import {images} from '../app/data'

export default function Home() {
  return (
    <main className="nav-position ">
      <Row>
        <section className="flex justify-center">
          <div className="background-contain h-auto">
            <div className="flex justify-between px-40">
              <div className=" flex justify-center flex-col">
                <h1 className="text-[96px] font-agencyFb max-w-[700px] spacing-title">
                  Experiencie the Future of Online Betting
                </h1>
                <p className="text-[24px]">
                  A Revolutionary On-Chain Gambling System Powered by Starknet
                </p>
                <div className="py-10">
                  <DegradeButton size="large">CONNECT WALLET</DegradeButton>
                  <PillButton documentUrl="">READ DOCS</PillButton>
                </div>
                <div className="h-130">
                  <Image
                    src="/images/logo.png"
                    alt="Descripción de la imagen"
                    width={238}
                    height={130}
                  />
                </div>
              </div>
              <div className="">
                <Image
                  src="/images/cards.png"
                  alt="Descripción de la imagen"
                  width={537}
                  height={634}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-center">
          <div className="container-games flex items-center justify-center flex-col">
            <div>
              <div>
                <h2 className="text-[56px] font-agencyFb   font-bold">
                  Experience Traditional casino and betting games like never
                  before
                </h2>
              </div>
            </div>
            <div>
              <div className="flex justify-between p-5">
                <div>
                  <h3 className=" text-[39px] font-['Helvetica']">Games</h3>
                </div>

                <div>
                  <ActionButton>Classic </ActionButton>
                  <ActionButton> Comming soon</ActionButton>
                </div>
              </div>
              <div className="flex bg-dark-gray w-[1100px] h-[400px] rounded-r-lg ">
                <Image
                  src="/images/roulette.png"
                  alt="Descripción de la imagen"
                  width={550}
                  height={400}
                />
                <div className="flex flex-col justify-center item-center p-[48px]">
                  <div className="">
                    <p className="text-[56px] font-bold font-agencyFb">
                      The Roulette
                    </p>
                    <span className="w-[439px font-['Helvetica']">
                      Roulette is a futuristic version of the classic casino
                      game. Players can choose from traditional betting options
                      or use AI-generated bets based on probability
                      distributions and predictive modeling.
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <div>
                      <DegradeButton size="small"> PLAY NOW</DegradeButton>
                    </div>
                  </div>
                </div>
              </div>
              <ImageCarousel images={images}></ImageCarousel>
            </div>
          </div>
        </section>
        <section className="flex justify-center">
          <div className="flex items-center justify-center flex-col container-information">
            <div className="my-12 mx-6 content-title">
              <h2 className="text-[56px] font-agencyFb font-bold">
                Why The Marquis?
              </h2>
              <p className="text-[24px]">
                With our cutting-edge on-chain gambling system. Leveraging the power of Starknet, we provide a secure, transparent, and high-liquidity platform for those seeking a medium-risk revenue source.
              </p>
            </div>
            <ServiceContainer />
          </div>
        </section>
        <section className="flex justify-center">
          <div className="container-communitystatistics">
            <div className="container-comunity">
              <h2 className="text-[56px] font-agencyFb font-bold">Join The Marquis community today</h2>
              <div className="container-card">
                <div className="content-comunity">
                  <span className="text-[37px] text-[#F087FF]">11,000</span>
                  <span className="text-xs text-[#BABABA]">ACTIVE USERS LAST MONTH</span>
                </div>
                <div className="container-image">
                </div>
                <div className=" content-comunity">
                  <span className="text-[37px] text-[#FFEB3B]">3,800</span>
                  <span className="text-xs text-[#BABABA]">DISCORD MEMBERS</span>
                </div>
                <div className="container-image2"></div>
                <div className=" content-comunity">
                  <span className="text-[37px] text-[#19FB9B]">48,000</span>
                  <span className="text-xs text-[#BABABA]">ACTIVE USERS IN TOTAL</span>
                </div>
                <div className="container-image3"></div>
              </div>
            </div>
            <div className="container-number flex flex-col">
              <div className="flex flex-col">
                <div className=" gradient-text">
                  11k
                </div>
                <span className="text-[#C4C4C4]">AVERAGE VOLUME PER DAY</span>
              </div>
              <div className="flex flex-col">
                <div className="gradient-text2 gradient-text">21.3k</div>
                <span className="text-[#C4C4C4]">AVERAGE VOLUME PER MONTH</span>
              </div>
              <div className="flex flex-col">
                <div className="gradient-text3 gradient-text">$10k</div>
                <span className="text-[#C4C4C4]">TOTAL VALUE LOCKED</span>
              </div>
            </div>
          </div>
        </section>
        <section className="flex justify-center">
            <div className="flex justify-center flex-col items-center container-buttongame">
              <h2 className="text-[56px] font-agencyFb font-bold m-6">Start playing now and discover the future of on-chain gambling!</h2>
              <DegradeButton>START PLAYING</DegradeButton>
            </div>
        </section>
        <section className="flex justify-center">
          <Footer></Footer>
        </section>
      </Row>
    </main>
  );
}
