String.prototype.endWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
}
String.prototype.startWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}

//String.prototype.trim = function() {　　
//    return this.replace(/(^\s*)|(\s*$)|(&nbsp;)/g, "");　　
//}　　
//String.prototype.ltrim = function() {　　
//    return this.replace(/(^\s*)/g, "");　　
//}　　
//String.prototype.rtrim = function() {　　
//    return this.replace(/(\s*$)/g, "");　　
//}

function IsSentence(str){
	return str.endWith(".")||str.endWith("?")||str.endWith("!")||str.endWith(",");
}

function SplitString(str,maxLength){
	if(!maxLength){maxLength=200;}
	//str=str.replace(/&nbsp;/ig,' ');
	str=str.replace(/\s/g," ");
//	var c = document.createElement('div');
//	c.innerHTML = str;
//	str = c.innerText || c.textContent;
	var ss=[];
	var index=-1;
	var tokens=[". ","? ","! ",", "];
	//str="hellow. what";
	while(str.length>0){
		var i=0;
		for(i=0;i!=tokens.length;i++){
			index=str.indexOf(tokens[i]);
			if(index>0&&index<maxLength){
				ss.push(str.substring(0,index+2));
				str=str.substring(index+2);
				index=-1;
				break;
			}
		}
		if(i==tokens.length && str.length>0){
			ss.push(str);
			str="";
		}
	}
	return ss;
}
//获取数组最小值函数
//  Array.min = function(arr)
//  {
//    return Math.min.apply(Math,arr);
//  }

var getElementMargin={

 left:function(ele){
  var actualLeft = ele.offsetLeft;
  var current = ele.offsetParent;
  while (current !== null){
   actualLeft += current.offsetLeft;
   current = current.offsetParent;
  }
//一个准确获取网页客户区的宽高、滚动条宽高、滚动条Left和Top的代码

  if (document.compatMode == "BackCompat"){
   var elementScrollLeft=document.body.scrollLeft;
  } else {
   var elementScrollLeft=document.documentElement.scrollLeft;
  }
  return actualLeft-elementScrollLeft;
 },

 top:function(ele){
  var actualTop = ele.offsetTop;
  var current = ele.offsetParent;
  while (current !== null){
   actualTop += current.offsetTop;
   current = current.offsetParent;
  }
  if (document.compatMode == "BackCompat"){
   var elementScrollTop=document.body.scrollTop;
  } else {
   var elementScrollTop=document.documentElement.scrollTop;
  }
  return actualTop-elementScrollTop;
 },


// bot:function(ele){
//  var actualBottom = document.body.offsetHeight - this.top(ele);//浏览器当前的高度减去当前元素的窗口位置，注意是相对的位置，不包括滚动条里的高度
//  return actualBottom;
// }


};


