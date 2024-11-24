

export const getOTPTimeout=async(expDate:number)=>{

const currentTimeInSeconds = Math.floor(Date.now() / 1000);  // Date.now() gives milliseconds, so we divide by 1000 to get seconds

// Calculate the remaining time in seconds
const remainingTimeInSeconds = expDate - currentTimeInSeconds;

// Convert the remaining time to minutes
const remainingMinutes = Math.floor(remainingTimeInSeconds / 60);
console.log(remainingTimeInSeconds,remainingMinutes)
return remainingTimeInSeconds
}