import {Jumbotron,Col,Alert,Container,Table,Button,Tooltip} from 'reactstrap';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {  Link } from 'react-router-dom';
import load from './../loading.png';

class CageById extends Component {
  constructor(props) {
    super(props);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.toggle = this.toggle.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = { cages: [],
      animals:[],
      showId: false,
      isLoading: false,
      error: null,
       tooltipOpen: false,
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
    this.cageList(this.props.match.params.cageId);
    this.getAnimalsByIdCage(this.props.match.params.cageId);
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
    const sortedData = this.state.animals.sort((a, b) => {
      
      switch (column) {
        case 'nom':
             return this.compare(a.nom.toUpperCase(),b.nom.toUpperCase());
        case 'race':
        return this.compare(a.race.toUpperCase(),b.race.toUpperCase());
      case 'nourritureParJour':
      return a.nourritureParJour - b.nourritureParJour;
      case 'dateDeNaissance':
      return a.dateDeNaissance - b.dateDeNaissance;
      case 'dateEntreeZoo':
      return a.dateEntreeZoo - b.dateEntreeZoo;
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
      animals: sortedData,
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


  cageList(cageId) {
    this.setState({isLoading: true});
    fetch('http://localhost:3000/cages/'+ cageId)
    .then(result=>result.json())
  .then(items=>this.setState({cages: items, isLoading: false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
   
  }

  getAnimalsByIdCage(cageId) {
    this.setState({isLoading: true});
    fetch('http://localhost:3000/animals?idCage='+ cageId)
    .then(result=>result.json())
  .then(items=>this.setState({animals: items,isLoading: false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
   
  }



    deleteById(itemId){
      let u = 'http://localhost:3000/Cages/'+itemId;

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.cageList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
   
    }

  render() {

let cageList =null;
let columnCage = null;
let animalList=null;
let columnAnimal= null;

if(this.state.isLoading){
  return(<div><img src={load} id="loading" alt="logo" />
  <h1>Chargement en cours...</h1></div>)
} 

if (this.state.error) {
  return (<Col> <Alert color="danger">
  {this.state.error.message}
</Alert>
<Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
</Col>);
}
let message = this.state.cages.map((item, i) => (    <div>
  <Jumbotron fluid >
    <Container fluid>
      <h6 className="display-4">"{item.nom}"</h6>
      <p className="lead">Les informations suivantes ne concernent que cette cage.</p>
    </Container>
  </Jumbotron>
</div>));
      if(this.state.showId){
        animalList = this.state.animals.map((item, i) => (

 
          <tr>
            <th scope="row">{item.id}</th>
            <th scope="row"><Link to={{ pathname: '/animals/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId} }}>{item.nom}</Link></th>
            <td>{item.race}</td>
            <td>{item.nourritureParJour}</td>
            <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
            <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
            <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
                 
            <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>   
          
      
          </tr>
          ));
          columnAnimal = (  <Table hover striped>
            <thead>
              <tr>
              <th onClick={this.onSort('id')}>Id <FontAwesomeIcon icon={this.setArrow('id')}/></th>
                <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                <th onClick={this.onSort('race')} >Race <FontAwesomeIcon icon={this.setArrow('race')}/></th>
                <th onClick={this.onSort('nourritureParJour')} >nourriture par jour (en Kg) <FontAwesomeIcon icon={this.setArrow('nourritureParJour')}/></th>
                <th onClick={this.onSort('dateDeNaissance')}>Date de naissance <FontAwesomeIcon icon={this.setArrow('dateDeNaissance')}/></th>
                <th onClick={this.onSort('dateEntreeZoo')}>Date d'entrée au zoo <FontAwesomeIcon icon={this.setArrow('dateEntreeZoo')}/></th>   
              <th></th>
              </tr>
          </thead>
          <tbody>
              {animalList}
             
          </tbody>
      </Table>);
         cageList = this.state.cages.map((item, i) => (
          <tr>
            <th scope="row">{item.id}</th>
            <th scope="row">{item.nom}</th>
            <td>{item.description}</td>
            <td>{item.taille}</td>
            <td>  <Link to={{ pathname: '/updateCage/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId} }}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
           {' '} <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>
          </tr>
          ));

          columnCage = ( 
          <div>{message}
          <Table hover striped>

            <thead>
              <tr>
              <th>Id</th>
                <th >Nom</th>
                <th>Description </th>
                <th>Taille</th>
                <th ><Button outline color="success" size="sm" id="add" onClick={() => this.onRadioBtnClick(false)} ><FontAwesomeIcon  icon={Icons.faListOl}/></Button>
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="add" toggle={this.toggle}>
              Masquer Id
            </Tooltip>{'  '}
               </th>
              </tr>
              
          </thead>
          <tbody>
              {cageList}
             
          </tbody>
    </Table>
    </div>);
      }else{
        animalList = this.state.animals.map((item, i) => (

 
          <tr>
            <th scope="row"><Link to={{ pathname: '/animals/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId} }}>{item.nom}</Link></th>
            <td >{item.race}</td>
            <td>{item.nourritureParJour}</td>
            <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
            <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
            <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId} }}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
                
                
            <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>   
          
      
          </tr>
          ));
      
          columnAnimal = (  <Table hover striped>
            <thead>
              <tr>
              
              <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                    <th onClick={this.onSort('race')} >Race <FontAwesomeIcon icon={this.setArrow('race')}/></th>
                    <th onClick={this.onSort('nourritureParJour')} >nourriture par jour (en Kg) <FontAwesomeIcon icon={this.setArrow('nourritureParJour')}/></th>
                    <th onClick={this.onSort('dateDeNaissance')}>Date de naissance <FontAwesomeIcon icon={this.setArrow('dateDeNaissance')}/></th>
                    <th onClick={this.onSort('dateEntreeZoo')}>Date d'entrée au zoo <FontAwesomeIcon icon={this.setArrow('dateEntreeZoo')}/></th>   

                          <th></th>

              </tr>
          </thead>
          <tbody>
              {animalList}
             
          </tbody>
      </Table>);
         cageList = this.state.cages.map((item, i) => (

 
          <tr>
            <th >{item.nom}</th>
            <td>{item.description}</td>
            <td>{item.taille}</td>
            <td>  <Link to={{ pathname: '/updateCage/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId} }}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
            {'  '}<Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>   
           
             
      
          </tr>
          
          ));

          columnCage = ( 
          <div>
            {message}
          <Table hover striped>
            <thead>
              <tr>
                <th >Nom</th>
                <th>Description </th>
                <th >Taille </th>
                <th ><Button outline color="success" size="sm" id="add" onClick={() => this.onRadioBtnClick(true)} ><FontAwesomeIcon  icon={Icons.faListOl}/></Button>
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="add" toggle={this.toggle}>
              Afficher Id
            </Tooltip>{'  '}
               </th>
              </tr>
          </thead>
          <tbody>
              {cageList}   
          </tbody>
    </Table>
    </div>);
    
      }
    return (
      <div>

        {columnCage}
     
  
     
      <p className="lead"><b><FontAwesomeIcon icon={Icons.faKiwiBird}/> Animaux presents dans cette cage.</b></p>

      {columnAnimal}
      </div>
    );
  }
}

export default  CageById;
