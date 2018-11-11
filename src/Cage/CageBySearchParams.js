import {DropdownToggle,Alert,DropdownItem,DropdownMenu,ButtonDropdown, Col,Table,Button,Tooltip} from 'reactstrap';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {  Link } from 'react-router-dom';
import load from './../loading.png';

class Cage extends Component {
  constructor(props) {
    super(props);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.toggle = this.toggle.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = { cages: [],
      showId: false,
      error: null,
       tooltipOpen: false,
       isLoading: false,
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
    this.cageList(this.props.match.params.searchParam);
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
    const sortedData = this.state.cages.sort((a, b) => {
      
      switch (column) {
        case 'nom':
             return this.compare(a.nom.toUpperCase(),b.nom.toUpperCase());
        case 'description':
        return this.compare(a.description.toUpperCase(),b.description.toUpperCase());
      case 'taille':
      return a.taille - b.taille;
      
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
      cages: sortedData,
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


  cageList(searchParam) {
    this.setState({isLoading: true})
    fetch('http://localhost:3000/cages?'+searchParam)
    .then(result=>result.json())
  .then(items=>this.setState({cages: items,isLoading:false})).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));

  }

  getCageName(id){
    for (var i = 0; i < this.state.cages.length; i++) {
      if(this.state.cages[i].id === id){
        return this.state.cages[i].nom;
      }
    
  }
  }
    deleteById(itemId){
      let u = 'http://localhost:3000/Cages/'+itemId;

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.cageList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
        ;
    }
    deleteAll(){
      let u = 'http://localhost:3000/cages';

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.cageList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
        ;
    }
  render() {

let cageList =null;
let column = null;
if (this.state.error) {
  return (<Col> <Alert color="danger">
  {this.state.error.message}
</Alert>
<Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
</Col>);
}
if(this.state.isLoading){
  return(<div><img src={load} id="loading" alt="logo" />
  <h1>Chargement en cours...</h1></div>)
} 


      if(this.state.showId){
         cageList = this.state.cages.map((item, i) => (

          
          <tr>
            <th scope="row">{item.id}</th>
            <th><Link to={{ pathname: '/cages/'+item.id, state: { from: '/cages/'}}}>{item.nom} </Link></th>
            <td>{item.description}</td>
            <td>{item.taille}</td>
            <td>  <Link to={{ pathname: '/updateCage/'+item.id, state: { from: '/cages/'}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
           {' '} <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>
      
          </tr>
         
          ));
          if(cageList.length === 0){
            column =( <Col> <Alert color="primary">
             Aucune cage trouvée.
            </Alert>
            <Link to={{ pathname: '/searchCage', state: { from: '/cages'} }}><Button outline color="primary"><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher</Button></Link>
            {' '}        <Link to={{ pathname: '/cages', state: { from: '/searchCage'} }}><Button outline color="danger"><FontAwesomeIcon  icon={Icons.faTimesCircle}/> Annuler</Button></Link>
            </Col>);
           }else{
          column = ( <Table hover striped>
            <thead>
              
              <tr>
              <th onClick={this.onSort('id')}>Id <FontAwesomeIcon icon={this.setArrow('id')}/></th>
                <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                <th onClick={this.onSort('description')}>Description <FontAwesomeIcon icon={this.setArrow('description')}/></th>
                <th onClick={this.onSort('taille')}>Taille <FontAwesomeIcon icon={this.setArrow('taille')}/></th>
                <th >
                <Link to={{ pathname: '/cages', state: { from: '/searchCage'} }}> <Button outline color="warning" size="sm"><FontAwesomeIcon icon={Icons.faFilter}/> Effacer les filtres</Button></Link>
{'  '}
                  <Link to={{ pathname: '/addCage', state: { from: '/cages/'}}}><Button outline color="success" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="addAnimal" toggle={this.toggle}>
              Ajouter cage
            </Tooltip>{'  '}
           <Link to={{ pathname: '/searchCage', state: { from: '/cages/'}}}><Button outline color="primary" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
           {'  '}
        
             <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDrop}>
        <DropdownToggle direction="right" caret size="sm">
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
              {cageList}
             
          </tbody>
    </Table>);}
      }else{
         cageList = this.state.cages.map((item, i) => (

 
          <tr>
            <th > <Link to={{ pathname: '/cages/'+item.id, state: { from: '/cages/'}}}>{item.nom}</Link></th>
            <td>{item.description}</td>
            <td>{item.taille}</td>
            <td>  <Link to={{ pathname: '/updateCage/'+item.id, state: { from: '/cages/'}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
            {'  '}<Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>   
           
             
      
          </tr>
          ));
          if(cageList.length === 0){
            column =( <Col> <Alert color="primary">
             Aucune cage trouvée.
            </Alert>
            <Link to={{ pathname: '/searchCage', state: { from: '/cages'} }}><Button outline color="primary"><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher</Button></Link>
            {' '}        <Link to={{ pathname: '/cages', state: { from: '/searchCage'} }}><Button outline color="danger"><FontAwesomeIcon  icon={Icons.faTimesCircle}/> Annuler</Button></Link>
            </Col>);
           }else{
          column = ( <Table hover striped>
            <thead>
              <tr>
                <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                <th onClick={this.onSort('description')}>Description <FontAwesomeIcon icon={this.setArrow('description')}/></th>
                <th onClick={this.onSort('taille')}>Taille <FontAwesomeIcon icon={this.setArrow('taille')}/></th>
                <th >
                <Link to={{ pathname: '/cages', state: { from: '/searchCage'} }}> <Button outline color="warning" size="sm"><FontAwesomeIcon icon={Icons.faFilter}/> Effacer les filtres</Button></Link>
{'  '}
                  <Link to={{ pathname: '/addCage', state: { from: '/cages/'}}}><Button outline color="success" size="sm" id="add"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="add" toggle={this.toggle}>
              Ajouter cage
            </Tooltip>{'  '}
            <Link to={{ pathname: '/searchCage', state: { from: '/cages/'}}}><Button outline color="primary" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
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
              {cageList}
             
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

export default  Cage;
