const dev = {
    url: 'http://localhost:8090/api/',
};

const prod = {
    url: '/api/',
};

const config = process.env.NODE_ENV === 'development' ? dev : process.env.NODE_ENV === 'production' ? prod : null;

const EnvConfig = {
    // common EnvConfig
    ...config,
};

export default EnvConfig;
