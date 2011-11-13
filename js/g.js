function check_browser() {
	if (!window.localStorage) {
		alert('Your browser does not support local storage, please get the latest version of browser.');	
		return false;
	} else {
		return true;
	}
}

function textarea_height() {
	var h = $(window).height();
	$('#contains, #content').height(h - 200);
}

function glnote_folder_exists() {
	$.ajaxSetup({
		async : false	
	});
	$.getJSON('ajax.php?act=glnote_folder_exists', '', function(r){
		alert(r.msg);	
	});
}

function create_glnote_folder() {
	$.ajaxSetup({
		async : false	
	});
	var success = false;
	$.getJSON('ajax.php?act=create_glnote_folder', '', function(r){
		if (r.code == 200 || r.code == 201) {
			success = true;
		} else {
			alert(r.msg);
		}
	});
	return success;
}

function get_glnote_document() {
	$.ajaxSetup({
		async : false	
	});
	//$('#content').val('loading...').attr('readOnly','readOnly');
//	gl.editor.updateFrame();
	$.getJSON('ajax.php?act=get_glnote_document', '', function(r){
		if (r.code == 200) {
			//$('#content').val(r.body);
			//$('#content').removeAttr('readOnly');
			gl.editor.setHTML(r.body);
			window.localStorage.setItem('latest_content', r.body);
//			gl.editor.updateFrame();
			gl.is_loaded = true;
		} else {
			//alert(r.msg);
			if (r.need_reload == 1) {
				location.href = location.href;
			}
		}
	});
}

function update_glnote_document() {
	$.ajaxSetup({
		async : true,
		dataType : 'json'
	});
	//var v = $('#content').val();
	//gl.editor.updateTextArea();
	//var v = gl.editor.$area.val();
	var v = gl.editor.getHTML();
	var latest_v = window.localStorage.getItem('latest_content');
	if (v == latest_v) {
		return false;
	}
	window.localStorage.setItem('latest_content', v);

	$('#update_status').html('Saving');
	$.post(
		'ajax.php?act=update_glnote_document', 
		{'content' : v}, 
		function(r){
			//alert(r.msg);	
			if( r.code == 200) {
				$('#update_status').html(r.last_updated + '&nbsp;Saved');
			} else {
				$('#update_status').html('Failed');
			}
		}
	);
}

function stop_default( e ) {
	// Prevent the default browser action (W3C)
	if ( e && e.preventDefault ) {
      e.preventDefault();
	} else {
   // A shortcut for stoping the browser action in IE
      window.event.returnValue = false;
	}
   return false;
}

function stop_bubble(e) {
	if ( e && e.stopPropagation ) {
		e.stopPropagation();
	} else {
		window.event.cancelBubble = true;
	}
}
function h_tag(tag, e) {
	var buttons = $.cleditor.buttons;
	var buttonName = 'style';
	var command = buttons[buttonName].command;
	var value = tag;
	gl.editor.execCommand(command, value, 1, '');
	stop_default(e);
}