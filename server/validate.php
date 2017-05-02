<?php

// Lazy method to get all fields
foreach (['direction' => 'string', 'answer' => 'string', 'initial_timer' => 'int', 'timer' => 'int', 'attempts' => 'int', ] as $f => $t) {
	$$f = isset($_POST[$f]) ? $_POST[$f] : NULL;
	settype($$f, $t);
}

// Validate answer according to direction
$correct = eval("return $direction === $answer;");

$points = $correct ? 10 : -10;
if ($correct) {
	// $timer + 1 to compensate the human brain latency.
	$timer = $timer + 1 > $initial_timer ? $initial_timer : $timer + 1;

	// Divide points by attempts
	$points /= intval($attempts);
	// Take a compensated percentage of the time you took to answer
	$points *= (float) $timer / (float) $initial_timer;
}

die(json_encode([
	'result' => $correct,
	'points' => floor($points),
]));
