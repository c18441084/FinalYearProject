import { mdiNoteMultipleOutline } from "@mdi/js";
import { useState, useEffect } from "react";
import { Button, Modal, Dropdown, Image } from "react-bootstrap";
import settingsIcon from "../../SettingsIcon.png";
import { logout } from "../../firebaseconfig";
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

    function home(){
        window.location = "/FindMyOwner/home";
    }

    function myAccount(){
        window.location = "/FindMyOwner/account";
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

    return(
        <div>
            <title>FindMyOwner</title>
            <div id = "Title">
                <Image id="titleName" onClick={home} src={FindMyOwner} style={{marginLeft: "37%"}}></Image>
                <Dropdown id="SettingsButton">
                    <Dropdown.Toggle id="dropdown-button-dark-example1" variant="warning">
                        <img id="imageSettingsIcon" src={settingsIcon}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item href="#" onClick={myAccount}>My Account</Dropdown.Item>
                        <Dropdown.Divider></Dropdown.Divider>
                        <Dropdown.Item href="#" onClick={logout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <div style={{backgroundImage: `url(${Wallpaper})`}}>
                {dogWardenInfo.map(function(info){
                    return(
                        <div>
                            <div id="showCounilsInfo">
                                <div id= "county"><h3>{info.county}</h3><img src={info.image}></img></div>
                                <div id="DWSinfo">Number: {info.number}</div>
                                <div id="DWSinfo">Email: {info.email}</div>
                                <div id="DWSinfo">URL: <a href="#" onClick={() => councilPageRedirect(info.url)}>{info.url}</a></div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}