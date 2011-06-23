<?php

Class GoogleOAuth {
	private $client_id			=	CLIENT_ID;
	private $client_secret		=	CLIENT_SECRET;
	private $redirect_uri		=	HOME_URL;
	private $scope				=	SCOPE;
	private	$response_type		=	'code';
	private	$state				=	'';
	private	$grant_type_first	=	'authorization_code';
	private	$grant_type_refresh	=	'refresh_token';
	private $oauth_url			=	OAUTH_URL;
	private $token_url			=	TOKEN_URL;
	
	public $access_token		=	'';
	public $access_token_time	=	'';
	public $refresh_token		=	'';

	public function __construct() {
		$this->access_token			=	isset($_SESSION['access_token']) ? $_SESSION['access_token'] : '';
		$this->access_token_time	=	isset($_SESSION['access_token_time']) ? $_SESSION['access_token_time'] : '';
		$this->refresh_token		=	isset($_SESSION['refresh_token']) ? $_SESSION['refresh_token'] : '';
	}
	
	public function get_oauth_url() {
		if ($this->access_token === '') {
			$oauth_param = array(
				'client_id'		=>	$this->client_id,
				'redirect_uri'	=>	$this->redirect_uri,
				'scope'			=>	$this->scope,
				'response_type'	=>	$this->response_type,
				'state'			=>	$this->state
			);
			$url_param = http_build_query($oauth_param);
			return $this->oauth_url.'?'.$url_param;
		} else {
			return false;
		}
	}

	public function get_access_token($code = '') {
		$post_param = array(
			'code'			=>	$code,
			'client_id'		=>	$this->client_id,
			'client_secret'	=>	$this->client_secret,
			'redirect_uri'	=>	$this->redirect_uri,
			'grant_type'	=>	$this->grant_type_first
		);
		if ($code === '') {
			$post_param['refresh_token'] = $this->refresh_token;
			$post_param['grant_type'] = $this->grant_type_refresh;
			unset($post_param['code']);
			unset($post_param['redirect_uri']);
		}

		$curl_post = http_build_query($post_param);
		
		$r = $this->curl_opt($this->token_url, $curl_post, array(), 'post');
		
		if ($r['code'] == 200){
			$_SESSION['access_token'] = $r['body']['access_token'];
			$_SESSION['access_token_time'] = time() + 3600;
			if ($code) {
				$_SESSION['refresh_token'] = $r['body']['refresh_token'];
			}

			$this->access_token			=	$_SESSION['access_token'];
			$this->access_token_time	=	$_SESSION['access_token_time'];
			$this->refresh_token		=	$_SESSION['refresh_token'];
		}
		return $r;
	}

	public function curl_opt($url, $curl_param = '', $header=array(), $method = 'get', $type='json') {
		$access_token_time = $this->access_token_time;
		if ($access_token_time - time() <= 0 && $url !== $this->token_url) {
			$access = $this->get_access_token();
			if ($access['code'] == 400 || $access['code'] = 401) {
				return $access;
			}
		}
		
		if($url !== $this->token_url) {	
			$header[] = 'Authorization: OAuth '.$this->access_token;
			$header[] = 'GData-Version: 3.0';
		}
		if ($type == 'json') {	
			$url = strpos($url, '?') === false ? $url.'?alt=json' : $url.'&alt=json';
		}
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		if(!empty($header)) {
			curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
		}
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_HEADER, 1);
		switch($method) {
			case 'get' :

			break;
			case 'post' :
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $curl_param);
			break;
			case 'delete':
			break;
			case 'put' :
				curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT"); 
				curl_setopt($ch, CURLOPT_POSTFIELDS, $curl_param);
			break;
		}
		curl_setopt($ch, CURLOPT_TIMEOUT, 30);
		$rr = curl_exec($ch);
		curl_close($ch);
		$res = array();
		$tmp = array(
			'header' => '',
			'body'   => '',
			'code'   => '',
			'msg'    => ''
		);
		if ($rr != false) {
			$res = explode("\r\n\r\n", $rr);
			$tmp['header'] = $res[0];
			$tmp['body'] = $res[1];
			$tmp['code'] = $this->get_http_code($res[0]);
			if ($type == 'json'){
				$tmp['body'] = json_decode($res[1], true);
			}
			$tmp['msg'] = $this->get_http_msg($res[0]);
		}
		return $tmp;
	}

	public function get_http_code($header) {
		$header = explode("\r", $header);
		preg_match_all("/HTTP\/1\.1\s(\d+)\s(.*)/", $header[0], $match);
		return $match[1][0];
	}

	public function get_http_msg($header) {
		$header = explode("\r", $header);
		preg_match_all("/HTTP\/1\.1\s(\d+)\s(.*)/", $header[0], $match);
		return $match[2][0];
	}

}

