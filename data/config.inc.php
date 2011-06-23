<?php

define('APP_NAME', 'GLNote');
define('HOME_URL', 'http://www.glnote.com');

//Api Console -> Identity -> OAuth 2 Credentials
define('CLIENT_ID', 'Your Client ID');
define('CLIENT_SECRET', 'Your Secret Key');

//OAuth request
define('OAUTH_URL', 'https://accounts.google.com/o/oauth2/auth');
//Get Access Token
define('TOKEN_URL', 'https://accounts.google.com/o/oauth2/token');
//Determining the scope of your data access
define('SCOPE', 'https://docs.google.com/feeds/');

//All documents list
define('DOCS_LIST_URL', 'https://docs.google.com/feeds/default/private/full');
//Folder
define('FOLDER_LIST_URL', 'https://docs.google.com/feeds/default/private/full/-/folder');
//Update content
define('MEDIA_URL', 'https://docs.google.com/feeds/default/media');
//Export
define('EXPORT_URL', 'https://docs.google.com/feeds/download/documents/Export');
define('UPLOAD_CREATE_SESSION', 'https://docs.google.com/feeds/upload/create-session/default/private/full');
?>