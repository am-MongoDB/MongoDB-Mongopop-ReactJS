/*
Service for clients to access the Mongopop and MongoDB Atlas web APIs
*/

export class DataService {
    getSumfin (what) {
        return ("You asked me for " + what);
    }

    getSumfinRemote (url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', "//ipinfo.io/json", true);
            xhr.send();
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            function processRequest(e) {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    resolve(response.ip);
                }
            }
        }
        )}

    constructor (url) {
        this.baseURL = url;
        this.MongoDBURI = "";
        console.log("Constructor setting baseURL to " + url);
        console.log(this);
    }

    fetchServerIP () {
        // Ask the MongoPop API for its IP address
        let _this = this;
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            console.log("baseURL = " + _this.baseURL);

            xhr.open('GET', _this.baseURL + "/ip", true);
            xhr.send();
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;

            function processRequest(e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        resolve(response.ip);
                    } else {
                        var error = xhr.statusText;
                        reject("http/app Error: " + error);
                    }
                }
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        })
    }

    calculateMongoDBURI(dbInputs) {
        /* 
        Returns the URI for accessing the database; if it's for MongoDB Atlas then include the password and
        use the chosen database name rather than 'admin'. Also returns the redacted URI (with the password
        masked).

        dbInputs:
        {
            MongoDBBaseURI: string,
            MongoDBDatabaseName: string,
            MongoDBUser: string,
            MongoDBUserPassword: string
        }

        returns: 
        {
            MongoDBURI: string,
            MongoDBURIRedacted: string
        }
        */

        let MongoDBURI = "";
        let MongoDBURIRedacted ="";

        if (dbInputs.MongoDBBaseURI === "mongodb://localhost:27017") {
            MongoDBURI = dbInputs.MongoDBBaseURI + "/" 
            + dbInputs.MongoDBDatabaseName + "?authSource=admin";
            MongoDBURIRedacted = dbInputs.MongoDBBaseURI;
        } else {
            // Can now assume that the URI is in the format provided by MongoDB Atlas
            dbInputs.MongoDBUser = dbInputs.MongoDBBaseURI.split('mongodb://')[1].split(':')[0];
            MongoDBURI = dbInputs.MongoDBBaseURI
                .replace('admin', dbInputs.MongoDBDatabaseName)
                .replace('PASSWORD', dbInputs.MongoDBUserPassword);
            MongoDBURIRedacted = dbInputs.MongoDBBaseURI
                .replace('admin', dbInputs.MongoDBDatabaseName)
                .replace('PASSWORD', "************");
        }

        this.MongoDBURI = MongoDBURI;
        return({"MongoDBURI": MongoDBURI, 
                "MongoDBURIRedacted": MongoDBURIRedacted});
    }

    sendCountDocs(CollName) {

        /*
        Use the Mongopop API to count the number of documents in the specified
        collection.
        */

        let _this = this;

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            console.log("In sendCountDocs");
            console.log("baseURL = " + _this.baseURL);

            xhr.open('POST', _this.baseURL + "/countDocs", true);
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({
                MongoDBURI:     _this.MongoDBURI,
                collectionName: CollName 
            }));
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;

            function processRequest(e) {
                let errorText = null;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            return resolve(response.count);
                        } else {
                            errorText = "App failure: " + response.error;
                        }
                    } else {
                        errorText = "http error: " + xhr.statusText;
                    }
                }
                if (errorText) {reject(errorText)}
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        }
    )}

    sendAddDocs(CollName:string, DocURL: string, DocCount: number, 
            Unique: boolean) {

        /*
        Use the Mongopop API to add X thousand documents (generated) via the supplied Maockaroo URL.
        */

        let _this = this;

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            console.log("In addDocs");
            console.log("baseURL = " + _this.baseURL);

            xhr.open('POST', _this.baseURL + "/addDocs", true);
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({
                MongoDBURI: _this.MongoDBURI,
                collectionName: CollName,
                dataSource: DocURL,
                numberDocs: DocCount,
                unique: Unique
            }));
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;

            function processRequest(e) {
                let errorText = null;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            return resolve(response.count);
                        } else {
                            errorText = "App failure: " + response.error;
                        }
                    } else {
                        errorText = "http error: " + xhr.statusText;
                    }
                }
                if (errorText) {reject(errorText)}
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        }
    )}

    sendSampleDocs(CollName:string, NumberDocs: number) {

        /*
        Use the Mongopop API to fetch a sample of `NumberDocs` documents 
        from the `CollName` collection.
        */

        let _this = this;

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            console.log("In sampleDocs");

            xhr.open('POST', _this.baseURL + "/sampleDocs", true);
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({
                MongoDBURI: _this.MongoDBURI,
                collectionName: CollName,
                numberDocs: NumberDocs
            }));
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;

            function processRequest(e) {
                let errorText = null;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            return resolve(response.documents);
                        } else {
                            errorText = "App failure: " + response.error;
                        }
                    } else {
                        errorText = "http error: " + xhr.statusText;
                    }
                }
                if (errorText) {reject(errorText)}
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        }
    )}

    tryParseJSON (jsonString: string): Object{

        /*
        Attempts to build an object from the supplied string. Raises an error if
        the conversion fails (e.g. if it isn't valid JSON format).
        */

        try {
            let myObject = JSON.parse(jsonString);

            if (myObject && typeof myObject === "object") {
                return myObject;
            }
        }
        catch (error) { 
            let errorString = "Not valid JSON: " + error.message;
            console.log(errorString);
            new Error(errorString);
        }
        return {};
    }

    sendUpdateDocs(collName: string, matchPattern: string, dataChange: string, threads: number) {

        let _this = this;
        let matchObject = null;
        let changeObject = null

        return new Promise(function(resolve, reject) {

            try {
                matchObject = _this.tryParseJSON(matchPattern);
                }
            catch (error) {
                let errorString = "Match pattern: " + error.message;
                console.log(errorString);
                return reject(errorString);
            }            
            try {
                changeObject = _this.tryParseJSON(dataChange);
            }
            catch (error) {
                let errorString = "Data change: " + error.message;
                console.log(errorString);
                return reject(errorString);
            }

            var xhr = new XMLHttpRequest();
            console.log("In upDateDocs");

            xhr.open('POST', _this.baseURL + "/updateDocs", true);
            xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify({
                MongoDBURI: _this.MongoDBURI,
                collectionName: collName,
                matchPattern: matchObject,
                dataChange: changeObject,
                threads: threads
            }));
            xhr.addEventListener("readystatechange", processRequest, false);
            xhr.onreadystatechange = processRequest;
            xhr.onerror = processError;
            xhr.onabort = processError;

            function processRequest(e) {
                let errorText = null;
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText);
                        var response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            return resolve(response.count);
                        } else {
                            errorText = "App failure: " + response.error;
                        }
                    } else {
                        errorText = "http error: " + xhr.statusText;
                    }
                }
                if (errorText) {reject(errorText)}
            }

            function processError(err) {
                reject("Network Error: " + err.target.status);
            }
        }
    )}
}