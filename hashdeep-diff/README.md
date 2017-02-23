### hashdeep-diff

A script to compare two `hashdeep` audit files. 
Allows for stripping or adding path prefixes within either file.
Outputs JSON formatted differences between the two files.

#### Example usage

Combined with the `jq` tool, you can format and filter the differences to get a clearer picture:

```
hashdeep-diff --strip ./ --prefix ftp.example.com/ audit1.txt --strip backup/ audit2.txt > changes.json
jq < changes.json # pretty-printed and colorized details
jq 'map(select(.file == "some/data/file.txt"))' < changes.json # differences for a single file
jq -r 'map(select(.type != "added"))[].file' < changes.json # changed or removed filenames
```
