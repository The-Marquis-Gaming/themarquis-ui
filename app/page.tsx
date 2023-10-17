import Image from "next/image";
import Row from "./components/Row/Row";
import DegradeButton from "./components/DegradeButton/DegradeButton";
import ActionButton from "./components/ActionButton/ActionButton";
import PillButton from "./components/PillButton/PillButton";
import "./styles/styles.css";

export default function Home() {
  return (
    <main className="">
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
                <h2 className="text-[56px] font-agencyFb">
                  Experience Traditional casino and betting games like never
                  before
                </h2>
              </div>
            </div>
            <div>
              <div className="flex">
                <div>
                  <h3>Games</h3>
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
                <div className="flex flex-col justify-center item-center">
                  <div>
                    <p className="text-[56px] font-boldfont-['AgencyFB'] leading-7">
                      The Roulette
                    </p>
                    <span>
                      Roulette is a futuristic version of the classic casino
                      game. Players can choose from traditional betting options
                      or use AI-generated bets based on probability
                      distributions and predictive modeling.
                    </span>
                  </div>

                  <DegradeButton size="small"> PLAY NOW</DegradeButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Row>
    </main>
  );
}
