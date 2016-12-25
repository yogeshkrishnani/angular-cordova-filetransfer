angular.module('starter.services').factory('AngularCordovaFileTransfer', ['$q', function ($q) {
    	
	var AngularCordovaFileTransfer = {};
	
	AngularCordovaFileTransfer.uploadFile = function (serverURI, fileURI, fileName) {
    	
    	if(angular.isUndefined(fileName)) {
    		fileName = fileURI.substr( fileURI.lastIndexOf("/") + 1 );
    	}
    	
    	var q = $q.defer();
    	var uri = encodeURI(serverURI);
		
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = fileName;
		
		var ft = new FileTransfer();

		function win(r) {
			q.resolve(r);
		}

		function fail(e) {
			q.reject(e);
		}

		ft.onprogress = function (progress) {
			q.notify(progress);
		};


		ft.upload(fileURI, uri, win, fail, options);
							
		return q.promise;				
    };

    AngularCordovaFileTransfer.downloadFile = function (serverURI, fileURI) {
    	
		var q = $q.defer();			
		var uri = encodeURI(serverURI);

		var ft = new FileTransfer();
		var options = null;

		function win(r) {
			q.resolve(r);
		}
			
		function fail(e) {
			q.reject(e);
		}

		ft.onprogress = function (progress) {
			q.notify(progress);
		};


		ft.download(uri, fileURI, win, fail, options);
							
		return q.promise;
						
    };
    
    AngularCordovaFileTransfer.uploadMultipleFiles = function(serverURI, files) {
    	/* [ { fileName : "", fileURI : "" } ] */
    	var q = $q.defer();		
    	var defs = new Array();
    	
    	for(var index = 0; index < files.length; index++ ) {
    		var fileURI = files[index]['fileURI'];
    		var fileName = files[index]['fileName'];
    		defs.push( AngularCordovaFileTransfer.uploadFile(serverURI, fileURI, fileName) );
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
	
	return AngularCordovaFileTransfer;
	
}]);