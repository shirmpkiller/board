import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet'; //Helmet이 head태그에 들어가는 것을 관리해줌
import {Row,Col} from 'antd';
import PostCard from '../containers/PostCard';
import PostComment from '../containers/PostComment';

import { LOAD_POST_REQUEST } from '../reducers/post';


const Post =( id ) =>{

    const { singlePost } = useSelector(state => state.post);
 console.log(singlePost.User)
    return(
        <>
       
        <Row guttter={8}>
          <Col xs={{span:22, offset:1}} md={{span:18,offset:2}}>
            <PostCard  post={singlePost} />
            <div style ={{marginTop: 10}} >
            <PostComment/>
            </div>
          </Col>
        </Row>
      </>
    );
}

Post.getInitialProps = async (context) => {
  
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
      data: context.query.id,
    });
    return { id: parseInt(context.query.id, 10) };
  };
  
Post.propTypes = {
    id: PropTypes.number.isRequired,
  };

export default Post;