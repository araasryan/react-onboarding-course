import * as React from 'react';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom';
import { configure } from 'mobx';

import { RegisterPage } from './modules/auth/components/register-page';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { UserContext } from './modules/common/mocks/users.db';
import { AuthApi } from './modules/auth/api/auth.api';
import { observer } from 'mobx-react';
import { AppStore } from './modules/common/stores/app.store';
import { LoginPage } from './modules/auth/components/login-page';
import { UsersGridPage } from './modules/users/components/users-grid-page';
import { NewsFeedPage } from './modules/news-feed/components/news-feed-page';

configure({ enforceActions: 'observed' });

export const App: React.FC = provide({
    singletons: [UserContext, AuthApi, AppStore]
})(
    observer(() => {
        const [{ isAuthenticated }] = useDependencies(AppStore);

        return (
            <React.StrictMode>
                <HashRouter>
                    {isAuthenticated ? <AuthenticatedRoutes /> : <NotAuthenticatedRoutes />}
                </HashRouter>
            </React.StrictMode>
        );
    })
);

const AuthenticatedRoutes: React.FC = function() {
    return (
        <Switch>
            <Route exact path="/users" component={UsersGridPage} />
            <Route exact path="/feed" component={NewsFeedPage} />
            <Redirect to="/users" />
        </Switch>
    );
};

const NotAuthenticatedRoutes: React.FC = function() {
    return (
        <Switch>
            <Route exact path="/" component={RegisterPage} />
            <Route exact path="/login" component={LoginPage} />
            <Redirect to="/" />
        </Switch>
    );
};
