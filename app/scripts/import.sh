#!/bin/bash
curl -X POST \
  -H "X-Parse-Application-Id: s5XRK5EQxsoLQ7bd9lIz35fqKaWHTTNQwQCXkr3O" \
  -H "X-Parse-REST-API-Key: 99zJUQTnqandl08VrT2cZVB6wgbkEcR6mxmZfRdV" \
  -H "Content-Type: application/json" \
  -d @import_ready.json \
  https://api.parse.com/1/classes/courses