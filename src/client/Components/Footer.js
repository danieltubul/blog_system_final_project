import React from 'react';
import {Segment, Container} from "semantic-ui-react";


class Footer extends React.Component {

    render() {
        return (
            <div>
                <Segment secondary as="footer" style={{background: '#fafafa'}}>
                    <Container textAlign="center">
                        <p>
                            Developed by Daniel Tubul
                        </p>
                        <a href="#root">Back to top</a>
                    </Container>
                </Segment>
            </div>
        );
    }
}

export default Footer;
