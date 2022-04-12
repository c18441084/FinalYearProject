import { mdiNoteMultipleOutline } from "@mdi/js";
import { useState, useEffect } from "react";
import { Button, Modal, Dropdown, Image, Card, Form, Col, Row, Container } from "react-bootstrap";
import { Settings } from '../Settings/Settings'
import { logout } from "../../firebaseconfig";
import { mdiMicrosoftXboxControllerMenu } from '@mdi/js';
import Icon from '@mdi/react'
import "./DogWardenService.css";
import FindMyOwner from '../Login/loginPictures/FindMyOwner.png'
import carlowCrest from './CountyCrests/carlowCrest.png';
import cavanCrest from './CountyCrests/cavanCrest.png';
import clareCrest from './CountyCrests/clareCrest.png';
import corkCrest from './CountyCrests/corkCrest.png';
import donegalCrest from './CountyCrests/donegalCrest.png';
import dublinCrest from './CountyCrests/dublinCrest.webp';
import galwayCrest from './CountyCrests/galwayCrest.png';
import kerryCrest from './CountyCrests/kerryCrest.png';
import kildareCrest from './CountyCrests/kildareCrest.png';
import kilkennyCrest from './CountyCrests/kilkennyCrest.webp';
import laoisCrest from './CountyCrests/laoisCrest.png';
import leitrimCrest from './CountyCrests/leitrimCrest.png';
import longfordCrest from './CountyCrests/longfordCrest.png';
import louthCrest from './CountyCrests/louthCrest.png';
import mayoCrest from './CountyCrests/mayoCrest.png';
import meathCrest from './CountyCrests/meathCrest.png';
import monaghanCrest from './CountyCrests/monaghanCrest.png';
import offalyCrest from './CountyCrests/offalyCrest.png';
import roscommonCrest from './CountyCrests/roscommonCrest.png';
import sligoCrest from './CountyCrests/sligoCrest.png';
import tipperaryCrest from './CountyCrests/tipperaryCrest.png';
import waterfordCrest from './CountyCrests/waterfordCrest.png';
import westmeathCrest from './CountyCrests/westmeathCrest.png';
import wexfordCrest from './CountyCrests/wexfordCrest.png';
import wicklowCrest from './CountyCrests/wicklowCrest.png';
import Wallpaper from '../../Wallpaper.jpg';



