import React,{useCallback,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {Row,Col,Button,Card} from 'antd';
import PostComment from '../../containers/PostComment';
import styled from 'styled-components';
import Router from 'next/router';
import { LOAD_POST_REQUEST,REMOVE_POST_CHECK,REMOVE_POST_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { useRouter } from 'next/router';
import {END} from 'redux-saga';
import wrapper from '../../store/configureStore';
import axios from 'axios';


const Post =( ) =>{
const dispatch =useDispatch();
  const { me } = useSelector(state => state.user);
  const { singlePost,postRemoved } = useSelector(state => state.post);
  const router = useRouter();
  const { id } = router.query;


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


const onRemovePost = useCallback( () => {
    return  dispatch({
    type: REMOVE_POST_REQUEST,
    data: singlePost.id,
  });
});

const extraButton = <NewButton type="text" danger={true.toString()} onClick={onRemovePost}>삭제</NewButton>
    return(
        <>
        <Row guttter={8}>
          <Col xs={{span:22, offset:1}} md={{span:18,offset:2}}>
          {me.id == singlePost.UserId ?  
         <Card style={{ marginTop: 16 }} type="inner" title={singlePost.title} extra={extraButton} >
           <div style={{marginBottom: '10px'}}>{singlePost.content}</div>
            <div style={{ position :'relative' }}>
               {singlePost.Images[0] ? 
                  singlePost.Images.map((v, i) => (
                    <div key={v.id} style={{ display: 'inline-block'}}>
                      <img src={`http://localhost:3065/${v.src}`} style={{ width: '200px',height:'150px',marginLeft:'4px', marginTop:'4px'  }} alt={v.src} />                     
                    </div>
                  )) : null}
            </div> 
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
export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({ 
    type: LOAD_POST_REQUEST,
    data: context.query.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});


export default Post;