var request = require('request');
var HTMLParser = require('node-html-parser');
var dotenv = require('dotenv').config();

var cookies = [];

function registerSetCookie(set_cookie_headers) {
    set_cookie_headers.forEach(header => {
        var isAlreadySet = false;
        var line = header.split(';')[0].split('=');
        var cookie_name = line[0];
        var cookie_value = line[1];
        cookies.forEach(cookie => {
            if (cookie.name == cookie_name) {
                cookie.value = cookie_value;
                isAlreadySet = true;
            }
        })
        if (!isAlreadySet)
            cookies.push({ name: line[0], value: line[1] });
    })
}

function getCookieHeader() {
    var header = String();
    cookies.forEach(cookie => {
        header += String(cookie.name + '=' + cookie.value + '; ');
    })
    return header;
}

function initialize(err, res, body) {
    if (err) {
        console.error(err)
        return;
    }
    console.log('Initialize callback...');
    console.log('Status code: ', res.statusCode);

    registerSetCookie(res.headers["set-cookie"]);

    let html = HTMLParser.parse(body);
    let CSRF_TOKEN = html.querySelector('[name=csrf-token]')._attrs.content;

    var options = {
        url: 'https://www.noip.com/login',
        method: 'POST',
        followAllRedirects: false,
        headers: {
            'Cookie': getCookieHeader(),
            Accept: '*/*',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: 'https://www.noip.com',
            DNT: 1,
            Connection: 'keep-alive',
            Referer: 'https://www.noip.com/',
            'Upgrade-Insecure-Requests': 1
        },
        body: 'username=' + process.env.USERNAME + '&password=' + process.env.PASSWORD + '&submit_login_page=1&Login=1&intended_hash=&_token=' + CSRF_TOKEN
    }

    request(options, login);
}

function login(err, res, body) {
    console.log('Login callback...');
    console.log('Status code: ', res.statusCode);
    registerSetCookie(res.headers['set-cookie']);
    if (res.statusCode == 302) {
        var options = {
            url: res.headers['location'],
            method: 'GET',
            headers: {
                Cookie: getCookieHeader()
            }
        }
        request(options, redirect);
    }
}

function redirect(err, res, body) {
    console.log('Redirect callback...');
    console.log('Status code: ', res.statusCode)

    var options = {
        url: res.headers['location'],
        method: 'GET',
        headers: {
            Cookie: getCookieHeader()
        }
    }
    // request(options, getBID);
}

function getBID(err, res, body) {
    console.log('Final callback...');
    console.log('Status code: ', res.statusCode); 
}


request('https://www.noip.com/login', initialize);