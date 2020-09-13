import _ from 'lodash';
import Popular from "../Components/Popular";
import Posts from "../Components/Posts";
import React, {Component, createRef} from "react";
import "semantic-ui-css/semantic.min.css";

import {Container, Grid, Ref, Sticky, Rail} from "semantic-ui-react";
import Recent from "../Components/Recent";



class HomePage extends React.Component {

    contextRef = createRef()

    render() {
        return (
            <Ref innerRef={this.contextRef}>
            <div className="App">
                <Grid celled padded={"false"}>
                    <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
                        <Grid.Column width={10} >
                            <Container style={styles.container}>

                                <Posts/>

                            </Container>
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Sticky context={this.contextRef}>
                                <br/>
                            <Container>
                        <Popular/>
                        <br/>
                        <Recent/> {/*make it the latest section */}
                            </Container>
                                <br/>
                                </Sticky>
                        </Grid.Column>
                        <Grid.Column width={1} style={{background: '#fafafa'}}>

                        </Grid.Column>
                </Grid>
            </div>
            </Ref>
        )
    }
}

const styles = {
    container: {
        paddingTop: "5vh",
        paddingBottom: "5vh",
        paddingRight: "5vw",
        paddingLeft: "5vw"
    }
}
export default HomePage;




