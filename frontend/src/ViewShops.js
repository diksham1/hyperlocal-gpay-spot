import axios from 'axios';
import React from 'react';
import { Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from "react-router-dom";
import './App.css';
import LocationInput from './Components/LocationInput';

let URL_ELASTIC_QUERY = "https://speedy-anthem-217710.an.r.appspot.com/api/query/elastic";
let URL_ELASTIC_BROWSE = "https://speedy-anthem-217710.an.r.appspot.com/api/browse/elastic";
let URL_SHOP = "https://speedy-anthem-217710.an.r.appspot.com/api/shop/";

class ViewShops extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      shops: [],
      searchQuery: "",
      queryRadius: "",
      latitude: null,
      longitude: null,
      showModal: true
    }
  }

search = async () => {

    //Empty query implies browse intent
    if (this.state.searchQuery === "") {
      this.updateBrowseResults();
      return;
    }

    // Use a default radius if no radius specified
    if (this.state.queryRadius === "") {
      this.setState({ queryRadius: "3km" });
    }

    const config = {
      method: 'get',
      url: URL_ELASTIC_QUERY,
      headers: {},
      params: {
        query: this.state.searchQuery,
        queryRadius: this.state.queryRadius,
        latitude: this.props.latitude,
        longitude: this.props.longitude
      }
    };

    const shopDetailsList = (await axios(config)).data;
    console.log(shopDetailsList);
    this.setState({
      "shops": shopDetailsList
    })

    console.log(this.state);
  }

  updateBrowseResults = async () => {

    // Use a default radius if no radius specified
    if (this.state.queryRadius === "") {
      this.setState({ queryRadius: "3km" });
    }

    const config = {
      method: 'get',
      url: URL_ELASTIC_BROWSE,
      headers: {},
      params: {
        queryRadius: this.state.queryRadius,
        latitude: this.props.latitude,
        longitude: this.props.longitude
      }
    };
    const shopDetailsList = (await axios(config)).data;

    console.log(shopDetailsList);
    this.setState({
      "shops": shopDetailsList
    })

    console.log(this.state);
  }


  onHide = () => {
    this.setState({
      showModal: false
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.latitude !== prevProps.latitude || (this.props.longitude !== prevProps.longitude)) {
      this.updateBrowseResults();
    }
  }

  componentDidMount() {
    if (this.props.latitude !== null || (this.props.longitude !== null)) {
      this.updateBrowseResults();
    }
  }

  render() {
    if (this.props.latitude == null || this.props.longitude == null) {
      return (
        <LocationInput setLocation={this.props.setLocation} show={this.state.showModal} onHide={this.onHide} />
      );
    } else {
      return (
        <Container className="mt-1 p-3">
          <Form onSubmit={(e) => { e.preventDefault(); this.search(); }}>
            <Form.Row className="align-items-center">
              <Col xs={7}>
                <Form.Control
                  placeholder="Search Nearby"
                  autoComplete="off"
                  onChange={e => {
                    this.setState({ searchQuery: e.target.value }, () => {
                      if (this.state.searchQuery === "") {
                        this.updateBrowseResults();
                      }
                    })
                  }}
                />
              </Col>
              <Col xs={3}>
                <Form.Control
                  placeholder="3km"
                  aria-label="distance"
                  onChange={e => this.setState({ queryRadius: e.target.value })}
                />
              </Col>
              <Col xs={2}>
                <Button variant="success" onClick={this.search}>
                  Go
                </Button>
              </Col>
            </Form.Row>
          </Form>

          <ListGroup variant="flush" className="mt-4">
            {
              this.state.shops.map(shop => {
                return (
                  <ListGroup.Item key={shop["shop"]["shopID"]}>
                    <Card className="mb-4" style={{ backgroundColor: "#E3F2FD" }}>
                      <Card.Body>
                        <Card.Title>{shop["shop"]["shopName"]}</Card.Title>
                        <Card.Text>
                          <b>Sold By: </b>{shop["merchant"]["merchantName"]}
                          <br />
                          <b>At: </b>{shop["shop"]["addressLine1"]}
                          <br />
                          <b>Reach out at: </b>{shop["merchant"]["merchantPhone"]}
                        </Card.Text>
                        <Button variant="info">
                          <Link
                            to={{
                              pathname: "/buyercatalog/" + shop["shop"]["shopID"],
                            }} className="btn btn-info box">
                            View Catalog
                          </Link>
                        </Button>
                      </Card.Body>
                    </Card>
                  </ListGroup.Item>
                )
              })
            }
          </ListGroup>
        </Container>
      );
    }
  }
}

export default ViewShops;