Class Google {
	private $docs_list_url = DOCS_LIST_URL;
	private $folder_list_url = FOLDER_LIST_URL;
	private $upload_create_session = UPLOAD_CREATE_SESSION;
	private $media_url = MEDIA_URL;
	private $export_url = EXPORT_URL;
	private $oauth = '';
	public  $glnote_folder_resource_id = '';
	public	$glnote_folder_url = '';
	public	$app_name = APP_NAME;

	public function __construct(){
		$this->oauth = new GoogleOAuth;
	}
	
	public function get_folder_list() {
		return $this->oauth->curl_opt($this->folder_list_url);
	}

	public function get_glnote_folder() {
		$this->glnote_folder_resource_id = '';
		$r['code'] = '';
		$r['body'] = '';
		$r['msg'] = '';
		if(isset($_SESSION['glnote_folder_resource_id'])) {	
			$r['code'] = 200;
			$this->glnote_folder_resource_id = $_SESSION['glnote_folder_resource_id'];
			$r['body'] = $this->glnote_folder_resource_id;
		} else {
			$folders = $this->get_folder_list();

			if (isset($folders['body']['feed']['entry']) && $folders['code'] == 200) {
				foreach($folders['body']['feed']['entry'] AS $k => $v) {
					if ($v['title']['$t'] === $this->app_name) {
						$_SESSION['glnote_folder_resource_id'] = $v['gd$resourceId']['$t'];
						$this->glnote_folder_resource_id = $_SESSION['glnote_folder_resource_id'];
						$r['body'] = $this->glnote_folder_resource_id;
						$r['code'] = 200;
						break;
					}
				}
			} else {
				$r['code'] = $folders['code'];
				$r['msg'] = $folders['msg'];
			}
		}
		
		return $r;
	}	
	
	public function create_glnote_folder() {
		$header = array();
		$header[] = 'Content-Type: application/atom+xml';
		$xml_param = '<?xml version="1.0" encoding="UTF-8"?>
				<entry xmlns="http://www.w3.org/2005/Atom">
				<category scheme="http://schemas.google.com/g/2005#kind"
				term="http://schemas.google.com/docs/2007#folder"/>
			<title>' . $this->app_name . '</title>
			</entry>';
		$r = $this->oauth->curl_opt($this->docs_list_url, $xml_param, $header, 'post');
		if (isset($r['body']['entry'])) {
			$_SESSION['glnote_folder_resource_id'] = $r['body']['entry']['gd$resourceId']['$t'];
			$this->glnote_folder_resource_id = $_SESSION['glnote_folder_resource_id'];
		}
		return $r;
	}

	public function get_glnote_document($date = '') {
		if ($this->glnote_folder_resource_id === '') {
			$this->get_glnote_folder();
		}
		if(empty($date)) {
			$date = date('F j, Y', time());
		}
		$title = $date.' Good Luck';
		$get_param = array(
			'title'			=>	$title,
			'title-exact'	=>	'true'
		);
		$url_param = http_build_query($get_param);
		$this->glnote_folder_url = $this->docs_list_url.DIRECTORY_SEPARATOR.urlencode($this->glnote_folder_resource_id). DIRECTORY_SEPARATOR . 'contents';
		$r = $this->oauth->curl_opt($this->glnote_folder_url.'?'.$url_param);
		return $r;
	}

	public function create_glnote_document() {
		$today = date('F j, Y', time());
		$xml_param = '<?xml version="1.0" encoding="UTF-8"?>
			<entry xmlns="http://www.w3.org/2005/Atom">
			<category scheme="http://schemas.google.com/g/2005#kind"
				term="http://schemas.google.com/docs/2007#document"/>
			<title>' . $today . ' Good Luck</title>
			</entry>
		';

		$header = array('Content-Type: application/atom+xml');
		$r = $this->oauth->curl_opt($this->glnote_folder_url, $xml_param, $header, 'post');
		return $r;
	}

	public function get_document_content($url, $format) {
		if ($url === '') return false;
		$url_param = array(
			'format'		=>	$format,
			'exportFormat'	=>	$format
		);
		$url_param = http_build_query($url_param);
		$url = $url . '&' . $url_param;
		$r = $this->oauth->curl_opt($url, '', array(), 'get', '');
		preg_match('/filename=\"(.*)\"/', $r['header'], $match);
		$_SESSION['slug'] = $match[1];
		return $r;
	}

	public function update_glnote_document($url, $param, $header) {
		$r = $this->oauth->curl_opt($url, $param, $header, 'put');
		return $r;
	}

	public function get_upload_location_url($url, $param, $header) {
		$r = $this->oauth->curl_opt($url, $param, $header, 'put', '');
		$r = explode("\r", $r['header']);
		$rr = '';
		foreach($r AS $v) {
			if (strpos($v, 'Location:') > -1) {
				$rr = explode('Location:', $v);
				$rr = trim($rr[1]);
			}
		}
		return $rr;
	}
	
	public function update_glnote_document_by_chunk($url, $param, $len, $range_1, $range_2) {
		
		$header = array();
		$header[] = "Content-Length: {$len}";
		$header[] = "Content-Type: text/plain";
		//$header[] = "Content-Range: bytes ".$range_1."-".$range_2."/{$len}";
		$header[] = "Content-Range: bytes */{$len}";
		$r = $this->oauth->curl_opt($url, $param, $header, 'put', '');
		if ($r['code'] == 308) {
		$header = array();
		$header[] = "Content-Length: {$len}";
		//$header[] = "Content-Type: text/plain";
		//$header[] = "Content-Range: bytes ";

			//$r = $this->oauth->curl_opt($url, '', $header, 'put', '');

		}
		return $r;
	}

}
?>