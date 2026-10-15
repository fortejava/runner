import '../sass/main.scss';

const req = require.context('../js', true, /\.js$/);
req.keys().forEach((filename) => {
    req(filename);
});

import './engine'; //Il cuore dell'applicazione è qui