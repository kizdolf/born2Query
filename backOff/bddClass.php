<?php 

/**
* Bdd.
*/
class Bdd
{
	const SERVER	= "127.0.0.1";
	const DBNAME = "CA_bank";

	private $_mon;
	private $_db;
	private $_users;

	function __construct()
	{
		$this->_mon = new MongoClient("mongodb://".self::SERVER);
		$this->_db = $this->_mon->{self::DBNAME};
		$this->_users = $this->_db->Users;
	}

	private function addUser($login, $mdp)
	{
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

	public function insert_stuff($array)
	{
		switch ($array[0]) {
			case 'user':
				if($array[1] == "new"){
					return $this->addUser($array[2], $array[3]);
				}else{
					return "EndPoint Do Not Exist (yet)";
				}
				break;
			default:
				return "EndPoint Do Not Exist (yet)";
				break;
		}
	}

	public function update_stuff($array)
	{
		switch ($array[0]) {
			case 'user':
				switch ($array[1]) {
					case 'change':
						$user = array("login" => $array[2]);
						$update = array("login" => $array[2], "pass" => $array[3]);
						$this->_users->update($user, $update);
						break;
					
					default:
						return "EndPoint Do Not Exist (yet)";
						break;
				}
				break;
			
			default:
				return "EndPoint Do Not Exist (yet)";
				break;
		}
	}

	public function select_stuff($array)
	{
		switch ($array[0]) {
			case 'user':
				switch ($array[1]) {
					case 'all':
						$cursor = $this->_users->find();
						$users = array();
						foreach ($cursor as $doc) {
							$users[] = $doc;
						}
						return $users;
						break;
					case 'infos':
						$one = $this->_users->findOne(array("login" => $array[2]));
						return $one;
						break;
					default:
						return "EndPoint Do Not Exist (yet)";
						break;
				}
				break;
			
			default:
				# code...
				break;
		}
	}

	public function remove_stuff($array)
	{
		switch ($array[0]) {
			case 'user':
				switch ($array[1]) {
					case 'login':
						$this->_users->remove(array("login" => $array[2]));
						break;
					
					default:
						return "EndPoint Do Not Exist (yet)";
						break;
				}
				break;
			
			default:
				return "EndPoint Do Not Exist (yet)";
				break;
		}
	}
}

?>