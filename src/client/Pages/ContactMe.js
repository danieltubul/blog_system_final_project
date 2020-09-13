import React from "react";
import {Container, Grid} from "semantic-ui-react";
import Popular from "../Components/Popular";

function ContactMe () {
    return (
        <div>
            <Grid celled padded={"false"}>
                <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
                <Grid.Column width={10} >
                    <Container style={styles.container}>
                        <h1>Contact me</h1>
                        <p>
                            This is the contact me page
                        </p>
                    </Container>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Container>
                        <Popular/>
                        <br/>
                        <Popular/> {/*make it the latest section */}
                    </Container>
                </Grid.Column>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
            </Grid>
        </div>
    )
}

const styles = {
    container: {
        paddingTop: "5vh",
        paddingBottom: "5vh",
        paddingRight: "5vw",
        paddingLeft: "5vw"
    }
}

export default ContactMe;

