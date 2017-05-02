'use strict';

// THANKS http://stackoverflow.com/a/10073788
function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

$(document).ready(() => {
	// Scope _game to "prevent" (lol) cheating
	let _game = new Game();
	$(document).on('click', '.answer', e => _game.handleAnswer(e));
});
