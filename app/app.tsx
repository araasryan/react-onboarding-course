import * as React from 'react';
import { HashRouter } from 'react-router-dom';

import { Stack, Text } from '@servicetitan/design-system';

export const App: React.FC = () => (
    <React.StrictMode>
        <HashRouter>
            <Stack alignItems="center" justifyContent="center" className="flex-auto">
                <Text size={5}>React Onboarding Practice Course Template</Text>
            </Stack>
        </HashRouter>
    </React.StrictMode>
);