var audioPlayer = {
    audioEle1: $("#s1")[0],
    audioEle2: $("#s2")[0],
    sentences: [],
    speedOnline: 1,
    speakerOnline: 1,
    ele1Sentence: -1,
    ele2Sentence: -1,
    isPlaying: false,
    isSpeaking: false,
    isPause: false,
    isStop: false,
    isOnline: true,
    currentSentenceIndex: 0,
    currentPIndex: 0,
    preTotalSen: 0,
    synth: window.speechSynthesis,
    utterThis: null,
    offlineVoices: [],
    offlineSpeaker: null,
    offlineSpeed: 1,
    offlinePitch: 0.5,
    isAutoPlay: false,
    delegate: {},
    totalChars: 0,
    limitChars: 5000,
    deltaLimit: 5000,
    dayChars:30000,
    curHiPIndex:0,
    curHiSpanIndex:0,
    hiLines:[],
    nextHiLines:[],
    nextSentenceIndex:0,
    beginSentenceIndex:0,
    loadedPdfPages:[],
    playFromOnline: function(senIndex) {
        audioPlayer.isAutoPlay = false;
        if (senIndex < audioPlayer.sentences.length) {
            audioPlayer.currentSentenceIndex = senIndex;
            audioPlayer.playOnline();
        } else {
            audioPlayer.currentSentenceIndex = 0;
        }
    },
    playOnline: function() {
    		if(listenType=="pdf" && audioPlayer.currentPIndex>contentObj.find("p").length-3){
        			currentPdfPage++;
        			if(currentPdfPage>pdfPageHtmls.length){
		    			currentPdfPage=pdfPageHtmls.length;
		    		}else{
			    		if(currentPdfPage<pdfPageHtmls.length){
			    			LoadPdfPage(currentPdfPage);
			    		}else{

			    		}
		    		}
		    }

    		if(audioPlayer.currentSentenceIndex>audioPlayer.sentences.length-1)return;
        if (audioPlayer.currentSentenceIndex < 0) audioPlayer.currentSentenceIndex = 0;
        audioPlayer.isStop=false;

        if(audioPlayer.currentPIndex+1<contentObj.find("p").length){

        SplitPara(contentObj.find("p").get(Number(audioPlayer.currentPIndex)+1),audioPlayer.currentPIndex+1);
        }
         if (audioPlayer.currentSentenceIndex >= audioPlayer.preTotalSen - 1) {
            audioPlayer.delegate.loadNextPara();
        }
        for(var i=0;i!=audioPlayer.hiLines.length;i++){
// //     	$(contentObj.find("p").get(audioPlayer.currentPIndex)).css('background', 'none');
////      $(contentObj.find("p").get(senIndex)).css('background-color', '#ffff00');
        		audioPlayer.hiLines[i].css('background', 'none');
        }
        audioPlayer.hiLines=[];

        var spanObj=$(audioPlayer.sentences[audioPlayer.currentSentenceIndex]);
        var idText=spanObj.attr("id");
        var ss=idText.split("-");
        audioPlayer.hilight(audioPlayer.currentPIndex,ss[1]);
        //contentObj.find("#"+idText).css('background-color', '#ffff00');
        audioPlayer.hiLines.push(contentObj.find("#"+idText));
        var curP=$(contentObj.find("p").get(ss[0].substr(4)));

        audioPlayer.currentPIndex=Number(ss[0].substr(4));
        var senIndex = audioPlayer.currentSentenceIndex;
        var sentence = spanObj.text();

        audioPlayer.nextSentenceIndex=audioPlayer.currentSentenceIndex+1;
       if(audioPlayer.currentSentenceIndex==0){
	        if(ss[1]==curP.attr("spanNum")-1 && !IsSentence(sentence.trim()) && audioPlayer.sentences.length>2){
	        		audioPlayer.currentPIndex=Number(ss[0].substr(4))+1;
	        		//audioPlayer.currentSentenceIndex++;
	        		audioPlayer.nextSentenceIndex=2;
	        		var nextSpan=contentObj.find("#span"+audioPlayer.currentPIndex+"-0");
	        		var idTextNext=nextSpan.attr("id");
	        		var ssNext=idTextNext.split("-");
	        		sentence+=nextSpan.text();
	        		audioPlayer.hiLines.push(nextSpan);
	        		audioPlayer.nextSentenceIndex=audioPlayer.currentSentenceIndex+2;
	      		 if (audioPlayer.nextSentenceIndex >= audioPlayer.preTotalSen - 1) {
	          		audioPlayer.delegate.loadNextPara();
	      		}
	        }else{
		        var lastPIndex=ss[0].substr(4)-1;
		        if(lastPIndex>=0){
			       var lastP=$(contentObj.find("p").get(lastPIndex));
			        if(ss[1]==0&&!IsSentence(lastP.text().trim())){

			        		SplitPara(lastP[0],lastPIndex);
			        		var lastSpan=contentObj.find("#span"+lastPIndex+"-"+(lastP.attr("spanNum")-1));
			        		sentence=lastSpan.text()+sentence;
			        		audioPlayer.hiLines.unshift(lastSpan);
			        }
		        }
	        }
        }else{
        		if(audioPlayer.ele1Sentence!=-1)
        		audioPlayer.hiLines=audioPlayer.nextHiLines;
        }
        audioPlayer.beginSentenceIndex=audioPlayer.currentSentenceIndex;

        sentence='';
        for(var i=0;i!=audioPlayer.hiLines.length;i++){
        		audioPlayer.hiLines[i].css('background-color', '#ffff00');
        		sentence+=audioPlayer.hiLines[i].text();
        }
        audioPlayer.nextHiLines=[];
        sentence = sentence.replace(/(^\s*)|(\s*$)/g, "");
        sentence = sentence.replace(/(\r)*\n/g, " ");
        sentence = sentence.replace(new RegExp('<br />', 'gm'), '');
        sentence = sentence.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, "");
        sentence = sentence.replace(/[\~|\`|\@|\#|\$|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\:|\"|\<|\>|\/|\’|\“|\”|\—|\s]/g, " ");
            sentence = sentence.replace(/[\']/g, "");
        var requesttoken = NA.storage('NASDK_JS_requesttoken');
        var mp3 = 'https://api.naturalreaders.com/v2/tts?t=' + encodeURIComponent(sentence) + '&r=' + audioPlayer.speakerOnline + '&s=' + audioPlayer.speedOnline + '&requesttoken=' + requesttoken;

        var nextSentence = '',
            nextMp3 = '';

        if (audioPlayer.nextSentenceIndex >= audioPlayer.sentences.length - 1||audioPlayer.currentSentenceIndex >= audioPlayer.sentences.length - 1) {
            audioPlayer.delegate.loadNextPara();
        }
        if (senIndex + 1 < audioPlayer.sentences.length) {
            nextSentence = $(audioPlayer.sentences[audioPlayer.nextSentenceIndex]).text();


            spanObj=$(audioPlayer.sentences[audioPlayer.nextSentenceIndex]);
	        idText=spanObj.attr("id");
	        ss=idText.split("-");
	        curP=$(contentObj.find("p").get(ss[0].substr(4)));
	        audioPlayer.nextHiLines.push(contentObj.find("#"+idText));
	        if(ss[1]==curP.attr("spanNum")-1 && !IsSentence(nextSentence.trim())){
	        	 	if (audioPlayer.nextSentenceIndex >= audioPlayer.preTotalSen - 1) {
	        	 		var lastSpan=$(audioPlayer.sentences[audioPlayer.sentences.length-1]);
	        	 		var lastId=lastSpan.attr("id");
	        	 		var lastSS=lastId.split("-");
	          		audioPlayer.splitPara(contentObj.find("p").get(Number(lastSS[0].substr(4))+1),Number(lastSS[0].substr(4))+1);
	      		}
	        		var nextSpan=contentObj.find("#span"+(Number(ss[0].substr(4))+1)+"-0");
	        		nextSentence+=(" "+nextSpan.text());
				audioPlayer.nextHiLines.push(nextSpan);
	      		 audioPlayer.nextSentenceIndex++;

	        }else{

	        		//audioPlayer.nextSentenceIndex=audioPlayer.currentSentenceIndex+1;
	        }
        		nextSentence = nextSentence.replace(/(^\s*)|(\s*$)/g, "");
            nextSentence = nextSentence.replace(/(\r)*\n/g, " ");
            nextSentence = nextSentence.replace(new RegExp('<br />', 'gm'), '');
        nextSentence = nextSentence.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, "");
            nextSentence = nextSentence.replace(/[\~|\`|\@|\#|\$|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\:|\"|\<|\>|\/|\’|\“|\”|\—|\s]/g, " ");
            nextSentence = nextSentence.replace(/[\']/g, "");
            nextMp3 = 'https://api.naturalreaders.com/v2/tts?t=' + encodeURIComponent(nextSentence) + '&r=' + audioPlayer.speakerOnline + '&s=' + audioPlayer.speedOnline + '&requesttoken=' + requesttoken;
        }
        if (audioPlayer.ele1Sentence == audioPlayer.currentSentenceIndex||audioPlayer.ele1Sentence ==-1) {
            if (audioPlayer.ele1Sentence != audioPlayer.currentSentenceIndex) {
                audioPlayer.audioEle1.src = mp3;
            }
            audioPlayer.audioEle1.play();
            if (nextMp3 == "") {
                return;
            }
            audioPlayer.audioEle2.src = nextMp3;
            audioPlayer.audioEle2.play();
            var loadFinish = false;
            audioPlayer.audioEle1.onplaying = function() {
                audioPlayer.isSpeaking = true;
                audioPlayer.delegate.bufferFinish();
            }
            audioPlayer.audioEle2.onplaying = function() {
                audioPlayer.isSpeaking = true;
                if (!loadFinish) {
                    loadFinish = true;
                    audioPlayer.audioEle2.pause();
                }
            }
            audioPlayer.ele1Sentence = audioPlayer.currentSentenceIndex;
            audioPlayer.ele2Sentence = audioPlayer.nextSentenceIndex;
        } else {
            if (audioPlayer.ele2Sentence != audioPlayer.currentSentenceIndex) {
                audioPlayer.audioEle2.src = mp3;
            }
            audioPlayer.audioEle2.play();
            if (nextMp3 == "") {
                return;
            }
            audioPlayer.audioEle1.src = nextMp3;
            audioPlayer.audioEle1.play();
            var loadFinish = false;
            audioPlayer.audioEle1.onplaying = function() {
                audioPlayer.isSpeaking = true;
                if (!loadFinish) {
                    loadFinish = true;
                    audioPlayer.audioEle1.pause();
                }
            }
            audioPlayer.audioEle2.onplaying = function() {
                audioPlayer.isSpeaking = true;
                audioPlayer.delegate.bufferFinish();
            }
            audioPlayer.ele2Sentence = audioPlayer.currentSentenceIndex;
            audioPlayer.ele1Sentence = audioPlayer.nextSentenceIndex;
        }


    },
    initOnline: function() {
        audioPlayer.audioEle1.onended = function() {
        		//audioPlayer.disHilight();
            var sentence = audioPlayer.sentences[audioPlayer.currentSentenceIndex];
            audioPlayer.delegate.readChar($(sentence).text().length);
            audioPlayer.currentSentenceIndex=audioPlayer.nextSentenceIndex;
            if (audioPlayer.currentSentenceIndex >= audioPlayer.preTotalSen) {
                audioPlayer.delegate.finish();
                audioPlayer.preTotalSen = audioPlayer.sentences.length;
            }
            audioPlayer.isAutoPlay = true;
            if (audioPlayer.totalChars < audioPlayer.limitChars && !audioPlayer.isStop) {
                audioPlayer.playOnline();
            }
        }
        audioPlayer.audioEle2.onended = function() {
        		//audioPlayer.disHilight();
            var sentence = audioPlayer.sentences[audioPlayer.currentSentenceIndex];
            audioPlayer.delegate.readChar($(sentence).text().length);
            audioPlayer.currentSentenceIndex=audioPlayer.nextSentenceIndex;
            if (audioPlayer.currentSentenceIndex >= audioPlayer.preTotalSen) {
                audioPlayer.delegate.finish();
                audioPlayer.preTotalSen = audioPlayer.sentences.length;
            }
            audioPlayer.isAutoPlay = true;
            if (audioPlayer.totalChars < audioPlayer.limitChars && !audioPlayer.isStop) {
                audioPlayer.playOnline();
            }
        }
        audioPlayer.audioEle1.onpause = function() {
            setTimeout(function() {
                if (audioPlayer.currentSentenceIndex == audioPlayer.ele1Sentence && audioPlayer.isPlaying && !audioPlayer.isPause && audioPlayer.isOnline) audioPlayer.audioEle1.play();
            }, 1000);
        }
        audioPlayer.audioEle2.onpause = function() {
            setTimeout(function() {
                if (audioPlayer.currentSentenceIndex == audioPlayer.ele2Sentence && audioPlayer.isPlaying && !audioPlayer.isPause && audioPlayer.isOnline) audioPlayer.audioEle2.play();
            }, 1000);
        }
        audioPlayer.audioEle1.canplaythrough = function() {
            if (audioPlayer.currentSentenceIndex == audioPlayer.ele1Sentence && audioPlayer.isPlaying && !audioPlayer.isPause && audioPlayer.isOnline) {
                audioPlayer.audioEle1.play();
            }
        }
        audioPlayer.audioEle2.canplaythrough = function() {
            if (audioPlayer.currentSentenceIndex == audioPlayer.ele2Sentence && audioPlayer.isPlaying && !audioPlayer.isPause && audioPlayer.isOnline) {
                audioPlayer.audioEle2.play();
            }
        }
        audioPlayer.audioEle1.onerror = function() {
            if (!audioPlayer.isSpeaking) return;
            window.status = 'Network is bad so skip to the next paragraph.';
            audioPlayer.pause();
            audioPlayer.isPlaying = false;
            audioPlayer.isPause = false;
            audioPlayer.ele2Sentence = -1;
            audioPlayer.ele1Sentence = -1;
            audioPlayer.isStop=true;
            //audioPlayer.playFrom(audioPlayer.currentSentenceIndex);

            setTimeout(function() {
                audioPlayer.playOnline();
            }, 1000);
        }
        audioPlayer.audioEle2.onerror = function() {
            if (!audioPlayer.isSpeaking) return;
            window.status = 'Network is bad so skip to the next paragraph.';
            audioPlayer.pause();
            audioPlayer.isPlaying = false;
            audioPlayer.isPause = false;
            audioPlayer.ele2Sentence = -1;
            audioPlayer.ele1Sentence = -1;
            audioPlayer.isStop=true;
           // audioPlayer.playFrom(audioPlayer.currentSentenceIndex);
           setTimeout(function() {
                audioPlayer.playOnline();
            }, 1000);
        }
        audioPlayer.audioEle1.onprogress = function() {
            if (audioPlayer.currentSentenceIndex == audioPlayer.ele1Sentence) {
                audioPlayer.delegate.buffering();
            }
        }
        audioPlayer.audioEle2.onprogress = function() {
            if (audioPlayer.currentSentenceIndex == audioPlayer.ele2Sentence) {
                audioPlayer.delegate.buffering();
            }
        }
    },
    hilight: function(pIndex,spanIndex,isScroll) {
    		if(!isScroll){isScroll=false;}

//      $(contentObj.find("p").get(audioPlayer.currentPIndex)).css('background', 'none');
//      $(contentObj.find("p").get(senIndex)).css('background-color', '#ffff00');
        //contentObj.find("#span"+audioPlayer.curHiPIndex+"-"+audioPlayer.curHiSpanIndex).css('background', 'none');
        //contentObj.find("#span"+pIndex+"-"+spanIndex).css('background-color', '#ffff00');
        //audioPlayer.curHiPIndex=pIndex;
       // audioPlayer.curHiSpanIndex=spanIndex;
        if (pIndex >= contentObj.find("p").length) return;
        var container = $("html,body");

		NA.storage("DocLastRead:"+docUrl,pIndex,null);
        var    scrollToEle = $(contentObj.find("p").get(pIndex));
        var vTop = scrollToEle.offset().top;
        var containerTop=$(document).scrollTop();;
        //var vTopContent = getElementMargin.top(contentObj);
        //var vBotContent = getElementMargin.bot(contentObj);
        var client = getparastr('client');
        if(client=="app"){
        		if(vTop-containerTop>150 && vTop-containerTop<600 || isScroll){
		        var offset = scrollToEle.offset().top - contentObj.offset().top;
		        container.scrollTop(offset-150);
	        }
        }else{
	        	if(vTop-containerTop>100 && vTop-containerTop<600 || isScroll){
		        var offset = scrollToEle.offset().top - contentObj.offset().top;
		        container.scrollTop(offset);
	        }
        }

    },
    disHilight: function() {
        //$(contentObj.find("p").get(audioPlayer.currentPIndex)).css('background', 'none');
        contentObj.find("#span"+audioPlayer.curHiPIndex+"-"+audioPlayer.curHiSpanIndex).css('background', 'none');
    },
    preOnline: function() {
        audioPlayer.audioEle1.pause();
        audioPlayer.audioEle2.pause();
        audioPlayer.playFromOnline(audioPlayer.currentSentenceIndex - 1);
    },
    nextOnline: function() {
        audioPlayer.audioEle1.pause();
        audioPlayer.audioEle2.pause();
        audioPlayer.playFromOnline(audioPlayer.currentSentenceIndex + 1);
    },
    initOffline: function() {
        audioPlayer.utterThis = null;
        setTimeout(function() {
            audioPlayer.offlineVoices = audioPlayer.synth.getVoices();
            audioPlayer.delegate.getVoiceFinish()
        }, 1000);
    },
    playFromOffline: function(senIndex) {
        if (audioPlayer.utterThis != null) {
            audioPlayer.utterThis.onend = null;
            audioPlayer.utterThis = null;
            audioPlayer.synth.cancel();
        }
        audioPlayer.currentSentenceIndex = senIndex;
        setTimeout(function() {
            audioPlayer.playOffline();
        }, 1000);
    },
    playOffline: function() {
        if (audioPlayer.currentSentenceIndex == audioPlayer.preTotalSen - 1) {
            audioPlayer.delegate.loadNextPara();
        }
        var sentence = audioPlayer.sentences[audioPlayer.currentSentenceIndex];
        sentence = sentence.replace(new RegExp('<br />', 'gm'), '');
        audioPlayer.synth.cancel();
        audioPlayer.utterThis = new SpeechSynthesisUtterance(sentence);
        audioPlayer.utterThis.voice = audioPlayer.offlineSpeaker;
        audioPlayer.utterThis.rate = audioPlayer.onlineSpeedToOffline();
        audioPlayer.utterThis.pitch = audioPlayer.offlinePitch;
        audioPlayer.synth.speak(audioPlayer.utterThis);
        audioPlayer.utterThis.onend = function(event) {
            var sentence = audioPlayer.sentences[audioPlayer.currentSentenceIndex];
            audioPlayer.delegate.readChar(sentence.length);
            if (audioPlayer.currentSentenceIndex >= audioPlayer.preTotalSen - 1) {
                audioPlayer.delegate.finish();
                audioPlayer.preTotalSen = audioPlayer.sentences.length;
            }
            if (audioPlayer.currentSentenceIndex + 1 < audioPlayer.sentences.length) {
                audioPlayer.currentSentenceIndex++;
                audioPlayer.playOffline();
            } else {
                audioPlayer.currentSentenceIndex = 0;
            }
        }
    },
    preOffline: function() {
        audioPlayer.synth.pause();
        audioPlayer.utterThis.onend = null;
        audioPlayer.utterThis = null;
        audioPlayer.synth.cancel();
        if (audioPlayer.currentSentenceIndex - 1 >= 0) {
            audioPlayer.hilight(audioPlayer.currentSentenceIndex - 1);
            audioPlayer.currentSentenceIndex--;
            setTimeout(function() {
                audioPlayer.playOffline();
            }, 1000);
        } else {}
    },
    nextOffline: function() {
        audioPlayer.synth.pause();
        audioPlayer.utterThis.onend = null;
        audioPlayer.utterThis = null;
        audioPlayer.synth.cancel();
        if (audioPlayer.currentSentenceIndex + 1 < audioPlayer.sentences.length) {
            audioPlayer.hilight(audioPlayer.currentSentenceIndex + 1);
            audioPlayer.currentSentenceIndex++;
            setTimeout(function() {
                audioPlayer.playOffline();
            }, 1000);
        } else {
            audioPlayer.currentSentenceIndex = 0;
        }
    },
    init: function() {
        audioPlayer.initOnline();
        audioPlayer.initOffline();
    },
    pre: function() {
        if (audioPlayer.isOnline) {
            audioPlayer.preOnline();
        } else {
            audioPlayer.preOffline();
        }
    },
    next: function() {
        if (audioPlayer.isOnline) {
            audioPlayer.nextOnline();
        } else {
            audioPlayer.nextOffline();
        }
    },
    playFrom: function(senIndex) {
        audioPlayer.isPlaying = true;
        audioPlayer.isPause = false;
        var sentence = audioPlayer.sentences[senIndex];
        if (audioPlayer.isOnline) {
            audioPlayer.playFromOnline(senIndex);
        } else {
            audioPlayer.playFromOffline(senIndex);
        }
    },
    resume: function() {
        audioPlayer.isPause = false;
        if (audioPlayer.isOnline) {
            if (audioPlayer.currentSentenceIndex % 2 == 0) {
                audioPlayer.audioEle1.play();
            } else {
                audioPlayer.audioEle2.play();
            }
        } else {
            audioPlayer.synth.resume();
        }
    },
    pause: function() {
        audioPlayer.isPause = true;
        if (audioPlayer.isOnline) {
            audioPlayer.audioEle1.pause();
            audioPlayer.audioEle2.pause();
        } else {
            audioPlayer.synth.pause();
        }
    },
    splitSentences: function(content) {
        content = content.replace(new RegExp('<br />', 'gm'), '');
        var ss = duee2013.splitsen_txt.splitsenWithLength(content, 100);
        for (var i = 0; i != ss.length; i++) {
            var s = ss[i].replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, "");
            s = s.replace(/[\~|\`|\@|\#|\$|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\:|\"|\'|\<|\>|\/|\’|\“|\”|\—]/g, "");
            audioPlayer.sentences.push(s);
        }
        if(ss.length==0||content=="")audioPlayer.delegate.loadNextPara();
    },
    splitPara:function(p,pIndex){
    		if(typeof(p) == "undefined")return;
    		SplitPara(p,pIndex);
    		for(var i=0;i!=$(p).find("span").length;i++){
    			var span=$($(p).find("span").get(i));
    			if(span.hasClass("naSpan")){
    				audioPlayer.sentences.push(span[0].outerHTML);
    			}
    		}
    },
    onlineSpeedToOffline: function() {
        var offlineSpeed = 1;
        if (audioPlayer.speedOnline <= 0) {
            offlineSpeed += audioPlayer.speakerOnline * (0.5 / 4);
        } else {
            offlineSpeed += audioPlayer.speakerOnline * (1.0 / 9);
        }
        return offlineSpeed;
    }
}

function getparastr(strname) {
    paramValue = "";
    isFound = false;
    if (window.location.href.indexOf("?") > 0 && window.location.href.indexOf("=") > 0) {
        arrSource = unescape(window.location.href).substring(window.location.href.indexOf("?") + 1, window.location.href.length).split("&");
        i = 0;
        while (i < arrSource.length && !isFound) {
            if (arrSource[i].indexOf("=") > 0) {
                if (arrSource[i].split("=")[0].toLowerCase() == strname.toLowerCase()) {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }
    }
    return paramValue;
}
var locationURL = getparastr('url');
var _img = "images/bt1.png",
    _reader = 'Mike';
var isEdit = false;
var isLoading = true;
var currentPdfPage=1;
var listenType="edit";
var docHtml="";
var pdfPageHtmls=[];
var pdfPageStyles=[];
var contentObj=$("#content");
var docUrl="";

function fn_showLayer(layer) {
        var $contentLayer = layer;
        $contentLayer.show().css({
            'margin-top': -$contentLayer.outerHeight() / 2,
            'margin-left': -$contentLayer.outerWidth() / 2,
        });
        $('body').append('<div class="maskLayer"></div>');
    }

function selectrow(senIndex,spanIndex) {
	if (audioPlayer.totalChars >= audioPlayer.limitChars) {
            fn_showLayer($('.buyLayer'));
            $(".btnClose.wordLimit").hide();
            $(".downloadTimeCount").text("waiting...");
            $(".downloadTimeCount").show();
            var seconds = 3;
            var timer;
            timer = setInterval(function() {
                if (seconds == 0) {
                    $(".downloadTimeCount").hide();
                    $(".btnClose.wordLimit").show();
                    clearInterval(timer);
                }
                $(".downloadTimeCount").text(seconds + " s left");
                seconds--;
            }, 1000);
            return;
        }

    if (locationURL != "" && isLoading) return;
    if(!spanIndex){spanIndex=0;}
    if (isEdit && listenType=="edit") {
        audioPlayer.disHilight();
        audioPlayer.currentPIndex = senIndex;
        return;
    }

    $("#play").val("Pause");
    $("#play").addClass("active");
    audioPlayer.isPlaying = false;
    audioPlayer.isPause = false;
    audioPlayer.pause();
    audioPlayer.ele2Sentence = -1;
    audioPlayer.ele1Sentence = -1;
    //audioPlayer.hilight(senIndex,0);
    audioPlayer.currentPIndex = senIndex;
    audioPlayer.sentences = [];
    //audioPlayer.splitSentences($(contentObj.find("p").get(audioPlayer.currentPIndex)).text());
    audioPlayer.splitPara(contentObj.find("p").get(audioPlayer.currentPIndex),audioPlayer.currentPIndex);
    audioPlayer.preTotalSen = audioPlayer.sentences.length;
    if(audioPlayer.sentences.length==0)
    $("#play").removeClass("active");
    else
    audioPlayer.isStop=false;

    audioPlayer.playFrom(spanIndex);
    audioPlayer.hilight(audioPlayer.currentPIndex,0,true);
    isEdit = false;

}

function myBrowser() {
    var userAgent = navigator.userAgent;
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        return "Opera"
    };
    if (userAgent.indexOf("Firefox") > -1) {
        return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    }
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        return "IE";
    };
}

function getRequestToken() {
    $.getJSON("https://api.naturalreaders.com/v2/auth/requesttoken?callback=?&appid=de52ydkplza&appsecret=g13pqbr77k84cggw4oscsggwcos8sco", function(jsonstr) {
        if (jsonstr.rst == 'true') {
            NA.storage('NASDK_JS_requesttoken', jsonstr.requesttoken, 3600);
        } else {
            return false;
        };
    });
}

function ProcessDiv(domObj,pNum){
	for (var i = 0; i != domObj.find("div").length; i++) {
                if ($(domObj.find("div").get(i)).text() != '' && $(domObj.find("div").get(i)).find("p").length == 0) {
                    $(domObj.find("div").get(i)).html("<p>" + $(domObj.find("div").get(i)).html() + "</p>");
                }
            }
            for (var i = 0; i != domObj.find("figcaption").length; i++) {
                if ($(domObj.find("figcaption").get(i)).text() != '' && $(domObj.find("figcaption").get(i)).find("p").length == 0) {
                    $(domObj.find("figcaption").get(i)).html("<p>" + $(domObj.find("figcaption").get(i)).html() + "</p>");
                }
            }

	for (var i = 0; i != domObj.find("a").length; i++) {
		var a=domObj.find("a").get(i);
		$(a).removeAttr("href");
		//a.outerHTML="<p>" + $(domObj.find("a").get(i)).text() + "</p>";
	 }
            for (var i = 0; i != domObj.find("h2").length; i++) {
                if ($(domObj.find("h2").get(i)).text() != '' && $(domObj.find("h2").get(i)).find("p").length == 0) {
                    $(domObj.find("h2").get(i)).html("<p>" + $(domObj.find("h2").get(i)).html() + "</p>");
                }
            }
            for (var i = 0; i != domObj.find("li").length; i++) {
                if ($(domObj.find("li").get(i)).text() != '' && $(domObj.find("li").get(i)).find("p").length == 0) {
                    $(domObj.find("li").get(i)).html("<p>" + $(domObj.find("li").get(i)).html() + "</p>");
                }
            }

            var emptyPs = [];
            for (var i = 0; i != domObj.find("p").length; i++) {
                var ss = $(domObj.find("p").get(i)).text()
                ss = ss.replace(/(^\s*)|(\s*$)/g, "");
                ss = ss.replace(/(\r)*\n/g, " ");
                ss = ss.replace(new RegExp('<br />', 'gm'), '');
        ss = ss.replace(/[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g, "");
        ss = ss.replace(/[\~|\`|\@|\#|\$|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\:|\"|\<|\>|\/|\’|\“|\”|\—|\s|\']/g, "");
                if (ss == '') {
                    emptyPs.push($(domObj.find("p").get(i)));
                }
            }
            for (var i = 0; i != emptyPs.length; i++) {
                emptyPs[i].after("</br>");
                emptyPs[i].remove();
            }
            html = '';
            if (domObj.find("p").length == 0) {
                content =domObj.text();
                content = content.replace(new RegExp('<br />', 'gm'), '');
                audioPlayer.sentences = duee2013.splitsen_txt.splitsen(content);
                for (var i = 0; i != audioPlayer.sentences.length; i++) {
                    html += "<p>" + audioPlayer.sentences[i] + "</p>";
                }
                domObj.html(html);
            }
            for (var i = 0; i != domObj.find("p").length; i++) {
            		if(listenType!="edit"){
            			$(domObj.find("p").get(i)).attr("onclick", "parent.selectrow(" + (i+pNum) + ")");
            		}else{
                		$(domObj.find("p").get(i)).attr("onclick", "selectrow(" + (i+pNum) + ")");
               }
            }
}

function PlayClick(){
	if (locationURL != "" && isLoading) return;
        if (isEdit) {
            isEdit = false;
            if(listenType!="pdf"){
	            $("#content").blur();
	            $("#content").removeClass("centerBolder");
	            $("#content").attr("contenteditable", "true");
            }
            audioPlayer.isPlaying = false;
            audioPlayer.isPause = false;
            audioPlayer.ele2Sentence = -1;
            audioPlayer.ele1Sentence = -1;



           // audioPlayer.hilight(audioPlayer.currentPIndex,0);
            audioPlayer.sentences = [];
            //audioPlayer.splitSentences($(contentObj.find("p").get(audioPlayer.currentPIndex)).text());
            audioPlayer.splitPara(contentObj.find("p").get(audioPlayer.currentPIndex),audioPlayer.currentPIndex);
            audioPlayer.preTotalSen = audioPlayer.sentences.length;
            audioPlayer.playFrom(0);
            $("#play").val("Pause");
            $("#play").addClass("active");
        } else {
            isEdit = true;
            audioPlayer.pause();
            $("#play").removeClass("active");
            if(listenType!="pdf"){
	            $("#content").attr("contenteditable", "true");
	            $("#content").addClass("centerBolder");
            }
            audioPlayer.delegate.bufferFinish();
            $(contentObj.find("p").get(audioPlayer.currentSentenceIndex)).focus();
        }
}

function SplitPara(p,pIndex){//
	var pObj=$(p);
	if(pObj.hasClass("naPara")){
		return;
	}
	var nodes=[];
	for(var i=0;i!=p.childNodes.length;i++){
		if(p.childNodes[i].nodeName=="#text"){
			var text=p.childNodes[i].nodeValue;
			//ss=text.split(".");
			ss=SplitString(text);
			for(var j=0;j!=ss.length;j++){
				if(ss[j].trim().length==0)continue;
//				if(j!=ss.length-1 || (j==ss.length-1 && IsSentence(text.trim())))
//				nodes.push(document.createTextNode(ss[j]+"."));
//				else
				nodes.push(document.createTextNode(ss[j]));
			}
		}else{
			nodes.push(p.childNodes[i]);
		}
	}



	var newParaHtml="";
	var spanHtml="";
	var spanText="";
	var spanIndex=0;
	for(var i=0;i!=nodes.length;i++){
		spanHtml+=nodes[i].nodeName=="#text"?nodes[i].nodeValue:nodes[i].outerHTML;
		var nodeText=nodes[i].nodeName=="#text"?nodes[i].nodeValue:nodes[i].innerText;
		spanText+=nodeText;
		if((typeof(nodeText) != "undefined" && nodeText.trim().length!=0) && (IsSentence(nodeText.trim())&&spanText.length>50 || i==nodes.length-1)){
			var spanObj=$("<span onclick='parent.clickSpan("+pIndex+","+spanIndex+")' id='span"+pIndex+"-"+spanIndex+"'>"+spanHtml+"</span>");
			spanObj.addClass("naSpan");
			newParaHtml+=spanObj[0].outerHTML;
			spanHtml="";
			spanText="";
			spanIndex++;
		}
	}
	pObj.addClass("naPara");
	pObj.attr("spanNum",spanIndex);
	if(newParaHtml!="")
	pObj.html(newParaHtml);
	else
	pObj.remove();
}
function clickSpan(pIndex,spanIndex){

}
$(document).ready(function(e) {
//	if(screen.width<500){
//		var scale=0.5;
//		$(document.body).css("-webkit-transform","scale(" + scale + ")");
//	}
    //NA.storage("CloudDocIndex"+docCount,rst.htmlurl,null);CloudDocIndexCloudDocNum
//  var ul = $('#upload ul');
//  var tpl =$('<li id="alice"><input type="text" value="0" data-width="48" data-height="48"'+
//              ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p><a href="#" onclick="downloadFile(\'Alice.html\',\'Alice.pdf\')">Alice.pdf</a></p><span onclick="downloadFile(\'Alice.html\',\'Alice.pdf\')"></span></li>');
//   tpl.prependTo(ul);
//   tpl =$('<li><input type="text" value="0" data-width="48" data-height="48"'+
//              ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p><a href="#" onclick="downloadFile(\'Introduction.html\',\'Introduction.pdf\')">Introduction.pdf</a></p><span onclick="downloadFile(\'Introduction.html\',\'Introduction.pdf\')"></span></li>');
//   tpl.prependTo(ul);
    if (NA.storage("CloudDocNum") == null||NA.storage("CloudDocNum") == ""||Number(NA.storage("CloudDocNum")) == 0) {//if (true) {//
        NA.storage("CloudDocNum", 2, null);
        NA.storage("CloudDocNameIndex1","Alice.pdf",null);
    		NA.storage("CloudDocUrlIndex1","Alice.html",null);
    		NA.storage("CloudDocNameIndex2","Introduction.pdf",null);
    		NA.storage("CloudDocUrlIndex2","Introduction.html",null);
    		NA.storage("CloudDocNameIndex3","",null);
    		NA.storage("CloudDocUrlLimit:Introduction.html","Introduction.html",null);
    		NA.storage("CloudDocUrlLimit:Alice.html","Alice.html",null);
    }
    $("#downloadBtn").hide();
    var docNames=[],docUrls=[];
    for(var i=1;i!=4;i++){
    		if(	NA.storage("CloudDocUrlLimit:"+NA.storage("CloudDocUrlIndex"+i))!=null&&	NA.storage("CloudDocUrlLimit:"+NA.storage("CloudDocUrlIndex"+i))!=""){
    			docNames.push(NA.storage("CloudDocNameIndex"+i));
    			docUrls.push(NA.storage("CloudDocUrlIndex"+i));
    		}
    }
    NA.storage("CloudDocNum", docNames.length, null);
    for(var i=1;i!=docNames.length+1;i++){
    		NA.storage("CloudDocNameIndex"+i,docNames[i-1],null);
    		NA.storage("CloudDocUrlIndex"+i,docUrls[i-1],null);
    }
    var docCount = Number(NA.storage("CloudDocNum"));
    for (var i = 0; i != docCount; i++) {
        $("#documentList").prepend(" <li class=\"docsitem\"><a href='#' onclick='downloadDoc(" + (i + 1) + ")'>" + NA.storage("CloudDocNameIndex" + (i + 1)) + "</a>    <a href='#' onclick='deleteDoc(" + (i + 1) + ")'  style=\"float:right\">DELETE</a></li>");
    }

    if (NA.storage("NaTTSSpeaker") != null) {
        audioPlayer.speakerOnline = parseInt(NA.storage("NaTTSSpeaker"));
    }
    if (NA.storage("NaTTSSpeed") != null) {
        audioPlayer.speedOnline = parseInt(NA.storage("NaTTSSpeed"));
        $('.selectSpeed').find('.selectHead .speed').text(NA.storage("NaTTSSpeed"));
    }
    if (NA.storage("NaTTSReader") != null) {
        $('.selectReader').find('.selectHead .readerName').text(NA.storage("NaTTSReader"));
    }
    if (NA.storage("NaTTSImg") != null) {
        $('.selectReader').find('.selectHead img').attr('src', NA.storage("NaTTSImg"));
    }
    var client = getparastr('client');
    if (!IsPC()) {
//  		$(".mainHeader").hide();
//    	$(".topAD").hide();
    		if(client != "app"){
        window.location.href = "app/index.html";
        return;
      }else{
      	$("#addDocument").remove();
      	$(".pagination").remove();
      	if(screen.width<500){
            		$("#downloadBtn").remove();
            }
//    	if(screen.width<500){
//    		$(".mainHeader .logo img").attr("src","images/logo_phone.png");
//    	}
      	//$(".mainHeader .logo").remove();
      }
    }
    var add = duee.core.readCookie("NaFavorite");
    if (add == "add") {
        $('.topAD').hide();
    } else {
        if (locationURL != "") {
            $('.topAD').hide();
            NA.storage("NaFavorite", "add", null);
        }
    }
    var date = new Date();
    var days = date.getDate();
    var month = date.getMonth();
    var timeStr = duee.core.readCookie("NaTTSDate");
    if (timeStr == '' || timeStr == undefined) {
        timeStr = month + '-' + days;
        NA.storage("NaTTSDate", timeStr, null);
        NA.storage("NaTTSTodayChar", '0', null);
    } else {
        times = timeStr.split('-');
        if (times[0] == month + '' && times[1] == days + '') {
            audioPlayer.totalChars = Number(duee.core.readCookie("NaTTSTodayChar"));
            audioPlayer.limitChars = audioPlayer.deltaLimit * (parseInt(audioPlayer.totalChars / audioPlayer.deltaLimit) + 1);
            if (audioPlayer.limitChars > audioPlayer.day) {
                audioPlayer.limitChars = audioPlayer.dayChars;
            }
        } else {
            timeStr = month + '-' + days;
            NA.storage("NaTTSDate", timeStr, null);
            NA.storage("NaTTSTodayChar", '0', null);
        }
    }
    NA.init("de52ydkplza", "g13pqbr77k84cggw4oscsggwcos8sco");
    getRequestToken();
    var timer = window.setInterval("getRequestToken()", 60 * 50 * 1000);
    audioPlayer.delegate.readChar = function(chars) {
        audioPlayer.totalChars = Number(duee.core.readCookie("NaTTSTodayChar"));
        audioPlayer.totalChars += chars;
        NA.storage("NaTTSTodayChar", '' + audioPlayer.totalChars, null);
        if (audioPlayer.totalChars > audioPlayer.limitChars) {
            if (audioPlayer.limitChars < audioPlayer.dayChars) {
                audioPlayer.isStop = true;
                audioPlayer.pause();
                fn_showLayer($('.downloadLayer'));
                audioPlayer.limitChars += audioPlayer.deltaLimit;
            } else {
            		audioPlayer.limitChars = audioPlayer.dayChars;
            		audioPlayer.isStop = true;
            		audioPlayer.pause();
                $("#play").removeClass("active");
                fn_showLayer($('.buyLayer'));
            }
            $(".btnClose.wordLimit").hide();
            $(".downloadTimeCount").text("waiting...");
            $(".downloadTimeCount").show();
            var seconds = 3;
            var timer;
            timer = setInterval(function() {
                if (seconds == 0) {
                    $(".downloadTimeCount").hide();
                    $(".btnClose.wordLimit").show();
                    clearInterval(timer);
                }
                $(".downloadTimeCount").text(seconds + " s left");
                seconds--;
            }, 1000);
        }
    }
    $("#checkLi").remove();
    var onlineSpeakerHtml = '',
        offlineSpeakerHtml = '';
    onlineSpeakerHtml = $("#speaker").html();
    $("#content").focus();
    isEdit = true;
    audioPlayer.audioEle1 = $("#s1")[0];
    audioPlayer.audioEle2 = $("#s2")[0];
    if (locationURL != "") {
    		listenType="web";
        $('.topAD').hide();
        $("#content").text(" loading pages......");
        $.get('https://api.naturalreaders.com/v4/files/webjson', {
            url: '' + locationURL,
            apikey: 'b98x9xlfs54ws4k0wc0o8g4gwc0w8ss'
        }, function(data) {
            var myjson = '';
            if (data.rst == 'OK') {
                $("#content").html("<h1>" + data.title + "</h1></br>" + data.content);
                for (var i = 0; i != $("#content").find("span").length; i++) {
                    if ($($("#content").find("span").get(i)).closest("p").text() == "") {
                        $($("#content").find("span").get(i)).html("");
                    }
                }
                for (var i = 0; i != $("#content").find("a").length; i++) {
                    if ($($("#content").find("a").get(i)).closest("p").text() == "") {
                        $($("#content").find("a").get(i)).html("");
                    }
                }
                for (var i = 0; i != $("#content").find("img").length; i++) {
                    var href = $($("#content").find("img").get(i)).attr("src");
                    var reg = new RegExp("http://");
                    if (reg.test(href)) {
                        $($("#content").find("img").get(i)).attr("src", "");
                    }
                }
                for (var i = 0; i != $("#content").find("p").length; i++) {
                    $($("#content").find("p").get(i)).attr("onclick", "selectrow(" + i + ")");
                }
                isEdit = true;
                isLoading = false;
                $("#content").focus();
            } else {
                alert('failed.');
            }
        });
    } else {
        html = '';
        if ($("#content").find("p").length == 0) {
            content = $("#content").text();
            content = content.replace(new RegExp('<br />', 'gm'), '');
            audioPlayer.sentences = duee2013.splitsen_txt.splitsen(content);
            for (var i = 0; i != audioPlayer.sentences.length; i++) {
                html += "<p>" + audioPlayer.sentences[i] + "</p>";
            }
            $("#content").html(html);
        }
        for (var i = 0; i != $("#content").find("p").length; i++) {
            $($("#content").find("p").get(i)).attr("onclick", "selectrow(" + i + ")");
        }
        audioPlayer.isPlaying = false;
        audioPlayer.isPause = false;
        audioPlayer.ele2Sentence = -1;
        audioPlayer.ele1Sentence = -1;
    }
    audioPlayer.isOnline = true;
    audioPlayer.init();
    audioPlayer.delegate.getVoiceFinish = function() {
        audioPlayer.offlineSpeaker = audioPlayer.offlineVoices[0];
        offlineSpeakerHtml += '<dl>';
        for (var i = 0; i != audioPlayer.offlineVoices.length; i++) {
            var option = "<dd><span class='readerName' value='" + audioPlayer.offlineVoices[i].name + "'>" + audioPlayer.offlineVoices[i].lang + "," + audioPlayer.offlineVoices[i].name + "</span></dd>";
            offlineSpeakerHtml += option;
        }
        offlineSpeakerHtml += '</dl>';
        for (var i = 0; i != audioPlayer.offlineVoices.length; i++) {
            var option = "<option value='" + audioPlayer.offlineVoices[i].name + "'>" + audioPlayer.offlineVoices[i].lang + "," + audioPlayer.offlineVoices[i].name + "</option>";
            $("#offlineReader").append(option);
        }
    }
    audioPlayer.delegate.loadNextPara = function() {
    		var pLength=contentObj.find("p").length;
        if (Number(audioPlayer.currentPIndex) + 1 < pLength) {
            //audioPlayer.splitSentences($(contentObj.find("p").get(audioPlayer.currentPIndex + 1)).text());
            var lastSpan=$(audioPlayer.sentences[audioPlayer.sentences.length-1]);
		    var lastId=lastSpan.attr("id");
		    var lastSS=lastId.split("-");
		    audioPlayer.splitPara(contentObj.find("p").get(Number(lastSS[0].substr(4))+1),Number(lastSS[0].substr(4))+1);
        }
    }
    audioPlayer.delegate.finish = function() {
        audioPlayer.disHilight();
        audioPlayer.currentPIndex++;
        //audioPlayer.hilight(audioPlayer.currentPIndex,0); audioPlayer.currentPIndex >= contentObj.find("p").length||
        if (audioPlayer.currentSentenceIndex>=audioPlayer.sentences.length) {
        		audioPlayer.delegate.bufferFinish();
            audioPlayer.disHilight();
            audioPlayer.pause();
            audioPlayer.isStop=true;
            $("#play").removeClass("active");
            if(listenType!="pdf"){
	            $("#content").addClass("centerBolder");
	            $("#content").attr("contenteditable", "true");
	            audioPlayer.currentPIndex = 0;
            }else{

            }
            isEdit = true;

        		if(listenType=="pdf"){
        			currentPdfPage++;
        			isEdit=false;

		    		if(currentPdfPage<pdfPageHtmls.length){
		    			LoadPdfPage(currentPdfPage);
		    			selectrow(audioPlayer.currentPIndex);
		    		}else{
		    			currentPdfPage=0;
		    			audioPlayer.currentPIndex=0;
		    			isEdit=true;
		    		}
		    		return;
		    }


        } else {
            //audioPlayer.hilight(audioPlayer.currentPIndex,0);
        }
    }
    audioPlayer.delegate.buffering = function() {
        $("#loadingText").text("Loading audio files...");
        //window.status="Loading audio files...";
    }
    audioPlayer.delegate.bufferFinish = function() {
            $("#loadingText").text("");
        } //
    $("#downloadBtn").click(function() {
        window.location.href = "download.html";
    });
    $("#addDocument").click(function() {
    	//listenType="pdf";
    		//downloadHTML('https://naturalreaderonline.s3.amazonaws.com/c939jyyba20osw48swg8owo04.html');
   		//return;
        fn_showLayer($('.uploadLayer'));
        //$("#fileToUpload").click();
    });
    $("#documentsBtn").click(function() {
        fn_showLayer($('.documentsLayer'));
    });
    if (NA.storage("AddTipConfirmed") != null) {
        $("#addTip").hide();
    }
    $("#confirmAdd").click(function() {

        $("#addTip").hide();
        NA.storage("AddTipConfirmed", "ok", null);
    });
    $("#play").click(function() {
//  	fn_showLayer($('.buyLayer'));
//  	return;
	    	if (isEdit && listenType!="pdf") {
	    		ProcessDiv($("#content"),0);
	    	}
	    	if (audioPlayer.totalChars >= audioPlayer.limitChars) {
            fn_showLayer($('.buyLayer'));
            $(".btnClose.wordLimit").hide();
            $(".downloadTimeCount").text("waiting...");
            $(".downloadTimeCount").show();
            var seconds = 3;
            var timer;
            timer = setInterval(function() {
                if (seconds == 0) {
                    $(".downloadTimeCount").hide();
                    $(".btnClose.wordLimit").show();
                    clearInterval(timer);
                }
                $(".downloadTimeCount").text(seconds + " s left");
                seconds--;
            }, 1000);
            return;
        }
        PlayClick();
    });
    $("#pre").click(function() {
    	audioPlayer.pause();
    	audioPlayer.isStop=true;
    	audioPlayer.ele1Sentence=-1;
    	audioPlayer.ele2Sentence=-1;
    	var pIndex=0;

        //pIndex=audioPlayer.currentPIndex;
        //audioPlayer.beginSentenceIndex=
    		if(audioPlayer.beginSentenceIndex>0){
    			audioPlayer.pause();
    			var beginIndex=audioPlayer.beginSentenceIndex-1;
    			for(var i=beginIndex;i!=-1;i--){
    				var span=$(audioPlayer.sentences[i]);
    				if(IsSentence(span.text().trim())){

    					audioPlayer.playFrom(i);
    					return;
    				}
    			}

    			//selectrow(audioPlayer.currentPIndex,audioPlayer.currentSentenceIndex-1);
    			//return;
    		}else{
    			var spanObj=$(audioPlayer.hiLines[0]);
        var idText=spanObj.attr("id");
        var ss=idText.split("-");
        pIndex=Number(ss[0].substr(4));
    		}
    		//if(pIndex-1<0)pIndex=1;
        if (pIndex - 1 >= 0) {
        		var curP=$(contentObj.find("p").get(pIndex - 1));
        		SplitPara(contentObj.find("p").get(pIndex - 1),pIndex - 1);
            selectrow(pIndex - 1,curP.attr("spanNum")-1);
 			//selectrow(pIndex - 1);
        }else{
        		SplitPara(contentObj.find("p").get(0),0);
            selectrow(0,0);
//      		if(listenType=="pdf"){
//      			currentPdfPage--;
//		    		//LoadPdfPage(currentPdfPage);
//		    		//PlayClick();
//		    		return;
//		    }
        }
    });
    $("#next").click(function() {
    	audioPlayer.pause();
    	audioPlayer.isStop=true;
    	audioPlayer.ele1Sentence=-1;
    	audioPlayer.ele2Sentence=-1;
    		audioPlayer.delegate.loadNextPara();
    		 var spanObj=$(audioPlayer.sentences[audioPlayer.currentSentenceIndex]);
        var idText=spanObj.attr("id");
        var ss=idText.split("-");
        var pIndex=Number(ss[0].substr(4));
        pIndex=audioPlayer.currentPIndex;
    		if(audioPlayer.currentSentenceIndex<audioPlayer.sentences.length-1){
    			audioPlayer.pause();
    			var next=1;
    			if(listenType=="pdf")next=2;
    			audioPlayer.playFrom(audioPlayer.currentSentenceIndex+1);
    			return;
    		}

        if (pIndex + 1 < contentObj.find("p").length) {
            //var curP=$(contentObj.find("p").get(audioPlayer.currentPIndex + 1));
        		//SplitPara(contentObj.find("p").get(audioPlayer.currentPIndex + 1),audioPlayer.currentPIndex + 1);
            selectrow(pIndex + 1,0);
        }else{
        		if(listenType=="pdf"){
        			currentPdfPage++;
        			if(currentPdfPage>pdfPageHtmls.length){
		    			currentPdfPage=pdfPageHtmls.length;
		    			return;
		    		}
		    		LoadPdfPage(currentPdfPage);
		    		isEdit=false;
		    		selectrow(audioPlayer.currentPIndex + 1);
		    		//PlayClick();
		    		return;
		    }
        }
    });
    $("#edit").click(function() {
        audioPlayer.pause();
        $("#play").removeClass("active");
        $("#play").val("Play");
        audioPlayer.isPause = true;
        if (isEdit) {
            isEdit = false;
            $("#content").attr("contenteditable", "fasle");
        } else {
            isEdit = true;
            $("#content").attr("contenteditable", "true");
            $("#content").focus();
        }
    });
    $("#speedRange").change(function() {
        $("#speedLbl").text($("#speedRange").val());
        audioPlayer.speedOnline = $("#speedRange").val();
        if (!audioPlayer.isPlaying || !audioPlayer.isOnline || audioPlayer.isPause) return;
        audioPlayer.isPlaying = false;
        audioPlayer.isPause = false;
        audioPlayer.audioEle1.pause();
        audioPlayer.audioEle2.pause();
        audioPlayer.ele2Sentence = -1;
        audioPlayer.ele1Sentence = -1;
        audioPlayer.playFrom(audioPlayer.currentSentenceIndex);
    });
    $("#speedRangeOff").change(function() {
        $("#speedLblOff").text($("#speedRangeOff").val());
        audioPlayer.offlineSpeed = $("#speedRangeOff").val();
        if (!audioPlayer.isPlaying || audioPlayer.isOnline || audioPlayer.isPause) return;
        audioPlayer.isPlaying = false;
        audioPlayer.isPause = false;
        audioPlayer.pause();
        audioPlayer.playFrom(audioPlayer.currentSentenceIndex);
    });
    $("#onlineReader").change(function() {
        audioPlayer.speakerOnline = $("#onlineReader").val();
        if (!audioPlayer.isPlaying || !audioPlayer.isOnline || audioPlayer.isPause) return;
        audioPlayer.isPlaying = false;
        audioPlayer.isPause = false;
        audioPlayer.audioEle1.pause();
        audioPlayer.audioEle2.pause();
        audioPlayer.ele2Sentence = -1;
        audioPlayer.ele1Sentence = -1;
        audioPlayer.playFrom(audioPlayer.currentSentenceIndex);
    });
    $("#offlineReader").change(function() {
        for (var i = 0; i != audioPlayer.offlineVoices.length; i++) {
            if ($("#offlineReader").val() == audioPlayer.offlineVoices[i].name) {
                audioPlayer.offlineSpeaker = audioPlayer.offlineVoices[i];
                break;
            }
        }
        if (!audioPlayer.isPlaying || audioPlayer.isOnline || audioPlayer.isPause) return;
        audioPlayer.isPlaying = false;
        audioPlayer.isPause = false;
        audioPlayer.pause();
        audioPlayer.playFrom(audioPlayer.currentSentenceIndex);
    });
    $("#onlineCheck").change(function() {
        var playStait = false;
        if (audioPlayer.isPlaying && !audioPlayer.isPause) {
            playStait = true;
        }
        audioPlayer.pause();
        audioPlayer.isPause = false;
        if (audioPlayer.isOnline) {
            $("#speaker").html(offlineSpeakerHtml);
            audioPlayer.isOnline = false;
            $("#speakerImg").attr('src', null);
            $("#speakerName").text(audioPlayer.offlineSpeaker.name);
        } else {
            audioPlayer.isOnline = true;
            $("#speaker").html(onlineSpeakerHtml);
            $("#speakerImg").attr('src', _img);
            $("#speakerName").text(_reader);
        }
        if (playStait) {
            selectrow(audioPlayer.currentPIndex);
        }
    });
    $('.contentLayer .btnClose').click(function() {
    		for(var i=0;i!=3;i++){
    			if(!$("#uploadUl li:eq("+i+")").hasClass('working')){
    				$($("#uploadUl li:eq("+i+")").find('canvas')).remove();
    			}
    		}
   	 	$("#fileSizeLimit").text("");
        $(this).closest('.contentLayer').hide();
        $('.maskLayer').remove();
        if($(this).closest('.contentLayer').hasClass('uploadLayer'))return;
        audioPlayer.isStop = false;
        //if (audioPlayer.limitChars < 30000) {
        if (audioPlayer.totalChars >= audioPlayer.dayChars) {
            return;
        }
        audioPlayer.playOnline();
    });


    $(".downloadDiv").click(function() {
        window.location.href = "download.html";
    });
});
$(function() {
    $('.topAD .btnClose').click(function() {
        $(this).closest('.topAD').hide();
    });
    $('.contentInfo .btnClose').click(function() {
    		if(listenType!='edit'){
    			$("#content").show();
    			$("#iframeDiv").html("");
    			$("#docContent").hide();
    			$(".contentInfo").attr("style","");
    			$(".explainList").attr("style","");
    			$(".mainFooter").attr("style","");
    			//return;
    		}else{
    			$(this).siblings('.info').empty();
    		}

    		//$("#downloadBtn").hide();
    		listenType="edit";
        contentObj=$("#content");
        audioPlayer.pause();
        $("#play").removeClass("active");
        $("#play").val("Play");
        audioPlayer.isPause = true;
        isEdit = true;
        $("#content").attr("contenteditable", "true");
        $("#content").focus();
        audioPlayer.currentSentenceIndex = 0;
        audioPlayer.currentPIndex=0;
        audioPlayer.ele1Sentence=-1;
        audioPlayer.ele2Sentence=-1;
    });
    $('.btnPlayStop').click(function() {
        if (locationURL != "" && isLoading) return;
    });
    $('.selectHead').click(function() {
        $(this).next().show();
        var name=$(this).next().attr("id");
        if(name=="speaker")
        $("#speedList").hide();
        else
         $("#speaker").hide();

        return false;
    });
    $('.selectReader').on('click', 'dd', function() {
        if (audioPlayer.isOnline) {
            _img = $(this).find('img').attr('src'), _reader = $(this).find('.readerName').text();
            var speaker = 0;
            if (_reader == "Mike") {
                speaker = 1;
            } else if (_reader == "Crystal") {
                speaker = 11;
            } else if (_reader == "Rich") {
                speaker = 13;
            } else if (_reader == "Ray") {
                speaker = 14;
            } else if (_reader == "Heather") {
                speaker = 26;
            } else if (_reader == "Laura") {
                speaker = 17;
            } else if (_reader == "Lauren") {
                speaker = 17;
            } else if (_reader == "Ryan") {
                speaker = 33;
            } else if (_reader == "Peter") {
                speaker = 31;
            } else if (_reader == "Rachel") {
                speaker = 32;
            } else if (_reader == "Charles") {
                speaker = 2;
            } else if (_reader == "Audrey") {
                speaker = 3;
            } else if (_reader == "Graham") {
                speaker = 25;
            } else if (_reader == "Bruno") {
                speaker = 22;
            } else if (_reader == "Alice") {
                speaker = 21;
            } else if (_reader == "Alain") {
                speaker = 7;
            } else if (_reader == "Juliette") {
                speaker = 8;
            } else if (_reader == "Klaus") {
                speaker = 28;
            } else if (_reader == "Sarah") {
                speaker = 35;
            } else if (_reader == "Reiner") {
                speaker = 5;
            } else if (_reader == "Klara") {
                speaker = 6;
            } else if (_reader == "Rose") {
                speaker = 20;
            } else if (_reader == "Alberto") {
                speaker = 19;
            } else if (_reader == "Vittorio") {
                speaker = 36;
            } else if (_reader == "Chiara") {
                speaker = 23;
            } else if (_reader == "Anjali") {
                speaker = 4;
            } else if (_reader == "Arnaud") {
                speaker = 9;
            } else if (_reader == "Giovanni") {
                speaker = 10;
            } else if (_reader == "Crystal") {
                speaker = 11;
            } else if (_reader == "Francesca") {
                speaker = 12;
            } else if (_reader == "Claire") {
                speaker = 15;
            } else if (_reader == "Julia") {
                speaker = 16;
            } else if (_reader == "Mel") {
                speaker = 18;
            } else if (_reader == "Juli") {
                speaker = 27;
            } else if (_reader == "Laura") {
                speaker = 29;
            } else if (_reader == "Lucy") {
                speaker = 30;
            } else if (_reader == "Salma") {
                speaker = 34;
            } else if (_reader == "Tracy") {
                speaker = 37;
            } else if (_reader == "Lulu") {
                speaker = 38;
            } else if (_reader == "Sakura") {
                speaker = 39;
            } else if (_reader == "Mehdi") {
                speaker = 40;
            }
            audioPlayer.speakerOnline = speaker;
            $(this).closest('.selectReader').find('.selectHead img').attr('src', _img);
            $(this).closest('.selectReader').find('.selectHead .readerName').text(_reader);
            NA.storage("NaTTSReader", _reader, null);
            NA.storage("NaTTSImg", _img, null);
            NA.storage("NaTTSSpeaker", speaker, null);
            if (!audioPlayer.isPlaying || !audioPlayer.isOnline || audioPlayer.isPause) return;
            audioPlayer.isPlaying = false;
            audioPlayer.isPause = false;
            audioPlayer.audioEle1.pause();
            audioPlayer.audioEle2.pause();
            audioPlayer.ele2Sentence = -1;
            audioPlayer.ele1Sentence = -1;
            audioPlayer.playFrom(audioPlayer.currentSentenceIndex);
        } else {
            var speaker = $(this).find('.readerName').text();
            var s = speaker.split(',');
            speaker = s[1];
            for (var i = 0; i != audioPlayer.offlineVoices.length; i++) {
                if (speaker == audioPlayer.offlineVoices[i].name) {
                    audioPlayer.offlineSpeaker = audioPlayer.offlineVoices[i];
                    break;
                }
            }
            $(this).closest('.selectReader').find('.selectHead img').attr('src', null);
            $(this).closest('.selectReader').find('.selectHead .readerName').text(audioPlayer.offlineSpeaker.name);
            if (audioPlayer.isOnline || audioPlayer.isPause) return;
            audioPlayer.isPlaying = false;
            audioPlayer.isPause = false;
            audioPlayer.pause();
            audioPlayer.playFrom(audioPlayer.currentSentenceIndex);
        }

    });
    $('.selectSpeed').on('click', 'dd', function() {
        var _speed = $(this).text();
        NA.storage("NaTTSSpeed", _speed, null);
        $(this).closest('.selectSpeed').find('.selectHead .speed').text(_speed);
        audioPlayer.speedOnline = _speed;
        if (!audioPlayer.isPlaying || !audioPlayer.isOnline || audioPlayer.isPause) return;
        audioPlayer.isPlaying = false;
        audioPlayer.isPause = false;
        audioPlayer.audioEle1.pause();
        audioPlayer.audioEle2.pause();
        audioPlayer.ele2Sentence = -1;
        audioPlayer.ele1Sentence = -1;
        audioPlayer.playFrom(audioPlayer.currentSentenceIndex);

    });
    $(document).click(function() {
        $('.selectInfo').hide();
    });
    $(window).scroll(function() {
//  	if (!IsPC() && client == "app") {
//      return;
//  }
        var _cH = $('.mainContent').offset().top;
        var _wH = $(window).scrollTop();
        if (_wH > _cH) {
            $('.mainHeader, .centerContent').addClass('fixed');
            $("#downloadBtn").show();
            $("#shareLi").css("display","none");
        } else {
            $('.mainHeader, .centerContent').removeClass('fixed');
            $("#downloadBtn").hide();
            $("#shareLi").css("display","block");
        }
    });
})

function fb_publish() {
    var publish = {
        method: 'feed',
        message: 'getting educated about Facebook Connect',
        name: 'NaturalReaders',
        caption: 'NaturalReaders',
        description: ('We can listen to the book now.'),
        link: 'https://www.naturalreaders.com/index.php',
        picture: 'https://www.naturalreaders.com/images/facebook_2.png',
        actions: [{
            name: 'NaturalReader Online',
            link: 'https://www.naturalreaders.com/index.html'
        }],
        user_message_prompt: 'Share your thoughts about RELL'
    };
}

function twitter_share(width, height) {
    day = new Date();
    id = day.getTime();
    var url = 'https://twitter.com/home?status=https://www.naturalreaders.com/index.php';
    eval("page" + id + " = window.open(url, '" + id + "', 'toolbar=0,scrollbars=1,location=1,statusbar=0,menubar=0,resizable=0,width=" + width + ", height=" + height + ", left = 363, top = 144');")
}

function google_share(width, height) {
    var url = 'https://plus.google.com/share?url=https://www.naturalreaders.com/index.html';
    window.open(url, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=' + width + ', height=' + height + ', left = 363, top = 144');
}

function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

function fileSelected() {
    $("#uploadTip").hide();
    $("#uploadprogressbar").width('0%');
    $("#uploadprogresstxt").text('0%');
    var $contentLayer = $('.uploadLayer');
    $contentLayer.show().css({
        'margin-top': -$contentLayer.outerHeight() / 2,
        'margin-left': -$contentLayer.outerWidth() / 2,
    });
    $('body').append('<div class="maskLayer"></div>');
    var file = document.getElementById('fileToUpload').files[0];
    document.getElementById('fileName').innerHTML = file.name;
    uploadFile();
}

function uploadFile() {
    var fd = new FormData();
    fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener("load", uploadComplete, false);
    xhr.addEventListener("error", uploadFailed, false);
    xhr.addEventListener("abort", uploadCanceled, false);

    xhr.open("POST", "https://api.naturalreaders.com/v4/files/up?apikey=b98x9xlfs54ws4k0wc0o8g4gwc0w8ss&action=tohtml"); //修改成自己的接口
    xhr.send(fd);
}

function uploadProgress(evt) {
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        $("#uploadprogressbar").width(percentComplete.toString() + '%');
        $("#uploadprogresstxt").text(percentComplete.toString() + '%');
    } else {
        document.getElementById('progressNumber').innerHTML = 'unable to compute';
    }
}

function uploadComplete(evt) {
    rst = JSON.parse(evt.target.responseText);
    //document.getElementById('download').setAttribute("href",rst.htmlurl);
    //alert(evt.target.responseText);
    //Number(duee.core.readCookie("NaTTSTodayChar"));
    //NA.storage("NaTTSTodayChar",''+audioPlayer.totalChars,null);
    if (NA.storage("CloudDocNum") == null) {
        NA.storage("CloudDocNum", 0, null);
    }
    var docCount = Number(NA.storage("CloudDocNum")) + 1;
    NA.storage("CloudDocNum", docCount, null);
    var fileName = document.getElementById('fileName').innerHTML;
    NA.storage("CloudDocNameIndex" + docCount, document.getElementById('fileName').innerHTML, null);
    NA.storage("CloudDocUrlIndex" + docCount, rst.htmlurl, null);
    $("#documentList").append(" <li class=\"docsitem\"><a href='#' onclick='downloadDoc(" + docCount + ")'>" + NA.storage("CloudDocNameIndex" + docCount) + "</a>    <a href='#' onclick='deleteDoc(" + docCount + ")' style=\"float:right\">DELETE</a></li>");
    $("#uploadTip").show();
}

function downloadDoc(docIndex) {
    var url = NA.storage("CloudDocUrlIndex" + docIndex);

    var index1=NA.storage("CloudDocNameIndex" + docIndex).lastIndexOf(".");
	var index2=NA.storage("CloudDocNameIndex" + docIndex).length;
	listenType=NA.storage("CloudDocNameIndex" + docIndex).substring(index1,index2);//后缀名

	downloadHTML(url);
}

function deleteDoc(docIndex) {
    var docCount = Number(NA.storage("CloudDocNum"));
    var docUrls = new Array();
    var docNames = new Array();
    $("#documentList").html("");
    for (var i = 1; i != docCount + 1; i++) {
        if (i != docIndex) {
            docUrls.push(NA.storage("CloudDocUrlIndex" + i));
            docNames.push(NA.storage("CloudDocNameIndex" + i));
        }
    }
    for (var i = 1; i != docUrls.length + 1; i++) {
        NA.storage("CloudDocNameIndex" + i, docNames[i - 1], null);
        NA.storage("CloudDocUrlIndex" + i, docUrls[i - 1], null);
        $("#documentList").append("<li class=\"docsitem\"><a href='#' onclick='downloadDoc(" + i + ")'>" + docNames[i - 1] + "</a>    <a href='#' onclick='deleteDoc(" + i + ")' style=\"float:right\">DELETE</a></li>");
    }
    docCount--;
    NA.storage("CloudDocNum", docCount, null);
}

function uploadFailed(evt) {
    alert("There was an error attempting to upload the file.");
}

function uploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
}

function downloadHTML(url) {
	docUrl=url;
	//$("#downloadBtn").hide();
	$('.uploadLayer').hide();
	var $contentLayer = $('.waitingFileOpenLayer');
    $contentLayer.show().css({
            'margin-top': -$contentLayer.outerHeight() / 2,
            'margin-left': -$contentLayer.outerWidth() / 2,
        });
        $('body').append('<div class="maskLayer"></div>');
     if(!url.startWith("http")){
		downloadComplete(url);
		return;
	}


    //var fd = new FormData();
    //fd.append("fileToUpload", document.getElementById('fileToUpload').files[0]);
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", downloadProgress, false);
    xhr.addEventListener("load", downloadComplete, false);
    xhr.addEventListener("error", downloadFailed, false);
    xhr.addEventListener("abort", downloadCanceled, false);
    //xhr.open("GET", "https://naturalreaderonline.s3.amazonaws.com/f3kpjpsm8gg8ogsk84c8cg0w0.html");//修改成自己的接口
    xhr.open("GET", "https://api.naturalreaders.com/reload.php?url=" + url); //修改成自己的接口
    //xhr.send(fd);
    xhr.send('');
    //st=new Date().getTime();



}

function downloadProgress(evt) {
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
    } else {
        document.getElementById('progressNumber').innerHTML = 'unable to compute';
    }
}

function downloadComplete(evt) {
    /* 服务器端返回响应时候触发event事件*/
    //document.getElementById('formResult').innerHTML = 'Response:<br>' + evt.target.responseText;
    //document.getElementById('download').innerHTML = 'Click Here to open HTML."

	audioPlayer.loadedPdfPages=[];
    audioPlayer.pause();
    audioPlayer.currentPIndex = 0;
    audioPlayer.currentSentenceIndex = 0;
    $("#play").removeClass("active");
    $("#play").val("Play");
    audioPlayer.isPause = true;
    if(listenType!="pdf"){
	    $("#content").attr("contenteditable", "true");
	    $("#content").focus();
    }


    isEdit = true;

    $('.uploadLayer').hide();
    //$('.maskLayer').remove();

    $("#docContent").show();
    var widthStyle="";
    if(listenType=="pdf"){
    		//$("#docContent").removeAttr("style");
    		//$("#docContent").css("margin","0 auto");
    }else {
    		widthStyle='style="width:100%;"';
    }


$("#iframeDiv").html('<iframe id="docContent" name="docContent" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" '+widthStyle+'></iframe>');
if(typeof(evt) == "string"){
//		$("#iframeDiv").html('<iframe id="docContent" name="docContent" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" '+widthStyle+'></iframe>');
		$("#docContent").attr("src",evt);
		var timer;
            timer = setInterval(function() {
            	docHtml=$(window.frames["docContent"].document).find("body").html();
                if (typeof(docHtml) != "undefined" && docHtml.trim().length!=0) {
                   processWebHtml();
                   $('.maskLayer').remove();
    	$('.waitingFileOpenLayer').hide();
                    clearInterval(timer);
                }
            }, 800);
		return;
	}else{
		docHtml=evt.target.responseText;
		$('.maskLayer').remove();
    	$('.waitingFileOpenLayer').hide();
	}
	processWebHtml();
}

function processWebHtml(){
	if(listenType=="pdf"){
$("#docContent").css("margin","0 auto");
   }else{
    }


	//contentObj.html(docHtml);
	docHtml=docHtml.replace(/<!--/g,"");
	docHtml=docHtml.replace(/-->/g,"");
	window.frames["docContent"].document.write(docHtml);
	window.frames["docContent"].document.close();
	contentObj=$(window.frames["docContent"].document).find("body");
    var htmlObj=$(docHtml);
//


    $("#content").hide();
//  return;
//  $("#content").html(docHtml);
    var lastPIndex=Number(NA.storage("DocLastRead:"+docUrl));

    if(listenType=="pdf"){

    		var pageIndex=1;
    		var pageContent=contentObj.find("#page"+pageIndex+"-div")[0];
    		var pageStyle=contentObj.find("style").get(0);
    		pdfPageHtmls=[];
    		pdfPageStyles=[];
    		while(pageContent!=null){
    			pdfPageHtmls.push(pageContent.outerHTML);
    			pdfPageStyles.push(pageStyle.outerHTML);
    			pageIndex++;
    			pageContent=contentObj.find("#page"+pageIndex+"-div")[0];
    			pageStyle=contentObj.find("style").get(pageIndex-1);
    		}

	    		contentObj.html("");
	    		currentPdfPage=0;
	    		for(var i=0;i!=10;i++){
	    			currentPdfPage++;
	    			if(currentPdfPage>pdfPageHtmls.length){
		    			currentPdfPage=pdfPageHtmls.length;
		    			break;
		    		}
	    			LoadPdfPage(currentPdfPage);
	    		}

	    		var ps=contentObj.find("p").length;
	    		while(lastPIndex>ps){
	    			currentPdfPage++;
	    			if(currentPdfPage<=pdfPageHtmls.length){
	    				LoadPdfPage(currentPdfPage);
	    				ps=contentObj.find("p").length;
	    			}else{
	    				break;
	    			}
	    		}

		//var contentText=contentObj.text().trim();
    		if(contentObj.find("p").length==0){
    			listenType="txt";
    			$("#iframeDiv").html('<iframe id="docContent" name="docContent" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" style="width:100%;"></iframe>');
    			contentObj=$(window.frames["docContent"].document).find("body");
    			contentObj.html("<p>No text is detected in the document.</p></br><p>Some documents may be protected or contain images. This demo is not able to access protected content or text from images.<p>");
    			$(window.frames["docContent"]).css("width","100%");

    		}
    }
    if(listenType!="pdf"){
    		ProcessDiv(contentObj,0);
    		contentObj.css("background-color","#e8eded");
		if(listenType!="pdf"){
		    	for (var i = 0; i != contentObj.find("p").length; i++) {
		    		if(i==0)$(contentObj.find("p").get(i)).css("padding-top","30px");
		        $(contentObj.find("p").get(i)).css("padding-left","30px");
		        $(contentObj.find("p").get(i)).css("padding-right","30px");
		    }
		}
    }
    var ifm= document.getElementById("docContent");
	var subWeb = document.frames ? document.frames["docContent"].document : ifm.contentDocument;
	if(ifm != null && subWeb != null) {
	   ifm.height = subWeb.body.scrollHeight;
	   ifm.width = subWeb.body.scrollWidth;
	    ifm.width = "100%";
	}
	if(screen.width<500){
		var scale=screen.width/ifm.width;
		//scale=0.5;
		//$(document.body).css("-webkit-transform","scale(" + scale + ")");
//		var deltaWidth=parseInt((1-scale)/2*ifm.width);
//		var deltaHeight=parseInt((1-scale)/2*ifm.height);
//		$("#docContent").css("margin-left","-"+(deltaWidth+10)+"px");
//		$("#docContent").css("margin-top","-"+deltaHeight+"px");
//		$(".contentInfo").height(ifm.height-2*deltaHeight+60);
//		$(".contentInfo").width(ifm.width-2*(deltaWidth+10));
		//$(".explainList").css("margin-top","-"+deltaHeight+"px");
		//$(".mainFooter").css("margin-top","-"+deltaHeight+"px");
		//$("#iframeDiv").height(360);
	}


    	contentObj.removeAttr("bgcolor");
	if(lastPIndex!=0){
		audioPlayer.currentPIndex=lastPIndex;
    	audioPlayer.hilight(Number(NA.storage("DocLastRead:"+docUrl)),0,true);
    }
}

function downloadFailed(evt) {
    alert("There was an error attempting to download the file.");

   $('.maskLayer').remove();
    	$('.waitingFileOpenLayer').hide();
}

function downloadCanceled(evt) {
    alert("The download has been canceled by the user or the browser dropped the connection.");
}

function LoadPdfPage(pageIndex){//from 1
	if(pageIndex<0||pageIndex>pdfPageHtmls.length)return;
	for(var i=0;i!=audioPlayer.loadedPdfPages.length;i++){
		if(Number(pageIndex)==Number(audioPlayer.loadedPdfPages[i]))return;
	}
	audioPlayer.loadedPdfPages.push(pageIndex);
    //$("#content").html(docHtml);
    var pageContent=pdfPageHtmls[pageIndex-1];
    var ps=contentObj.find("p").length;
    contentObj.append(pageContent);
 	if(contentObj.find("#page"+pageIndex+"-div").text().trim().length==0){
 		contentObj.find("#page"+pageIndex+"-div").remove();
 		return;
 		contentObj.find("#page"+pageIndex+"-div").html('<p>No content,this may be a title page.</p>')
 	}
 	contentObj.find("#page"+pageIndex+"-div").css("margin"," 0 auto");
 	contentObj.find("#page"+pageIndex+"-div").prepend(pdfPageStyles[pageIndex-1]);
 	var pageObj=contentObj.find("#page"+pageIndex+"-div");
 	for (var i = 0; i != pageObj.find("img").length; i++) {
		$(pageObj.find("img").get(i)).css("background-color","#e8eded");
		$(pageObj.find("img").get(i)).attr("src","");
		$(pageObj.find("img").get(i)).attr("alt","");
	 }
    ProcessDiv(contentObj.find("#page"+pageIndex+"-div"),ps);
    contentObj.find('#nextPageDiv').remove();
    if(pageIndex<pdfPageHtmls.length){
    		contentObj.append("<div id='nextPageDiv' style='text-align: center;margin-left: auto;margin-right: auto;'><a onclick='parent.LoadNextPdfClick()' style='width: 200px;text-align: center;margin-left: auto;margin-right: auto;background-color: lightgreen;'>Next 10 Pages</a></div>");
    }
    var ifm= document.getElementById("docContent");
	var subWeb = document.frames ? document.frames["docContent"].document : ifm.contentDocument;
	if(ifm != null && subWeb != null) {
	   ifm.height = subWeb.body.scrollHeight;
	   ifm.width = subWeb.body.scrollWidth;
	    ifm.width = "100%";

	}
	if(screen.width<500){
		var scale=screen.width/ifm.width;
		//scale=0.5;
		//$(document.body).css("-webkit-transform","scale(" + scale + ")");//zhengti suofang
//		var deltaWidth=parseInt((1-scale)/2*ifm.width);
//		var deltaHeight=parseInt((1-scale)/2*ifm.height);
//		$("#docContent").css("margin-left","-"+(deltaWidth+10)+"px");
//		$("#docContent").css("margin-top","-"+deltaHeight+"px");
//		$(".contentInfo").height(ifm.height-2*deltaHeight+60);
//		$(".contentInfo").width(ifm.width-2*(deltaWidth+10));
		//$(".explainList").css("margin-top","-"+deltaHeight+"px");
		//$(".mainFooter").css("margin-top","-"+deltaHeight+"px");
		//$("#iframeDiv").height(360);
	}

//  audioPlayer.pause();
//  audioPlayer.currentPIndex = 0;
//  audioPlayer.currentSentenceIndex = 0;
//  $("#play").removeClass("active");
//  $("#play").val("Play");
//  audioPlayer.isPause = true;
//  isEdit = true;
}
function LoadNextPdfClick(){
	for(var i=0;i!=10;i++){
    		currentPdfPage++;
    		if(currentPdfPage>pdfPageHtmls.length){
    			currentPdfPage=pdfPageHtmls.length;
    			return;
    		}
    		LoadPdfPage(currentPdfPage);
   }
//	var ifm= document.getElementById("docContent");
//	var subWeb = document.frames ? document.frames["docContent"].document : ifm.contentDocument;
//	if(ifm != null && subWeb != null) {
//	   ifm.height = subWeb.body.scrollHeight;
//	   ifm.width = subWeb.body.scrollWidth;
//	}
}
