import React, { useContext, useEffect, useState, useCallback } from "react";
import { Spinner, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import TweetComposer from "../components/TweetComposer";
import TweetCard from "../components/TweetCard";
import { AuthContext } from "../context/AuthContext";

export default function Feed() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const load = useCallback(async (reset = false) => {
    if (loading || last && !reset) return;
    setLoading(true);
    try {
      const p = reset ? 0 : page;
      const res = await API.get(`/tweets/feed?page=${p}&size=10`);
      const content = res.data.content || [];
      const mapped = content.map(t => ({
        ...t,
        isAuthor: t.canDelete || (user && t.authorUsername === user.username)
      }));
      setTweets(prev => reset ? mapped : [...prev, ...mapped]);
      setPage(p + 1);
      setLast(res.data.last);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, last, user]);

  useEffect(() => { load(true); /* initial load */ }, []); // eslint-disable-line

  const refresh = () => load(true);

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8}>
        <TweetComposer onTweetPosted={refresh} />
        {tweets.map(t => (
          <TweetCard key={t.id} tweet={t} onAction={refresh} />
        ))}
        {loading && <div className="text-center"><Spinner animation="border" /></div>}
        {!last && !loading && <div className="d-grid"><Button onClick={() => load(false)}>Load more</Button></div>}
      </Col>
    </Row>
  );
}
