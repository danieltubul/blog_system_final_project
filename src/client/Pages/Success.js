import React from 'react';
import axios from "axios";
import {Container} from "semantic-ui-react";
import {Link} from 'react-router-dom';

class Success extends React.Component {

    render() {
        return (

                <Container textAlign={"center"} text style={styles.container}>
                    Your password successfully updated. <br/> Go to<Link to='/login'> login </Link>

            </Container>
        )
    }
}

const styles = {
    container: {
        paddingTop: "20vh",
        paddingBottom: "20vh",
        paddingRight: "10vw",
        paddingLeft: "10vw"
    }
}

export default Success;