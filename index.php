<?php
session_start();
header("Content-Type:text/html;charset=utf-8");
date_default_timezone_set('PRC');

require(__DIR__.'/data/config.inc.php');
include_once(__DIR__.'/google/document.class.php');

$code = isset($_GET['code']) ? $_GET['code'] : '';

$oauth = new GoogleOAuth;

$oauth_url = $oauth->get_oauth_url();

if($oauth_url !== false) {
	if ($code) {
		$oauth->get_access_token($code);
		header("Location: ".HOME_URL);
	}
}

function p() {
	$argvs = func_get_args();
	foreach ($argvs as $k => $v) {
		echo "<pre>";
		print_r($v);
		echo "</pre>";
	}
}

?>
<!DOCTYPE HTML> 
<html> 
<head> 
<meta charset=utf-8 /> 
<meta name=description content='GLNote, note everyday by using google documents list api. Good Luck.' /> 
<meta name=keywords content='glnote, google documents list api, google document'/> 
<link href="css/g.css" rel="stylesheet" type="text/css" media="screen"/>
<link rel="shortcut icon" href="favicon.ico" />
<link href="css/jquery-ui-1.8.12.custom.css" rel="stylesheet" type="text/css" media="screen"/>
<!--
<script src="https://www.google.com/jsapi?key=ABQIAAAAQHxySxS2YjC6EWWIwMwk8xR1krk9nt6JAoGFnJWVTaroUfbeyxSq0VITDnLKJlVCtORWzB_jekg4-A"></script>
--!>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.14/jquery-ui.min.js"></script>
<script src="js/g.js"></script>
<script>

//	google.load("jquery", "1.6.1");
//	google.load("jqueryui", "1.8.13");
</script>

<!--
<script src="js/jquery.cleditor.min.js"></script>
<script src="js/jquery.hotkeys.js"></script>
-->

</head>
<title>GLNote, note everyday by using google documents list api. Good Luck!</title>
<body>
	<header>
		<h1>GLNote</h1>
		<div class="top_bar">
			<div class="header">
				<div id="update_status"></div>
			</div>
		</div>
	</header>
	<section id="main">
		<article id="contains">
<!--
			<textarea autofocus="autofocus"  class="content" name="content">Loading...</textarea>		
-->
			<iframe src="document.html" id="content" width="500" height="500"></iframe>
		</article>
		<!--
		<div class="key_tip">
			<h3>Hotkeys</h3>
			<p>Save: control(command) + s, H1: control(command) + 1, H2: control(command) + 2, P: control(command) + p
			</p>
		</div>
		-->
	</section>
	<footer class="footer">
		&copy;GLNote 2011 Hosted by <a href="http://www.linode.com/?r=49e814ad64515fd062c54fb16944a501de351c12" target="_blank">Linode</a> &nbsp;&nbsp; <a href="http://www.zhouming.me" target="_blank">Blog</a>&nbsp;&nbsp;<a href="https://github.com/zhouming/GLNote" target="_blank">Source Code On GitHub</a>
	</footer>

	<div id="glnote_debug">
	</div>

	<div id="dialog" style="display:none;">
		<p class="tip">GLNote use google docs api, so you need to have a google account.</p>
		<p class="google_login">
		<a href="<?php echo $oauth_url; ?>">
			<img width="200" src="http://www.google.com/intl/en_ALL/images/srpr/logo1w.png" /></a>
		</p>
	</div>
	<script>
		var gl = {};
		gl.is_login = <?php echo $oauth_url ? 'false' : 'true';?>;
		gl.editor = '';
		gl.is_loaded = false;
		$(function(){
			if(!check_browser()) {
				return false;	
			};
			textarea_height();
			/*
			gl.editor = $('#content').cleditor({
				width:"100%", 
				height:"100%",
				useCSS:true,
				docCSSFile:'css/iframe.css',
				docType: '<!DOCTYPE HTML>',
				bodyStyle:"font-size:14px;font-family:'Arial, Helvetica, sans-serif';cursor:text;line-height:165%;"
			})[0].focus();
			*/
			$(window).resize(function(){
				textarea_height();
				//gl.editor.refresh();
			});
			$('#content').load(function(){
				gl.editor=this.contentWindow.editor;
				
				gl.editor.setHTML('Loading');

				if (gl.is_login == false) {
					$('#dialog').dialog({
						title : 'Log in with Google',
							open : function(){$('#dialog a, #dialog img').blur();}
					});
				} else {
					if(create_glnote_folder()) {
						get_glnote_document();	
					};
				}

				gl.editor.focus();

				setInterval(function(){
					if (gl.is_loaded == false) return false;
					update_glnote_document();
				}, 15000);


			});

			/*
			var p_time = '';
			gl.editor.doc.addEventListener('keydown', function(e){
				if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13) return false;
				
				if (gl.is_loaded == false) return false;
				clearTimeout(p_time);
				p_time = setTimeout(function(){
					update_glnote_document();
				}, 3000);
			
			}, false);
			*/
			/*
			$(gl.editor.doc).bind('keydown', 'ctrl+s', function(e){
				//clearTimeout(p_time);
				update_glnote_document();
				stop_default(e);
			});

			$(gl.editor.doc).bind('keydown', 'meta+s', function(e){
				//clearTimeout(p_time);
				update_glnote_document();
				stop_default(e);
			});
			$(gl.editor.doc).bind('keydown', 'meta+1', function(e){
				h_tag("<h1>", e);
			});
			$(gl.editor.doc).bind('keydown', 'meta+2', function(e){
				h_tag("<h2>", e);
			});
			$(gl.editor.doc).bind('keydown', 'meta+p', function(e){
				h_tag("<p>", e);
			});
$(gl.editor.doc).bind('keydown', 'ctrl+1', function(e){
				h_tag("<h1>", e);
			});
			$(gl.editor.doc).bind('keydown', 'ctrl+2', function(e){
				h_tag("<h2>", e);
			});
			$(gl.editor.doc).bind('keydown', 'ctrl+p', function(e){
				h_tag("<p>", e);
			});
			$(gl.editor.doc).bind('keydown', 'meta+l', function(e){
				h_tag("<hr>", e);
			});
			$(document).bind('keydown', 'ctrl+s', function(e){
				//clearTimeout(p_time);
				update_glnote_document();
				stop_default(e);
			});
			$(document).bind('keydown', 'meta+s', function(e){
				//clearTimeout(p_time);
				update_glnote_document();
				stop_default(e);
			});
			 */
		});
		
	</script>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-19901102-2']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
	
</body>
</html>
<body>