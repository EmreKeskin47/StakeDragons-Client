export function getTimeRemaining(finishDate) {
    const endtime = finishDate
    const now = new Date()

    if (endtime < now) return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    }

    const total = endtime - now;
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
}

export const formatTimeLeft = (timeLeft) => {
    let st = '';
    if (timeLeft === undefined) return '';
    if (timeLeft.days > 0) st += timeLeft.days + " Days "
    if (timeLeft.hours >= 0) st += timeLeft.hours + " Hours "
    if (timeLeft.minutes >= 0) st += timeLeft.minutes + " Minutes "
    if (timeLeft.seconds >= 0) st += timeLeft.seconds + " Seconds "
    return st;
}