<?php

function get_divisors_of($number)
{
	$divisors = [];
	for ($i = 1; $i <= $number; $i++) {
		if ($number % $i === 0) {
			$divisors[] = $i;
		}
	}
	return $divisors;
}

$allowed_ops = ['+', '-', '*', '/', '%'];

$data = [
	'direction' => NULL,
	'answers' => [],
];

// No 0 on $nb1
do {
	$nb1 = $nb2 = rand() % 20;
} while ($nb1 === 0);
// Pick an operator
$op = $allowed_ops[array_rand($allowed_ops)];
switch ($op) {
	// Careful with divisions !
	case '/': {
		$divisors = get_divisors_of($nb1);
		$nb2 = $divisors[array_rand($divisors)];
		break;
	}

	case '%': {
		// Prevent mod(0)
		do {
			$nb2 = rand() % 20;
		} while ($nb2 === 0);
		break;
	}

	default: {
		$nb2 = rand() % 20;
		break;
	}
}

// Set the direction
$data['direction'] = "$nb1 $op $nb2";

// Set the real answer
$data['answers'][0] = intval(eval("return " . $data['direction'] . ";"));
$mod = $data['answers'][0] === 0 ? 2 : $data['answers'][0] * 4;
for ($i = 0; $i < 3; $i++) {
	// Generate approximate results based on real answer
	$data['answers'][] = (rand() % $mod) - $mod / 2;
}

// Shuffle answers
shuffle($data['answers']);

die(json_encode($data));
