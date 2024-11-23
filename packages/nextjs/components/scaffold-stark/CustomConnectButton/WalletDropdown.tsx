import Image from 'next/image';
import { Connector, useConnect } from '@starknet-react/core';
import React, { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { burnerAccounts } from '~~/utils/devnetAccounts';
import { BurnerConnector } from '~~/services/web3/stark-burner/BurnerConnector';
import { useTheme } from 'next-themes';
import ConnectWalletIcon from '@/public/landingpage/connectWalletIcon.svg';
import wallet_dropdownIcon from '@/public/wallet_dropdownIcon.svg';
import back_walletIcon from '@/public/back_walletIcon.svg';
import deposit_walletIcon from '@/public/deposit_walletIcon.svg';

const loader = ({ src }: { src: string }) => {
  return src;
};

const WalletButton = ({
  connector,
  handleConnectWallet,
  loader,
}: {
  connector: Connector;
  handleConnectWallet: (e: React.MouseEvent<HTMLButtonElement>, connector: Connector) => void;
  loader: ({ src }: { src: string }) => string;
}) => {
  return (
    <button
      onClick={(e) => handleConnectWallet(e, connector)}
      className="relative bg-[#21262B] rounded-[8px] w-full px-[35px] py-[23px] pr-[15px] flex items-center group hover:bg-[#2A3036] transition-colors"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-[60px]">
          <Image
            loader={loader}
            src={connector.icon?.dark || connector.icon?.light || ''}
            alt={connector.name}
            width={37}
            height={37}
          />
          <span className="text-[#E6E6E6] text-[20px]">{connector.name}</span>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[#6D7682] text-[20px]">Connect →</span>
        </div>
      </div>
    </button>
  );
};

const address = '0x1230....D301';

const balances = [
  { symbol: 'STRK', amount: '100.76', icon: '/logo-starknet.svg' },
  { symbol: 'ETH', amount: '0.05', icon: '/logo-eth.svg' },
  { symbol: 'USDC', amount: '0.00', icon: '/usdc.svg' },
];

const WalletDropdown = () => {
  const { connectors, connect } = useConnect();
  const [shuffledConnectors, setShuffledConnectors] = useState<Connector[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lastConnector, setLastConnector] = useLocalStorage<{
    id: string;
    ix?: number;
  }>(
    'lastUsedConnector',
    { id: '' },
    {
      initializeWithValue: false,
    }
  );

  function handleConnectWallet(e: React.MouseEvent<HTMLButtonElement>, connector: Connector): void {
    if (connector.id === 'burner-wallet') {
      return;
    }

    connect({ connector });
    setLastConnector({ id: connector.id });
    handleClose();
  }

  const handleClose = () => {
    setIsOpen(false);
    const dropdownElement = dropdownRef.current?.querySelector('.dropdown-content');
    if (dropdownElement) {
      (dropdownElement as HTMLElement).style.display = 'none';
      setTimeout(() => {
        if (dropdownElement) {
          (dropdownElement as HTMLElement).style.display = '';
        }
      }, 100);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const newArray = [...connectors];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setShuffledConnectors(newArray);
  }, [connectors]);

  useEffect(() => {
    if (lastConnector?.id) {
      const connector = connectors.find((connector) => connector.id === lastConnector.id);
      if (connector) {
        if (lastConnector.id === 'burner-wallet' && lastConnector.ix !== undefined) {
          (connector as BurnerConnector).burnerAccount = burnerAccounts[lastConnector.ix];
        }
        connect({ connector });
      }
    }
  }, [lastConnector, connectors, connect]);

  return (
    <div className="dropdown dropdown-end" ref={dropdownRef}>
      <button
        type="button"
        className="hidden connect-btn md:flex h-[50px] gap-3 items-center cursor-pointer whitespace-nowrap"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image src={ConnectWalletIcon} alt="icon" />
        <span className="text-[20px]">Connect Wallet</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-8  origin-top-right">
          <div className="dropdown-content bg-[#171C20] rounded-[15px] shadow-xl border border-[#5C5C5C]  w-[400px] ">
            {/* Original Header with X button */}
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Image src={wallet_dropdownIcon} alt="wallet icon" />
                <span className=" text-white font-monserrat font-bold">Wallet</span>
              </div>
              <button
                className="text-[#FFFFFF] hover:text-gray-400 transition-colors w-8 h-8 flex items-center font-bold  justify-center"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClose();
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal-styled content */}
            <div className="py-[40px] px-[52px] flex flex-col gap-[40px]">
              <div className="w-full font-monserrat flex flex-col items-center">
                <h2 className="text-center text-[20px] font-valorant mb-5">{address}</h2>
                <button className="w-[118px] bg-cyan-400 hover:bg-cyan-500 text-black font-medium py-2 rounded-md mb-4 transition-colors flex items-center justify-center gap-2">
                  <Image src={deposit_walletIcon} alt="icon" />
                  <span>Deposit</span>
                </button>
              </div>

              <div className="p-3 bg-[#21262B] rounded-xl ">
                <div className="rounded-lg   ">
                  <div className="bg-[#2E353C] rounded-lg p-3 mb-4 hover:bg-[#2A3036] transition-colors ">
                    <div className="flex items-center justify-center text-white mb-2 text-[16px] font-Arial font-bold">
                      Balance
                    </div>

                    {balances.map((balance, index) => (
                      <div key={index} className="flex justify-between items-center mb-2 last:mb-0">
                        <div>
                          {balance.icon.startsWith('/') ? (
                            <Image src={balance.icon} alt={balance.symbol} width={24} height={24} />
                          ) : (
                            <span className="text-xl">{balance.icon}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-gray-100">{balance.amount} </span>
                          <span className="text-gray-400">{balance.symbol}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full bg-[#2E353C] hover:bg-[#2E353C] text-white font-medium py-2 rounded-md mb-4 transition-colors">
                    <span className="flex ml-2  gap-2">
                      <Image src={back_walletIcon} alt={'icon'} />
                      Disconnect
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletDropdown;
