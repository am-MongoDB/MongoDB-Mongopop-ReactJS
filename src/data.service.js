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




}
