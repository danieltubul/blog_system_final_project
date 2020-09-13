import React from 'react'
import {Grid, Tab} from 'semantic-ui-react'
import AddPost from "../Components/AddPost";
import AddTags from "../Components/AddTags";
import EditPosts from "./EditPosts";
import {Container} from "semantic-ui-react";
import axios from "axios";

class Manage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            posts: props.posts,
            tags: props.tags,
        }
    }

    panes = (props) =>

        [
            {menuItem: 'Add new post', render: () => <Tab.Pane><AddPost {...(props)}  /></Tab.Pane>},
            {menuItem: 'Edit/Delete posts', render: () => <Tab.Pane><EditPosts {...(props)} /></Tab.Pane>},
            {menuItem: 'Add/Delete Tags', render: () => <Tab.Pane><AddTags  {...(props)}/></Tab.Pane>},
        ]

    render () {
        if(this.props.user.role != 'ADMIN') {
            this.props.history.push('/login')
            return null
        }
        else return (
            <Grid celled padded={"false"}>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
                <Grid.Column width={14}>
                    <Container>
                        <Tab grid={{paneWidth: 13, tabWidth: 3}} menu={{fluid: true, vertical: true, tabular: true}}
                             panes={this.panes(this.props)}/>
                    </Container>
                </Grid.Column>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
            </Grid>
        )
    }
}



export default Manage;