document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#submit-form').addEventListener('submit', (event) => {
        event.preventDefault();
        post();
      });
});



function post() {
    const newPost = {
      post: document.querySelector('#post').value
    };
    fetch('/post', {
      method: 'POST',
      headers: {'Content-Type':'applications/json'},    
      body: JSON.stringify(newPost)
      })
    .then(response => {
      return response.json()
    })
    .then(data => {
      console.log(data);
      })
    .catch(error => {
      console.log('There was a problem with the fetch operation');
    });
  }