angular.module( 'ngBoilerplate.properties', [
  'ui.router',
  'placeholders',
  'ui.bootstrap',
  'ngTable'
])

.config(function config( $stateProvider ) {
  $stateProvider

  .state( 'properties', {
    url: '/properties',
    views: {
      "main": {
        controller: 'PropertiesCtrl',
        templateUrl: 'properties/properties.tpl.html'
      }
    },
    data:{ pageTitle: 'Properties' }
  })

  .state('property', {
    url: '/property/:propertyID',
    abstract: true,
    views: {
      "main": {
        controller: function ($stateParams, $scope) {
            $scope.id = $stateParams.propertyID;
            console.log($scope.id);
        },
        templateUrl: 'properties/properties-view.tpl.html'
      }
    },
    data:{ pageTitle: 'View Property' }
  })

  .state('property.viewinfo', {
    url: '/viewinfo',
    views: {
      "main": {
        controller: 'PropertyViewCtrl',
        template: '<panel data="data_info"></panel><actionpanel data="data_contacts"></actionpanel>'
      }
    },
    data: { pageTitle: 'View Property Info' }
  })
  .state('property.viewdebt', {
    url: '/viewdebt',
    views: {
      "main": {
        controller: 'PropertyViewDebtCtrl',
        template: '<panel data="data_debt"></panel>'
      }
    }
  })
  .state('property.top5tenants', {
    url: '/top5tenants',
    views: {
      "main": {
        controller: 'PropertyViewTop5Ctrl',
        template: '<table class="table" ng-table="tableParams"><tbody>' +
                    '<tr ng-repeat="col in data_top5">' +
                    '<td data-title="\'Unit\'"">{{col.unit}}</td>' +
                    '<td data-title="\'Lease Name\'">{{col.lease_name}}</td>' +
                    '<td data-title="\'Lease From\'">{{col.lease_from}}</td>' +
                    '<td data-title="\'Lease To\'">{{col.lease_to}}</td>' +
                    '<td data-title="\'Area\'">{{col.area | number}}</td>' +
                    '<td data-title="\'% of Total Area\'">{{col.percent_of_total_area}}%</td>' +
                    '<td data-title="\'Base Rent\'">{{col.base_rent | currency}}</td>' +
                    '<td data-title="\'% of Total Base Rent\'">{{col.percent_of_total_base_rent | number : 2}}%</td>' +
                    '</tr></tbody></table>'
      }
    }
  })
  .state('property.rentroll', {
    url: '/rentroll',
    views: {
      "main": {
        controller: 'PropertyViewRentRollCtrl',
        template: '' +
        '<div ac-chart="\'bar\'" ac-data="rolling_data" ac-config="rolling_config" id=\'chart\' class=\'chart\'></div>' +
        '<div class="clearfix"></div>' +
        '<div ac-chart="\'line\'" ac-data="avgrent_data" ac-config="avgrent_config" id=\'chart\' class=\'chart\'></div>' +
        '<div class="clearfix"></div>' +
        '<div ac-chart="\'line\'" ac-data="cumulative_data" ac-config="cumulative_config" id=\'chart\' class=\'chart\'></div>' +
        ''
      }
    }
  })
  .state('property.leaseassumptions', {
    url: '/leaseassumptions',
    views: {
      "main": {
        controller: 'PropertyViewAssumptionsCtrl',
        template: '<table class="table" ng-table="tableParams"><tbody>' +
        '<tr ng-repeat="col in data_assumptions">' +
        '<td data-title="\'Tenant\'">{{col.tenant}}</td>' +
        '<td data-title="\'Suite\'">{{col.suite}}</td>' +
        '<td data-title="\'Lease Type\'">{{col.lease_type}}</td>' +
        '<td data-title="\'Rentable SF\'">{{col.rentable_sf}}</td>' +
        '<td data-title="\'Start\'">{{col.start}}</td>' +
        '<td data-title="\'Expire\'">{{col.expire}}</td>' +
        '<td data-title="\'$/RSF\'">{{col.price_rsf}}</td>' +
        '<td data-title="\'Rent Abatement (Mos)\'">{{col.rent_abatement_mos}}</td>' +
        '<td data-title="\'Annual Rent Bumps\'">{{col.annual_rent_bumps}}</td>' +
        '<td data-title="\'TIs\'">{{col.tis}}</td>' +
        '<td data-title="\'LCs\'">{{col.lcs}}</td>' +
        '</tr></tbody></table>'
      }

    }
  })
  .state('property.viewinvestment', {
    url: '/viewinvestment',
    views: {
      "main": {
        controller: 'PropertyViewInvestmentCtrl',
        template: '<panel data="data_acquisition"></panel><panel data="data_stabilization"></panel><panel data="data_exit"></panel>'
      }
    }
  });
})

