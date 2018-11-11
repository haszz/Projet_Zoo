import {DropdownToggle,Alert,DropdownItem,DropdownMenu,ButtonDropdown, Col,Table,Button,Tooltip} from 'reactstrap';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {  Link } from 'react-router-dom';
import load from './../../loading.png';

class StaffBySearchParam extends Component {
  constructor(props) {
    super(props);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.toggle = this.toggle.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = { staffs: [],
      showId: false,
      isLoading: false,
       tooltipOpen: false,
       error: null,
       dropdownOpen: false,
        sort: {
      column: null,
      direction: 'desc',
    }};
  }

  onRadioBtnClick(showId) {
    this.setState({ showId });
  }

  componentDidMount() {
    this.staffList(this.props.match.params.searchParam);
  }
  
  compare(a,b){
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    // names must be equal
    return 0;
    
  }
  onSort = (column) => (e) => {
    const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
    const sortedData = this.state.staffs.sort((a, b) => {
      
      switch (column) {
        case 'prenom':
        return this.compare(a.prenom.toUpperCase(),b.prenom.toUpperCase());
        case 'nom':
             return this.compare(a.nom.toUpperCase(),b.nom.toUpperCase());
      case 'salaire':
      return a.salaire - b.salaire;
      
      case 'id':
      return a.id - b.id;
      
        default:
          break;
      }
     
    });
      
    if (direction === 'desc') {
      sortedData.reverse();
    }
    
    this.setState({
      staffs: sortedData,
      sort: {
        column,
        direction,
      }
    });
  };
  setArrow = (column) => {    
    if (this.state.sort.column === column) {
      if(this.state.sort.direction === 'asc'){
        return Icons.faSortDown;
      }
       if(this.state.sort.direction === 'desc'){
        return Icons.faSortUp;
      }
    }
    return Icons.faSort
  };

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }
  toggleDrop() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }


  staffList(params) {
      console.log(params)
    this.setState({isLoading: true})
    fetch('http://localhost:3000/staffs?'+params)
    .then(result=>result.json())
  .then(items=>this.setState({staffs: items,isLoading: false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. "+error) }));
  }


    deleteById(itemId){
      let u = 'http://localhost:3000/staffs/'+itemId;

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.staffList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));

    }
    deleteAll(){
      let u = 'http://localhost:3000/staffs';

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.staffList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));

    }
  render() {
    if (this.state.error) {
      return (<Col> <Alert color="danger">
      {this.state.error.message}
    </Alert>
    <Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
    </Col>);
    }
let staffList =null;
let column = null;
if(this.state.isLoading){
  return(<div><img src={load} id="loading" alt="logo" />
  <h1>Chargement en cours...</h1></div>)
} 

      if(this.state.showId){
         staffList = this.state.staffs.map((item, i) => (

          
          <tr>
            <th scope="row">{item.id}</th>
            <th>{item.nom} </th>
            <td>{item.prenom}</td>
            <td>{item.salaire}</td>
            <td>  <Link to={{ pathname: '/updateStaff/'+item.id, state: { from: '/staffs/'}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
           {' '} <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>
      
          </tr>
         
          ));
          if(staffList.length === 0){
            column =( <Col> <Alert color="primary">
             Aucun(e) employé(e) trouvé(e).
            </Alert>
            <Link to={{ pathname: '/searchStaff', state: { from: '/staffs'} }}><Button outline color="primary"><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher</Button></Link>
            {' '}        <Link to={{ pathname: '/staffs', state: { from: '/searchStaff'} }}><Button outline color="danger"><FontAwesomeIcon  icon={Icons.faTimesCircle}/> Annuler</Button></Link>
            </Col>);
           }else{
          column = ( <Table hover striped>
            <thead>
              
              <tr>
              <th onClick={this.onSort('id')}>Id <FontAwesomeIcon icon={this.setArrow('id')}/></th>
                <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                <th onClick={this.onSort('prenom')}>Prenom <FontAwesomeIcon icon={this.setArrow('prenom')}/></th>
                <th onClick={this.onSort('salaire')}>Salaire (en €) <FontAwesomeIcon icon={this.setArrow('salaire')}/></th>
                <th ><Link to={{ pathname: '/staffs', state: { from: '/searchStaff'} }}> <Button outline color="warning" size="sm"><FontAwesomeIcon icon={Icons.faFilter}/> Effacer les filtres</Button></Link>
{'  '}
                    <Link to={{ pathname: '/addStaff', state: { from: '/staffs/'}}}><Button outline color="success" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="addAnimal" toggle={this.toggle}>
              Ajouter personnel
            </Tooltip>{'  '}
            <Link to={{ pathname: '/searchStaff', state: { from: '/staffs/'}}}><Button outline color="primary" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
            {'  '}
             <ButtonDropdown  direction="right" isOpen={this.state.dropdownOpen} toggle={this.toggleDrop}>
        <DropdownToggle caret size="sm">
        <FontAwesomeIcon  icon={Icons.faEllipsisH}/>
        </DropdownToggle>
        <DropdownMenu left>
        <DropdownItem onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les éléments ?')) this.deleteAll() } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> Tout supprimer</DropdownItem>
    <DropdownItem onClick={() => this.onRadioBtnClick(false)} ><FontAwesomeIcon icon={Icons.faListOl}/> Masquer id</DropdownItem>
  </DropdownMenu>
      </ButtonDropdown>
               </th>
              </tr>
              
          </thead>
          <tbody>
              {staffList}
             
          </tbody>
    </Table>);}
      }else{
         staffList = this.state.staffs.map((item, i) => (

 
          <tr>
            <th >{item.nom}</th>
            <td>{item.prenom}</td>
            <td>{item.salaire}</td>
            <td>  <Link to={{ pathname: '/updateStaff/'+item.id, state: { from: '/Staffs/'}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
            {'  '}<Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>   
           
             
      
          </tr>
          ));
          if(staffList.length === 0){
            column =( <Col> <Alert color="primary">
             Aucun(e) employé(e) trouvé(e).
            </Alert>
            <Link to={{ pathname: '/searchStaff', state: { from: '/staffs'} }}><Button outline color="primary"><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher</Button></Link>
            {' '}        <Link to={{ pathname: '/staffs', state: { from: '/searchStaff'} }}><Button outline color="danger"><FontAwesomeIcon  icon={Icons.faTimesCircle}/> Annuler</Button></Link>
            </Col>);
           }else{
          column = ( <Table hover striped>
            <thead>
              <tr>
                <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                <th onClick={this.onSort('prenom')}>Prenom <FontAwesomeIcon icon={this.setArrow('prenom')}/></th>
                <th onClick={this.onSort('salaire')}>Salaire <FontAwesomeIcon icon={this.setArrow('salaire')}/></th>
                <th >
                <Link to={{ pathname: '/staffs', state: { from: '/searchStaff'} }}> <Button outline color="warning" size="sm"><FontAwesomeIcon icon={Icons.faFilter}/> Effacer les filtres</Button></Link>
{'  '}<Link to={{ pathname: '/addStaff', state: { from: '/staffs/'}}}><Button outline color="success" size="sm" id="add"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="add" toggle={this.toggle}>
              Ajouter personnel
            </Tooltip>{'  '}
            <Link to={{ pathname: '/searchStaff', state: { from: '/staffs/'}}}><Button outline color="primary" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
{'  '}
             <ButtonDropdown direction="right" isOpen={this.state.dropdownOpen} toggle={this.toggleDrop}>
        <DropdownToggle caret size="sm">
        <FontAwesomeIcon  icon={Icons.faEllipsisH}/>
        </DropdownToggle>
        <DropdownMenu left>
        <DropdownItem onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les éléments ?')) this.deleteAll() } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> Tout supprimer</DropdownItem>
    <DropdownItem onClick={() => this.onRadioBtnClick(true)} ><FontAwesomeIcon icon={Icons.faListOl}/> Afficher id</DropdownItem>
  </DropdownMenu>
      </ButtonDropdown>
               </th>
              </tr>
              
          </thead>
          <tbody>
              {staffList}
             
          </tbody>
    </Table>);
      }}
    return (
      <div>
           

        {column}

      </div>
    );
  }
}

export default  StaffBySearchParam;
