import * as React from 'react';
import { Banner } from '@servicetitan/design-system';

interface IErrorBox {
    error?: string;
}

export const ErrorBox: React.FC<IErrorBox> = ({ error, ...props }) => {
    if (!error) {
        return null;
    }

    return <Banner status="critical" className="m-t-2 m-b-3" title={error} {...props} />;
};
