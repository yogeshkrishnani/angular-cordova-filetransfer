angular.module('app').factory('CordovaFileTransfer', ['$q', function ($q) {
    	
	var CordovaFileTransfer = {};
	
	CordovaFileTransfer.uploadFile = function (fileURI, fileName) {
    	
    	if(angular.isUndefined(fileName)) {
    		fileName = fileURI.substr( fileURI.lastIndexOf("/") + 1 );
    	}
    	
    	var q = $q.defer();			
		var uri = encodeURI(config.fileUploadServlet);
		
		var options = new FileUploadOptions();
		options.fileKey="file";
		options.fileName=fileName;
		
		var ft = new FileTransfer();
		
		function win(r) {
			console.log(JSON.stringify(r));
			q.resolve(r.response);
		}
			
		function fail(e) {
			console.log(JSON.stringify(e));
			q.reject(e);
		}
		
		console.log("Uploading File");
		console.log("fileURI : " + fileURI);
		console.log("fileName : " + fileName);
		
		if(fileURI.startsWith('http') || fileURI.startsWith('https')){//File is already on server
			var response = {
				"fileName" : fileName,
				"successMessage" : "File Uploaded",
				"status" : 200
			}
			q.resolve(JSON.stringify(response));
		} else {//Local file
			ft.upload(fileURI, uri, win, fail, options);
		}
							
		return q.promise;				
    };
    
    CordovaFileTransfer.uploadMultipleFiles = function(files) {
    	/* [ { fileName : "", fileURI : "" } ] */
    	var q = $q.defer();		
    	var defs = new Array();
    	
    	for(var index = 0; index < files.length; index++ ) {
    		var fileURI = files[index]['fileURI'];
    		var fileName = files[index]['fileName'];
    		defs.push( CordovaFileTransfer.uploadFile(fileURI, fileName) );
    	}
    	
    	$q.all(defs).then(
    	function(response) {
    		q.resolve(response);
    	},
    	function(response) {
    		q.reject(response);
    	});
    	
    	return q.promise;
    };
    
    CordovaFileTransfer.getFileDownloadURL = function(fileName) {
    	return  config.fileDownloadServlet + "?fileName=" + fileName + "";	
    };
    
    CordovaFileTransfer.getDocumentDownloadURL = function(fileName) {
    	return  config.fileDownloadServlet + "?isDocument=true" + "&fileName=" + fileName + "" ;
    };
	
	return CordovaFileTransfer;
	
}]);