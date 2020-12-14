import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios';
function CountDown({ countDown, pID }) {

    // Youtube link for Count Down
    // https://www.youtube.com/watch?v=ZVOGPvo08zM

    const [timerDays, setTimerDays] = useState("00");
    const [timerHours, setTimerHours] = useState("00");
    const [timerMinutes, setTimerMinutes] = useState("00");
    const [timerSeconds, setTimerSeconds] = useState("00");
    const [isChecked, setIsChecked] = useState(false);
    let intervel = useRef();

    const startTimer = () => {
        const countDownDate = new Date(countDown).getTime();

        intervel = setInterval(async () => {
            const now = new Date().getTime();
            const distance = countDownDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (distance < 0) {
                // stop timer
                clearInterval(intervel.current);
                // run the finished auction once if it already runs then donot run again
                if (isChecked === false) {
                    setIsChecked(true);
                    await axios.put('/api/admin/check-is-auction-finish', { pID })
                        .then(res => {
                            console.log("Auction Finished successfully" + res.data.msg);
                        }).catch(error => {
                            console.log("Error! while finihing the auction" + error.response.data.msg);
                        });
                }

            } else {
                setTimerDays(days);
                setTimerHours(hours);
                setTimerMinutes(minutes);
                setTimerSeconds(seconds);
            }
        }, 1000);
    }

    // component did unmount
    useEffect(() => {
        startTimer();
        return () => {
            clearInterval(intervel);
        }
    });

    return <div className="modern-countdown countdown">
        {timerDays}d : {timerHours}h : {timerMinutes}m : {timerSeconds}s
    </div>
}
export default CountDown;