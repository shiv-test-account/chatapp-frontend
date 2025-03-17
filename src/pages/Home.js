import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Styles from "./Home.module.css";

function Home() {
  return (
    <Row className={Styles.row}>
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-cener col"
      >
        <div>
          <h1>Share the world with your friends</h1>
          <p>Chat App let's you connect with the world</p>
          <Link to="/chat">
            <Button variant="success">
              Get Started <i className="fas fa-comments home-message-icon"></i>
            </Button>
          </Link>
        </div>
      </Col>
      <Col md={6} className={`${Styles.home__bg} ${Styles.col}`}></Col>
    </Row>
  );
}

export default Home;
