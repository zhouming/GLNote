<?php
session_start();
header("Content-Type:text/html;charset=utf-8");
date_default_timezone_set('PRC');

require(__DIR__.'/data/config.inc.php');
include_once(__DIR__.'/google/document.class.php');
$_POST = zy_stripSlashes($_POST, 1);
$_GET = zy_stripSlashes($_GET, 1);
$_REQUEST = zy_stripSlashes($_REQUEST, 1);
$_COOKIE = zy_stripSlashes($_COOKIE, 1);

$act = isset($_REQUEST['act']) ? $_REQUEST['act'] : '';

$google = new Google;

$msg = array(
	'code'	=> -1,
	'msg'	=> '',
);

switch($act) {
	case 'glnote_folder_exists' :
		$glnote_folder = $google->get_glnote_folder();
		if ($glnote_folder['code'] == 200 && $glnote_folder['body'] == '') {
			$msg['code'] = 401;
			$msg['msg'] = 'GLNote Folder is not exists.';
		} elseif ($glnote_folder['code'] == 200 && $glnote_folder['body']) {
			$msg['code'] = 200;
			$msg['msg'] = 'GLNote Folder is exists.';
		} else {
			$msg['msg'] = 'Unknow Error, Please Try Again.';
		}
	break;
	case 'create_glnote_folder' :
		$glnote_folder = $google->get_glnote_folder();
		$r = '';
		if ($glnote_folder['code'] == 200 && $glnote_folder['body'] == '') {	
			$r = $google->create_glnote_folder();
			unset($r['body']);
			unset($r['header']);
			$msg = $r;
		} elseif ($glnote_folder['code'] == 200 && $glnote_folder['body']) {
			$msg['code'] = 200;
			$msg['msg'] = 'GLNote Folder is exists.';
		} else {
			if ($glnote_folder['code'] == '') {
				$msg['msg'] = 'Unknow Error, Please Try Again.';
			} else {
				unset($glnote_folder['header']);
				unset($glnote_folder['body']);
				$msg = $glnote_folder;
			}
		}
	break;
	case 'get_glnote_document' :
		$glnote_documents = $google->get_glnote_document();
		$glnote_document = array();
		if($glnote_documents['code'] == 200 && isset($glnote_documents['body']['feed']['entry'])) {
			$glnote_document = $glnote_documents['body']['feed']['entry'][0];
		} elseif ($glnote_documents['code'] == 200 && !isset($glnote_documents['body']['feed']['entry'])) {
			$tmp = $google->create_glnote_document();
			$glnote_document = $tmp['body']['entry'];
		}
		$msg['need_reload'] = 0;
		if (empty($glnote_document)) {
			$msg['msg'] = 'Can not load document.';
			$msg['need_reload'] = 1;
		} else {
			$_SESSION['doc_updated_time'] = $glnote_documet['updated']['$t'];
			$_SESSION['doc_etag'] = $glnote_document['gd$etag'];
			foreach($glnote_document['link'] AS $k => $v) {
				if ($v['rel'] == 'edit-media') {
					$_SESSION['doc_edit_media'] = $v['href'];
					break;
				}
			}
			
			$r = $google->get_document_content($glnote_document['content']['src'], 'html');
			unset($r['header']);
			$msg = $r;
			if ($r['code'] == 200) {
				$msg['body'] = br2nl($r['body']);
				preg_match('/<body\s\w*=?"?\w+"?>(.*)<\/body>/', $msg['body'], $match);
				$msg['body'] = $match['1'];
			}
			$msg['etag'] = $_SESSION['doc_etag'];
		}
	break;
	case 'update_glnote_document' :
		$header = array();
		//$header[] = "If-Match: ".$_SESSION['doc_etag'];
		$header[] = "If-Match: *";
		$header[] = "Content-Type: text/html";
		$header[] = "Slug: ".$_SESSION['slug'];
		$url = $_SESSION['doc_edit_media'];
		$param = trim($_REQUEST['content']);
		$len = strlen($param);
		$header[] = "Content-Length: {$len}";
		$r = $google->update_glnote_document($url, $param, $header);
		if (isset($r['body']['entry']['gd$etag'])) {
			$_SESSION['doc_etag'] = $r['body']['entry']['gd$etag'];
		}

		if (isset($r['body']['entry']['updated']['$t'])) {
			$_SESSION['doc_updated_time'] = $r['body']['entry']['updated']['$t'];
		}
		unset($r['header']);
		unset($r['body']);
		$msg = $r;
		$msg['etag'] = $_SESSION['doc_etag'];
		$msg['last_updated'] = date("H:i:s");
	break;
}

die(json_encode($msg));

function p() {
	$argvs = func_get_args();
	foreach ($argvs as $k => $v) {
		echo "<pre>";
		print_r($v);
		echo "</pre>";
	}
}


function zy_stripSlashes($obj, $case = 0)
{
	$strip = false;
	switch ($case) {
		case 1:
			if ((function_exists('get_magic_quotes_gpc') && get_magic_quotes_gpc())) {
				$strip = true;
			}
			break;
		case 2:
			$strip = true;
			break;
		default:
			$strip = false;
			break;
	}
	if ($strip) {
		$o = array(
			$obj
		);
		array_walk_recursive($o, create_function('&$item', '$item = stripslashes($item);'));
		$obj = $o[0];
	}
	return $obj;
}



function br2nl($text) {   
    return preg_replace('/<br\\s*?\/??>/i', '', $text);   
}  


?>