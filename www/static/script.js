var productsContainer = document.querySelector('.products');
var suggestionContainer = document.querySelector('.suggestions');
var suggestionsList = document.querySelector('.suggestions__items');
var searchInput = document.querySelector('#search');

function handleTyping() {
  const searchDebaunced = debounce(search, 1000);
  let prevValue = '';
  searchInput.addEventListener('keyup', function (event) {
    if (prevValue != event.target.value) {
      searchDebaunced(event.target.value);
      prevValue = event.target.value;
    }
  })
}

function debounce(cb, duration) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      cb(...args);
    }, duration);
  };
}

function search(searchValue) {
  const searchQuery = {
    value: searchValue
  };
  fetch('search', {
    method: 'POST',
    body: JSON.stringify(searchQuery),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  }).then(
    (response) => {
      return response.json();
    }
  ).then((data) => {
    const prods = data.hits.hits.map(el => el._source);
    const suggestions = data.suggest.simple_phrase;
    drawSuggestion(suggestions);
    handleSuggestionClick();
    drawProducts(prods);
  });
}

function drawProducts(products) {
  const result = products.map(product => {
    const template = `
      <div class="card product">
        <h3>${product.Name}</h3>
        <p>
          ${product.Description}
        </p>
      </div>
    `;
    return template;
  }).join('');
  productsContainer.innerHTML = result;
}

function handleSuggestionClick() {
  document.querySelectorAll('.suggested').forEach(element => {
    element.addEventListener('click', function (event) {
      const suggestion = this.getAttribute('data-suggestion');
      searchInput.value = suggestion;
      search(suggestion);
    });
  });
}

function drawSuggestion(suggestions) {
  let options = [];
  suggestions.forEach(el => {
    const templated = el.options.map(opt => {
      const optResult = `
        <li >
          <a class='suggested' href='#' data-suggestion='${opt.text}'>${opt.highlighted}</a>
        </li>
      `;
      return optResult;
    });

    if (templated.length > 0) {
      options.push(templated.join(
        '<li> или </li>'
      ));
    }
  });

  suggestionsList.innerHTML = options;
  if (options.length > 0) {
    suggestionContainer.classList.add('visible');
  } else {
    suggestionContainer.classList.remove('visible');
  }
}

const productsList = [
  { Id: 1, Name: 'Молоко пастеризованное 2л', Description: 'Хорошое вкусное' },
  { Id: 2, Name: 'Молоко ультрапастеризованное 2л', Description: 'Насыщенный вкус' },
  { Id: 3, Name: 'Молоко соевое 1л', Description: 'Кому-то нужно' },
  { Id: 4, Name: 'Молоко рисовое 2л', Description: 'ого' },
  { Id: 5, Name: 'Молоко овсяное 2л', Description: 'Хорош' },
  { Id: 6, Name: 'Молоко миндальное 2л', Description: 'Это как' },
  { Id: 7, Name: 'Молоко шоколадное 0,2л', Description: 'Хмм' },
  { Id: 8, Name: 'Молоко отборное 1л', Description: 'Хорошое послевкусие' },
  { Id: 9, Name: 'Молоко отборное но старое 1л', Description: 'Хорошое послевкусие' },
  { Id: 10, Name: 'Молоко топленое 2л', Description: 'Ух' },

  { Id: 11, Name: 'Масло пастеризованное 2л', Description: 'Хорошое вкусное' },
  { Id: 12, Name: 'Масло ультрапастеризованное 2л', Description: 'Насыщенный вкус' },
  { Id: 13, Name: 'Масло соевое 1л', Description: 'Кому-то нужно' },
  { Id: 14, Name: 'Масло рисовое 2л', Description: 'ого' },
  { Id: 15, Name: 'Масло овсяное 2л', Description: 'Хорош' },
  { Id: 16, Name: 'Масло миндальное 2л', Description: 'Это как' },
  { Id: 17, Name: 'Масло шоколадное 0,2л', Description: 'Хмм' },
  { Id: 18, Name: 'Масло отборное 1л', Description: 'Хорошое послевкусие' },
  { Id: 19, Name: 'Масло отборное но старое 1л', Description: 'Хорошое послевкусие' },
  { Id: 20, Name: 'Масло топленое 2л', Description: 'Ух' },
]

function addProductsToElastic() {
  products.forEach(product => {
    let response = fetch(elasticUrl + 'store/products/' + product.Id, {
      method: 'PUT',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    });
    let result = response.then(rs => {
      console.log(rs.json());
    })
  })
}

handleTyping();