import {DropdownToggle,Col,Alert,DropdownItem,DropdownMenu, ButtonDropdown,Table,Button,Tooltip} from 'reactstrap';
import React, { Component } from 'react';
import load from './../loading.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {  Link } from 'react-router-dom';

class Animal extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.clearFilter = this.clearFilter.bind(this);
    this.getCageName = this.getCageName.bind(this)
    this.getAnimalsByfilter = this.getAnimalsByfilter.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.state = {animals: [], cages: [], tooltipOpen: false, showId: false,  dropdownOpen: false,  sort: {
      column: null,
      direction: 'desc',filter: false
    },isLoading:false, error: null};

  }

  componentDidMount() {
    this.cageList();
    this.animalList();
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
        case 'dateDeNaissance':
        return this.compare(a.dateDeNaissance.toUpperCase(),b.dateDeNaissance.toUpperCase());
        case 'dateEntreeZoo':
        return this.compare(a.dateEntreeZoo.toUpperCase(),b.dateEntreeZoo.toUpperCase());
     
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
  onRadioBtnClick(showId) {
    this.setState({ showId });
  }
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
  clearFilter(){
    this.setState({
      filter: false
    });
    this.animalList();
  }

  animalList() {
    this.setState({isLoading: true});
    fetch('http://localhost:3000/animals')
    .then(result=>result.json())
  .then(items=>this.setState({animals: items,isLoading:false}))
  }

  getAnimalsByfilter(filter) {
    this.setState({isLoading: true});
    fetch('http://localhost:3000/animals?'+filter)
    .then(result=>result.json())
  .then(items=>this.setState({animals: items, filter:true,isLoading:false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
  
  }
  cageList() {
    this.setState({isLoading: true});
    fetch('http://localhost:3000/cages')
    .then(result=>result.json())
  .then(items=>this.setState({cages: items,isLoading: false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
  
  }
  getAnimal(id){
    this.setState({isLoading: true});

    let u = 'http://localhost:3000/animals/'+id;
    fetch(u)
    .then(result=>result.json(u))
  .then(items=>this.setState({animals: items,isLoading:false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
  
  this.animalList();
  }
  getCageName(id){
    for (var i = 0; i < this.state.cages.length; i++) {
      if(this.state.cages[i].id === id){
        return this.state.cages[i].nom;
      }
    
  }
  }
    deleteById(itemId){
      let u = 'http://localhost:3000/animals/'+itemId;

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.animalList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
        ;
    }
    deleteAll(){
      let u = 'http://localhost:3000/animals';

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.animalList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
        ;
    }
  render() {
    let animalList =null;
    let column = null;
    let buttonClearFilter=null;
    if (this.state.error) {
      return(<Col> <Alert color="danger">
      {this.state.error.message}
    </Alert>
    <Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
    </Col>);
    }
    if(this.state.isLoading){
        return(<div><img src={load} id="loading" alt="logo" />
        <h1>Chargement en cours...</h1></div>)
    }
    if(this.state.filter){
      buttonClearFilter = (<Button onClick={() => this.clearFilter()} color="warning" size="sm" id="stat"><FontAwesomeIcon icon={Icons.faFilter}/> Effacer les filtres</Button>);
    }
    if(this.state.showId){
      animalList = this.state.animals.map((item, i) => (

 
        <tr>
          <th scope="row">{item.id}</th>
          <th scope="row"><Link to={'/animals/'+item.id}>{item.nom}</Link></th>
          <td id="aa" onClick={() => {this.getAnimalsByfilter("race="+item.race)}}>{item.race}</td>
          <td>{item.nourritureParJour}</td>
          <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
          <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
          <td><Link to={'/cages/'+item.idCage}>{this.getCageName(item.idCage)}</Link></td>
          <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/animals'} }}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
             
          <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
          </td>   
        
    
        </tr>
        ));
    
        column = (  <Table hover striped>
          <thead>
            <tr>
            <th onClick={this.onSort('id')}>Id <FontAwesomeIcon icon={this.setArrow('id')}/></th>
              <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
              <th onClick={this.onSort('race')} >Race <FontAwesomeIcon icon={this.setArrow('race')}/></th>
              <th onClick={this.onSort('nourritureParJour')} >nourriture par jour (en Kg) <FontAwesomeIcon icon={this.setArrow('nourritureParJour')}/></th>
              <th onClick={this.onSort('dateDeNaissance')}>Date de naissance <FontAwesomeIcon icon={this.setArrow('dateDeNaissance')}/></th>
              <th onClick={this.onSort('dateEntreeZoo')}>Date d'entrée au zoo <FontAwesomeIcon icon={this.setArrow('dateEntreeZoo')}/></th>   
              <th>Cages</th>   
     
              
          <th >  {buttonClearFilter}{' '}
            <Link to={{ pathname: '/addAnimal', state: { from: '/animals'} }}><Button outline color="success" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
              <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="addAnimal" toggle={this.toggle}>
            Ajouter Animal 
          </Tooltip>{'  '}
          <Link to={{ pathname: '/searchAnimal', state: { from: '/animals/'}}}><Button outline color="primary" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
           {'  '}
                 <ButtonDropdown direction="right" isOpen={this.state.dropdownOpen} toggle={this.toggleDrop}>
            <DropdownToggle  caret size="sm">
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
            {animalList}
           
        </tbody>
    </Table>);
     }else{
animalList = this.state.animals.map((item, i) => (

 
    <tr>
      <th scope="row"><Link to={'/animals/'+item.id}>{item.nom}</Link></th>
      <td id="aa" onClick={() => {this.getAnimalsByfilter("race="+item.race)}}>{item.race}</td>
      <td>{item.nourritureParJour}</td>
      <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
      <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
      <td><Link to={'/cages/'+item.idCage}> {this.getCageName(item.idCage)}</Link></td>
      <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/animals'} }}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
   
      <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
      </td>   
    

    </tr>
    ));

    column = (  <Table hover striped>
      <thead>
        <tr>
        
        <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
              <th onClick={this.onSort('race')} >Race <FontAwesomeIcon icon={this.setArrow('race')}/></th>
              <th onClick={this.onSort('nourritureParJour')} >nourriture par jour (en Kg) <FontAwesomeIcon icon={this.setArrow('nourritureParJour')}/></th>
              <th onClick={this.onSort('dateDeNaissance')}>Date de naissance <FontAwesomeIcon icon={this.setArrow('dateDeNaissance')}/></th>
              <th onClick={this.onSort('dateEntreeZoo')}>Date d'entrée au zoo <FontAwesomeIcon icon={this.setArrow('dateEntreeZoo')}/></th>   
              <th>Cage</th>   
          

      <th >
      {buttonClearFilter}{' '}<Link to={{ pathname: '/addAnimal', state: { from: '/animals'} }}><Button outline color="success" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
          <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="addAnimal" toggle={this.toggle}>
        Ajouter Animal
      </Tooltip>{'  '}
      <Link to={{ pathname: '/searchAnimal', state: { from: '/animals/'}}}><Button outline color="primary" size="sm" id="addAnimal"><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
           {'  '}
             <ButtonDropdown direction="right" isOpen={this.state.dropdownOpen} toggle={this.toggleDrop}>
        <DropdownToggle  caret size="sm">
        <FontAwesomeIcon  icon={Icons.faEllipsisH}/>
        </DropdownToggle>
        <DropdownMenu>
        <DropdownItem onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer tous les éléments?')) this.deleteAll() } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> Tout supprimer</DropdownItem>
    <DropdownItem onClick={() => this.onRadioBtnClick(true)} ><FontAwesomeIcon icon={Icons.faListOl}/> Afficher id</DropdownItem>
  </DropdownMenu>
      </ButtonDropdown>
               </th>
      
        </tr>
    </thead>
    <tbody>
        {animalList}
       
    </tbody>
</Table>);
     }

    return (
      <div>
          {column}
      </div>
    );
  }
}

export default  Animal;
