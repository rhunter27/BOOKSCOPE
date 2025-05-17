import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
// @ts-ignore
import { LinkContainer } from 'react-router-bootstrap';

const Navigation: React.FC = () => {
  const { data } = useQuery(GET_ME);
  const userData = data?.me || {};

  const logout = () => {
    Auth.logout();
    window.location.assign('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>Book Search Engine</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Search Books</Nav.Link>
            </LinkContainer>
            
            {Auth.loggedIn() && (
              <LinkContainer to="/saved">
                <Nav.Link>Saved Books</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          
          <Nav>
            {Auth.loggedIn() ? (
              <>
                <Navbar.Text className="me-2">
                  Welcome, {userData.username}!
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Nav.Link>Sign Up</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;