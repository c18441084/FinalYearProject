import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithFacebook } from "../../firebaseconfig";
import { registerWithEmailAndPassword } from "../../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import { Card, Row, Col, Button, Form } from "react-bootstrap";

function Login() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] =  useState(true);
  const [user, loading, error] = useAuthState(auth);

  const history = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) history("/home");
  }, [user, loading]);

  function confirm(){
    if(password !== confirmPassword){
        alert("Passwords are not the same");
    }
    else{
        registerWithEmailAndPassword(name, email, password);
        alert("Account Created");
    }
  }
  return (
    <div id ="crossed" style={{backgroundColor: "lightblue", paddingBottom: "11%"}}>
      <Row>
        <Col className="col-sm-4" style={{marginTop: "10%"}}>
          <Card style={{borderRadius: "25px", padding: "3%"}}>
            <div style = {{boxShadow: "0 1.4rem 8rem rgb(0,0,0,.2)", borderRadius: "25px", padding:"2%"}}>
            <Card.Text>Help Bring Pets Home</Card.Text>
            <Card.Title>FindMyOwner</Card.Title>
            <Card.Text>Welcome to FindMyOwner! A website that will help you find or report a pet.</Card.Text>
            </div>
            <br></br>
            <Card.Body style = {{marginLeft: "5%", marginRight: "5%",boxShadow: "0 1.4rem 8rem rgb(0,0,0,.2)"}}>
              {login?<Button variant="primary" style={{marginLeft: "8%", marginRight: "30%"}} onClick = {() => setLogin(true)} >Login</Button>
              :<Button variant="primary" style={{marginLeft: "8%", marginRight: "30%"}} onClick = {() => setLogin(true)}>Login</Button>}
              <Button variant="primary" onClick = {() => setLogin(false)}>Register</Button>
              {login?
                <div style={{borderRadius: "25px"}}>
                  <Form>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                  </Form>
                  <br></br>
                  <Button onClick={() => signInWithEmailAndPassword(email, password)}>Submit</Button>
                  <Card.Text>OR</Card.Text>
                  <Button className="login__btn login__google" onClick={signInWithFacebook}>Login with Facebook</Button>
                </div>
              : <div style={{borderRadius: "25px"}}>
                  <Form>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="email" placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                  </Form>
                  <br></br>
                  <Button onClick={() => confirm()}>Submit</Button>
                </div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    
  );
}
export default Login;

{/*<div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          onClick={() => signInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={signInWithFacebook}>
          Login with Facebook
        </button>
        {/*<div>
          <Link to="/reset">Forgot Password</Link>
        </div>
        <div>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
  </div>*/}