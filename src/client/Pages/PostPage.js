import React from "react";
import axios from "axios";
import {Container, Divider, Comment, Image, Grid, Header, Button, Form, Label} from "semantic-ui-react";
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';

class PostPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            post: [],
            comments: [],
            post_tags: [],
            post_id: '',
            comment: '',
            author: '',
            img_src: '',
        };
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            post_id: id,

        })
        axios.get(`/posts/${id}`).then(res => {
            this.setState({
                post: res.data,
                comments: res.data.comments,
                post_tags: res.data.tags,
            });
        })
    }

    handleCommentChange = (e) => {
        this.setState({
            comment: e.target.value,
        })
    }

    handleSubmit = () => {
        console.log("this is the author", this.props.user.username)
        debugger;
        let data = {
            post_id: this.state.post_id,
            comment: this.state.comment,
            username: this.props.user.username,
            img_src: this.props.user.img_src,
        }
        axios.post('/comments', data).then(res => {
            const new_comment = res.data;
            this.setState({
                comments: this.state.comments.concat(new_comment),
                comment: ''
            });
        })
    }

    onEnter = (e) => {
        if (e.key == 'Enter') {
            this.handleSubmit()
        }
    }

    render() {
        const enable = this.state.comment && true
        return (
            <div>
                <Grid celled padded={"false"}>
                    <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
                    <Grid.Column width={14} >
                        <Container style={styles.container}>
                            <h1 className="ui header">{this.state.post.title}</h1>
                            <Divider/>
                            <div className="content" dangerouslySetInnerHTML={{__html: this.state.post.content}}>
                            </div>
                            {this.state.post_tags.length > 0 && this.props.tags  ? this.state.post_tags.map( (tag) => {
                                    return <Tags
                                        tag_id={tag.tag_id}
                                        tags={this.props.tags}
                                    />
                                })
                                :
                                null
                            }

                            <Comment.Group minimal>
                                <Header as='h3' dividing>
                                    Comments
                                </Header>
                                {this.state.comments.length > 0 ? this.state.comments.map(function (comment) {
                                        return <Comments
                                            comment={comment.comment}
                                            author={comment.author}
                                            img_src={comment.img_src}
                                            published={moment(comment.published_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD[T]HH:mm:ss')}
                                        />
                                    })
                                    :
                                    <Header as='h4'>No comments yet</Header>
                                }
                            </Comment.Group>
                            {this.props.user?
                                <p>
                                    <Form reply>
                                        <Form.Field>
                                            <Form.Input type="text"  value={this.state.comment} placeholder="comment" size="54"
                                                   onChange={this.handleCommentChange}></Form.Input>
                                        </Form.Field>
                                        <Button content='Add Reply' disabled={!enable} labelPosition='left' icon='edit' onClick={this.handleSubmit} primary />
                                    </Form>
                                </p>
                                : null}
                        </Container>
                    </Grid.Column>
                    <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
                </Grid>
            </div>
        )
    }
}

function Comments(props) {
    return (
        <Comment>
            <Comment.Avatar as='a' src={props.img_src}/>
            <Comment.Content>
                <Comment.Author as='a'>{props.author}</Comment.Author>
                <Comment.Metadata>
                    <span><small><Moment fromNow style={{textTransform: 'uppercase'}}>{props.published}</Moment></small></span>
                </Comment.Metadata>
                <Comment.Text>{props.comment}</Comment.Text>
            </Comment.Content>
        </Comment>

    );
}


function Tags(props) {
    const results = props.tags.filter(obj => {
        return obj.value === props.tag_id
    })
        return (
            <Label as='a' tag color={"teal"}>
                {results[0].label}
            </Label>

        )
    // }
}

const styles = {
    container: {
        paddingTop: "5vh",
        paddingBottom: "5vh",
        paddingRight: "5vw",
        paddingLeft: "5vw"
    }
}
export default PostPage;



