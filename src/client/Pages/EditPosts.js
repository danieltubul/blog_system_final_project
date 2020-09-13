import React from 'react';
import axios from 'axios';
import {Link, Redirect} from 'react-router-dom'
import Edit from "../Components/Edit";
import {Button, Confirm} from "semantic-ui-react";


class EditPosts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: props.posts,
            mode: "cards",
            post_id: null,
            open: false,
        };
    }

    deletePost = () => {
        axios.delete(`/posts/${this.state.post_id}`).then(res => {
            const data = res.data;
            this.setState({
                posts: data,
                open: false,
            });
        })
    }


    changeMode = (id) =>
        this.setState({
            mode: 'edit',
            post_id: id,
        })

    open = (id) =>
        this.setState({
            open: true,
            post_id: id,
        })

    close = () => this.setState({open: false})

    render() {
        return(
            <div class="ui cards">
                {this.state.mode == 'cards' ?
                    this.state.posts.reverse().map((post) => {
                        return <Post
                            title={post.title}
                            content={post.content}
                            image={post.image}
                            author={post.author}
                            id={post.id}
                            deletePost={this.deletePost}
                            changeMode = {this.changeMode}
                            openWindow = {this.open}
                            close = {this.close}
                        />
                    })
                    :
                    <Edit tags={this.props.tags} history={this.props.history} post_id={this.state.post_id}/>
                }
                <Confirm open={this.state.open}
                         onCancel={this.close}
                         onConfirm={this.deletePost}/>
            </div>
        )
    }
}

function Post(props) {
    return (
        <div className="card">
            <div className="content">
                <div className="header">
                    <Link to={`/post/${props.id}`} className="post-title"> {props.title.substring(0,50)}</Link>
                </div>
                <div class="meta">
                    <small>  BY {props.author.toUpperCase()}</small>
                </div>
                <div class="description">
                    <p style={{ whiteSpace: 'pre-wrap' }}>
                        {props.content.replace(/(<([^>]+)>)/ig, '').substring(0,35)}
                    </p>
                </div>
            </div>
            <div className="extra content">
                <div className="ui two buttons">
                    <Button className="ui basic green button" onClick={()=> props.changeMode(props.id)}>Edit</Button>
                    <Button className="ui basic red button" onClick={() => props.openWindow(props.id)}>Delete</Button>
                </div>
            </div>
        </div>
    );
}

export default EditPosts;