import * as React from 'react';
import { Text, Stack, Page } from '@servicetitan/design-system';
import { ErrorBox } from '../../common/components/error-box';
import * as Styles from './auth-layout.less';

interface IAuthLayout {
    title: string;
    error?: string;
}

export const AuthLayout: React.FC<IAuthLayout> = ({ children, title, error }) => {
    console.log(Styles.authFixedWidth);
    return (
        <Stack alignItems="center" justifyContent="center" className="flex-auto">
            <Page backgroundColor="white" className={Styles.authFixedWidth}>
                <Text size={4} className="ta-center m-b-4">
                    {title}
                </Text>
                <ErrorBox error={error} />
                {children}
            </Page>
        </Stack>
    );
};
