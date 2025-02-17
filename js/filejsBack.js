function fileDivHide(){ 

	$("#fileDownDiv").hide();  

}





function fileDown(saveFileNm,attachFileNm){

	$.download("../file/fileDown.html"

				,'propPath=file.path&saveFileNm='+encodeURIComponent(saveFileNm)+'&attachFileNm='+encodeURIComponent(attachFileNm),"post" ); 

}

function fileSearch(url,param,row,col,$obj){
	var fcelly = $(".viewTb > tbody > tr:eq("+row+")").position().top;
	$.ajax({

               type: "POST",

               url: url,

               data: param,  

               success: function(msg){  

			   		$fileDownObj = $("#fileDownDiv");

			   		$fileDownObj.empty();

			   		$fileDownObj.html(msg.fileHtml);
					$fileDownObj.css("top",fcelly+0).show();
					
					$obj.val("");  

               }

            });

}



function fileAction(sAction,$butObj)

{

        

    switch(sAction)   

    { 

    	case "Add":  

		

			var arrFileNm = $butObj.val().split("\\");

			var fileNm = arrFileNm[arrFileNm.length-1]; //마지막 화일명

			$butObj.parent().parent().clone().insertAfter($butObj.parent().parent());

			$butObj.parent().parent().hide();

			$("#fileSelect").html("<option value=\"9999\">"+fileNm+"</option>");

    		break;

			

        case "Delete":

			

			var $selectObj = $("#fileSelect option:selected");

			var selectVal = $selectObj.val();

			var idx = $('#fileSelect option').index($selectObj);



			if(selectVal > 0){   

				$selectObj.remove();

				if(selectVal != 9999){

					$("#arrFileDelYn_"+selectVal).val("Y");

				}

				$("#fileUploadTable tr:eq("+(idx)+")").remove();

			}else{

				alert("삭제할 파일이 없습니다.");

				return;

			}

        	break;



    }       

}

const fileRegex = /^[a-zA-Z0-9ㄱ-ㅎ가-힣\s(),_.-]+$/;

var fileNameAlert = "파일 이름에는 영문, 숫자, 공백 및 다음 특수문자만 사용할 수 있습니다: ( ) , . _ - \n다른 특수문자는 사용할 수 없습니다. 다시 입력해 주세요.\n";

function fileName(filePath) {
	var index = -1;
	index = filePath.lastIndexOf('\\');
	var fileName = "";
	
	if (index != -1) {
		fileName = 	filePath.substring(index+1, filePath.len);
	} else {
		fileName = "";
    }
	
	return fileName;
}