// Recursively get all the items in a list, even more than 5000!
self.getAllItems = function (request, results, deferred) {

    // The first time through, these three variables won't exist, so we create them. On subsequent calls, the variables will already exist.
    var deferred = deferred || $q.defer();
    var results = results || [];
    results.data = results.data || [];

    // Make the call to the REST endpoint using Angular's $http
    $http(request).then(function (response) {

        // The first time through, we don't have any data, so we create the data object with the results
        if (!results.data.d) {
            results.data = response.data;
        } else {
            // If we already have some results from a previous call, we concatenate this set onto the existing array
            results.data.d.results = results.data.d.results.concat(response.data.d.results);
        }

        // If there's more data to fetch, there will be a URL in the __next object; if there isn't, the __next object will not be present
        if (response.data.d.__next) {
            // When we have a next page, we call this function again (recursively).
            // We change the url to the value of __next and pass in the current results and the deferred object we created on the first pass through
            request.url = response.data.d.__next;
            self.getAllItems(request, results, deferred);
        } else {
            // If there is no value for __next, we're all done because we have all the data already, so we resolve the promise with the results.
            deferred.resolve(results);
        }

    });

    // Return the deferred object's promise to the calling code
    return deferred.promise;

};