.controller( 'PropertiesCtrl', function PropertyCtrl( $scope, Restangular ) {

    var propertyGroup = [], size = 3;


    var properties = Restangular.all("properties").getList().then(function(properties) {
        while(properties.length > 0) {
            propertyGroup.push(properties.splice(0, size));
        }
        $scope.propertyGroup = propertyGroup;
    });

})

.controller( 'PropertyViewCtrl', function PropertyViewCtrl( $scope, Restangular, JsonFactory ) {

    xa_table_info = {
        "name": {"label": "Name"},
        "address": {"label": "Address"},
        "square_footage": {"label": "Square feet", "type": "number", "extra": 0, "append": " SF"},
        "buildings_floors": {"label": "Number of buildings / floors"},
        "current_occupancy": {"label": "Current occupancy", "type": "number", "extra": 2, "append": "%"},
        "parking_ratio": {"label": "Parking ratio"},
        "budgeted_opex_psf": {"label": "Budgeted OpEx PSF", "type": "currency"}
    };

    xa_table_contacts = {
        "asset_manager": "Asset Manager",
        "property_manager": "Property Manager",
        "leasing_broker": "Leasing Broker"
    };

    $scope.data_info = { headerText: 'Property Information', fields: [] };
    $scope.data_contacts = { headerText: 'Contacts', fields: [] };

    Restangular.one("properties", $scope.id).get().then(function (property) {
        $scope.headerText = property.name;

        var contacts = [];
        for(var idx in property.contacts) {
            var prop_contact = property.contacts[idx];
            var contact = {
                "type": idx,
                "value": prop_contact['name'],
                "action": "tel://" + prop_contact['phone']
            };
            contacts.push(contact);
        }
        $scope.data_info.fields = JsonFactory.dataToRows(xa_table_info, property);
        $scope.data_contacts.fields = JsonFactory.dataToActionRows(xa_table_contacts, contacts);
    });
})

.controller( 'PropertyViewInvestmentCtrl', function PropertyViewInvestmentCtrl( $scope, Restangular, JsonFactory ) {

    xa_table_acquisition = {
        "purchase_date": {"label": "Purchase Date"},
        "acquisition_price": {"label": "Acquisition Price", "type": "currency"},
        "acquisition_price_psf": {"label": "Acquisition Price PSF", "type": "currency"},
        "acquisition_cap_rate": {"label": "Acquisition Cap Rate", "type": "number", "append": "%"}
    };

    xa_table_stabilization = {
        "cost_at_acquisition": {"label": "Cost at Acquisition", "type": "currency", "append": " PSF"},
        "yield_at_stabilization": {"label": "Yield at Stabilization", "type": "currency", "append": " PSF"}
    };

    xa_table_exit = {
        "exit_cap_rate": {"label": "Exit Cap Rate", "type": "number", "append": "%"},
        "exit_price": {"label": "Exit Price", "type": "currency", "append": " PSF"},
        "exit_price_psf": {"label": "Exit Price PSF", "type": "currency", "append": " PSF"},
        "exit_year" : {"label": "Exit Year"}
    };

    Restangular.one("properties", $scope.id).get().then(function (property) {
        $scope.headerText = property.name;
        $scope.data_acquisition = {
            headerText: 'Acquisition',
            fields: JsonFactory.dataToRows(xa_table_acquisition, property.investment)
        };
        $scope.data_stabilization = {
            headerText: 'Stabilization',
            fields: JsonFactory.dataToRows(xa_table_stabilization, property.investment)
        };
        $scope.data_exit = {
            headerText: 'Exit',
            fields: JsonFactory.dataToRows(xa_table_exit, property.investment)
        };
    });
})

