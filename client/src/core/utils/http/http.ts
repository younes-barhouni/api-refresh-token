type CallbackType = (response: any, error?: string | null) => void;
type RequestInterface = RequestInit | undefined;
type RequestHeaders = HeadersInit;

const retrieve = (
  url: string,
  request: RequestInterface,
  callback: CallbackType
) => {
  fetch(url, request)
    .then((raw) => raw.json())
    .then((response) => callback(response)) // Verbose closure for readability
    .catch((error) => callback(null, error));
};

const request = (
  method: string,
  headers = {},
  body: any = null
): RequestInterface => {
  const retrieveDataObject: RequestInterface = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  body && (retrieveDataObject['body'] = JSON.stringify(body));

  return retrieveDataObject;
};

export const http = (method: string, headers?: RequestHeaders, body?: any) => {
  return (url: string, callback: CallbackType) => {
    retrieve(url, request(method, headers, body), callback);
  };
};
