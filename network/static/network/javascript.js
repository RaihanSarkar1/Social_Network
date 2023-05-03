// Starting with first post
let counter = 0;

// Load 10 posts at a time
const quantity = 10;


// load the global static url
var staticUrl = DJANGO_STATIC_URL;



// When the DOM loads load the posts by running the load function
document.addEventListener('DOMContentLoaded', function () {
    // event listener to call load if profile is clicked
    document.querySelector('#index').addEventListener('click', () => load('index'));






    // If there is the element profile_view in the DOM that means it is in the profile page
    if (document.getElementById("profile_view")) {

        // Printing the URL
        console.log(window.location.href);

        // Getting the username from the URL
        // get the url
        const url = window.location.href;
        const parts = url.split('/');
        const last_segment = parts.pop() || parts.pop();    // if the ending is / then first pop is empty so it will get the next string from second pop

        console.log(last_segment);

        const username = last_segment;

        // Load the posts of the user
        load(username);

        console.log(`This is the ${username}`);

        // Check if the current user is following that user or not
        document.querySelector('#btn_follow').style.display = 'none';
        document.querySelector('#btn_unfollow').style.display = 'none';

        fetch(`/checkFollow/${username}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.SameUser === 'true') {
                }
                else if (data.Following === 'true') {
                    document.querySelector('#btn_follow').style.display = 'none';
                    document.querySelector('#btn_unfollow').style.display = 'block';
                } else {
                    document.querySelector('#btn_follow').style.display = 'block';
                    document.querySelector('#btn_unfollow').style.display = 'none';
                }

            })

        //  eventlistener for follow button
        document.querySelector('#btn_follow').addEventListener('click', () => {
            console.log(username);
            fetch(`/pushFollow/${username}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.Following === 'true') {
                        document.querySelector('#btn_follow').style.display = 'none';
                        document.querySelector('#btn_unfollow').style.display = 'block';
                    } else {
                        document.querySelector('#btn_follow').style.display = 'block';
                        document.querySelector('#btn_unfollow').style.display = 'none';
                    }

                })

        });

        //  eventlistener for follow button
        document.querySelector('#btn_unfollow').addEventListener('click', () => {
            console.log(username);
            fetch(`/pushFollow/${username}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.Following === 'true') {
                        document.querySelector('#btn_follow').style.display = 'none';
                        document.querySelector('#btn_unfollow').style.display = 'block';
                    } else {
                        document.querySelector('#btn_follow').style.display = 'block';
                        document.querySelector('#btn_unfollow').style.display = 'none';
                    }

                })

        });

    }

    // If there is the element index_view in the DOM
    if (document.getElementById("index_view")) {
        // Load the posts
        load('index');

        // If scrolled to bottom, load the next 10 posts
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                load('index');
            }
        };
    }

    // If there is the element follow_view in the DOM
    if (document.getElementById("follow_view")) {
        load_follow_posts();

        // If scrolled to bottom, load the next 5 posts
        window.onscroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                load_follow_posts();
            }
        };
    }



})

// load the posts of the user
function load_follow_posts() {
    start = counter;
    end = counter + quantity - 5;
    counter = end + 1;

    route = `/posts?start=${start}&end=${end}&user=null&follow=true`

    fetch(route)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(element => {
                add_post(element);
            });
        })
}

// load the posts
function load(view) {

    // Set the start and end post counters
    start = counter;
    end = counter + quantity - 1;

    //reset the counter to start at new mark
    counter = end + 1;

    //Set the route according to the view
    if (view === 'index') {
        // Default route to all posts
        route = `/posts?start=${start}&end=${end}&user=null`;
    }
    else {
        route = `/posts?start=${start}&end=${end}&user=${view}`;
    }

    // Get the posts and add an element post
    fetch(route)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(element => {
                add_post(element);
            });
        })


}

// Redirects to the profile page of user
function load_profile(username) {

    // Redirect to profile page
    window.location.href = '/profile/' + username;

}

// Add a new post to the DOM
function add_post(content) {

    // invoke the get current user function
    get_current_user();

    //GET the username from userid
    username = get_username(content.user_id);
    username.then(username => {
        console.log(username);

        //Create new post
        const post = document.createElement('div');
        post.setAttribute('id', 'post');
        post.classList.add("border");
        post.classList.add("rounded");
        post.classList.add("mb-2");
        post.classList.add("p-2");

        // Add the profile pic
        const pic = new Image();
        pic.src = staticUrl + 'static/img/user.png';
        pic.setAttribute('id', 'pro_pic');
        post.appendChild(pic);


        // Add username of the post
        var post_user = document.createElement("h5");
        post_user.innerHTML = username;
        post_user.setAttribute('id', 'user_name');
        post_user.style.cursor = 'pointer';

        post.append(post_user);

        // Adding an event listener to detect a click on the username
        post_user.addEventListener('click', function () {
            load_profile(username);
        })

        // javascript to get the current user
        var current_user_id = localStorage.getItem('user_id');
        console.log(`The current user is ${current_user_id}`);
        // check if the current user is the owner of the post
        if (content.user_id == current_user_id) {
            // Add the delete icon
            const delete_icon = new Image();
            delete_icon.setAttribute('id', 'delete');
            delete_icon.style.cursor = 'pointer'
            delete_icon.src = staticUrl + 'static/img/delete.png';
            post.appendChild(delete_icon);

            // Add the edit icon
            const edit_icon = new Image();
            edit_icon.setAttribute('id', 'edit');
            edit_icon.style.cursor = 'pointer'
            edit_icon.src = staticUrl + 'static/img/edit.png';
            post.appendChild(edit_icon);

            // Adding an event listener to detect a click on the edit icon
            edit_icon.addEventListener('click', function () {

                edit_box = document.querySelector('dialog');
                edit_box.showModal();
                edit_text = document.querySelector('#edit_text');
                edit_text.value = content.text;
                edit_text.focus();

                // Add event listener to detect if user clicked outside the dialog
                edit_box.addEventListener("click", e => {
                    const dialogDimensions = edit_box.getBoundingClientRect()
                    if (
                        e.clientX < dialogDimensions.left ||
                        e.clientX > dialogDimensions.right ||
                        e.clientY < dialogDimensions.top ||
                        e.clientY > dialogDimensions.bottom
                    ) {
                        edit_box.close();
                    }

                })

                // edit_text.setSelectionRange(edit_text.value.length, edit_text.value.length);

                // Adding an event listener to detect a click on the save button
                // document.querySelector('#save_button').addEventListener('click', function() {
                //     fetch(`/edit/${content.id}`, {
                //         method: 'POST',
                //         headers: {
                //             'Content-Type': 'application/json'
                //         },
                //         body: JSON.stringify({
                //             text: edit_text.value
                //         })
                //     })
                //     .then(res => res.json())
                //     .then(response => {
                //         console.log(response);
                //         if (response.message == "edited"){
                //             post_text.innerHTML=edit_text.value;
                //             edit_box.close();
                //         }
                //     })

                // })



            })

            // Adding an event listener to detect a click on the delete icon
            delete_icon.addEventListener('click', function () {
                fetch(`/delete/${content.id}`)
                    .then(res => res.json())
                    .then(response => {
                        console.log(response);
                        if (response.message == "deleted") {
                            post.remove();
                        }
                    })
            })
        }







        // Add the content
        var post_text = document.createElement("span");
        post_text.innerHTML = content.text;
        post_text.setAttribute('id', 'user_text');
        post.append(post_text);

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
        createdDate.setAttribute('id', 'date');

        createdDate.innerHTML = `${formattedDateTime}`;
        post.appendChild(createdDate);

        // Add the heart
        const img = new Image();
        img.setAttribute('id', 'heart');

        // Create the count
        const count = document.createElement('div');
        count.setAttribute('id', 'count');

        fetch(`/checkLike/${content.id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.message == "likes") {
                    img.src = staticUrl + 'static/img/hearted.png';
                    count.innerHTML = data.count;

                }
                else {
                    img.src = staticUrl + 'static/img/heart.png';
                    count.innerHTML = data.count;
                }

            })

        post.appendChild(img);
        post.appendChild(count);




        img.addEventListener('click', function () {
            fetch(`/like/${content.id}`)
                .then(res => res.json())
                .then(response => {
                    console.log('Success:', response.message, response.count);
                    if (response.message === "liked") {
                        img.src = staticUrl + 'static/img/hearted.png';
                        count.innerHTML = response.count;
                    }
                    else {
                        img.src = staticUrl + 'static/img/heart.png';
                        count.innerHTML = response.count;
                    }

                })
                .catch(error => console.error('Error:', error));

        });


        // Add post to the DOM
        document.querySelector("#posts").append(post);
    })



}

// Get username
async function get_username(user_id) {
    console.log(user_id);

    const resposne = await fetch(`/username?user_id=${user_id}`);
    const data = await resposne.json();
    return data.username;
}

// Javascript function to get the current user from django session

function get_current_user() {
    fetch('/current_user')
        .then(response => response.json())
        .then(data => {
            console.log(`This is the current user: ${data}`);
            // save the current user to local storage
            localStorage.setItem('user_id', data);
        })
}


