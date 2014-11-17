angular.module( 'ngBoilerplate.admin', [
  'ui.router',
  'ui.bootstrap',
  'placeholders',
  'ui.bootstrap',
  'ngTable'
])

.config(function config( $stateProvider ) {
  $stateProvider

/*
  .state( 'admin', {
    url: '/admin',
    views: {
      "main": {
        controller: function($stateParams, $scope, Restangular) {
          console.log("parent of all the admins");
        }
      },
      templateUrl: 'admin/properties.tpl.html'
    },
    data:{ pageTitle: 'Properties' }
  })
*/
  .state( 'admin-properties', {
    url: '/admin/list',
    views: {
      "main": {
        controller: function($stateParams, $scope, Restangular) {
            $scope.properties = Restangular.all("properties").getList().$object;
            $scope.alerts = [];

            $scope.remove = function(property) {
                property.remove().then(function() {
                    // update the $scope var once the repsonse is OK
                    var index = $scope.properties.indexOf(property);
                    if(index > -1) {
                      $scope.properties.splice(index, 1);
                    }
                    $scope.alerts.push({ type: 'success', msg: 'You have successfully deleted the selected property'});

                });
            };
        },
        templateUrl: 'admin/properties.tpl.html'
      }
    },
    data:{ pageTitle: 'Properties' }
  })
  .state('adminproperty', {
    url: '/admin/property/:propertyID',
    abstract: true,
    views: {
      "main": {
        controller: function ($stateParams, $scope) {
            $scope.id = $stateParams.propertyID;
            console.log($scope.id);
        },
        templateUrl: 'admin/admin-nav.tpl.html'
      }
    },
    data:{ pageTitle: 'View Property' }
  })
  .state('adminproperty.view', {
    url: '/view',
    abstract: true,
    views: {
      "main": {
        controller: function() {},
        template: '<ui-view name="main"></ui-view>'
      }
    },
    data: { pageTitle: 'View Property'}
  })
  .state('adminproperty.overview', {
    url: '/overview',
    views: {
      "main": {
        controller: function($scope, Restangular) {
            Restangular.one("properties", $scope.id).get().then(function (property) {
              $scope.property = property;
              console.log(property);
            });
        },
        templateUrl: 'admin/property-overview.tpl.html'
      }
    },
    data: { pageTitle: 'View Property'}
  })
  .state('adminproperty.view.info', {
    url: '/info',
    views: {
      "main": {
        controller: 'PropertyViewCtrl',
        template: '<div class="pull-right"><button ui-sref="adminproperty.edit({ propertyID: id })" class="btn btn-primary">Edit</button></div><div class="clearfix"></div><p></p>' +
        '<panel data="data_info"></panel><actionpanel data="data_contacts"></actionpanel>'
      }
    },
    data: { pageTitle: 'View Property Info' }
  })
  .state('adminproperty.edit', {
    url: '/edit',
    views: {
      "main": {
        controller: function( $scope, $state, Restangular ) {
            $scope.headerText = 'Update Property Info';

            Restangular.one("properties", $scope.id).get().then(function (property) {
              $scope.property = property;
            });

            $scope.submit = function() {
              $scope.property.put().then(function() {
                $state.go('adminproperty.overview', {propertyID: $scope.property.id});
              });
            };
          },
        templateUrl: 'admin/properties-info-edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Update Property Info' }
  })
  .state('adminproperty.edit-debt', {
    url: '/edit-debt',
    views: {
      "main": {
        controller: function( $scope, $state, Restangular ) {
            $scope.headerText = 'Update Debt Property';

            Restangular.one("properties", $scope.id).get().then(function (property) {
              $scope.property = property;
            });

            $scope.save = function(isValid) {
              $scope.property.put().then(function() {
                $state.go('adminproperty.overview', {propertyID: $scope.property.id});
              });
            };
          },
        templateUrl: 'admin/properties-debt-edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Edit Debt Property' }
  })
  .state('adminproperty.edit-investment', {
    url: '/edit-investment',
    views: {
      "main": {
        controller: function( $scope, $state, Restangular ) {
            $scope.headerText = 'Update Investment Summary';

            Restangular.one("properties", $scope.id).get().then(function (property) {
              $scope.property = property;
            });

            $scope.save = function(isValid) {
              $scope.property.put().then(function() {
                $state.go('adminproperty.overview', {propertyID: $scope.property.id});
              });
            };
          },
        templateUrl: 'admin/properties-investment-edit.tpl.html'
      }
    },
    data:{ pageTitle: 'Update Investment Summary' }
  })
  .state('adminproperty.overview-top5', {
    url: '/overview-top5',
    views: {
      "main": {
        controller: function( $scope, $state, $modal, Restangular, ngTableParams ) {
            $scope.headerText = 'Top 5 Overview';

            $scope.edit = function(item) {
                var itemToEdit = item;

                var modalInstance = $modal.open({
                  templateUrl: 'admin/properties-top5-edit.tpl.html',
                  controller: function ($scope, $modalInstance, item) {

                    $scope.modalHeaderText = 'Update Top 5 Entry';
                    $scope.item = item;
                    $scope.save = function () {
                      $modalInstance.close($scope.item);
                    };

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };
                  },
                  size: 'lg',
                  resolve: {
                      item: function() {
                          return itemToEdit;
                      }
                  }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                    $scope.property.put().then(function() {
                        // $state.go('adminproperty.overview', {propertyID: $scope.property.id});
                    });
                }, function() {
                  // This is when the escape key is hit
                    console.log("modal");
                });
            };

            Restangular.one("properties", $scope.id).get().then(function (property) {
                $scope.property = property;

                /* jshint ignore:start */
                $scope.tableParams = new ngTableParams({
                    count: $scope.property.lease.top5.length
                },{
                    counts: []
                });
                /* jshint ignore:end */
            });
          },
        templateUrl: 'admin/properties-top5-overview.tpl.html'
      }
    },
    data:{ pageTitle: 'Top 5 Overview' }
  })
  .state('adminproperty.overview-leasing', {
    url: '/overview-leasing',
    views: {
      "main": {
        controller: function( $scope, $state, Restangular, $modal, ngTableParams ) {
            $scope.headerText = 'Leasing Assumptions Overview';

            $scope.alerts = [
            ];

            $scope.remove = function(item) {
                var index = $scope.property.lease.assumptions.indexOf(item);
                if(index > -1) {
                  $scope.property.lease.assumptions.splice(index, 1);
                  $scope.property.put().then(function() {
                       $scope.alerts.push({ type: 'success', msg: 'You have successfully deleted the selected entry in the leasing assumptions'});
                  });
                }
            };

            $scope.create = function() {
                var itemToCreate = {
                    "suite": "",
                    "tenant": "",
                    "lease_type": "",
                    "rentable_sf": "",
                    "start": "",
                    "expire": "",
                    "price_rsf": "",
                    "annual_rent_bumps": "",
                    "tis": "",
                    "rent_abatement_mos": "",
                    "lcs": ""
                };

                var modalInstance = $modal.open({
                  templateUrl: 'admin/properties-leasing-edit.tpl.html',
                  controller: function ($scope, $modalInstance, item) {

                    $scope.modalHeaderText = 'Add Leasing Assumption';
                    $scope.item = item;
                    $scope.save = function (isValid) {
                      console.log(isValid);
                      $modalInstance.close($scope.item);
                    };

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };
                  },
                  size: 'lg',
                  resolve: {
                      item: function() {
                          return itemToCreate;
                      }
                  }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                    $scope.property.lease.assumptions.push($scope.selected);
                    $scope.property.put().then(function() {
                       $scope.alerts.push({ type: 'success', msg: 'You have successfully added an entry to the leasing assumptions'});
                    });
                }, function() {
                  // This is when the escape key is hit
                    console.log("modal");
                });
            };

            $scope.edit = function(item) {
                var itemToEdit = item;

                var modalInstance = $modal.open({
                  templateUrl: 'admin/properties-leasing-edit.tpl.html',
                  controller: function ($scope, $modalInstance, item) {

                    $scope.modalHeaderText = 'Update Leasing Assumption';
                    $scope.item = item;
                    $scope.save = function () {
                      $modalInstance.close($scope.item);
                    };

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };
                  },
                  size: 'lg',
                  resolve: {
                      item: function() {
                          return itemToEdit;
                      }
                  }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                    $scope.property.put().then(function() {
                       $scope.alerts.push({ type: 'success', msg: 'You have successfully updated the selected entry in the leasing assumptions'});
                    });
                }, function() {
                  // This is when the escape key is hit
                    console.log("modal");
                });
            };

            Restangular.one("properties", $scope.id).get().then(function (property) {
                $scope.property = property;

                /* jshint ignore:start */
                $scope.tableParams = new ngTableParams({
                    count: $scope.property.lease.assumptions.length
                },{
                    counts: []
                });
                /* jshint ignore:end */
            });

          },
        templateUrl: 'admin/properties-leasing-overview.tpl.html'
      }
    },
    data:{ pageTitle: 'Leasing Assumptions Overview' }
  })
  .state('adminproperty.overview-expiration', {
    url: '/overview-expiration',
    views: {
      "main": {
        controller: function( $scope, $state, Restangular, $modal, ngTableParams ) {
            $scope.headerText = 'Leasing Expiration Overview';

            $scope.alerts = [
            ];

            $scope.remove = function(item) {
                var index = $scope.property.lease.expiration.indexOf(item);
                if(index > -1) {
                  $scope.property.lease.expiration.splice(index, 1);
                  $scope.property.put().then(function() {
                       $scope.alerts.push({ type: 'success', msg: 'You have successfully deleted the selected entry in the lease expiration'});
                  });
                }
            };

            $scope.create = function() {
                var itemToCreate = {
                  "suite": "",
                  "tenant": "",
                  "term_from": "",
                  "term_to": "",
                  "sf": 0,
                  "price_sf_annual": 0,
                  "price_sf_monthly": 0
                };

                var modalInstance = $modal.open({
                  templateUrl: 'admin/properties-expiration-edit.tpl.html',
                  controller: function ($scope, $modalInstance, item) {

                    $scope.modalHeaderText = 'Add Lease Expiration';
                    $scope.item = item;
                    $scope.save = function () {
                      $modalInstance.close($scope.item);
                    };

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };
                  },
                  size: 'lg',
                  resolve: {
                      item: function() {
                          return itemToCreate;
                      }
                  }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                    $scope.property.lease.expiration.push($scope.selected);
                    $scope.property.put().then(function() {
                       $scope.alerts.push({ type: 'success', msg: 'You have successfully added an entry to the lease expiration'});
                    });
                }, function() {
                  // This is when the escape key is hit
                    console.log("modal");
                });
            };

            $scope.edit = function(item) {
                var itemToEdit = item;

                var modalInstance = $modal.open({
                  templateUrl: 'admin/properties-expiration-edit.tpl.html',
                  controller: function ($scope, $modalInstance, item) {

                    $scope.modalHeaderText = 'Update Lease Expiration';
                    $scope.item = item;
                    $scope.save = function () {
                      $modalInstance.close($scope.item);
                    };

                    $scope.cancel = function () {
                      $modalInstance.dismiss('cancel');
                    };
                  },
                  size: 'lg',
                  resolve: {
                      item: function() {
                          return itemToEdit;
                      }
                  }
                });

                modalInstance.result.then(function(selectedItem) {
                    $scope.selected = selectedItem;
                    $scope.property.put().then(function() {
                       $scope.alerts.push({ type: 'success', msg: 'You have successfully updated the selected entry in the lease expiration'});
                    });
                }, function() {
                  // This is when the escape key is hit
                    console.log("modal");
                });
            };

            Restangular.one("properties", $scope.id).get().then(function (property) {
              $scope.property = property;

              /* jshint ignore:start */
              $scope.tableParams = new ngTableParams({
                  count: $scope.property.lease.expiration.length
              },{
                  counts: []
              });
              /* jshint ignore:end */

            });

            $scope.submit = function() {
              $scope.property.put().then(function() {
                $state.go('adminproperty.overview', {propertyID: $scope.property.id});
              });
            };
          },
        templateUrl: 'admin/properties-expiration-overview.tpl.html'
      }
    },
    data:{ pageTitle: 'Leasing Expiration Overview' }
  })  
  .state('create-property', {
    url: '/admin/property/create',
    views: {
      "main": {
        controller: 'PropertyAddCtrl',
        templateUrl: 'admin/properties-add.tpl.html'
      }
    },
    data:{ pageTitle: 'Add Property' }
  })
  ;

})
.controller( 'PropertyAddCtrl', function PropertyAddCtrl( $scope, $state, Restangular ) {
  $scope.headerText = 'Add Property';

  $scope.state = $state;
  $scope.submit = function() {

    $scope.property['debt'] = {};
    $scope.property['investment'] = {};
    $scope.property['lease'] = {
      'top5': [
          {'unit': 'AAAA', 'lease_name': 'Fill Me In', 'status': 'Unknown', 'lease_from': '', 'lease_to': '', 'area': 0, 'percent_of_total_area': '', 'base_rent': 0},
          {'unit': 'AAAA', 'lease_name': 'Fill Me In', 'status': 'Unknown', 'lease_from': '', 'lease_to': '', 'area': 0, 'percent_of_total_area': '', 'base_rent': 0},
          {'unit': 'AAAA', 'lease_name': 'Fill Me In', 'status': 'Unknown', 'lease_from': '', 'lease_to': '', 'area': 0, 'percent_of_total_area': '', 'base_rent': 0},
          {'unit': 'AAAA', 'lease_name': 'Fill Me In', 'status': 'Unknown', 'lease_from': '', 'lease_to': '', 'area': 0, 'percent_of_total_area': '', 'base_rent': 0},
          {'unit': 'AAAA', 'lease_name': 'Fill Me In', 'status': 'Unknown', 'lease_from': '', 'lease_to': '', 'area': 0, 'percent_of_total_area': '', 'base_rent': 0}
      ],
      'assumptions': [],
      'expiration': []
    };
    Restangular.all("properties")
      .post($scope.property)
      .then(function(property) {
          $state.go('admin-properties');
      });
    console.log($scope);
    console.log('property-add-ctrl');
  };
})
;