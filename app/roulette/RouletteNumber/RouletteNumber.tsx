import React from "react";
import styles from './RouletteNumber.module.css'

interface NumberComponentProps {
    numbers: number[];
    coloredNumbers: number[];
  }
  
  const RouletteNumber: React.FC<NumberComponentProps> = ({ numbers, coloredNumbers }) => {
    
    return (
        <div className={styles.table}>
            {numbers.map((number, index) => (
              <div key={index} className={coloredNumbers.includes(number) ? styles.coloredNumber : styles.number}>{number}</div>
            ))}
        </div>
    )
}

export default RouletteNumber
