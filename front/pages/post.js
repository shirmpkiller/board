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
 //console.log(singlePost)
    return(
        <>
        <Helmet /*head 태그를 만들어서 넣어줌 , 서버 사이드 렌더링까지 해줘야함*/
          title={`${singlePost.User.nickname}님의 글`}
          description={singlePost.content}
          meta={[{/*meta태그는 여러개 될수 있어서 배열 */
            name: 'description', content: singlePost.content,
          }, {
            property: 'og:title', content: `${singlePost.User.nickname}님의 게시글`, //og는 opengraph
          }, {
            property: 'og:description', content: singlePost.content,
          }, {
            property: 'og:url', content: `http://localhost:3000/post/${id}`,
          }]}
        />
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