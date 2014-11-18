angular.module( 'ngBoilerplate.talks', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngTable'
])

.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'talks', {
    url: '/talks',
    views: {
      "main": {
        controller: 'TalksCtrl',
        templateUrl: 'talks/talks.tpl.html'
      }
    },
    data:{ pageTitle: 'Talks' }
  })
  .state( 'talksview', {
    url: '/talks/view/:talkID',
    views: {
      "main": {
        controller: 'TalksViewCtrl',
        templateUrl: 'talks/talks-view.tpl.html'
      }
    },
    data:{ pageTitle: 'View Talk' }
  })
  .state( 'talksedit', {
    url: '/talks/edit/:talkID',
    views: {
      "main": {
        controller: 'TalksEditCtrl',
        templateUrl: 'talks/talks-edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit Talk' }
  })
  .state( 'talksadd', {
    url: '/talks/add',
    views: {
      "main": {
        controller: 'TalksAddCtrl',
        templateUrl: 'talks/talks-add.tpl.html'
      }
    },
    data:{ pageTitle: 'Add Talk' }
  })
  ;
})
.controller( 'TalksCtrl', function TalksCtrl( $scope, $q, Restangular, ngTableParams ) {

    var talks = Restangular.all("talks").getList().then(function(talks) {
        $scope.talks = talks;

        $scope.remove = function(selectedTalk) {
            selectedTalk.remove().then(function() {
                // update the $scope var once the repsonse is OK
                var index = $scope.talks.indexOf(selectedTalk);
                if(index > -1) {
                  $scope.talks.splice(index, 1);
                }
                // $scope.alerts.push({ type: 'success', msg: 'You have successfully deleted the selected property'});

            });
        };

        /* jshint ignore:start */
        $scope.tableParams = new ngTableParams({
            count: $scope.talks.length
        },{
            counts: []
        });
        /* jshint ignore:end */

    });
})
.controller( 'TalksViewCtrl', function TalksViewCtrl( $scope, $state, $stateParams, Restangular ) {
    $scope.headerText = 'View Talk';
    $scope.id = $stateParams.talkID;
    Restangular.one("talks", $scope.id).get().then(function (talk) {
        $scope.talk = talk;
    });

    $scope.remove = function(selectedTalk) {

        Restangular.one('talks', selectedTalk.id).remove();

        $state.transitionTo("talks", $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });        
    };
})
.controller( 'TalksEditCtrl', function TalksEditCtrl( $scope, $state, $stateParams, Restangular ) {
    $scope.headerText = 'Edit Talk';
    $scope.id = $stateParams.talkID;
    Restangular.one("talks", $scope.id).get().then(function (talk) {
        $scope.talk = talk;
    });

    $scope.save = function(isValid) {
        $scope.talk.put().then(function() {
          $state.go('talksview', {talkID: $scope.talk.id});
        });
    };

    $scope.cancel = function() {
        $state.go('talksview', {talkID: $scope.id});
    };
})
.controller( 'TalksAddCtrl', function TalksAddCtrl( $scope, $state, Restangular ) {
    $scope.headerText = 'Add Talk';

    $scope.talk = {};

    $scope.save = function(isValid) {
        console.log("here we go:" + $scope.talk);
        Restangular.all("talks")
          .post($scope.talk)
          .then(function(talk) {
              $state.go('talks');
          });
    };

    $scope.cancel = function() {
        $state.go('talks');
    };
})
;