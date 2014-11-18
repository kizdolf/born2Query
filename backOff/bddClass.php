<?php 

/**
* Bdd.
*/
class Bdd
{
	const SERVER	= "127.0.0.1";
	const DBNAME = "CA_bank";
	const NOTYET = "EndPoint Do Not Exist (yet)";

	private $_mon;
	private $_db;
	private $_users;

	function __construct()
	{
		$this->_mon = new MongoClient("mongodb://".self::SERVER);
		$this->_db = $this->_mon->{self::DBNAME};
		$this->_users = $this->_db->Users;
	}

	public function addUser($login, $mdp)
	{
		if( strlen($login) <= 3 || strlen($mdp) <= 3){
			return "password ou login trop court.";
		}

		$user = array("login" => $login, "pass" => $mdp);
		if($this->_users->findOne(array("login" => $login)) != NULL){
			return "User already exist";
		}
		if ($this->_users->insert($user)){
			return $user['_id'];
		}else{
			return "Something wrong append..";
		}
	}

	public function changeUserPassword($login, $newMdp)
	{
		$user = array("login" => $login);
		$update = array("login" => $login, "pass" => $newMdp);
		$this->_users->update($user, $update);
	}

	public function selectOne($login)
	{
		return $this->_users->findOne(array("login" => $login));
	}

	public function selectAll()
	{
		$cursor = $this->_users->find();
		$users = array();
		foreach ($cursor as $doc) {
			$users[] = $doc;
		}
		return $users;
	}

	public function deleteOne($login)
	{
		$this->_users->remove(array("login" => $login));
	}

}

?>