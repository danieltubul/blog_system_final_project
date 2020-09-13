import React from 'react';
import axios from 'axios';
import PostForm from "./PostForm";

class AddPost extends React.Component {

    handleSubmit = (data) => {
        // var sanitizeHtml = require('sanitize-html');
        // const cleanData = sanitizeHtml(data);            need to check how to do it!
        axios.post('/posts', data).then(res => {
            this.props.loadPosts()
            this.props.history.push('/')

        })
    }


    render() {
        if(!this.props.user) return null
        return (
            <div>
                    <PostForm handleSubmit={this.handleSubmit}
                              buttonText={"Create Post"}
                              author={this.props.user.username}
                              tags={this.props.tags}
                    />
            </div>
        );

    }
}

export default AddPost;