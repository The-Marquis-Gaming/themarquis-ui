import React, { ReactElement } from "react";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LinkProps } from "next/link";
import "./DropDownMenu.css";

interface DropDownMenuProps {
  title: string;
  children: ReactElement<LinkProps>[];
}

const DropdownMenu: React.FC<DropDownMenuProps> = ({ title, children }) => {
  return (
    <div className="relative group mr-10">
      <div className="title-dropdownMenu">
        <button className="text-[#848895] hover:text-gray-200">
          <span>{title}</span>
          <span className="ml-2">
            <FontAwesomeIcon icon={faAngleDown} />
          </span>
        </button>
      </div>

      <div className="absolute hidden left-0 w-48 py-2 bg-black text-white group-hover:block border-2 border-slate-600">
        <div className="flex flex-col ml-2 text-[#848895]">
          {children.map((link, index) => {
            return (
              <span key={index} className="hover:text-white">
                {link}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DropdownMenu;
