import React from 'react';
import axios from "axios";
import PostForm from "./PostForm";


class Edit extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            post: null,
            post_id: null,
            post_tags: [],
        };
    }

    componentDidMount() {
        let id = this.props.post_id;
        this.setState({
            post_id: id,

        })

        axios.get(`/posts/${id}`).then(res => {
            this.setState({
                post: res.data,
                post_tags: res.data.tags,
            });
        })

    }

    handleSubmit = (data) => { // create new endpoint
        const id = this.state.post_id
        axios.put(`/posts/${id}`, data).then(res => {
        })
        this.props.history.push('/')
    }

    render() {
        if(!this.state.post || !this.state.post_tags) return null
        return (
            <div style={{width: "100%"}}>
                <PostForm  handleSubmit={this.handleSubmit}
                           title={this.state.post.title}
                           content={this.state.post.content}
                           author={this.state.post.author}
                           post_tags={this.state.post_tags}
                           tags={this.props.tags}
                           buttonText={"Edit"}/>
            </div>
        )
    }
}

export default Edit;
