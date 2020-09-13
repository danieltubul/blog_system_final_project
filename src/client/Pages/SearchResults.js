import React from 'react';
// import "../../Styles/post.css";
import {Link} from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';
import 'moment-timezone';
import {Container, Grid, Segment} from "semantic-ui-react";
import Popular from "../Components/Popular";
import Recent from "../Components/Recent";


class SearchResults extends React.Component {

    componentDidMount(props) {
        console.log("property_id", this.props.location.state.search_data);
    }

    render() {
        return(
            <Grid celled padded={"false"}>
                <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
                <Grid.Column width={10} >
                    <Container style={styles.container}>
                        <h1>Search Results</h1>

                            {this.props.location.state.search_data.map(function (post) {
                                return <Post
                                    title={post.title}
                                    content={post.content}
                                    image={post.image}
                                    published={moment(post.published_at, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD[T]HH:mm:ss')}
                                    author={post.author}
                                    id={post.id}
                                />
                            })}

                    </Container>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Container>
                        <Popular/>
                        <br/>
                    <Recent/>
                    </Container>
                </Grid.Column>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
            </Grid>
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
        paddingTop: "5vh",
        paddingBottom: "5vh",
        paddingRight: "5vw",
        paddingLeft: "5vw"
    }
}

export default SearchResults;

