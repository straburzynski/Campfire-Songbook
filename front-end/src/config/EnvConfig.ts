const dev = {
    url: 'http://localhost:8090/api/',
};

const prod = {
    url: '/api/',
};

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

const EnvConfig = {
    // common EnvConfig
    ...config,
};

export default EnvConfig;
