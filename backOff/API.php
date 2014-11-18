<?php 

/**
 * ENDPOINTS : 
 *  - user: 
 * /user/new/login/password 
 * 		-ajoute un utilisateur
 * 		-retourne l'id du l'utilisateur ou "User already exist" si un utilisateur avec le même login existe déjà.
 * /user/change/login/newPassword
 * 		-update un user
 * 		-retourne un bool success/fail
 * /user/del/login
 * 		-supprime un user selon le login
 * 		-retourne un bool success/fail
 * /user/infos/login
 * 		-retourne les infos sur un login
 * /user/all
 * 		-retourne tout sur tout le monde.
 */


include 'bddClass.php';
$method = $_SERVER['REQUEST_METHOD'];
$request = explode("/", substr(@$_SERVER['PATH_INFO'], 1));
//check request validity
//import bdd classe (mysql? mongo?)
$db = new Bdd;
switch ($method) {
	case 'POST':
		$data_inserted = $db->insert_stuff($request);
		print_r(json_encode($data_inserted));
		break;
	case 'PUT':
		$data_updated = $db->update_stuff($request);
		print_r(json_encode($request));
		break;
	case 'GET':
		$data_asked = $db->select_stuff($request);
		print_r(json_encode($data_asked));
		break;
	case 'DELETE':
		$data_removed = $db->remove_stuff($request);
		print_r(json_encode($request));
		break;
}
