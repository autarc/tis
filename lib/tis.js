//*********
//* Modules
//*

var fs = require('fs');



// scanning for the files
var scan = function( dir, cb ){

    var results = [];

    fs.readdir( dir, function ( err, files ) {

        if(err) throw err;

        var pending = files.length;

        if (!pending) return cb ( null, results);


        files.forEach( function ( file ){

            type = file.substr( file.lastIndexOf('.') + 1, file.length );

            if( type === 'html' ) {

                results.push( file );

            }

            if (! --pending ) cb( results );

        });
    });

};

// reading the data
var read = function( path, cb ){

    var templates = {};

    scan( path, function ( data ){

        var pending = data.length;

        data.forEach( function ( file ) {

            file = path + '/' + file;

            fs.readFile( file, 'utf8', function ( err, text ){

                if (err) throw err;

                var name = file.substr( 0, file.length - 5),

                    trimmed =   text.replace(/(\r\n+|\n+|\r+)/gm, '\\')  // line breaks
                                    .replace(/\t+/g, '')                 // removing tabs
                                    .replace(/<!--.*?-->/g, '')          // delete comments
                                    .replace(/[\s]{2}/g, '');            // remaining whitespaces

                templates[name] = '\'' + trimmed + '\'';

                if (! --pending ) cb( templates );
            });
        });

    });
};


// write the data to a file
var create = function ( path ) {

    fs.realpath ( path, function ( err, rp ) {

        if (err) throw  err;

        read( rp, function ( data ){

            data = 'var template = ' + JSON.stringify(data) + ';';

            var name = 'template.js',
                trg = rp + '/' + name;

            fs.writeFile( trg, data, 'utf8', function ( err ){

                if (err) throw err;

                console.log('Created \'' + name + '\'');
            });
        });

    });

};


// export
module.exports.tis = create;