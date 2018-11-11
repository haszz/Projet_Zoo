import {Jumbotron,Col,Alert,Progress,Container,Table,Button,Tooltip} from 'reactstrap';
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as Icons from "@fortawesome/fontawesome-free-solid"
import {  Link } from 'react-router-dom';
import load from './../../loading.png';

class AnimalById extends Component {
  constructor(props) {
    super(props);
    this.toggleDrop = this.toggleDrop.bind(this);
    this.toggle = this.toggle.bind(this);
    this.deleteById = this.deleteById.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.getCageName = this.getCageName.bind(this)
    this.getFoodsByAnimalId = this.getFoodsByAnimalId.bind(this);
    this.animalList = this.animalList.bind(this);
    this.state = { animal: [],
      animals:[],
      cages: [],
      foods:[],
      isLoading:false,
      error: null,
      showId: false,
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
    this.cageList();
    this.animalList(this.props.match.params.animalId);
    this.getFoodsByAnimalId(this.props.match.params.animalId);

  }
  cageList() {
    this.setState({isLoading: true});
    fetch('http://localhost:3000/cages')
    .then(result=>result.json())
  .then(items=>this.setState({cages: items,isLoading: false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
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


  animalList(id) {
    this.setState({isLoading:true });
    fetch('http://localhost:3000/animals/'+ id)
    .then(result=>result.json())
  .then((items) => {
    this.setState({animal: items,isLoading:false });
    this.getAnimalsByIdCage(items[0].idCage);

  }).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
  }

  getAnimalsByIdCage(id) {
    this.setState({isLoading:true });

    fetch('http://localhost:3000/animals?idCage='+ id)
    .then(result=>result.json())
  .then(items=>this.setState({animals: items,isLoading:false}))
  }
  getFoodsByAnimalId(id) {
    this.setState({isLoading:true });
    fetch('http://localhost:3000/foods?idAnimal='+ id)
    .then(result=>result.json())
  .then(items=>this.setState({foods: items,isLoading:false}))
  .catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
  }



    deleteById(itemId){
      let u = 'http://localhost:3000/animals/'+itemId;

       fetch(u, {
        method: 'delete'
      })
      .then(()=>
      this.getFoodsByAnimalId(this.props.match.params.animalId)
      ).catch(error => this.setState({ error: new Error("Communication avec la base de données interrompue. : "+error) }));
    }
 
    getCageName(id){
      for (var i = 0; i < this.state.cages.length; i++) {
        if(this.state.cages[i].id === id){
          return this.state.cages[i].nom;
        }
      
    }
  }

  getRatioConso(quantity){
    return Math.round((this.state.animal[0].nourritureParJour/quantity)*100);
  }
  getJourConso(quantity){
    return Math.round((quantity/this.state.animal[0].nourritureParJour));
  }
  render() {
    if (this.state.error) {
      return (<Col> <Alert color="danger">
      {this.state.error.message}
    </Alert>
    <Button outline color="primary" onClick={() => this.setState({ error: null})}><FontAwesomeIcon  icon={Icons.faArrowLeft}/> Retour</Button>
    </Col>);
    }
let animal =null;
let animalColumn = null;
let animalsList=null;
let animalsColumn= null;

if(this.state.isLoading){
  return(<div><img src={load} id="loading" alt="logo" />
  <h1>Chargement en cours...</h1></div>)
} 

let foodStat = this.state.foods.map((item,i) =>(<div>
  <br/>
  <h6>{item.nom}</h6>
  <div className="text-center"> Quantité {item.nom}</div>
  <Progress multi>
    <Progress color="success"  bar value={item.quantiteNourriture}>{item.quantiteNourriture} Kg</Progress>
  </Progress>
  <div className="text-center">Ratio de consommation par jour selon stock actuel (%)</div>
  <Progress multi>
    <Progress color="warning" bar striped value={this.getRatioConso(item.quantiteNourriture)}>{this.getRatioConso(item.quantiteNourriture)}</Progress>

  </Progress>
  <div className="text-center">Jours de nourriture restant</div>
  <Progress multi>
    <Progress color="infog"  bar striped value={this.getJourConso(item.quantiteNourriture)}>{this.getJourConso(item.quantiteNourriture)}</Progress>

  </Progress>
</div>
));
console.log(foodStat)
if(foodStat.length === 0){
  foodStat = (<p>Aucune nourriture attribuée.</p>)
}
let message = this.state.animal.map((item, i) => (  
  
    <div>
  <Jumbotron fluid >
    <Container fluid>
      <h6 className="display-4">{item.nom}</h6>
      <p className="lead">Les informations suivantes ne concernent que cet animal.</p>
    </Container>
  </Jumbotron>
</div>));
      if(this.state.showId){
                  animalsList = this.state.animals.map((item, i) => (

                      (item.id != this.props.match.params.animalId) ?
                      
                    <tr>
                      <th scope="row">{item.id}</th>
                      <th scope="row"><a href={'/animals/'+item.id}>{item.nom}</a></th>
                      <td>{item.race}</td>
                      <td>{item.nourritureParJour}</td>
                      <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
                      <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
                      <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
                        
                      <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
                      </td>   
                    
                
                    </tr> :
                   null
                    ));
                    if(animalsList.length === 1){
                      animalsColumn = <h6>Aucun animal.</h6>
                    }else{
                    animalsColumn = (  <Table hover striped>
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
                        {animalsList}
                      
                    </tbody>
                </Table>);
                    }
                  animal = this.state.animal.map((item, i) => (
                    <tr>
                        <th scope="row">{item.id}</th>
                      <th scope="row">{item.nom}</th>
                      <td>{item.race}</td>
                      <td>{item.nourritureParJour}</td>
                      <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
                      <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
                      <td><Link to={'/cages/'+item.idCage}> {this.getCageName(item.idCage)}</Link></td>

                      <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId}}}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
                         
                      <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
                      </td>  
                    </tr>
                    ));

                    animalColumn = ( 
                    <div>
                    <Table hover striped>

                      <thead>
                        <tr>
                        <th>Id</th>
                          <th >Nom</th>
                          <th>race </th>
                          <th>Nourriture (en Kg)</th>
                          <th>Date de Naissance</th>
                          <th>Date d'entree zoo</th>
                          <th>Cage</th>
                          <th ><Button outline color="success" size="sm" id="add" onClick={() => this.onRadioBtnClick(false)} ><FontAwesomeIcon  icon={Icons.faListOl}/></Button>
                          <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="add" toggle={this.toggle}>
                        Masquer Id
                      </Tooltip>{'  '}
                        </th>
                        </tr>
                        
                    </thead>
                    <tbody>
                        {animal}
                      
                    </tbody>
              </Table>
              </div>);
      }else{
            animalsList = this.state.animals.map((item, i) => (

              (item.id != this.props.match.params.animalId) ?

              <tr>
                <th scope="row"><a href={'/animals/'+item.id}>{item.nom}</a></th>
                <td >{item.race}</td>
                <td>{item.nourritureParJour}</td>
                <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
                <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
                <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId} }}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
                  
                <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
                </td>   
              
          
              </tr>
              :
              null
              ));
          
              if(animalsList.length === 1){
                animalsColumn = <h6>Aucun animal.</h6>
              }else{
              animalsColumn = (  <Table hover striped>
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

              {animalsList}
             
          </tbody>
      </Table>);
              }
         animal = this.state.animal.map((item, i) => (

 
          <tr>
            
            <th scope="row">{item.nom}</th>
            <td >{item.race}</td>
            <td>{item.nourritureParJour}</td>
            <td>{new Date(item.dateDeNaissance).toLocaleDateString()}</td>
            <td>{new Date(item.dateEntreeZoo).toLocaleDateString()}</td>
            <td><Link to={'/cages/'+item.idCage}> {this.getCageName(item.idCage)}</Link></td>
            <td>  <Link to={{ pathname: '/updateAnimal/'+item.id, state: { from: '/cages/'+this.props.match.params.cageId} }}>    <Button outline color="primary" size="sm" id="modify"><FontAwesomeIcon icon={Icons.faPencilAlt}/></Button></Link>{' '}
                
            <Button id="supress" outline color="danger" size="sm" onClick={() => { if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) this.deleteById(item.id) } } ><FontAwesomeIcon icon={Icons.faTrashAlt}/> </Button>
            </td>   
          
       
           
             
      
          </tr>
          
          ));

