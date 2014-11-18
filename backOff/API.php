<?php 

/**
 * ENDPOINTS : 
 *  - user/: 
 * 		POST login/password 
 * 				-ajoute un utilisateur
 * 				-retourne l'id du l'utilisateur ou "User already exist" si un utilisateur avec le même login existe déjà.
 * 		PUT login/newPassword
 * 				-update un user
 * 				-retourne un bool success/fail
 * 		DELETE /login
 * 				-supprime un user selon le login
 * 				-retourne un bool success/fail
 * 		GET one/login
 * 				-retourne les infos sur un login
 * 		GET all
 * 				-retourne tout sur tout le monde.
 */

include 'bddClass.php';

$badEndPoint = "EndPoint do not exist yet.";
$missingParam = "A parameter is missing.";
$unknowParam = "A parameter will be ignored, it's not required.";

$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));

$point = array_shift($request); #/user/...

switch ($point) {
	case 'user':
		userHandler($request);
		break;
	default:
		echo $badEndPoint;
		break;
}

function userHandler($request){
	$db = new Bdd;
	switch ($GLOBALS['method']) {
		case 'POST': # user/login/password
			$login = array_shift($request);
			if ($login == NULL){ echo $GLOBALS['missingParam']; die();}
			$mdp = array_shift($request);
			if ($mdp == NULL) {echo $GLOBALS['missingParam']; die();}
			$response = $db->addUser($login, $mdp);
			if (!empty($request)){echo $GLOBALS['unknowParam'];}
			print_r(json_encode($response));
			break;
		case 'PUT': #user/login/newPassword
			$login = array_shift($request);
			if ($login == NULL){ echo $GLOBALS['missingParam']; die();}
			$newMdp = array_shift($request);
			if ($newMdp == NULL) {echo $GLOBALS['missingParam']; die();}
			$response = $db->changeUserPassword($login, $newMdp);
			if (!empty($request)){echo $GLOBALS['unknowParam'];}
			print_r(json_encode($response));
			break;
		case 'GET':
			$type = array_shift($request);
			switch ($type) {
				case 'one': #user/one/login
					$login = array_shift($request);
					if ($login == NULL){ echo $GLOBALS['missingParam']; die();}
					$response = $db->selectOne($login);
					if (!empty($request)){echo $GLOBALS['unknowParam'];}
					print_r(json_encode($response));
					break;
				case 'all': #user/all
					if (!empty($request)){echo $GLOBALS['unknowParam'];}
					$response = $db->selectAll();
					print_r(json_encode($response));
					break;
				default:
					echo $GLOBALS['badEndPoint'];
					break;
			}
			break;
		case 'DELETE':
			$login = array_shift($request);
			if ($login == NULL){ echo $GLOBALS['missingParam']; die();}
			$response = $db->deleteOne($login);
			print_r(json_encode($response));
			break;
		default:
			echo $badEndPoint;
			break;
	}
}
