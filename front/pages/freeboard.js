import React, {useState, useCallback } from 'react';
import { Button, List, Card, Icon, Input, Form, Row, Col, } from 'antd';
import {ArrowUpOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_POST_REQUEST, LOAD_MAIN_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';

const Freeboard =() => {
const dispatch = useDispatch();
const { me } = useSelector(state => state.user);
const { mainPosts } = useSelector(state => state.post);
const [postFormOpened, setPostFormOpened] = useState(false)
const [postTitle, setPostTitle] = useState("")
const [postContent, setPostContent] = useState("")
const [buttonText, setButtonText] = useState("글작성")

const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (!postTitle || !postTitle.trim()) {
      return alert('제목을 작성하세요.');
    }
    if (!postContent|| !postContent.trim()) {
        return alert('내용을 작성하세요.');
      }
    const formData = new FormData();
    formData.append('postTitle', postTitle);
    formData.append('postContent', postContent);
    for (var key of formData.entries()) {
      console.log(key[0] + ', ' + key[1]);
  }
    dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [postTitle, postContent]);

const onChangePostTitle = useCallback((e) => {
    setPostTitle(e.target.value);
  }, []);

  const onChangePostContent = useCallback((e) => {
    setPostContent(e.target.value);
  }, []);
const onTogglePost = useCallback(() => {
    if (!me) {
        return alert('로그인이 필요합니다.');
      }
    setPostFormOpened(prev => !prev);
    if(!postFormOpened)
    {
        setButtonText("접기")
    }else{
        setButtonText("글작성")
    }
   // console.log(postFormOpened)
  }, [postFormOpened]);

 return (
     <div style= {{marginTop: 10}}>
       <Row gutter={8} >
            <Col xs={{span:22, offset:1}} md={{span:18,offset:2}} >
               {postFormOpened ? 
                <div style={{marginBottom : 10}}> 
                    <Form encType="multipart/form-data" onSubmit={onSubmitForm}>
                        <div style= {{marginBottom:10}}>
                          <Input placeholder="제목을 작성하세요" value={postTitle} onChange={onChangePostTitle} />
                        </div>
                        <Input.TextArea rows={12} placeholder="본문을 작성하세요" value={postContent} onChange={onChangePostContent} />
                        <div style={{float :'left'}}>
                            <Button type="primary" onClick={onTogglePost}>
                            <ArrowUpOutlined />   {buttonText}
                            </Button>
                        </div>
                        <div style={{float : 'right'}}>
                            <Button type="primary" htmlType="submit">작성</Button>
                        </div>
                    </Form>
                </div>
           : 
             <div>
                 <Input placeholder="글을 작성하세요" disabled={true} style={{cursor: 'pointer'}}/>
                 <div style={{float: 'right'}}>
                    <Button type="primary" onClick={onTogglePost}>
                   {buttonText}
                    </Button>
                 </div>
                </div>
               }
               <div style={{clear:'both'}}></div>
                <div>
                  {mainPosts.map((c) => {
                    return (
                      <PostCard key={c.id} post={c} />
                    );
                  })}
                </div>
            </Col>
          </Row>
     
      </div>
 );
};
Freeboard.getInitialProps = async (context) => {
  context.store.dispatch({ //context의 키중에 store(리덕스 스토어)가 있는데 store안에는 dispatch,getstate(리덕스 스테이트를 가져올수있는)등이 있다
    type: LOAD_MAIN_POSTS_REQUEST,
  });
};


export default Freeboard;