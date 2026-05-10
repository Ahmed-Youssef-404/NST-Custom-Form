import { finalSend } from "@/services/finalSend.service";
import { useState } from "react";

export const useHandlePayload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const sendRequest = async (data: any) => {
        try {
            setIsLoading(true);
            // await finalSend(data);
            console.log(data)
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return { sendRequest, isLoading, error, isSuccess };
};