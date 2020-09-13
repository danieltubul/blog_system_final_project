import React from 'react';
import {Link} from 'react-router-dom'
import axios from "axios";
import {Redirect, withRouter} from 'react-router-dom';
import {Menu, Container, Input} from 'semantic-ui-react';


class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search_input: null,
            search_data: null,
        }

    }

    doLogout = () => {
        const url = "/logout";
        if(!this.props.user.facebook) {
            const user_id = {user_id: this.props.user.user_id}
            axios.post(url, user_id)
                .then((res) => {
                    this.props.onLogout()
                    this.props.history.push('/login')


                })
                .catch((err) => {
                    console.log("error")
                });
        }
        else {
            this.props.onLogout()
            this.props.history.push('/login')
        }

    }

    handelSearchChange = (e) => {
        this.setState({
            search_input: e.target.value,
        })
    }

    doSearch = () => {
        axios.get(`/search/${this.state.search_input}`).then(res => {
            this.setState({
                search_data: res.data,
                search_input: '',
            });
            console.log(res.data)
        })

    }

    onEnter = (e) => {
        if (e.key == 'Enter') {
            this.doSearch()
        }
    }

    RedirectToResult = () => {
        const data = this.state.search_data;
        this.setState({
            search_data: null,
        });
        return <Redirect to={{
            pathname: '/SearchResults',
            state: {search_data: data}
        }}/>

    }


    render() {
        return (
            <div>
                <Menu size={"tiny"} borderless inverted color="blue">
                    <Container>
                        <Menu.Item><Link to="/" style={{color: 'White'}}>Home</Link></Menu.Item>
                        <Menu.Item><Link to="/about" style={{color: 'White'}}>About</Link></Menu.Item>
                        <Menu.Item><Link to="/contact" style={{color: 'White'}}>Contact</Link></Menu.Item>

                        {this.props.user && this.props.user.role == 'ADMIN' ?
                            <Menu.Item>
                                <Link to="/manage" style={{color: 'White'}}>Manage</Link>
                            </Menu.Item> : null}
                        <Menu.Menu position='right'>
                            <Menu.Item>
                                <Input icon='search' size={"mini"} placeholder='Search...' value={this.state.search_input}
                                       onKeyDown={this.onEnter} onChange={this.handelSearchChange}/>
                                {this.state.search_data ?
                                    this.RedirectToResult()
                                    :
                                    null}
                            </Menu.Item>
                            {this.props.user ?
                                <Menu.Item> <Link onClick={this.doLogout}
                                                  style={{color: 'White'}}>Logout</Link></Menu.Item>
                                :
                                <Menu.Item><Link to="/login">Login</Link></Menu.Item>
                            }
                        </Menu.Menu>
                    </Container>
                </Menu>
            </div>

        );
    }
}

export default withRouter(Header);



