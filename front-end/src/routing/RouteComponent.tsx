import { Route, Switch } from 'react-router-dom';
import Home from '../components/home/Home';
import Host from '../components/host/Host';
import Join from '../components/join/Join';
import NotFound from '../components/notFound/NotFound';
import React from 'react';

const RouteComponent = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/host/:sessionName">
                <Host />
            </Route>
            <Route exact path="/join/:sessionName">
                <Join />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default RouteComponent;
