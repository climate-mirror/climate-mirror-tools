### warc-digest

#### What

A simple script to calculate hash/checksum/digest for HTTP response bodies in
a [WARC](https://en.wikipedia.org/wiki/Web_ARChive) file. This can be useful
when verifying the content of a WARC against the original website or another
WARC file.

#### How

The `warc-digest` script reads from stdin and expects an uncompressed WARC file.

```
cd $THIS_REPO
npm install
zcat $PATH_TO_WARC_GZ | ./warc-digest
```

This will output rows with the SHA256 hex digest of the response body followed
by the URI. For now, edit the `warc-digest` script to exclude URIs by regular
expression or to change the hash algorithm or format.
