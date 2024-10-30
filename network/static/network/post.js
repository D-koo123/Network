document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#all-posts').onclick = ()=> {
        allPosts();
    };
});



function allPosts() {
    console.log('The function is working!');
}