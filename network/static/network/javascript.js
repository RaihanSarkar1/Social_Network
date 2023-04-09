// Starting with first post
let counter = 0;

// Load 10 posts at a time
const quantity = 10;


// load the global static url
var staticUrl = DJANGO_STATIC_URL +  'static/img/user.png';


// When the DOM loads load the posts by running the load function
document.addEventListener('DOMContentLoaded', load)


// load the posts
function load() {
    // Set the start and end post counters
    start = counter;
    end = counter + quantity - 1;

    //reset the counter to start at new mark
    counter = end + 1;

    // Get the posts and add an element post
    fetch(`/posts?start=${start}&end=${end}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data.forEach(element => {
            add_post(element);
        });
    })
}

// Add a new post to the DOM
function add_post(content){

    //GET the username from userid
    username = get_username(content.user_id);
    username.then(username => {
        console.log(username);

        //Create new post
        const post = document.createElement('div');
        post.setAttribute('id','post');
        post.classList.add("border");
        post.classList.add("rounded");
        post.classList.add("mb-2");
        post.classList.add("p-2");

        //Show the username and content
        post.innerHTML = `<h5>${username}</h5> <p>${content.text}</p>`;

        // Changing the date time format from django style
        var myDateTime = new Date(content.created_at);
        var formattedDateTime = myDateTime.toLocaleString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,

        });

        
        
        // Create an element to show date time
        const createdDate = document.createElement('p');
        createdDate.setAttribute('id','date');

        createdDate.innerHTML = `${formattedDateTime}`;
        post.appendChild(createdDate);

        // Add post to the DOM
        document.querySelector("#posts").append(post);
    })

    

}

// Get username
async function get_username(user_id){
    console.log(user_id);
    
    const resposne = await fetch(`/username?user_id=${user_id}`);
    const data = await resposne.json();
    return data.username;
}


