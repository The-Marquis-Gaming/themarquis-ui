import "./Row.css";
import { ReactNode } from "react";

interface RowProps {
  children: ReactNode;
}

const Row = ({ children }: RowProps) => {
  return <div className="row_max">{children}</div>;
};

export default Row;
