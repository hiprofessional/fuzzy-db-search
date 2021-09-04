const express = require('express')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
  node: 'http://localhost:9200',
  log: 'trace'
})

app.use(express.static('static'));

app.post('/search', function (req, res) {
  const q = {
    index: 'store',
    type: 'products',
    body: {
      query: {
        fuzzy: {
          Name: req.body.value
        }
      }
    }
  }

  const q1 = {
    index: 'store',
    type: 'products',
    body: {
      query: {
        match: {
          Name: {
            query: req.body.value,
            operator: 'and',
            fuzziness: 'auto'
          }
        }
      }
    }
  }

  const q2 = {
    index: 'store',
    type: 'products',
    body: {
      query: {
        wildcard: {
          Name: {
            value: '*' + req.body.value + '*',
            boost: 1.0,
            rewrite: "constant_score"
          }
        },
      }
    }
  }

  const q3 = {
    index: 'store',
    type: 'products',
    body: {
      query: {
        bool: {
          should: [
            {
              wildcard: {
                Name: {
                  value: '*' + req.body.value + '*',
                  boost: 1.0,
                  rewrite: "constant_score"
                }
              },
            },
            {
              match: {
                Name: {
                  query: req.body.value,
                  operator: 'or',
                  fuzziness: 'auto'
                }
              }
            }
          ]
        }
      }
    }
  };

  const q4 = {
    index: 'store',
    type: 'products',
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                Name: {
                  query: req.body.value,
                  operator: 'or',
                  fuzziness: 'auto'
                }
              }
            }
          ],
          should: [
            {
              wildcard: {
                Name: {
                  value: '*' + req.body.value + '*',
                  boost: 1.0,
                  rewrite: "constant_score"
                }
              },
            },
          ]
        }
      },
      suggest: {
        searchSuggestion: {
          text: req.body.value,
          term: {
            field: "Name"
          }
        }
      }
    }
  }

  const q5 = {
    index: 'store',
    type: 'products',
    body: {
      query: {
        bool: {
          must: [

          ],
          should: [
            {
              match: {
                Name: {
                  query: req.body.value,
                  operator: 'and',
                  fuzziness: 'auto'
                }
              }
            },
            {
              wildcard: {
                Name: {
                  value: '*' + req.body.value + '*',
                  boost: 1.0,
                  rewrite: "constant_score"
                }
              },
            },
          ]
        }
      },
      suggest: {
        text: req.body.value,
        simple_phrase: {
          phrase: {
            field: "Name",
            size: 2,
            gram_size: 1,
            direct_generator: [{
              field: "Name",
              suggest_mode: "always"
            }],
            highlight: {
              pre_tag: "<em>",
              post_tag: "</em>"
            }
          }
        }
      }
    }
  }

  const result = client.search(q5);


  result.then((data) => {
    return res.status(200).json(
      data.body
    );
  });
});

app.listen(3000)