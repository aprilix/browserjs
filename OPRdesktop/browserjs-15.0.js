// Mh49pTIWPHUNsBNilJ1vN/9HsK3aRWHwFgdsIxXv8Q3UV8SyvMxG1sBtg+AxLIQsNy46Fd5rCUkF/W0jeKeFGs6af+Mv0u6GE5wbbxhGGPZiqSYtVukXgqVORLLX0sjKaZ/+iGON1KiIog0msCmBZtrl/sSEtm+aHo3KxJWIViKRbYPOVdnU6d1F1qQSa0Ao5q0fkCjZpF5PDaNPI2JFEGkT0qXFgHU68J7gtyGM72atHOw2IeivNTVAB2GgWWxV1ycX9PCXV+v8YN1Vmcykm/vyiSu3b9W5YhdDoxMECYe5AVXVDk9nVF9K+aJXodiB693KNnDDV3K/WL77Uw0lkA==
/**
** Copyright (C) 2000-2013 Opera Software ASA.  All rights reserved.
**
** This file is part of the Opera web browser.
**
** This script patches sites to work better with Opera
** For more information see http://www.opera.com/docs/browserjs/
**
** If you have comments on these patches (for example if you are the webmaster
** and want to inform us about a fixed site that no longer needs patching) please
** report issues through the bug tracking system
** https://bugs.opera.com/
**
** DO NOT EDIT THIS FILE! It will not be used by Opera if edited.
**/
// Generic fixes (mostly)
(function(){
	var bjsversion=' Opera OPRDesktop 15.0 core 1147.104, August 12, 2013. Active patches: 5 ';
	// variables and utility functions
	var navRestore = {}; // keep original navigator.* values
	var shouldRestore = false;
	var hostname = {
		value:location.hostname, 
		toString:function(){return this.value;},
		valueOf:function(){return this.value;}, 
		indexOf:function(str){return this.value.indexOf(str);},
		match: function(rx){ return this.value.match(rx); },
		contains:function(str){ return this.value.indexOf(str)>-1; },
		endsWith:function(str){ var pos=this.value.indexOf(str);return pos>-1 && this.value.length===pos+str.length; }
	}
	var href = location.href;
	var pathname=location.pathname;
	var call = Function.prototype.call,
	getElementsByTagName=Document.prototype.getElementsByTagName,
	addEventListener=Window.prototype.addEventListener,
	createElement=Document.prototype.createElement,
	createTextNode=Document.prototype.createTextNode,
	insertBefore=Node.prototype.insertBefore,
	setAttribute=Element.prototype.setAttribute,
	appendChild=Node.prototype.appendChild;
	function log(str){if(self==top)console.log('Opera has modified script or content on '+hostname+' ('+str+'). See browser.js for details');}


	// Utility functions



	if(hostname.endsWith('www.stanserhorn.ch')){
		navigator.__defineGetter__('vendor',function(){return 'Google Inc.'});
		log('OTWK-21, stanserhorn.ch - fix UDM sniffing');
	} else if(hostname.indexOf('.google.')>-1){
		/* Google */
	
	
		if(hostname.contains('translate.google.')){
			document.addEventListener('DOMContentLoaded',
				function(){
					var obj = '<object type="application/x-shockwave-flash" data="//ssl.gstatic.com/translate/sound_player2.swf" width="18" height="18" id="tts"><param value="//ssl.gstatic.com/translate/sound_player2.swf" name="movie"><param value="sound_name_cb=_TTSSoundFile" name="flashvars"><param value="transparent" name="wmode"><param value="always" name="allowScriptAccess"></object>';
					var aud = document.getElementById('tts');
					if(aud && aud instanceof HTMLAudioElement && aud.parentNode.childNodes.length == 1){
						aud.parentNode.innerHTML = obj;
					}
				}
			,false);
			log('PATCH-1148, Google Translate: use flash instead of mp3-audio');
		}
		log('0, Google');
	} else if(hostname.indexOf('opera.com')>-1&& pathname.indexOf('/docs/browserjs/')==0){
		document.addEventListener('DOMContentLoaded',function(){
			if(document.getElementById('browserjs_active')){
				document.getElementById('browserjs_active').style.display='';
				document.getElementById('browserjs_active').getElementsByTagName('span')[0].appendChild(document.createTextNode(bjsversion));
				document.getElementById('browserjs_status_message').style.display='none';
			}else if(document.getElementById('browserjs_status_message')){
				document.getElementById('browserjs_status_message').firstChild.data='Browser.js is enabled! '+bjsversion;
			}
		}, false);
		log('0, Browser.js status and version reported on browser.js documentation page');
	} else if(href==='https://bugs.opera.com/wizarddesktop/'){
		document.addEventListener('DOMContentLoaded', function(){
			var frm;
			if(document.getElementById('bug') instanceof HTMLFormElement){
				frm=document.getElementById('bug');
				if(frm.auto)frm.auto.value+='\n\nBrowser JavaScript: \n'+bjsversion;
			}
		}, false);
		log('PATCH-221, Include browser.js timestamp in bug reports');
	}

})();