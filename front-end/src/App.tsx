import React from 'react';
import { Route, Switch } from "react-router-dom";
import './index.css'
import SongList from './components/songList/SongList';
import Home from './components/home/Home';
import Host from './components/host/Host';
import NotFound from './components/notFound/NotFound';
import Join from './components/join/Join';
const App = () => {

    return (
        <div>
            <Switch>
                <Route exact path="/"><Home/></Route>
                <Route exact path="/host/:sessionName" render={(props) => (
                    <Host sessionName={props.match.params.sessionName} />
                )}/>
                <Route exact path="/join/:sessionName" render={(props) => (
                    <Join sessionName={props.match.params.sessionName}/>
                )}/>
                <Route path="/songs"><SongList/></Route>
                <Route path="*">
                    <NotFound/>
                </Route>
            </Switch>

        </div>
    );
};

export default App;
