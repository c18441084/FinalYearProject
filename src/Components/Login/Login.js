import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithFacebook, registerWithEmailAndPassword, sendPasswordResetEmail } from "../../firebaseconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import { Card, Row, Col, Button, Form, Modal } from "react-bootstrap";
import LoginBackground from './loginPictures/LoginBackground.png';
import FindMyOwner from './loginPictures/FindMyOwner.png';
import { FormDropdown } from "semantic-ui-react";

function Login() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPasswordEmail, setNewPasswordEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] =  useState(true);
  const [user, loading, error] = useAuthState(auth);
  const [showReset, setShowReset] = useState(false);
  const [closeReset, setCloseReset] = useState(true);

  // const history = useNavigate();
  // useEffect(() => {
  //   if (loading) {
  //     // maybe trigger a loading screen
  //     return;
  //   }
  //   if (user) history("/FindMyOwner/home");
  // }, [user, loading]);

  function checkLogin(){
    if(email === ""){
      alert("Please enter a email");
      document.getElementById("loginEmail").style.borderColor = "red";
      return;
    }
    else{
      document.getElementById("loginEmail").style.borderColor = "";
    }

    if(password === ""){
      alert("Please enter a password");
      document.getElementById("loginPassword").style.borderColor = "red";
      return;
    }
    else{
      document.getElementById("loginPassword").style.borderColor = "";
    }

    signInWithEmailAndPassword(email, password);
  }

  function forgotPassword(){
    if(newPasswordEmail === ""){
      alert("Please enter in your user's email");
    }
    else{
      sendPasswordResetEmail(newPasswordEmail);
    }
  }

  function register(){
    if(name === ""){
      alert("Please enter a name");
      document.getElementById("registerName").style.borderColor = "red";
      return;
    }
    else{
      document.getElementById("registerName").style.borderColor = "";
    }

    if(email === ""){
      alert("Please enter a email");
      document.getElementById("registerEmail").style.borderColor = "red";
      return;
    }
    else{
      document.getElementById("registerEmail").style.borderColor = "";
    }

    if(password === ""){
      alert("Please enter a password");
      document.getElementById("registerPassword").style.borderColor = "red";
      return;
    }
    else{
      document.getElementById("registerPassword").style.borderColor = "";
    }

    if(confirmPassword === ""){
      alert("Please confirm password");
      document.getElementById("registerConfirmPassword").style.borderColor = "red";
      return;
    }
    else{
      document.getElementById("registerConfirmPassword").style.borderColor = "";
    }

    if(password !== confirmPassword){
      alert("Passwords are not the same");
    }
    else{
      registerWithEmailAndPassword(name, email, password);
    }
  }

  return (
    <div id ="crossed" style={{backgroundImage:`url(${LoginBackground})`, backgroundColor:"lightblue"}}>
      <Row>
        <Col className="col-sm-3.5" style={{height: "100vh", backgroundColor: "orange"}}>
          <Card style={{marginTop: "3%", borderRadius: "25px", padding: "3%", backgroundColor: "lightblue"}}>
            <Card.Img src={FindMyOwner}></Card.Img> 
            <p>Help Bring Pets Home</p>
          </Card>
          <br></br>
          <Card style={{borderRadius: "25px", padding: "3%"}}>
            <div style = {{boxShadow: "0 1.4rem 8rem rgb(0,0,0,.2)", borderRadius: "25px", padding:"2%"}}>
            <Card.Text>Welcome to FindMyOwner! A website that will help you find or report a lost pet.</Card.Text>
            </div>
            <br></br>
            <Card.Body style = {{marginLeft: "5%", marginRight: "5%",boxShadow: "0 1.4rem 8rem rgb(0,0,0,.2)"}}>
              {login?<Button variant="primary" style={{marginLeft: "8%", marginRight: "30%"}} onClick = {() => setLogin(true)} >Login</Button>
              :<Button variant="primary" style={{marginLeft: "8%", marginRight: "30%"}} onClick = {() => setLogin(true)}>Login</Button>}
              <Button variant="primary" onClick = {() => setLogin(false)}>Register</Button>
              {login?<hr style={{marginLeft: "7%", border: "5px solid blue", borderRadius: "25px", width:"20%"}}/>:<hr style={{marginLeft: "55%", border: "5px solid blue", borderRadius: "25px", width:"28%"}}/>}
              {login?
                <div style={{borderRadius: "25px"}}>
                  <Form>
                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control id="loginEmail" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control id="loginPassword" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                      <Card.Text style={{cursor: "pointer"}} href="#" onClick={() => (setShowReset(true), setCloseReset(false))}>Forgot Password?</Card.Text>
                      <Modal show={showReset} close={closeReset}>
                        <Modal.Header>Reset Password<Button id="closeResetModal" onClick={() => (setShowReset(false), setCloseReset(true))}>X</Button></Modal.Header>
                        <Modal.Body>
                          <Form>
                            <Form.Label>Enter Account Email</Form.Label>
                            <Form.Control style={{marginBottom: "2%"}} id="resetEmail" type="email" placeholder="Enter email" value={newPasswordEmail} onChange={(e) => setNewPasswordEmail(e.target.value)}></Form.Control>
                          </Form>
                          <Button style={{float: "right"}} id="submitResetEmail" onClick={() => forgotPassword()}>Send Email</Button>
                        </Modal.Body>
                      </Modal>
                    </Form.Group>
                  </Form>
                  <br></br>
                  <Button onClick={() => checkLogin()}>Submit</Button>
                  <Card.Text>OR</Card.Text>
                  <Button className="login__btn login__google" onClick={signInWithFacebook}>Login with Facebook</Button>
                </div>
              : <div style={{borderRadius: "25px"}}>
                  <Form>
                    <Form.Group>
                      <Form.Label>Name</Form.Label>
                      <Form.Control id="registerName" type="email" placeholder="Enter Full Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Email</Form.Label>
                      <Form.Control id="registerEmail" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control id="registerPassword" type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control id="registerConfirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </Form.Group>
                  </Form>
                  <br></br>
                  <Button onClick={() => register()}>Submit</Button>
                </div>}
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-8" style={{textAlign: "center", height: "100vh"}}>
        </Col>
      </Row>
    </div>
    
  );
}
export default Login;