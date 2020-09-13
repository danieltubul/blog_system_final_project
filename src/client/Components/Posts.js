import React from 'react';
import {Link} from 'react-router-dom';
import axios from "axios";
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import {Container, Grid, Header, Image, Segment} from "semantic-ui-react";


class Posts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            posts: [],
            comments:[],
        };
    }

    componentDidMount() {
        axios.get('/posts').then(res => {
            this.setState({
                posts: res.data.reverse(),
            });
        })
    }

    render() {
        return(
            <div>
                {this.state.posts.map( (post)=> {
            return <Post
                title={post.title}
                content={post.content}
                image={post.image}
                published={moment(post.published_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD[T]HH:mm:ss')}
                author={post.author.toUpperCase()}
                id={post.id}
            />})}
            </div>
        )
    }
}


 function Post(props) {
    return (
        <Segment vertical>
            <Grid stackable padded>
                    <h1><Link to={`/post/${props.id}`} style={{ color: 'Black' }}> {props.title.length < 42 ? props.title : props.title.substring(0, 42) + "..."}</Link></h1>
                    <Container style={{whiteSpace: 'pre-wrap'}}>
                        {props.content.replace(/<[^>]+>/g, '').substring(0,100)}
                    </Container>

                    <Container><br/>
                        <small style={{color: "#b6b6b6"}}>  <i className="clock outline icon"/>PUBLISHED </small> <small><Moment fromNow style={{textTransform: 'uppercase'}}>{props.published}</Moment></small> <small style={{color: "#b6b6b6"}}> BY</small> <small>{ props.author}</small>
                    </Container>
                    </Grid>
        </Segment>
    );
}

const styles = {
    container: {
        paddingTop: "10vh",
        paddingBottom: "10vh",
        paddingRight: "10vw",
        paddingLeft: "10vw"
    }
}

export default Posts;