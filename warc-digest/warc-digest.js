var assert = require('assert'),
    crypto = require('crypto'),
    HTTPParser = require('http-parser-js').HTTPParser,
    WARCStream = require('warc');

module.exports = {
    hashResponse: function(warcRecord, algo, cb) {
        var parser, hash, i, bytes = 0, size = -1;

        hash = crypto.createHash(algo);
        parser = new HTTPParser(HTTPParser.RESPONSE);
        parser.onHeadersComplete = function(res) {
            for (i = 0; i < res.headers.length; i++) {
                if (res.headers[i] == 'Content-Length') {
                    size = res.headers[i+1];
                    return;
                }
            }
        };
        parser.onBody = function(chunk, offset, length) {
            var body_chunk = chunk.slice(offset);
            hash.update(body_chunk);
            bytes += length;
        };
        parser.onMessageComplete = function() {
            assert(bytes == size, "Expected " + size + " bytes but got " + bytes);
            cb(hash);
        }
        parser.execute(warcRecord.content);
    },
    logResponseDigests: function(opts) {
        opts = opts || {};
        var w = new WARCStream(),
            src = opts.src || process.stdin,
            exclude = opts.exclude || [],
            algo = opts.hash || 'sha256',
            fmt = opts.format || 'hex';
        src.pipe(w).on('data', function(warcRecord) {
            var uri;
            if (warcRecord.headers['WARC-Type'] !== 'response') {
                return;
            }
            uri = warcRecord.headers['WARC-Target-URI'];
            if (!uri) {
                return;
            }
            for (i = 0; i < exclude.length; i++) {
                if (uri && uri.match(exclude[i])) {
                    return;
                }
            }
            module.exports.hashResponse(warcRecord, algo, function(hash) {
                console.log(hash.digest(fmt) + '  ' + uri);
            });
        });
    }
};
