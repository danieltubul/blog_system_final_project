import React from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {Container, Message, Segment, Grid, Form, Header, Button} from "semantic-ui-react";
import FacebookLogin from 'react-facebook-login';



class LoginPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = ({
            username: '',
            password: '',
            serverError: false,
            loading: false,
            errors: {},
        })
    }


    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
        })
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
        })
    }

    doLogin = () => {
        this.setState({
            loading: true,
            errors: {},
            serverError: false,
        })
        const errors = {};
        if (!this.state.username) {
            errors.username = 'Please enter a username'
        }
        if (!this.state.password) {
            errors.password = 'Please enter a password'
        }
        const url = "/login";
        const data = {
            username: this.state.username,
            password: this.state.password
        }
        this.setState({
            errors: errors,
        })
        if(!_.isEmpty(errors)) {
            this.setState({
                loading: false,
            })
            return
        }
        axios.post(url, data)
            .then((res) => {
                this.setState({
                    username: '',
                    password: '',
                });
                this.props.onLoginSuccess(res.data)
                this.props.history.push('/')

            })
            .catch((err) => {
                this.setState({
                    username: '',
                    password: '',
                    serverError: true,
                    loading: false,

                });
            });
    }

    onEnter = (e) => {
        if (e.key == 'Enter' && !_.isEmpty(!this.state.username) && !_.isEmpty(this.state.password)){
            this.doLogin()
        }
    }

    responseFacebook = (response) => {
        console.log(response)
        const facebook_data = {};
        if (response.accessToken) {
            facebook_data.username = response.name;
            facebook_data.email = response.email;
            facebook_data.img_src = response.picture.data.url;
            facebook_data.facebook = true;
            this.props.onLoginSuccess(facebook_data)
            this.props.history.push('/')
        }
    }


    render() {
        return (
            <Grid celled padded={"false"}>
                <Grid.Column width ={1} style={{background: '#fafafa'}}></Grid.Column>
                <Grid.Column width={14} >
                    <Container>
                        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                            <Grid.Column style={{ maxWidth: 450 }}>
                                <Header as='h2' textAlign='center'>
                                    Log-in to your account
                                </Header>
                                <Form size="large">
                                    <Segment>
                                        <Form.Field>
                                            <Form.Input fluid icon='user' iconPosition='left' placeholder="Username" onKeyDown={this.onEnter} value={this.state.username} onChange={this.handleUsernameChange}
                                                        error={this.state.errors.username && {content: this.state.errors.username}}/>
                                        </Form.Field>
                                        <Form.Field>
                                            <Form.Input type="password" fluid icon='lock' iconPosition='left' placeholder="Password" onKeyDown={this.onEnter} value={this.state.password} onChange={this.handlePasswordChange}
                                                        error={this.state.errors.password && {content: this.state.errors.password}}/>
                                            <small> <div align="right"><Link to="/forgotPassword">Forgot your password?</Link></div></small>
                                        </Form.Field>
                                        <Button color='blue' fluid size='large' onClick={this.doLogin}>Login</Button>
                                    </Segment>
                                </Form>

                                {this.state.loading ? <div><br/><div className="ui active centered inline loader"/></div> :
                                    <div>
                                        {this.state.serverError && <Message
                                            attached={"bottom"}
                                            error
                                            header='Failed to login'
                                            content='Looks like the username or password are wrong, please try again'
                                        />
                                        }
                                    </div>
                                }
                                <Message>
                                    New to us? <Link to="/register">Sign Up</Link> or<br/>
                                     <FacebookLogin
                                    appId="317188852949654"
                                    fields="name, email,picture"
                                    scope="public_profile,user_friends,email"
                                    cssClass="ui blue button"
                                    callback={this.responseFacebook}
                                    icon="fa fa-facebook"
                                    textButton = "&nbsp;&nbsp;Sign In with Facebook"
                                    />
                                </Message>
                            </Grid.Column>
                        </Grid>                    </Container>
                </Grid.Column>
                <Grid.Column width={1} style={{background: '#fafafa'}}></Grid.Column>
            </Grid>
        );
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
export default LoginPage;