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
    resolve: {
      talks: function(talksService){
          return talksService.getTalks();
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
    resolve: {
        talk: function(talksService, $stateParams) {
            return talksService.getTalk($stateParams.talkID);
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
    resolve: {
        talk: function(talksService, $stateParams) {
            return talksService.getTalk($stateParams.talkID);
        }
    },    
    data:{ pageTitle: 'Edit Talk' }
  })
  .state( 'talksadd', {
    url: '/talks/add',
    views: {
      "main": {
        controller: 'TalksAddCtrl',
        templateUrl: 'talks/talks-edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Add Talk' }
  })
  ;
})
.controller( 'TalksCtrl', function TalksCtrl( $scope, talks, talksService, ngTableParams ) {

      $scope.talks = talks;

      $scope.remove = function(selectedTalk) {
          selectedTalk.remove().then(function() {
              talksService.removeTalk(selectedTalk, $scope.talks);
          });
      };

      /* jshint ignore:start */
      $scope.tableParams = new ngTableParams({
          count: $scope.talks.length
      },{
          counts: []
      });
      /* jshint ignore:end */
})
.controller( 'TalksViewCtrl', function TalksViewCtrl( talk, $scope, $state, $stateParams ) {
    $scope.headerText = 'View Talk';
    $scope.id = $stateParams.talkID;
    $scope.talk = talk;
})
.controller( 'TalksEditCtrl', function TalksEditCtrl( talk, $scope, talksService, $state, $stateParams ) {
    $scope.headerText = 'Edit Talk';
    $scope.id = $stateParams.talkID;
    $scope.talk = talk;

    $scope.save = function(isValid) {
        talksService.updateTalk($scope.talk).then(function() {
            $state.go('talksview', {talkID: $scope.talk.id});          
        });
    };

    $scope.cancel = function() {
        $state.go('talksview', {talkID: $scope.id});
    };
})
.controller( 'TalksAddCtrl', function TalksAddCtrl( $scope, talksService, $state ) {
    $scope.headerText = 'Add Talk';

    $scope.talk = {};

    $scope.save = function(isValid) {
        talksService.addTalk($scope.talk).then(function() {
            $state.go('talks');
        });
    };

    $scope.cancel = function() {
        $state.go('talks');
    };
})
;