.controller( 'PropertyViewDebtCtrl', function PropertyViewDebtCtrl( $scope, Restangular, JsonFactory ) {
    xa_table_debt = {
        "lender": {"label": "Lender"},
        "initial_ltv": {"label": "Initial LTV", "type": "number", "extra": 0, "append": "%"},
        "initial_amount": {"label": "Loan amount (initial)", "type": "currency"},
        "loan_amount_psf": {"label": "Loan amount PSF", "type": "currency"},
        "reserve_remaining": {"label": "Reserve remaining"},
        "term": {"label": "Term"},
        "initial_expiration": {"label": "Initial Expiration"},
        "rate": {"label": "Rate"},
        "prepayment": {"label": "Prepayment"},
        "io_term": {"label": "I/O Term"}
    };

    $scope.data_debt = { headerText: 'Debt', fields: [] };

    Restangular.one("properties", $scope.id).get().then(function (property) {
        $scope.headerText = property.name;
        $scope.data_debt.fields = JsonFactory.dataToRows(xa_table_debt, property.debt);
    });
})

.controller( 'PropertyViewAssumptionsCtrl', function PropertyViewAssumptionsCtrl( $scope, Restangular, JsonFactory, $filter, ngTableParams ) {
    xa_table_assumptions = {
        "suite": {"label": "Suite"},
        "lease_name": {"label": "Lease Name"},
        "status": {"label": "Status"},
        "lease_from": {"label": "Lease From"},
        "lease_to": {"label": "Lease To"},
        "area": {"label": "Area"},
        "percent_of_total_area": {"label": "% of Total Area"},
        "base_rent": {"label": "Base Rent"}
    };

    Restangular.one("properties", $scope.id).get().then(function(property) {
        $scope.data_assumptions = property.lease.assumptions;
        /* jshint ignore:start */
        $scope.tableParams = new ngTableParams({
            count: $scope.data_assumptions.length
        },{
            counts: []
        });
        /* jshint ignore:end */

    });
})