export default function DogWardenService(){

    const [dogWardenInfo, setDogWardenInfo] = useState([]);
    const [dogWardenSearch, setDogWardenSearch] = useState([]);
    const [search, setSearch] = useState("");

    function home(){
        window.location = "/FindMyOwner/home";
    }

    function myAccount(){
        window.location = "/FindMyOwner/account";
    }

    function found(){
        window.location = "/FindMyOwner/found";
    }

    function lost(){
        window.location = "/FindMyOwner/lost";
    }

    function report(){
        window.location = "/FindMyOwner/report-pet-details";
    }

    useEffect(() => {
        setDogWardenInfo([
            {county: "Carlow   ", number: "059 917 0300", email: "community@carlowcoco.ie", url:"https://www.carlow.ie", image: carlowCrest},
            {county: "Cavan ", number: " 049 4378300", email: "info@cavancoco.ie", url:"http://www.cavancocouncil.ie", image: cavanCrest},
            {county: "Clare", number: "065 6821616", email: "customerservices@clarecoco.ie", url:"http://www.clarecoco.ie", image: clareCrest},
            {county: "Cork", number: "0214276891", email: "vets@corkcoco.ie", url:"http://www.corkcoco.ie", image: corkCrest},
            {county: "Donegal", number: "074 91 53900", email: "info@donegalcoco.ie", url: "https://www.donegalcoco.ie", image: donegalCrest},
            {county: "Dublin City", number: "01 222 2222", email: "customerservices@dublincity.ie", url: "http://www.dublincity.ie", image: dublinCrest},
            {county: "Dublin South", number: "01 4149000", email: "info@sdublincoco.ie", url: "http://www.sdcc.ie", image: dublinCrest},
            {county: "Galway", number: "091 509000", email: "customerservices@galwaycoco.ie", url: "http://www.galway.ie", image: galwayCrest},
            {county: "Kerry", number: "066 7183500", email: "info@kerrycoco.ie", url: "http://www.kerrycoco.ie", image: kerryCrest},
            {county: "Kildare", number: "045 980200", email: "customercare@kildarecoco.ie", url: "https://kildare.ie", image: kildareCrest},
            {county: "Kilkenny", number: "056 779 4000", email: "info@kilkennycoco.ie", url: "https://kilkennycoco.ie", image: kilkennyCrest},
            {county: "Laois", number: "057 86 64000", email: "laoisdogwarden@topmail.ie", url: "https://laois.ie", image: laoisCrest},
            {county: "Leitrim", number: "071 9620005", email: "customerservices@leitrimcoco.ie", url: "http://www.leitrimcoco.ie", image: leitrimCrest},
            {county: "Longford", number: "043 33 43300", email: "customerservices@longfordcoco.ie", url: "http://www.longfordcoco.ie", image: longfordCrest},
            {county: "Louth", number: "042-9335457", email: "info@louthcoco.ie", url: "http://www.louthcoco.ie", image: louthCrest},
            {county: "Mayo", number: "094 906 4000", email: "info@mayo.ie", url: "http://www.mayococo.ie", image: mayoCrest},
            {county: "Meath", number: "0469097000", email: "customerservice@meathcoco.ie", url: "http://www.meathcoco.ie", image: meathCrest},
            {county: "Monaghan", number: "04730592", email: "info@monaghancoco.ie", url: "http://www.monaghancoco.ie", image: monaghanCrest},
            {county: "Offaly", number: "057 9346800", email: "customerservices@offalycoco.ie", url: "http://www.offaly.ie/eng/", image: offalyCrest},
            {county: "Roscommon", number: "0906 637122", email: "bduffy@roscommoncoco.ie", url: "http://www.roscommoncoco.ie", image: roscommonCrest},
            {county: "Sligo", number: "071 9111 111", email: "info@sligococo.ie", url: "http://www.sligococo.ie", image: sligoCrest},
            {county: "Tipperary", number: "+353(0)818 06 5000", email: "customerservices@tipperarycoco.ie", url: "https://www.tipperarycoco.ie", image: tipperaryCrest},
            {county: "Westmeath", number: "0449332000", email: "secretar@westmeathcoco.ie", url: "http://www.westmeathcoco.ie", image:westmeathCrest},
            {county: "Waterford", number: "0818 102 020", email: "contact@waterfordcouncil.ie", url: "http://www.waterfordcoco.ie", image: waterfordCrest},
            {county: "Wexford", number: "053 9196000", email: "customerservice@wexfordcoco.ie", url: "http://www.wexford.ie", image: wexfordCrest},
            {county: "Wicklow", number: "0404 20100", email: "customerService@wicklowcoco.ie", url: "https://www.wicklow.ie", image: wicklowCrest}
        ])
    }, [])

    function councilPageRedirect(url){
        window.open(url);
    }

    useEffect(() => {
        
        setDogWardenSearch(dogWardenInfo?.filter((element) => element.county.toLowerCase().includes(search.toLowerCase())));
        
    }, [search])

    return(
        <div style={{height: "auto", minHeight: "100vh",backgroundImage: `url(${Wallpaper})`}}>
            <title>FindMyOwner</title>
            <div id = "Title">
                <Dropdown id="MenuButton">
                    <Dropdown.Toggle variant="warning" size="lg">
                        <Icon path={mdiMicrosoftXboxControllerMenu} size={1}></Icon>
                    </Dropdown.Toggle>
                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item onClick={home} >Home</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={found}>Found</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={lost}>Lost</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={report}>Report a Pet</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown> 
                <Image id="titleName" onClick={home} src={FindMyOwner} style={{marginLeft: "33%"}}></Image>
                <Settings />
            </div>
            
            <Row>
                <Col className="col-sm-11">
                    <Card id="DWSCard">
                        <Card.Header id="DWSCardHeader"><h2><b>Dog Warden Service</b></h2></Card.Header>
                        <Row>
                            <Col className="col-sm-4">
                                <Card id="DWSInfoCard" className="move">
                                    <Card.Header id="DWSInfoCardHeader">What?</Card.Header>
                                    <Card.Body id="DWSInfoCardBody">
                                        <Card.Text>
                                            The Dog Warden Service is a service provided by the each county's council.
                                            The local authorities are responsilble for the control of dogs since Control
                                            of Dogs Act 1986 was incorporated into the county councils.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-sm-4">
                                <Card id="DWSInfoCard">
                                    <Card.Header id="DWSInfoCardHeader">Why?</Card.Header>
                                    <Card.Body id="DWSInfoCardBody">
                                        <Card.Text>
                                            The Dog Warden Service have the power to request the name and address
                                            of anyone suspected of an offence under the Control of Dogs Act. Seize 
                                            and detain any dog. This service allows for pet dogs to be treated with
                                            animal friendly manner and without pet owners mistreating them or 
                                            neglecting the animal. If someone has come across a lost/stray dog,
                                            it is a legal requirement to report the dog to the Dog Warden Service in
                                            their county council.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col className="col-sm-4">
                                <Card id="DWSInfoCard" className="move2">
                                    <Card.Header id="DWSInfoCardHeader">Where?</Card.Header>
                                    <Card.Body id="DWSInfoCardBody">
                                        <Card.Text>
                                            Each county has there own Dog Warden Service. You can find and contact your 
                                            Dog Warden Service through your county council. Below are list of all counties
                                            in the Republic of Ireland containing the contact information needed to get in
                                            touch with their county council, along with a URL link to the county council
                                            website. There is also a search that can be used to search for your county
                                            council by typing in the county instead of scrolling through the list.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Form>
                            <Form.Control id="DWSSearchBar" type="text" placeholder="Search County..." onInput={(e) => setSearch(e.target.value)}/>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col className="col-sm-12">
                    {search.length > 0?
                        dogWardenSearch?.map(function(searching){
                            return(
                                <Card id="showCounilsInfo">
                                    <div id= "county"><h3>{searching.county}</h3><img src={searching.image} style={{float:"right"}}></img></div>
                                    <Card.Text id="DWSinfo"><b>Number: </b>{searching.number}</Card.Text>
                                    <Card.Text  id="DWSinfo"><b>Email: </b>{searching.email}</Card.Text >
                                    <Card.Text  id="DWSinfo"><b>URL: </b><a href="#" onClick={() => councilPageRedirect(searching.url)}>{searching.url}</a></Card.Text >
                                </Card>
                            )
                        })

                        : 
                        
                        dogWardenInfo.map(function(info){
                            return(
                                <Card id="showCounilsInfo">
                                    <div id= "county"><h3>{info.county}</h3><img src={info.image} style={{float:"right"}}></img></div>
                                    <Card.Text id="DWSinfo"><b>Number: </b>{info.number}</Card.Text>
                                    <Card.Text  id="DWSinfo"><b>Email: </b>{info.email}</Card.Text >
                                    <Card.Text  id="DWSinfo"><b>URL: </b><a href="#" onClick={() => councilPageRedirect(info.url)}>{info.url}</a></Card.Text >
                                </Card>
                            )
                        })
                    }
                </Col>
            </Row>
        </div>
    )
}