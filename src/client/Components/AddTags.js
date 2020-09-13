import React from 'react';
import axios from 'axios';
import {Button, Form, Header, Table, Icon, Confirm} from "semantic-ui-react";



class AddTags extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tag_name: '',
            tag_id: '',
            tags: [],
            open: false,
        };
    }

    componentDidMount() {
        axios.get('/tags').then(res => {
            this.setState({
                tags: res.data,
            });
        })
    }

    open = (id) =>
        this.setState({
            open: true,
            tag_id: id,
        })

    close = () => this.setState({open: false})

    addTag = () => {
        const data = {
            tag_name: this.state.tag_name,
        }
        axios.post('/tags', data).then(res => {
            const new_tag = res.data;
            this.setState({
                tags: this.state.tags.concat(new_tag),
                tag_name: ''
            });

            this.props.loadTags()
        })
    }

    deleteTag = (id) => {
        axios.delete(`/tag/${this.state.tag_id}`).then(res => {
            const data = res.data;
            this.setState({
                tags: data,
                open: false,
            });
        })
    }

    handleTagChange = (e) => {
        this.setState({
            tag_name: e.target.value,
        })
    }


    render() {
        if (!this.props.user) return null
        const enable = this.state.tag_name && true
        return (
            <div>
                <Form>
                    <Form.Field width={6}>
                        <Form.Input label='Tag Name' maxLength="40" placeholder='tag' value={this.state.tag_name}
                                    onChange={this.handleTagChange}/>
                    </Form.Field>
                    <Button type='Add Tag' disabled={!enable} onClick={this.addTag} primary>Add Tag</Button>
                </Form>
                <Header as='h3' dividing>
                    Tags
                </Header>
                <Table basic='very'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.tags.map((tag) => {
                            return <Tags
                                id={tag.value}
                                name={tag.label}
                                deleteTag={this.deleteTag}
                                openWindow={this.open}
                            />
                        })}
                    </Table.Body>
                </Table>
                <Confirm open={this.state.open}
                         onCancel={this.close}
                         onConfirm={this.deleteTag}/>
            </div>

        );

    }
}

function Tags(props) {
    return (
        <Table.Row>
            <Table.Cell>{props.id}</Table.Cell>
            <Table.Cell>{props.name}</Table.Cell>
            <Table.Cell><Icon name="delete" onClick={() => props.openWindow(props.id)}/> </Table.Cell>
        </Table.Row>
    );
}

export default AddTags;