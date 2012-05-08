var fs = require('fs'),

    path = process.argv[2] || process.cwd();


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



var read = function( dir, cb ){

    var templates = {};

    scan( dir, function ( data ){

        var pending = data.length;

        data.forEach( function ( file ) {


            fs.readFile( file, 'utf8', function ( err, text ){

                if (err) throw err;

                var name = file.substr( 0, file.length - 5),

                    trimmed =   text.replace(/(\r\n+|\n+|\r+)/gm, '\\')  // line breaks
                                    .replace(/\t+/g, '')                 // removing tabs
                                    .replace(/<!--.*?-->/g, '')          //
                                    .replace(/[\s]{2}/g, '');            // remaining whitespaces

                templates[name] = '\'' + trimmed + '\'';

                if (! --pending ) cb( templates );
            });
        });

    });

};



var tis = function(){

    read( path, function ( data ){

        var name = 'template.js';

        data = 'var template = ' + JSON.stringify(data) + ';';

        fs.writeFile( name, data, 'utf8', function ( err ){

            if (err) throw err;

            console.log('Created \'' + name + '\'');
        });
    });

};

tis();