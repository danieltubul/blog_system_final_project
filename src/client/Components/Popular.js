import React from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {Segment, Grid, Header, Image, Container, Divider} from "semantic-ui-react";

class Popular extends React.Component {
    constructor(props){
        super(props)
        this.state ={
            posts: [],
        }
    }


    componentDidMount() {
        axios.get('/popular').then(res => {
            this.setState({
                posts: res.data,
            });
        })

    }

    render() {
        return (
            <div>
                <Segment>
                <Divider section horizontal>
                    MOST POPULAR
                </Divider>
                {this.state.posts.map(function (post) {
                    return <Post
                        title={post.title}
                        content={post.content}
                        id={post.id}
                    />
                })}
                </Segment>
            </div>
        )
    }

}
function Post(props) {
    return (
            <Segment vertical padded>
            {/*<Header as="h1"><Link to={`/post/${props.id}`}>{props.title}</Link></Header>*/}
            <p>
                <Link to={`/post/${props.id}`} style={{ color: 'Black' }}>{props.title.length < 40 ? props.title : props.title.substring(0, 40) + "..."}</Link>
            </p>
                 </Segment>
    );
}


export default Popular;

