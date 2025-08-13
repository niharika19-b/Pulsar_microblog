import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import API from "../api/axios";
import TweetCard from "../components/TweetCard";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [info, setInfo] = useState(null);
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const p = await API.get(`/users/${username}`);
        setInfo(p.data);
      } catch (err) {
        console.error(err);
      }
      try {
        // backend search supports q; we request tweets by this username using the `from:` convention used in earlier code
        const t = await API.get(`/search/tweets?q=from:${username}&page=0&size=50`);
        const mapped = t.data.content.map(tw => ({
          ...tw,
          isAuthor: user && tw.authorUsername === user.username
        }));
        setTweets(mapped);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [username, user]);

  if (!info) return <div>Loading...</div>;

  return (
    <Row className="justify-content-center">
      <Col xs={12} md={8}>
        <Card className="mb-3">
          <Card.Body>
            <h4>@{info.username}</h4>
            <p>{info.bio || "No bio yet."}</p>
            <div>Followers: {info.followers} • Following: {info.following}</div>
            {user && user.username !== info.username && (
              <div className="mt-2">
                <Button onClick={async () => {
                  try {
                    await API.post(`/users/${info.id}/follow`);
                    // refresh profile counts
                    const p = await API.get(`/users/${username}`);
                    setInfo(p.data);
                  } catch (err) { console.error(err); }
                }}>Follow</Button>
                <Button variant="outline-secondary" className="ms-2" onClick={async () => {
                  try {
                    await API.delete(`/users/${info.id}/follow`);
                    const p = await API.get(`/users/${username}`);
                    setInfo(p.data);
                  } catch (err) { console.error(err); }
                }}>Unfollow</Button>
              </div>
            )}
          </Card.Body>
        </Card>

        <h5>Tweets</h5>
        {tweets.length === 0 && <p>No tweets yet.</p>}
        {tweets.map(t => <TweetCard key={t.id} tweet={t} onAction={async () => {
          // refresh tweets
          const t = await API.get(`/search/tweets?q=from:${username}&page=0&size=50`);
          setTweets(t.data.content.map(tw => ({ ...tw, isAuthor: user && tw.authorUsername === user.username })));
        }} />)}
      </Col>
    </Row>
  );
}
