import { IHttpRequestMethods } from "n8n-workflow";

export type RequestDetails = {
    method: IHttpRequestMethods;
    url: string;
};