          animalColumn = ( 
          <div>
          
          <Table hover striped>
            <thead>
              <tr>
              <th >Nom</th>
                    <th >Race</th>
                    <th>nourriture par jour (en Kg)</th>
                    <th onClick={this.onSort('dateDeNaissance')}>Date de naissance</th>
                    <th >Date d'entrée au zoo</th>   
                    <th>Cage</th>
                    <th ><Button outline color="success" size="sm" id="add" onClick={() => this.onRadioBtnClick(true)} ><FontAwesomeIcon  icon={Icons.faListOl}/></Button>
                <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="add" toggle={this.toggle}>
              Afficher Id
            </Tooltip>{'  '}
               </th>

              </tr>
          </thead>
          <tbody>
              {animal}   
          </tbody>
    </Table>
    </div>);
    
      }
    return (
      <div>
  {message}
        {animalColumn}
     
        <br/>
        <p className="lead"><FontAwesomeIcon icon={Icons.faLemon}/> <b> Nourriture</b></p>
        <br/>
        <Container>     {foodStat}</Container>
<br/>
<br/>
      <p className="lead"><FontAwesomeIcon icon={Icons.faKiwiBird}/><b> Animaux presents dans la meme cage.</b></p>
      <br/>
      {animalsColumn}
      </div>
    );
  }
}

export default  AnimalById;
