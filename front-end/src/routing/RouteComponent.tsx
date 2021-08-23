import { Route, Switch } from "react-router-dom";
import Home from '../components/home/Home';
import Host from '../components/host/Host';
import Join from '../components/join/Join';
import SongList from '../components/songList/SongList';
import NotFound from '../components/notFound/NotFound';
import React from 'react';

const RouteComponent = () => {
    return (
        <Switch>
            <Route exact path="/"><Home/></Route>
            <Route exact path="/host/:sessionName" render={(props) => (
                <Host sessionName={props.match.params.sessionName}/>
            )}/>
            <Route exact path="/join/:sessionName" render={(props) => (
                <Join sessionName={props.match.params.sessionName}/>
            )}/>
            <Route path="/songs"><SongList/></Route>
            <Route path="*">
                <NotFound/>
            </Route>
        </Switch>
    )
}

export default RouteComponent
