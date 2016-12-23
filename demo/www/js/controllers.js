var imageScope = "";

angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})

.controller('ImageUploadCtrl', function ($scope, $ionicPlatform, $ionicPopup, $ionicLoading, AngularCordovaFileTransfer) {

	imageScope = $scope;
	
	
	console.log("In ImageUploadCtrl");

	$scope.showImageSelectButton = true;
	$scope.imageSelected = false;

	$ionicPlatform.ready(function () {
		
		console.log("In ionicPlatform ready");

		$scope.showImageSelectButton = typeof navigator.camera != "undefined";
		
		console.log("$scope.showImageSelectButton: " + $scope.showImageSelectButton);

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
	  
			var serverURI = "http://192.168.10.177:10080/FileHandlingServlet/UploadFile";
			AngularCordovaFileTransfer.uploadFile(serverURI, $scope.imageUrl)
			.then(
			function(res) {
				
				$ionicLoading.hide();
				console.log("success", res);
				
			},
			function(err) {
				
				$ionicLoading.hide();
				console.log("error", err);
				
			});
		};
		
		if(!$scope.$root.$$phase) {
			$scope.$apply();
		}

	});

});