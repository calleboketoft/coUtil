angular.module('coUtil', [])

.factory('coUtil', function($window, $q) {
    var service = {
        confirm: confirm,
        arrayDiff: arrayDiff,
        arrayDeepPropDiff: arrayDeepPropDiff,
        valByStr: valByStr,
        getClosestParentElem: getClosestParentElem,
        getAllFormEls: getAllFormEls,
        addOrConditionToAttribute: addOrConditionToAttribute,
        findResource: findResource
    };

    function confirm(question) {
        return $window.confirm(question);
    }

    // elements that exist in A but not in B
    function arrayDiff(arrayA, arrayB) {
        return arrayA.filter(function(i) {
            return arrayB.indexOf(i) < 0;
        });
    }

    // get diff between two arrays containing objects
    // based on a nested object property
    function arrayDeepPropDiff(arrayA, arrayB, accessString) {
        return _.filter(arrayB, function(refObj) {
            return !_.find(arrayA, function(selectedObj) {
                return valByStr(selectedObj, accessString) === valByStr(refObj, accessString);
            });
        });
    }

    // dataObj      data: {profile: {displayName: 'test'}}
    // keyStr       'data.profile.displayName'
    // returns      'test'
    function valByStr(dataObj, keyStr) {
        var keyArr = keyStr.split('.');
        var getValueRec = function(currObj, next) {
            next = next || 0;
            if (keyArr.length !== next) {
                currObj = currObj[keyArr[next]];
                next++;
                return getValueRec(currObj, next);
            } else {
                return currObj;
            }
        };
        return getValueRec(dataObj);
    }

    // finds closest element of a type for an angular element
    function getClosestParentElem(childEl, parentElType) {
        var getElemRec = function(currEl) {
            if (!currEl[0]) {
                return null;
            } else if (currEl[0].localName !== parentElType) {
                return getElemRec(currEl.parent());
            }  else {
                return currEl;
            }
        };
        return getElemRec(childEl.parent());
    }

    function getAllFormEls(formElem) {
        var foundEls = [];
        ['input', 'textarea', 'button'].forEach(function(elType) {
            foundEls = foundEls.concat(Array.prototype.slice.call(formElem.find(elType)));
        });
        return foundEls;
    }

    // element is the DOM element, not angular.element
    function addOrConditionToAttribute(element, attributeName, orCondition) {
        var $elem = angular.element(element);
        var previousAttributeVal = $elem.attr('data-' + attributeName) || $elem.attr(attributeName);
        $elem.removeAttr('data-' + attributeName).removeAttr(attributeName);
        var newAttributeVal = previousAttributeVal ? previousAttributeVal + ' || ' + orCondition : orCondition;
        $elem.attr('data-' + attributeName, newAttributeVal);
    }

    function findResource(list, resId) {
        return $q(function(resolve, reject) {
            var foundResource = _.find(list, function(listItem) {
                return listItem.id == resId;
            });
            if (foundResource) {
                resolve(foundResource);
            } else {
                reject({
                    header: 'Error: Not Found',
                    body: 'Item not found'
                });
            }
        });
    }

    return service;
});
