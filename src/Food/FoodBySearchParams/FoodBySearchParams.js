import {DropdownToggle,Alert,DropdownItem,DropdownMenu,ButtonDropdown, Col,Table,Button,Tooltip} from 'reactstrap';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {  Link } from 'react-router-dom';
import load from './../../loading.png';

class FoodBySearchParams extends Component {
  constructor(props) {
    super(props);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.toggle = this.toggle.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);

    this.state = { foods: [],
        animals: [],
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
    this.foodList(this.props.match.params.searchParam);
    this.getAnimals();
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
    const sortedData = this.state.foods.sort((a, b) => {
      
      switch (column) {
        case 'nom':
             return this.compare(a.nom.toUpperCase(),b.nom.toUpperCase());
      case 'quantite':
      return a.quantiteNourriture - b.quantiteNourriture;
      
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
      foods: sortedData,
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


  foodList(search) {
    this.setState({isLoading: true})
    fetch('http://localhost:3000/foods?'+search)
    .then(result=>result.json())
  .then(items=>this.setState({foods: items,isLoading: false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. "+error) }));
  }
  getAnimals() {
    this.setState({isLoading: true})
    fetch('http://localhost:3000/animals')
    .then(result=>result.json())
  .then(items=>this.setState({animals: items,isLoading: false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. "+error) }));
  }
  getAnimalName(id){
    for (var i = 0; i < this.state.animals.length; i++) {
      if(this.state.animals[i].id === id){
        return this.state.animals[i].nom;
      }
    
  }
  }
    deleteById(itemId){
      let u = 'http://localhost:3000/foods/'+itemId;

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.foodList()
        ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));

    }
    deleteAll(){
      let u = 'http://localhost:3000/foods';

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
        this.foodList()
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
let foodList =null;
let column = null;
if(this.state.isLoading){
  return(<div><img src={load} id="loading" alt="logo" />
  <h1>Chargement en cours...</h1></div>)
} 

      if(this.state.showId){
         foodList = this.state.foods.map((item, i) => (

          
          <tr>
            <th scope="row">{item.id}</th>
            <th>{item.nom}</th>
            <td>{item.quantiteNourriture}</td>
            <td><Link to={{ pathname: '/animals/'+item.idAnimal, state: { from: '/foods/'}}}>{this.getAnimalName(item.idAnimal)}</Link></td>
            <td>  <Link to={{ pathname: '/updateFood/'+item.id, state: { from: '/foods/'}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
           {' '} <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>
      
          </tr>
         
          ));
          if(foodList.length === 0){
            column =( <Col> <Alert color="primary">
             Aucune nourriture trouvée.
            </Alert>
            <Link to={{ pathname: '/searchFood', state: { from: '/foods'} }}><Button outline color="primary"><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher</Button></Link>
            {' '}        <Link to={{ pathname: '/foods', state: { from: '/searchFood'} }}><Button outline color="danger"><FontAwesomeIcon  icon={Icons.faTimesCircle}/> Annuler</Button></Link>
            </Col>);
           }else{
          column = ( <Table hover striped>
            <thead>
              
              <tr>
              <th onClick={this.onSort('id')}>Id <FontAwesomeIcon icon={this.setArrow('id')}/></th>
                <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                <th onClick={this.onSort('quantite')}>Quantite (en Kg) <FontAwesomeIcon icon={this.setArrow('quantite')}/></th>
                <th >Animal</th>
                <th > <Link to={{ pathname: '/foods', state: { from: '/searchFood'} }}> <Button outline color="warning" size="sm"><FontAwesomeIcon icon={Icons.faFilter}/> Effacer les filtres</Button></Link>
{'  '}
                    <Link to={{ pathname: '/addFood', state: { from: '/foods/'}}}><Button outline color="success" size="sm" id="addFood"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="addFood" toggle={this.toggle}>
              Ajouter nourriture
            </Tooltip>{'  '}
            <Link to={{ pathname: '/searchFood', state: { from: '/foods/'}}}><Button outline color="primary" size="sm" ><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
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
              {foodList}
             
          </tbody>
    </Table>);}
      }else{
         foodList = this.state.foods.map((item, i) => (

 
          <tr>
            <th >{item.nom}</th>
            <td>{item.quantiteNourriture}</td>
            <td><Link to={{ pathname: '/animals/'+item.idAnimal, state: { from: '/foods/'}}}>{this.getAnimalName(item.idAnimal)}</Link></td>
            <td>  <Link to={{ pathname: '/updateFood/'+item.id, state: { from: '/foods/'}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>
            {'  '}<Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>   
           
             
      
          </tr>
          ));
          if(foodList.length === 0){
            column =( <Col> <Alert color="primary">
             Aucune nourriture trouvée.
            </Alert>
            <Link to={{ pathname: '/searchFood', state: { from: '/foods'} }}><Button outline color="primary"><FontAwesomeIcon  icon={Icons.faSearch}/> Rechercher</Button></Link>
            {' '}        <Link to={{ pathname: '/foods', state: { from: '/searchFood'} }}><Button outline color="danger"><FontAwesomeIcon  icon={Icons.faTimesCircle}/> Annuler</Button></Link>
            </Col>);
           }else{
          column = ( <Table hover striped>
            <thead>
              <tr>
                <th onClick={this.onSort('nom')}>Nom <FontAwesomeIcon icon={this.setArrow('nom')}/></th>
                <th onClick={this.onSort('quantite')}>Quantite (en Kg) <FontAwesomeIcon icon={this.setArrow('quantite')}/></th>
                <th>Animal </th>
                <th > <Link to={{ pathname: '/foods', state: { from: '/searchFood'} }}> <Button outline color="warning" size="sm"><FontAwesomeIcon icon={Icons.faFilter}/> Effacer les filtres</Button></Link>
{'  '}
                    <Link to={{ pathname: '/addFood', state: { from: '/Foods/'}}}><Button outline color="success" size="sm" id="addFood"><FontAwesomeIcon icon={Icons.faPlus}/></Button></Link> 
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="addFood" toggle={this.toggle}>
              Ajouter nourriture
            </Tooltip>{'  '}
            <Link to={{ pathname: '/searchFood', state: { from: '/foods/'}}}><Button outline color="primary" size="sm" ><FontAwesomeIcon icon={Icons.faSearch}/></Button></Link>
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
              {foodList}
             
          </tbody>
    </Table>);}
      }
    return (
      <div>
           

        {column}

      </div>
    );
  }
}

export default  FoodBySearchParams;