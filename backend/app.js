const Express = require('express');
const App = Express();
const Path = require('path');

const PORT = process.env.PORT || 3000;

App.use(Express.static(Path.join(__dirname, 'dist')));

App.get('*', (req, res) => {
	res.sendFile(Path.join(__dirname, 'dist', 'index.html'));
});

App.listen(PORT, () => {
	console.log(`==Listening on port ${PORT}==`);
});
