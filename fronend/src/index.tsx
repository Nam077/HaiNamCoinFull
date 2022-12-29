import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { registerLicense } from '@syncfusion/ej2-base';
import { ContextProvider } from './contexts/ContextProvider';
// @ts-ignore
registerLicense(
    'Mgo+DSMBaFt/QHRqVVhjVFpFdEBBXHxAd1p/VWJYdVt5flBPcDwsT3RfQF9iS3xbd0ViWXxbcHFSQQ==;Mgo+DSMBPh8sVXJ0S0J+XE9HflRDX3xKf0x/TGpQb19xflBPallYVBYiSV9jS3xSdEdrWH9fcHdQRmddVg==;ORg4AjUWIQA/Gnt2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0dhUX5ecXRWQ2BUV0M=;ODMxMTE4QDMyMzAyZTM0MmUzMFU3MlYxSzNqK0JKa2RxbkJ3d0ttZGM1UkVkM1BRZ1RFa0QyODkvYkhZQjQ9;ODMxMTE5QDMyMzAyZTM0MmUzMEZTZDh5K2xSRmFMQUJXTVQ3RHIyRFRWQ216K0gyaWsyUE5ocHRYVXVWLzg9;NRAiBiAaIQQuGjN/V0Z+WE9EaFxKVmJLYVB3WmpQdldgdVRMZVVbQX9PIiBoS35RdERhW3dfcHVVRWVdV0dx;ODMxMTIxQDMyMzAyZTM0MmUzMEhDNWw0V2krMUQwUW1hWGd5NUlRTXhOTFdIZURmaEJZN1NVL1dldzJnRlE9;ODMxMTIyQDMyMzAyZTM0MmUzMEZ2aXIrcXBWM3ZpSUZFbnBENmF4aUVDdlIyMFVyWUFtS3B0clVjdVJEbkE9;Mgo+DSMBMAY9C3t2VVhkQlFadVdJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRd0dhUX5ecXRWQ2JYUkM=;ODMxMTI0QDMyMzAyZTM0MmUzMFlqS1I2MjgyWWVaV2ZZZ2krQlc4UncyNm5EY0NUM3ltRjVBT2VCQVBDN009;ODMxMTI1QDMyMzAyZTM0MmUzMGcwaHpUQkZEbEhhWE1UZGV4NHpJeDgyelpYZFRmeUVtZWhiM3kxVER5RDA9;ODMxMTI2QDMyMzAyZTM0MmUzMEhDNWw0V2krMUQwUW1hWGd5NUlRTXhOTFdIZURmaEJZN1NVL1dldzJnRlE9',
);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); //
root.render(
    <React.StrictMode>
        <ContextProvider>
            <App />
        </ContextProvider>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
