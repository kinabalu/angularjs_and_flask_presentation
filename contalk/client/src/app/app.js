angular.module( 'ngBoilerplate', [
  'restangular',
  'ngTable',
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.talks',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider ) {
  $urlRouterProvider.otherwise( '/home' );
  RestangularProvider.setBaseUrl('http://localhost:8080/api');
  // RestangularProvider.setBaseUrl('http://localhost:3000');


  // add a response intereceptor
  RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
      var extractedData;
      // .. to look for getList operations
      if (operation === "getList") {
          // .. and handle the data and meta data
          extractedData = data.data;
      } else {
          extractedData = data;
      }
      return extractedData;
  });

})

.run( function run () {
})

.factory("talksService", function(Restangular){
    return {
        getTalks: function(){
            return Restangular.all("talks").getList();
        },
        removeTalk: function(selectedTalk, talks) {
            var index = talks.indexOf(selectedTalk);
            if(index > -1) {
                talks.splice(index, 1);
            }
        },
        getTalk: function(id) {
            return Restangular.one("talks", id).get();
        },
        updateTalk: function(talk) {
            return talk.put();
        },
        addTalk: function(talk) {
            return Restangular.all("talks")
                .post(talk);
        }
    };
})
.directive('cancel', function() {
  return {
    restrict: 'AE',
    replace: 'true',
    template: '<button ui-sref="{{ loc }}" class="btn btn-danger">Cancel</button>',
    link: function(scope, elem, attrs) {
      scope.loc = attrs.loc;
      console.log(scope.state);
      // scope.state.go(attrs.target);
    }
  };
})
.directive('ngConfirmClick', function() {
      return {
          link: function (scope, element, attr) {
              var msg = attr.ngConfirmClick || "Are you sure?";
              var clickAction = attr.confirmedClick;
              element.bind('click',function (event) {
                  if ( window.confirm(msg) ) {
                      scope.$eval(clickAction);
                  }
              });
          }
      };
})
.directive('panel', function() {
  return {
    restrict: 'E',
    scope: {
      data: "=data"
    },
    template: '<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">{{data.headerText}}</h4></div>' +
              '<div class="panel-body"><div class="list-group"><span class="list-group-item" ng-repeat="elem in data.fields">' +
              '<strong>{{ elem.label }}</strong><div class="pull-right">{{ elem.value }}</div></span>' +
              '</div></div>'
  };
})

.directive('actionpanel', function() {
  return {
    restrict: 'E',
    scope: {
      data: "=data"
    },
    template: '<div class="panel panel-default"><div class="panel-heading"><h4>{{data.headerText}}</h4></div>' +
              '<div class="panel-body"><div class="list-group"><span class="list-group-item" ng-repeat="elem in data.fields">' +
              '<strong>{{ elem.label }}</strong><div class="pull-right"><a href="{{ elem.action }}">{{ elem.value }}</a></div></span></div></div>'
  };
})

.directive('datatable', function() {
  return {
    restrict: 'E',
    scope: {
      data: "=data"
    },
    template: '<table class="table table-striped table-responsive"><thead><tr>' +
              '<th ng-repeat="elem in data.headers"><strong>{{ elem }}</strong></th>' +
              '</tr></thead><tbody>' +
              '<tr ng-repeat="rows in data.fields"><td ng-repeat="elem in rows">{{ elem }}</td></tr></tbody></table>'
  };
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ConTalk' ;
    }
  });
});