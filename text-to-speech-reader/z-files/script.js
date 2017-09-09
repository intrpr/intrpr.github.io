
function downloadFile(u,f){
	var index1=f.lastIndexOf(".");  
	var index2=f.length;
	listenType=f.substring(index1+1,index2).toLowerCase();//后缀名  
	
    downloadHTML(u);
    }

$(function(){
	
    var ul = $('#upload ul');
    var converting=false;            
    if(NA.storage("CloudDocNum")==null){
        NA.storage("CloudDocNum",0,null);
    }
    var docCount=Number(NA.storage("CloudDocNum"));
    for(var i=0;i!=docCount;i++){
       	var tpl = $('<li><input type="text" value="0" data-width="40" data-height="40"'+
                ' data-fgColor="#AFD785" data-readOnly="1" data-bgColor="#EFEFEF" /><p><a href="#" onclick="downloadFile(\''+NA.storage("CloudDocUrlIndex"+(i+1))+'\',\''+NA.storage("CloudDocNameIndex"+(i+1))+'\')">'+NA.storage("CloudDocNameIndex"+(i+1))+'</a></p><span onclick="downloadFile(\''+NA.storage("CloudDocUrlIndex"+(i+1))+'\',\''+NA.storage("CloudDocNameIndex"+(i+1))+'\')"></span></li>');
        //ul.prepend(tpl);
        tpl.prependTo(ul);
        //var li=ul.children().first();
//      tpl.find('span').click(function(){
//
//              if(tpl.hasClass('working')){
//                 // jqXHR.abort();
//              }else{
//              		tpl.find("p").find("a").click();
//              }
//
//          });
            
    }
    
    
    $('#drop a').click(function(){
        // Simulate a click on the file input button
        // to show the file browser dialog
        $(this).parent().find('input').click();
    });

    // Initialize the jQuery File Upload plugin
    $('#upload').fileupload({
		
        // This element will accept file drag/drop uploading
        dropZone: $('#drop'),

        // This function is called when a file is added to the queue;
        // either via the browse button, or via drag/drop:
        add: function (e, data) {
			//if($("#uploadUl li").length>=3)return;//
			if(converting){
				$("#fileSizeLimit").text("Error:upload failed.");
				return;
			}
			if((data.files[0].size / 1000000).toFixed(2)>30){
				$("#fileSizeLimit").text("Error:File size must below 30 M.");
				return;
			}
			$("#fileSizeLimit").text("");
			converting=true;
            var tpl = $('<li class="working"><input type="text" value="0" data-width="40" data-height="40"'+
                ' data-fgColor="#AFD785" data-readOnly="1" data-bgColor="#EFEFEF" /><p><a href="#"></a></p><span></span></li>');

            // Append the file name and file size
            tpl.find('p').text(data.files[0].name)
                         .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

            // Add the HTML to the UL element
            
            data.context = tpl.prependTo(ul);
			// $("#alice").after(tpl);
			//data.context =$("#uploadUl li:eq(2)");
            // Initialize the knob plugin
            tpl.find('input').knob();
			tpl.find("span").hide();
            // Listen for clicks on the cancel icon
            tpl.find('span').click(function(){

                if(tpl.hasClass('working')){
                   // jqXHR.abort();
                }else{
                		tpl.find("p").find("a").click();
                }

//              tpl.fadeOut(function(){
//                  tpl.remove();
//              });

            });

            // Automatically upload the file once it is added to the queue
            var jqXHR = data.submit();
        },

        progress: function(e, data){

            // Calculate the completion percentage of the upload
            var progress = parseInt(data.loaded / data.total * 100, 10);

            // Update the hidden input field and trigger a change
            // so that the jQuery knob plugin knows to update the dial
            data.context.find('input').val(progress).change();

            if(progress == 100){
                //data.context.removeClass('working');
                data.context.find('span').show();
                data.context.find('canvas').hide();
        			
            }
        },

        fail:function(e, data){
        		converting=false;
            // Something has gone wrong!
            data.context.addClass('error');
            data.context.remove();
        },
        done:function(e, data){
        			converting=false;
       			 if(NA.storage("CloudDocNum")==null){
		        		NA.storage("CloudDocNum",0,null);
		        }
                var rst = data.result;
                var fileName=data.files[0].name;
                fileName=fileName.replace(/'/g,"");
                var url=rst.htmlurl;
		        var docCount=Number(NA.storage("CloudDocNum"))+1;
		        NA.storage("DocLastRead:"+url,0,null);
		        NA.storage("CloudDocUrlLimit:"+url,url,3*24*60*60);
		        if(docCount<=3){
			        NA.storage("CloudDocNum",docCount,null);
			        
			        NA.storage("CloudDocNameIndex"+docCount,fileName,null);
			        NA.storage("CloudDocUrlIndex"+docCount,url,null);
			        
        			}else{
        				NA.storage("CloudDocNameIndex1",NA.storage("CloudDocNameIndex2"),null);
        				NA.storage("CloudDocUrlIndex1",NA.storage("CloudDocUrlIndex2"),null);
        				NA.storage("CloudDocNameIndex2",NA.storage("CloudDocNameIndex3"),null);
        				NA.storage("CloudDocUrlIndex2",NA.storage("CloudDocUrlIndex3"),null);
        				NA.storage("CloudDocNameIndex3",fileName,null);
        				NA.storage("CloudDocUrlIndex3",url,null);
        				$("#uploadUl li:eq(3)").remove();
        			}
        			//data.context.find('p').val(url);
        			var a='<a href="#" onclick="downloadFile(\''+url+'\',\''+fileName+'\')">'+fileName+'</a>';
        			var p=data.context.find('p');
        			p.html(a);
        			p.css("top","15px");
        			 data.context.removeClass('working');
        }

    });


    // Prevent the default action when a file is dropped on the window
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });

    // Helper function that formats the file sizes
    function formatFileSize(bytes) {
        if (typeof bytes !== 'number') {
            return '';
        }

        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2) + ' GB';
        }

        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2) + ' MB';
        }

        return (bytes / 1000).toFixed(2) + ' KB';
    }

});