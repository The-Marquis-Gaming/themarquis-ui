import React, { useState, useEffect } from "react";

interface CountDownProps {
    defaultNumber: number;
    animationTimming: number;
    startCounter: boolean;
    onComplete?: () => void;
}

const CountDown: React.FC<CountDownProps> = ({
                                                 defaultNumber,
                                                 animationTimming,
                                                 startCounter,
                                                 onComplete = () => {},
                                             }) => {
    const [count, setCount] = useState(defaultNumber);

    useEffect(() => {
        if (startCounter) {
            setTimeout(() => {
                if (count > 0) {
                    setCount(count - 1);
                }

                if (count === 0) {
                    onComplete();
                }
            }, animationTimming / defaultNumber);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, startCounter, animationTimming]);

    useEffect(() => {
        setCount(defaultNumber);
    }, [defaultNumber]);

    return (
        <div>
            <span>{count} USDM</span>
        </div>
    );
};

export default CountDown;
