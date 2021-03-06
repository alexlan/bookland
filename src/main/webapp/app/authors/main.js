define(['require'
        ,'angular'
        ,'angular-ui-router'
        ,'angular-resource'
        ,'angular-bootstrap'
        , 'components'
        , 'filters'
        ,'./authorModalController'
        ,'./authorNewController'
        ,'./authorService'
        ,'./authorSelectDirective'
    ], function (require, angular) {

        var moduleName = 'bookland.author';
        var authors = angular.module(moduleName, ['ngResource','ui.bootstrap','ui.router','bookland.components', 'bookland.filters']);

        function blAuthorConfig($stateProvider) {
            $stateProvider
                .state('authors', {
                    url: '/newAuthor',
                    templateUrl: 'app/authors/edit.html',
                    controller: 'NewAuthorController',
                    controllerAs: 'newAuthorCtrl'
                });
        }

        authors.config(blAuthorConfig);

        authors.directive('blAuthorSelect',require('./authorSelectDirective'));

        authors.controller('NewAuthorController', require('./authorNewController'));
        authors.controller('AuthorModalCtrl', require('./authorModalController'));

        authors.factory('authorService', require('./authorService'));

        return moduleName;
});