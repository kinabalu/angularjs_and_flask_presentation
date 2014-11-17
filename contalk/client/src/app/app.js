angular.module( 'ngBoilerplate', [
  'restangular',
  'ngTable',
  'templates-app',
  'templates-common',
  'ngBoilerplate.home',
  'ngBoilerplate.about',
  'ngBoilerplate.properties',
  'ngBoilerplate.admin',
  'ngBoilerplate.profile',
  'ui.router'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider ) {
  $urlRouterProvider.otherwise( '/home' );
  // RestangularProvider.setBaseUrl('http://104.131.96.91/');
  RestangularProvider.setBaseUrl('http://localhost:3000/');
})

.run( function run () {
})

.factory('JsonFactory', function($q, $filter) {
    return {
        dataToRows: function(xa_table, data_object) {
            var rows = [];
            for(var obj in xa_table) {
                if(xa_table.hasOwnProperty(obj)) {
                    var valueText = "";
                    var labelText = xa_table[obj]['label'];

                    if("type" in xa_table[obj]) {
                        if("extra" in xa_table[obj]) {
                            valueText = $filter(xa_table[obj]['type'])(data_object[obj], xa_table[obj]['extra']);
                        } else {
                            valueText = $filter(xa_table[obj]['type'])(data_object[obj]);
                        }
                    } else {
                        valueText = data_object[obj];
                    }

                    if("prepend" in xa_table[obj]) {
                      valueText = xa_table[obj]['prepend'] + valueText;
                    }

                    if("append" in xa_table[obj]) {
                        valueText += xa_table[obj]['append'];
                    }

                    var row = {
                        "label": labelText,
                        "value": valueText
                    };
                    rows.push(row);
                }
            }
            return rows;
        },
        dataToActionRows: function(xa_table, data_object) {
            var rows = [];
            for(var idx in data_object) {
                var data = data_object[idx];
                var row = {
                    "label": xa_table[data['type']],
                    "value": data['value'],
                    "action": data['action']
                };
                rows.push(row);
            }
            return rows;
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
      $scope.pageTitle = toState.data.pageTitle + ' | Swifter' ;
    }
  });
});