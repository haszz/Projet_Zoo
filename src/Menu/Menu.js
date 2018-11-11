import React, { Component } from 'react';
import logo from './../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {  Link } from 'react-router-dom';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

 class Menu extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/"><img src={logo} className="App-logo" alt="logo" /></NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                <FontAwesomeIcon icon={Icons.faKiwiBird}/> Animal
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem>

                  <Link to="/animals"><FontAwesomeIcon  icon={Icons.faListUl}/>  Afficher la liste des animaux </Link>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    
                  <Link to={{ pathname: '/addAnimal', state: { from: '/animals'} }}><FontAwesomeIcon  icon={Icons.faPlusCircle}/> Ajouter un animal</Link>
                   
                  </DropdownItem>
                  <DropdownItem>
                    
                    <Link to={{ pathname: '/searchAnimal', state: { from: '/animals'} }}><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher animal</Link>
                     
                    </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>    
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                <FontAwesomeIcon icon={Icons.faHome}/> Cage
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem>

                  <Link to="/cages"><FontAwesomeIcon  icon={Icons.faListUl}/> Afficher la liste des cages </Link>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    
                  <Link to={{ pathname: '/addCage', state: { from: '/cages'} }}> <FontAwesomeIcon  icon={Icons.faPlusCircle}/> Ajouter une cage</Link>
                   
                  </DropdownItem>
                  <DropdownItem>
                    
                    <Link to={{ pathname: '/searchCage', state: { from: '/cages'} }}><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher  cage</Link>
                     
                    </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>  
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                <FontAwesomeIcon icon={Icons.faLemon}/> Nourriture
                </DropdownToggle>
                <DropdownMenu >
                  <DropdownItem>

                  <Link to="/foods"><FontAwesomeIcon  icon={Icons.faListUl}/>  Afficher la liste des nourritures </Link>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    
                  <Link to={{ pathname: '/addFood', state: { from: '/foodss'} }}><FontAwesomeIcon  icon={Icons.faPlusCircle}/> Ajouter de la nourriture </Link>
                   
                  </DropdownItem>

                    <DropdownItem>
                    
                    <Link to={{ pathname: '/searchFood', state: { from: '/foods'} }}><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher nourriture</Link>
                     
                    </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>    
         
              <UncontrolledDropdown nav inNavbar direction="left" >
                <DropdownToggle nav caret>
                <FontAwesomeIcon icon={Icons.faUsers}/> Personnel
                </DropdownToggle>
                <DropdownMenu  >
                  <DropdownItem>

                  <Link to="/staffs"><FontAwesomeIcon  icon={Icons.faListUl}/> Afficher la liste du personnel </Link>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>
                    
                  <Link to={{ pathname: '/addStaff', state: { from: '/staffs'} }}> <FontAwesomeIcon  icon={Icons.faPlusCircle}/> Ajouter un personnel</Link>
                   
                  </DropdownItem>
                  <DropdownItem>
                    
                    <Link to={{ pathname: '/searchStaff', state: { from: '/staffs'} }}><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher personnel</Link>
                     
                    </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>  
            </Nav>
          </Collapse>
        </Navbar>


      </div>
    );
  }
}
export default  Menu;