document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.edit');
    elements.forEach((element) => {
        element.addEventListener('click', (event)=> {
            replacePost(event);
        })
    })
    }
);



function replacePost(event) {
    // .post is the paragragh tag with the post, we use it to obtain the div hosting the element
    const postElement = event.target.parentElement.querySelector('.post');
    const post_id = postElement.dataset.id
    console.log(post_id);


    // Create the form element
    const formElement = document.createElement('form');
    formElement.id = 'myForm';
    

    // Create the textarea
    const textareaElement = document.createElement('textarea');
    textareaElement.id = 'myTextarea';
    textareaElement.name = 'post';
    textareaElement.rows = 4;
    textareaElement.cols = 50;
    textareaElement.placeholder = 'Post...';
    //textareaElement.innerHTML = postElement.innerHTML;

    // Create a line break element
    const lineBreak = document.createElement('br');

    // Create the submit button
    const buttonElement = document.createElement('button');
    buttonElement.type = 'submit';
    buttonElement.textContent = 'Edit Post';

    // Append the textarea, and button to the form
    formElement.appendChild(textareaElement);
    formElement.appendChild(lineBreak);
    formElement.appendChild(buttonElement);

    // Replace the post element with the form element
    event.target.parentElement.replaceChild(formElement, postElement);

    // Add submission of form event listener
    formElement.addEventListener('submit', (event) => {
        event.preventDefault();
        sendEdit(postElement, post_id)
    })
}


function sendEdit(element, id, event1) {
    //console.log(document.querySelector('#myTextarea').value)
    const edit = {
        id : id,
        post : document.querySelector('#myTextarea').value
    }
    const postId = id;
    fetch('/edit/', {
      method: 'PUT',
      headers: {'Content-Type':'applications/json'},    
      body: JSON.stringify(edit)
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
    element.textContent = document.querySelector('#myTextarea').value;
    event.target.parentElement.replaceChild(element, event.target);
}



function updateLike() {
    const edit = {
        id : id,
        post : document.querySelector('#myTextarea').value
    }
    const postId = id;
    fetch('/edit/', {
      method: 'PUT',
      headers: {'Content-Type':'applications/json'},    
      body: JSON.stringify(edit)
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
    element.textContent = document.querySelector('#myTextarea').value;
    event.target.parentElement.replaceChild(element, event.target);
}