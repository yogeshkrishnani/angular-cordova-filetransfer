angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})

.controller('ImageUploadCtrl', function ($scope, $ionicPlatform, $ionicPopup, $ionicLoading, $timeout, AngularCordovaFileTransfer) {

	$scope.showImageSelectButton = true;
	$scope.imageSelected = false;
	$scope.imageUploaded = false;

	$ionicPlatform.ready(function () {
		
		console.log("In ionicPlatform ready");

		$scope.showImageSelectButton = typeof navigator.camera != "undefined";

		$scope.selectImage = function () {
			navigator.camera.getPicture($scope.imageSelectSuccess, $scope.imageSelectFailure, {
				correctOrientation : true,
				destinationType : Camera.DestinationType.FILE_URI,
				sourceType : Camera.PictureSourceType.PHOTOLIBRARY,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				targetWidth: 320,
				targeHeight: 480,
				encodingType : Camera.EncodingType.JPEG,
				popoverOptions : new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
			});
		};

		$scope.imageSelectSuccess = function (res) {
			$scope.imageSelected = true;
			$scope.imageUrl = res;
			if(!$scope.$root.$$phase) {
				$scope.$apply();
			}
		};

		$scope.imageSelectFailure = function (res) {
			$ionicPopup.alert({
				title : 'Oops!',
				template : 'Some error occured, Can you please try again?'
			});
		};
		
		$scope.uploadImage = function() {
			
			$ionicLoading.show({
				template: 'Uploading...'
			});
	  
			var serverURI = "http://192.168.0.108:8080/FileHandlingServlet/UploadFile";
			AngularCordovaFileTransfer.uploadFile(serverURI, $scope.imageUrl)
			.then(
			function(res) {
				
				$scope.imageUploaded = true;
				delete $scope.imageUrl;
				$scope.showImageSelectButton = true;
				$scope.imageSelected = false;
				window.plugins.toast.showLongCenter("Image Uploaded Successfully...");
				console.log("success", res);

				$timeout($ionicLoading.hide);
				
			},
			function(err) {
				
				$ionicLoading.hide();
				window.plugins.toast.showLongCenter("Error Occurred While Uploading File...");
				console.log("error", err);
				
			},
			function (progress) {

				if( !$scope.imageUploaded ) {

					$scope.downloadProgress = (progress.loaded / progress.total) * 100;
					$ionicLoading.show({
						template: 'Uploading... (' + Math.round($scope.downloadProgress) + '%)'
					});

				}
				else {

					$ionicLoading.hide();

				}
      			
        	});
		};
		
		if(!$scope.$root.$$phase) {
			$scope.$apply();
		}

	});

});