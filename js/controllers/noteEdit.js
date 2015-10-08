(function () {
    'use strict';

    angular
        .module('App')
        .controller('noteEditController', noteEditController);

    noteEditController.$inject = ['$log', '$scope', '$state', '$stateParams', 'dbService'];

    function noteEditController($log, $scope, $state, $stateParams, dbService) {
        var vm = this;
        vm.note = {};
        
        vm.editNote = editNote;        
        
        ////////////
        
        function editNote() {
            
            console.log('edit note 6');
            
            if (vm.noteEditForm.$dirty === true && vm.noteEditForm.$valid === true) {

console.log('edit note 7');
                dbService.getDb().then((function(db) {

console.log('edit note 8');
                    var note = db.getSchema().table('Note');

                    // https://github.com/google/lovefield/blob/master/docs/spec/04_query.md#43-update-query-builder
                    db.update(note)
                        .set(note.text, vm.note.text)
                        .where(note.id.eq(vm.note.id))
                        .exec()
                        .then(
                            function() {
                                console.log(vm.note);
                                vm.noteEditForm.$setPristine();
                                $state.go('notelist');
                            });	
                }));
            }
        }
        
        $scope.$on('$ionicView.enter', function () {
            
            console.log($stateParams.id);
            
            dbService.getDb().then((function(db) {
             
             console.log('edit note 1');
             
                var note = db.getSchema().table('Note');
             
             console.log('edit note 2');
                
                db.select()
                    .from(note)
                    .where(note.id.eq($stateParams.id))
                    .exec()
                    .then(
                        function(results) {
                            console.log('edit note 3');
                            if (angular.isDefined(results) && results.length === 1) {
                                console.log('edit note 4');
                                vm.note = results[0];
                                $scope.$apply();
                            } else {
                                console.log('edit note 5');
                                $log.error('Note not found with id of: ' + $stateParams.id, results);
                            }                   
                        });
            }));
        });       
    }
})();
