import React, { useCallback, useEffect,useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { LOAD_SEARCH_POSTS_REQUEST } from '../reducers/post';
import PostCard from '../containers/PostCard';
import {Row,Col,Divider} from 'antd'
const Search = ({ keyword }) => {
  const dispatch = useDispatch();
  const countRef = useRef([]);

  const { mainPosts, hasMorePosts } = useSelector(state => state.post);

  const onScroll = useCallback(() => {
    if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if (hasMorePosts) {
        const lastId = mainPosts[mainPosts.length - 1].id;//스크롤 도중 새로운 게 등록될수있어서 offset대신 lastId를 넣어줌
        console.log(lastId);
        if (!countRef.current.includes(lastId)) {//한번 보낸 lastid는 다시 보내지 않게(같은 요청 반복 방지)
        dispatch({
          type: LOAD_SEARCH_POSTS_REQUEST,
          lastId: mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id,
          data: keyword,
        });
        countRef.current.push(lastId);//coutFef에 lastId를 기억해둔다
      }
    }
  }
  }, [hasMorePosts, mainPosts.length, keyword]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mainPosts.length, hasMorePosts, keyword]);

  return (
    <div>
          <div style= {{overflow:'hidden'}}>
       <Row gutter={8} >
            <Col xs={{span:22, offset:1}} md={{span:18,offset:2}} >
  <Divider orientation="left">{keyword}에 대한 검색결과</Divider>
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
    </div>
  );
};

Search.propTypes = {
    keyword: PropTypes.string.isRequired,
};

Search.getInitialProps = async (context) => {
  const { keyword } = context.query;
  context.store.dispatch({
    type: LOAD_SEARCH_POSTS_REQUEST,
    data: keyword,
  });
  return { keyword };
};

export default Search;
