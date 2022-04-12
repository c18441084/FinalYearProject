import {Terms, Privacy }from '../Terms/Terms';
import { useState } from 'react';
import { logout } from "../../firebaseconfig";
import settingsIcon from "../../SettingsIcon.png";
import { Button, Modal, Dropdown } from "react-bootstrap";

function myAccount(){
    window.location = "/FindMyOwner/account";
}


export function Settings(){
    const [showTerms, setShowTerms] = useState(false);
    const [closeTerms, setCloseTerms] = useState(true);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [closePrivacy, setClosePrivacy] = useState(true);
    return(
        <>
            <Dropdown id="SettingsButton">
                <Dropdown.Toggle variant="warning" size="lg">
                    <img id="imageSettingsIcon" src={settingsIcon}></img>
                </Dropdown.Toggle>

                <Dropdown.Menu variant="dark">
                    <Dropdown.Item href="#" onClick={myAccount}>My Account</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item href="#" onClick={() => (setShowTerms(true), setCloseTerms(false))}>Terms &amp; Conditions</Dropdown.Item>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item href="#" onClick={() => (setShowPrivacy(true), setClosePrivacy(false))}>Privacy Policy</Dropdown.Item>
                    <Dropdown.Divider></Dropdown.Divider>
                    <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Modal show={showTerms} close={closeTerms}>
                <Modal.Header id="TermsModalTitle">
                    <Modal.Title>Terms &amp; Conditions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Terms />
                </Modal.Body>
                <Modal.Footer id="TermsModalFooter">
                    <Button variant="warning" onClick={() => (setShowTerms(false), setCloseTerms(true))}>Close</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showPrivacy} close={closePrivacy}>
                <Modal.Header id="TermsModalTitle">
                    <Modal.Title>Privacy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Privacy />
                </Modal.Body>
                <Modal.Footer id="TermsModalFooter">
                    <Button variant="warning" onClick={() => (setShowPrivacy(false), setClosePrivacy(true))}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}