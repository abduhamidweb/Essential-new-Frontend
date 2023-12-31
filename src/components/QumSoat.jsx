import React, { useState, useEffect } from 'react';

const QumSoat = ({ initialTime = 30 }) => {
    const [seconds, setSeconds] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        if (isRunning && seconds > 0) {
            const interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else if (seconds === 0) {
            setIsRunning(false);
        }
    }, [isRunning, seconds]);

    useEffect(() => {
        if (seconds === 0) {
            setIsRunning(false);
        }
    }, [seconds]);

    // Aylantirilgan sekundlarni minut va sekundlarga bo'lish
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        <div >
            <div >
                <strong>minut:</strong>  {minutes} <strong>second:</strong> {remainingSeconds} 
            </div>
        </div>
    );
};

export default QumSoat;
