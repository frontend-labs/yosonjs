#!/usr/bin/env node
/**
 *Instalation:
 * ~ cd <yoson-repo>
 * ~ ln -s ../../validate-commit-message.js .git/hooks/commit-msg
 */

'use strict';

var fs = require('fs');
var util = require('util');

var MAX_LENGTH = 100;
var PATTERN = /^(?:fixup!\s*)?(\w*)(\(([w\$\.\*/-]*)\))?\: (.*)$/;
var IGNORED = /^WIP\:/;
var TYPES ={
    feat: true,
    fix: true,
    docs: true,
    style: true,
    refactor: true,
    perf: true,
    test: true,
    chore: true,
    revert: true
};

var MSG = {
    IGNORED: "Commit message validation ignored.",
    ERROR:{
        MAX_LENGTH: 'Is longer than %d characters !',
        PATTERN: 'Does not match "<type>(<scope>): <subject>" ! was:',
        TYPES: '"%s" is not allowed type !'
    }
};

var log = console.log;
var logError = function(){
    console.error('INVALID COMMIT MSG:' + util.format.apply(null, arguments));
};

var isMessageIgnored = function(message){
    return IGNORED.test(message);
};

var validateMessage = function(message){
    var isValid = true;
    if(isMessageIgnored(message)){
        log(MSG.IGNORED);
        return true;
    }

    if(message.length > MAX_LENGTH){
        logError(, MAX_LENGTH);
    }

    var match = PATTERN.exec(message);

    if(!match){
        logError(MSG.ERROR.PATTERN + message);
        return false;
    }

    var type = match[1];
    var scope = match[3];
    var subject = match[4];

    if(!TYPES.hasOwnProperty(type)){
        logError(MSG.ERROR.TYPES, type);
        return false;
    }
    // Some more ideas, do want anything like this ?
    // - allow only specific scopes (eg. fix(docs) should not be allowed ?
    // - auto correct the type to lower case ?
    // - auto correct first letter of the subject to lower case ?
    // - auto add empty line after subject ?
    // - auto remove empty () ?
    // - auto correct typos in type ?
    // - store incorrect messages, so that we can learn
    return isValid;
};

var firstLineFromBuffer = function(buffer){
    return buffer.toString().split('\n').shift();
};

//publish for testing
exports.validateMessage = validateMessage;

//hack start if not run by jasmine :-D
if(process.argv.join('').indexOf('jasmine-node') === -1){
    var commitMsgFile = process.argv[2];
    var incorrectLogFile = commitMsgFile.replace('COMMIT_EDITMSG', 'logs/incorrect-commit-msgs');

    fs.readFile(commitMsgFile, function(err, buffer){
        var msg = firstLineFromBuffer(buffer);

        if(!validateMessage(msg)){
            fs.appendFile(incorrectLogFile, msg + '\n', function(){
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
}
