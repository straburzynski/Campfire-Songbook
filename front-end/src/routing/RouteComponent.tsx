import { Route, Routes } from 'react-router-dom';
import Home from '../components/home/Home';
import Host from '../components/host/Host';
import Join from '../components/join/Join';
import NotFound from '../components/notFound/NotFound';
import SongEditor from '../components/songEditor/SongEditor';
import React from 'react';

const RouteComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/host/:sessionName" element={<Host />}></Route>
            <Route path="/join/:sessionName" element={<Join />}></Route>
            <Route path="/editor" element={<SongEditor />}></Route>
            <Route path="*" element={<NotFound />}></Route>
        </Routes>
    );
};

export default RouteComponent;
