var MongoClient = require('mongodb').MongoClient;

//The method below takes a URL which is where the database connection is listening for requests
//(that's what the 'mongod --smallfiles' script setup does) 
/*MongoClient.connect('mongodb://localhost:27017/', function(err, db) { //default port for cloud9. 
    if (err) {
        console.error(err);
        db.close();
        return;
    }
    console.log('Connected to MongoDB database');
    db.close();
});

*/



var MongoClient = require('mongodb').MongoClient;
var express = require('express');


MongoClient.connect('mongodb://localhost/snippets', function(err, db) {
    if (err) {
        console.error(err);
        db.close();
        return;
    }
    //below is my CLI

    var collection = db.collection('snippets');

   /*app.get('/snippet',function(req,res){
        collection.find({}, function(snippets){
            console.log(arguments)
            res.status(200).send(snippets)  
        })
    })*/
    
    
    
    var create = function(name, content) { 
        var snippet = {
            name: name,
            content: content
        };
        //name of collection is 'snippets'
        collection.insert(snippet, function(err, result) { 
            if (err) {
                console.error("Could not create snippet", name);
                db.close();
                return;
            }
            console.log("Created snippet", name);
            db.close();
        });
    };
    
    

    var read = function(name) {
        var query = {
            name: name
        };
        collection.findOne(query, function(err, snippet){ //findOne??
            if(!snippet || err) {
                console.error("Could not read the fucking snippet", name);
                db.close();
                return;
            }
            console.log("Reading name:", snippet.name);
            console.log("Reading content:", snippet.content);
        });
        
        db.close();
    };
    
    
    

    var update = function(name, content) {
        var query = {
            name: name
        };

        var update = {
            $set: {content: content}
        };

        collection.findAndModify(query, null, update, function(err, result) {
            var snippet = result.value;
            if (!snippet || err) {
                console.error("Could not update snippet", name);
                db.close();
                return;
            }
            console.log("Updated snippet", snippet.name);
            db.close();
        });
    };
    
    
    
    var del = function(name, content) {
        var query = {
            name: name
        };
        collection.findAndRemove(query, function(err, result) {
            var snippet = result.value;
            if (!snippet || err) {
                console.error("Could not delete snippet", name);
                db.close();
                return;
            }
            console.log("Deleted snippet", snippet.name);
            db.close();
        });
    };
    


    //read extensively on process.argn[].
    var main = function() {
        if (process.argv[2] == 'create') {
            create(process.argv[3], process.argv[4]);
        }
        else if (process.argv[2] == 'read') {
            read(process.argv[3]);
        }
        else if (process.argv[2] == 'update') {
            update(process.argv[3], process.argv[4]);
        }
        else if (process.argv[2] == 'delete') {
            del(process.argv[3]);
        }
        else {
            console.error('Command not recognized');
            db.close();
        }
    };

    main();
});


/*app.listen(process.env.PORT || 8080,function(err){
    if(err)console.log(err)
})*/