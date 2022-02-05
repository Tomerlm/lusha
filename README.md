## Getting Started

use wsl or other bash-like terminal run

```dart
./run.sh
```

## Assumptions

- caching the images like that is safe only when working with one deployment of the server. if we want to use multiple deployments, we would need distributed cache like Redis.
- I assume the the images won't get stale (the api always the same images, no updates or deletions)
- I have enough memory to store the images api response
- page size is always 15
- likes are not persisted when server restarts, to implement that we need to use a database

## Improvments and Issues

- I would implement the error handling as a middleware with custom errors
- In frontend, the implemetation is not optimal. we are wasting a lot of memory because images are presisted because of useMemo. ideally, I would implement a mechanism of "recyceling" image views, so that we won't store everything on memory.
- I would also test frontend for functinality of fetching the requests correctly upon scroll
