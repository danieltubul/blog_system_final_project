import React, {useState} from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import {Form, Button, Label} from "semantic-ui-react";
import Select from 'react-select';


class PostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title || undefined,
            content: props.content || '',
            author: props.author || undefined,
            tags: props.tags || '',
            tags_selection: props.post_tags?  props.tags.filter((tag) => { return props.post_tags.map((t) => t.tag_id).includes(tag.value)}) : []
           ,
        };
        // this.handleContentChange = this.handleContentChange.bind(this)
        // this.handleTagsSelection = this.handleTagsSelection.bind(this);

    }


    handleTitleChange = (e) => {
        this.setState({
            title: e.target.value,
        })
    }
    handleContentChange = (e) => {
        this.setState(
            {content: e});
    }

    handleTagsSelection =(e) => {
        this.setState({
            tags_selection:  e ? e.map(x => x.value) : []
        })
    }


    handleSubmit = () => {
        debugger;
        this.props.handleSubmit(this.state)
    }

    componentDidMount() {
        // console.log(this.state.tags)
    }




    render() {
        const enable = this.state.title && this.state.content
        console.log(this.state.tags_selection)
        return (
            <Form>
                <Form.Field>
                    <Form.Input label="Title" type="text" value={this.state.title} placeholder="Post title goes here..."
                                size="54"
                                onChange={this.handleTitleChange}/>
                </Form.Field>
                <Form.Field>
                    <label>Content</label>
                    <ReactQuill
                        style={{height: 325}}
                        theme="snow"
                        onChange={this.handleContentChange}
                        value={this.state.content}
                        modules={PostForm.modules}
                        formats={PostForm.formats}
                        bounds={'.app'}
                        placeholder={this.props.placeholder}
                    />
                </Form.Field>
                <br/><br/>
                <Select
                    isMulti
                    name="Tags"
                    defaultValue={this.state.tags_selection}
                    options={this.props.tags}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={this.handleTagsSelection}
                />
                <br/><br/>
                <Button onClick={this.handleSubmit} content={this.props.buttonText} disabled={!enable} primary/>
            </Form>
        );
    }
}

export default PostForm;