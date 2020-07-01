import React, { useEffect, useCallback, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import Moment from 'react-moment';
import moment from 'moment';
import Link from 'next/link';
import { Avatar, Button, Card, Comment, Form, Icon, Input, List, Popover } from 'antd';

import {
    ADD_COMMENT_REQUEST,
  } from '../reducers/post';

const PostComment = () =>{
  ///  const [commentFormOpened, setCommentFormOpened] = useState(false);
    const [commentText, setCommentText] = useState('');
    const { me } = useSelector(state => state.user);
    const { commentAdded, isAddingComment, singlePost } = useSelector(state => state.post);
    const dispatch = useDispatch();
    console.log(singlePost.id)
      const onSubmitComment = useCallback((e) => {
        e.preventDefault();
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
    
      useEffect(() => {
        setCommentText('');
      }, [commentAdded === true]);
    
      const onChangeCommentText = useCallback((e) => {
        setCommentText(e.target.value);
      }, []);    

    return (
        <div>
            <>
                <Form onSubmit={onSubmitComment}>
                    <Input.TextArea rows={3} value={commentText} onChange={onChangeCommentText} />
                    <Button type="primary" htmlType="submit" loading={isAddingComment}>작성</Button>
                </Form>
                <List
                    header={`${singlePost.Comments ? singlePost.Comments.length : 0} 댓글`}
                    itemLayout="horizontal"
                    dataSource={singlePost.Comments || []}
                    renderItem={item => (
                    <li>
                        <Comment
                        author={item.User.nickname}
                        avatar={(
                            <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                            <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                            </Link>
                        )}
                        datetime=  {moment(moment()).isBefore(moment(item.createdAt).add(1,'days'),'date') ? moment(item.createdAt).format('hh:mm a') 
                      : moment(item.createdAt).format('YYYY-MM-DD')}
                   
                        content={item.content}
                        />
                    </li>
                    )}
                />
            </>
        </div>
    );
}

export default PostComment;