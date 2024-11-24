import { useEffect, useState } from "react";
import { deleteOTPReq, getResetDetails } from "../services/Auth";

export const useCountdownOTPTimeout = (onTimeout?: () => void) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Timer in seconds
  const [isResendSuccess, setIsResendSuccess] = useState(false); // Resend availability
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching expiry

  useEffect(() => {
    const fetchExpiryDetails = async () => {
      try {
        setIsLoading(true);
        const { exp } = await getResetDetails(); // Fetch expiry time
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const remainingTimeInSeconds = exp! - currentTimeInSeconds;

        setTimeLeft(Math.max(remainingTimeInSeconds, 0)); // Prevent negative time
        
      } catch (error) {
        console.error("Error fetching reset details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpiryDetails();
  }, [isResendSuccess]);

  const deleteOTP = async () => {
    setIsResendSuccess(false)
    await deleteOTPReq();
  };
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev !== null ? prev - 1 : 0;
        if (newTime === 0) {
            deleteOTP();
          if (onTimeout) onTimeout(); // Trigger timeout callback
        }
        return Math.max(newTime, 0);
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup timer on unmount
  }, [timeLeft, onTimeout]);

  const formattedTime =
    timeLeft !== null
      ? `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
          timeLeft % 60
        ).padStart(2, "0")}`
      : "00:00";

  return {
    formattedTime,
    timeLeft,
    setIsResendSuccess,
    isLoading,
   
    reset: () => setTimeLeft(null),
  };
};
