# API Project: URL Shortener Microservice for freeCodeCamp


### User Stories

1. One can POST a URL to `[project_url]/api/shorturl/new` and you will receive a shortened URL in the JSON response. Example : `{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`. 

#### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

#### Usage:

[this_project_url]/api/doap

#### Will redirect to:

https://www.freecodecamp.org/forum/
