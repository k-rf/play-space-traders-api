#! /usr/bin/env bash

output=src/openapi/space-traders.ts

bun openapi-zod-client \
  "https://stoplight.io/api/v1/projects/spacetraders/spacetraders/nodes/reference/SpaceTraders.json?fromExportButton=true&snapshotType=http_service&deref=optimizedBundle" \
  -o ${output} \
  -a \
  -b https://api.spacetraders.io/v2 \
  --all-readonly

bun scripts/camelize-alias.ts ${output}

unset output
