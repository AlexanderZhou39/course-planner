const Express = require('express');
const App = Express();
const Path = require('path');

App.use(Express.static(Path.join(__dirname, 'dist')));

App.get('*', (req, res) => {
	res.sendFile(Path.join(__dirname, 'dist', 'index.html'));
});

App.listen(3000, () => {
	console.log('==Listening on port 3000==')
});
