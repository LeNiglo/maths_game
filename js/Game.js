'use strict';

const INITIAL_TIMER = 10;

class Game {
	constructor() {
		this._points = 0;
		this._timer = INITIAL_TIMER;
		this.reset();
	}

	// Get a new direction and answers from server
	getDirection(cb) {
		$.ajax({
			url: 'server/direction.php',
			dataType: 'json',
			success: (data) => {
				console.log(data);
				// Reset attempts, set direction and answers
				this._attempts = 0;
				this._direction = data.direction;
				this._answers = data.answers;
				if (cb) return cb(data); else return data;
			},
			error: (error) => {
				console.error(error);
			}
		});
	}

	// Validate the clicked answer on the server
	validateAnswer(answer, cb) {
		++this._attempts;
		$.ajax({
			url: 'server/validate.php',
			method: 'POST',
			data: {
				direction: this._direction,
				answer: answer,
				initial_timer: INITIAL_TIMER,
				timer: this._timer,
				attempts: this._attempts
			},
			dataType: 'json',
			success: (data) => cb ? cb(data) : data,
			error: (error) => {
				console.error(error);
			}
		})
	}

	// Handler called when clicking an .answer
	handleAnswer(event) {
		let $points = $('#points');
		let $bonus_points = $('#bonus-points');
		let $this = $(event.currentTarget);
		let answer = $this.data('answer');

		// if there is already an active or valid answer (currently validating),
		// OR if this answer has already been tested false,
		// Don't try.
		if ($('.answer.active, .answer.true').length || $this.hasClass('false')) { return false; }

		$this.addClass('active');
		this.validateAnswer(answer, (data) => {
			if (data.result === true) {
				$this.addClass('true');

				// Pause timer, then reset.
				this.toggleTimer();
				window.setTimeout(() => {
					this.reset();
				}, 2000);
			} else {
				$this.addClass('false');
			}

			// after validation, remove active class and update points
			$this.removeClass('active');
			$bonus_points.text(pad(data.points, this._points.toString().length)).show();
			this._points += data.points;
			window.setTimeout(() => {
				$bonus_points.slideUp('fast', () => {
					$points.text(this._points);
				});
			}, 500);
		});
	}

	// Create UI components
	updateUI(cb) {
		let $direction = $('#direction');
		let $answers = $('#answers');

		$answers.empty();
		$direction.empty();

		// Append each answer to answers
		this._answers.forEach((answer) => {
			const $answer = $('<div>', { class: 'answer active' }).append($('<span>', { text: answer })).data('answer', answer);
			$answer.appendTo($answers);
		});

		// Make them clickable after brief delay
		window.setTimeout(() => { $('#answers > .answer').removeClass('active'); }, 250);

		// Set the direction
		$direction.append($('<span>', { text: this._direction }));
		if (cb) return cb(); else return true;
	}

	toggleTimer() {
		let $timer = $('#timer');

		if (this._timerInterval) {
			// If interval is initated, then, clear it.
			window.clearInterval(this._timerInterval);
			this._timerInterval = null;
		} else {
			// Else, start the interval
			$timer.text(this._timer);
			this._timerInterval = window.setInterval(() => {
				if (this._timer <= 0) {
					this.toggleTimer();
					// TODO make a nicer "alert"
					alert('GAME OVER.\nFinal Score : ' + this._points);
					window.location.reload();
				}

				$timer.text(this._timer--);
			}, 1000);
		}
	}

	// Pretty obvious ...
	reset() {
		this.getDirection((data) => {
			this.updateUI(() => {
				this._timer = INITIAL_TIMER;
				if (!this._timerInterval) { this.toggleTimer(); }
			});
		});
	}
};
