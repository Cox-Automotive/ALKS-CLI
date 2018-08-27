var program   = require('commander'),
    clc       = require('cli-color'),
    _         = require('underscore'),
    async     = require('async'),
    alks      = require('alks-node'),
    config    = require('../package.json'),
    Developer = require('./developer'),
    keys      = require('./keys'),
    utils     = require('./utils');

exports.getIAMKey = function(program, logger, alksAccount, alksRole, forceNewSession, filterFavorites, cb){
    async.waterfall([
        // check to be sure were configured
        function(callback){
            Developer.ensureConfigured(callback);
        },
        // get developer
        function(callback){
            utils.log(program, logger, 'getting developer');
            Developer.getDeveloper(callback);
        },
        // get auth
        function(developer, callback){
            utils.log(program, logger, 'getting auth');
            Developer.getAuth(program, function(err, auth){
                callback(err, developer, auth);
            });
        },
        // get alks account
        function(developer, auth, callback){
            // set auth so they dont get prompted again
            program.auth = auth;

            // only lookup alks account if they didnt provide
            if(_.isEmpty(alksAccount) || _.isEmpty(alksRole)){
                utils.log(program, logger, 'getting accounts');
                Developer.getALKSAccount(program, { iamOnly: true, filterFavorites: filterFavorites }, function(err, data){
                    if(err) callback(err);
                    else callback(null, developer, auth, data.alksAccount, data.alksRole);
                });
            }
            else{
                utils.log(program, logger, 'using provided account/role');
                callback(null, developer, auth, alksAccount, alksRole);
            }
        },
        // now retrieve existing keys
        function(developer, auth, alksAccount, alksRole, callback){
            utils.log(program, logger, 'getting existing keys');
            keys.getKeys(auth, true, function(err, keys){
                utils.log(program, logger, 'got existing keys');
                callback(err, developer, auth, alksAccount, alksRole, keys);
            });
        },
        // look for existing session
        function(developer, auth, alksAccount, alksRole, existingKeys, callback){
            if(existingKeys.length && !forceNewSession){
                utils.log(program, logger, 'filtering keys by account/role - ' + alksAccount + ' - ' + alksRole);

                // filter keys for the selected alks account/role
                var keyCriteria = { alksAccount: alksAccount, alksRole: alksRole },
                // filter, sort by expiration, grab last key to expire
                    selectedKey = _.last(_.sortBy(_.where(existingKeys, keyCriteria), 'expires'));

                if(selectedKey){
                    utils.log(program, logger, 'found existing valid key');
                    console.error(clc.white.underline([ 'Resuming existing session in', alksAccount, alksRole ].join(' ')));
                    return callback(null, selectedKey, developer, auth);
                }
            }

            // generate a new key/session
            if(forceNewSession){
                utils.log(program, logger, 'forcing a new session');
            }

            utils.log(program, logger, 'calling api to generate new keys/session');
            console.error(clc.white.underline([ 'Creating new session in', alksAccount, alksRole ].join(' ')));

            var data = _.extend(developer, { alksAccount: alksAccount, alksRole: alksRole });
            alks.createIamKey(data, auth, { debug: program.verbose, ua: utils.getUA() }, function(err, key){
                if(!err){
                    utils.log(program, logger, 'storing key: ' + JSON.stringify(key));
                    keys.addKey(key.accessKey, key.secretKey, key.sessionToken,
                                key.alksAccount, key.alksRole, key.expires.toDate(), auth, true);
                }
                else if(err.message.indexOf('please check API URL') !== -1){
                    err = new Error(utils.getBadAccountMessage());
                }


                callback(err, key, developer, auth);
            });
        }
    ], cb);
};

exports.getIAMAccount = function(program, logger, alksAccount, alksRole, filterFavorites, cb){
    async.waterfall([
        // check to be sure were configured
        function(callback){
            Developer.ensureConfigured(callback);
        },
        // get developer
        function(callback){
            utils.log(program, logger, 'getting developer');
            Developer.getDeveloper(callback);
        },
        // get auth
        function(developer, callback){
            utils.log(program, logger, 'getting auth');
            Developer.getAuth(program, function(err, auth){
                callback(err, developer, auth);
            });
        },
        // get alks account
        function(developer, auth, callback){
            // set auth so they dont get prompted again
            program.auth = auth;

            // only lookup alks account if they didnt provide
            if(_.isEmpty(alksAccount) || _.isEmpty(alksRole)){
                utils.log(program, logger, 'getting accounts');
                Developer.getALKSAccount(program, { iamOnly: true, filterFavorites: filterFavorites }, function(err, data){
                    if(err) callback(err);
                    else callback(null, developer, auth, data.alksAccount, data.alksRole);
                });
            }
            else{
                utils.log(program, logger, 'using provided account/role' + alksAccount + ' ' + alksRole);
                callback(null, developer, auth, alksAccount, alksRole);
            }
        }
    ], cb);
};