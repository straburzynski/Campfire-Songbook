import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const handleError = (err: AxiosError | Error) => {
    const DEFAULT_MESSAGE = 'Unknown error';
    let message;
    if (axios.isAxiosError(err)) {
        message = err?.response?.data?.message || err?.message || DEFAULT_MESSAGE;
    } else {
        message = DEFAULT_MESSAGE;
    }
    toast.error(message);
};
