const dev = {
    url: 'http://localhost:8080/',
};

const prod = {
    url: 'http://localhost:8080/',
};

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

const EnvConfig = {
    // common EnvConfig
    ...config,
};

export default EnvConfig;
