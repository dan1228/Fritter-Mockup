import { getRandomInt, guidGenerator } from "./helpers.js";
import { displayPosts } from "./posts.js";
import { currentUser } from "./users.js";

const baseUrl = 'https://w5d1-ajax-crud-practice-default-rtdb.firebaseio.com/';
const ext = '.json';

export function loginUser(callback) {
    $.get({
        url: `${baseUrl}users${ext}`,
        success: (response) => {
            const $username = $("[name='username']").val();
            const allUsers = response.filter((user) => !!user);
            const user = allUsers.find(user => user.username === $username);

            if(user) {
                callback(user);
                getPosts(displayPosts);
                $(".newsfeed").css("display", "flex");
                $(".new-post").css("display", "grid");
                $(".login-section").hide(); //.show() ==> display: block

            } else {
                alert("User not found");
            }
        }

    })
}

export function getPosts(callback = console.log) {
    $.get({
     url: `${baseUrl}posts${ext}`,
     success: (res) => {
        let keys = Object.keys(res);
        let posts = keys.map(key => { 
             return res[key];
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
        callback(posts); // same as: console.log(posts);
    },
    error: (err) => {
        console.log(err)
    }
})
};

export function getUser(userId, callback = console.log, postId) {
    $.get({
        url: `${baseUrl}users/${userId}${ext}`,
        success: user => {
            callback(user, postId);
        },
        error: err => console.log(err)
    })
};

export function createPost(callback = console.log) {
    const newId = guidGenerator();
    const newPost = {
        [newId]: {
            body: $("#new-post-text").val(),
            date: new Date(),
            userId: currentUser.id,
            likes: getRandomInt(1, 100),
            comments: getRandomInt(1, 25),
            id: newId
        }
    };

    $.ajax({
        type: "PATCH",
        url: `${baseUrl}posts${ext}`,
        data: JSON.stringify(newPost),
        // contentType: "application/json",
        success: () => {
            getPosts(callback);
            $("#new-post-text").val("");
        },
        error: err => console.log(err)
    })
};

export function deletePost(postId) {
    $.ajax({
        type: "DELETE",
        url: `${baseUrl}posts/${postId}${ext}`,
        success: () => {
            getPosts(displayPosts)
        },
        error: err => console.log(err)
    })
};

export function updatePost(postId, editedText) {
    const editedPost = {
        body: editedText,
        date: new Date()
    }
    $.ajax({
        type: "PATCH",
        url: `${baseUrl}posts/${postId}${ext}`,
        data: JSON.stringify(editedPost),
        success: () => {
            getPosts(displayPosts);
            
        },
        error: err => console.log(err)
    })
}
