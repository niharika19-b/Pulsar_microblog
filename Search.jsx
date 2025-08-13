import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import API from "../api/axios";
import TweetCard from "../components/TweetCard";

export default function Search() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!q.trim()) { setResults([]); return; }
      try {
        const res = await API.get(`/search/tweets?q=${encodeURIComponent(q)}&page=0&size=50`);
        setResults(res.data.content || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8}>
        <Form>
          <Form.Control placeholder="Search tweets or #hashtag or from:username" value={q} onChange={(e) => setQ(e.target.value)} />
        </Form>
        <div className="mt-3">
          {results.length === 0 && <p>No results.</p>}
          {results.map(t => <TweetCard key={t.id} tweet={t} onAction={async () => {
            // no-op or re-run search
            const res = await API.get(`/search/tweets?q=${encodeURIComponent(q)}&page=0&size=50`);
            setResults(res.data.content || []);
          }} />)}
        </div>
      </Col>
    </Row>
  );
}
