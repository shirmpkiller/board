import React,{useCallback,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {Helmet} from 'react-helmet'; //Helmet이 head태그에 들어가는 것을 관리해줌
import {Row,Col,Button,Card} from 'antd';
import PostComment from '../containers/PostComment';
import styled from 'styled-components';
import {REMOVE_POST_REQUEST } from '../reducers/post';
import Router from 'next/router';
import { LOAD_POST_REQUEST,REMOVE_POST_CHECK } from '../reducers/post';


const Post =( id ) =>{
const dispatch =useDispatch();
  const { me } = useSelector(state => state.user);
  const { singlePost,postRemoved } = useSelector(state => state.post);


  const NewButton = styled(Button)`
 :hover {color: rgb(255,0,0);
    border-color:rgb(255,0,0);}
`;

useEffect(() => {
  if (postRemoved) {
    alert('포스트가 삭제됐습니다. 자유게시판으로 이동합니다');
    dispatch({
      type: REMOVE_POST_CHECK
    })
    Router.push('/freeboard');
  }
}, [postRemoved]);

const onRemovePost = useCallback( (e) => {
  e.preventDefault();
  dispatch({
    type: REMOVE_POST_REQUEST,
    data: singlePost.id,
  });
});

const extraButton = <NewButton type="text" danger={true.toString()} onClick={onRemovePost}>삭제</NewButton>

 console.log(singlePost.User)
    return(
        <>
        <Row guttter={8}>
          <Col xs={{span:22, offset:1}} md={{span:18,offset:2}}>
          {me.id == singlePost.User.id ?  
         <Card style={{ marginTop: 16 }} type="inner" title={singlePost.title} extra={extraButton} >
            {singlePost.content}
        </Card>
        :
        <Card style={{ marginTop: 16 }} type="inner" title={singlePost.title} >
            {singlePost.content}
        </Card>
      }
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