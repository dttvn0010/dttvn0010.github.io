!(function() {
  'use strict';

  const json       = 'test.json';//'http://api.katiespeaker.com/device/post.php?devicekey=e0:b9:4d:b0:83:39';
  const delay      = 5;/*seconds*/

  let pcm    = this;
  let toggle = null;
  let audioCtx = null;
  let source = null;
  let gainNode = null;
  let connected = false;
  let muted = false;
  let on     = {
    DOMContentLoaded: function(e) {
      //this.querySelector('button').addEventListener('click', on.click);
      this.removeEventListener(e.type, on.DOMContentLoaded);
	  
	  let btnPlay = document.querySelector('#btnPlay');
	  btnPlay.addEventListener('click', function() {
		  if(!connected) { alert("Please connect!"); return;}
		  let circle = document.querySelector('#btnPlay circle');
		  circle.setAttribute("fill-opacity", 0.6);
		  setTimeout(function(){circle.setAttribute("fill-opacity", 0.4)}, 200);
		  
		  muted = false;
		  gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
		  
		  let circle2 = document.querySelector('#btnMute circle');
		  circle2.setAttribute("fill", "#007bff");
			
		  circle2 = document.querySelector('#mutedLed circle');
		  circle2.setAttribute("fill", "url('#darkOrangeGradient')");
	  });
	  	  
	  let btnMute = document.querySelector('#btnMute');
	  btnMute.addEventListener('click', function() {
		  if(!connected) return;
		  muted = !muted;
		  let circle = document.querySelector('#btnMute circle');
		  circle.setAttribute("fill", muted?"#ff7b00" : "#007bff");
			
		  circle = document.querySelector('#mutedLed circle');
		  circle.setAttribute("fill", muted? "url('#orangeGradient')" : "url('#darkOrangeGradient')");
		  gainNode.gain.setValueAtTime(muted?-1:1, audioCtx.currentTime);
	  });	  
	  
	  let btnConnect = document.querySelector('#btnConnect');
	  btnConnect.addEventListener('click', function(){
		  if(connected) return;
		  
		  let circle = document.querySelector('#wifiLed circle');
		  circle.setAttribute("fill", "url('#greenGradient')");
		  let blinkCount = 0;
		  let blinker = setInterval(function() {
			  if(blinkCount %2 == 0) {
				  circle.setAttribute("fill", "url('#darkGreenGradient')");
			  }else{
				  circle.setAttribute("fill", "url('#greenGradient')");
			  }
			  if(blinkCount++ >= 7) {
				  clearInterval(blinker);				  
				  connected = true;
				  on.xhr;
			  }
		  }, 150);
	  });
	 
    },
    get xhr() {
      let xhr = (new XMLHttpRequest());
      xhr.responseType = 'text';
      xhr.timeout = 6e4;
      xhr.open('GET', json);
      xhr.addEventListener('load', on.load);
      xhr.addEventListener('timeout', on.error);
      xhr.addEventListener('error', on.error);
      xhr.addEventListener('abort', on.error);
      xhr.send(null);
    },
    error: function(e) {
      console.log('Error %o', e);
      e.target.removeEventListener(e.type, on[e.type]);
    },
    load: function(e) {
      this.removeEventListener(e.type, on[e.type]);
      if (this.status === 2e2) {
        if (this.response) {
          try {
            let response = JSON.parse(this.response.replace(/\r?\n|\r/g, ''));
            if (response.hasOwnProperty('message')) {
              let json = response.message;
              /*for(var i = 0; i < json.length; i++) {
                var obj = json[i];
                on.response(obj);
              }*/
			  on.response(json);
              return true;
            }
          } catch(error) {
            console.log('Bad JSON %o', error);
          }
        } else {
          console.log('no response found');
        }
      } else {
        console.log('http status: ' + this.status);
      }
    },
    response: function(message) {
	  if(muted) {
		  let blinkCount = 0;
		  let blinker = setInterval(function() {
			  let circle = document.querySelector('#mutedLed circle');
			  if(blinkCount %2 == 0) {
				  circle.setAttribute("fill", "url('#darkOrangeGradient')");
			  }else{
				  circle.setAttribute("fill", "url('#orangeGradient')");
			  }
			  if(blinkCount++ >= 10 || !muted) {
				  clearInterval(blinker);				  
				  circle.setAttribute("fill", muted? "url('#orangeGradient')" : "url('#darkOrangeGradient')");
			  }
		  }, 150);
	  }
	  
      let buffer = atob(message.pcm);
      let bits       = 8;//message.pcm_bits;
      let channel    = 0;//message.pcm_channel;
      let channels   = 1;//message.pcm_channels;
      let sampleRate = 16000;//message.pcm_samplerate;
    
      let frameCount = buffer.length / 2;
      audioCtx = (new pcm());
      let myAudioBuffer = audioCtx.createBuffer(channels, frameCount, sampleRate);
      let nowBuffering = myAudioBuffer.getChannelData(channel, bits, sampleRate);
      let i = 0;
      for (i; i < frameCount; i++) {
        let word = (buffer.charCodeAt(i * 2) & 0xff) + ((buffer.charCodeAt(i * 2 + 1) & 0xff) << 8);
        nowBuffering[i] = ((word + 32768) % 65536 - 32768) / 32768.0;
      }
      source = audioCtx.createBufferSource();
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(muted?-1:1, 0);
		  
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      source.buffer = myAudioBuffer;
      source.connect(audioCtx.destination);
      source.start();
      source.onended = function() { setTimeout(function(){on.xhr}, 1000); }
    },
    click: function(e) {
      let pause = 'pause';
      this.classList.toggle(pause);
      if (this.classList.contains(pause)) {
        on.xhr;
        toggle = setInterval(function() {
          on.xhr;
        }, delay * 1e3);
      } else {
        clearInterval(toggle);
        toggle = null;
      }
    }
  };

  document.addEventListener('DOMContentLoaded', on.DOMContentLoaded);
}).call(window.AudioContext || window.webkitAudioContext);
