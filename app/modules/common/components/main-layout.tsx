import * as React from 'react';
import { Stack, SideNav, Page } from '@servicetitan/design-system';
import { SideNavLinkItem } from './sidenav-link-item';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { AppStore } from '../stores/app.store';
import { Confirm } from './confirm';

export const MainLayout: React.FC = observer(props => {
    const [appStore] = useDependencies(AppStore);

    function logOut() {
        appStore.removeAuthUser();
    }

    return (
        <Stack spacing="2" alignment="fill" className="h-100">
            <Stack.Item alignSelf="flex-start">
                <SideNav title="REACT ONBOARDING PRACTICE COURSE">
                    <SideNavLinkItem pathname="/users">Users</SideNavLinkItem>
                    <SideNavLinkItem pathname="/feed">News Feed</SideNavLinkItem>
                    <Confirm onConfirm={logOut}>
                        {onClick => (
                            <SideNav.Item className="m-t-4" onClick={onClick}>
                                Log out
                            </SideNav.Item>
                        )}
                    </Confirm>
                </SideNav>
            </Stack.Item>
            <Stack.Item fill alignSelf="stretch" className="d-f">
                <Page>{props.children}</Page>
            </Stack.Item>
        </Stack>
    );
});
