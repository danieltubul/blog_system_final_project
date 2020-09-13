import React from 'react';
import Posts from './Posts'

function MainSection() {
    return (
        <div>
        <section className="posts">
            <br/><br/><br/>
            <label className="title"><h1>Posts</h1></label><br/>
            <div id="posts-root" className="posts-list">
                <Posts/>
            </div>
        </section>
        </div>
    );
}

export default MainSection;