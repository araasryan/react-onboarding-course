import * as React from 'react';
import { Text, Stack } from '@servicetitan/design-system';
import { ErrorBox } from '../../common/components/error-box';

interface IAuthLayout {
    title: string;
    error?: string;
}

export const AuthLayout: React.FC<IAuthLayout> = ({ children, title, error }) => {
    return (
        <Stack alignItems="center" justifyContent="center" className="flex-auto">
            <div style={{ width: '400px' }}>
                <Text size={4} className="ta-center m-b-4">
                    {title}
                </Text>
                <ErrorBox error={error} />
                {children}
            </div>
        </Stack>
    );
};
