import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const handleError = (err: AxiosError) => {
    let message;
    if (axios.isAxiosError(err)) {
        message = err?.response?.data?.message || 'Unknown error';
    } else {
        message = 'Unknown error';
    }
    toast.error(message);
};
