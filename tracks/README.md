# Running tracks

A static site listing real oval running tracks by city, with honest access information.

Live at [ejedeo.github.io/tracks](https://ejedeo.github.io/tracks/).

## Why access confidence is the whole point

Most track listings tell you a track exists. That is not the useful fact. The useful
fact is whether you can run on it at 6am without finding a locked gate, and most tracks
in American suburbs sit on school property where the answer is "it depends".

Every track carries an access state and a confidence level:

| State | Meaning |
|---|---|
| `public` | Confirmed usable by the public |
| `restricted` | Usable within stated hours or conditions |
| `unconfirmed` | A track exists; nobody has verified public access |
| `closed` | Listed as a landmark, not a running option |

`unconfirmed` never means "probably fine". It means nobody checked.

## Adding a city

1. Add `data/<slug>.json` following the shape of an existing file.
2. Add one entry to `CITIES` in `app.js`.

No build step, no dependencies, no framework.

## Data provenance

Santa Monica and Eugene were researched from public sources. Spring, TX was not solvable
that way — Klein ISD publishes no facility-access policy, so the Doerre Intermediate track
appears in no online search despite being open to the public. It is listed on local
first-hand knowledge. That is a reminder that for physical local access, absence of
evidence online is not evidence of absence.
