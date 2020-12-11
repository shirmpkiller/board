import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import Moment from 'react-moment';
import moment from 'moment';
import Link from 'next/link';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover, Row, Col,Divider } from 'antd';
import { NewButton } from '../components/styles/userprofileStyle';
import RecommentList from './RecommentList';
import {
  ADD_COMMENT_REQUEST,
  REMOVE_COMMENT_REQUEST,
  ADD_RECOMMENT_REQUEST,
} from '../reducers/post';

const PostComment = () => {
  ///  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [recommentText, setRecommentText] = useState('');
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment, singlePost } = useSelector(state => state.post);
  const [onToggleId, setOnToggleId] = useState(0);
  const dispatch = useDispatch();

  const onToggleRecomment = (itemId) => () => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    //setRecommentFormOpened(prev => !prev);
    if(itemId == onToggleId){
      setOnToggleId(0);
    }else{
      setOnToggleId(itemId);
    }
    
  };
  const onSubmitComment = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: singlePost.id,
        content: commentText,
      },
    });
  }, [me && me.id, commentText]);

  const onSubmitRecomment = useCallback(() => {
    // console.log(onToggleId);
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: ADD_COMMENT_REQUEST,
      data: {
        postId: singlePost.id,
        content: recommentText,
        parentCommentId :onToggleId,//대댓글 클릭 > onToggleId = item.id(singlePost.Comments 각각의 id)이므로 
      },
    });
  }, [me && me.id, recommentText,onToggleId]);

  useEffect(() => {
    setCommentText('');
    setRecommentText('');
  }, [commentAdded === true]);

useEffect(()=> {
console.log(onToggleId);
},[onToggleId])
  const onChangeCommentText = useCallback((e) => {
    setCommentText(e.target.value);
  }, []);

  const onChangeRecommentText = useCallback((e) => {
    setRecommentText(e.target.value);
  }, []);

  const deleteCommentFunc = (commentId) => () => {
    console.log(commentId);
    return dispatch({
      type: REMOVE_COMMENT_REQUEST,
      data: commentId,
    });
  };
  const DividerStyle ={margin: '0px 0px'};
  return (
    <div>
      <>
        <Form onFinish={onSubmitComment}>
          <Input.TextArea rows={3} value={commentText} onChange={onChangeCommentText} />
          <Button style={{ marginTop: '4px' }} type="primary" htmlType="submit" loading={isAddingComment}>작성</Button>
        </Form>
        <List
          header={`${singlePost.Comments ? singlePost.Comments.length : 0} 댓글`}
          itemLayout="horizontal"
          dataSource={singlePost.Comments || []}

          renderItem={item => (
            <li>
               {item.parentCommentId ? null :
                  <Row gutter={8} >
                  <Col xs={{ span: 22 }}  sm={{ span: 22 }}>
                    <Comment
                      actions={[<span onClick={onToggleRecomment(item.id)}>대댓글</span>]}
                      author={item.User.nickname}
                      avatar={(
                        <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                          <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                        </Link>
                      )}
                      datetime={moment(moment()).isBefore(moment(item.createdAt).add(1, 'days'), 'date') ? moment(item.createdAt).format('hh:mm a')
                        : moment(item.createdAt).format('YYYY-MM-DD')}
  
                      content={item.content}
                    />
                  </Col>
                  <Col xs={{ span: 2 }} sm={{span: 1}}>
                    {(me.id == item.UserId) ?
                      <div style={{ float: 'right' }}> <NewButton type='link' danger='true' onClick={deleteCommentFunc(item.id)}>삭제</NewButton></div>
                      :
                      null
                    }
                  </Col>
                  <Col xs={{span: 24}} sm={{ span: 24 }} >
                  <RecommentList parentCommentId={item.id}/>
                  </Col>
                </Row>
                }
              
              {/* <RecommentList/> */}
              {(item.id == onToggleId) ?
                  <Form onFinish={onSubmitRecomment}>
                  <Input.TextArea rows={2} value={recommentText} onChange={onChangeRecommentText} />
                  <Button style={{ marginTop: '4px' }} type="primary" htmlType="submit" loading={isAddingComment}>작성</Button>
                </Form>
              :
              null
              }
            </li>
          )}
        />
      </>
    </div>
  );
}

export default PostComment;


