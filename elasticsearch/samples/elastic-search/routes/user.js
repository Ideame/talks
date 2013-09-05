var ElasticSearchClient = require('elasticsearchclient');
var client = new ElasticSearchClient({
   host: 'api.searchbox.io',
   secure: false,
   auth: {
        username: 'site',
        password: '51b6806a2a25499dbb5c3449fe429045'
    }
});

client.putMapping('ideame', 'user', {
    user: {
        properties: {
            minibioEs: {
                type: 'string',
                analyzer: 'spanish'
            },
            minibioEn: {
                type: 'string',
                analyzer: 'english'
            }
        }
    }
}, function(err, a) { console.log(a);   });


exports.search = function(req, res){
    var term = req.query.q;
    client.search('ideame', 'user', { query: { query_string: { query: req.query.q + '*' } } },
        function (err, data) {
            console.log(err);
            console.log(data);
           var users = JSON.parse(data);
           res.render('index', { users: users.hits.hits.map(function(u) { return u._source; } ) } );
        }
    );
};

exports.createForm = function(req, res){
  return res.render('create');
};

exports.create = function(req, res){
    var user = req.body.user;
    user.id = Date.now();
    client.index('ideame', 'user', user, user.id)
        .on('data', function(data) {
            console.log(data);
        })
        .on('error', function(err) {
            console.log(err);
        })
        .exec();

    res.redirect('/');
};