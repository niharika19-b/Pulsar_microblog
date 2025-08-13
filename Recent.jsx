import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";
import API from "../api/axios";
import TweetCard from "../components/TweetCard";

export default function Recent() {
  const [tweets, setTweets] = useState([]);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(false);

  const load = async () => {
    try {
      const res = await API.get(`/tweets/recent?page=${page}&size=10`);
      const content = res.data.content || [];
      setTweets(prev => [...prev, ...content]);
      setPage(p => p + 1);
      setLast(res.data.last);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load(); }, []); // initial

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8}>
        <h4>Recent Tweets</h4>
        {tweets.length === 0 && <p>No recent tweets.</p>}
        {tweets.map(t => <TweetCard key={t.id} tweet={t} onAction={async () => {
          // refresh list
          setTweets([]); setPage(0); setLast(false);
          await load();
        }} />)}
        {!last && <div className="d-grid"><Button onClick={load}>Load more</Button></div>}
      </Col>
    </Row>
  );
}