.controller( 'PropertyViewTop5Ctrl', function PropertyViewTop5Ctrl( $scope, Restangular, JsonFactory, $filter, ngTableParams ) {
    xa_table_top5 = {
        "lease_name": {"label": "Tenant"},
        "unit": {"label": "Suite"},
        "lease_from": {"label": "Lease From"},
        "lease_to": {"label": "Lease To"},
        "area": {"label": "Area", "type": "number", "extra": 0},
        "percent_of_total_area": {"label": "% of Total Area", "type": "number"},
        "base_rent": {"label": "Base Rent"},
        "percent_of_total_base_rent": {"label": "% of Total Base Rent"}
    };

    Restangular.one("properties", $scope.id).get().then(function (property) {
        console.log(property);
        $scope.data_top5 = property.lease.top5;

        console.log($scope.data_top5);

        for(var obj in $scope.data_top5) {
            if($scope.data_top5.hasOwnProperty(obj)) {
                $scope.data_top5[obj]['percent_of_total_base_rent'] =
                    ($scope.data_top5[obj]['area'] / $scope.data_top5[obj]['base_rent']) * 100 ;
            }
        }
        /* jshint ignore:start */
        $scope.tableParams = new ngTableParams({
            count: $scope.data_top5.length
        },{
            counts: []
        });
        /* jshint ignore:end */

    });
})
.controller( 'PropertyViewRentRollCtrl', function PropertyViewRentRollCtrl( $scope, Restangular, JsonFactory, $filter, ngTableParams ) {
    xa_table_top5 = {
        "unit": {"label": "Unit"},
        "lease_name": {"label": "Lease Name"},
        "status": {"label": "Status"},
        "lease_from": {"label": "Lease From"},
        "lease_to": {"label": "Lease To"},
        "area": {"label": "Area"},
        "percent_of_total_area": {"label": "% of Total Area"},
        "base_rent": {"label": "Base Rent"}
    };


    Restangular.one("properties", $scope.id).get().then(function (property) {
        $scope.data_rentroll = property.lease.expiration;

        $scope.rolling_config = {
            title: '% SF Rolling', tooltips: false, labels: false,
            legend: { display: true, position: 'right'}
        };

        $scope.cumulative_config = {
            title: '% Cumulative Roll', tooltips: false, labels: false,
            legend: { display: false, position: 'right' }
        };

        $scope.avgrent_config = {
            title: 'Avg In-Place Rent and Market Rent', tooltips: false, labels: false,
            legend: { display: true, position: 'right' }
        };

        var rolling_years = [2015, 2016, 2017, 2018, 2019];
        $scope.rolling_data = {
            series: ['% SF Rolling'], data: []
        };

        $scope.avgrent_data = {
            series: ['Avg In-Place Rent','Market Rent'], data: []
        };

        $scope.cumulative_data = {
            series: ['% Cumulative Roll'], data: []
        };

        var annual_market_rent = property.market_rent * 12;
        var prev_market_rate = property.market_rate[rolling_years[0]];

        var sf_annual = [];
        _.each(property.lease.expiration, function(expiration) {
            sf_annual.push(expiration.price_sf_annual);
        });

        _.each(rolling_years, function(year) {
            var rolling_sf = 0;
            var cumulative_sf = 0;
            var roll_year = moment(year + '-01-01');
            var prev_roll_year = moment(roll_year).subtract(2, 'years').endOf('year');
            var new_market_rate = annual_market_rent * (1 + (prev_market_rate / 100));
            prev_market_rate = new_market_rate;
            var total_sf= 0;
            var product_of_total_and_price = 0;

            _.each(property.lease.expiration, function(expiration, index) {
                var term = moment(expiration.term_to);
                var sf = expiration.sf;
                total_sf += sf;
                var new_rent = sf_annual[index];
                if(expiration.annual_rent_bump_type === "price") {
                    new_rent = new_rent + expiration.annual_rent_bump;
                } else if (expiration.annual_rent_bump_type === "percent") {
                    new_rent = new_rent * (1 + (expiration.annual_rent_bump / 100));
                }
                sf_annual[index] = new_rent;
                product_of_total_and_price += (expiration.sf * new_rent);
                if(term.isBefore(roll_year, 'year')) {
                    cumulative_sf += sf;
                    if(term.isAfter(prev_roll_year, 'year')) {
                        rolling_sf += sf;
                    }
                }
            });

            var average_in_place_rent = product_of_total_and_price / total_sf;

            var rolling_data_point = {
                'x': year,
                'y': [(rolling_sf / property.square_footage) * 100]
            };

            var cumulative_data_point = {
                'x': year,
                'y': [(cumulative_sf / property.square_footage) * 100]
            };

            var avgrent_data_point = {
                'x': year,
                'y': [average_in_place_rent, new_market_rate]
            };

            $scope.rolling_data.data.push(rolling_data_point);
            $scope.avgrent_data.data.push(avgrent_data_point);
            $scope.cumulative_data.data.push(cumulative_data_point);
        });

        /* jshint ignore:start */
        $scope.tableParams = new ngTableParams({
            count: $scope.data_rentroll.length
        },{
            counts: []
        });
        /* jshint ignore:end */
    });

})

;
