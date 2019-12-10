import { AxiosResponse } from 'axios';

export const mockResponse = async <T>(
    data: T,
    status: number,
    statusText = 'ok'
): Promise<AxiosResponse<T>> => {
    return {
        data,
        status,
        statusText,
        headers: [],
        config: {}
    };
};
