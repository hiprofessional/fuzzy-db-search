# fuzzy db search
 
Here is an example of usage ElasticSearch.
I use docker to run Elastic
```
docker-compose up
```

and for web app just run this commmmand in *www* folder:
```
npm install
```
and after that
```
node app
```

By default Elastic search doesn't contain any data. So you can add it manually or run ```addProductsToElastic()```. This function will add some test data.