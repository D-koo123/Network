document.addEventListener('DOMContentLoaded', function () {
    const editElements = document.querySelectorAll('.edit');
    editElements.forEach((element) => {
        element.addEventListener('click', (event)=> {
            replacePost(event);
        })
    })
    const addLikeElements = document.querySelectorAll('.addlike');
    addLikeElements.forEach((element) => {
        element.addEventListener('click', (event) => {
            addLike(event.target.dataset.postid, event.target.dataset.userid, event.target.parentElement.querySelector('.totallikes'));
        })
    })
    const subtractLikeElements = document.querySelectorAll('.subtractlike');
    subtractLikeElements.forEach((element) => {
        element.addEventListener('click', (event) => {
            subtractLike(event.target.dataset.postid, event.target.dataset.userid, event.target.parentElement.querySelector('.totallikes'));
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


function sendEdit(element, id) {
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



function addLike(postid, userid, likeTag) {
  // console.log(parseInt(parent.textContent));
    const addLIke = {
        liked_post : postid,
        liker : userid
    }
    fetch('/like/', {
      method: 'POST',
      headers: {'Content-Type':'applications/json'},    
      body: JSON.stringify(addLIke)
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
    const parentElement = document.querySelector(`#l${postid}`).parentElement;
    const newElement = document.createElement('button');
    newElement.innerHTML = 'Unlike';
    newElement.setAttribute('data-postid', postid);
    newElement.setAttribute('data-userid', userid);
    newElement.className = 'subtractlike'; // Use className for class attribute
    newElement.id = `u${postid}`; // Set the ID
    newElement.addEventListener('click', (event) => {
      subtractLike(event.target.dataset.postid, event.target.dataset.userid, event.target.parentElement.querySelector('.totallikes'));
    });
    likeTag.textContent = parseInt(likeTag.textContent) + 1;    
    parentElement.replaceChild(newElement, document.querySelector(`#l${postid}`))
    
}


function subtractLike(postid, userid, likeTag) {
    const subtractLIke = {
        liked_post : postid,
        liker : userid
    }
    fetch('/like/', {
      method: 'DELETE',
      headers: {'Content-Type':'applications/json'},    
      body: JSON.stringify(subtractLIke)
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
    const parentElement = document.querySelector(`#u${postid}`).parentElement;
    const newElement = document.createElement('button');
    newElement.innerHTML = 'Like';
    newElement.setAttribute('data-postid', postid);
    newElement.setAttribute('data-userid', userid);
    newElement.className = 'addlike'; // Use className for class attribute
    newElement.id = `l${postid}`; // Set the ID
    newElement.addEventListener('click', (event) => {
      addLike(event.target.dataset.postid, event.target.dataset.userid, event.target.parentElement.querySelector('.totallikes'));
    });
    likeTag.textContent = parseInt(likeTag.textContent) - 1; 
    parentElement.replaceChild(newElement, document.querySelector(`#u${postid}`))
}